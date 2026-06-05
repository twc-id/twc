import Breadcrumb from '@components/Breadcrumb'
import Button from '@components/buttons/Button'
import Container from '@components/Container'
import Icons from '@components/Icon'
import ImageZoom from '@components/ImageZoom/ImageZoom'
import UnstyledLink from '@components/links/UnstyledLink'
import { ModalV2 } from '@components/Modal'
import Skeleton from '@components/Skeleton'
import listLocation from '@constant/location'
import { useProductCondition } from '@hooks/useProductCondition'
import classNames from '@lib/classnames'
import { GA_EVENTS } from '@lib/constants/analyticsEvents'
import { trackEvent } from '@lib/ga'
import { formatRupiah } from '@utils/currency'
import { sanitizeHtml } from '@utils/html'
import { getWhatsAppLinkFromTemplate } from '@utils/whatsapp'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useCollapse } from 'react-collapsed'
import { createPortal } from 'react-dom'
import { useMediaQuery } from 'react-responsive'

interface PageProps {
    product?: any
    priceHistory: any[]
    productPrice: any
}

interface CollapseProps {
    title: string
    defaultExpanded?: boolean
    children: React.ReactNode
    isOpen?: boolean
    onToggle?: () => void
}

const Collapse = ({ title, defaultExpanded, children, isOpen, onToggle }: CollapseProps) => {
    const [isExpanded, setIsExpanded] = useState<boolean>(Boolean(defaultExpanded))
    // keep internal state in sync when controlled via isOpen prop
    const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect
    useIsomorphicLayoutEffect(() => {
        if (typeof isOpen === 'boolean') setIsExpanded(isOpen)
    }, [isOpen])

    const { getToggleProps, getCollapseProps } = useCollapse({ isExpanded })

    const handleClick = () => {
        if (onToggle) onToggle()
        else setIsExpanded((s) => !s)
    }

    return (
        <div className='border-grey-100 border-b pb-6'>
            <button
                className='flex w-full items-center justify-between text-left focus:outline-none'
                {...getToggleProps({ onClick: handleClick })}
            >
                <h4 className='xl:text-subheading-5-desktop text-subheading-5-mobile text-grey-black dark:text-grey-white'>
                    {title}
                </h4>

                <Icons
                    icon='ChevronDown'
                    width={16}
                    height={16}
                    className={classNames('text-grey-500 dark:text-grey-400 transition-transform ', {
                        'rotate-180': isExpanded
                    })}
                />
            </button>
            <div {...getCollapseProps()}>
                <div className='mt-4'>{children}</div>
            </div>
        </div>
    )
}

const PriceChart = dynamic(() => import('./PriceChart'), { ssr: false })

