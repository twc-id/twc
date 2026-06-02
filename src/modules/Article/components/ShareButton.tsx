import Icons from '@components/Icon'
import classNames from '@lib/classnames'
import React, { useState } from 'react'

interface ShareButtonProps {
    title?: string
}

const ShareButton: React.FC<ShareButtonProps> = ({ title }) => {
    const [open, setOpen] = useState(false)

    const handleShare = (platform: 'whatsapp' | 'facebook' | 'telegram') => {
        if (typeof window === 'undefined') return

        const url = encodeURIComponent(window.location.href)
        const text = encodeURIComponent(title || document.title)

        const shareUrls: Record<typeof platform, string> = {
            whatsapp: `https://wa.me/?text=${text}%20${url}`,
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
            telegram: `https://t.me/share/url?url=${url}&text=${text}`
        }

        window.open(shareUrls[platform], '_blank', 'noopener,noreferrer')
    }

    const options: { platform: 'whatsapp' | 'facebook' | 'telegram'; icon: 'Whatsapp' | 'Facebook' | 'Telegram' }[] = [
        { platform: 'whatsapp', icon: 'Whatsapp' },
        { platform: 'facebook', icon: 'Facebook' },
        { platform: 'telegram', icon: 'Telegram' }
    ]

    return (
        <div className='fixed bottom-6 right-6 z-[99990] flex flex-col items-end gap-3'>
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
                        className='text-grey-black flex h-14 w-14 items-center justify-center bg-white shadow-md transition-transform hover:scale-105'
                    >
                        <Icons icon={option.icon} width={22} height={22} />
                    </button>
                ))}
            </div>

            <button
                type='button'
                aria-label={open ? 'Close share menu' : 'Share article'}
                onClick={() => setOpen((prev) => !prev)}
                className='bg-grey-black flex h-14 w-14 items-center justify-center text-white shadow-md transition-transform hover:scale-105'
            >
                <Icons icon={open ? 'XClose' : 'Share'} width={22} height={22} />
            </button>
        </div>
    )
}

export default ShareButton
