import Container from '@components/Container'
import Icons from '@components/Icon'
import classNames from '@lib/classnames'
import React, { useEffect, useState } from 'react'

interface SubMenuItem {
    label: string
    items?: string[]
}

interface MenuItem {
    label: string
    subMenu?: SubMenuItem[]
}

const menuData: MenuItem[] = [
    {
        label: 'OUR COLLECTIONS',
        subMenu: [
            {
                label: 'BRAND',
                items: [
                    'RICHARD MILLE',
                    'PATEK PHILIPPE',
                    'AUDEMARS PIGUET',
                    'ROLEX',
                    'A. LANGE & SÖHNE',
                    'H. MOSER & CIE.',
                    'CARTIER',
                    'HUBLOT',
                    'OMEGA',
                    'ZENITH',
                    'PANERAI',
                    'FRANCK MULLER',
                    'JAEGER-LECOULTRE',
                    'TUDOR',
                    'THE WATCH COLLECTIONS'
                ]
            },
            {
                label: 'AVAILABILITY',
                items: ['IN STOCK', 'COMING SOON']
            },
            {
                label: 'CONDITIONS',
                items: ['NEW', 'PRE-OWNED', 'UNWORN', 'VINTAGE']
            }
        ]
    },
    { label: 'SELL YOUR WATCH' },
    { label: 'PRE-ORDER' },
    { label: 'ABOUT US' },
    { label: 'ARTICLE' }
]

const Headers = () => {
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [hoveredMenuItem, setHoveredMenuItem] = useState<MenuItem | null>(null)
    const [hoveredSubMenuItem, setHoveredSubMenuItem] = useState<SubMenuItem | null>(null)

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0)
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }

        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isMenuOpen])

    const renderMenu = () => (
        <button
            onClick={() => {
                setIsMenuOpen(!isMenuOpen)
                if (isMenuOpen) {
                    // Reset all states when closing menu
                    setHoveredMenuItem(null)
                    setHoveredSubMenuItem(null)
                }
            }}
            className='relative h-8 w-8 transition-all duration-300'
        >
            <div
                className={classNames(
                    'absolute inset-0 transition-all duration-300',
                    isMenuOpen ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'
                )}
            >
                <Icons icon='Hamburger' width={32} height={32} />
            </div>
            <div
                className={classNames(
                    'absolute inset-0 transition-all duration-300',
                    isMenuOpen ? 'rotate-0 scale-100 opacity-100' : 'rotate-90 scale-0 opacity-0'
                )}
            >
                <Icons icon='XClose' width={32} height={32} />
            </div>
        </button>
    )

    return (
        <>
            <div
                className={classNames('sticky top-0 z-50 bg-transparent py-3.5 transition-colors duration-300', {
                    'bg-[#0F0F0FCC] backdrop-blur-[20px]': isScrolled
                })}
            >
                <Container>
                    <div className='flex flex-row justify-between'>
                        {renderMenu()}
                        <div>sadas</div>
                        <div className='flex flex-row items-center gap-2'>
                            Search <Icons icon='Search' width={32} height={32} />
                        </div>
                    </div>
                </Container>
            </div>
            {/* Dropdown Menu */}
            {isMenuOpen && (
                <div className='animate-fade-in fixed inset-0 top-[56px] z-50 bg-black'>
                    <Container>
                        <div className='grid grid-cols-3 gap-8 py-8'>
                            {/* Grid 1: Main Menu */}
                            <div className='animate-slide-in-left space-y-4'>
                                {menuData.map((item) => (
                                    <div
                                        key={item.label}
                                        className='cursor-pointer text-white hover:text-gray-400'
                                        onMouseEnter={() => {
                                            setHoveredMenuItem(item)
                                            setHoveredSubMenuItem(null)
                                        }}
                                    >
                                        <div className='flex items-center justify-between'>
                                            <span className='text-sm font-medium'>{item.label}</span>
                                            {item.subMenu && <span>›</span>}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Grid 2 & 3: Sub Menu and Sub Sub Menu Container */}
                            <div
                                className='col-span-2 grid grid-cols-2 gap-8'
                                onMouseLeave={() => setHoveredSubMenuItem(null)}
                            >
                                {/* Grid 2: Sub Menu */}
                                <div className='space-y-4'>
                                    {hoveredMenuItem?.subMenu?.map((subItem) => (
                                        <div
                                            key={subItem.label}
                                            className='animate-slide-in-left cursor-pointer text-gray-400 hover:text-white'
                                            onMouseEnter={() => setHoveredSubMenuItem(subItem)}
                                        >
                                            <div className='flex items-center justify-between'>
                                                <span className='text-sm'>{subItem.label}</span>
                                                {subItem.items && <span>›</span>}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Grid 3: Sub Sub Menu */}
                                <div className='space-y-4'>
                                    {hoveredSubMenuItem?.items?.map((item) => (
                                        <div
                                            key={item}
                                            className='animate-slide-in-left cursor-pointer text-gray-400 hover:text-white'
                                        >
                                            <span className='text-sm'>{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Container>
                </div>
            )}
        </>
    )
}

export default Headers
