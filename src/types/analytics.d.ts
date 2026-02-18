declare module '@analytics/google-analytics' {
    import { AnalyticsPlugin } from 'analytics'

    interface GoogleAnalyticsConfig {
        measurementIds: string[]
        debug?: boolean
        anonymizeIp?: boolean
        customDimension?: Record<string, unknown>
    }

    export default function googleAnalytics(config: GoogleAnalyticsConfig): AnalyticsPlugin
}
