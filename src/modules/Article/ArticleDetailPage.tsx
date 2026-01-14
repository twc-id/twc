import Container from '@components/Container'
import Seo from '@components/Seo'
import { Article as ArticleType, useRelatedArticles } from '@hooks/useArticle'
import { WooCommerce } from '@lib/api'
import ArticleCTA from '@modules/Article/components/ArticleCTA'
import RelatedArticles from '@modules/Article/components/RelatedArticles'
import React, { useEffect, useState } from 'react'
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
    const [products, setProducts] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const fetchDefaultSuggestions = async () => {
        try {
            setIsLoading(true)
            const response = await WooCommerce.get(`products?tag=33&category=15&per_page=3`)
            setProducts(response.data || [])
        } catch (err) {
            console.error('Error fetching default suggestions', err)
            setProducts([])
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchDefaultSuggestions()
    }, [])
    console.log(products)

    return (
        <>
            <Seo title={article.title.rendered} description={article.uagb_excerpt} date={article.date} />
            <ArticleDetail article={article} products={products} isLoading={isLoading} />
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
