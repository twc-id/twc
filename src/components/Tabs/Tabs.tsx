'use client'

import classNames from '@lib/classnames'
import { motion } from 'framer-motion'
import React, { PropsWithChildren, useEffect, useMemo, useRef } from 'react'

interface IPillsTabProps {
    children: React.ReactNode
    className?: string
    columnLimit?: number
    disableScroll?: boolean
}

interface ITabProps extends React.HTMLProps<HTMLDivElement> {
    layoutId?: string
    isActive?: boolean
    onClick?: () => void
}

const Tabs = ({ children, className, columnLimit, disableScroll }: IPillsTabProps) => {
    const initial = useRef(false)
    const ref = useRef<HTMLDivElement>(null)
    const id = useMemo(() => Math.random().toString(36).substring(7), [])

    const childrenWithProps = React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
            if (child.type === Tab) {
                return React.cloneElement(child, { layoutId: child.props.layoutId ?? id } as ITabProps)
            } else {
                const children = React.Children.map(child.props.children, (child) => {
                    if (React.isValidElement(child)) {
                        return React.cloneElement(child, { layoutId: id } as ITabProps)
                    }

                    return child
                })

                return React.cloneElement(child, { children } as PropsWithChildren)
            }
        }

        return child
    })

    useEffect(() => {
        if (!initial.current) initial.current = true
    }, [])

    useEffect(() => {
        if (initial.current && ref.current) {
            const activeTab = ref.current.querySelector('.tab-active')

            if (activeTab) {
                const containerRect = ref.current.getBoundingClientRect()
                const tabRect = activeTab.getBoundingClientRect()

                if (containerRect && tabRect) {
                    const containerCenter = containerRect.left + containerRect.width / 2
                    const tabCenter = tabRect.left + tabRect.width / 2

                    ref.current.scrollTo({
                        left: tabCenter - containerCenter + ref.current.scrollLeft,
                        behavior: 'smooth'
                    })
                }
            }
        }
    }, [children])

    return (
        <div
            className={classNames(
                'scrollbar-none rounded-xs border-b-grey-100 flex gap-4 border-b',
                disableScroll ? 'overflow-visible' : 'overflow-scroll',
                columnLimit ? `grid` : 'flex',
                className
            )}
            style={{
                gridTemplateColumns: columnLimit ? `repeat(${columnLimit}, 1fr)` : undefined
            }}
            ref={ref}
        >
            {childrenWithProps}
        </div>
    )
}

export const Tab = ({ isActive = false, onClick, children, layoutId, className, ...props }: ITabProps) => {
    return (
        <div
            className={classNames('rounded-xs relative w-full cursor-pointer py-1 text-center', className, {
                'tab-active': isActive
            })}
            onClick={onClick}
            {...props}
        >
            <div
                className={classNames('text-md text-grey-500 relative z-[1] text-nowrap font-normal', {
                    'font-semibold': isActive
                })}
            >
                {children}
            </div>
            {isActive && (
                <motion.div
                    layoutId={layoutId}
                    className='bg-grey-black absolute bottom-0 h-[1px] w-full'
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
            )}
        </div>
    )
}

export default Tabs
