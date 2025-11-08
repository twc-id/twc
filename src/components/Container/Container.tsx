import classNames from '@lib/classnames'
import React from 'react'

export interface ContainerProps extends React.PropsWithChildren {
    className?: string
}

const Container = React.forwardRef<HTMLDivElement, ContainerProps>(({ children, className }, ref) => {
    return (
        <div
            ref={ref}
            className={classNames(
                'mx-auto my-0 box-border w-[90%] min-w-full max-w-[1400px] px-3 py-0 xl:min-w-[1210px]',
                className
            )}
        >
            {children}
        </div>
    )
})

Container.displayName = 'Container'

export default Container
