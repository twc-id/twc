import NextImage from '@components/NextImage'
import { Article } from '@hooks/useArticle'
import React from 'react'

interface ArticleDetailProps {
    article: Article
}

const ArticleDetail: React.FC<ArticleDetailProps> = ({ article }) => {
    const featuredImage = article._embedded?.['wp:featuredmedia']?.[0]?.source_url
    const author = article._embedded?.author?.[0]
    const categories = article._embedded?.['wp:term']?.[0] || []

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    return (
        <article className='py-8'>
            {/* Header */}
            <header className='mb-8'>
                {/* Categories */}
                {categories.length > 0 && (
                    <div className='mb-4 flex flex-wrap gap-2'>
                        {categories.map((category) => (
                            <span
                                key={category.id}
                                className='rounded-full bg-gray-100 px-4 py-1 text-sm font-medium text-gray-600'
                            >
                                {category.name}
                            </span>
                        ))}
                    </div>
                )}

                {/* Title */}
                <h1
                    className='mb-4 text-4xl font-bold text-gray-900 md:text-5xl'
                    dangerouslySetInnerHTML={{ __html: article.title.rendered }}
                />

                {/* Meta */}
                <div className='flex items-center gap-4 text-sm text-gray-600'>
                    <span>By {author?.name || 'Anonymous'}</span>
                    <span>•</span>
                    <time dateTime={article.date}>{formatDate(article.date)}</time>
                </div>
            </header>

            {/* Featured Image */}
            {featuredImage && (
                <div className='mb-8 overflow-hidden rounded-lg'>
                    <NextImage
                        src={featuredImage}
                        alt={article.title.rendered}
                        width={1200}
                        height={600}
                        className='h-auto w-full object-cover'
                    />
                </div>
            )}

            {/* Content */}
            <div
                className='prose prose-lg prose-headings:font-bold prose-a:text-blue-600 prose-img:rounded-lg max-w-none'
                dangerouslySetInnerHTML={{ __html: article.content.rendered }}
            />

            {/* Author Info */}
            {author && author.description && (
                <div className='mt-12 rounded-lg border border-gray-200 bg-gray-50 p-6'>
                    <div className='flex items-start gap-4'>
                        {author.avatar_urls?.['96'] && (
                            <NextImage
                                src={author.avatar_urls['96']}
                                alt={author.name}
                                width={64}
                                height={64}
                                className='rounded-full'
                            />
                        )}
                        <div>
                            <h3 className='mb-2 text-lg font-semibold text-gray-900'>{author.name}</h3>
                            <p className='text-gray-600'>{author.description}</p>
                        </div>
                    </div>
                </div>
            )}
        </article>
    )
}

export default ArticleDetail
