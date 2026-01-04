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
    const per_page = 12

    try {
        // Prefetch articles
        const articlesData = await blogFetchApi({
            url: '/posts',
            method: 'GET',
            params: {
                page,
                per_page,
                _embed: true
            }
        })
        const articleTags = await blogFetchApi({
            url: '/tags',
            method: 'GET',
            params: {
                per_page: 100
            }
        })

        // Set the data in the query cache
        queryClient.setQueryData(articleKeys.list({ page, per_page, _embed: true }), articlesData)

        return {
            props: {
                ...(await serverSideTranslations(locale || defaultLanguage, ['common'])),
                dehydratedState: dehydrate(queryClient),
                initialArticles: articlesData,
                articleTags: articleTags.data,
                page
            },
            revalidate: 60 // Revalidate every 60 seconds
        }
    } catch (error) {
        return {
            props: {
                ...(await serverSideTranslations(locale || defaultLanguage, ['common'])),
                initialArticles: { data: [], totalPages: 0, totalPosts: 0 },
                page
            },
            revalidate: 60
        }
    }
}

export default Article
