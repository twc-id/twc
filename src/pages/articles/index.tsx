import { defaultLanguage } from '@constant/i18n'
import { articleKeys } from '@hooks/useArticle'
import Article from '@modules/Article'
import blogFetchApi from '@pages/api/blogApi'
import { dehydrate, QueryClient } from '@tanstack/react-query'
import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

export const getStaticProps: GetStaticProps = async ({ locale }) => {
    const queryClient = new QueryClient()
    const page = 1
    const per_page = 11
    let initialArticles = {
        data: [],
        totalPages: 0,
        totalPosts: 0
    }
    let articleTags = { data: [] }

    try {
        // Prefetch articles (custom endpoint with Polylang support)
        const articlesData = await blogFetchApi({
            url: '/posts',
            method: 'GET',
            params: {
                page,
                per_page,
                _embed: true,
                lang: locale || defaultLanguage
            }
        })

        const articleTag = await blogFetchApi({
            url: '/tags',
            method: 'GET',
            params: {
                per_page: 100,
                lang: locale || defaultLanguage
            }
        })

        // Set the data in the query cache
        queryClient.setQueryData(articleKeys.list({ page, per_page, _embed: true }), articlesData)

        initialArticles = articlesData
        articleTags = articleTag
    } catch (error) {
        return {
            props: {
                ...(await serverSideTranslations(locale || defaultLanguage, ['common', 'articles'])),
                initialArticles: { data: [], totalPages: 0, totalPosts: 0 },
                page
            },
            revalidate: 60
        }
    }

    return {
        props: {
            ...(await serverSideTranslations(locale || defaultLanguage, ['common', 'articles'])),
            dehydratedState: dehydrate(queryClient),
            initialArticles,
            articleTags: articleTags.data,
            page
        },
        revalidate: 60 // Revalidate every 60 seconds
    }
}

export default Article
