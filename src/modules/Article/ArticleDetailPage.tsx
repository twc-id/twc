import Seo from '@components/Seo'
import { Article as ArticleType } from '@hooks/useArticle'
import React from 'react'

import ArticleDetail from './components/ArticleDetail'

interface ArticleDetailPageProps {
    article: ArticleType
}

const ArticleDetailPage: React.FC<ArticleDetailPageProps> = ({ article }) => {
    return (
        <>
            <Seo title={article.title.rendered} description={article.uagb_excerpt} date={article.date} />
            <ArticleDetail article={article} />
        </>
    )
}

export default ArticleDetailPage
