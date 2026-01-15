import Button from '@components/buttons/Button'
import Input from '@components/forms/Input'
import Image from 'next/image'
import { useTranslation } from 'next-i18next'
import React from 'react'

const ArticleCTA = () => {
    const { t } = useTranslation('articles')
    return (
        <div className='pt-4 xl:pt-[76px]'>
            <div className='bg-grey-black relative flex h-full w-full flex-col items-center gap-12 overflow-hidden xl:flex-row'>
                <div className='flex min-w-[380px] flex-col items-start gap-5 px-5 pt-8 xl:gap-6 xl:pl-20 xl:pr-0'>
                    <h2 className='text-heading-2-desktop text-grey-white'>{t('cta.title')}</h2>
                    <p className='text-paragraph-6-desktop text-grey-100'>{t('cta.description')}</p>

                    <div className='flex w-full flex-row items-center gap-2'>
                        <Input
                            name='email'
                            size='md'
                            placeholder={t('cta.placeholder')}
                            className='!border-grey-200 !rounded-none bg-transparent'
                            inputClassName='text-left xl:text-button-3-desktop text-button-3-mobile placeholder:text-gray-200 text-grey-200 !px-0'
                        />

                        <Button variant='secondary' className='!bg-grey-white !text-button-3-desktop !rounded-none'>
                            {t('cta.button')}
                        </Button>
                    </div>
                </div>

                <div
                    style={{
                        background: 'linear-gradient(270deg, rgba(1, 1, 1, 0) 52.44%, #010101 100%)'
                    }}
                    className='hidden h-[595px] xl:block'
                >
                    <Image
                        src='/images/article/cta.webp'
                        alt='Article CTA'
                        width={0}
                        height={0}
                        sizes='100vw'
                        className='h-auto w-auto'
                    />
                </div>
                <div
                    style={{
                        background: `linear-gradient(270deg, rgba(1, 1, 1, 0) 58.4%, #010101 100%), 
linear-gradient(180deg, rgba(1, 1, 1, 0) 59.44%, #010101 99.87%), 
linear-gradient(0deg, rgba(1, 1, 1, 0) 56.25%, #010101 91.3%), 
linear-gradient(90deg, rgba(1, 1, 1, 0) 66.6%, #010101 99.98%)`
                    }}
                    className='block h-[248px] xl:hidden'
                >
                    <Image
                        src='/images/article/cta-mobile.webp'
                        alt='Article CTA'
                        width={0}
                        height={0}
                        sizes='100vw'
                        className='h-full w-auto'
                    />
                </div>
            </div>
        </div>
    )
}

export default ArticleCTA
