import Button from '@components/buttons/Button'
import Container from '@components/Container'
import Icons from '@components/Icon'
import { IconsProps } from '@components/Icon/Icon'
import listLocation from '@constant/location'
import { useInstagramPosts } from '@hooks/useInstagramPosts'
import classNames from '@lib/classnames'
import { GA_EVENTS } from '@lib/constants/analyticsEvents'
import { trackEvent } from '@lib/ga'
import { motion } from 'motion/react'
import { useRouter } from 'next/router'
import { Trans, useTranslation } from 'next-i18next'
import React, { useEffect, useRef } from 'react'

// Declare Instagram Embeds type for window object
declare global {
    interface Window {
        instgrm?: {
            Embeds: {
                process: () => void
            }
        }
    }
}

const Instagram = () => {
    const { t } = useTranslation('home')
    const router = useRouter()
    const { data: instagramPosts = [] } = useInstagramPosts()
    const sectionRef = useRef<HTMLElement>(null)
    const embedsProcessed = useRef(false)
    const locationMatch = listLocation.find((loc) => {
        if (loc.path.endsWith('/*')) {
            const basePath = loc.path.replace('/*', '')
            return router.pathname.startsWith(basePath)
        }
        return router.pathname === loc.path
    })
    const locationMatchRef = useRef(locationMatch)
    locationMatchRef.current = locationMatch

    const socialMediaItems = [
        {
            name: 'Instagram',
            url: 'https://instagram.com/thewatchcollections',
            icon: 'Instagram',
            handle: '@thewatchcollections'
        }
        // {
        //     name: 'Youtube',
        //     url: 'https://youtube.com/thewatchcollections',
        //     icon: 'Youtube',
        //     handle: '@thewatchcollections'
        // },
        // {
        //     name: 'Tiktok',
        //     url: 'https://tiktok.com/@thewatchcollections',
        //     icon: 'Tiktok',
        //     handle: '@thewatchcollections'
        // },
        // {
        //     name: 'LinkedIn',
        //     url: 'https://linkedin.com/company/thewatchcollections',
        //     icon: 'LinkedIn',
        //     handle: '@thewatchcollections'
        // }
    ]

    useEffect(() => {
        if (!instagramPosts.length) return

        const processEmbeds = () => {
            window.instgrm?.Embeds.process()
            embedsProcessed.current = true
        }

        if (window.instgrm) {
            processEmbeds()
            return
        }

        // Avoid adding duplicate scripts
        const existingScript = document.querySelector('script[src="https://www.instagram.com/embed.js"]')
        if (existingScript) {
            existingScript.addEventListener('load', processEmbeds, { once: true })
            return () => existingScript.removeEventListener('load', processEmbeds)
        }

        const script = document.createElement('script')
        script.src = 'https://www.instagram.com/embed.js'
        script.async = true
        script.onload = processEmbeds
        document.body.appendChild(script)
    }, [instagramPosts.length])

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState !== 'hidden') return

            const activeEl = document.activeElement
            if (!activeEl || activeEl.tagName !== 'IFRAME') return

            const instagramIframes = document.querySelectorAll('.instagram-post-item iframe')
            if (!Array.from(instagramIframes).some((f) => f === activeEl)) return

            trackEvent(GA_EVENTS.INTEREST_INSTAGRAM_EMBED, {
                'Button Location': 'New in Instagram (embed)',
                'Button Page': locationMatchRef.current?.label
            })
        }

        document.addEventListener('visibilitychange', handleVisibilityChange)
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
    }, [])

    return (
        <section
            ref={sectionRef}
            id='social-media-section'
            className='bg-grey-white relative z-[12] pb-16 pt-14 xl:pb-[160px] xl:pt-[116px]'
        >
            <Container>
                <div className='flex w-full flex-col items-center gap-16 xl:gap-10'>
                    {/* Header */}
                    <div className='flex flex-col items-center gap-1 text-center'>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 1, ease: [0.33, 1, 0.68, 1] }}
                            className='xl:text-heading-2-desktop text-heading-2-mobile text-grey-black mb-2'
                        >
                            {t('social_media.title')}
                        </motion.h2>
                        <p className='xl:text-paragraph-7-desktop text-paragraph-7-mobile text-grey-500'>
                            @thewatchcollections
                        </p>
                        <motion.a
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 1, ease: [0.33, 1, 0.68, 1], delay: 0.3 }}
                            href='https://www.instagram.com/thewatchcollections/'
                            target='_blank'
                            rel='noopener noreferrer'
                            onClick={() =>
                                trackEvent(GA_EVENTS.INTEREST_INSTAGRAM, {
                                    'Button Location': 'New in Instagram',
                                    'Button Page': locationMatch?.label
                                })
                            }
                        >
                            <Button variant='secondaryInverse' className='xl:mt-9'>
                                {t('common:follow_us')}
                            </Button>
                        </motion.a>
                    </div>

                    {/* Instagram Photos Grid - menggunakan embed tapi dikustomisasi */}
                    <div className='scrollbar-hide -mx-4 flex w-full snap-x snap-mandatory flex-row gap-2 overflow-x-auto xl:mx-0 xl:w-full xl:snap-none xl:justify-between xl:overflow-visible xl:px-0'>
                        {instagramPosts.map((post) => (
                            <div
                                key={post.id}
                                className='instagram-post-item relative h-[388px] w-[312px] flex-shrink-0 snap-center overflow-hidden'
                            >
                                {/* Instagram Embed - crop to photo only (312x388), hide header & footer */}
                                <div className='-mt-[54px]' style={{ height: 'calc(100% + 54px + 400px)' }}>
                                    <blockquote
                                        className='instagram-media'
                                        data-instgrm-permalink={post.url}
                                        data-instgrm-version='14'
                                        style={{
                                            background: '#FFF',
                                            border: '0',
                                            borderRadius: '8px',
                                            margin: '0',
                                            maxWidth: 'none',
                                            padding: '0',
                                            width: '100%',
                                            height: '100%'
                                        }}
                                    >
                                        {/* Fallback content while loading */}
                                        <div
                                            style={{
                                                backgroundColor: '#f4f4f4',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                            className='h-[388px] w-[312px]'
                                        >
                                            <div
                                                style={{
                                                    fontSize: '14px',
                                                    color: '#8e8e8e',
                                                    textAlign: 'center'
                                                }}
                                            >
                                                <p>Loading Instagram post...</p>
                                            </div>
                                        </div>
                                    </blockquote>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Find Us in Social Media - only show if more than 1 social media platform */}
                    {socialMediaItems.length > 1 && (
                        <div
                            className={classNames(
                                'flex w-full flex-col justify-between gap-8 xl:flex-row xl:items-center xl:pt-10',
                                {
                                    'justify-start': socialMediaItems.length < 2
                                }
                            )}
                        >
                            <h3 className='xl:text-heading-3-desktop text-heading-3-mobile text-grey-black flex-shrink-0 whitespace-pre-line '>
                                <Trans i18nKey='social_media.find_us_social_media' components={{ br: <br /> }}>
                                    {t('social_media.find_us_social_media')}
                                </Trans>
                            </h3>
                            <div className='grid flex-shrink-0 grid-cols-2 grid-rows-2 flex-row gap-x-5  gap-y-5 xl:flex xl:gap-[72px]'>
                                {socialMediaItems.map((item) => (
                                    <a
                                        key={item.name}
                                        href={item.url}
                                        target='_blank'
                                        rel='noopener noreferrer'
                                        className='flex flex-col gap-3 xl:flex-row xl:items-center xl:gap-4'
                                    >
                                        <Icons
                                            icon={item.icon as IconsProps['icon']}
                                            width={32}
                                            height={32}
                                            className='text-grey-900 hover:text-grey-500'
                                        />

                                        <span className='text-grey-500 xl:text-paragraph-7-desktop text-paragraph-7-mobile'>
                                            {item.handle}
                                        </span>
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </Container>
        </section>
    )
}

export default Instagram
