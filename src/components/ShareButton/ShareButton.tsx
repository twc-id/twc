import Icons from '@components/Icon'
import classNames from '@lib/classnames'
import { GA_EVENTS } from '@lib/constants/analyticsEvents'
import { trackEvent } from '@lib/ga'
import { useRouter } from 'next/router'
import React, { useState } from 'react'

export interface ShareIntro {
    en: string
    id: string
}

interface ShareButtonProps {
    intro: ShareIntro
    // Telegram renders the link at the top (url param), so it uses a shorter
    // intro without the trailing "view here" line. Falls back to `intro`.
    telegramIntro?: ShareIntro
    // Push the button up on mobile to avoid overlapping with a sticky bottom bar
    offsetBottom?: boolean
    // GA tracking context: page the share menu lives on (e.g. 'Product details')
    pageName: string
    // GA tracking context: the product/article title being shared
    title?: string
}

// Maps each share action to its GA event + Button Location label (per analytics spec)
const SHARE_TRACKING: Record<'whatsapp' | 'facebook' | 'telegram' | 'copy', { event: string; location: string }> = {
    whatsapp: { event: GA_EVENTS.SHARE_WA, location: 'Share WA' },
    facebook: { event: GA_EVENTS.SHARE_FACEBOOK, location: 'Share facebook' },
    telegram: { event: GA_EVENTS.SHARE_TELEGRAM, location: 'Share telegram' },
    copy: { event: GA_EVENTS.COPY_LINK, location: 'Copy link' }
}

const ShareButton: React.FC<ShareButtonProps> = ({ intro, telegramIntro, offsetBottom, pageName, title }) => {
    const [open, setOpen] = useState(false)
    const [copied, setCopied] = useState(false)
    const { locale } = useRouter()

    const trackShare = (action: keyof typeof SHARE_TRACKING) => {
        const { event, location } = SHARE_TRACKING[action]
        trackEvent(event, {
            'Button Title': title || (typeof document !== 'undefined' ? document.title : ''),
            'Button Location': location,
            'Button Page': pageName
        })
    }

    const handleShare = (platform: 'whatsapp' | 'facebook' | 'telegram') => {
        if (typeof window === 'undefined') return

        const pageUrl = window.location.href
        const isId = locale === 'id'
        const introText = isId ? intro.id : intro.en
        const tgIntro = telegramIntro ? (isId ? telegramIntro.id : telegramIntro.en) : introText

        const url = encodeURIComponent(pageUrl)
        const message = encodeURIComponent(`${introText}\n${pageUrl}`)
        const tgText = encodeURIComponent(tgIntro)

        const shareUrls: Record<typeof platform, string> = {
            whatsapp: `https://wa.me/?text=${message}`,
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
            telegram: `https://t.me/share/url?url=${url}&text=${tgText}`
        }

        trackShare(platform)
        window.open(shareUrls[platform], '_blank', 'noopener,noreferrer')
    }

    const handleCopyLink = () => {
        if (typeof window === 'undefined') return
        navigator.clipboard.writeText(window.location.href)
        trackShare('copy')
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const options: { platform: 'whatsapp' | 'facebook' | 'telegram'; icon: 'Whatsapp' | 'Facebook' | 'Telegram' }[] = [
        { platform: 'whatsapp', icon: 'Whatsapp' },
        { platform: 'facebook', icon: 'Facebook' },
        { platform: 'telegram', icon: 'Telegram' }
    ]

    return (
        <div
            className={classNames(
                'fixed right-6 z-[99990] flex flex-col items-end gap-3',
                offsetBottom ? 'bottom-[100px] xl:bottom-6' : 'bottom-6'
            )}
        >
            <div
                className={classNames(
                    'flex flex-col items-end gap-3 transition-all duration-200',
                    open ? 'pointer-events-auto opacity-100' : 'pointer-events-none translate-y-2 opacity-0'
                )}
            >
                {options.map((option) => (
                    <button
                        key={option.platform}
                        type='button'
                        aria-label={`Share to ${option.platform}`}
                        onClick={() => handleShare(option.platform)}
                        className={classNames(
                            'text-grey-black flex h-11 w-11 items-center justify-center bg-white shadow-md transition-transform hover:scale-105'
                        )}
                    >
                        <Icons icon={option.icon} width={22} height={22} />
                    </button>
                ))}
            </div>

            <button
                type='button'
                aria-label={copied ? 'Link copied' : 'Copy link'}
                onClick={handleCopyLink}
                className={classNames(
                    'flex h-11 w-11 items-center justify-center bg-white shadow-md transition-all hover:scale-105',
                    copied ? 'text-success-500' : 'text-grey-black',
                    open ? 'pointer-events-auto opacity-100' : 'pointer-events-none translate-y-2 opacity-0'
                )}
            >
                <Icons icon={copied ? 'Checklist' : 'Chain'} width={22} height={22} />
            </button>

            <button
                type='button'
                aria-label={open ? 'Close share menu' : 'Share'}
                onClick={() => setOpen((prev) => !prev)}
                className={classNames(
                    'bg-grey-black flex h-11 w-11 items-center justify-center text-white shadow-md transition-transform hover:scale-105'
                )}
            >
                <Icons icon={open ? 'XClose' : 'Share'} width={22} height={22} />
            </button>
        </div>
    )
}

export default ShareButton
