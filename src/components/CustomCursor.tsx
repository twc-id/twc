import Icons from '@components/Icon'
import { useTheme } from '@contexts/ThemeContext'
import React, { useCallback, useEffect, useRef, useState } from 'react'

const CustomCursor = () => {
    const cursorRef = useRef<HTMLDivElement>(null)
    const [isVisible, setIsVisible] = useState(false)
    const [isPointerMode, setIsPointerMode] = useState(false)
    const { isDarkSection } = useTheme()

    const updateCursorPosition = useCallback((e: MouseEvent) => {
        if (cursorRef.current) {
            cursorRef.current.style.left = `${e.clientX}px`
            cursorRef.current.style.top = `${e.clientY}px`

            // Check if hovering over interactive element
            const elementUnderCursor = document.elementFromPoint(e.clientX, e.clientY)
            if (elementUnderCursor) {
                const computedStyle = window.getComputedStyle(elementUnderCursor)
                const hasPointerCursor =
                    computedStyle.cursor === 'pointer' ||
                    elementUnderCursor.tagName.toLowerCase() === 'button' ||
                    elementUnderCursor.tagName.toLowerCase() === 'a' ||
                    !!elementUnderCursor.closest('button') ||
                    !!elementUnderCursor.closest('a')
                setIsPointerMode(hasPointerCursor)
            }
        }
    }, [])

    useEffect(() => {
        let animationFrame: number

        const handleMouseMove = (e: MouseEvent) => {
            if (animationFrame) {
                cancelAnimationFrame(animationFrame)
            }
            animationFrame = requestAnimationFrame(() => updateCursorPosition(e))
        }

        const handleMouseEnter = () => {
            setIsVisible(true)
        }

        const handleMouseLeave = () => {
            setIsVisible(false)
        }

        // Add event listeners
        document.addEventListener('mousemove', handleMouseMove, { passive: true })
        document.addEventListener('mouseenter', handleMouseEnter)
        document.addEventListener('mouseleave', handleMouseLeave)

        // Hide all cursors globally
        const styleElement = document.createElement('style')
        styleElement.innerHTML = `
            * {
                cursor: none !important;
            }
        `
        document.head.appendChild(styleElement)
        setIsVisible(true)

        return () => {
            if (animationFrame) {
                cancelAnimationFrame(animationFrame)
            }
            document.removeEventListener('mousemove', handleMouseMove)
            document.removeEventListener('mouseenter', handleMouseEnter)
            document.removeEventListener('mouseleave', handleMouseLeave)

            // Remove style element
            if (styleElement.parentNode) {
                document.head.removeChild(styleElement)
            }

            // Reset cursor
            const resetStyle = document.createElement('style')
            resetStyle.innerHTML = `* { cursor: auto !important; }`
            document.head.appendChild(resetStyle)
            setTimeout(() => {
                if (resetStyle.parentNode) {
                    document.head.removeChild(resetStyle)
                }
            }, 100)
        }
    }, [updateCursorPosition])

    if (!isVisible) return null

    return (
        <div
            ref={cursorRef}
            className='pointer-events-none fixed z-[9999] will-change-transform'
            style={{
                transform: 'translate(-50%, -50%)',
                transition: 'none'
            }}
        >
            <Icons
                icon='Diamond'
                width={20}
                height={20}
                className={
                    isPointerMode
                        ? isDarkSection
                            ? 'text-grey-black'
                            : 'text-grey-white'
                        : isDarkSection
                        ? 'text-grey-white'
                        : 'text-grey-black'
                }
            />
        </div>
    )
}

export default CustomCursor
