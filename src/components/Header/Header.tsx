/* eslint-disable react/no-danger-with-children */
import Breadcrumb from '@components/Breadcrumb'
import Container from '@components/Container'
import Input from '@components/forms/Input'
import CTA from '@components/Header/CTA'
import Icons from '@components/Icon'
import UnstyledLink from '@components/links/UnstyledLink'
import listLocation from '@constant/location'
import { useTheme } from '@contexts/ThemeContext'
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react'
import { useAssets } from '@hooks/useAsset'
import { WooCommerce } from '@lib/api'
import classNames from '@lib/classnames'
import { GA_EVENTS } from '@lib/constants/analyticsEvents'
import { trackEvent } from '@lib/ga'
import useProductStore from '@store/useProductStore'
import { formatRupiah } from '@utils/currency'
import debounce from '@utils/debounce'
import { decodeHtml, sanitizeHtml } from '@utils/html'
import Fuse from 'fuse.js'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import Form, { Field } from 'rc-field-form'
import React, { Fragment, useEffect, useMemo, useRef, useState } from 'react'
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

const languages = [
    { code: 'en', label: 'English' },
    { code: 'id', label: 'Indonesia' }
]

const menuData: MenuItem[] = [
    {
        label: 'Our Collections',
        href: '/collections',
        subMenu: [
            {
                label: 'Brand'
            },
            {
                label: 'Availability',
                items: ['In Stock', 'Out of Stock']
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
    { label: 'Watch Services', href: '/#service' },
    { label: 'Sell Your Watch', href: '/sell' },
    { label: 'Reserve Your Watch', href: '/reserve' },
    { label: 'About Us', href: '/about-us' },
    { label: 'Article', href: '/articles' }
]

// Page-specific styling configuration for navbar and icons
// Supports wildcard patterns (e.g., '/collections/*') for dynamic routes
interface PageStyle {
    navbar: {
        default: string // navbar bg when not scrolled
        scrolled: string // navbar bg when scrolled
    }
    icons: {
        default: string // icon color when not scrolled & visible
        scrolled: string // icon color when scrolled
        menuOpen: string // icon color when menu is open
        searchOpen: string // icon color when search is open
    }
    logo: {
        default: 'LogoWhite' | 'LogoBlack'
        scrolled: 'LogoWhite' | 'LogoBlack'
        menuOpen?: 'LogoWhite' | 'LogoBlack'
        searchOpen?: 'LogoWhite' | 'LogoBlack'
    }
}

const PAGE_STYLES: Record<string, PageStyle> = {
    '/collections': {
        navbar: {
            default: 'bg-transparent',
            scrolled: 'bg-grey-white'
        },
        icons: {
            default: 'text-grey-200',
            scrolled: 'text-black',
            menuOpen: 'text-grey-200',
            searchOpen: 'text-black'
        },
        logo: {
            default: 'LogoWhite',
            scrolled: 'LogoBlack'
        }
    },
    '/collections/*': {
        navbar: {
            default: 'bg-transparent',
            scrolled: 'bg-grey-white'
        },
        icons: {
            default: 'text-black',
            scrolled: 'text-black',
            menuOpen: 'text-grey-200',
            searchOpen: 'text-black'
        },
        logo: {
            default: 'LogoBlack',
            scrolled: 'LogoBlack',
            menuOpen: 'LogoWhite',
            searchOpen: 'LogoBlack'
        }
    },
    '/articles': {
        navbar: {
            default: 'bg-transparent',
            scrolled: 'bg-[#0F0F0FCC] backdrop-blur-[20px]'
        },
        icons: {
            default: 'text-grey-200',
            scrolled: 'text-grey-white',
            menuOpen: 'text-grey-200',
            searchOpen: 'text-black'
        },
        logo: {
            default: 'LogoBlack',
            scrolled: 'LogoWhite'
        }
    },

    '/article/*': {
        navbar: {
            default: 'bg-transparent',
            scrolled: 'bg-[#0F0F0FCC] backdrop-blur-[20px]'
        },
        icons: {
            default: 'text-grey-200',
            scrolled: 'text-grey-white',
            menuOpen: 'text-grey-200',
            searchOpen: 'text-black'
        },
        logo: {
            default: 'LogoBlack',
            scrolled: 'LogoWhite'
        }
    },
    '/privacy-policy': {
        navbar: {
            default: 'bg-transparent',
            scrolled: 'bg-[#0F0F0FCC] backdrop-blur-[20px]'
        },
        icons: {
            default: 'text-grey-200',
            scrolled: 'text-grey-white',
            menuOpen: 'text-grey-200',
            searchOpen: 'text-black'
        },
        logo: {
            default: 'LogoBlack',
            scrolled: 'LogoWhite'
        }
    },
    '/terms': {
        navbar: {
            default: 'bg-transparent',
            scrolled: 'bg-[#0F0F0FCC] backdrop-blur-[20px]'
        },
        icons: {
            default: 'text-grey-200',
            scrolled: 'text-grey-white',
            menuOpen: 'text-grey-200',
            searchOpen: 'text-black'
        },
        logo: {
            default: 'LogoBlack',
            scrolled: 'LogoWhite'
        }
    }
}

const DEFAULT_PAGE_STYLE: PageStyle = {
    navbar: {
        default: 'bg-transparent',
        scrolled: 'bg-[#0F0F0FCC] backdrop-blur-[20px]'
    },
    icons: {
        default: 'text-grey-200',
        scrolled: 'text-white',
        menuOpen: 'text-grey-200',
        searchOpen: 'text-black'
    },
    logo: {
        default: 'LogoWhite',
        scrolled: 'LogoWhite',
        menuOpen: 'LogoWhite',
        searchOpen: 'LogoBlack'
    }
}

const escapeRegExp = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const getPageStyle = (pathname: string): PageStyle => {
    const keys = Object.keys(PAGE_STYLES)

    // 1. First, try exact match (e.g., '/collections' only matches '/collections', not '/collections/abc')
    for (const key of keys) {
        if (!key.includes('*') && pathname === key) {
            return PAGE_STYLES[key]
        }
    }

    // 2. Then, try wildcard patterns (e.g., '/collections/*' matches '/collections/abc')
    for (const key of keys) {
        if (key.includes('*')) {
            const parts = key.split('*').map(escapeRegExp)
            const pattern = `^${parts.join('.*')}`
            const re = new RegExp(pattern)
            if (re.test(pathname)) return PAGE_STYLES[key]
        }
    }

    // 3. Finally, fallback to default
    return DEFAULT_PAGE_STYLE
}

// Helper to determine navbar background class based on all states
const getNavbarBgClass = (pageStyle: PageStyle, isScrolled: boolean, isMenuOpen: boolean, isSearchOpen: boolean) => {
    if (isMenuOpen) return 'bg-black'
    if (isSearchOpen) return 'bg-white'
    return isScrolled ? pageStyle.navbar.scrolled : pageStyle.navbar.default
}

// Helper to determine icon color class based on all states
const getIconClass = (
    pageStyle: PageStyle,
    isScrolled: boolean,
    isMenuOpen: boolean,
    isSearchOpen: boolean,
    isVisible: boolean
) => {
    if (isSearchOpen) return pageStyle.icons.searchOpen
    if (isMenuOpen) return pageStyle.icons.menuOpen
    if (isScrolled) return pageStyle.icons.scrolled
    return isVisible ? pageStyle.icons.default : pageStyle.icons.scrolled
}

// Helper to determine logo variant
const getLogoVariant = (
    pageStyle: PageStyle,
    isScrolled: boolean,
    isMenuOpen: boolean,
    isSearchOpen: boolean,
    isVisible: boolean
) => {
    if (isSearchOpen) return 'LogoBlack'
    if (isMenuOpen) return 'LogoWhite'
    if (!isScrolled && isVisible) return pageStyle.logo.default
    return pageStyle.logo.scrolled
}

// Paths where navbar should not be sticky (stay at top only)
const NON_STICKY_PATHS = ['']

const Headers = () => {
    const { t } = useTranslation(['collection', 'home', 'common'])
    const router = useRouter()
    const pageStyle = getPageStyle(router.pathname || router.asPath || '/')

    const currentLanguage = languages.find((lang) => lang.code === router.locale) || languages[0]

    const handleLanguageChange = (langCode: string) => {
        // Capture current scroll position so the locale switch doesn't jump to top.
        // scroll: false alone isn't enough here because changing locale re-fetches
        // page data and remounts the page, which resets the scroll position.
        const scrollY = window.scrollY
        router.push(router.asPath, router.asPath, { locale: langCode, scroll: false }).then(() => {
            window.scrollTo(0, scrollY)
        })
    }
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [hoveredMenuItem, setHoveredMenuItem] = useState<MenuItem | null>(null)
    const [selectedSubMenuItem, setSelectedSubMenuItem] = useState<SubMenuItem | null>(null)
    const [isVisible, setIsVisible] = useState(true)
    const [brands, setBrands] = useState<any[]>([])
    const [searchResults, setSearchResults] = useState<any[]>([])
    const [isSearching, setIsSearching] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [correctedQuery, setCorrectedQuery] = useState('')

    const [form] = Form.useForm()
    const isMobile = useMediaQuery({ maxWidth: 1279 })
    const { setIsDarkSection } = useTheme()
    const currentProduct = useProductStore((s) => s.currentProduct)
    const { assets } = useAssets()
    const brandImage = assets?.find((asset) => asset.name === 'header-1')?.media.url
    const availabitlyImage = assets?.find((asset) => asset.name === 'header-2')?.media.url
    const conditionImage = assets?.find((asset) => asset.name === 'header-3')?.media.url
    const accessoriesImage = assets?.find((asset) => asset.name === 'header-4')?.media.url
    const ctaImage = assets?.find((asset) => asset.name === 'header-5')?.media.url

    // Use ref to track scroll position to avoid stale closure issues
    const lastScrollYRef = useRef(0)
    const isVisibleRef = useRef(true)
    const scrollPositionRef = useRef(0)

    const subMenuImages: Record<string, string> = {
        BRAND: brandImage || '',
        AVAILABILITY: availabitlyImage || '',
        CONDITIONS: conditionImage || '',
        ACCESSORIES: accessoriesImage || ''
    }

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

    const fetchDefaultSuggestions = async () => {
        try {
            setIsSearching(true)
            const response = await WooCommerce.get(`products?tag=54&category=15&per_page=4`)
            setSearchResults(response.data || [])
        } catch (err) {
            console.error('Error fetching default suggestions', err)
            setSearchResults([])
        } finally {
            setIsSearching(false)
        }
    }

    const debouncedSearch = useMemo(
        () =>
            debounce((query: string) => {
                const fetchProducts = async () => {
                    if (!query || query.trim().length < 2) {
                        // If no query, show default suggestions
                        fetchDefaultSuggestions()
                        setCorrectedQuery('')
                        return
                    }

                    try {
                        setIsSearching(true)
                        // First, try exact search
                        const response = await WooCommerce.get(
                            `products?search=${encodeURIComponent(query)}&per_page=8`
                        )
                        const exactResults = response.data || []

                        if (exactResults.length > 0) {
                            // Found exact match
                            setSearchResults(exactResults)
                            setCorrectedQuery('')
                        } else {
                            // No exact match, try fuzzy search
                            // Fetch all products for fuzzy matching (limit to reasonable amount)
                            const allProductsRes = await WooCommerce.get(`products?per_page=100`)
                            const allProducts = allProductsRes.data || []

                            // Configure Fuse.js for fuzzy matching
                            const fuse = new Fuse(allProducts, {
                                keys: ['name', 'brands.name'],
                                threshold: 0.6, // 0 = exact match, 1 = match anything (increased for better typo tolerance)
                                includeScore: true,
                                minMatchCharLength: 2,
                                ignoreLocation: true // Search the entire string, not just a specific location
                            })

                            const fuzzyResults = fuse.search(query)

                            if (fuzzyResults.length > 0) {
                                // Found fuzzy matches
                                const topMatch = fuzzyResults[0].item as any
                                const correctedName = topMatch.name
                                setCorrectedQuery(correctedName)
                                setSearchResults(fuzzyResults.slice(0, 8).map((r) => r.item))
                            } else {
                                // No results at all
                                setSearchResults([])
                                setCorrectedQuery('')
                            }
                        }
                    } catch (err) {
                        console.error('Error fetching products', err)
                        setSearchResults([])
                        setCorrectedQuery('')
                    } finally {
                        setIsSearching(false)
                    }
                }
                fetchProducts()
            }, 600),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    )

    const handleSearchChange = (value: string) => {
        setSearchQuery(value)
        debouncedSearch(value)
    }

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
        if (isSearchOpen && searchResults.length === 0 && !searchQuery) {
            fetchDefaultSuggestions()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSearchOpen])

    useEffect(() => {
        let ticking = false

        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    // Skip header hide/show logic when menu or search is open
                    if (isMenuOpen || isSearchOpen) {
                        ticking = false
                        return
                    }

                    // Get scroll position
                    const currentScrollY = window.pageYOffset || document.documentElement.scrollTop
                    const lastY = lastScrollYRef.current
                    const scrollDirection = currentScrollY > lastY ? 'down' : 'up'
                    const scrollDelta = Math.abs(currentScrollY - lastY)
                    const currentVisible = isVisibleRef.current

                    // Update scroll state
                    setIsScrolled(currentScrollY > 0)

                    // Check if current path is in non-sticky list (exact match)
                    const isNonStickyPath = NON_STICKY_PATHS.includes(router.pathname)

                    let shouldShow = currentVisible

                    // For non-sticky paths, only show at top
                    if (isNonStickyPath && isMobile) {
                        shouldShow = currentScrollY < 10
                    }
                    // Regular sticky behavior for other paths
                    else {
                        // Always show at top
                        if (currentScrollY < 10) {
                            shouldShow = true
                        }
                        // Show navbar when scrolling up
                        else if (scrollDirection === 'up' && scrollDelta > 1) {
                            shouldShow = true
                        }
                        // Hide navbar when scrolling down
                        else if (scrollDirection === 'down' && currentScrollY > 80 && scrollDelta > 1) {
                            shouldShow = false
                        }
                    }

                    // Only update state if changed
                    if (shouldShow !== currentVisible) {
                        isVisibleRef.current = shouldShow
                        setIsVisible(shouldShow)
                    }

                    // Update last position
                    lastScrollYRef.current = currentScrollY
                    ticking = false
                })
                ticking = true
            }
        }

        // Listen to scroll event
        window.addEventListener('scroll', handleScroll, { passive: true })

        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, [isMenuOpen, isSearchOpen, isMobile, router.pathname])

    // Expose header visibility to other components via body dataset
    useEffect(() => {
        try {
            document.body.dataset.headerVisible = String(isVisible)
        } catch (err) {
            // ignore in non-browser environments
        }

        return () => {
            try {
                delete document.body.dataset.headerVisible
            } catch (err) {
                // ignore
            }
        }
    }, [isVisible])

    useEffect(() => {
        if (isMenuOpen || isSearchOpen) {
            // Save current scroll position
            scrollPositionRef.current = window.scrollY

            // Lock scroll without changing position (prevents visual jump)
            document.body.style.overflow = 'hidden'
            document.body.style.paddingRight = `${window.innerWidth - document.documentElement.clientWidth}px` // Prevent layout shift from scrollbar
        } else {
            // Restore scroll
            document.body.style.overflow = ''
            document.body.style.paddingRight = ''
        }

        return () => {
            document.body.style.overflow = ''
            document.body.style.paddingRight = ''
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

    // Close mobile menu when hash link is clicked
    useEffect(() => {
        const handleCloseMobileMenu = () => {
            // Always close menu and restore body overflow when hash link is clicked
            // This ensures proper cleanup regardless of current state
            setIsMenuOpen(false)
            setHoveredMenuItem(null)
            setSelectedSubMenuItem(null)
            // Immediately restore body overflow
            document.body.style.overflow = ''
            document.body.style.paddingRight = ''
        }

        window.addEventListener('closeMobileMenu', handleCloseMobileMenu)
        return () => window.removeEventListener('closeMobileMenu', handleCloseMobileMenu)
    }, [])

    // Reset menu state when menu closes (to return to main menu on reopen)
    useEffect(() => {
        if (!isMenuOpen) {
            // Reset to main menu state when menu closes
            setHoveredMenuItem(null)
            setSelectedSubMenuItem(null)
        }
    }, [isMenuOpen])

    // Theme switching on route changes - reset dark mode on any navigation
    useEffect(() => {
        // Reset dark mode BEFORE navigation starts (more reliable than after)
        const handleRouteChangeStart = () => {
            setIsDarkSection(false)
        }

        // Also reset after navigation completes as backup
        const handleRouteChangeComplete = () => {
            // Use setTimeout to ensure this runs after page components are mounted
            setTimeout(() => {
                setIsDarkSection(false)
            }, 0)
        }

        router.events.on('routeChangeStart', handleRouteChangeStart)
        router.events.on('routeChangeComplete', handleRouteChangeComplete)

        // Set initial state based on current route
        setIsDarkSection(false)

        return () => {
            router.events.off('routeChangeStart', handleRouteChangeStart)
            router.events.off('routeChangeComplete', handleRouteChangeComplete)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []) // Empty deps - router.events is stable across renders

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

    const isWatch = searchResults?.[0]?.categories?.some((category: any) => category.name === 'Watches')
    const pageTitle = typeof window !== 'undefined' ? document.title : router.pathname

    const locationMatch = listLocation.find((loc) => {
        if (loc.path.endsWith('/*')) {
            const basePath = loc.path.replace('/*', '')
            return router.pathname.startsWith(basePath)
        }
        return router.pathname === loc.path
    })

    return (
        <>
            <div
                className={classNames(
                    'nav-header fixed left-0 right-0 top-0 z-[999] py-2.5 transition-transform duration-300 xl:py-3.5',
                    getNavbarBgClass(pageStyle, isScrolled, isMenuOpen, isSearchOpen)
                )}
                style={{
                    transform: isVisible ? 'translateY(0)' : 'translateY(-100%)',
                    willChange: 'transform'
                }}
            >
                <Container>
                    <div
                        className={classNames('flex min-h-[52px] w-full flex-row items-center justify-between', {
                            'justify-end': isSearchOpen
                        })}
                    >
                        <Icons
                            icon={isMenuOpen ? 'XClose' : 'Hamburger'}
                            width={24}
                            height={24}
                            className={classNames(
                                'cursor-pointer transition-all duration-300',
                                getIconClass(pageStyle, isScrolled, isMenuOpen, isSearchOpen, isVisible),
                                { hidden: isSearchOpen }
                            )}
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
                        />

                        <Link
                            href='/'
                            className={classNames('ml-14 h-[52px] w-[54px] xl:ml-[68px]', {
                                hidden: isSearchOpen
                            })}
                            onClick={() => {
                                if (isMenuOpen) {
                                    setIsMenuOpen(false)
                                    setHoveredMenuItem(null)
                                    setSelectedSubMenuItem(null)
                                }
                            }}
                        >
                            <Icons
                                icon={getLogoVariant(pageStyle, isScrolled, isMenuOpen, isSearchOpen, isVisible)}
                                width={isMobile ? 46 : 54}
                                height={isMobile ? 44 : 52}
                            />
                        </Link>

                        {/* Language Dropdown */}
                        <div className='flex flex-row items-center gap-4'>
                            <Menu as='div' className={classNames('relative', { hidden: isSearchOpen })}>
                                {({ open }: any) => (
                                    <>
                                        <MenuButton
                                            className={classNames(
                                                'flex cursor-pointer flex-row items-center gap-2 transition-colors',
                                                getIconClass(pageStyle, isScrolled, isMenuOpen, isSearchOpen, isVisible)
                                            )}
                                            as='div'
                                        >
                                            <Icons icon='Globe' width={20} height={20} />

                                            <span className='text-button-3-desktop hidden xl:block'>
                                                {currentLanguage.label}
                                            </span>
                                            <Icons
                                                icon='ChevronDown'
                                                width={16}
                                                height={16}
                                                className={classNames(
                                                    'hidden transform transition-transform duration-200 xl:block',
                                                    {
                                                        'rotate-180': open,
                                                        'rotate-0': !open
                                                    }
                                                )}
                                            />
                                        </MenuButton>

                                        <Transition
                                            as={Fragment}
                                            enter='transition ease-out duration-100'
                                            enterFrom='transform opacity-0 scale-95'
                                            enterTo='transform opacity-100 scale-100'
                                            leave='transition ease-in duration-75'
                                            leaveFrom='transform opacity-100 scale-100'
                                            leaveTo='transform opacity-0 scale-95'
                                        >
                                            <MenuItems className='absolute left-1/2 right-auto z-10 mt-2 origin-top -translate-x-1/2 bg-white shadow-lg outline-none ring-1 ring-black ring-opacity-5 xl:left-auto xl:right-0 xl:origin-top-right xl:translate-x-0'>
                                                {languages.map((lang) => (
                                                    <MenuItem key={lang.code}>
                                                        {({ active }) => (
                                                            <button
                                                                onClick={() => handleLanguageChange(lang.code)}
                                                                className={classNames(
                                                                    ' flex w-full items-center justify-center gap-2 px-6 py-4 text-left outline-none transition-colors',
                                                                    {
                                                                        'bg-grey-100':
                                                                            active || lang.code === currentLanguage.code
                                                                    }
                                                                )}
                                                            >
                                                                <span className='text-button-3-desktop text-grey-black'>
                                                                    {lang.label}
                                                                </span>
                                                            </button>
                                                        )}
                                                    </MenuItem>
                                                ))}
                                            </MenuItems>
                                        </Transition>
                                    </>
                                )}
                            </Menu>

                            <Icons
                                icon={isSearchOpen ? 'XClose' : 'Search'}
                                width={24}
                                height={24}
                                onClick={() => {
                                    const willOpen = !isSearchOpen
                                    setIsSearchOpen(willOpen)
                                    if (willOpen) {
                                        const articlePath = router.pathname.startsWith('/articles/')
                                        const productDetailPath = router.pathname.startsWith('/collections/')
                                        const productName = currentProduct?.name || document.title || ''
                                        if (articlePath || productDetailPath) {
                                            trackEvent(GA_EVENTS.SEARCH, {
                                                'Button Title': productDetailPath ? productName : pageTitle,
                                                'Button Location': 'Header',
                                                'Button Page': locationMatch?.label
                                            })
                                        } else {
                                            trackEvent(GA_EVENTS.SEARCH, {
                                                'Button location': 'Header',
                                                'Button Page': locationMatch?.label
                                            })
                                        }

                                        // close menu when opening search
                                        setIsMenuOpen(false)
                                        setHoveredMenuItem(null)
                                        setSelectedSubMenuItem(null)

                                        setSearchQuery('')
                                        form.setFieldsValue({ search: '' })
                                        setSearchResults([])
                                    }
                                }}
                                className={classNames(
                                    'cursor-pointer transition-colors',
                                    getIconClass(pageStyle, isScrolled, isMenuOpen, isSearchOpen, isVisible)
                                )}
                            />
                        </div>
                    </div>
                </Container>
            </div>
            {/* Dropdown Menu */}
            {isMenuOpen && (
                <div className='animate-fade-in fixed inset-0 top-0 z-[998] overflow-hidden bg-black'>
                    <Container className='h-full pt-[80px]'>
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
                                {menuData.map((item) => {
                                    const hasSubMenu = Boolean(item.subMenu && item.subMenu.length > 0)
                                    const shouldUseLink = Boolean(item.href && !(isMobile && hasSubMenu))

                                    return shouldUseLink ? (
                                        <UnstyledLink
                                            key={item.label}
                                            href={item.href!}
                                            className='text-grey-200 hover:text-grey-white  w-full cursor-pointer text-left outline-none transition-colors '
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
                                            className={classNames(
                                                'w-full cursor-pointer text-left outline-none transition-colors',
                                                hoveredMenuItem === item
                                                    ? 'xl:text-grey-white hover:text-grey-200'
                                                    : 'text-grey-200 hover:text-grey-white'
                                            )}
                                            onMouseEnter={() => {
                                                if (window.innerWidth >= 1024 && hasSubMenu) {
                                                    setHoveredMenuItem(item)
                                                    setSelectedSubMenuItem(null)
                                                }
                                            }}
                                            onClick={() => {
                                                if (hasSubMenu) {
                                                    setHoveredMenuItem(item)
                                                    setSelectedSubMenuItem(null)
                                                }
                                            }}
                                            onKeyDown={(e) => handleMenuItemKeyDown(e, item)}
                                            aria-expanded={hoveredMenuItem === item}
                                            aria-haspopup={hasSubMenu}
                                        >
                                            <div className='flex items-center justify-between gap-4 xl:justify-normal'>
                                                <span className='xl:text-button-1-desktop text-button-1-mobile'>
                                                    {item.label}
                                                </span>
                                                {item.subMenu && <Icons icon='ChevronRight' width={16} height={16} />}
                                            </div>
                                        </button>
                                    )
                                })}
                            </div>

                            {/* Grid 2: Content Area with Image */}
                            <div
                                className={classNames(
                                    'scrollbar-none flex-1 overflow-y-auto pb-10',

                                    'max-lg:w-full',
                                    {
                                        'max-lg:hidden':
                                            !hoveredMenuItem?.subMenu ||
                                            (selectedSubMenuItem && window.innerWidth < 1024)
                                    }
                                )}
                            >
                                {hoveredMenuItem?.subMenu && (
                                    <div className='space-y-8 xl:space-y-0'>
                                        {/* Breadcrumb + See all Watches - Mobile Only */}
                                        <div className='flex items-center justify-between lg:hidden'>
                                            <Breadcrumb
                                                items={[{ title: 'Home', href: '/' }, { title: hoveredMenuItem.label }]}
                                                breakpoint='Mobile'
                                                onNavigate={(i) => handleBreadcrumbNavigate(i)}
                                                navigationClassName='text-button-5-mobile capitalize'
                                                lastItemClassName='text-button-5-mobile capitalize'
                                            />
                                            <UnstyledLink
                                                href='/collections'
                                                className='text-button-4-mobile hover:text-grey-white text-grey-200 flex items-center gap-1'
                                                onClick={() => {
                                                    setIsMenuOpen(false)
                                                    trackEvent(GA_EVENTS.FILTER_SELECTED, {
                                                        'Button Location': 'Menu Our Collections',
                                                        'Button Page': 'Menu page',
                                                        'Button Title': 'See all watches'
                                                    })
                                                }}
                                            >
                                                See all Watches
                                                <Icons icon='ChevronRight' width={12} height={12} />
                                            </UnstyledLink>
                                        </div>

                                        {/* Desktop: BRAND Section - Full Width Image + Items Below */}
                                        <div className='hidden xl:block'>
                                            {hoveredMenuItem.subMenu.find((item) => item.label === 'Brand') && (
                                                <div className='animate-slide-in-left space-y-6'>
                                                    {/* Full Width Image */}
                                                    <div className='relative w-full overflow-hidden'>
                                                        <Image
                                                            src={subMenuImages.BRAND}
                                                            alt='Brands'
                                                            width={960}
                                                            height={301}
                                                            className='h-[301px] w-full object-cover'
                                                        />
                                                        <UnstyledLink
                                                            href='/collections'
                                                            className='text-button-4-desktop text-grey-200 hover:text-grey-100 absolute bottom-6 left-6 flex items-center gap-2 transition-colors'
                                                            onClick={() => {
                                                                setIsMenuOpen(false)
                                                                trackEvent(GA_EVENTS.FILTER_SELECTED, {
                                                                    'Button Location': 'Menu Our Collections',
                                                                    'Button Page': 'Menu page',
                                                                    'Button Title': 'See all watches'
                                                                })
                                                            }}
                                                        >
                                                            See all Watches
                                                            <Icons icon='ChevronRight' width={14} height={14} />
                                                        </UnstyledLink>
                                                    </div>
                                                    {/* Title and Items */}
                                                    <div>
                                                        <h3 className='text-paragraph-8-desktop mb-4  text-gray-500'>
                                                            By Brands
                                                        </h3>
                                                        <div className='grid grid-flow-col grid-rows-4 gap-x-[100px] gap-y-2'>
                                                            {brands.map((item) => (
                                                                <UnstyledLink
                                                                    key={item}
                                                                    href={`/collections?product_brand=${item.id}`}
                                                                    className='xl:text-button-4-desktop text-button-4-mobile text-grey-200 hover:text-grey-100'
                                                                    dangerouslySetInnerHTML={{
                                                                        __html: sanitizeHtml(item.name)
                                                                    }}
                                                                    // eslint-disable-next-line react/no-children-prop
                                                                    children={undefined}
                                                                    onClick={() => {
                                                                        setIsMenuOpen(false)
                                                                        trackEvent(GA_EVENTS.FILTER_SELECTED, {
                                                                            'Button Location': 'Menu Our Collections',
                                                                            'Button Page': 'Menu page',
                                                                            'Button Title': decodeHtml(item.name)
                                                                        })
                                                                    }}
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
                                                            onClick={() => {
                                                                setIsMenuOpen(false)
                                                                trackEvent(GA_EVENTS.FILTER_SELECTED, {
                                                                    'Button Location': 'Menu Our Collections',
                                                                    'Button Page': 'Menu page',
                                                                    'Button Title': 'See all accessories'
                                                                })
                                                            }}
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
                                                            <h3 className='text-paragraph-8-mobile text-grey-200 text-left'>
                                                                See All Accessories
                                                            </h3>
                                                        </UnstyledLink>
                                                    )
                                                }

                                                return (
                                                    <button
                                                        key={subItem.label}
                                                        type='button'
                                                        className=' group flex w-full cursor-pointer flex-col gap-4 outline-none'
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
                                                        <h3 className='text-paragraph-8-mobile text-grey-200 text-left'>
                                                            By{' '}
                                                            {subItem.label.charAt(0) +
                                                                subItem.label.slice(1).toLowerCase()}
                                                        </h3>
                                                    </button>
                                                )
                                            })}
                                        </div>

                                        {/* Desktop: AVAILABILITY & CONDITIONS Section - Side by Side */}
                                        <div className='hidden grid-cols-3 justify-between lg:flex xl:pt-[72px]'>
                                            {/* AVAILABILITY */}
                                            {hoveredMenuItem.subMenu.find((item) => item.label === 'Availability') && (
                                                <div className='animate-slide-in-left flex w-fit flex-row items-end gap-6'>
                                                    <div className='relative h-[107px] w-[160px] overflow-hidden'>
                                                        <Image
                                                            src={subMenuImages.AVAILABILITY}
                                                            alt='Availability'
                                                            width={160}
                                                            height={107}
                                                        />
                                                    </div>
                                                    <div>
                                                        <h3 className='text-paragraph-8-desktop mb-3  text-gray-500'>
                                                            By Availability
                                                        </h3>
                                                        <div className='space-y-2'>
                                                            {hoveredMenuItem.subMenu
                                                                .find((item) => item.label === 'Availability')
                                                                ?.items?.map((item) => (
                                                                    <UnstyledLink
                                                                        key={item}
                                                                        href={
                                                                            item === 'In Stock'
                                                                                ? '/collections?availability=instock'
                                                                                : item === 'Out of Stock'
                                                                                ? '/collections?availability=outofstock'
                                                                                : '#'
                                                                        }
                                                                        className='text-button-4-desktop text-grey-200 hover:text-grey-100 block text-left'
                                                                        onClick={() => {
                                                                            setIsMenuOpen(false)

                                                                            trackEvent(GA_EVENTS.FILTER_SELECTED, {
                                                                                'Button Location':
                                                                                    'Menu Our Collections',
                                                                                'Button Page': 'Menu page',
                                                                                'Button Title': decodeHtml(item)
                                                                            })
                                                                        }}
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
                                                <div className='animate-slide-in-left flex w-fit flex-row items-end gap-6'>
                                                    <div className='relative h-[107px] w-[160px] overflow-hidden'>
                                                        <Image
                                                            src={subMenuImages.CONDITIONS}
                                                            alt='Conditions'
                                                            width={160}
                                                            height={107}
                                                        />
                                                    </div>
                                                    <div>
                                                        <h3 className='text-paragraph-8-desktop mb-3  text-gray-500'>
                                                            By Condition
                                                        </h3>
                                                        <div className='space-y-2'>
                                                            {hoveredMenuItem.subMenu
                                                                .find((item) => item.label === 'Conditions')
                                                                ?.items?.map((item) => (
                                                                    <UnstyledLink
                                                                        key={item}
                                                                        href={
                                                                            item === 'Brand New'
                                                                                ? '/collections?condition=brand-new'
                                                                                : item === 'Pre-Owned'
                                                                                ? '/collections?condition=pre-owned-very-good'
                                                                                : '#'
                                                                        }
                                                                        className='text-button-4-desktop text-grey-200 hover:text-grey-100 block text-left'
                                                                        onClick={() => {
                                                                            setIsMenuOpen(false)

                                                                            trackEvent(GA_EVENTS.FILTER_SELECTED, {
                                                                                'Button Location':
                                                                                    'Menu Our Collections',
                                                                                'Button Page': 'Menu page',
                                                                                'Button Title': decodeHtml(item)
                                                                            })
                                                                        }}
                                                                        onKeyDown={handleSubSubMenuItemKeyDown}
                                                                    >
                                                                        {item}
                                                                    </UnstyledLink>
                                                                ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            {/* ACCESSORIES */}
                                            {hoveredMenuItem.subMenu.find((item) => item.label === 'Accessories') && (
                                                <div className='animate-slide-in-left flex w-fit flex-row items-end gap-6'>
                                                    <div className='h-[107px] w-[160px] overflow-hidden'>
                                                        <Image
                                                            src={subMenuImages.ACCESSORIES}
                                                            alt='Accessories'
                                                            width={160}
                                                            height={107}
                                                        />
                                                    </div>
                                                    <div className='w-[75px]'>
                                                        <UnstyledLink
                                                            href='/collections?tab=accessories'
                                                            className='text-button-4-desktop text-grey-200 hover:text-grey-100 block text-left'
                                                            onClick={() => {
                                                                setIsMenuOpen(false)
                                                                trackEvent(GA_EVENTS.FILTER_SELECTED, {
                                                                    'Button Location': 'Menu Our Collections',
                                                                    'Button Page': 'Menu page',
                                                                    'Button Title': 'See all accessories'
                                                                })
                                                            }}
                                                        >
                                                            See All Accessories
                                                        </UnstyledLink>
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
                                                            __html: sanitizeHtml(item.name)
                                                        }}
                                                        // eslint-disable-next-line react/no-children-prop
                                                        children={undefined}
                                                        onClick={() => {
                                                            setIsMenuOpen(false)
                                                            trackEvent(GA_EVENTS.FILTER_SELECTED, {
                                                                'Button Location': 'Menu Our Collections',
                                                                'Button Page': 'Menu page',
                                                                'Button Title': decodeHtml(item.name)
                                                            })
                                                        }}
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
                                                            // Availability items
                                                            selectedSubMenuItem.label === 'Availability'
                                                                ? item === 'In Stock'
                                                                    ? '/collections?availability=instock'
                                                                    : item === 'Out of Stock'
                                                                    ? '/collections?availability=outofstock'
                                                                    : '#'
                                                                : // Conditions items
                                                                item === 'Brand New'
                                                                ? '/collections?condition=brand-new'
                                                                : item === 'Pre-Owned'
                                                                ? '/collections?condition=pre-owned-very-good'
                                                                : '#'
                                                        }
                                                        className='text-button-1-mobile text-grey-200 block text-left transition-colors'
                                                        onClick={() => {
                                                            setIsMenuOpen(false)
                                                            trackEvent(GA_EVENTS.FILTER_SELECTED, {
                                                                'Button Location': 'Menu Our Collections',
                                                                'Button Page': 'Menu page',
                                                                'Button Title': decodeHtml(item)
                                                            })
                                                        }}
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
                                                    onClick={() => {
                                                        setIsMenuOpen(false)
                                                        trackEvent(GA_EVENTS.FILTER_SELECTED, {
                                                            'Button Location': 'Menu Our Collections',
                                                            'Button Page': 'Menu page',
                                                            'Button Title': 'See all accessories'
                                                        })
                                                    }}
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
                    className='animate-fade-in fixed inset-0 top-[60px] z-50 overflow-auto bg-white'
                    onClick={() => {
                        // setIsSearchOpen(false)
                        setHoveredMenuItem(null)
                        setSelectedSubMenuItem(null)
                    }}
                >
                    {/* full-width white bar */}
                    <div className='min-h-screen w-full bg-white pb-10'>
                        <div className='py-6' onClick={(e) => e.stopPropagation()}>
                            <Container className='flex flex-col gap-10'>
                                <Form form={form}>
                                    <Field name='search'>
                                        <Input
                                            className='!rounded-none !border-x-0 !border-t-0'
                                            inputClassName='text-center xl:text-paragraph-2-desktop text-paragraph-2-mobile placeholder:text-gray-400'
                                            placeholder='Search'
                                            value={searchQuery}
                                            onChange={handleSearchChange}
                                        />
                                    </Field>
                                </Form>

                                <div className='flex flex-col gap-6'>
                                    <h4 className='xl:text-paragraph-6-desktop text-paragraph-6-mobile text-grey-200'>
                                        {searchQuery ? t('common:search_result') : t('common:suggestion')}
                                    </h4>
                                    {/* Typo correction message */}
                                    {correctedQuery && searchQuery && (
                                        <p className='text-grey-200 xl:text-paragraph-6-desktop text-paragraph-6-mobile text-center'>
                                            We couldn't find a match for "
                                            <span className='font-semibold'>{searchQuery}</span>", but we show results
                                            of "<span className='font-semibold'>{correctedQuery}</span>" below
                                        </p>
                                    )}
                                    <div className='h-full w-full'>
                                        {isSearching ? (
                                            <div className='grid grid-cols-2 items-center gap-6 md:grid-cols-4'>
                                                {Array.from({ length: 4 }).map((_, idx) => (
                                                    <div key={`skeleton-${idx}`} className='flex flex-col items-center'>
                                                        <div className='bg-grey-100 mb-3 h-[168px] w-[168px] animate-pulse overflow-hidden rounded xl:h-[309px] xl:w-[309px]' />
                                                        <div className='bg-grey-100 mx-auto h-3 w-24 animate-pulse rounded' />
                                                        <div className='bg-grey-100 mx-auto mt-2 h-4 w-32 animate-pulse rounded' />
                                                        <div className='bg-grey-100 mx-auto mt-2 h-3 w-20 animate-pulse rounded' />
                                                        <div className='bg-grey-100 mx-auto mt-2 h-4 w-28 animate-pulse rounded' />
                                                    </div>
                                                ))}
                                            </div>
                                        ) : searchResults.length > 0 ? (
                                            <div className='grid grid-cols-2 gap-6 md:grid-cols-4'>
                                                {searchResults.map((product) => (
                                                    <UnstyledLink
                                                        key={product.id}
                                                        href={`/collections/${product.slug}`}
                                                        className='cursor-pointer text-center'
                                                        onClick={() => {
                                                            setIsSearchOpen(false)
                                                            setSearchQuery('')
                                                            setSearchResults([])
                                                            setCorrectedQuery('')

                                                            if (isWatch) {
                                                                trackEvent(GA_EVENTS.INTEREST_WATCH_DETAILS, {
                                                                    'Button Title': product.name,
                                                                    'Button Location': 'Search',
                                                                    'Button Page': 'Search Page'
                                                                })
                                                            } else {
                                                                trackEvent(GA_EVENTS.INTEREST_ACCESSORIES_DETAILS, {
                                                                    'Button Title': product.name,
                                                                    'Button Location': 'Search',
                                                                    'Button Page': 'Search Page'
                                                                })
                                                            }
                                                        }}
                                                    >
                                                        <div className='relative flex flex-col items-center gap-1 overflow-hidden xl:gap-12'>
                                                            <div className='mb-3 h-[168px] w-[168px] overflow-hidden xl:h-[309px] xl:w-[309px]'>
                                                                <Image
                                                                    src={
                                                                        product.images[0]?.src ||
                                                                        'https://placehold.co/309x309/png?text=TWC'
                                                                    }
                                                                    alt={product.name}
                                                                    width={isMobile ? 168 : 309}
                                                                    height={isMobile ? 168 : 309}
                                                                    className='h-full w-full object-contain'
                                                                />
                                                            </div>
                                                            {product.stock_status === 'onbackorder' && (
                                                                <div className='bg-grey-black absolute left-2 top-2 px-3 pb-1'>
                                                                    <span className='text-grey-white xl:text-paragraph-12-desktop text-paragraph-12-mobile !leading-none'>
                                                                        Reservable
                                                                    </span>
                                                                </div>
                                                            )}
                                                            <div className='flex flex-col gap-1 text-center'>
                                                                <p
                                                                    className='xl:text-paragraph-9-desktop text-paragraph-9-mobile text-grey-200 uppercase'
                                                                    dangerouslySetInnerHTML={{
                                                                        __html: sanitizeHtml(`
                                                                        ${product?.brands?.[0]?.name || ''}
                                                                        ${
                                                                            product?.meta_data?.find(
                                                                                (meta: any) => meta.key === 'reference'
                                                                            )?.value
                                                                                ? ` • ${
                                                                                      product?.meta_data?.find(
                                                                                          (meta: any) =>
                                                                                              meta.key === 'reference'
                                                                                      )?.value
                                                                                  }`
                                                                                : ''
                                                                        }
                                                                        `)
                                                                    }}
                                                                />

                                                                <h4
                                                                    className='xl:text-subheading-5-desktop text-subheading-5-mobile text-grey-black'
                                                                    dangerouslySetInnerHTML={{
                                                                        __html: sanitizeHtml(product.name)
                                                                    }}
                                                                />

                                                                <p className='xl:text-paragraph-10-desktop text-paragraph-10-mobile text-grey-500'>
                                                                    {product?.meta_data?.find(
                                                                        (meta: any) =>
                                                                            meta.key === 'basic-info-year-purchase'
                                                                    ) &&
                                                                        t('home:highlight.pre_owned', {
                                                                            year: product?.meta_data?.find(
                                                                                (meta: any) =>
                                                                                    meta.key ===
                                                                                    'basic-info-year-purchase'
                                                                            )?.value
                                                                        })}
                                                                </p>

                                                                {product.stock_status === 'instock' &&
                                                                    product.price !== '' && (
                                                                        <p className='xl:text-paragraph-5-desktop text-paragraph-5-mobile text-accent-price-dark'>
                                                                            {formatRupiah(product.price)}
                                                                        </p>
                                                                    )}
                                                            </div>
                                                        </div>
                                                    </UnstyledLink>
                                                ))}
                                            </div>
                                        ) : searchQuery ? (
                                            <div className='flex flex-col gap-6'>
                                                <div className='text-grey-200 xl:text-paragraph-6-desktop text-paragraph-6-mobile text-center'>
                                                    {t('common:header.empty_search')}
                                                </div>
                                                <CTA image={ctaImage} />
                                            </div>
                                        ) : null}
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
