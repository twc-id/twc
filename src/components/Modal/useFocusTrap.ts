import { useEffect, useRef } from 'react'

/**
 * Hook to trap focus within a modal when it's open.
 * Ensures keyboard navigation (Tab, Shift+Tab) stays within the modal
 * and restores focus to the trigger element when modal closes.
 *
 * @param isActive - Whether the focus trap should be active
 * @param containerRef - Ref to the modal container element
 */
export function useFocusTrap(isActive: boolean, containerRef: React.RefObject<HTMLElement>) {
    const previousActiveElementRef = useRef<HTMLElement | null>(null)

    useEffect(() => {
        if (!isActive || typeof window === 'undefined') return

        // Store the element that had focus before modal opened
        previousActiveElementRef.current = document.activeElement as HTMLElement

        const container = containerRef.current
        if (!container) return

        // Find all focusable elements within modal
        const focusableElements = container.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        const firstElement = focusableElements[0] as HTMLElement
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

        // Focus first element when modal opens
        firstElement?.focus()

        // Handle Tab key to trap focus within modal
        const handleTab = (e: KeyboardEvent) => {
            if (e.key !== 'Tab') return

            if (e.shiftKey) {
                // Shift + Tab: Move to last element if at first
                if (document.activeElement === firstElement) {
                    e.preventDefault()
                    lastElement?.focus()
                }
            } else {
                // Tab: Move to first element if at last
                if (document.activeElement === lastElement) {
                    e.preventDefault()
                    firstElement?.focus()
                }
            }
        }

        container.addEventListener('keydown', handleTab)

        return () => {
            container.removeEventListener('keydown', handleTab)
            // Restore focus to element that had focus before modal opened
            previousActiveElementRef.current?.focus()
        }
    }, [isActive, containerRef])
}
