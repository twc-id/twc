import Button from '@components/buttons/Button'
import UnstyledLink from '@components/links/UnstyledLink'
import { useTheme } from '@contexts/ThemeContext'
import { useInView } from 'motion/react'
import { Trans, useTranslation } from 'next-i18next'
import React, { useEffect, useRef } from 'react'

const SellReserve = ({ sell, reserve }: { sell?: string; reserve?: string }) => {
    const { t } = useTranslation(['home'])
    const { setIsDarkSection } = useTheme()

    const sectionRef = useRef<HTMLElement>(null)
    const isInView = useInView(sectionRef, { margin: '-40% 0px -40% 0px' })

    useEffect(() => {
        if (isInView) setIsDarkSection(false)
    }, [isInView, setIsDarkSection])

    return (
        <section
            ref={sectionRef}
            className='dark:bg-grey-black bg-grey-white relative z-10 flex flex-col gap-2 overflow-hidden px-4 pb-0 pt-16 xl:flex-row xl:px-5 xl:pt-[160px]'
        >
            <div
                style={{
                    backgroundImage: `linear-gradient(174.63deg, rgba(1, 1, 1, 0) 51.23%, #010101 96.85%), url(${sell})`,
                    backgroundSize: '100% auto',
                    backgroundPositionY: 'center'
                }}
                className='relative z-10 flex h-[368px] w-full flex-col items-start justify-end gap-4 p-5 xl:h-[888px] xl:p-20'
            >
                <h1 className='xl:text-heading-2-desktop text-heading-2-mobile text-grey-white'>
                    <Trans i18nKey='home:sell_reserve.sell_title'>{t('sell_reserve.sell_title')}</Trans>
                </h1>
                <UnstyledLink href='/sell'>
                    <Button>{t('common:learn_more')}</Button>
                </UnstyledLink>
            </div>
            <div
                style={{
                    backgroundImage: `linear-gradient(174.63deg, rgba(1, 1, 1, 0) 51.23%, #010101 96.85%), url(${reserve})`,
                    backgroundSize: '100% auto',
                    backgroundPositionY: 'center'
                }}
                className='relative z-10 flex h-[368px] w-full flex-col items-start justify-end gap-4 p-5 xl:h-[888px] xl:p-20'
            >
                <h1 className='xl:text-heading-2-desktop text-heading-2-mobile text-grey-white'>
                    {t('sell_reserve.reserve_title')}
                </h1>
                <UnstyledLink href='/reserve'>
                    <Button>{t('sell_reserve.cta_reserve')}</Button>
                </UnstyledLink>
            </div>
        </section>
    )
}

export default SellReserve
