/**
 * Hook previously used to pause/resume ScrollSmoother when modal opens/closes.
 * ScrollSmoother has been removed — this is now a no-op kept for API compatibility.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function useModalScroll(_isOpen: boolean) {
    // no-op — ScrollSmoother removed
}
