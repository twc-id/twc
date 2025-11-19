import Skeleton from '@components/Skeleton'
import { Article } from '@hooks/useArticle'
import React from 'react'

import ArticleCard from './ArticleCard'

interface ArticleListProps {
    initialArticles?: any
    page?: number
    isLoading?: boolean
}

const ArticleList: React.FC<ArticleListProps> = ({ initialArticles, page = 1, isLoading: externalLoading }) => {
    const isLoading = externalLoading

    if (isLoading) {
        return (
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
                {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className='h-80 w-full' />
                ))}
            </div>
        )
    }

    if (!initialArticles?.data || initialArticles.data.length === 0) {
        return (
            <div className='py-12 text-center'>
                <p className='text-gray-600'>No articles found.</p>
            </div>
        )
    }

    return (
        <>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
                {initialArticles.data.map((article: Article) => (
                    <ArticleCard key={article.id} article={article} />
                ))}
            </div>

            {/* Pagination */}
            <div className='mt-12 flex items-center justify-center gap-4'>
                <span className='text-sm text-gray-600'>
                    {page}/{initialArticles.totalPages}
                </span>
            </div>
        </>
    )
}

export default ArticleList
