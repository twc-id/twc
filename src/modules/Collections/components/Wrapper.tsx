import Container from '@components/Container'
import Content from '@modules/Collections/components/Content'
import Sidebar from '@modules/Collections/components/Sidebar'
import { useTranslation } from 'next-i18next'
import React, { useRef, useState } from 'react'

const Wrapper = () => {
    const { t } = useTranslation('collection')
    const [tab, setTab] = useState('Watches')
    const tabsRef = useRef<HTMLDivElement>(null)
    const tabs = [t('home:highlight.tabs.watches'), t('home:highlight.tabs.accessories')]

    const handleChangeTab = (selectedTab: string) => {
        setTab(selectedTab)
    }
    return (
        <Container className='flex flex-col xl:gap-20 xl:pt-20'>
            <div className='flex flex-row justify-between'>
                <h2>Our Collections Filter</h2>
                {/* Tabs */}
                <div className='border-grey-black flex w-full flex-row border xl:w-auto xl:justify-end' ref={tabsRef}>
                    {tabs.map((item) => (
                        <button
                            key={item}
                            onClick={() => handleChangeTab(item)}
                            className={`xl:text-button-3-desktop text-button-3-mobile w-full py-3 transition-colors xl:w-[137px] ${
                                item === tab
                                    ? 'bg-grey-black text-grey-white'
                                    : 'bg-grey-white text-grey-black hover:bg-grey-100'
                            }`}
                        >
                            {item}
                        </button>
                    ))}
                </div>
            </div>

            <div className='flex flex-row xl:gap-10'>
                <Sidebar />
                <Content />
            </div>
        </Container>
    )
}

export default Wrapper
