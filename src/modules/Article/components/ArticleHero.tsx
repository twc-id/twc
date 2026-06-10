import UnstyledLink from '@components/links/UnstyledLink'
import Skeleton from '@components/Skeleton'
import classNames from '@lib/classnames'
import { formatDate } from '@utils/format-date'
import { sanitizeHtml } from '@utils/html'
import Image from 'next/image'
import React from 'react'

interface ArticleHeroProps {
    initialArticles?: any
    page?: number
    isLoading?: boolean
}

const ArticleHero: React.FC<ArticleHeroProps> = ({ initialArticles, isLoading: externalLoading }) => {
    if (externalLoading) {
        return (
            <div className='flex flex-row gap-8'>
                <Skeleton className='h-[554px] w-full' />
                <Skeleton className='h-[337px] w-full' />
            </div>
        )
    }

    return (
        <div className='flex flex-row gap-8'>
            {initialArticles?.map((article: any, index: number) => {
                const featuredImage = article._embedded?.['wp:featuredmedia']?.[0]?.source_url
                const category = article._embedded?.['wp:term']?.[0] || []
                const isFirstArticle = index === 0

                const estimateReadingTime = article.reading_time?.minutes
                return (
                    <UnstyledLink
                        key={article.id}
                        href={`/articles/${article.slug}`}
                        className='group mb-10 flex h-fit cursor-pointer flex-col gap-4'
                    >
                        <div
                            className={classNames('relative mb-2 w-full overflow-hidden', {
                                'min-h-[554px] min-w-[776px] flex-shrink-0': isFirstArticle,
                                'min-h-[337px] min-w-[472px] flex-shrink-0': !isFirstArticle
                            })}
                        >
                            <Image
                                src={
                                    featuredImage ||
                                    `https://placehold.co/${isFirstArticle ? 776 : 472}x${
                                        isFirstArticle ? 554 : 337
                                    }/png?text=TWC`
                                }
                                alt={article.title.rendered}
                                // width={isFirstArticle ? 776 : 471}
                                // height={isFirstArticle ? 554 : 337}
                                fill
                                className='object-cover transition-transform duration-300 group-hover:scale-105'
                            />
                        </div>
                        <h3 className='xl:text-button-1-desktop text-button-1-mobile'>{article.title.rendered}</h3>
                        <div className='flex items-center gap-2 '>
                            {/* Tags */}
                            {category.length > 0 && (
                                <div className='flex flex-wrap gap-2'>
                                    {category.slice(0, 1).map((categories: any) => (
                                        <span
                                            key={categories.id}
                                            className='border-grey-500 xl:text-paragraph-10-desktop text-paragraph-10-mobile rounded-full border-[0.5px] px-3 pb-[3px] pt-[5px] !leading-none text-gray-500'
                                            dangerouslySetInnerHTML={{ __html: sanitizeHtml(categories.name) }}
                                        />
                                    ))}
                                </div>
                            )}

                            <span className='xl:text-paragraph-8-desktop text-paragraph-8-mobile !leading-none text-gray-500'>
                                {formatDate(article.date, 'MMM, YYYY')} | {estimateReadingTime} min read
                            </span>
                        </div>
                    </UnstyledLink>
                )
            })}
        </div>
    )
}

export default ArticleHero