const DetailItem: React.FC<PageProps> = ({ product, priceHistory, productPrice }) => {
    const { t } = useTranslation(['collection', 'common'])
    const router = useRouter()
    const pinRef = useRef<HTMLDivElement | null>(null)
    const scrollRef = useRef<HTMLDivElement | null>(null)
    const priceRef = useRef<HTMLDivElement | null>(null)
    const rightScrollRef = useRef<HTMLDivElement | null>(null)
    const [activeImageIndex, setActiveImageIndex] = useState(0)
    const [imageModalOpen, setImageModalOpen] = useState(false)
    const [imageModalIndex, setImageModalIndex] = useState(0)

    const [openCollapse, setOpenCollapse] = useState<string | null>('Description')

    const [showTopSticky, setShowTopSticky] = useState(false)
    const [headerHeight, setHeaderHeight] = useState<number>(0)
    const [isHeaderVisible, setIsHeaderVisible] = useState<boolean>(true)
    const isMobile = useMediaQuery({ maxWidth: 1279 })

    // Forward wheel events to the page when the inner image container
    // cannot scroll further in the wheel direction (desktop only)
    useEffect(() => {
        const leftScrollEl = scrollRef.current
        if (!leftScrollEl || typeof window === 'undefined') return

        const isDesktop = window.innerWidth >= 1280
        if (!isDesktop) return

        const wheelHandler = (e: WheelEvent) => {
            try {
                const isHorizontal = leftScrollEl.scrollWidth > leftScrollEl.clientWidth
                const primaryDelta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY

                if (isHorizontal) {
                    const atLeft = leftScrollEl.scrollLeft <= 0
                    const atRight = leftScrollEl.scrollLeft + leftScrollEl.clientWidth >= leftScrollEl.scrollWidth - 1
                    if ((primaryDelta > 0 && !atRight) || (primaryDelta < 0 && !atLeft)) return
                    e.preventDefault()
                    window.scrollBy({ top: primaryDelta, behavior: 'auto' })
                } else {
                    const atTop = leftScrollEl.scrollTop <= 0
                    const atBottom = leftScrollEl.scrollTop + leftScrollEl.clientHeight >= leftScrollEl.scrollHeight - 1
                    if ((primaryDelta > 0 && !atBottom) || (primaryDelta < 0 && !atTop)) return
                    e.preventDefault()
                    window.scrollBy({ top: primaryDelta, behavior: 'auto' })
                }
            } catch (err) {
                // swallow
            }
        }

        leftScrollEl.addEventListener('wheel', wheelHandler, { passive: false })
        return () => leftScrollEl.removeEventListener('wheel', wheelHandler)
    }, [product?.images?.length, product?.id])

    // measure header height so we can position the portal below it
    useEffect(() => {
        if (typeof window === 'undefined') return
        const measure = () => {
            const hdr = document.querySelector('.nav-header') as HTMLElement | null
            const h = hdr ? Math.ceil(hdr.getBoundingClientRect().height) : 0
            setHeaderHeight(h)
        }

        measure()
        window.addEventListener('resize', measure)
        return () => window.removeEventListener('resize', measure)
    }, [])

    // Listen for header visibility changes (Header sets `data-header-visible` on body)
    useEffect(() => {
        if (typeof window === 'undefined') return undefined

        const body = document.body
        const update = () => setIsHeaderVisible(body.dataset.headerVisible !== 'false')

        // initial
        update()

        const mo = new MutationObserver(() => update())
        mo.observe(body, { attributes: true, attributeFilter: ['data-header-visible'] })

        return () => mo.disconnect()
    }, [])

    // observe desktop price block visibility to show sticky header when it's out of view
    useEffect(() => {
        const el = priceRef.current
        if (!el || typeof window === 'undefined') return

        const rootMarginTop = headerHeight ? `-${headerHeight + 8}px` : '-80px'

        const options: IntersectionObserverInit = {
            root: null,
            threshold: [0, 0.1, 0.5, 1],
            rootMargin: `${rootMarginTop} 0px 0px 0px`
        }

        const io = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                setShowTopSticky(!entry.isIntersecting)
            })
        }, options)

        io.observe(el)

        return () => {
            try {
                io.unobserve(el)
            } catch (e) {
                // ignore
            }
            io.disconnect()
        }
        // re-create when product or headerHeight changes
    }, [product?.id, priceHistory?.length, headerHeight])

    // track active image based on scroll position
    useLayoutEffect(() => {
        const scrollEl = scrollRef.current
        if (!scrollEl) return

        let ticking = false

        const onScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const children = Array.from(scrollEl.children) as HTMLElement[]
                    if (children.length === 0) return

                    const isHorizontal = scrollEl.scrollWidth > scrollEl.clientWidth

                    if (isHorizontal) {
                        const containerPos = scrollEl.scrollLeft
                        let closest = 0
                        let minDist = Infinity
                        children.forEach((c, i) => {
                            const dist = Math.abs(c.offsetLeft - containerPos)
                            if (dist < minDist) {
                                minDist = dist
                                closest = i
                            }
                        })
                        setActiveImageIndex((idx) => (idx === closest ? idx : closest))
                    } else {
                        // vertical behavior
                        const containerTop = scrollEl.scrollTop
                        let closest = 0
                        let minDist = Infinity
                        children.forEach((c, i) => {
                            const dist = Math.abs(c.offsetTop - containerTop)
                            if (dist < minDist) {
                                minDist = dist
                                closest = i
                            }
                        })
                        setActiveImageIndex((idx) => (idx === closest ? idx : closest))
                    }
                    ticking = false
                })
                ticking = true
            }
        }

        scrollEl.addEventListener('scroll', onScroll, { passive: true })
        // initialize
        onScroll()

        return () => scrollEl.removeEventListener('scroll', onScroll)
    }, [product?.images?.length])

    const scrollToImage = (index: number) => {
        const scrollEl = scrollRef.current
        if (!scrollEl) return
        const child = scrollEl.children[index] as HTMLElement | undefined
        if (child) {
            const isHorizontal = scrollEl.scrollWidth > scrollEl.clientWidth
            child.scrollIntoView({
                behavior: 'smooth',
                block: isHorizontal ? 'nearest' : 'start',
                inline: isHorizontal ? 'center' : 'nearest'
            })
        }
    }

    const isWatch = product?.categories?.some((category: any) => category.name === 'Watches')

    const locationMatch = listLocation.find((loc) => {
        if (loc.path.endsWith('/*')) {
            const basePath = loc.path.replace('/*', '')
            return router.pathname.startsWith(basePath)
        }
        return router.pathname === loc.path
    })

    // Read is_new once from product meta_data (0 = false, 1 = true)
    const isNewMeta = (product?.meta_data || []).find((m: any) => String(m.key) === 'is_new')
    const isNewFlag = typeof isNewMeta !== 'undefined' ? Number(isNewMeta.value) === 1 : undefined

    // Helper function to get meta value by key
    const getMetaValue = (key: string) => product?.meta_data?.find((m: any) => String(m.key) === key)?.value || ''

    // Define the desired order for Basic Info (odd left, even right)
    const basicInfoOrder: Array<{ label: string; key?: string; valueFn?: () => string }> = [
        { label: 'Brand', valueFn: () => product?.brands?.[0]?.name || '' },
        { label: 'Listing code', valueFn: () => getMetaValue('basic-info-listing-code') },
        { label: 'Model', key: 'basic-info-model' },
        { label: 'Reference number', valueFn: () => getMetaValue('reference') },
        { label: 'Case material', key: 'basic-info-case-material' },
        { label: 'Bracelet material', key: 'basic-info-bracelet-material' },
        { label: 'Product year', valueFn: () => getMetaValue('basic-info-year-production') },
        { label: 'Gender', key: 'basic-info-gender' },
        { label: 'Status', key: 'basic-info-status' },
        { label: 'Condition', key: 'basic-info-condition' },
        { label: 'Scope of delivery', key: 'basic-info-scope-of-delivery' }
    ]

    // Build basicItems in the defined order, only including items with values
    const basicItems = basicInfoOrder
        .map((item) => ({
            label: item.label,
            value: item.valueFn ? item.valueFn() : item.key ? getMetaValue(item.key) : ''
        }))
        .filter((item) => item.value !== '')

    // Hide Performance (price history) when product status is "reserveable"
    const isReservable = /reserv/i.test(String(getMetaValue('basic-info-status')))

    // If product has explicit `is_new` flag, override the condition value
    if (isNewFlag === true) {
        const conditionIdx = basicItems.findIndex((i) => i.label.toLowerCase() === 'condition')
        if (conditionIdx > -1) {
            basicItems[conditionIdx].value = 'Brand New / Unworn'
        }
    }

    // Define the desired order for Caliber
    const caliberOrder: Array<{ label: string; key: string }> = [
        { label: 'Movement', key: 'caliber-movement' },
        { label: 'Caliber/Movement', key: 'caliber-caliber-movement' },
        { label: 'Base Caliber', key: 'caliber-base-caliber' },
        { label: 'Power Reserve', key: 'caliber-power-reserve' },
        { label: 'Number of Jewels', key: 'caliber-number-of-jewels' }
    ]

    // Build caliberItems in the defined order, only including items with values
    const caliberItems = caliberOrder
        .map((item) => ({
            label: item.label,
            value: getMetaValue(item.key)
        }))
        .filter((item) => item.value !== '')

    // Define the desired order for Case
    const caseOrder: Array<{ label: string; key: string }> = [
        { label: 'Case material', key: 'case-material' },
        { label: 'Case diameter', key: 'case-diameter' },
        { label: 'Dial', key: 'case-dial' },
        { label: 'Dial numerals', key: 'case-dial-numerals' },
        { label: 'Bezel material', key: 'case-bezel-material' },
        { label: 'Crystal', key: 'case-crystal' },
        { label: 'Water resistance', key: 'case-water-resistance' }
    ]

    // Build caseItems in the defined order, only including items with values
    const caseItems = caseOrder
        .map((item) => ({
            label: item.label,
            value: getMetaValue(item.key)
        }))
        .filter((item) => item.value !== '')

    // Define the desired order for Bracelet/Strap
    const braceletOrder: Array<{ label: string; key: string }> = [
        { label: 'Material', key: 'bracelet-material' },
        { label: 'Color', key: 'bracelet-color' },
        { label: 'Clasp system', key: 'bracelet-clasp' },
        { label: 'Clasp material', key: 'bracelet-clasp-material' }
    ]

    // Build braceletItems in the defined order, only including items with values
    const braceletItems = braceletOrder
        .map((item) => ({
            label: item.label,
            value: getMetaValue(item.key)
        }))
        .filter((item) => item.value !== '')

    // Parse watch-functions from meta_data
    // Supports both formats:
    //   legacy: ["World Time", "Chronograph"]
    //   enriched: [{ name: "Chronograph", icon: "https://...", category: "Time Related" }]
    interface WatchFunction {
        name: string
        icon?: string
        category?: string
    }
    const watchFunctionsMeta = product?.meta_data?.find((m: any) => String(m.key) === 'watch-functions')
    const watchFunctions: WatchFunction[] = (() => {
        if (!watchFunctionsMeta?.value) return []
        try {
            const raw = watchFunctionsMeta.value
            const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw
            if (!Array.isArray(parsed)) return []
            return parsed
                .filter(Boolean)
                .map((item: any) =>
                    typeof item === 'string'
                        ? { name: item }
                        : { name: item.name, icon: item.icon, category: item.category }
                )
        } catch {
            return []
        }
    })()

    // Get accessories items from meta_data
    const accessoriesValue = product?.meta_data?.filter((meta: any) => meta.key.startsWith('accessories-type')) || []
    const accessoriesDetailsValue =
        product?.meta_data?.filter((meta: any) => meta.key.startsWith('accessories-details')) || []

    const accessoriesItems = accessoriesValue.map((meta: any) => ({
        label: meta.key.replace('accessories-type', '').replace(/-/g, ' '),
        value: meta.value
    }))

    const accessoriesDetailsItems = accessoriesDetailsValue.map((meta: any) => ({
        label: meta.key.replace('accessories-details', '').replace(/-/g, ' '),
        value: meta.value
    }))

    const [conditionModalOpen, setConditionModalOpen] = useState(false)
    const [conditionModalContent, setConditionModalContent] = useState<{
        title: string
        description: React.ReactNode
    } | null>(null)
    const [selectedConditionName, setSelectedConditionName] = useState<string>('')

    // Query condition data using React Query
    const { data: conditionData, isLoading: isLoadingCondition } = useProductCondition(
        selectedConditionName,
        product?.id,
        {
            enabled: !!selectedConditionName
        }
    )

    const { i18n } = useTranslation()
    const locale = i18n?.language || 'en'
    const isEnglish = locale === 'en'

    // Get condition value from product meta_data (basic-info-condition)
    const productConditionValue = useMemo(() => {
        const conditionMeta = product?.meta_data?.find((m: any) => String(m.key) === 'basic-info-condition')
        return conditionMeta?.value || ''
    }, [product?.meta_data])

    // Handle condition modal open - use value from meta_data directly
    const handleConditionClick = async () => {
        if (!productConditionValue) return

        setSelectedConditionName(productConditionValue)
        setConditionModalOpen(true)
    }

    // Update modal content when data is loaded
    useEffect(() => {
        if (conditionData && conditionModalOpen) {
            setConditionModalContent({
                title: isEnglish ? conditionData.name : conditionData.name_id,
                description: isEnglish ? conditionData.description_en : conditionData.description_id
            })
        }
    }, [conditionData, conditionModalOpen, isEnglish])

    const basicHtml = (() => {
        if (!basicItems || basicItems.length === 0) return 'No basic info available.'

        const parts = basicItems.map((item: any, idx: number) => {
            const label = String(item.label)
            const underline = /status|brand|model|reference|condition/.test(label.toLowerCase())
            const underlineClass = underline ? ' underline' : ''

            if (label === 'Brand' && item.value) {
                return (
                    <div key={idx} className='flex flex-col gap-2'>
                        <p className='xl:text-paragraph-8-desktop text-paragraph-8-mobile text-grey-200 !mb-0 '>
                            {label}
                        </p>
                        <p
                            className={`xl:text-paragraph-8-desktop text-paragraph-8-mobile text-grey-black capitalize !mb-0${underlineClass}`}
                        >
                            <a href={`/collections?product_brand=${product?.brands?.[0]?.id || ''}`}>{item.value}</a>
                        </p>
                    </div>
                )
            }

            if (label === 'Condition' && item.value) {
                const displayLabel = isNewFlag === true ? 'Brand New' : String(item.value)

                return (
                    <div key={idx} className='flex flex-col gap-2'>
                        <p className='xl:text-paragraph-8-desktop text-paragraph-8-mobile text-grey-200 !mb-0 '>
                            {label}
                        </p>
                        <button
                            type='button'
                            onClick={() => handleConditionClick()}
                            className={`xl:text-paragraph-8-desktop text-paragraph-8-mobile text-grey-black text-left capitalize !mb-0${underlineClass} focus:outline-none`}
                        >
                            {displayLabel}
                        </button>
                    </div>
                )
            }

            return (
                <div key={idx} className='flex flex-col gap-2'>
                    <p className='xl:text-paragraph-8-desktop text-paragraph-8-mobile text-grey-200 !mb-0 '>{label}</p>
                    <p
                        className={`xl:text-paragraph-8-desktop text-paragraph-8-mobile text-grey-black capitalize !mb-0${underlineClass}`}
                    >
                        {item.value}
                    </p>
                </div>
            )
        })

        return <div className='grid grid-cols-2 grid-rows-2 justify-between gap-y-6'>{parts}</div>
    })()

    const caliberHtml = (() => {
        if (!caliberItems || caliberItems.length === 0) return 'No caliber info available.'

        const parts = caliberItems.map((item: any) => {
            const label = String(item.label)
            return `
                <div class='flex flex-col gap-2'>
                    <p class='first-letter:uppercase lowercase xl:text-paragraph-8-desktop text-paragraph-8-mobile text-grey-200 !mb-0'>${label}</p>
                    <p class='first-letter:uppercase lowercase xl:text-paragraph-8-desktop text-paragraph-8-mobile text-grey-black !mb-0'>${item.value}</p>
                </div>
            `
        })

        return `<div class='grid grid-rows-2 grid-cols-2 justify-between gap-y-6'>${parts.join('')}</div>`
    })()

    const caseHtml = (() => {
        if (!caseItems || caseItems.length === 0) return 'No case info available.'

        const parts = caseItems.map((item: any) => {
            const label = String(item.label)
            return `
                <div class='flex flex-col gap-2'>
                    <p class='first-letter:uppercase lowercase xl:text-paragraph-8-desktop text-paragraph-8-mobile text-grey-200 !mb-0'>${label}</p>
                    <p class='first-letter:uppercase lowercase xl:text-paragraph-8-desktop text-paragraph-8-mobile text-grey-black !mb-0'>${item.value}</p>
                </div>
            `
        })

        return `<div class='grid grid-rows-2 grid-cols-2 justify-between gap-y-6'>${parts.join('')}</div>`
    })()

    const braceletHtml = (() => {
        if (!braceletItems || braceletItems.length === 0) return 'No bracelet info available.'

        const parts = braceletItems.map((item: any) => {
            const label = String(item.label)
            return `
                <div class='flex flex-col gap-2'>
                    <p class='first-letter:uppercase lowercase xl:text-paragraph-8-desktop text-paragraph-8-mobile text-grey-200 !mb-0'>${label}</p>
                    <p class='first-letter:uppercase lowercase xl:text-paragraph-8-desktop text-paragraph-8-mobile text-grey-black !mb-0'>${item.value}</p>
                </div>
            `
        })

        return `<div class='grid grid-rows-2 grid-cols-2 justify-between gap-y-6'>${parts.join('')}</div>`
    })()

    const hasIcons = watchFunctions.some((fn) => !!fn.icon)
    const functionsContent =
        watchFunctions.length > 0 ? (
            <div className='flex flex-wrap gap-4'>
                {watchFunctions.map((fn, idx) =>
                    hasIcons ? (
                        <div key={idx} className='bg-grey-50 flex items-center gap-2 rounded-[4px] border px-3 py-2'>
                            {fn.icon && (
                                <div className='relative h-[18px] w-[18px] flex-shrink-0 -translate-y-[1px]'>
                                    <Image
                                        src={fn.icon}
                                        alt={fn.name}
                                        layout='fill'
                                        objectFit='contain'
                                        className='brightness-0'
                                    />
                                </div>
                            )}
                            <p className='text-grey-black !mb-0 leading-none'>{fn.name}</p>
                        </div>
                    ) : (
                        <p
                            key={idx}
                            className='bg-grey-50 xl:text-paragraph-8-desktop text-paragraph-8-mobile rounded-[4px] border px-3 py-2 !leading-none text-black'
                        >
                            {fn.name}
                        </p>
                    )
                )}
            </div>
        ) : null

    const accessoriesHtml = (() => {
        if (!accessoriesItems || accessoriesItems.length === 0) return 'No accessories info available.'

        const parts = accessoriesItems.map((item: any) => {
            const label = String(item.label)
            return `
                <div class='flex flex-col gap-2'>
                    <p class='first-letter:uppercase lowercase xl:text-paragraph-8-desktop text-paragraph-8-mobile text-grey-200 !mb-0'>${label}</p>
                    <p class='first-letter:uppercase lowercase xl:text-paragraph-8-desktop text-paragraph-8-mobile text-grey-black !mb-0'>${item.value}</p>
                </div>
            `
        })
        return `<div class='flex flex-col'>${parts.join('')}</div>`
    })()

    const accessoriesDetailsHtml = (() => {
        if (!accessoriesDetailsItems || accessoriesDetailsItems.length === 0)
            return 'No accessories details info available.'

        return (
            <div className='flex flex-col gap-6'>
                {accessoriesDetailsItems.map((item: any, idx: number) => {
                    return (
                        <div key={idx} className='flex flex-col gap-2'>
                            <p
                                className='xl:text-paragraph-8-desktop text-paragraph-8-mobile text-grey-black !mb-0 capitalize'
                                dangerouslySetInnerHTML={{
                                    __html: sanitizeHtml(item.value)
                                }}
                            />
                        </div>
                    )
                })}
            </div>
        )
    })()

    let dataCollapse: { title: string; content: any }[] = []

    if (isWatch) {
        dataCollapse = [
            {
                title: 'Description',
                content: product?.description || 'No description available.'
            },
            {
                title: 'Basic Info',
                content: basicHtml
            },
            {
                title: 'Caliber',
                content: caliberHtml
            },
            {
                title: 'Case',
                content: caseHtml
            },
            {
                title: 'Bracelet/strap',
                content: braceletHtml
            },
            ...(watchFunctions.length > 0 ? [{ title: 'Functions', content: functionsContent }] : [])
        ]
    } else {
        dataCollapse = [
            {
                title: 'Description',
                content: product?.description || 'No description available.'
            },
            {
                title: 'Type',
                content: accessoriesHtml || 'No type available.'
            },
            {
                title: 'Details',
                content: accessoriesDetailsHtml || 'No details available.'
            }
        ]
    }
    const isPositiveChange = Boolean(
        priceHistory &&
            priceHistory.length > 1 &&
            priceHistory[priceHistory.length - 1].price_change > priceHistory[0].price_change
    )

    return (
        <>
            <style jsx global>{`
                .meta {
                    p {
                        margin-bottom: 16px;
                    }
                    h1,
                    h2,
                    h3,
                    h4,
                    h5,
                    h6 {
                        font-weight: 600;
                    }
                    h1 {
                        font-size: 16px;
                    }
                    h2 {
                        font-size: 14px;
                    }
                    h3 {
                        font-size: 12px;
                    }
                }
            `}</style>
            <Container className='flex flex-col gap-14 pt-[130px] xl:flex-row xl:items-center xl:gap-20 xl:pt-[100px]'>
                {/* Images column: sticky on desktop so it stays visible while scrolling */}
                <div
                    ref={pinRef as any}
                    className='relative w-full xl:w-auto'
                    style={
                        !isMobile ? { position: 'sticky', top: headerHeight + 16, alignSelf: 'flex-start' } : undefined
                    }
                >
                    {/* left vertical indicators */}
                    <div className='absolute bottom-0 left-1/2 z-10 flex -translate-x-1/2 flex-row justify-center gap-3 xl:left-[2px] xl:top-1/2 xl:-translate-y-1/2 xl:translate-x-0 xl:flex-col'>
                        {product.images.map((_: any, i: any) => (
                            <button
                                key={i}
                                onClick={() => scrollToImage(i)}
                                className={`rounded-full transition-all duration-200 focus:outline-none ${
                                    i === activeImageIndex ? 'bg-grey-500 h-1.5 w-1.5' : 'bg-grey-200 h-1 w-1'
                                }`}
                                aria-label={`Image ${i + 1}`}
                            />
                        ))}
                    </div>

                    <div
                        ref={scrollRef as any}
                        className='scrollbar-none flex w-full snap-x snap-mandatory flex-row gap-6 overflow-x-auto scroll-smooth px-4 xl:ml-4 xl:snap-y xl:flex-col xl:overflow-y-auto xl:px-0'
                        style={{ maxHeight: 'calc(100vh - 300px)', willChange: 'scroll-position' }}
                    >
                        {product.images.length > 0 ? (
                            product.images.map((img: any, index: number) => (
                                <div
                                    key={index}
                                    className='relative h-[390px] w-[390px] min-w-full flex-shrink-0 snap-center xl:h-[602px] xl:w-[602px] xl:min-w-[500px] xl:snap-start'
                                    onClick={() => {
                                        setImageModalIndex(index)
                                        setImageModalOpen(true)
                                    }}
                                    role='button'
                                    tabIndex={0}
                                    aria-label={`Open image ${index + 1}`}
                                >
                                    <Image
                                        src={img.src || 'https://placehold.co/600x400/png?text=TWC'}
                                        alt={product?.name}
                                        layout='fill'
                                        objectFit='contain'
                                        className='object-center'
                                    />
                                </div>
                            ))
                        ) : (
                            <div className='relative h-[390px] w-[390px] min-w-full flex-shrink-0 snap-center xl:h-[602px] xl:w-[602px] xl:min-w-[500px] xl:snap-start'>
                                <Image
                                    src='https://placehold.co/600x802/png?text=TWC'
                                    alt={product?.name}
                                    layout='fill'
                                    objectFit='contain'
                                    className='object-center'
                                />
                            </div>
                        )}
                    </div>
                </div>

                <div className='scrollbar-none flex w-full xl:w-full'>
                    <div
                        ref={rightScrollRef as any}
                        className='scrollbar-none flex w-full flex-col gap-12 overflow-y-auto xl:max-h-[calc(100vh-160px)]'
                        style={{ willChange: 'scroll-position' }}
                    >
                        {!isMobile && (
                            <Breadcrumb
                                items={[
                                    {
                                        title: 'Our Collections',
                                        href: '/collections'
                                    },
                                    {
                                        title: product?.name
                                    }
                                ]}
                                navigationClassName='xl:text-button-5-desktop text-button-5-mobile'
                                lastItemClassName='!text-grey-black xl:text-button-5-desktop text-button-5-mobile'
                            />
                        )}
                        <div className='flex flex-col gap-14 xl:gap-12'>
                            <div className='flex flex-col gap-2'>
                                <UnstyledLink
                                    href={`/collections?product_brand=${product?.brands?.[0]?.id || ''}`}
                                    className='w-fit'
                                >
                                    <h5
                                        className='xl:text-subheading-5-desktop text-subheading-5-mobile text-accent-price-dark uppercase'
                                        dangerouslySetInnerHTML={{
                                            __html: sanitizeHtml(product?.brands?.[0]?.name)
                                        }}
                                    />
                                </UnstyledLink>

                                <h1 className='xl:text-paragraph-1-desktop text-paragraph-1-mobile text-grey-black'>
                                    {product.name}
                                </h1>

                                {product.meta_data.find((meta: any) => meta.key === 'reference') && isWatch && (
                                    <p className='xl:text-paragraph-8-desktop text-paragraph-8-mobile text-grey-200'>
                                        Ref.{' '}
                                        <span className=''>
                                            {product.meta_data.find((meta: any) => meta.key === 'reference')?.value}
                                        </span>
                                    </p>
                                )}

                                <div className='flex flex-row flex-wrap gap-1 pt-2 xl:pt-0'>
                                    {['basic-info-scope-of-delivery', 'basic-info-status', 'basic-info-year-production']
                                        .map((key) => product?.meta_data?.find((m: any) => m.key === key))
                                        .filter((m: any) => m && m.value && m.value !== '-')
                                        .map((item: any) => (
                                            <div
                                                className='border-grey-500 flex items-center rounded-full border'
                                                key={item.key}
                                            >
                                                <span className='xl:text-paragraph-10-desktop text-paragraph-10-mobile text-grey-500 !mb-0 px-3 py-[5px] capitalize xl:!leading-none'>
                                                    {item.value}
                                                </span>
                                            </div>
                                        ))}
                                </div>
                                <div ref={priceRef as any} className='hidden flex-col gap-2 pt-6 xl:flex xl:gap-3'>
                                    {product.stock_status === 'instock' && product.price !== '' && (
                                        <p className='xl:text-paragraph-3-desktop text-paragraph-3-mobile text-grey-black'>
                                            {formatRupiah(product.price)}
                                        </p>
                                    )}

                                    {priceHistory.length > 1 && (
                                        <div className='flex flex-row items-center gap-1 *:!leading-none'>
                                            <Icons
                                                icon={isPositiveChange ? 'ArrowUp' : 'ArrowUp'}
                                                width={12}
                                                height={12}
                                                className={
                                                    isPositiveChange
                                                        ? 'text-success-500'
                                                        : 'text-error-500 rotate-180 transform'
                                                }
                                            />
                                            <span
                                                className={classNames(
                                                    'xl:!text-paragraph-8-desktop !text-paragraph-8-mobile',
                                                    {
                                                        'text-green-600': isPositiveChange,
                                                        'text-red-600': !isPositiveChange
                                                    }
                                                )}
                                            >
                                                {isPositiveChange ? '+' : ''}
                                                {(
                                                    ((priceHistory[priceHistory.length - 1].price_change -
                                                        priceHistory[0].price_change) /
                                                        priceHistory[0].price) *
                                                    100
                                                ).toFixed(2)}
                                                %
                                            </span>
                                            <span
                                                className={classNames(
                                                    'xl:!text-paragraph-8-desktop !text-paragraph-8-mobile',
                                                    {
                                                        'text-green-600': isPositiveChange,
                                                        'text-red-600': !isPositiveChange,
                                                        'text-grey-500':
                                                            priceHistory[priceHistory.length - 1].price_change ===
                                                            priceHistory[0].price_change
                                                    }
                                                )}
                                            >
                                                ({formatRupiah(priceHistory[priceHistory.length - 1].price_change)})
                                            </span>
                                        </div>
                                    )}
                                    {product.stock_status !== 'outofstock' ? (
                                        <a
                                            href={getWhatsAppLinkFromTemplate(
                                                'detailProduct',
                                                product.name,
                                                typeof window !== 'undefined'
                                                    ? window.location.href
                                                    : `/collections/${product.slug}`
                                            )}
                                            target='_blank'
                                            rel='noopener noreferrer'
                                            onClick={() =>
                                                trackEvent(GA_EVENTS.CONTACT_WA, {
                                                    'Button Location': 'Button reserve',
                                                    'Button Page': locationMatch?.label
                                                })
                                            }
                                        >
                                            <Button variant='secondaryInverse' block className='capitalize'>
                                                {t('common:reserve_this', {
                                                    item: isWatch ? 'watch' : 'accessories'
                                                })}
                                            </Button>
                                        </a>
                                    ) : (
                                        <button className='bg-grey-50 w-fit px-4 py-2' disabled>
                                            <p className='xl:text-paragraph-5-desktop text-paragraph-5-mobile text-grey-200 uppercase'>
                                                {t('common:sold')}
                                            </p>
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Mobile bottom fixed bar - render via portal to avoid overflow container issues */}
                            {
                                (isMobile
                                    ? createPortal(
                                          <div className='fixed bottom-0 left-0 right-0 z-50 xl:hidden'>
                                              <div className='mx-auto max-w-screen-md '>
                                                  <div className='bg-dropdown-menu-overlay/80 flex items-center justify-between px-5 py-4 shadow-lg'>
                                                      <div className='flex flex-col gap-1'>
                                                          {product.stock_status === 'instock' &&
                                                          product.price !== '' ? (
                                                              <p className='text-grey-white text-subheading-5-desktop'>
                                                                  {formatRupiah(product.price)}
                                                              </p>
                                                          ) : (
                                                              <div className='flex flex-col gap-1.5'>
                                                                  <h4 className='text-subheading-5-desktop text-grey-white capitalize'>
                                                                      {product.name}
                                                                  </h4>

                                                                  <p
                                                                      className='text-grey-200 text-paragraph-8-desktop uppercase'
                                                                      dangerouslySetInnerHTML={{
                                                                          __html: sanitizeHtml(
                                                                              product.brands?.[0]?.name
                                                                          )
                                                                      }}
                                                                  />
                                                              </div>
                                                          )}
                                                          {priceHistory.length > 1 && (
                                                              <div className='text-paragraph-8-desktop flex items-center gap-0.5'>
                                                                  <Icons
                                                                      icon={isPositiveChange ? 'ArrowUp' : 'ArrowUp'}
                                                                      width={12}
                                                                      height={12}
                                                                      className={
                                                                          isPositiveChange
                                                                              ? 'text-success-500'
                                                                              : 'text-error-500 rotate-180 transform'
                                                                      }
                                                                  />
                                                                  <span
                                                                      className={classNames({
                                                                          'text-green-600': isPositiveChange,
                                                                          'text-red-600': !isPositiveChange
                                                                      })}
                                                                  >
                                                                      {isPositiveChange ? '+' : ''}
                                                                      {(
                                                                          ((priceHistory[priceHistory.length - 1]
                                                                              .price_change -
                                                                              priceHistory[0].price_change) /
                                                                              priceHistory[0].price) *
                                                                          100
                                                                      ).toFixed(2)}
                                                                      %
                                                                  </span>
                                                                  <span
                                                                      className={classNames({
                                                                          'text-green-600': isPositiveChange,
                                                                          'text-red-600': !isPositiveChange,
                                                                          'text-grey-500':
                                                                              priceHistory[priceHistory.length - 1]
                                                                                  .price_change ===
                                                                              priceHistory[0].price_change
                                                                      })}
                                                                  >
                                                                      (
                                                                      {formatRupiah(
                                                                          priceHistory[priceHistory.length - 1]
                                                                              .price_change
                                                                      )}
                                                                      )
                                                                  </span>
                                                              </div>
                                                          )}
                                                      </div>

                                                      <div className='ml-4 flex shrink-0 items-center'>
                                                          {product.stock_status !== 'outofstock' ? (
                                                              <a
                                                                  href={getWhatsAppLinkFromTemplate(
                                                                      'detailProduct',
                                                                      product.name,
                                                                      typeof window !== 'undefined'
                                                                          ? window.location.href
                                                                          : `/collections/${product.slug}`
                                                                  )}
                                                                  target='_blank'
                                                                  rel='noopener noreferrer'
                                                                  onClick={() =>
                                                                      trackEvent(GA_EVENTS.CONTACT_WA, {
                                                                          'Button Location': 'Button reserve',
                                                                          'Button Page': locationMatch?.label
                                                                      })
                                                                  }
                                                              >
                                                                  <Button variant='secondaryInverse'>
                                                                      {' '}
                                                                      {t('common:reserve', {
                                                                          item: isWatch
                                                                              ? t('common:watch')
                                                                              : t('common:item')
                                                                      })}
                                                                  </Button>
                                                              </a>
                                                          ) : (
                                                              <button className='bg-grey-50 w-fit px-4 py-2' disabled>
                                                                  <p className='xl:text-paragraph-5-desktop text-paragraph-5-mobile text-grey-200 uppercase'>
                                                                      {t('common:sold')}
                                                                  </p>
                                                              </button>
                                                          )}
                                                      </div>
                                                  </div>
                                              </div>
                                          </div>,
                                          document.body
                                      )
                                    : null) as unknown as React.ReactNode
                            }

                            {/* Mobile: sticky top bar (below header) with back button + product name - render via portal */}
                            {
                                (isMobile
                                    ? createPortal(
                                          <div
                                              aria-hidden={!showTopSticky}
                                              role='status'
                                              style={{
                                                  position: 'fixed',
                                                  left: 0,
                                                  right: 0,
                                                  top: showTopSticky && isHeaderVisible ? headerHeight : 0,
                                                  zIndex: 49,
                                                  transform: showTopSticky ? 'translateY(0)' : 'translateY(-120%)',
                                                  transition: 'transform 180ms ease, top 300ms ease',
                                                  pointerEvents: 'auto'
                                              }}
                                          >
                                              <div className='max-w-screen mx-auto'>
                                                  <div className='bg-grey-black flex items-center gap-4 px-4 py-5 shadow-md'>
                                                      <Icons
                                                          icon='ArrowLeft'
                                                          onClick={() => router.push('/collections')}
                                                          className='text-grey-white'
                                                          width={16}
                                                          height={16}
                                                      />
                                                      <div className='flex flex-col truncate'>
                                                          <h5 className='text-subheading-5-mobile text-grey-white truncate'>
                                                              {product.name}
                                                          </h5>
                                                      </div>
                                                  </div>
                                              </div>
                                          </div>,
                                          document.body
                                      )
                                    : null) as unknown as React.ReactNode
                            }

                            {/* Desktop sticky header rendered into document.body to avoid ScrollSmoother transforms */}
                            {typeof window !== 'undefined' && !isMobile
                                ? (createPortal(
                                      <div
                                          aria-hidden={!showTopSticky}
                                          role='status'
                                          style={{
                                              position: 'fixed',
                                              left: 0,
                                              right: 0,
                                              top: showTopSticky && isHeaderVisible ? headerHeight : 0,
                                              zIndex: 49,
                                              transform: showTopSticky ? 'translateY(0)' : 'translateY(-120%)',
                                              transition: 'transform 180ms ease, top 300ms ease',
                                              pointerEvents: 'auto'
                                          }}
                                      >
                                          <div className='max-w-screen'>
                                              <div className='bg-dropdown-menu-overlay/80 flex items-center justify-between px-6 py-4 shadow-md'>
                                                  <div className='flex flex-col gap-1.5'>
                                                      <h4 className='text-subheading-5-desktop text-grey-white capitalize'>
                                                          {product.name}
                                                      </h4>

                                                      <div className='flex gap-0.5'>
                                                          <p
                                                              className='text-grey-200 text-paragraph-8-desktop uppercase'
                                                              dangerouslySetInnerHTML={{
                                                                  __html: sanitizeHtml(product.brands?.[0]?.name)
                                                              }}
                                                          />
                                                          {product.meta_data.find(
                                                              (meta: any) => meta.key === 'reference'
                                                          ) &&
                                                              isWatch && (
                                                                  <p className='xl:text-paragraph-8-desktop text-paragraph-8-mobile text-grey-200'>
                                                                      •{' '}
                                                                      <span className=''>
                                                                          {
                                                                              product.meta_data.find(
                                                                                  (meta: any) =>
                                                                                      meta.key === 'reference'
                                                                              )?.value
                                                                          }
                                                                      </span>
                                                                  </p>
                                                              )}
                                                      </div>
                                                  </div>

                                                  <div className='flex items-center gap-8'>
                                                      <div className='flex flex-col items-end gap-1.5'>
                                                          {product.stock_status === 'instock' &&
                                                              product.price !== '' && (
                                                                  <p className='text-subheading-5-desktop text-grey-white'>
                                                                      {formatRupiah(product.price)}
                                                                  </p>
                                                              )}
                                                          {priceHistory.length > 1 && (
                                                              <div className='flex items-center gap-0.5'>
                                                                  <Icons
                                                                      icon={isPositiveChange ? 'ArrowUp' : 'ArrowUp'}
                                                                      width={12}
                                                                      height={12}
                                                                      className={
                                                                          isPositiveChange
                                                                              ? 'text-success-500'
                                                                              : 'text-error-500 rotate-180 transform'
                                                                      }
                                                                  />
                                                                  <span
                                                                      className={classNames(
                                                                          'text-paragraph-8-desktop !leading-none',
                                                                          {
                                                                              'text-green-600': isPositiveChange,
                                                                              'text-red-600': !isPositiveChange
                                                                          }
                                                                      )}
                                                                  >
                                                                      {isPositiveChange ? '+' : ''}
                                                                      {(
                                                                          ((priceHistory[priceHistory.length - 1]
                                                                              .price_change -
                                                                              priceHistory[0].price_change) /
                                                                              priceHistory[0].price) *
                                                                          100
                                                                      ).toFixed(2)}
                                                                      %
                                                                  </span>
                                                                  <span
                                                                      className={classNames(
                                                                          'text-paragraph-8-desktop !leading-none',
                                                                          {
                                                                              'text-green-600': isPositiveChange,
                                                                              'text-red-600': !isPositiveChange,
                                                                              'text-grey-500':
                                                                                  priceHistory[priceHistory.length - 1]
                                                                                      .price_change ===
                                                                                  priceHistory[0].price_change
                                                                          }
                                                                      )}
                                                                  >
                                                                      (
                                                                      {formatRupiah(
                                                                          priceHistory[priceHistory.length - 1]
                                                                              .price_change
                                                                      )}
                                                                      )
                                                                  </span>
                                                              </div>
                                                          )}
                                                      </div>

                                                      <div>
                                                          {product.stock_status !== 'outofstock' ? (
                                                              <a
                                                                  href={getWhatsAppLinkFromTemplate(
                                                                      'detailProduct',
                                                                      product.name,
                                                                      typeof window !== 'undefined'
                                                                          ? window.location.href
                                                                          : `/collections/${product.slug}`
                                                                  )}
                                                                  target='_blank'
                                                                  rel='noopener noreferrer'
                                                                  onClick={() =>
                                                                      trackEvent(GA_EVENTS.CONTACT_WA, {
                                                                          'Button Location': 'Button reserve',
                                                                          'Button Page': locationMatch?.label
                                                                      })
                                                                  }
                                                              >
                                                                  {/* <Button variant='secondaryInverse'>
                                                                      Reserve This Watch
                                                                  </Button> */}
                                                                  <Button
                                                                      variant='secondaryInverse'
                                                                      block
                                                                      className='capitalize'
                                                                  >
                                                                      {t('common:reserve_this', {
                                                                          item: isWatch ? 'watch' : 'accessories'
                                                                      })}
                                                                  </Button>
                                                              </a>
                                                          ) : (
                                                              <button className='bg-grey-50 w-fit px-4 py-2' disabled>
                                                                  <p className='xl:text-paragraph-5-desktop text-paragraph-5-mobile text-grey-200 uppercase'>
                                                                      {t('common:sold')}
                                                                  </p>
                                                              </button>
                                                          )}
                                                      </div>
                                                  </div>
                                              </div>
                                          </div>
                                      </div>,
                                      document.body
                                  ) as unknown as React.ReactNode)
                                : null}
                            <div className='flex flex-col gap-6'>
                                {dataCollapse.map((item) => (
                                    <Collapse
                                        key={item.title}
                                        title={item.title}
                                        isOpen={openCollapse === item.title}
                                        onToggle={() =>
                                            setOpenCollapse((curr) => (curr === item.title ? null : item.title))
                                        }
                                    >
                                        <div className='xl:text-paragraph-8-desktop text-paragraph-8-mobile text-grey-500 meta'>
                                            {typeof item.content === 'string' ? (
                                                <div
                                                    dangerouslySetInnerHTML={{
                                                        __html: sanitizeHtml(item.content)
                                                    }}
                                                />
                                            ) : (
                                                item.content
                                            )}
                                        </div>
                                    </Collapse>
                                ))}
                                {isWatch && !isReservable && priceHistory && priceHistory.length > 0 && (
                                    <Collapse
                                        key='Performance'
                                        title='Performance'
                                        isOpen={openCollapse === 'Performance'}
                                        onToggle={() =>
                                            setOpenCollapse((curr) => (curr === 'Performance' ? null : 'Performance'))
                                        }
                                    >
                                        <div className='py-4'>
                                            <PriceChart productPrice={productPrice} />
                                        </div>
                                    </Collapse>
                                )}
                            </div>
                            <div className='flex w-full flex-col gap-2 rounded-lg bg-[#F7F7F7] p-5'>
                                <span className='text-grey-black xl:text-subheading-5-desktop text-subheading-5-mobile'>
                                    100% Authenticity Guaranteed
                                </span>
                                <span className='text-grey-200 xl:text-paragraph-8-desktop text-paragraph-8-mobile'>
                                    Carefully curated and verified for autheniticity
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Condition Modal */}
                <ModalV2
                    open={conditionModalOpen}
                    onClose={() => setConditionModalOpen(false)}
                    closeBackdrop
                    title='Watch Condition'
                    withClose
                    closePosition='right'
                    wrapperClassName='mx-4'
                >
                    <div className='flex flex-col gap-4'>
                        {isLoadingCondition ? (
                            <>
                                <Skeleton className='h-6 w-40' />
                                <Skeleton className='h-4 w-full' />
                                <Skeleton className='h-4 w-3/4' />
                                <Skeleton className='h-4 w-1/2' />
                            </>
                        ) : (
                            <>
                                <h6
                                    className='xl:text-subheading-6-desktop text-subheading-6-mobile text-grey-black
                                '
                                >
                                    {conditionModalContent?.title}
                                </h6>
                                <p
                                    className='xl:text-paragraph-8-desktop text-paragraph-8-mobile text-grey-500'
                                    dangerouslySetInnerHTML={{
                                        __html: sanitizeHtml(String(conditionModalContent?.description || ''))
                                    }}
                                />
                            </>
                        )}
                    </div>
                </ModalV2>
            </Container>
            <ImageZoom
                images={product.images}
                open={imageModalOpen}
                initialIndex={imageModalIndex}
                onClose={() => setImageModalOpen(false)}
            />
        </>
    )
}

export default DetailItem
