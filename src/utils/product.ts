/**
 * Build the status line shown on product cards from raw product data —
 * the condition status (`basic-info-status`) optionally followed by the
 * production year (`basic-info-year-production`).
 *
 * Both values are displayed purely from data with NO `is_new` gating: if the
 * dashboard set a status/year, it is shown as-is. Either part is omitted when
 * empty or "-". The year is only shown when `basic-info-year-production`
 * exists (no fallback to purchase year).
 *
 * Examples: "Pre-Owned • 2020", "New Old Stock", "Brand New • 2021".
 * Returns null when neither value is present.
 */
export const getProductStatusLine = (product: any): string | null => {
    const meta = product?.meta_data || []

    const raw = (key: string) => meta.find((m: any) => String(m.key) === key)?.value
    const clean = (value: any) => {
        const str = value == null ? '' : String(value).trim()
        return str === '' || str === '-' ? '' : str
    }

    const parts = [clean(raw('basic-info-status')), clean(raw('basic-info-year-production'))].filter(Boolean)
    return parts.length ? parts.join(' • ') : null
}
