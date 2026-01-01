/* eslint-disable react/no-danger-with-children */
import Breadcrumb from '@components/Breadcrumb'
import Container from '@components/Container'
import Input from '@components/forms/Input'
import Icons from '@components/Icon'
import UnstyledLink from '@components/links/UnstyledLink'
import NextImage from '@components/NextImage'
import { useTheme } from '@contexts/ThemeContext'
import { WooCommerce } from '@lib/api'
import classNames from '@lib/classnames'
import debounce from '@utils/debounce'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Form, { Field } from 'rc-field-form'
import React, { useEffect, useState } from 'react'
import { useMediaQuery } from 'react-responsive'

interface SubMenuItem {
    label: string
    items?: string[]
    href?: string
}

interface MenuItem {
    label: string
    subMenu?: SubMenuItem[]
    href?: string
}

const subMenuImages: Record<string, string> = {
    BRAND: '/images/navbar/brands.webp',
    AVAILABILITY: '/images/navbar/availability.webp',
    CONDITIONS: '/images/navbar/condition.webp',
    ACCESSORIES: '/images/navbar/accessories.webp'
}

const menuData: MenuItem[] = [
    {
        label: 'Our Collections',
        subMenu: [
            {
                label: 'Brand'
            },
            {
                label: 'Availability',
                items: ['IN STOCK', 'OUT OF STOCK']
            },
            {
                label: 'Conditions',
                items: ['Brand New', 'Pre-Owned']
            },
            {
                label: 'Accessories',
                href: '/collections?tab=accessories'
            }
        ]
    },
    { label: 'Sell Your Watch', href: '/sell' },
    { label: 'Reserve Your Watch', href: '/reserve' },
    { label: 'Pre-Order', href: '/pre-order' },
    { label: 'About Us', href: '/about-us' },
    { label: 'Article', href: '/articles' }
]

