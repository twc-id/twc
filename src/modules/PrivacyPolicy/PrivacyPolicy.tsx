import Container from '@components/Container'
import Seo from '@components/Seo'
import Skeleton from '@components/Skeleton'
import usePages, { Page } from '@hooks/usePages'
import { Locale } from '@utils/currency'
import { formatDate } from '@utils/format-date'
import { sanitizeHtml } from '@utils/html'
import { Trans, useTranslation } from 'next-i18next'
import React from 'react'

interface PrivacyPolicyProps {
    locale?: Locale
}

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ locale }) => {
    const { t } = useTranslation('privacy-terms')
    const { data, isLoading } = usePages(locale === 'id' ? 'kebijakan-privasi' : 'privacy-policy', { _embed: true })

    const pages = data as Page
    const title = pages?.title?.rendered

    if (isLoading) {
        return (
            <div className='min-h-screen'>
                <Container className='flex flex-col gap-20 py-[200px] xl:py-40'>
                    <div className='flex flex-col gap-4'>
                        <Skeleton className='h-10 w-1/2' />
                        <Skeleton className='h-6 w-1/4  ' />
                    </div>
                    <div className='space-y-4'>
                        {Array.from({ length: 10 }).map((_, index) => (
                            <Skeleton key={index} className='h-4 w-full' />
                        ))}
                    </div>
                </Container>
            </div>
        )
    }
    return (
        <>
            <Seo title={title || 'Privacy Policy'} />
            <Container className='flex flex-col gap-20 py-[200px] xl:py-40'>
                <div className='flex flex-col gap-4'>
                    <h1 className='xl:text-heading-1-desktop text-heading-1-mobile text-grey-black'>{title}</h1>
                    <span className='xl:text-paragraph-7-desktop text-paragraph-7-mobile'>
                        <Trans i18nKey='privacy.updated' components={{ strong: <strong /> }}>
                            {t('privacy.updated', { time: formatDate(pages?.modified_gmt, 'D MMMM YYYY') })}
                        </Trans>
                    </span>
                </div>
                <div
                    className='privacy-policy'
                    dangerouslySetInnerHTML={{
                        __html: sanitizeHtml(pages?.content?.rendered || '')
                    }}
                />
                <style jsx>{`
                    .privacy-policy {
                        a {
                            color: #000000;
                            text-decoration: none;
                            &:hover {
                                text-decoration: underline;
                            }
                        }

                        h1,
                        h2 {
                            font-size: 32px;
                            line-height: 140%;

                            @media (max-width: 1279px) {
                                font-size: 28px;
                            }
                        }
                        h3 {
                            font-size: 24px;
                            line-height: 140%;
                            @media (max-width: 1279px) {
                                font-size: 20px;
                            }
                        }
                        h4 {
                            font-size: 20px;
                            line-height: 140%;
                            @media (max-width: 1279px) {
                                font-size: 18px;
                            }
                        }
                        h5 {
                            font-size: 16px;
                            line-height: 140%;
                            @media (max-width: 1279px) {
                                font-size: 15px;
                            }
                        }
                        h6 {
                            font-size: 14px;
                            line-height: 140%;
                            @media (max-width: 1279px) {
                                font-size: 13px;
                            }
                        }

                        h1,
                        h2,
                        h3,
                        h4,
                        h5,
                        h6 {
                            font-weight: 400;
                            font-family: 'Inter', sans-serif;
                        }
                        p {
                            font-weight: 400;
                            font-size: 16px;
                            line-height: 130%;
                            font-family: 'Overpass', sans-serif;
                            @media (max-width: 1279px) {
                                font-size: 14px;
                            }
                        }

                        figure {
                            width: auto !important;
                        }
                        blockquote,
                        dl,
                        dd,
                        h1,
                        h2,
                        h3,
                        h4,
                        h5,
                        h6,
                        hr,
                        figure,
                        p,
                        pre {
                            margin-block-end: 16px !important;
                        }

                        p {
                            margin-top: 0px;
                            color: #595959;
                        }

                        ol {
                            list-style: decimal;
                            margin-block-start: 1em;
                            margin-block-end: 1em;
                            padding-inline-start: 40px;
                        }

                        ul {
                            list-style: disc;
                            margin-block-start: 1em;
                            margin-block-end: 1em;
                            padding-inline-start: 40px;
                        }
                    }
                `}</style>
            </Container>
        </>
    )
}

export default PrivacyPolicy
