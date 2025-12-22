import Container from '@components/Container'
import Icons from '@components/Icon'
import UnstyledLink from '@components/links/UnstyledLink'
import Link from 'next/link'
import React from 'react'
import { useMediaQuery } from 'react-responsive'

const Footer = () => {
    const isMobile = useMediaQuery({ maxWidth: 1279 })
    const items = [
        {
            name: 'Our Services',
            links: [
                { title: 'Sell Your Watch', href: '/sell' },
                { title: 'Pre-Order', href: '/reserve' },
                { title: 'Watch Service', href: '/reserve' },
                { title: 'Book an Appointment', href: '/appointment' }
            ]
        },
        {
            name: 'Reach Us',
            links: [
                { title: 'About Us', href: '/about-us' },
                { title: 'Contact', href: '/contact' },
                { title: 'Instagram', href: 'https://instagram.com/thewatchcollections' },
                { title: 'Store Location', href: '/about-us#location' }
            ]
        },

        {
            name: 'Collections',
            links: [
                { title: 'Our Collections', href: '/collections' },
                { title: 'Articles', href: '/articles' }
            ]
        },
        {
            name: 'Security',
            links: [
                { title: 'Privacy Policy', href: '/privacy' },
                { title: 'Terms of Service', href: '/terms' }
            ]
        }
    ]
    return (
        <footer className='bg-grey-black text-grey-white relative z-20 '>
            <Container>
                <div className='py-12'>
                    {/* Main Footer Content */}
                    <div className='hidden flex-row gap-12 xl:flex'>
                        {/* Logo */}
                        {!isMobile && (
                            <div className='mr-[240px] flex max-w-[208px] flex-col justify-between'>
                                <Link href='/' className='!w-fit'>
                                    <Icons icon='LogoFullWhite' width={142} height={64} className='hidden xl:block' />
                                </Link>
                                <p className='text-paragraph-10-desktop text-grey-white'>
                                    © 2014 THE WATCH COLLECTIONS
                                </p>
                            </div>
                        )}
                        {/* Our Services */}
                        <div className='w-[186px]'>
                            <h3 className='text-subheading-7-desktop text-grey-200 mb-4 uppercase'>Our Services</h3>
                            <ul className='space-y-4'>
                                {items[0].links.map((link) => (
                                    <li key={link.title}>
                                        <UnstyledLink
                                            href={link.href}
                                            className='text-button-4-desktop text-grey-white'
                                        >
                                            {link.title}
                                        </UnstyledLink>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        {/* Reach Us */}
                        <div className='w-[186px]'>
                            <h3 className='text-subheading-7-desktop text-grey-200 mb-4 uppercase'>Reach Us</h3>
                            <ul className='space-y-4'>
                                {items[1].links.map((link) => (
                                    <li key={link.title}>
                                        <UnstyledLink
                                            href={link.href}
                                            className='text-button-4-desktop text-grey-white'
                                        >
                                            {link.title}
                                        </UnstyledLink>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        {/* Collections */}
                        <div className='w-[186px]'>
                            <h3 className='text-subheading-7-desktop text-grey-200 mb-4 uppercase'>Collections</h3>
                            <ul className='space-y-4'>
                                {items[2].links.map((link) => (
                                    <li key={link.title}>
                                        <UnstyledLink
                                            href={link.href}
                                            className='text-button-4-desktop text-grey-white'
                                        >
                                            {link.title}
                                        </UnstyledLink>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        {/* Security */}
                        <div className='w-[186px]'>
                            <h3 className='text-subheading-7-desktop text-grey-200 mb-4 uppercase'>Security</h3>
                            <ul className='space-y-4'>
                                {items[3].links.map((link) => (
                                    <li key={link.title}>
                                        <UnstyledLink
                                            href={link.href}
                                            className='text-button-4-desktop text-grey-white'
                                        >
                                            {link.title}
                                        </UnstyledLink>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className='flex flex-col gap-12 xl:hidden'>
                        {/* Logo */}
                        <Link href='/'>
                            <Icons icon='LogoWhite' width={58} height={55} />
                        </Link>
                        <div className='flex w-full flex-row gap-12'>
                            {/* Our Services */}
                            <div className='min-w-[145px]'>
                                <h3 className='text-subheading-7-desktop text-grey-200 mb-4 uppercase'>Our Services</h3>
                                <ul className='space-y-4'>
                                    {items[0].links.map((link) => (
                                        <li key={link.title}>
                                            <UnstyledLink
                                                href={link.href}
                                                className='text-button-4-desktop text-grey-white'
                                            >
                                                {link.title}
                                            </UnstyledLink>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            {/* Reach Us */}
                            <div className='min-w-[145px]'>
                                <h3 className='text-subheading-7-desktop text-grey-200 mb-4 uppercase'>Reach Us</h3>
                                <ul className='space-y-4'>
                                    {items[1].links.map((link) => (
                                        <li key={link.title}>
                                            <UnstyledLink
                                                href={link.href}
                                                className='text-button-4-desktop text-grey-white'
                                            >
                                                {link.title}
                                            </UnstyledLink>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className='flex w-full flex-row gap-12'>
                            {/* Collections */}
                            <div className='min-w-[145px]'>
                                <h3 className='text-subheading-7-desktop text-grey-200 mb-4 uppercase'>Collections</h3>
                                <ul className='space-y-4'>
                                    {items[2].links.map((link) => (
                                        <li key={link.title}>
                                            <UnstyledLink
                                                href={link.href}
                                                className='text-button-4-desktop text-grey-white'
                                            >
                                                {link.title}
                                            </UnstyledLink>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            {/* Security */}
                            <div className='min-w-[145px]'>
                                <h3 className='text-subheading-7-desktop text-grey-200 mb-4 uppercase'>Security</h3>
                                <ul className='space-y-4'>
                                    {items[3].links.map((link) => (
                                        <li key={link.title}>
                                            <UnstyledLink
                                                href={link.href}
                                                className='text-button-4-desktop text-grey-white'
                                            >
                                                {link.title}
                                            </UnstyledLink>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                    {/* Footer Bottom */}
                    <div className='mt-20 flex flex-col items-start justify-between border-t border-gray-700 pt-8 md:flex-row xl:hidden xl:items-center'>
                        <p className='text-paragraph-10-desktop text-grey-white'>© 2014 THE WATCH COLLECTIONS</p>
                        <div className='mt-4 hidden gap-6 md:mt-0 xl:flex'>
                            <UnstyledLink href='/privacy' className='text-button-5-desktop text-grey-white '>
                                Privacy Policy
                            </UnstyledLink>
                            <UnstyledLink href='/terms' className='text-button-5-desktop text-grey-white '>
                                Terms of Service
                            </UnstyledLink>
                        </div>
                    </div>
                </div>
            </Container>
        </footer>
    )
}

export default Footer
