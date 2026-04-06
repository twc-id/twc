import BackToTop from '@components/BackToTop'
import Container from '@components/Container'
import Seo from '@components/Seo'
import Tabs, { Tab } from '@components/Tabs'
import { ArticleTag, useArticles } from '@hooks/useArticle'
import { useAssets } from '@hooks/useAsset'
import ArticleCTA from '@modules/Article/components/ArticleCTA'
import ArticleHero from '@modules/Article/components/ArticleHero'
import { useTranslation } from 'next-i18next'
import React, { useState } from 'react'
import { useMediaQuery } from 'react-responsive'

import ArticleList from './components/ArticleList'

interface ArticleProps {
    initialArticles?: any
    articleTags?: ArticleTag[]
    page?: number
}

const Article: React.FC<ArticleProps> = ({ initialArticles, articleTags, page = 1 }) => {
    const { t, i18n } = useTranslation('articles')
    const [selectedTagId, setSelectedTagId] = useState<number | null>(null)
    const isMobile = useMediaQuery({ maxWidth: 1279 })

    const { assets } = useAssets()
    const ctaImage = assets?.find((asset) => asset.name === 'article-1')?.media.url

    // Fetch articles based on selected tag
    const { data: filteredArticles, isLoading } = useArticles(
        {
            tags: selectedTagId || undefined,
            page,
            per_page: 12,
            _embed: true,
            lang: i18n.language
        },
        {
            enabled: selectedTagId !== null
        }
    )

    const displayArticles = selectedTagId === null ? initialArticles : filteredArticles

    // Hero articles: hanya untuk tab "All" dan desktop
    const heroArticles = selectedTagId === null && !isMobile ? displayArticles?.data?.slice(0, 2) : []

    // Remaining articles:
    // - Jika tab "All" dan desktop: sisanya setelah 2 artikel pertama
    // - Jika tab lain atau mobile: semua artikel (tidak di-slice)
    const remainingArticles = {
        data: selectedTagId === null && !isMobile ? displayArticles?.data?.slice(2) || [] : displayArticles?.data || [],
        totalPages: displayArticles?.totalPages || 0,
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
            <Container className='pt-[72px] xl:pt-20'>
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
                    {remainingArticles.data.length > 0 && (
                        <ArticleList initialArticles={remainingArticles} page={page} isLoading={isLoading} />
                    )}
                    <ArticleCTA image={ctaImage} />
                </div>
                <BackToTop />
            </Container>
        </>
    )
}

export default Article
