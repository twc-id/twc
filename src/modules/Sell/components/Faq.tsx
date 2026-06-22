import Container from '@components/Container'
import Icons from '@components/Icon'
import { useTheme } from '@contexts/ThemeContext'
import classNames from '@lib/classnames'
import { useInView } from 'motion/react'
import { useTranslation } from 'next-i18next'
import React, { useEffect, useRef, useState } from 'react'
import { useCollapse } from 'react-collapsed'

interface CollapseProps {
    title: string
    defaultExpanded?: boolean
    children: React.ReactNode
}

const Collapse = ({ title, defaultExpanded, children }: CollapseProps) => {
    const [isExpanded, setIsExpanded] = useState(defaultExpanded || false)
    const { getToggleProps, getCollapseProps } = useCollapse({ isExpanded })

    return (
        <div className='border-grey-100 border-b py-3 xl:px-4'>
            <button
                className='flex w-full items-center justify-between text-left focus:outline-none'
                {...getToggleProps({
                    onClick: () => setIsExpanded(!isExpanded)
                })}
            >
                <h4 className='xl:text-subheading-4-desktop text-subheading-4-mobile text-grey-black dark:text-grey-white'>
                    {title}
                </h4>

                <Icons
                    icon='ChevronDown'
                    width={16}
                    height={16}
                    className={classNames('text-grey-500 dark:text-grey-400 transition-transform ', {
                        'rotate-180': isExpanded
                    })}
                />
            </button>
            <div {...getCollapseProps()}>
                <div className='mt-2'>{children}</div>
            </div>
        </div>
    )
}

const Faq = () => {
    const { t } = useTranslation('sell')
    const sectionRef = useRef<HTMLElement>(null)
    const { setIsDarkSection } = useTheme()

    const isInView = useInView(sectionRef, { margin: '-50% 0px -50% 0px' })

    useEffect(() => {
        if (isInView) setIsDarkSection(false)
    }, [isInView, setIsDarkSection])

    const items = Object.values(t('faq.items', { returnObjects: true })) as { question: string; answer: string }[]

    return (
        <section ref={sectionRef} className='pt-14 xl:pt-[116px]'>
            <Container>
                <div className='flex flex-col justify-between gap-7 xl:flex-row'>
                    <h1 className='xl:text-heading-2-desktop text-heading-2-mobile text-grey-black dark:text-grey-white max-w-[300px]'>
                        {t('faq.title')}
                    </h1>

                    <div className='flex w-full flex-col gap-5 xl:max-w-[602px] xl:gap-6'>
                        {items.map((item, index) => (
                            <Collapse key={item.question} title={item.question} defaultExpanded={index === 0}>
                                <span className='xl:text-paragraph-8-desktop text-paragraph-8-mobile text-grey-500'>
                                    {item.answer}
                                </span>
                            </Collapse>
                        ))}
                    </div>
                </div>
            </Container>
        </section>
    )
}

export default Faq
