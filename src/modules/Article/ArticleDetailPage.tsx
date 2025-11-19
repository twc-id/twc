import Seo from '@components/Seo'
import { Article as ArticleType } from '@hooks/useArticle'
import React from 'react'

import ArticleDetail from './components/ArticleDetail'

interface ArticleDetailPageProps {
    article: ArticleType
}

const ArticleDetailPage: React.FC<ArticleDetailPageProps> = ({ article }) => {
    return (
        <div className='min-h-screen bg-white'>
            <Seo title={article.title.rendered} description={article.uagb_excerpt} />
            <ArticleDetail article={article} />
        </div>
    )
}

export default ArticleDetailPage
