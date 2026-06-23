import Button from '@components/buttons/Button'
import Container from '@components/Container'
import UnstyledLink from '@components/links/UnstyledLink'
import classNames from '@lib/classnames'
import Image from 'next/image'
import { Trans, useTranslation } from 'next-i18next'
import React from 'react'

const CTA = ({ image, showNewInInstagram }: { image?: string; showNewInInstagram: boolean }) => {
    const { t } = useTranslation('home')
    return (
        <section
            className={classNames('bg-grey-white relative z-[12] overflow-x-hidden pb-14 xl:pb-[116px]', {
                'pt-14 xl:pt-[116px]': !showNewInInstagram
            })}
        >
            <Container>
                <div className='bg-grey-black relative flex h-full w-full flex-col items-center gap-14 overflow-hidden xl:flex-row xl:justify-end'>
                    <div className='absolute left-0 z-10 flex w-auto flex-col items-start gap-5 px-5 pt-8 xl:max-w-[380px] xl:gap-6 xl:pl-20 xl:pr-0'>
                        <h2 className='xl:text-heading-2-desktop text-heading-2-mobile text-grey-white'>
                            <Trans i18nKey='cta.title' components={{ br: <br /> }}>
                                {t('cta.title')}
                            </Trans>
                        </h2>
                        <p className='xl:text-paragraph-7-desktop text-paragraph-7-mobile text-grey-100'>
                            {t('cta.description')}
                        </p>
                        <UnstyledLink href='/articles'>
                            <Button
                                variant='secondary'
                                className='!bg-grey-white xl:!text-button-3-desktop !text-button-3-mobile !rounded-none'
                            >
                                {t('common:read_article')}
                            </Button>
                        </UnstyledLink>
                    </div>

                    <div className='relative hidden h-[595px] w-full xl:block'>
                        <Image
                            src={image || ''}
                            alt='Article CTA'
                            width={0}
                            height={0}
                            sizes='100vw'
                            className='h-full w-full'
                            style={{ objectFit: 'contain', objectPosition: 'right' }}
                        />
                        <div
                            className='absolute inset-0'
                            style={{
                                background: 'linear-gradient(270deg, rgba(1, 1, 1, 0) 5%, #010101 70%)'
                            }}
                        />
                    </div>
                    <div className='relative block h-[448px] w-auto xl:hidden'>
                        <Image
                            src={image || ''}
                            alt='Article CTA'
                            width={0}
                            height={0}
                            sizes='100vw'
                            className='h-full w-auto'
                            style={{ objectFit: 'cover' }}
                        />
                        <div
                            className='absolute inset-0'
                            style={{
                                background: `linear-gradient(270deg, rgba(1, 1, 1, 0) 58.4%, #010101 100%),
linear-gradient(180deg, rgba(1, 1, 1, 0) 59.44%, #010101 99.87%),
linear-gradient(0deg, rgba(1, 1, 1, 0) 56.25%, #010101 91.3%),
linear-gradient(90deg, rgba(1, 1, 1, 0) 66.6%, #010101 99.98%)`
                            }}
                        />
                    </div>
                </div>
            </Container>
        </section>
    )
}

export default CTA
