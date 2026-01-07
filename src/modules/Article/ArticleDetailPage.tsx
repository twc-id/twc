import Container from '@components/Container'
import Seo from '@components/Seo'
import { Article as ArticleType, useRelatedArticles } from '@hooks/useArticle'
import ArticleCTA from '@modules/Article/components/ArticleCTA'
import RelatedArticles from '@modules/Article/components/RelatedArticles'
import React from 'react'
import { When } from 'react-if'

import ArticleDetail from './components/ArticleDetail'

interface ArticleDetailPageProps {
    article: ArticleType
}

const ArticleDetailPage: React.FC<ArticleDetailPageProps> = ({ article }) => {
    const { data: relatedArticles } = useRelatedArticles(
        article.id,
        article._embedded?.['wp:term']?.[0]?.map((term) => term.id) || []
    )

    return (
        <>
            <Seo title={article.title.rendered} description={article.uagb_excerpt} date={article.date} />
            <ArticleDetail article={article} />
            <When condition={relatedArticles && relatedArticles.data.length > 0}>
                <RelatedArticles article={relatedArticles} />
            </When>
            <Container className='pb-14 xl:pb-[116px]'>
                <ArticleCTA />
            </Container>
        </>
    )
}

export default ArticleDetailPage
