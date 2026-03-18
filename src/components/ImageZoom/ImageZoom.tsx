import Icons from '@components/Icon'
import Modal from '@components/Modal/Modal'
import classNames from '@lib/classnames'
import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'
import { useMediaQuery } from 'react-responsive'
import { ReactZoomPanPinchRef, TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch'

interface Props {
    images: Array<{ src: string; alt?: string }>
    open: boolean
    initialIndex?: number
    onClose: () => void
}

const ImageZoom: React.FC<Props> = ({ images = [], open, initialIndex = 0, onClose }) => {
    const isMobile = useMediaQuery({ maxWidth: 1279 })
    const [index, setIndex] = useState<number>(initialIndex || 0)
    const [scale, setScale] = useState<number>(1)
    const wrapperRef = useRef<ReactZoomPanPinchRef | null>(null)

    useEffect(() => {
        setIndex(initialIndex)
        // reset transform when initialIndex changes
        if (wrapperRef.current) wrapperRef.current.resetTransform()
        setScale(1)
    }, [initialIndex, open])

    const current = images[index]

    const handleThumbClick = (i: number) => {
        setIndex(i)
        if (wrapperRef.current) wrapperRef.current.resetTransform()
        setScale(1)
    }

    const handleClose = () => {
        if (wrapperRef.current) wrapperRef.current.resetTransform()
        onClose()
    }

    return (
        <Modal
            open={open}
            onClose={handleClose}
            headerClassName='!hidden'
            closeBackdrop
            withClose
            closePosition='right'
            fullscreen
            title=''
            dialogClassName='!z-[9999]' // ensure modal is above all other elements, especially ScrollSmoother layers
            wrapperClassName='!px-2 !py-0'
        >
            <div
                className='bg-button-secondary-on-white-press/20 absolute right-5 top-5 z-[101] flex cursor-pointer items-center justify-center rounded-xl p-2'
                onClick={handleClose}
            >
                <Icons icon='XClose' width={24} height={24} className='text-grey-white' />
            </div>
            <div className='flex h-full w-full gap-2'>
                {/* Left thumbnails */}
                <div className='hidden shrink-0 flex-col gap-3 overflow-auto pt-2 xl:flex'>
                    {images.map((img, i) => (
                        <button
                            key={i}
                            onClick={() => handleThumbClick(i)}
                            className={classNames('w-[92px] transition-opacity focus:outline-none', {
                                'opacity-100': i === index,
                                'opacity-50': i !== index
                            })}
                        >
                            <div className='h-[110px] w-[92px]'>
                                <Image
                                    src={img.src}
                                    alt={img.alt || `thumb-${i}`}
                                    width={0}
                                    height={0}
                                    sizes='100vw'
                                    className='h-full w-full object-cover'
                                />
                            </div>
                        </button>
                    ))}
                </div>

                {/* Main viewport */}
                <div className='relative flex h-full w-full flex-col items-center justify-start'>
                    <div className='h-full w-full '>
                        <TransformWrapper
                            ref={wrapperRef as any}
                            doubleClick={{ disabled: true }}
                            pinch={{ disabled: isMobile }}
                            wheel={{ disabled: isMobile }}
                            initialScale={1}
                            minScale={1}
                            maxScale={2}
                            onTransformed={(_, state) => {
                                setScale(state.scale)
                            }}
                        >
                            {() => (
                                <>
                                    <div className='flex w-full items-center justify-center xl:h-full'>
                                        <TransformComponent
                                            contentClass='!w-full !h-full'
                                            wrapperClass='!w-full !h-full'
                                        >
                                            <div
                                                style={{ cursor: scale > 1 ? 'grab' : 'zoom-in' }}
                                                onClick={() => {
                                                    if (scale <= 1 && wrapperRef.current) {
                                                        wrapperRef.current.centerView(2)
                                                    }
                                                }}
                                                className='flex h-full max-h-screen min-h-[calc(95dvh-140px)] w-full items-center justify-center xl:min-h-full'
                                            >
                                                <Image
                                                    src={current?.src || ''}
                                                    alt={current?.alt || ''}
                                                    width={0}
                                                    height={0}
                                                    sizes='100vw'
                                                    className='h-full w-auto object-contain xl:h-[745px]'
                                                />
                                            </div>
                                        </TransformComponent>
                                    </div>

                                    <div className='bg-dropdown-menu-overlay absolute bottom-[25%] left-1/2 flex w-fit -translate-x-1/2 transform items-center justify-center gap-6 rounded-full xl:bottom-14'>
                                        <button
                                            onClick={() => {
                                                if (wrapperRef.current) {
                                                    wrapperRef.current.centerView(1)
                                                }
                                            }}
                                            disabled={scale <= 1}
                                            className={classNames(
                                                'py-2 pl-4 focus:outline-none',
                                                scale <= 1 ? 'text-grey-white/30 cursor-not-allowed' : 'text-grey-white'
                                            )}
                                        >
                                            −
                                        </button>
                                        <div className=' text-grey-white py-2'>
                                            {Math.round(((scale || 1) / 1) * 100)}%
                                        </div>
                                        <button
                                            onClick={() => {
                                                if (wrapperRef.current) {
                                                    wrapperRef.current.centerView(2)
                                                }
                                            }}
                                            disabled={scale >= 2}
                                            className={classNames(
                                                'py-2 pr-4 focus:outline-none',
                                                scale >= 2 ? 'text-grey-white/30 cursor-not-allowed' : 'text-grey-white'
                                            )}
                                        >
                                            +
                                        </button>
                                    </div>
                                </>
                            )}
                        </TransformWrapper>

                        {/* Mobile thumbnails below */}
                        <div className='scrollbar-none mt-6 flex w-full gap-3 overflow-auto xl:hidden'>
                            {images.map((img, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleThumbClick(i)}
                                    className={classNames('transition-opacity', {
                                        'opacity-100': i === index,
                                        'opacity-50': i !== index
                                    })}
                                >
                                    <div className='h-[110px] w-[92px] '>
                                        <Image
                                            src={img.src}
                                            alt={img.alt || `thumb-${i}`}
                                            width={0}
                                            height={0}
                                            sizes='100vw'
                                            className='h-full w-full object-cover'
                                        />
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    )
}

export default ImageZoom
