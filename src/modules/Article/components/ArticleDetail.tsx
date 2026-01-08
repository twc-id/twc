import Breadcrumb from '@components/Breadcrumb'
import Container from '@components/Container'
import { Article } from '@hooks/useArticle'
import { formatDate } from '@utils/format-date'
import { sanitize } from 'isomorphic-dompurify'
import NProgress from 'nprogress'
import React, { useEffect } from 'react'

interface ArticleDetailProps {
    article: Article
}

const ArticleDetail: React.FC<ArticleDetailProps> = ({ article }) => {
    const featuredImage = article._embedded?.['wp:featuredmedia']?.[0]?.source_url

    const categories = article._embedded?.['wp:term']?.[0] || []

    useEffect(() => {
        // Configure NProgress
        NProgress.configure({ showSpinner: false })

        let ticking = false

        const updateReadingProgress = () => {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const scrollHeight = document.documentElement.scrollHeight
            const clientHeight = document.documentElement.clientHeight

            // Calculate reading progress (0 to 1)
            const progress = scrollTop / (scrollHeight - clientHeight)

            // Only show progress after user starts scrolling
            if (scrollTop > 0) {
                // Clamp progress between 0 and 1, keep at 1 when at bottom
                const clampedProgress = Math.min(Math.max(progress, 0), 1)
                NProgress.set(clampedProgress)
            } else {
                // Hide progress bar when at the top
                // NProgress.done()
            }

            ticking = false
        }

        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(updateReadingProgress)
                ticking = true
            }
        }

        // Add scroll listener
        window.addEventListener('scroll', handleScroll, { passive: true })

        // Cleanup
        return () => {
            window.removeEventListener('scroll', handleScroll)
            NProgress.done()
        }
    }, [])

    return (
        <>
            <div id='article-detail' className=''>
                {/* Header */}
                <header className='min-h-screen'>
                    {/* Featured Image */}

                    <div
                        className='relative h-[848px] pt-[107px] xl:h-[960px] xl:pt-[120px]'
                        style={{
                            backgroundImage: `linear-gradient(360deg, rgba(1, 1, 1, 0) 40.64%, #010101 91.3%), url('${featuredImage}')`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat'
                        }}
                    >
                        <Container className='flex !w-[60%] flex-col items-center gap-4'>
                            <h1
                                className='xl:text-heading-1-desktop text-heading-1-mobile text-grey-white relative z-10 text-center'
                                dangerouslySetInnerHTML={{ __html: sanitize(article.title.rendered) }}
                            />
                            {/* Categories */}
                            {categories.length > 0 && (
                                <div className='flex flex-row items-center gap-2 '>
                                    <div className='flex flex-wrap gap-2'>
                                        {categories.map((category) => (
                                            <span
                                                key={category.id}
                                                className='border-grey-white xl:text-paragraph-9-desktop text-paragraph-9-mobile text-grey-white rounded-full border-[0.5px] px-4 py-1.5 !leading-none'
                                                dangerouslySetInnerHTML={{
                                                    __html: sanitize(category.name)
                                                }}
                                            />
                                        ))}
                                    </div>
                                    <span className='xl:text-paragraph-7-desktop text-paragraph-7-mobile text-grey-white '>
                                        {formatDate(article.date, 'MMM, YYYY')}
                                    </span>
                                    <div className='bg-grey-white mb-1 h-[13px] w-[1px]' />

                                    <span className='xl:text-paragraph-7-desktop text-paragraph-7-mobile text-grey-white '>
                                        {article.reading_time?.minutes} min read
                                    </span>
                                </div>
                            )}
                        </Container>
                    </div>
                </header>
                <div className='py-14 xl:py-20'>
                    <Container className='flex flex-col gap-14 xl:!w-[55%] xl:!min-w-0 xl:gap-20'>
                        <Breadcrumb
                            items={[{ title: 'Articles', href: '/articles' }, { title: article.title.rendered }]}
                            navigationClassName='xl:text-button-5-desktop text-button-5-mobile'
                            lastItemClassName='!text-grey-black xl:text-button-5-desktop text-button-5-mobile'
                        />
                        {/* Content */}
                        <div
                            className=' article'
                            dangerouslySetInnerHTML={{ __html: sanitize(article.content.rendered) }}
                        />
                    </Container>
                </div>
            </div>
            <style jsx>{`
                .article {
                    img {
                        height: auto;
                        max-width: 100%;

                        &.aligncenter {
                            margin: 0 auto;
                        }

                        &.alignleft {
                            margin-right: auto;
                        }

                        &.alignright {
                            margin-left: auto;
                        }
                    }
                    .wp-block-image {
                        img {
                            position: relative;
                            transform: translateX(-50%);
                            left: 50%;

                            height: auto;
                            width: 70%;
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
        </>
    )
}

export default ArticleDetail
