import { defineConfig, devices } from '@playwright/test'

/**
 * Playwright configuration for mobile and desktop testing
 */
export default defineConfig({
    testDir: './tests/e2e',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: 'html',
    use: {
        baseURL: 'http://localhost:3000',
        trace: 'on-first-retry',
        screenshot: 'only-on-failure'
    },

    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] }
        },

        /* Mobile Devices - iOS */
        {
            name: 'iPhone 12',
            use: {
                ...devices['iPhone 12'],
                viewport: { width: 390, height: 844 },
                deviceScaleFactor: 3,
                isMobile: true,
                hasTouch: true
            }
        },
        {
            name: 'iPhone 12 Pro Max',
            use: {
                ...devices['iPhone 12 Pro Max'],
                viewport: { width: 428, height: 926 },
                deviceScaleFactor: 3,
                isMobile: true,
                hasTouch: true
            }
        },
        {
            name: 'iPhone SE',
            use: {
                ...devices['iPhone SE'],
                viewport: { width: 375, height: 667 },
                deviceScaleFactor: 2,
                isMobile: true,
                hasTouch: true
            }
        },
        {
            name: 'iPad',
            use: {
                ...devices['iPad (gen 7)'],
                viewport: { width: 810, height: 1080 },
                deviceScaleFactor: 2,
                isMobile: true,
                hasTouch: true
            }
        },

        /* Mobile Devices - Android */
        {
            name: 'Pixel 5',
            use: {
                ...devices['Pixel 5'],
                viewport: { width: 393, height: 851 },
                deviceScaleFactor: 2.625,
                isMobile: true,
                hasTouch: true
            }
        },
        {
            name: 'Galaxy S21',
            use: {
                ...devices['Galaxy S21+'],
                viewport: { width: 384, height: 854 },
                deviceScaleFactor: 3,
                isMobile: true,
                hasTouch: true
            }
        },

        /* Desktop browsers */
        {
            name: 'firefox',
            use: { ...devices['Desktop Firefox'] }
        },
        {
            name: 'webkit',
            use: { ...devices['Desktop Safari'] }
        }
    ],

    /* Run your local dev server before starting the tests */
    webServer: {
        command: 'yarn dev',
        url: 'http://localhost:3000',
        reuseExistingServer: !process.env.CI,
        timeout: 120000
    }
})
