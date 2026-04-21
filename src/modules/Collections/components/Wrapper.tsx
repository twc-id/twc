import Button from '@components/buttons/Button'
import Container from '@components/Container'
import Icons from '@components/Icon'
import classNames from '@lib/classnames'
import Content from '@modules/Collections/components/Content'
import MobileFilterModal from '@modules/Collections/components/MobileFilterModal'
import Sidebar from '@modules/Collections/components/Sidebar'
import useCollectionsFilterStore from '@store/useCollectionsFilterStore'
import { motion } from 'motion/react'
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
    useTranslation(['collection'])
    const sectionRef = useRef<HTMLDivElement>(null)
    const topRef = useRef<HTMLDivElement>(null)

    const isMobile = useMediaQuery({ maxWidth: 1279 })

    // Mobile filter modal state
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
    const { filters, setFilter } = useCollectionsFilterStore()

    // Sticky top bar state (used for both mobile portal and desktop fixed)
    const [showTopSticky, setShowTopSticky] = useState(false)
    const [headerHeight, setHeaderHeight] = useState<number>(0)
    const [isHeaderVisible, setIsHeaderVisible] = useState<boolean>(true)

    const handleApplyFilters = (tempFilters: any) => {
        const keys = ['brands', 'availability', 'condition', 'gender', 'priceRange', 'sortBy'] as const
        keys.forEach((key) => {
            if (key in tempFilters) {
                setFilter(key, tempFilters[key])
            }
        })
    }

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

    // observe topRef visibility to show sticky bar when it's out of view
    // Works for both mobile (portal) and desktop (fixed portal)
    useEffect(() => {
        const el = topRef.current
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
    }, [headerHeight])

    // Fixed tab bar portal — works on both mobile and desktop.
    // Uses position:fixed (relative to viewport) so it's immune to
    // ancestor overflow/transform issues that break CSS sticky.
    const fixedTabBar = showTopSticky
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
                                          'xl:!text-button-3-desktop !text-button-3-mobile  w-[137px] py-3 transition-colors focus:outline-none',
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
                              className={classNames('!p-3 xl:hidden', {
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
        : null

    return (
        <>
            {fixedTabBar}

            <Container className='relative flex flex-col gap-7 xl:gap-10 xl:pb-11' ref={sectionRef}>
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: false, amount: 0.3 }}
                    transition={{ duration: 1, ease: [0.33, 1, 0.68, 1] }}
                    className={classNames(
                        'bg-grey-white dark:bg-grey-black z-[100] mt-px flex justify-between pb-[29px] pt-14 xl:pb-[41px] xl:pt-20',
                        { invisible: showTopSticky && !isMobile }
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
                </motion.div>

                {(() => {
                    const showSidebar = selectedTab === 0
                    return (
                        <>
                            <div className='flex flex-row xl:gap-10'>
                                {showSidebar && (
                                    <div
                                        className='hidden xl:block'
                                        style={{
                                            position: 'sticky',
                                            top: headerHeight + 16,
                                            alignSelf: 'flex-start'
                                        }}
                                    >
                                        <Sidebar
                                            products={data}
                                            brandOptions={brandOptions}
                                            brandLoading={brandLoading}
                                        />
                                    </div>
                                )}
                                <div className={showSidebar ? 'flex-1' : 'w-full'}>
                                    <Content
                                        products={data}
                                        isLoading={isLoading}
                                        isLoadingMore={isLoadingMore}
                                        onLoadMore={onLoadMore}
                                        hasMore={hasMore}
                                        total={total}
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
            </Container>
        </>
    )
}

export default Wrapper
