import Input from '@components/forms/Input'
import Layout from '@components/layout/Layout'
import ButtonLink from '@components/links/ButtonLink'
import UnderlineLink from '@components/links/UnderlineLink'
import Seo from '@components/Seo'
import * as React from 'react'

/**
 * SVGR Support
 * Caveat: No React Props Type.
 *
 * You can override the next-env if the type is important to you
 * @see https://stackoverflow.com/questions/68103844/how-to-override-next-js-svg-module-declaration
 */

// !STARTERCONF -> Select !STARTERCONF and CMD + SHIFT + F
// Before you begin editing, follow all comments with `STARTERCONF`,
// to customize the default configuration.

export default function HomePage() {
    return (
        <Layout>
            {/* <Seo templateTitle='Home' /> */}
            <Seo />

            <main>
                <section className='bg-white'>
                    <div className='layout relative flex min-h-screen flex-col items-center justify-center py-12 text-center'>
                        <h1 className='mt-4'>Next.js + Tailwind CSS + TypeScript Starter</h1>
                        <p className='mt-2 text-sm text-gray-800'>
                            A starter for Next.js, Tailwind CSS, and TypeScript with Absolute Import, Seo, Link
                            component, pre-configured with Husky{' '}
                        </p>

                        <ButtonLink className='mt-6' href='/components' variant='light'>
                            See all components
                        </ButtonLink>
                        <Input />

                        <footer className='absolute bottom-2 text-gray-700'>
                            © {new Date().getFullYear()} By{' '}
                            <UnderlineLink href='https://devnic.vercel.app/?ref=tsnextstarter'>Nico Gulo</UnderlineLink>
                        </footer>
                    </div>
                </section>
            </main>
        </Layout>
    )
}
