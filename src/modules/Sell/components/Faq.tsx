import Container from '@components/Container'
import Icons from '@components/Icon'
import { useTheme } from '@contexts/ThemeContext'
import { useGSAP } from '@gsap/react'
import classNames from '@lib/classnames'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import { useTranslation } from 'next-i18next'
import React, { useRef, useState } from 'react'
import { useCollapse } from 'react-collapsed'

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger)
}

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
    const titleRef = useRef<HTMLHeadingElement>(null)
    const faqRef = useRef<HTMLDivElement>(null)
    const { setIsDarkSection } = useTheme()

    const items = Object.values(t('faq.items', { returnObjects: true })) as { question: string; answer: string }[]

    useGSAP(() => {
        if (!sectionRef.current) return

        ScrollTrigger.create({
            trigger: sectionRef.current,
            start: 'top center',
            end: 'bottom center',
            onEnter: () => setIsDarkSection(false),
            onLeave: () => setIsDarkSection(false),
            onEnterBack: () => setIsDarkSection(false)
            // onLeaveBack: () => setIsDarkSection(true)
        })

        const timeline = gsap.timeline({
            scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top 80%',
                end: 'bottom 20%',
                toggleActions: 'restart none none reset'
            }
        })

        timeline.fromTo(titleRef.current, { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 1, ease: 'power2.out' })

        timeline.fromTo(
            faqRef.current,
            { opacity: 0, x: 30 },
            { opacity: 1, x: 0, duration: 1, ease: 'power2.out' },
            '-=0.5' // overlap with previous animation
        )

        return () => {
            ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
        }
    }, [setIsDarkSection])

    return (
        <section ref={sectionRef} className='pt-4 xl:pt-[116px]'>
            <Container>
                <div className='flex flex-col justify-between gap-7 xl:flex-row'>
                    <h1
                        className='xl:text-heading-2-desktop text-heading-2-mobile text-grey-black dark:text-grey-white line-clamp-2 max-w-[300px] xl:line-clamp-3'
                        ref={titleRef}
                    >
                        {t('faq.title')}
                    </h1>

                    <div className='flex w-full flex-col gap-5 xl:max-w-[602px] xl:gap-6' ref={faqRef}>
                        {items.map((item, index) => (
                            <Collapse key={item.question} title={item.question} defaultExpanded={index === 0}>
                                <span className='xl:text-paragraph-7-desktop text-paragraph-7-mobile text-grey-500'>
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
