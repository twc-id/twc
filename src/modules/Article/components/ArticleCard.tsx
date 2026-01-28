import UnstyledLink from '@components/links/UnstyledLink'
import { Article } from '@hooks/useArticle'
import classNames from '@lib/classnames'
import { formatDate } from '@utils/format-date'
import { sanitizeHtml } from '@utils/html'
import Image from 'next/image'
import React from 'react'

interface ArticleCardProps {
    article: Article
    titleClassName?: string
    metaClassName?: string
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article, titleClassName, metaClassName }) => {
    const featuredImage = article._embedded?.['wp:featuredmedia']?.[0]?.source_url

    const category = article._embedded?.['wp:term']?.[0] || []
    const estimateReadingTime = article.reading_time?.minutes
    return (
        <UnstyledLink href={`/articles/${article.slug}`} className='group block'>
            <div className='overflow-hidden '>
                {/* Featured Image */}
                {featuredImage && (
                    <div className='relative min-h-[270px] w-full overflow-hidden xl:max-w-[405px]'>
                        <Image
                            src={featuredImage}
                            alt={article.title.rendered}
                            fill
                            className=' transition-transform duration-300 group-hover:scale-105'
                        />
                    </div>
                )}

                {/* Content */}
                <div className='flex flex-col gap-3 pt-5 xl:pt-6'>
                    {/* Title */}
                    <h3
                        className={classNames(
                            'group-hover:text-primary-500 xl:text-button-1-desktop text-button-1-mobile line-clamp-2 font-semibold text-gray-900',
                            titleClassName
                        )}
                        dangerouslySetInnerHTML={{ __html: sanitizeHtml(article.title.rendered) }}
                    />

                    {/* Meta */}
                    <div className={classNames('flex items-center gap-2', metaClassName)}>
                        {/* Tags */}
                        {category.length > 0 &&
                            category
                                .slice(0, 1)
                                .map((categories: any) => (
                                    <span
                                        key={categories.id}
                                        className='border-grey-500 xl:text-paragraph-9-desktop text-paragraph-9-mobile rounded-full border-[0.5px] px-3 py-1 !leading-none text-gray-500'
                                        dangerouslySetInnerHTML={{ __html: sanitizeHtml(categories.name) }}
                                    />
                                ))}

                        <div className='flex flex-row gap-2'>
                            <span className='xl:text-paragraph-7-desktop text-paragraph-7-mobile  text-gray-500'>
                                {formatDate(article.date, 'MMM, YYYY')}
                            </span>

                            <div className='bg-grey-500 mb-1 h-[13px] w-[1px]' />
                            <span className='xl:text-paragraph-7-desktop text-paragraph-7-mobile  text-gray-500'>
                                {estimateReadingTime} min read
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </UnstyledLink>
    )
}

export default ArticleCard
