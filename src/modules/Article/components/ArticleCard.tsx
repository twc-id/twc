import UnstyledLink from '@components/links/UnstyledLink'
import { Article } from '@hooks/useArticle'
import { formatDate } from '@utils/format-date'
import Image from 'next/image'
import React from 'react'

interface ArticleCardProps {
    article: Article
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
    const featuredImage = article._embedded?.['wp:featuredmedia']?.[0]?.source_url

    const tags = article._embedded?.['wp:term']?.[1] || []
    const estimateReadingTime = article.reading_time?.minutes
    return (
        <UnstyledLink href={`/articles/${article.slug}`} className='group block'>
            <div className='overflow-hidden bg-white'>
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
                <div className='flex flex-col gap-4 pt-6'>
                    {/* Title */}
                    <h3
                        className='group-hover:text-primary-500 xl:text-button-1-desktop text-button-1-mobile line-clamp-2 font-semibold text-gray-900'
                        dangerouslySetInnerHTML={{ __html: article.title.rendered }}
                    />

                    {/* Meta */}
                    <div className='flex items-center gap-2 '>
                        {/* Tags */}
                        {tags.length > 0 &&
                            tags.slice(0, 1).map((tag: any) => (
                                <span
                                    key={tag.id}
                                    className='border-grey-500 xl:text-paragraph-9-desktop text-paragraph-9-mobile rounded-full border-[0.5px] px-3 py-1 !leading-none text-gray-500'
                                >
                                    {tag.name}
                                </span>
                            ))}

                        <span className='xl:text-paragraph-7-desktop text-paragraph-7-mobile !leading-none text-gray-500'>
                            {formatDate(article.date, 'MMM, YYYY')} | {estimateReadingTime} min read
                        </span>
                    </div>
                </div>
            </div>
        </UnstyledLink>
    )
}

export default ArticleCard
