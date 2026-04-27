import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react'
import classNames from '@lib/classnames'
import React, { Fragment, PropsWithChildren } from 'react'
import { When } from 'react-if'

import Icons from '../Icon'

export const modalOverlayClassName = 'xmodal-overlay'
export const modalDialogClassName = 'xmodal-dialog'

interface ModalProps extends PropsWithChildren {
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
    staticModal?: boolean
}

const Modal = ({
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
    withClose = true,
    staticModal = true
}: ModalProps) => {
    const handleClose = () => {
        onClose()
    }

    return (
        <Transition appear show={open} as={Fragment}>
            <Dialog
                as='div'
                static={staticModal}
                className={classNames('relative z-50', dialogClassName)}
                onClose={() => {
                    if (closeBackdrop) {
                        handleClose()
                    }
                }}
            >
                <TransitionChild
                    as={Fragment}
                    enter='ease-out duration-300'
                    enterFrom='opacity-0'
                    enterTo='opacity-100'
                    leave='ease-in duration-200'
                    leaveFrom='opacity-100'
                    leaveTo='opacity-0'
                >
                    {/* Colors/others/dropdown menu overlay */}
                    <div className='bg-dropdown-menu-overlay fixed inset-0' />
                </TransitionChild>
                <div className='fixed inset-0 overflow-y-auto'>
                    <div className='flex min-h-full items-center justify-center text-center'>
                        <TransitionChild
                            as={Fragment}
                            enter='ease-out duration-300'
                            enterFrom='opacity-0 scale-95'
                            enterTo='opacity-100 scale-100'
                            leave='ease-in duration-200'
                            leaveFrom='opacity-100 scale-100'
                            leaveTo='opacity-0 scale-95'
                        >
                            <DialogPanel
                                className={classNames(
                                    "'w-full transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all",
                                    wrapperClassName,
                                    {
                                        'h-[100dvh] w-[100vw] rounded-none p-3': fullscreen,
                                        'w-[640px] rounded-xl p-6': !fullscreen
                                    }
                                )}
                                style={{
                                    // eslint-disable-next-line no-nested-ternary
                                    width: fullscreen ? '100vw' : width ? `${width}px` : '420px'
                                }}
                            >
                                <div className='relative flex h-full flex-col gap-8'>
                                    <div
                                        className={classNames(
                                            'relative flex items-center justify-between gap-3',
                                            headerClassName,
                                            {
                                                'flex-row-reverse': closePosition === 'left'
                                            }
                                        )}
                                    >
                                        <DialogTitle
                                            as='h3'
                                            className='xl:text-subheading-2-desktop text-subheading-2-mobile text-grey-black flex-1 font-medium leading-6'
                                        >
                                            {title}
                                        </DialogTitle>
                                        <When condition={withClose}>
                                            <Icons
                                                icon='XClose'
                                                width={24}
                                                height={24}
                                                className='text-grey-500 cursor-pointer'
                                                onClick={() => {
                                                    handleClose()
                                                }}
                                            />
                                        </When>
                                    </div>
                                    <div
                                        className={classNames('scrollbar-none flex-1 overflow-y-auto', {
                                            'h-full': fullscreen,
                                            'max-h-[520px]': !fullscreen
                                        })}
                                    >
                                        {children}
                                    </div>
                                    <When condition={!!footer}>
                                        <div className={classNames('-m-3 ', footerClassName)}>
                                            <div className='p-3'>{footer}</div>
                                        </div>
                                    </When>
                                </div>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}

export default Modal
