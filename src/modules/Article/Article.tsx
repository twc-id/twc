import BackToTop from '@components/BackToTop'
import Container from '@components/Container'
import Seo from '@components/Seo'
import Tabs, { Tab } from '@components/Tabs'
import { type Article, ArticleTag, useArticles } from '@hooks/useArticle'
import { useAssets } from '@hooks/useAsset'
import ArticleCTA from '@modules/Article/components/ArticleCTA'
import ArticleHero from '@modules/Article/components/ArticleHero'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import React, { useEffect, useState } from 'react'
import { useMediaQuery } from 'react-responsive'

import ArticleList from './components/ArticleList'

interface ArticleProps {
    initialArticles?: any
    articleTags?: ArticleTag[]
    page?: number
}

const Article: React.FC<ArticleProps> = ({ initialArticles, articleTags, page = 1 }) => {
    const { t, i18n } = useTranslation('articles')
    const router = useRouter()
    const isMobile = useMediaQuery({ maxWidth: 1279 })
    const isReady = router.isReady

    const [selectedTagId, setSelectedTagId] = useState<number | null>(null)

    // Pagination state for "Show More"
    const [pagesRequested, setPagesRequested] = useState(1)
    const [extraArticles, setExtraArticles] = useState<Article[]>([])

    // Reset pagination when tag changes
    useEffect(() => {
        setPagesRequested(1)
        setExtraArticles([])
    }, [selectedTagId])

    // Restore selected tag from URL query param after hydration
    useEffect(() => {
        if (!isReady || !articleTags) return
        const queryTag = router.query.tag as string | undefined
        if (!queryTag) return

        // Direct match by slug
        const directMatch = articleTags.find((tag) => tag.slug === queryTag)
        if (directMatch) {
            setSelectedTagId(directMatch.id)
            return
        }
        // Match by slug without -en suffix (Polylang pattern)
        const baseSlug = queryTag.replace(/-en$/, '')
        const slugMatch = articleTags.find((tag) => tag.slug === baseSlug || tag.slug === `${baseSlug}-en`)
        if (slugMatch) {
            setSelectedTagId(slugMatch.id)
        }
    }, [isReady, articleTags]) // eslint-disable-line react-hooks/exhaustive-deps

    // Sync URL query param when selected tag changes
    const currentTagSlug = articleTags?.find((tag) => tag.id === selectedTagId)?.slug
    useEffect(() => {
        if (selectedTagId === null) {
            if (router.query.tag) {
                router.replace({ pathname: router.pathname, query: {} }, undefined, { scroll: false })
            }
        } else if (router.query.tag !== currentTagSlug) {
            router.replace({ pathname: router.pathname, query: { ...router.query, tag: currentTagSlug } }, undefined, {
                scroll: false
            })
        }
    }, [selectedTagId, currentTagSlug, router.query.tag]) // eslint-disable-line react-hooks/exhaustive-deps

    const { assets } = useAssets()
    const ctaImage = assets?.find((asset) => asset.name === 'article-1')?.media.url

    const perPage = 11

    // Fetch articles based on selected tag
    const { data: filteredArticles, isLoading } = useArticles(
        {
            tags: selectedTagId || undefined,
            page,
            per_page: perPage,
            _embed: true,
            lang: i18n.language
        },
        {
            enabled: selectedTagId !== null
        }
    )

    const displayArticles = selectedTagId === null ? initialArticles : filteredArticles

    // Fetch additional pages for "Show More"
    const totalPages = displayArticles?.totalPages || 0
    const nextPageToFetch = (page || 1) + pagesRequested - 1

    const { data: nextPageData, isFetching: isLoadingMore } = useArticles(
        {
            tags: selectedTagId || undefined,
            page: nextPageToFetch,
            per_page: perPage,
            _embed: true,
            lang: i18n.language
        },
        {
            enabled: pagesRequested > 1 && nextPageToFetch <= totalPages
        }
    )

    // Accumulate articles from additional pages (deduplicated by ID)
    useEffect(() => {
        if (pagesRequested > 1 && nextPageData?.data) {
            setExtraArticles((prev) => {
                const existingIds = new Set(prev.map((a) => a.id))
                const newArticles = nextPageData.data.filter((a: Article) => !existingIds.has(a.id))
                if (newArticles.length === 0) return prev
                return [...prev, ...newArticles]
            })
        }
    }, [nextPageData, pagesRequested]) // eslint-disable-line react-hooks/exhaustive-deps

    // Hero articles: hanya untuk tab "All" dan desktop
    const heroArticles = selectedTagId === null && !isMobile ? displayArticles?.data?.slice(0, 2) : []

    // Remaining articles:
    // - Jika tab "All" dan desktop: sisanya setelah 2 artikel pertama
    // - Jika tab lain atau mobile: semua artikel (tidak di-slice)
    const remainingArticles = {
        data: [
            ...(selectedTagId === null && !isMobile
                ? displayArticles?.data?.slice(2) || []
                : displayArticles?.data || []),
            ...extraArticles
        ],
        totalPages,
        totalPosts:
            selectedTagId === null && !isMobile
                ? Math.max((displayArticles?.totalPosts || 0) - 2, 0)
                : displayArticles?.totalPosts || 0
    }

    return (
        <>
            <Seo
                title={
                    selectedTagId === null
                        ? t('title')
                        : // : `Category ${articleTags?.find((tag) => tag.id === selectedTagId)?.name} Latest Articles`
                          t('subtitle', {
                              article: articleTags?.find((tag) => tag.id === selectedTagId)?.name || ''
                          })
                }
            />
            <Container className='relative pt-[72px] xl:pt-20'>
                <div className='flex min-h-screen flex-col gap-8 pb-12 pt-8 xl:gap-10 xl:pb-[116px]'>
                    <h1
                        className='xl:text-heading-1-2-desktop text-heading-1-2-mobile text-[100px] leading-[90%]
                    '
                    >
                        {t('the_watch_journal')}
                    </h1>
                    <Tabs className='gap-10'>
                        <Tab
                            key='all'
                            isActive={selectedTagId === null}
                            onClick={() => setSelectedTagId(null)}
                            className='w-fit !pb-6'
                        >
                            {t('tab.all')}
                        </Tab>
                        {articleTags?.map((tag) => (
                            <Tab
                                key={tag.id}
                                isActive={selectedTagId === tag.id}
                                onClick={() => setSelectedTagId(tag.id)}
                                className='w-fit'
                            >
                                {tag.name}
                            </Tab>
                        ))}
                    </Tabs>
                    {selectedTagId === null && !isMobile && (
                        <ArticleHero initialArticles={heroArticles} page={page} isLoading={isLoading} />
                    )}
                    {(remainingArticles.data.length > 0 || selectedTagId !== null) && (
                        <ArticleList
                            initialArticles={remainingArticles}
                            page={pagesRequested}
                            isLoading={isLoading}
                            hasMore={pagesRequested < totalPages}
                            isLoadingMore={isLoadingMore}
                            onLoadMore={() => setPagesRequested((prev) => prev + 1)}
                        />
                    )}
                    <ArticleCTA image={ctaImage} />
                </div>
            </Container>
            <BackToTop />
        </>
    )
}

export default Article
