import Skeleton from '@components/Skeleton'
import { Article } from '@hooks/useArticle'
import { useTranslation } from 'next-i18next'
import React from 'react'

import ArticleCard from './ArticleCard'

interface ArticleListProps {
    initialArticles?: any
    page?: number
    isLoading?: boolean
    hasMore?: boolean
    isLoadingMore?: boolean
    onLoadMore?: () => void
}

const ArticleList: React.FC<ArticleListProps> = ({
    initialArticles,
    page = 1,
    isLoading: externalLoading,
    hasMore,
    isLoadingMore,
    onLoadMore
}) => {
    const { t } = useTranslation(['articles', 'common'])
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
                {isLoadingMore &&
                    Array.from({ length: 9 }).map((_, i) => <Skeleton key={`skeleton-${i}`} className='h-80 w-full' />)}
            </div>

            {/* Pagination & Load More */}
            <div className='mt-12 flex flex-col items-center justify-center gap-4'>
                <span className='text-sm text-gray-600'>
                    {page}/{initialArticles.totalPages}
                </span>
                {hasMore && onLoadMore && (
                    <button
                        onClick={onLoadMore}
                        disabled={isLoadingMore}
                        className='border border-gray-900 px-8 py-3 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-900 hover:text-white disabled:cursor-not-allowed disabled:opacity-50'
                    >
                        {isLoadingMore ? t('common:loading') : t('articles:show_more')}
                    </button>
                )}
            </div>
        </>
    )
}

export default ArticleList
