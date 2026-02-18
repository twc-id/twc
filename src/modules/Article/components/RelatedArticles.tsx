import Button from '@components/buttons/Button'
import Container from '@components/Container'
import UnstyledLink from '@components/links/UnstyledLink'
import { ArticlesResponse } from '@hooks/useArticle'
import ArticleCard from '@modules/Article/components/ArticleCard'
import React from 'react'

interface RelatedArticlesProps {
    article?: ArticlesResponse
}

const RelatedArticles: React.FC<RelatedArticlesProps> = ({ article }) => {
    return (
        <div className='bg-grey-black py-14 xl:py-[116px]'>
            <Container className='flex flex-col gap-14 xl:gap-20 '>
                <div className='flex flex-row items-center justify-between'>
                    <h2 className='text-grey-white xl:text-heading-2-desktop text-heading-2-mobile'>
                        Continue Reading
                    </h2>
                    <UnstyledLink href='/articles'>
                        <Button>See More</Button>
                    </UnstyledLink>
                </div>
                <div className='flex flex-row items-center'>
                    <div className='grid w-full grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3 xl:gap-10'>
                        {article?.data?.map((item) => (
                            <UnstyledLink key={item.id} href={`/articles/${item.slug}`}>
                                <ArticleCard
                                    article={item}
                                    metaClassName='!text-grey-200'
                                    titleClassName='!text-grey-white'
                                />
                            </UnstyledLink>
                        ))}
                    </div>
                </div>
            </Container>
        </div>
    )
}

export default RelatedArticles
