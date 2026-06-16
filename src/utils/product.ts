/**
 * Returns the purchase year to render in the "Pre-owned • {{year}}" label,
 * or `null` when the product should NOT show the label.
 *
 * A product is pre-owned only when it is NOT explicitly brand new. Brand-new
 * products carry the authoritative `is_new = 1` meta flag (the same flag the
 * detail page uses to override the condition). Gating purely on the presence of
 * `basic-info-year-purchase` was wrong: brand-new items can carry a leftover
 * year value and were incorrectly shown as pre-owned.
 *
 * Use this everywhere the pre-owned label is rendered so the behaviour stays
 * consistent across the listing, search results, suggestions, etc.
 */
export const getPreOwnedYear = (product: any): string | null => {
    const meta = product?.meta_data || []

    // is_new = 1 → brand new → never show the pre-owned label.
    if (Number(meta.find((m: any) => String(m.key) === 'is_new')?.value) === 1) return null

    const year = meta.find((m: any) => String(m.key) === 'basic-info-year-purchase')?.value
    return year ? String(year) : null
}
