import Button from '@components/buttons/Button'
import Container from '@components/Container'
import React, { useEffect, useState } from 'react'

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
    const [isLoading, setIsLoading] = useState(true)

    // Instagram embed URLs - hanya menggunakan satu post yang sama untuk semua
    const instagramPosts = [
        {
            id: 1,
            embedUrl: 'https://www.instagram.com/p/DRGmqrwEc1s/?utm_source=ig_embed&utm_campaign=loading',
            caption: 'INVISHIELD PROTECTIVE FILM - Keep your watch scratch-free'
        },
        {
            id: 2,
            embedUrl: 'https://www.instagram.com/p/DRGmqrwEc1s/?utm_source=ig_embed&utm_campaign=loading',
            caption: 'Luxury timepiece collection'
        },
        {
            id: 3,
            embedUrl: 'https://www.instagram.com/p/DRGmqrwEc1s/?utm_source=ig_embed&utm_campaign=loading',
            caption: 'Premium watch protection'
        },
        {
            id: 4,
            embedUrl: 'https://www.instagram.com/p/DRGmqrwEc1s/?utm_source=ig_embed&utm_campaign=loading',
            caption: 'The Watch Collections showcase'
        }
    ]

    useEffect(() => {
        // Load Instagram embed script
        const script = document.createElement('script')
        script.src = 'https://www.instagram.com/embed.js'
        script.async = true
        script.onload = () => {
            setIsLoading(false)
            // Process embeds after script loads
            if (window.instgrm) {
                window.instgrm.Embeds.process()
            }
        }
        document.body.appendChild(script)

        return () => {
            // Cleanup script on unmount
            const existingScript = document.querySelector('script[src="https://www.instagram.com/embed.js"]')
            if (existingScript) {
                document.body.removeChild(existingScript)
            }
        }
    }, [])

    if (isLoading) {
        return (
            <section className='bg-grey-white py-16 xl:py-[116px]'>
                <Container>
                    <div className='text-center'>
                        <p>Loading Instagram posts...</p>
                    </div>
                </Container>
            </section>
        )
    }

    return (
        <section className='bg-grey-white py-16 xl:py-[116px]'>
            <Container>
                <div className='flex flex-col items-center gap-10'>
                    {/* Header */}
                    <div className='text-center'>
                        <h2 className='text-heading-2-desktop text-grey-black mb-2'>New in Instagram</h2>
                        <p className='text-grey-500 mb-6'>@thewatchcollections</p>
                        <Button variant='secondary'>Follow Us</Button>
                    </div>

                    {/* Instagram Photos Grid - menggunakan embed tapi dikustomisasi */}
                    <div className='grid w-full max-w-6xl grid-cols-2 gap-4 xl:grid-cols-4 xl:gap-6'>
                        {instagramPosts.map((post) => (
                            <div key={post.id} className='relative aspect-square overflow-hidden rounded-lg'>
                                {/* Instagram Embed - akan di-replace oleh script Instagram */}
                                <blockquote
                                    className='instagram-media'
                                    data-instgrm-permalink={post.embedUrl}
                                    data-instgrm-version='14'
                                    style={{
                                        background: '#FFF',
                                        border: '0',
                                        borderRadius: '8px',
                                        margin: '0',
                                        maxWidth: 'none',
                                        minWidth: 'auto',
                                        padding: '0',
                                        width: '100%',
                                        height: '100%'
                                    }}
                                >
                                    {/* Fallback content while loading */}
                                    <div
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            backgroundColor: '#f4f4f4',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            borderRadius: '8px'
                                        }}
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
                        ))}
                    </div>

                    {/* Find Us in Social Media */}
                    <div className='w-full max-w-4xl'>
                        <h3 className='text-heading-3-desktop text-grey-black mb-8 text-center'>
                            Find Us in Social Media
                        </h3>
                        <div className='grid grid-cols-2 gap-4 xl:grid-cols-4'>
                            <a
                                href='https://instagram.com/thewatchcollections'
                                target='_blank'
                                rel='noopener noreferrer'
                                className='border-grey-300 hover:border-grey-500 flex flex-col items-center gap-2 rounded-lg border p-4 transition-colors'
                            >
                                <div className='bg-grey-900 flex h-8 w-8 items-center justify-center rounded-full'>
                                    <span className='text-xs text-white'>I</span>
                                </div>
                                <span className='text-grey-900 text-sm font-medium'>Instagram</span>
                                <span className='text-grey-500 text-xs'>@thewatchcollections</span>
                            </a>
                            <a
                                href='#'
                                className='border-grey-300 hover:border-grey-500 flex flex-col items-center gap-2 rounded-lg border p-4 transition-colors'
                            >
                                <div className='bg-grey-900 flex h-8 w-8 items-center justify-center rounded-full'>
                                    <span className='text-xs text-white'>Y</span>
                                </div>
                                <span className='text-grey-900 text-sm font-medium'>YouTube</span>
                                <span className='text-grey-500 text-xs'>@thewatchcollections</span>
                            </a>
                            <a
                                href='#'
                                className='border-grey-300 hover:border-grey-500 flex flex-col items-center gap-2 rounded-lg border p-4 transition-colors'
                            >
                                <div className='bg-grey-900 flex h-8 w-8 items-center justify-center rounded-full'>
                                    <span className='text-xs text-white'>T</span>
                                </div>
                                <span className='text-grey-900 text-sm font-medium'>TikTok</span>
                                <span className='text-grey-500 text-xs'>@thewatchcollections</span>
                            </a>
                            <a
                                href='#'
                                className='border-grey-300 hover:border-grey-500 flex flex-col items-center gap-2 rounded-lg border p-4 transition-colors'
                            >
                                <div className='bg-grey-900 flex h-8 w-8 items-center justify-center rounded-full'>
                                    <span className='text-xs text-white'>L</span>
                                </div>
                                <span className='text-grey-900 text-sm font-medium'>LinkedIn</span>
                                <span className='text-grey-500 text-xs'>@thewatchcollections</span>
                            </a>
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    )
}

export default Instagram
