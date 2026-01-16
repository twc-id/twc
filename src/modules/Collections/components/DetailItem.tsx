import Breadcrumb from '@components/Breadcrumb'
import Button from '@components/buttons/Button'
import Container from '@components/Container'
import Icons from '@components/Icon'
import ImageZoom from '@components/ImageZoom/ImageZoom'
import UnstyledLink from '@components/links/UnstyledLink'
import Modal from '@components/Modal'
import { useGSAP } from '@gsap/react'
import classNames from '@lib/classnames'
import { formatRupiah } from '@utils/currency'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import { sanitize } from 'isomorphic-dompurify'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useCollapse } from 'react-collapsed'
import { createPortal } from 'react-dom'
import { useMediaQuery } from 'react-responsive'

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger)
}

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
        <div className='border-grey-100 border-b pb-2'>
            <button
                className='flex w-full items-center justify-between text-left'
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
    const [activeImageIndex, setActiveImageIndex] = useState(0)
    const [imageModalOpen, setImageModalOpen] = useState(false)
    const [imageModalIndex, setImageModalIndex] = useState(0)

    const [openCollapse, setOpenCollapse] = useState<string | null>('Description')

    const [showTopSticky, setShowTopSticky] = useState(false)
    const [headerHeight, setHeaderHeight] = useState<number>(0)
    const [isHeaderVisible, setIsHeaderVisible] = useState<boolean>(true)
    const isMobile = useMediaQuery({ maxWidth: 1279 })

    // Keep only the left images column pinned. Right side will scroll with the page.
    useGSAP(() => {
        const leftPinEl = pinRef.current
        const leftScrollEl = scrollRef.current
        // increase end buffer on desktop so the pin releases earlier
        // const endBuffer = typeof window !== 'undefined' && window.innerWidth >= 1280 ? 300 : 80

        let _leftWheelHandler: ((e: WheelEvent) => void) | null = null
        const roL = new ResizeObserver(() => ScrollTrigger.refresh())
        if (leftPinEl && leftScrollEl) {
            const id = 'detail-left-pin'
            ScrollTrigger.create({
                id,
                trigger: leftPinEl,
                start: 'top top',
                // end: () => `+=${Math.max(0, leftScrollEl.scrollHeight - leftScrollEl.clientHeight - endBuffer)}`,
                end: 'bottom bottom',
                pin: leftPinEl,
                pinSpacing: false
            })

            roL.observe(leftScrollEl)

            // When left pin is not yet active, forward wheel events to the page only
            // when the inner container cannot scroll further in the wheel direction.
            const wheelHandler = (e: WheelEvent) => {
                try {
                    const st = ScrollTrigger.getById(id)

                    // if ScrollTrigger exists and is active, let inner scrolling behave normally
                    if (st && st.isActive) return

                    const isHorizontal = leftScrollEl.scrollWidth > leftScrollEl.clientWidth

                    // choose the primary delta for user intent (horizontal vs vertical)
                    const primaryDelta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY

                    if (isHorizontal) {
                        const atLeft = leftScrollEl.scrollLeft <= 0
                        const atRight =
                            leftScrollEl.scrollLeft + leftScrollEl.clientWidth >= leftScrollEl.scrollWidth - 1

                        // if inner can scroll in the wheel direction, let it
                        if ((primaryDelta > 0 && !atRight) || (primaryDelta < 0 && !atLeft)) return

                        // otherwise forward horizontally to window vertical scroll
                        e.preventDefault()
                        window.scrollBy({ top: primaryDelta, behavior: 'auto' })
                    } else {
                        const atTop = leftScrollEl.scrollTop <= 0
                        const atBottom =
                            leftScrollEl.scrollTop + leftScrollEl.clientHeight >= leftScrollEl.scrollHeight - 1

                        if ((primaryDelta > 0 && !atBottom) || (primaryDelta < 0 && !atTop)) return

                        e.preventDefault()
                        window.scrollBy({ top: primaryDelta, behavior: 'auto' })
                    }
                } catch (err) {
                    // swallow
                }
            }

            _leftWheelHandler = wheelHandler
            leftScrollEl.addEventListener('wheel', wheelHandler, { passive: false })
        }

        const onLoad = () => ScrollTrigger.refresh()
        window.addEventListener('load', onLoad)

        return () => {
            ScrollTrigger.getById('detail-left-pin')?.kill()
            // remove wheel handler if attached
            try {
                if (leftScrollEl && _leftWheelHandler) leftScrollEl.removeEventListener('wheel', _leftWheelHandler)
            } catch (e) {
                // ignore
            }
            try {
                roL.disconnect()
            } catch (e) {
                // ignore
            }
            window.removeEventListener('load', onLoad)
            ScrollTrigger.refresh()
        }
    }, [product?.images?.length, product?.id, priceHistory?.length])

    // measure header height so we can position the portal below it
    useEffect(() => {
        if (typeof window === 'undefined') return
        const measure = () => {
            const hdr = document.querySelector('.nav-header') as HTMLElement | null
            const h = hdr ? Math.ceil(hdr.getBoundingClientRect().height) : 0
            setHeaderHeight(h)
            // eslint-disable-next-line no-console
            console.debug('Measured header height:', h)
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

        const onScroll = () => {
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

    // build basic info HTML and inject Brand at index 1
    const basicMetas = product?.meta_data?.filter((meta: any) => meta.key.startsWith('basic-info-')) || []

    const caliberValue = product?.meta_data?.filter((meta: any) => meta.key.startsWith('caliber-')) || []

    const caseValue = product?.meta_data?.filter((meta: any) => meta.key.startsWith('case-')) || []

    const breceletValue = product?.meta_data?.filter((meta: any) => meta.key.startsWith('bracelet-')) || []

    const brandValue = product?.brands?.[0]?.name ?? ''
    const accessoriesValue = product?.meta_data?.filter((meta: any) => meta.key.startsWith('accessories-type')) || []
    const accessoriesDetailsValue =
        product?.meta_data?.filter((meta: any) => meta.key.startsWith('accessories-details')) || []

    const basicItems = basicMetas.map((meta: any) => ({
        label: meta.key.replace('basic-info-', '').replace(/-/g, ' '),
        value: meta.value
    }))

    // Read is_new once from product meta_data (0 = false, 1 = true)
    const isNewMeta = (product?.meta_data || []).find((m: any) => String(m.key) === 'is_new')
    const isNewFlag = typeof isNewMeta !== 'undefined' ? Number(isNewMeta.value) === 1 : undefined

    const caliberItems = caliberValue.map((meta: any) => ({
        label: meta.key.replace('caliber-', '').replace(/-/g, ' '),
        value: meta.value
    }))

    const caseItems = caseValue.map((meta: any) => ({
        label: meta.key.replace('case-', '').replace(/-/g, ' '),
        value: meta.value
    }))

    const breceletItems = breceletValue.map((meta: any) => ({
        label: meta.key.replace('bracelet-', '').replace(/-/g, ' '),
        value: meta.value
    }))

    const accessoriesItems = accessoriesValue.map((meta: any) => ({
        label: meta.key.replace('accessories-type', '').replace(/-/g, ' '),
        value: meta.value
    }))

    const accessoriesDetailsItems = accessoriesDetailsValue.map((meta: any) => ({
        label: meta.key.replace('accessories-details', '').replace(/-/g, ' '),
        value: meta.value
    }))

    basicItems.splice(1, 0, { label: 'brand', value: brandValue })

    // If product has explicit `is_new` flag, ensure Basic Info contains a condition entry
    // representing Brand New / Unworn so it appears in the Basic Info section.
    if (isNewFlag === true) {
        const existingConditionIdx = basicItems.findIndex((i: any) => String(i.label).toLowerCase() === 'condition')
        if (existingConditionIdx > -1) {
            basicItems[existingConditionIdx].value = 'Brand New / Unworn'
        } else {
            const insertAt = Math.min(2, basicItems.length)
            basicItems.splice(insertAt, 0, { label: 'condition', value: 'Brand New / Unworn' })
        }
    }

    // merge status and condition into a single `condition` entry formatted as `status (condition)`
    try {
        const statusIdx = basicItems.findIndex((i: any) => String(i.label).toLowerCase() === 'status')
        const conditionIdx = basicItems.findIndex((i: any) => String(i.label).toLowerCase() === 'condition')

        if (statusIdx !== -1 || conditionIdx !== -1) {
            const statusVal = statusIdx !== -1 ? basicItems[statusIdx].value : ''
            const conditionVal = conditionIdx !== -1 ? basicItems[conditionIdx].value : ''
            const combined = statusVal && conditionVal ? `${statusVal} (${conditionVal})` : statusVal || conditionVal

            // remove original entries (remove higher index first)
            const toRemove = [statusIdx, conditionIdx].filter((i) => i > -1).sort((a, b) => b - a)
            toRemove.forEach((i) => basicItems.splice(i, 1))

            const insertAt = Math.max(
                0,
                Math.min(statusIdx > -1 ? statusIdx : conditionIdx > -1 ? conditionIdx : 1, basicItems.length)
            )
            basicItems.splice(insertAt, 0, { label: 'condition', value: combined })
        }
    } catch (e) {
        // swallow any unexpected errors to avoid breaking static generation
        console.warn('Failed to merge status/condition', e)
    }

    const [conditionModalOpen, setConditionModalOpen] = useState(false)
    const [conditionModalContent, setConditionModalContent] = useState<{
        title: string
        description: React.ReactNode
    } | null>(null)

    const getConditionContent = (val: string) => {
        const v = String(val || '').toLowerCase()

        const descriptions: Record<string, { title: string; description: string }> = {
            'brand new': {
                title: t('condition.brand_new.title'),
                description: t('condition.brand_new.description')
            },
            unworn: {
                title: t('condition.unworn.title'),
                description: t('condition.unworn.description')
            },
            'like new': {
                title: t('condition.like_new.title'),
                description: t('condition.like_new.description')
            },
            'very mint': {
                title: t('condition.very_mint.title'),
                description: t('condition.very_mint.description')
            },
            mint: {
                title: t('condition.mint.title'),
                description: t('condition.mint.description')
            },
            good: {
                title: t('condition.good.title'),
                description: t('condition.good.description')
            }
        }

        let matched = ''
        for (const k of Object.keys(descriptions)) {
            if (v.includes(k)) {
                matched = k
                break
            }
        }

        if (!matched) return null

        const entry = descriptions[matched]
        if (!entry) return null

        return { title: entry.title, description: entry.description }
    }

    const basicHtml = (() => {
        if (!basicItems || basicItems.length === 0) return 'No basic info available.'

        const parts = basicItems.map((item: any, idx: number) => {
            const label = String(item.label)

            const underline = /condition|brand/.test(label.toLowerCase())
            const underlineClass = underline ? ' underline' : ''

            if (label === 'brand' && item.value) {
                return (
                    <div key={idx} className='flex flex-col gap-2'>
                        <p className='xl:text-paragraph-7-desktop text-paragraph-7-mobile text-grey-200 !mb-0 capitalize'>
                            {label}
                        </p>
                        <p
                            className={`xl:text-paragraph-7-desktop text-paragraph-7-mobile text-grey-black capitalize !mb-0${underlineClass}`}
                        >
                            <a href={`/collections?product_brand=${product?.brands?.[0]?.id || ''}`}>{item.value}</a>
                        </p>
                    </div>
                )
            }

            if (label === 'condition' && item.value) {
                const displayLabel = isNewFlag === true ? 'Brand New / Unworn' : String(item.value)

                return (
                    <div key={idx} className='flex flex-col gap-2'>
                        <p className='xl:text-paragraph-7-desktop text-paragraph-7-mobile text-grey-200 !mb-0 capitalize'>
                            {label}
                        </p>
                        <button
                            type='button'
                            onClick={() => {
                                const c = getConditionContent(displayLabel)
                                if (!c) return
                                setConditionModalContent({ title: displayLabel, description: c.description })
                                setConditionModalOpen(true)
                            }}
                            className={`xl:text-paragraph-7-desktop text-paragraph-7-mobile text-grey-black text-left capitalize !mb-0${underlineClass}`}
                        >
                            {displayLabel}
                        </button>
                    </div>
                )
            }

            return (
                <div key={idx} className='flex flex-col gap-2'>
                    <p className='xl:text-paragraph-7-desktop text-paragraph-7-mobile text-grey-200 !mb-0 capitalize'>
                        {label}
                    </p>
                    <p
                        className={`xl:text-paragraph-7-desktop text-paragraph-7-mobile text-grey-black capitalize !mb-0${underlineClass}`}
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
                    <p class='capitalize xl:text-paragraph-7-desktop text-paragraph-7-mobile text-grey-200 !mb-0'>${label}</p>
                    <p class='capitalize xl:text-paragraph-7-desktop text-paragraph-7-mobile text-grey-black !mb-0'>${item.value}</p>
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
                    <p class='capitalize xl:text-paragraph-7-desktop text-paragraph-7-mobile text-grey-200 !mb-0'>${label}</p>
                    <p class='capitalize xl:text-paragraph-7-desktop text-paragraph-7-mobile text-grey-black !mb-0'>${item.value}</p>
                </div>
            `
        })

        return `<div class='grid grid-rows-2 grid-cols-2 justify-between gap-y-6'>${parts.join('')}</div>`
    })()

    const breceletHtml = (() => {
        if (!breceletItems || breceletItems.length === 0) return 'No bracelet info available.'

        const parts = breceletItems.map((item: any) => {
            const label = String(item.label)
            return `
                <div class='flex flex-col gap-2'>
                    <p class='capitalize xl:text-paragraph-7-desktop text-paragraph-7-mobile text-grey-200 !mb-0'>${label}</p>
                    <p class='capitalize xl:text-paragraph-7-desktop text-paragraph-7-mobile text-grey-black !mb-0'>${item.value}</p>
                </div>
            `
        })

        return `<div class='grid grid-rows-2 grid-cols-2 justify-between gap-y-6'>${parts.join('')}</div>`
    })()

    const accessoriesHtml = (() => {
        if (!accessoriesItems || accessoriesItems.length === 0) return 'No accessories info available.'

        const parts = accessoriesItems.map((item: any) => {
            const label = String(item.label)
            return `
                <div class='flex flex-col gap-2'>
                    <p class='capitalize xl:text-paragraph-7-desktop text-paragraph-7-mobile text-grey-200 !mb-0'>${label}</p>
                    <p class='capitalize xl:text-paragraph-7-desktop text-paragraph-7-mobile text-grey-black !mb-0'>${item.value}</p>
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
                                className='xl:text-paragraph-7-desktop text-paragraph-7-mobile text-grey-black !mb-0 capitalize'
                                dangerouslySetInnerHTML={{
                                    __html: sanitize(item.value)
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
                content: breceletHtml
            }
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
            <Container className='flex flex-col gap-14 pt-[230px] xl:flex-row xl:gap-20 xl:pt-[100px]'>
                {/* Images column: independently scrollable and GSAP-pinned until images end */}
                <div ref={pinRef as any} className='relative w-full xl:w-auto'>
                    {/* left vertical indicators */}
                    <div className='absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 flex-row items-center gap-3 xl:left-[-28px] xl:top-1/2 xl:-translate-y-1/2 xl:translate-x-0 xl:flex-col'>
                        {product.images.map((_: any, i: any) => (
                            <button
                                key={i}
                                onClick={() => scrollToImage(i)}
                                className={`rounded-full transition-all duration-200 ${
                                    i === activeImageIndex ? 'bg-grey-500 h-1.5 w-1.5' : 'bg-grey-200 h-1 w-1'
                                }`}
                                aria-label={`Image ${i + 1}`}
                            />
                        ))}
                    </div>

                    <div
                        ref={scrollRef as any}
                        className='scrollbar-none flex w-full snap-x snap-mandatory flex-row gap-6 overflow-x-auto scroll-smooth px-4 xl:snap-y xl:flex-col xl:overflow-y-auto xl:px-0'
                        style={{ maxHeight: 'calc(100vh - 160px)' }}
                    >
                        {product.images.length > 0 ? (
                            product.images.map((img: any, index: number) => (
                                <div
                                    key={index}
                                    className='relative h-[420px] w-full min-w-full flex-shrink-0 snap-center xl:h-[calc(100vh-160px)] xl:w-[500px] xl:min-w-[500px] xl:snap-start'
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
                            <div className='relative h-[420px] w-full min-w-full flex-shrink-0 snap-center xl:h-[calc(100vh-160px)] xl:w-[500px] xl:min-w-[500px] xl:snap-start'>
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

                <div className='scrollbar-none flex w-full flex-col gap-12'>
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
                                        __html: sanitize(product?.brands?.[0]?.name)
                                    }}
                                />
                            </UnstyledLink>

                            <h1 className='xl:text-paragraph-1-desktop text-paragraph-1-mobile text-grey-black'>
                                {product.name}
                            </h1>

                            {product.meta_data.find((meta: any) => meta.key === 'reference') && isWatch && (
                                <p className='xl:text-paragraph-7-desktop text-paragraph-7-mobile text-grey-200'>
                                    Ref.{' '}
                                    <span className=''>
                                        {product.meta_data.find((meta: any) => meta.key === 'reference')?.value}
                                    </span>
                                </p>
                            )}

                            <div className='flex flex-row gap-1 pt-2 xl:pt-0'>
                                {product.tags.map((item: any) => (
                                    <div
                                        className='border-grey-500 flex items-center rounded-full border'
                                        key={item.name}
                                    >
                                        <span className='xl:text-paragraph-9-desktop text-paragraph-9-mobile text-grey-500 px-3 py-[5px] capitalize xl:!leading-none'>
                                            {item.name}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <div ref={priceRef as any} className='hidden flex-col gap-2 pt-6 xl:flex xl:gap-3'>
                                {product.price !== '' && (
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
                                                'xl:!text-paragraph-7-desktop !text-paragraph-7-mobile',
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
                                                'xl:!text-paragraph-7-desktop !text-paragraph-7-mobile',
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
                                {product.purchasable ? (
                                    <a
                                        href='
                        https://api.whatsapp.com/send/?phone=628121396688&text=Hello+TheWatchCollections%2C&type=phone_number&app_absent=0'
                                        target='_blank'
                                        rel='noopener noreferrer'
                                    >
                                        <Button variant='secondaryInverse' block>
                                            {t('common:reserve_this', {
                                                item: isWatch ? t('common:watch') : t('common:accesoris')
                                            })}
                                        </Button>
                                    </a>
                                ) : (
                                    <button className='bg-grey-50 w-fit px-4 py-2' disabled>
                                        <p className='xl:text-paragraph-4-desktop text-paragraph-4-mobile text-grey-200 uppercase'>
                                            {t('common:sold')}
                                        </p>
                                    </button>
                                )}
                            </div>
                        </div>

                        {isMobile && (
                            <div className='fixed bottom-0 left-0 right-0 z-50 xl:hidden'>
                                <div className='mx-auto max-w-screen-md '>
                                    <div className='bg-dropdown-menu-overlay/80 flex items-center justify-between px-5 py-4 shadow-lg'>
                                        <div className='flex flex-col gap-1'>
                                            {product.price !== '' && (
                                                <p className='text-grey-white text-paragraph-3-mobile'>
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
                                                        className={classNames('text-paragraph-7-mobile', {
                                                            'text-green-600': isPositiveChange,
                                                            'text-red-600': !isPositiveChange
                                                        })}
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
                                                        className={classNames('text-paragraph-7-mobile', {
                                                            'text-green-600': isPositiveChange,
                                                            'text-red-600': !isPositiveChange,
                                                            'text-grey-500':
                                                                priceHistory[priceHistory.length - 1].price_change ===
                                                                priceHistory[0].price_change
                                                        })}
                                                    >
                                                        (
                                                        {formatRupiah(
                                                            priceHistory[priceHistory.length - 1].price_change
                                                        )}
                                                        )
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        <div className='ml-4 flex shrink-0 items-center'>
                                            {product.purchasable ? (
                                                <Button variant='secondaryInverse'>
                                                    {' '}
                                                    {t('common:reserve', {
                                                        item: isWatch ? t('common:watch') : t('common:item')
                                                    })}
                                                </Button>
                                            ) : (
                                                <button className='bg-grey-50 w-fit px-4 py-2' disabled>
                                                    <p className='xl:text-paragraph-4-desktop text-paragraph-4-mobile text-grey-200 uppercase'>
                                                        {t('common:sold')}
                                                    </p>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Mobile: sticky top bar (below header) with back button + product name */}
                        {isMobile && (
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
                                            onClick={() => router.back()}
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
                            </div>
                        )}

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
                                              <div className='flex flex-col gap-1'>
                                                  <h4 className='text-subheading-4-desktop text-grey-white capitalize'>
                                                      {product.name}
                                                  </h4>
                                                  <p className='text-grey-200 text-paragraph-7-desktop uppercase'>
                                                      {product.brands?.[0]?.name}
                                                  </p>
                                              </div>

                                              <div className='flex items-center gap-8'>
                                                  <div className='flex flex-col items-end'>
                                                      {product.price !== '' && (
                                                          <p className='text-paragraph-3-desktop  text-grey-white'>
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
                                                                      'text-paragraph-7-desktop !leading-none',
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
                                                                      'text-paragraph-7-desktop !leading-none',
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
                                                                      priceHistory[priceHistory.length - 1].price_change
                                                                  )}
                                                                  )
                                                              </span>
                                                          </div>
                                                      )}
                                                  </div>

                                                  <div>
                                                      {product.purchasable ? (
                                                          <a
                                                              href='
                        https://api.whatsapp.com/send/?phone=628121396688&text=Hello+TheWatchCollections%2C&type=phone_number&app_absent=0'
                                                              target='_blank'
                                                              rel='noopener noreferrer'
                                                          >
                                                              <Button variant='secondaryInverse'>
                                                                  {t('common:reserve_this', {
                                                                      item: isWatch
                                                                          ? t('common:watch')
                                                                          : t('common:accesoris')
                                                                  })}
                                                              </Button>
                                                          </a>
                                                      ) : (
                                                          <button className='bg-grey-50 w-fit px-4 py-2' disabled>
                                                              <p className='xl:text-paragraph-4-desktop text-paragraph-4-mobile text-grey-200 uppercase'>
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
                                    <div className='xl:text-paragraph-7-desktop text-paragraph-7-mobile text-grey-500 meta'>
                                        {typeof item.content === 'string' ? (
                                            <div dangerouslySetInnerHTML={{ __html: sanitize(item.content) }} />
                                        ) : (
                                            item.content
                                        )}
                                    </div>
                                </Collapse>
                            ))}
                            {isWatch && (
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
                            <span className='text-grey-200 xl:text-paragraph-7-desktop text-paragraph-7-mobile'>
                                Carefully curated and verified for autheniticity
                            </span>
                        </div>
                    </div>
                </div>
                {/* Condition Modal */}
                <Modal
                    open={conditionModalOpen}
                    onClose={() => setConditionModalOpen(false)}
                    closeBackdrop
                    title='Watch Condition'
                    withClose
                    closePosition='right'
                    fullscreen={isMobile}
                >
                    <div className='flex flex-col gap-4'>
                        <h6
                            className='xl:text-subheading-6-desktop text-subheading-6-mobile text-grey-black
                        '
                        >
                            {conditionModalContent?.title}
                        </h6>
                        <p className='xl:text-paragraph-7-desktop text-paragraph-7-mobile text-grey-500'>
                            {conditionModalContent?.description}
                        </p>
                    </div>
                </Modal>
            </Container>
            {/* Image zoom modal */}
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
