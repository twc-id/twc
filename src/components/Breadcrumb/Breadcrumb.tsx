import ConditionalWrapper from '@components/ConditionalWrapper'
import UnstyledLink from '@components/links/UnstyledLink'
import classNames from '@lib/classnames'

interface BreadcrumbProps {
    /**
     * The items of the breadcrumb.
     */
    items: {
        title: string
        href?: string
    }[]
    /**
     * The breakpoint of the breadcrumb.
     */
    breakpoint?: 'Desktop' | 'Mobile'
    onNavigate?: (index: number, item: { title: string; href?: string }) => void
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, onNavigate }) => {
    return (
        <div className='flex gap-4'>
            {items.map((item, index) => {
                const isLast = index === items.length - 1

                const content = (() => {
                    if (isLast) {
                        return (
                            <span className='text-grey-white  text-subheading-7-desktop line-clamp-1'>
                                {item.title}
                            </span>
                        )
                    }

                    if (onNavigate) {
                        return (
                            <button
                                type='button'
                                onClick={() => onNavigate(index, item)}
                                className={classNames(
                                    'text-grey-200 text-subheading-7-desktop  whitespace-nowrap text-left',
                                    {
                                        'hover:text-primary dark:hover:!text-dark-primary': Boolean(item?.href)
                                    }
                                )}
                            >
                                {item.title}
                            </button>
                        )
                    }

                    return (
                        <ConditionalWrapper
                            condition={Boolean(item?.href)}
                            // eslint-disable-next-line react/no-unstable-nested-components
                            wrapper={(children) => <UnstyledLink href={item?.href || ''}>{children}</UnstyledLink>}
                        >
                            <p
                                className={classNames('text-grey-200 text-subheading-7-desktop  whitespace-nowrap', {
                                    'hover:text-primary dark:hover:!text-dark-primary': Boolean(item?.href)
                                })}
                            >
                                {item.title}
                            </p>
                        </ConditionalWrapper>
                    )
                })()

                return (
                    <div className='text-subheading-7-desktop text-grey-200 flex items-center gap-4 ' key={item.title}>
                        {content}
                        {!isLast && <span className=''> / </span>}
                    </div>
                )
            })}
        </div>
    )
}

Breadcrumb.defaultProps = {
    breakpoint: 'Desktop'
}

export default Breadcrumb
