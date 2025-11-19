import React, { useEffect, useState } from 'react'

import Icons from '../Icon'

const BackToTop: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.pageYOffset > 300) {
                setIsVisible(true)
            } else {
                setIsVisible(false)
            }
        }

        window.addEventListener('scroll', toggleVisibility)

        return () => window.removeEventListener('scroll', toggleVisibility)
    }, [])

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    }

    if (!isVisible) {
        return null
    }

    return (
        <button
            onClick={scrollToTop}
            className='bg-grey-white fixed bottom-8 right-8 z-50 flex h-11 w-11 items-center justify-center rounded-full border-[1.5px] border-gray-400 p-[22px] shadow-lg transition-all duration-300 hover:border-gray-600 hover:shadow-xl xl:h-16 xl:w-16'
            aria-label='Back to top'
        >
            <Icons icon='ArrowLeft' className='h-5 w-5 rotate-90 text-gray-600' />
        </button>
    )
}

export default BackToTop
