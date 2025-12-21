import Button from '@components/buttons/Button'
import Container from '@components/Container'
import { useGSAP } from '@gsap/react'
import Content from '@modules/Collections/components/Content'
import Sidebar from '@modules/Collections/components/Sidebar'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import { useTranslation } from 'next-i18next'
import React, { useEffect, useRef, useState } from 'react'

interface WrapperProps {
    data: any
    isLoading?: boolean
    onLoadMore?: () => void
    hasMore?: boolean
    isLoadingMore?: boolean
    total?: number | null
}

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger)
}

const Wrapper: React.FC<WrapperProps> = ({ data, isLoading, onLoadMore, hasMore, isLoadingMore, total }) => {
    const { t } = useTranslation(['collection'])
    const [tab, setTab] = useState('Watches')
    const sectionRef = useRef<HTMLDivElement>(null)
    const contentRef = useRef<HTMLDivElement>(null)
    const topRef = useRef<HTMLDivElement>(null)
    const sidebarRef = useRef<HTMLDivElement>(null)
    const pinTriggerRef = useRef<any>(null)
    const tabs = [t('home:highlight.tabs.watches'), t('home:highlight.tabs.accessories')]

    const handleChangeTab = (selectedTab: string) => {
        setTab(selectedTab)
    }

    useGSAP(() => {
        const timeline = gsap.timeline({
            scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top 80%',
                // end will be calculated based on the inner content height so the section remains pinned
                end: () => {
                    const contentEl: any = contentRef.current
                    if (!contentEl) return '+=100%'
                    const extra = 100 // small buffer
                    const delta = Math.max(0, contentEl.scrollHeight - window.innerHeight + extra)
                    return `+=${delta}`
                },
                id: 'collections-wrapper-animation',
                toggleActions: 'restart none none reset'
            }
        })

        timeline.fromTo(topRef.current, { opacity: 0 }, { opacity: 1, duration: 1, ease: 'power2.out' })

        // pin the top header only; content will be scrollable inside the pinned section
        pinTriggerRef.current = ScrollTrigger.create({
            trigger: topRef.current,
            start: 'top top',
            end: () => {
                const contentEl: any = contentRef.current
                if (!contentEl) return '+=100%'
                const extra = 100
                const delta = Math.max(0, contentEl.scrollHeight - window.innerHeight + extra)
                return `+=${delta}`
            },
            pin: true,
            pinSpacing: false,
            id: 'collections-wrapper-top-pin',
            pinnedContainer: sectionRef.current
        })

        // Cleanup
        return () => {
            timeline.scrollTrigger?.kill()
            pinTriggerRef.current?.kill?.()
        }
    }, [])

    // make content scrollable while header is pinned and handle bottom-reached events
    useEffect(() => {
        const el = contentRef.current
        const sideEl = sidebarRef.current
        if (!el) return

        const headerHeight = topRef.current?.offsetHeight || 0
        el.style.maxHeight = `calc(100vh - ${headerHeight}px)`
        el.style.overflowY = 'auto'

        if (sideEl) {
            // sidebar should not scroll unless its content exceeds viewport
            if (sideEl.scrollHeight > window.innerHeight - headerHeight) {
                sideEl.style.maxHeight = `calc(100vh - ${headerHeight}px)`
                sideEl.style.overflowY = 'auto'
            } else {
                sideEl.style.overflowY = 'visible'
            }
        }

        let loadingTriggered = false

        const onScroll = () => {
            const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 1
            if (atBottom) {
                if (hasMore && onLoadMore && !isLoadingMore && !loadingTriggered) {
                    loadingTriggered = true
                    // onLoadMore()
                    setTimeout(() => {
                        loadingTriggered = false
                    }, 500)
                } else if (!hasMore) {
                    // release the pin so the page continues to the next section
                    pinTriggerRef.current?.kill()
                }
            }
        }

        el.addEventListener('scroll', onScroll)
        return () => el.removeEventListener('scroll', onScroll)
    }, [hasMore, isLoadingMore, onLoadMore])
    return (
        <Container className='flex flex-col xl:gap-10 xl:pt-20' ref={sectionRef}>
            <div className='bg-grey-white dark:bg-grey-black flex flex-row justify-between xl:pb-10' ref={topRef}>
                <h2 className='xl:text-subheading-1-desktop text-subheading-1-mobile'>Our Collections</h2>
                {/* Tabs */}
                <div className='border-grey-black flex w-full flex-row border xl:w-auto xl:justify-end'>
                    {tabs.map((item) => (
                        <button
                            key={item}
                            onClick={() => handleChangeTab(item)}
                            className={`xl:text-button-3-desktop text-button-3-mobile w-full py-3 transition-colors xl:w-[137px] ${
                                item === tab
                                    ? 'bg-grey-black text-grey-white'
                                    : 'bg-grey-white text-grey-black hover:bg-grey-100'
                            }`}
                        >
                            {item}
                        </button>
                    ))}
                </div>
            </div>

            <div className='flex flex-row xl:gap-10'>
                <Sidebar products={data} />
                <Content
                    products={data}
                    isLoading={isLoading}
                    onLoadMore={onLoadMore}
                    hasMore={hasMore}
                    isLoadingMore={isLoadingMore}
                    total={total}
                    contentRef={contentRef}
                />
            </div>
            {hasMore && (
                <div className='mt-6 flex flex-col items-center gap-5'>
                    {typeof total === 'number' && (
                        <span className='text-grey-500 xl:text-paragraph-6-desktop text-paragraph-6-mobile text-center'>
                            {data?.length ?? 0}/{total}
                        </span>
                    )}
                    <div className='flex w-full justify-center'>
                        <Button variant='secondaryInverse' disabled={isLoadingMore} onClick={onLoadMore}>
                            {isLoadingMore ? t('common:loading') : t('common:show_more')}
                        </Button>
                    </div>
                </div>
            )}
        </Container>
    )
}

export default Wrapper
