/* eslint-disable react/jsx-props-no-spreading */
import classNames from '@lib/classnames'
import React from 'react'

import IconComponents from './Images'

export type IconType = keyof typeof IconComponents

export interface IconsProps extends React.SVGProps<SVGSVGElement> {
    /**
     * Icon name
     */
    icon: IconType
    /**
     * Data test id
     */
    dataTestId?: string
    /**
     * Wrapper ClassName
     */
    WrapperClassName?: string
}

const Icons: React.FC<IconsProps> = ({
    icon,
    width = 16,
    height = 16,
    dataTestId = 'reku-icon',
    WrapperClassName,
    ...props
}: IconsProps) => {
    const Component = IconComponents[icon] as React.FC<React.SVGProps<SVGSVGElement>>

    return (
        <div
            data-testid={dataTestId || 'icon'}
            data-name={`icon-${icon}`}
            className={classNames('inline-flex h-fit w-fit items-center justify-center', WrapperClassName)}
        >
            <Component width={width} height={height} {...props} />
        </div>
    )
}

export default Icons
