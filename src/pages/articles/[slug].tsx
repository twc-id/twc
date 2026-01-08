import { defaultLanguage } from '@constant/i18n'
import { Article as ArticleType, articleKeys } from '@hooks/useArticle'
import ArticleDetail from '@modules/Article/ArticleDetailPage'
import blogFetchApi from '@pages/api/blogApi'
import { dehydrate, QueryClient } from '@tanstack/react-query'
import { GetStaticPaths, GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

export const getStaticPaths: GetStaticPaths = async () => {
    try {
        // Fetch first 50 articles to generate paths
        const response = await blogFetchApi<ArticleType[]>({
            url: '/posts',
            method: 'GET',
            params: {
                per_page: 50,
                _fields: 'slug'
            }
        })

        const paths = response.data.map((article) => ({
            params: { slug: article.slug }
        }))

        return {
            paths,
            fallback: 'blocking' // Generate pages on-demand if not pre-rendered
        }
    } catch (error) {
        return {
            paths: [],
            fallback: 'blocking'
        }
    }
}

export const getStaticProps: GetStaticProps = async ({ params, locale }) => {
    const queryClient = new QueryClient()
    const slug = params?.slug as string

    let article: ArticleType | null = null

    if (!slug) {
        return {
            notFound: true
        }
    }

    try {
        // Fetch article by slug
        const response = await blogFetchApi<ArticleType[]>({
            url: '/posts',
            method: 'GET',
            params: {
                slug,
                _embed: true
            }
        })

        article = response.data[0]

        if (!article) {
            return {
                notFound: true
            }
        }

        // Set the data in the query cache
        queryClient.setQueryData(articleKeys.detail(article.id), article)
    } catch (error) {
        return {
            notFound: true
        }
    }

    return {
        props: {
            ...(await serverSideTranslations(locale || defaultLanguage, ['common'])),
            dehydratedState: dehydrate(queryClient),
            article
        },
        revalidate: 60 // Revalidate every 60 seconds
    }
}

export default ArticleDetail
