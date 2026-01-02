import Button from '@components/buttons/Button'
import Container from '@components/Container'
import Icons from '@components/Icon'
import { useGSAP } from '@gsap/react'
import classNames from '@lib/classnames'
import Content from '@modules/Collections/components/Content'
import MobileFilterModal from '@modules/Collections/components/MobileFilterModal'
import Sidebar from '@modules/Collections/components/Sidebar'
import useCollectionsFilterStore from '@store/useCollectionsFilterStore'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import { useTranslation } from 'next-i18next'
import React, { useRef, useState } from 'react'
import { useMediaQuery } from 'react-responsive'

interface WrapperProps {
    data: any
    isLoading?: boolean
    onLoadMore?: () => void
    hasMore?: boolean
    isLoadingMore?: boolean
    total?: number | null
    tabs: string[]
    selectedTab?: number
    onTabChange?: (index: number) => void
    brandOptions?: Array<{ id: string; name: string }>
    brandLoading?: boolean
}

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger)
}

const Wrapper: React.FC<WrapperProps> = ({
    data,
    isLoading,
    onLoadMore,
    hasMore,
    isLoadingMore,
    total,
    tabs,
    selectedTab,
    onTabChange,
    brandOptions,
    brandLoading
}) => {
    const { t } = useTranslation(['collection'])
    const sectionRef = useRef<HTMLDivElement>(null)
    const contentRef = useRef<HTMLDivElement>(null)
    const topRef = useRef<HTMLDivElement>(null)

    const isMobile = useMediaQuery({ maxWidth: 1279 })

    const pinTriggerRef = useRef<any>(null)

    // Mobile filter modal state
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
    const { filters, setFilter } = useCollectionsFilterStore()

    const handleApplyFilters = (tempFilters: any) => {
        // Apply all temp filters to the store
        const keys = ['brands', 'availability', 'condition', 'gender', 'priceRange', 'sortBy'] as const
        keys.forEach((key) => {
            if (key in tempFilters) {
                setFilter(key, tempFilters[key])
            }
        })
    }

    useGSAP(() => {
        // Use GSAP matchMedia for different viewport animations
        const mm = gsap.matchMedia()

        // Desktop: Existing animations
        mm.add('(min-width: 1280px)', () => {
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
                pin: true,
                pinSpacing: false,
                id: 'collections-wrapper-top-pin',
                pinnedContainer: sectionRef.current
            })

            return () => {
                timeline.scrollTrigger?.kill()
                timeline.kill()
                pinTriggerRef.current?.kill?.()
            }
        })

        // Cleanup matchMedia when component unmounts or deps change
        return () => {
            mm.revert()
        }
    }, [])

    return (
        <Container className='relative flex flex-col gap-14 pt-14 xl:gap-10 xl:pt-20' ref={sectionRef}>
            <div className='bg-grey-white dark:bg-grey-black z-50 flex justify-between  xl:pb-10' ref={topRef}>
                <h2 className='xl:text-subheading-1-desktop text-subheading-1-mobile text-grey-black hidden xl:block'>
                    Our Collections
                </h2>
                {/* Tabs */}
                <div
                    className={classNames('border-grey-black flex flex-row border xl:w-auto xl:justify-end', {
                        'w-full': selectedTab !== 0
                    })}
                >
                    {tabs.map((item, idx) => (
                        <button
                            key={`${item}-${idx}`}
                            onClick={() => onTabChange?.(idx)}
                            className={classNames(
                                'xl:!text-button-3-desktop !text-button-3-mobile  w-[137px] py-3 transition-colors',
                                {
                                    'bg-grey-black text-grey-white': idx === (selectedTab ?? 0),
                                    'bg-grey-white text-grey-black hover:bg-grey-100': idx !== (selectedTab ?? 0),
                                    'w-full': selectedTab !== 0 && isMobile
                                }
                            )}
                        >
                            {item}
                        </button>
                    ))}
                </div>
                <Button
                    variant='secondaryInverse'
                    className={classNames('!p-3 xl:hidden', {
                        hidden: selectedTab !== 0
                    })}
                    onClick={() => setIsFilterModalOpen(true)}
                >
                    <Icons
                        icon='Filter'
                        width={16}
                        height={16}
                        className='text-grey-black
                    '
                    />
                </Button>
            </div>

            {(() => {
                const showSidebar = selectedTab === 0
                return (
                    <>
                        <div className='flex flex-row xl:gap-10'>
                            {showSidebar && (
                                <Sidebar products={data} brandOptions={brandOptions} brandLoading={brandLoading} />
                            )}
                            <div className={showSidebar ? 'flex-1' : 'w-full'}>
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
                        </div>

                        {/* Mobile Filter Modal */}
                        {showSidebar && (
                            <MobileFilterModal
                                open={isFilterModalOpen}
                                onClose={() => setIsFilterModalOpen(false)}
                                onApply={handleApplyFilters}
                                initialFilters={filters}
                                brandOptions={brandOptions}
                                brandLoading={brandLoading}
                            />
                        )}
                    </>
                )
            })()}
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
