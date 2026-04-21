import Icons from '@components/Icon'
import classNames from '@lib/classnames'
import { motion } from 'motion/react'
import { PropsWithChildren, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

import { useFocusTrap } from './useFocusTrap'
import { useModalScroll } from './useModalScroll'

interface ModalV2Props extends PropsWithChildren {
    open: boolean
    onClose: () => void
    title: React.ReactNode
    closePosition?: 'left' | 'right'
    width?: number
    footer?: React.ReactNode
    fullscreen?: boolean
    dialogClassName?: string
    wrapperClassName?: string
    headerClassName?: string
    footerClassName?: string
    closeBackdrop?: boolean
    withClose?: boolean
}

const ModalV2 = ({
    open,
    onClose,
    title,
    closePosition = 'left',
    children,
    width,
    footer,
    fullscreen,
    dialogClassName,
    wrapperClassName,
    headerClassName,
    footerClassName,
    closeBackdrop,
    withClose = true
}: ModalV2Props) => {
    const modalContentRef = useRef<HTMLDivElement>(null)

    // Use scroll management hook
    useModalScroll(open)

    // Use focus trap for accessibility
    useFocusTrap(open, modalContentRef)

    // Handle Escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && open) {
                onClose()
            }
        }

        document.addEventListener('keydown', handleEscape)
        return () => document.removeEventListener('keydown', handleEscape)
    }, [open, onClose])

    // Don't render anything if not open
    if (!open) return null

    // Render via portal to document.body
    return (
        <>
            {
                createPortal(
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3, ease: [0.33, 1, 0.68, 1] }}
                            className='bg-dropdown-menu-overlay fixed inset-0 z-[998]'
                            onClick={() => {
                                if (closeBackdrop) {
                                    onClose()
                                }
                            }}
                            aria-hidden='true'
                        />

                        {/* Modal */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
                            className={classNames(
                                'fixed inset-0 z-[999] flex items-center justify-center overflow-y-auto p-4',
                                dialogClassName
                            )}
                            role='dialog'
                            aria-modal='true'
                            aria-labelledby='modal-title'
                        >
                            <div
                                ref={modalContentRef}
                                className={classNames(
                                    'w-full transform bg-white p-6 text-left shadow-xl',
                                    wrapperClassName,
                                    {
                                        'h-[100dvh] w-[100vw] rounded-none p-3': fullscreen,
                                        'rounded-2xl': !fullscreen
                                    }
                                )}
                                style={{
                                    maxWidth: fullscreen ? '100vw' : width ? `${width}px` : '420px'
                                }}
                            >
                                <div className='relative flex h-full flex-col gap-8'>
                                    {/* Header */}
                                    <div
                                        className={classNames(
                                            'relative flex items-center justify-between gap-3',
                                            headerClassName,
                                            {
                                                'flex-row-reverse': closePosition === 'left'
                                            }
                                        )}
                                    >
                                        <h2
                                            id='modal-title'
                                            className='xl:text-subheading-2-desktop text-subheading-2-mobile text-grey-black flex-1 font-medium'
                                        >
                                            {title}
                                        </h2>

                                        {withClose && (
                                            <Icons
                                                icon='XClose'
                                                width={24}
                                                height={24}
                                                className='text-grey-500 cursor-pointer'
                                                onClick={() => {
                                                    onClose()
                                                }}
                                            />
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div
                                        className={classNames('scrollbar-none flex-1 overflow-y-auto', {
                                            'h-full': fullscreen,
                                            'max-h-[520px]': !fullscreen
                                        })}
                                    >
                                        {children}
                                    </div>

                                    {/* Footer */}
                                    {footer && (
                                        <div className={classNames('-m-3', footerClassName)}>
                                            <div className='p-3'>{footer}</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </>,
                    document.body
                ) as any
            }
        </>
    )
}

export default ModalV2
