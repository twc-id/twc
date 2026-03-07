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
import React, { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
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
    const [isPin, setIsPin] = useState(false)

    const isMobile = useMediaQuery({ maxWidth: 1279 })

    const pinTriggerRef = useRef<any>(null)

    // Mobile filter modal state
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
    const { filters, setFilter } = useCollectionsFilterStore()

    // Sticky top bar state for mobile
    const [showTopSticky, setShowTopSticky] = useState(false)
    const [headerHeight, setHeaderHeight] = useState<number>(0)
    const [isHeaderVisible, setIsHeaderVisible] = useState<boolean>(true)

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
                    end: 'bottom 20%',
                    id: 'collections-wrapper-animation',
                    toggleActions: 'restart none none reset'
                }
            })

            timeline.fromTo(topRef.current, { opacity: 0 }, { opacity: 1, duration: 1, ease: 'power2.out' })

            // Pin the entire section and scroll-jack the content
            pinTriggerRef.current = ScrollTrigger.create({
                trigger: sectionRef.current,
                start: '60px top',
                onEnterBack: () => {
                    setIsPin(true)
                },
                onEnter: () => {
                    setIsPin(true)
                },
                onLeaveBack: () => {
                    setIsPin(false)
                },
                onLeave: () => {
                    setIsPin(false)
                },
                end: () => {
                    const contentEl: any = contentRef.current
                    if (!contentEl) return '+=100%'
                    // Calculate the scrollable height of content
                    const contentScrollHeight = contentEl.scrollHeight - contentEl.clientHeight
                    return `+=${contentScrollHeight + window.innerHeight}`
                },
                pin: true,
                pinSpacing: true,
                id: 'collections-wrapper-top-pin',
                onUpdate: (self) => {
                    const contentEl: any = contentRef.current
                    if (!contentEl) return

                    // Calculate how much we should scroll the content
                    const contentScrollHeight = contentEl.scrollHeight - contentEl.clientHeight
                    const scrollAmount = self.progress * contentScrollHeight

                    // Apply scroll to content
                    contentEl.scrollTop = scrollAmount
                }
            })

            return () => {
                timeline.scrollTrigger?.kill()
                timeline.kill()
                pinTriggerRef.current?.kill?.()
            }
        })

        // Note: Mobile pin is removed - using portal sticky top bar instead

        // Cleanup matchMedia when component unmounts or deps change
        return () => {
            mm.revert()
        }
    }, [])

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

    // observe topRef visibility to show sticky header when it's out of view (mobile only)
    useEffect(() => {
        const el = topRef.current
        if (!el || typeof window === 'undefined' || !isMobile) return

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
    }, [isMobile, headerHeight])

    // Refresh ScrollTrigger when data changes (e.g., "Show More" is clicked)
    useEffect(() => {
        if (!isMobile && data && data.length > 0) {
            // Wait for DOM to update, then refresh ScrollTrigger
            const timeout = setTimeout(() => {
                ScrollTrigger.refresh()
            }, 100)

            return () => clearTimeout(timeout)
        }
    }, [data, isMobile])

    return (
        <>
            {/* Mobile: sticky top bar (below header) with tabs + filter button - render via portal */}
            {isMobile && showTopSticky
                ? (createPortal(
                      <div
                          aria-hidden={!showTopSticky}
                          className='mx-auto my-0 box-border w-[90%] min-w-full max-w-[1400px] px-3 py-0 xl:min-w-[1210px]'
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
                              <div
                                  className={classNames(
                                      'bg-grey-white dark:bg-grey-black  z-[100] flex justify-between pb-4 pt-7 shadow-sm   '
                                  )}
                              >
                                  <h2 className='xl:text-subheading-1-desktop text-subheading-1-mobile text-grey-black hidden xl:block'>
                                      Our Collections
                                  </h2>
                                  {/* Tabs */}
                                  <div
                                      className={classNames('border-grey-black flex flex-row border', {
                                          'w-full': selectedTab !== 0
                                      })}
                                  >
                                      {tabs.map((item, idx) => (
                                          <button
                                              key={`${item}-${idx}`}
                                              onClick={() => onTabChange?.(idx)}
                                              className={classNames(
                                                  '!text-button-3-mobile  w-[137px] py-3 transition-colors focus:outline-none',
                                                  {
                                                      'bg-grey-black text-grey-white': idx === (selectedTab ?? 0),
                                                      'bg-grey-white text-grey-black hover:bg-grey-100':
                                                          idx !== (selectedTab ?? 0),
                                                      'w-full': selectedTab !== 0
                                                  }
                                              )}
                                          >
                                              {item}
                                          </button>
                                      ))}
                                  </div>
                                  <Button
                                      variant='secondaryInverse'
                                      className={classNames('!p-3', {
                                          hidden: selectedTab !== 0
                                      })}
                                      onClick={() => setIsFilterModalOpen(true)}
                                  >
                                      <Icons icon='Filter' width={16} height={16} className='text-grey-black' />
                                  </Button>
                              </div>
                          </div>
                      </div>,
                      document.body
                  ) as unknown as React.ReactNode)
                : null}

            <Container className='relative flex flex-col gap-7 xl:gap-10 ' ref={sectionRef}>
                <div
                    className={classNames(
                        'bg-grey-white dark:bg-grey-black z-[100] flex justify-between pb-7 pt-14 xl:pb-10 xl:pt-20',
                        {
                            'xl:!pb-0': isPin
                        }
                    )}
                    ref={topRef}
                >
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
                                    'xl:!text-button-3-desktop !text-button-3-mobile  w-[137px] py-3 transition-colors focus:outline-none',
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
        </>
    )
}

export default Wrapper
