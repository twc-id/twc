import UnstyledLink from '@components/links/UnstyledLink'
import Skeleton from '@components/Skeleton'
import classNames from '@lib/classnames'
import { formatDate } from '@utils/format-date'
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
                const tags = article._embedded?.['wp:term']?.[1] || []
                const isFirstArticle = index === 0
                return (
                    <UnstyledLink
                        key={article.id}
                        href={`/article/${article.slug}`}
                        className='group mb-10 flex cursor-pointer flex-col gap-6'
                    >
                        <div
                            className={classNames('aspect-2/1 relative w-full overflow-hidden', {
                                'min-h-[554px] flex-shrink-0': isFirstArticle,
                                'min-h-[337px] flex-shrink-0': !isFirstArticle
                            })}
                        >
                            <Image
                                src={featuredImage}
                                alt={article.title.rendered}
                                // width={isFirstArticle ? 776 : 471}
                                // height={isFirstArticle ? 554 : 337}
                                fill
                                className='transition-transform duration-300 group-hover:scale-105'
                            />
                        </div>
                        <h2 className='xl:text-paragraph-1-desktop text-button-1-desktop font-bold'>
                            {article.title.rendered}
                        </h2>
                        <div className='flex items-center gap-2 '>
                            {/* Tags */}
                            {tags.length > 0 && (
                                <div className='flex flex-wrap gap-2'>
                                    {tags.slice(0, 1).map((tag: any) => (
                                        <span
                                            key={tag.id}
                                            className='border-grey-500 text-paragraph-9-desktop rounded-full border-[0.5px] px-3 py-1 font-medium text-gray-500'
                                        >
                                            {tag.name}
                                        </span>
                                    ))}
                                </div>
                            )}

                            <span className='text-paragraph-7-desktop text-gray-500'>
                                {formatDate(article.date, 'MMM, YYYY')}
                            </span>
                        </div>
                    </UnstyledLink>
                )
            })}
        </div>
    )
}

export default ArticleHero
