import classNames from '@lib/classnames'
import * as React from 'react'

type SkeletonProps = React.ComponentPropsWithoutRef<'div'>

export default function Skeleton({ className, ...rest }: SkeletonProps) {
    return (
        <div
            className={classNames('animate-shimmer bg-[#E9EAEC]', className)}
            style={{
                backgroundImage: 'linear-gradient(to right, #E9EAEC 0%, #edeef1 20%, #E9EAEC 40%, #E9EAEC 100%)',
                backgroundSize: '700px 100%',
                backgroundRepeat: 'no-repeat'
            }}
            {...rest}
        />
    )
}
