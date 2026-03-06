import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'

/**
 * Utility functions for GSAP cleanup and management
 */

/**
 * Cleanup GSAP animations with specific context or selector
 */
export const cleanupGSAP = (selector?: string | Element | null) => {
    if (typeof window === 'undefined') return

    if (selector) {
        // Kill specific tweens
        gsap.killTweensOf(selector)

        // Kill ScrollTrigger instances for specific element
        const element = typeof selector === 'string' ? document.querySelector(selector) : selector
        if (element) {
            ScrollTrigger.getAll().forEach((trigger) => {
                if (trigger.trigger === element || trigger.trigger?.contains?.(element as Node)) {
                    trigger.kill()
                }
            })
        }
    } else {
        // Kill all tweens and ScrollTriggers
        gsap.killTweensOf('*')
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
        gsap.globalTimeline.clear()
    }
}

/**
 * Refresh ScrollTrigger after DOM changes
 */
export const refreshScrollTrigger = (delay: number = 300) => {
    if (typeof window === 'undefined') return

    setTimeout(() => {
        ScrollTrigger.refresh()
    }, delay)
}

/**
 * Safe GSAP initialization - ensures plugins are registered
 */
export const initGSAP = () => {
    if (typeof window === 'undefined') return false

    try {
        gsap.registerPlugin(ScrollTrigger)
        return true
    } catch (error) {
        // eslint-disable-next-line no-console
        console.warn('Failed to register GSAP plugins:', error)
        return false
    }
}

/**
 * Create a cleanup function for useGSAP hook
 */
export const createGSAPCleanup = (context?: string | Element) => {
    return () => {
        cleanupGSAP(context)
    }
}

/**
 * Kill specific ScrollTrigger by ID
 */
export const killScrollTriggerById = (id: string) => {
    if (typeof window === 'undefined') return

    const trigger = ScrollTrigger.getById(id)
    if (trigger) {
        trigger.kill()
    }
}

/**
 * Global route change handler for GSAP
 */
export const handleRouteChangeGSAP = {
    start: () => {
        cleanupGSAP()
    },
    complete: () => {
        refreshScrollTrigger(100)
    },
    error: () => {
        refreshScrollTrigger(100)
    }
}

/**
 * Get ScrollSmoother instance from global window object
 */
export const getScrollSmoother = () => {
    if (typeof window === 'undefined') return null
    return (window as any).scrollSmootherInstance || null
}

/**
 * Pause ScrollSmoother (useful for modals/overlays)
 */
export const pauseScrollSmoother = () => {
    const smoother = getScrollSmoother()
    if (smoother && typeof smoother.paused === 'function') {
        smoother.paused(true)
    }
}

/**
 * Resume ScrollSmoother (useful for modals/overlays)
 */
export const resumeScrollSmoother = () => {
    const smoother = getScrollSmoother()
    if (smoother && typeof smoother.paused === 'function') {
        smoother.paused(false)
    }
}
