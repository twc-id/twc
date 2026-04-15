import LogoWhite from '@components/Icon/Images/LogoWhite'
import Head from 'next/head'

export default function MaintenancePage() {
    return (
        <>
            <Head>
                <title>Something New is Coming — The Watch Collections</title>
                <meta name='robots' content='noindex, nofollow' />
                <meta name='viewport' content='width=device-width, initial-scale=1' />
            </Head>

            <main className='bg-grey-black font-inter flex min-h-screen flex-col items-center justify-center px-6 text-center'>
                {/* Logo */}
                <div className='mb-16'>
                    <LogoWhite width={80} height={76} />
                </div>

                {/* Heading */}
                <h1 className='text-grey-white mb-6 text-3xl font-light tracking-widest md:text-5xl'>
                    Something New is Coming
                </h1>

                <p className='text-grey-200 mb-2 max-w-sm text-sm leading-relaxed'>
                    We&apos;re working on something exciting. Stay tuned for updates.
                </p>

                <p className='text-grey-200 mb-16 max-w-sm text-sm leading-relaxed'>
                    Follow us on Instagram for the latest news.
                </p>

                {/* Instagram CTA */}
                <a
                    href='https://www.instagram.com/thewatchcollections'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='border-grey-700 text-grey-200 hover:border-grey-200 hover:text-grey-white mb-16 inline-flex items-center gap-2 border px-6 py-3 text-xs uppercase tracking-[0.2em] transition-colors'
                >
                    <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='14'
                        height='14'
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='1.5'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                    >
                        <rect x='2' y='2' width='20' height='20' rx='5' ry='5' />
                        <circle cx='12' cy='12' r='4' />
                        <circle cx='17.5' cy='6.5' r='0.5' fill='currentColor' stroke='none' />
                    </svg>
                    @thewatchcollections
                </a>

                {/* Divider */}
                <div className='bg-grey-700 h-px w-16' />

                <p className='text-grey-500 mt-8 text-xs tracking-widest'>
                    &copy; {new Date().getFullYear()} The Watch Collections
                </p>
            </main>
        </>
    )
}

MaintenancePage.noLayout = true
