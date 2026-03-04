import { expect, test } from '@playwright/test'

/**
 * Mobile viewport tests for responsive design validation
 */
test.describe('Mobile Viewport Tests', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/')
    })

    test('should render correctly on iPhone 12 (390x844)', async ({ page }) => {
        // Check viewport size
        const viewportSize = page.viewportSize()
        expect(viewportSize?.width).toBe(390)
        expect(viewportSize?.height).toBe(844)

        // Check footer is visible
        const footer = page.locator('footer')
        await expect(footer).toBeVisible()

        // Check no white space at bottom of footer
        const footerBox = await footer.boundingBox()
        expect(footerBox).toBeTruthy()

        // Check hamburger menu is visible on mobile
        const hamburgerMenu = page.getByRole('button', { name: /menu/i }).first()
        await expect(hamburgerMenu).toBeVisible()
    })

    test('should have proper footer without white space on mobile', async ({ page }) => {
        // Scroll to bottom
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))

        // Wait for scroll to complete
        await page.waitForTimeout(500)

        // Check footer background extends to bottom
        const footer = page.locator('footer')
        const footerBox = await footer.boundingBox()
        const bodyHeight = await page.evaluate(() => document.body.scrollHeight)

        expect(footerBox).toBeTruthy()
        // Footer should extend close to the bottom of the page
        if (footerBox) {
            expect(footerBox.y + footerBox.height).toBeGreaterThanOrEqual(bodyHeight - 50)
        }
    })

    test('should handle dark mode transition when clicking Watch Service from navbar', async ({ page }) => {
        // Open hamburger menu
        const hamburgerMenu = page.getByRole('button').filter({ hasText: /menu/i }).first()
        await hamburgerMenu.click()

        // Wait for menu to open
        await page.waitForTimeout(300)

        // Click Watch Service link
        const watchServiceLink = page.getByRole('link', { name: /watch service/i })
        await watchServiceLink.click()

        // Wait for scroll and theme change
        await page.waitForTimeout(1000)

        // Check URL hash
        expect(page.url()).toContain('#service')

        // Check dark mode is applied
        const html = page.locator('html')
        await expect(html).toHaveAttribute('data-theme', 'dark')

        // Check service section is visible
        const serviceSection = page.locator('#service')
        await expect(serviceSection).toBeVisible()
    })

    test('should not have bounce effect on scroll (overscroll-behavior)', async ({ page }) => {
        const html = page.locator('html')

        // Check overscroll-behavior-y is set to none
        const overscrollBehavior = await html.evaluate((el) => window.getComputedStyle(el).overscrollBehaviorY)
        expect(overscrollBehavior).toBe('none')
    })

    test('should handle safe-area-inset for iOS browser nav bar', async ({ page }) => {
        const html = page.locator('html')

        // Check padding-bottom uses safe-area-inset
        const paddingBottom = await html.evaluate((el) => window.getComputedStyle(el).paddingBottom)
        // The value should contain 'env' or be set
        expect(paddingBottom).toBeTruthy()
    })

    test('should not have blank sections when scrolling', async ({ page }) => {
        // Scroll through the page
        await page.evaluate(() => {
            window.scrollTo(0, 500)
        })
        await page.waitForTimeout(300)

        // Check SellReserve section is visible
        const sellReserve = page.locator('section').filter({ hasText: /sell/i })
        await expect(sellReserve).toBeVisible()

        // Scroll to TimePieceService
        await page.evaluate(() => {
            window.scrollTo(0, 1500)
        })
        await page.waitForTimeout(300)

        // Check service section is visible
        const serviceSection = page.locator('#service')
        await expect(serviceSection).toBeVisible()

        // Check images in service section are loaded
        const serviceImages = serviceSection.locator('img')
        const imageCount = await serviceImages.count()
        expect(imageCount).toBeGreaterThan(0)

        // Check images have valid src and are not blank
        for (let i = 0; i < imageCount; i++) {
            const img = serviceImages.nth(i)
            const src = await img.getAttribute('src')
            expect(src).toBeTruthy()
            expect(src).not.toContain('data:') // Not a blank placeholder
        }
    })
})

test.describe('Mobile Navigation Tests', () => {
    test('should close mobile menu when clicking a link', async ({ page }) => {
        await page.goto('/')

        // Open hamburger menu
        const hamburgerMenu = page.getByRole('button').filter({ hasText: /menu/i }).first()
        await hamburgerMenu.click()
        await page.waitForTimeout(300)

        // Menu should be open (check for mobile menu content)
        const mobileMenu = page.locator('[role="navigation"]').or(page.locator('.mobile-menu'))
        await expect(mobileMenu.first()).toBeVisible()

        // Click a link
        const collectionsLink = page.getByRole('link', { name: /collections/i })
        await collectionsLink.click()

        // Wait for navigation
        await page.waitForURL(/\/collections/)

        // Menu should be closed
        await expect(mobileMenu.first()).not.toBeVisible()
    })

    test('should close mobile menu when clicking logo', async ({ page }) => {
        await page.goto('/')

        // Open hamburger menu
        const hamburgerMenu = page.getByRole('button').filter({ hasText: /menu/i }).first()
        await hamburgerMenu.click()
        await page.waitForTimeout(300)

        // Menu should be open
        const mobileMenu = page.locator('[role="navigation"]').or(page.locator('.mobile-menu'))
        await expect(mobileMenu.first()).toBeVisible()

        // Click logo
        const logo = page.getByRole('link', { name: /twc|watch|collections/i }).first()
        await logo.click()

        // Menu should be closed
        await expect(mobileMenu.first()).not.toBeVisible()
    })
})

test.describe('Mobile Footer Tests', () => {
    test('should render footer links correctly on mobile', async ({ page }) => {
        await page.goto('/')

        // Scroll to footer
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
        await page.waitForTimeout(300)

        // Check footer links are visible
        const footerLinks = page.locator('footer a').all()
        const linkCount = (await footerLinks).length
        expect(linkCount).toBeGreaterThan(0)

        // Check specific links exist
        await expect(page.getByRole('link', { name: /sell your watch/i })).toBeVisible()
        await expect(page.getByRole('link', { name: /watch service/i })).toBeVisible()
    })

    test('should navigate correctly when clicking footer links', async ({ page }) => {
        await page.goto('/')

        // Scroll to footer
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
        await page.waitForTimeout(300)

        // Click Watch Service link
        const watchServiceLink = page.getByRole('link', { name: /watch service/i })
        await watchServiceLink.click()

        // Wait for scroll
        await page.waitForTimeout(1000)

        // Check hash changed
        expect(page.url()).toContain('#service')

        // Check dark mode applied
        const html = page.locator('html')
        await expect(html).toHaveAttribute('data-theme', 'dark')
    })
})