const Headers = () => {
    const router = useRouter()
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [hoveredMenuItem, setHoveredMenuItem] = useState<MenuItem | null>(null)
    const [selectedSubMenuItem, setSelectedSubMenuItem] = useState<SubMenuItem | null>(null)
    const [isVisible, setIsVisible] = useState(true)
    const [lastScrollY, setLastScrollY] = useState(0)
    const [brands, setBrands] = useState<any[]>([])

    const [form] = Form.useForm()
    const isMobile = useMediaQuery({ maxWidth: 1279 })
    const { setIsDarkSection } = useTheme()

    const handleBreadcrumbNavigate = (index: number) => {
        // index 0 -> Home, index 1 -> Our Collections
        if (index === 0) {
            setHoveredMenuItem(null)
            setSelectedSubMenuItem(null)
            return
        }

        if (index === 1) {
            // go back to collections view
            setSelectedSubMenuItem(null)
            setHoveredMenuItem(menuData[0])
            return
        }
    }

    const suggestionProducts = [
        {
            sku: '5968G0 PATEK PHILIPPE',
            title: 'Aquanaut White Gold Blue Dial',
            year: 'Pre-owned 2024',
            price: 'IDR 1.975.000.000',
            image: '/images/navbar/brands.webp'
        },
        {
            sku: '5968G PATEK PHILIPPE',
            title: 'Aquanaut White Gold Blue Dial',
            year: 'Pre-owned 2024',
            price: 'IDR 1.975.000.000',
            image: '/images/navbar/availability.webp'
        },
        {
            sku: '5968G0 PATEK PHILIPPE',
            title: 'Aquanaut White Gold Blue Dial',
            year: 'Pre-owned 2024',
            price: 'IDR 1.975.000.000',
            image: '/images/navbar/condition.webp'
        },
        {
            sku: '5968O PATEK PHILIPPE',
            title: 'Aquanaut White Gold Blue Dial',
            year: 'Pre-owned 2024',
            price: 'IDR 1.975.000.000',
            image: '/images/navbar/brands.webp'
        }
    ]

    const fetchBrands = async () => {
        try {
            const response = await WooCommerce.get(`products/brands?page=1&per_page=15`)

            const brand = response.data
            setBrands(brand)
        } catch (err) {
            console.error('Error fetching brands', err)
        }
    }

    useEffect(() => {
        fetchBrands()
    }, [])

    useEffect(() => {
        const handleScroll = debounce(() => {
            const currentScrollY = window.scrollY

            setIsScrolled(currentScrollY > 0)

            // Show navbar when scrolling up or at top
            if (currentScrollY < lastScrollY || currentScrollY < 10) {
                setIsVisible(true)
            }
            // Hide navbar when scrolling down
            else if (currentScrollY > lastScrollY && currentScrollY > 10) {
                setIsVisible(false)
            }

            setLastScrollY(currentScrollY)
        }, 100)

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [lastScrollY])

    useEffect(() => {
        if (isMenuOpen || isSearchOpen) {
            document.body.style.overflow = 'hidden'
            document.body.style.position = 'fixed'
            document.body.style.width = '100%'
            document.body.style.top = `-${window.scrollY}px`
        } else {
            const scrollY = document.body.style.top
            document.body.style.overflow = 'unset'
            document.body.style.position = 'static'
            document.body.style.width = 'auto'
            document.body.style.top = 'auto'
            if (scrollY) {
                window.scrollTo(0, parseInt(scrollY || '0') * -1)
            }
        }

        return () => {
            document.body.style.overflow = 'unset'
            document.body.style.position = 'static'
            document.body.style.width = 'auto'
            document.body.style.top = 'auto'
        }
    }, [isMenuOpen, isSearchOpen])

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && (isMenuOpen || isSearchOpen)) {
                setIsMenuOpen(false)
                setIsSearchOpen(false)
                setHoveredMenuItem(null)
                setSelectedSubMenuItem(null)
            }
        }

        document.addEventListener('keydown', handleEscape)
        return () => document.removeEventListener('keydown', handleEscape)
    }, [isMenuOpen, isSearchOpen])

    // Theme switching on route changes
    useEffect(() => {
        const handleRouteChangeComplete = () => {
            setIsDarkSection(false) // Switch to light mode on any page navigation
        }

        router.events.on('routeChangeComplete', handleRouteChangeComplete)

        // Set initial state based on current route
        setIsDarkSection(false)

        return () => {
            router.events.off('routeChangeComplete', handleRouteChangeComplete)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router.events])

    const handleMenuItemKeyDown = (e: React.KeyboardEvent, item: MenuItem) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            setHoveredMenuItem(item)
        }
    }

    const handleSubSubMenuItemKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            // Handle navigation or action for leaf menu item
        }
    }

    const renderMenu = () => (
        <button
            aria-label='Toggle menu'
            onClick={() => {
                setIsMenuOpen(!isMenuOpen)
                if (isMenuOpen) {
                    // Reset all states when closing menu
                    setHoveredMenuItem(null)
                    setSelectedSubMenuItem(null)
                } else {
                    // Auto open Our Collections when opening menu on desktop
                    if (window.innerWidth >= 1024) {
                        setHoveredMenuItem(menuData[0])
                    }
                }
            }}
            className={classNames('relative h-8 w-8  transition-all duration-300', {
                'pointer-events-none': isSearchOpen
            })}
        >
            <div
                className={classNames(
                    'absolute inset-0 transition-all duration-300',
                    isMenuOpen ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'
                )}
            >
                <Icons
                    icon='Hamburger'
                    width={isMobile ? 24 : 32}
                    height={isMobile ? 24 : 32}
                    className={classNames({
                        'text-white': !isScrolled,
                        'text-black': isScrolled,
                        hidden: isSearchOpen
                    })}
                />
            </div>
            <div
                className={classNames(
                    'absolute inset-0 transition-all duration-300',
                    isMenuOpen ? 'rotate-0 scale-100 opacity-100' : 'rotate-90 scale-0 opacity-0'
                )}
            >
                <Icons
                    icon='XClose'
                    width={isMobile ? 24 : 32}
                    height={isMobile ? 24 : 32}
                    className={!isScrolled ? 'text-white' : 'text-black'}
                />
            </div>
        </button>
    )

    return (
        <>
            <div
                className={classNames(
                    'sticky top-0 z-[9999] bg-transparent py-2.5 transition-all duration-300 xl:py-3.5',
                    {
                        'bg-[#0F0F0FCC] backdrop-blur-[20px]': isScrolled,
                        '-translate-y-full': !isVisible,
                        'translate-y-0': isVisible,
                        'bg-white': isSearchOpen,
                        'bg-black': isMenuOpen
                    }
                )}
            >
                <Container>
                    <div className='flex flex-row items-center justify-between'>
                        {renderMenu()}

                        <Link href='/' className='h-[52px] w-[54px]'>
                            <Icons
                                icon={!isScrolled ? 'LogoWhite' : 'LogoBlack'}
                                width={isMobile ? 46 : 54}
                                height={isMobile ? 44 : 52}
                                className={isSearchOpen ? 'hidden' : ''}
                            />
                        </Link>
                        <button
                            aria-label='Toggle search'
                            type='button'
                            onClick={() => {
                                const willOpen = !isSearchOpen
                                setIsSearchOpen(willOpen)
                                if (willOpen) {
                                    // close menu when opening search
                                    setIsMenuOpen(false)
                                    setHoveredMenuItem(null)
                                    setSelectedSubMenuItem(null)
                                }
                            }}
                            className='relative h-8 w-8 transition-all duration-300'
                        >
                            <Icons
                                icon='Search'
                                width={isMobile ? 24 : 32}
                                height={isMobile ? 24 : 32}
                                // className={!isScrolled ? 'text-white' : 'text-black'}

                                className={classNames({
                                    'text-white': !isScrolled && !isSearchOpen,
                                    'text-black': isScrolled || isSearchOpen
                                })}
                            />
                        </button>
                    </div>
                </Container>
            </div>
            {/* Dropdown Menu */}
            {isMenuOpen && (
                <div className='animate-fade-in fixed inset-0 top-0 z-[9998] overflow-hidden bg-black pt-[80px]'>
                    <Container className='h-full'>
                        <div className='flex h-full w-full gap-4 pt-5 xl:pt-10'>
                            {/* Grid 1: Main Menu - Hidden on mobile when submenu is selected */}
                            <div
                                className={classNames(
                                    'animate-slide-in-left flex flex-col space-y-4',
                                    'lg:min-w-[241px]',
                                    'max-lg:w-full',
                                    {
                                        'max-lg:hidden': hoveredMenuItem?.subMenu && window.innerWidth < 1024
                                    }
                                )}
                            >
                                {menuData.map((item) =>
                                    item.href ? (
                                        <UnstyledLink
                                            key={item.label}
                                            href={item.href}
                                            className='text-grey-200 hover:text-grey-white w-full cursor-pointer text-left transition-colors focus:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black'
                                            onClick={() => {
                                                setIsMenuOpen(false)
                                                setHoveredMenuItem(null)
                                                setSelectedSubMenuItem(null)
                                            }}
                                        >
                                            <div className='flex items-center gap-4'>
                                                <span className='xl:text-button-1-desktop text-button-1-mobile capitalize'>
                                                    {item.label}
                                                </span>
                                            </div>
                                        </UnstyledLink>
                                    ) : (
                                        <button
                                            key={item.label}
                                            type='button'
                                            className='text-grey-200 hover:text-grey-white w-full cursor-pointer text-left transition-colors focus:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black'
                                            onMouseEnter={() => {
                                                if (window.innerWidth >= 1024) {
                                                    setHoveredMenuItem(item)
                                                    setSelectedSubMenuItem(null)
                                                }
                                            }}
                                            onClick={() => {
                                                if (window.innerWidth < 1024 && item.subMenu) {
                                                    setHoveredMenuItem(item)
                                                    setSelectedSubMenuItem(null)
                                                }
                                            }}
                                            onKeyDown={(e) => handleMenuItemKeyDown(e, item)}
                                            aria-expanded={hoveredMenuItem === item}
                                            aria-haspopup={!!item.subMenu}
                                        >
                                            <div className='flex items-center justify-between gap-4 xl:justify-normal'>
                                                <span className='xl:text-button-1-desktop text-button-1-mobile'>
                                                    {item.label}
                                                </span>
                                                {item.subMenu && (
                                                    <span aria-hidden='true'>
                                                        <Icons icon='ChevronRight' width={16} height={16} />
                                                    </span>
                                                )}
                                            </div>
                                        </button>
                                    )
                                )}
                            </div>

                            {/* Grid 2: Content Area with Image */}
                            <div
                                className={classNames(
                                    'scrollbar-none flex-1 overflow-y-auto pb-10',
                                    'lg:pr-4',
                                    'max-lg:w-full',
                                    {
                                        'max-lg:hidden':
                                            !hoveredMenuItem?.subMenu ||
                                            (selectedSubMenuItem && window.innerWidth < 1024)
                                    }
                                )}
                            >
                                {hoveredMenuItem?.subMenu && (
                                    <div className='space-y-8'>
                                        {/* Breadcrumb - Mobile Only */}
                                        <div className='lg:hidden'>
                                            <Breadcrumb
                                                items={[{ title: 'Home', href: '/' }, { title: hoveredMenuItem.label }]}
                                                breakpoint='Mobile'
                                                onNavigate={(i) => handleBreadcrumbNavigate(i)}
                                                navigationClassName='text-button-5-mobile capitalize'
                                                lastItemClassName='text-button-5-mobile capitalize'
                                            />
                                        </div>

                                        {/* Desktop: BRAND Section - Full Width Image + Items Below */}
                                        <div className='hidden xl:block'>
                                            {hoveredMenuItem.subMenu.find((item) => item.label === 'Brand') && (
                                                <div className='animate-slide-in-left space-y-6'>
                                                    {/* Full Width Image */}
                                                    <div className='relative w-full overflow-hidden'>
                                                        <NextImage
                                                            src={subMenuImages.BRAND}
                                                            alt='Brands'
                                                            width={960}
                                                            height={301}
                                                            className='w-full object-cover '
                                                        />
                                                    </div>
                                                    {/* Title and Items */}
                                                    <div>
                                                        <h3 className='text-paragraph-7-desktop mb-4  text-gray-500'>
                                                            By Brands
                                                        </h3>
                                                        <div className='grid grid-flow-col grid-rows-4 gap-x-[100px] gap-y-2'>
                                                            {brands.map((item) => (
                                                                <UnstyledLink
                                                                    key={item}
                                                                    href={`/collections?product_brand=${item.id}`}
                                                                    className='xl:text-button-4-desktop text-button-4-mobile text-grey-200 hover:text-grey-100'
                                                                    dangerouslySetInnerHTML={{
                                                                        __html: item.name
                                                                    }}
                                                                    // eslint-disable-next-line react/no-children-prop
                                                                    children={undefined}
                                                                    onClick={() => setIsMenuOpen(false)}
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Mobile: SubMenu Categories */}
                                        <div className='grid grid-cols-2 gap-5 xl:hidden'>
                                            {hoveredMenuItem.subMenu.map((subItem) => {
                                                const img =
                                                    subMenuImages[subItem.label.toLocaleUpperCase()] ||
                                                    subMenuImages['ACCESSORIES']

                                                // On mobile, Accessories should navigate directly
                                                if (subItem.label === 'Accessories') {
                                                    return (
                                                        <UnstyledLink
                                                            key={subItem.label}
                                                            href={subItem.href || '/collections?tab=accessories'}
                                                            className='group flex w-full cursor-pointer flex-col gap-4'
                                                            onClick={() => setIsMenuOpen(false)}
                                                        >
                                                            <div className='h-[218px] w-full overflow-hidden'>
                                                                <Image
                                                                    src={img}
                                                                    alt={subItem.label}
                                                                    width={0}
                                                                    height={0}
                                                                    sizes='100vw'
                                                                    className='h-auto min-h-[218px] w-full object-cover transition-transform group-active:scale-105'
                                                                />
                                                            </div>
                                                            <h3 className='text-paragraph-7-mobile text-grey-200 text-left'>
                                                                By{' '}
                                                                {subItem.label.charAt(0) +
                                                                    subItem.label.slice(1).toLowerCase()}
                                                            </h3>
                                                        </UnstyledLink>
                                                    )
                                                }

                                                return (
                                                    <button
                                                        key={subItem.label}
                                                        type='button'
                                                        className='group flex w-full cursor-pointer flex-col gap-4'
                                                        onClick={() => setSelectedSubMenuItem(subItem)}
                                                    >
                                                        <div className='h-[218px] w-full overflow-hidden'>
                                                            <Image
                                                                src={img}
                                                                alt={subItem.label}
                                                                width={0}
                                                                height={0}
                                                                sizes='100vw'
                                                                className='h-auto min-h-[218px] w-full object-cover transition-transform group-active:scale-105'
                                                            />
                                                        </div>
                                                        <h3 className='text-paragraph-7-mobile text-grey-200 text-left'>
                                                            By{' '}
                                                            {subItem.label.charAt(0) +
                                                                subItem.label.slice(1).toLowerCase()}
                                                        </h3>
                                                    </button>
                                                )
                                            })}
                                        </div>

                                        {/* Desktop: AVAILABILITY & CONDITIONS Section - Side by Side */}
                                        <div className='hidden grid-cols-3 lg:grid xl:gap-14'>
                                            {/* AVAILABILITY */}
                                            {hoveredMenuItem.subMenu.find((item) => item.label === 'Availability') && (
                                                <div className='animate-slide-in-left flex flex-row items-end gap-8'>
                                                    <div className='relative h-[107px] w-[160px] overflow-hidden'>
                                                        <Image
                                                            src={subMenuImages.AVAILABILITY}
                                                            alt='Availability'
                                                            width={160}
                                                            height={107}
                                                        />
                                                    </div>
                                                    <div>
                                                        <h3 className='text-paragraph-7-desktop mb-3  text-gray-500'>
                                                            By Availability
                                                        </h3>
                                                        <div className='space-y-2'>
                                                            {hoveredMenuItem.subMenu
                                                                .find((item) => item.label === 'Availability')
                                                                ?.items?.map((item) => (
                                                                    <UnstyledLink
                                                                        key={item}
                                                                        href={
                                                                            item === 'IN STOCK'
                                                                                ? '/collections?availability=instock'
                                                                                : item === 'OUT OF STOCK'
                                                                                ? '/collections?availability=outofstock'
                                                                                : '#'
                                                                        }
                                                                        className='text-button-4-desktop text-grey-200 hover:text-grey-100 block text-left'
                                                                        onClick={() => setIsMenuOpen(false)}
                                                                    >
                                                                        {item}
                                                                    </UnstyledLink>
                                                                ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* CONDITIONS */}
                                            {hoveredMenuItem.subMenu.find((item) => item.label === 'Conditions') && (
                                                <div className='animate-slide-in-left flex flex-row items-end gap-8'>
                                                    <div className='relative h-[107px] w-[160px] overflow-hidden'>
                                                        <Image
                                                            src={subMenuImages.CONDITIONS}
                                                            alt='Conditions'
                                                            width={160}
                                                            height={107}
                                                        />
                                                    </div>
                                                    <div>
                                                        <h3 className='text-paragraph-7-desktop mb-3  text-gray-500'>
                                                            By Condition
                                                        </h3>
                                                        <div className='space-y-2'>
                                                            {hoveredMenuItem.subMenu
                                                                .find((item) => item.label === 'Conditions')
                                                                ?.items?.map((item) => (
                                                                    <button
                                                                        key={item}
                                                                        type='button'
                                                                        className='text-button-4-desktop text-grey-200 hover:text-grey-100 block text-left'
                                                                        onKeyDown={handleSubSubMenuItemKeyDown}
                                                                    >
                                                                        {item}
                                                                    </button>
                                                                ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            {/* ACCESSORIES */}
                                            {hoveredMenuItem.subMenu.find((item) => item.label === 'Accessories') && (
                                                <div className='animate-slide-in-left flex flex-row items-end gap-8'>
                                                    <div className='h-[107px] w-[160px] overflow-hidden'>
                                                        <Image
                                                            src={subMenuImages.ACCESSORIES}
                                                            alt='Accessories'
                                                            width={160}
                                                            height={107}
                                                        />
                                                    </div>
                                                    <div>
                                                        <div className='space-y-2'>
                                                            <UnstyledLink
                                                                href='/collections?tab=accessories'
                                                                className='text-button-4-desktop text-grey-200 hover:text-grey-100 block text-left'
                                                                onClick={() => setIsMenuOpen(false)}
                                                            >
                                                                See All Accessories
                                                            </UnstyledLink>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Grid 3: SubMenu Items Detail - Mobile Only */}
                            <div
                                className={classNames('scrollbar-none w-full overflow-y-auto pb-10 lg:hidden', {
                                    hidden: !selectedSubMenuItem
                                })}
                            >
                                {selectedSubMenuItem && (
                                    <div className='animate-slide-in-left space-y-6'>
                                        {/* Breadcrumb */}
                                        <Breadcrumb
                                            items={[
                                                { title: 'Home', href: '/' },
                                                { title: hoveredMenuItem?.label || '' },
                                                { title: selectedSubMenuItem.label }
                                            ]}
                                            breakpoint='Mobile'
                                            onNavigate={(i) => handleBreadcrumbNavigate(i)}
                                            navigationClassName='text-button-5-mobile !capitalize'
                                            lastItemClassName='text-button-5-mobile capitalize'
                                        />

                                        {/* Items List */}
                                        <div className='space-y-4'>
                                            {selectedSubMenuItem.label === 'Brand' &&
                                                brands.map((item) => (
                                                    <UnstyledLink
                                                        key={item}
                                                        href={`/collections?product_brand=${item.id}`}
                                                        className='text-button-1-mobile text-grey-200 block text-left transition-colors'
                                                        dangerouslySetInnerHTML={{
                                                            __html: item.name
                                                        }}
                                                        // eslint-disable-next-line react/no-children-prop
                                                        children={undefined}
                                                        onClick={() => setIsMenuOpen(false)}
                                                    />
                                                ))}
                                        </div>

                                        {/* Item list by condition */}
                                        {selectedSubMenuItem.label !== 'Brand' && selectedSubMenuItem.items && (
                                            <div className='space-y-4'>
                                                {selectedSubMenuItem.items.map((item) => (
                                                    <UnstyledLink
                                                        key={item}
                                                        href={
                                                            item === 'Brand New'
                                                                ? '/collections?condition=brand-new'
                                                                : item === 'Pre-Owned'
                                                                ? '/collections?condition=pre-owned-very-good'
                                                                : '#'
                                                        }
                                                        className='text-button-1-mobile text-grey-200 block text-left transition-colors'
                                                        onClick={() => setIsMenuOpen(false)}
                                                    >
                                                        {item}
                                                    </UnstyledLink>
                                                ))}
                                            </div>
                                        )}
                                        {/* Item Accessories */}
                                        {selectedSubMenuItem.label === 'Accessories' && (
                                            <div className='space-y-4'>
                                                <UnstyledLink
                                                    href='/collections?tab=accessories'
                                                    className='text-button-1-mobile text-grey-200 block text-left transition-colors'
                                                    onClick={() => setIsMenuOpen(false)}
                                                >
                                                    See All Accessories
                                                </UnstyledLink>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </Container>
                </div>
            )}

            {/* Search Dropdown */}
            {isSearchOpen && (
                <div
                    className='animate-fade-in fixed inset-0 top-[80px] z-50 overflow-auto'
                    onClick={() => {
                        // setIsSearchOpen(false)
                        setHoveredMenuItem(null)
                        setSelectedSubMenuItem(null)
                    }}
                >
                    {/* full-width white bar */}
                    <div className='h-full w-full bg-white'>
                        <div className='py-6' onClick={(e) => e.stopPropagation()}>
                            <Container>
                                <div className='mb-4'>
                                    <Form form={form}>
                                        <Field name='search'>
                                            <Input
                                                className='!rounded-none !border-x-0 !border-t-0'
                                                inputClassName='text-center'
                                                placeholder='Search'
                                            />
                                        </Field>
                                    </Form>
                                </div>

                                <div className='h-full w-full'>
                                    <h4 className='mb-4 text-sm text-gray-500'>Suggestions</h4>
                                    <div className='h-full w-full'>
                                        <div className='grid grid-cols-2 gap-6 md:grid-cols-4'>
                                            {suggestionProducts.map((p) => (
                                                <div
                                                    key={p.sku}
                                                    className='cursor-pointer text-center
                                                '
                                                    onClick={() => {
                                                        setIsSearchOpen(false)
                                                    }}
                                                >
                                                    <div className='mb-3 h-40 w-full overflow-hidden rounded'>
                                                        <NextImage
                                                            src={p.image}
                                                            alt={p.title}
                                                            width={240}
                                                            height={240}
                                                            className='h-full w-full object-contain'
                                                        />
                                                    </div>
                                                    <div className='text-xs text-gray-400'>{p.sku}</div>
                                                    <div className='mt-1 text-sm font-medium text-gray-800'>
                                                        {p.title}
                                                    </div>
                                                    <div className='text-xs text-gray-400'>{p.year}</div>
                                                    <div className='mt-1 text-sm font-semibold text-gray-800'>
                                                        {p.price}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </Container>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default Headers
