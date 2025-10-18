import { test, expect } from '@playwright/test'

test.describe('Crypto Brokerage App', () => {
  test('should load home page', async ({ page }) => {
    await page.goto('/')
    
    // Check that the page title is correct
    await expect(page).toHaveTitle(/Crypto Brokerage/)
    
    // Check that main heading is visible
    await expect(page.locator('text=Crypto Brokerage')).toBeVisible()
  })

  test('should navigate to markets page', async ({ page }) => {
    await page.goto('/')
    
    // Click on Markets in bottom navigation
    await page.click('text=Markets')
    
    // Verify URL changed
    await expect(page).toHaveURL('/markets')
    
    // Check that search input is visible
    await expect(page.locator('input[placeholder*="Search"]')).toBeVisible()
  })

  test('should display portfolio page', async ({ page }) => {
    await page.goto('/portfolio')
    
    // Check that portfolio value is displayed
    await expect(page.locator('text=Total Value')).toBeVisible()
    
    // Check that allocation section exists
    await expect(page.locator('text=Allocation')).toBeVisible()
  })

  test('should show market data on markets page', async ({ page }) => {
    await page.goto('/markets')
    
    // Wait for markets to load
    await page.waitForSelector('text=BTC', { timeout: 5000 })
    
    // Check that major cryptocurrencies are displayed
    await expect(page.locator('text=BTC')).toBeVisible()
    await expect(page.locator('text=ETH')).toBeVisible()
  })

  test('should navigate to trade page', async ({ page }) => {
    await page.goto('/')
    
    // Click on Trade in bottom navigation
    await page.click('text=Trade')
    
    // Verify URL changed
    await expect(page).toHaveURL('/trade')
    
    // Check that popular assets are shown
    await expect(page.locator('text=Popular Assets')).toBeVisible()
  })

  test('should navigate to activity page', async ({ page }) => {
    await page.goto('/')
    
    // Click on Activity in bottom navigation
    await page.click('text=Activity')
    
    // Verify URL changed
    await expect(page).toHaveURL('/activity')
    
    // Check that tabs are visible
    await expect(page.locator('text=Orders')).toBeVisible()
    await expect(page.locator('text=History')).toBeVisible()
  })

  test('should be mobile responsive', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
    
    // Check that bottom navigation is visible
    const bottomNav = page.locator('nav').last()
    await expect(bottomNav).toBeVisible()
    
    // Check that navigation items are accessible
    await expect(page.locator('text=Home')).toBeVisible()
    await expect(page.locator('text=Markets')).toBeVisible()
  })

  test('should search markets', async ({ page }) => {
    await page.goto('/markets')
    
    // Find search input
    const searchInput = page.locator('input[placeholder*="Search"]')
    await expect(searchInput).toBeVisible()
    
    // Type search query
    await searchInput.fill('BTC')
    
    // Check that results are filtered
    await expect(page.locator('text=Bitcoin')).toBeVisible()
  })

  test('should display portfolio summary on home', async ({ page }) => {
    await page.goto('/')
    
    // Check portfolio card is visible
    await expect(page.locator('text=Portfolio Value')).toBeVisible()
    
    // Check that P&L is displayed
    await expect(page.locator('text=Today')).toBeVisible()
  })

  test('should show top movers on home', async ({ page }) => {
    await page.goto('/')
    
    // Wait for data to load
    await page.waitForSelector('text=Top Movers', { timeout: 5000 })
    
    // Check that top movers section exists
    await expect(page.locator('text=Top Movers')).toBeVisible()
  })
})

test.describe('Navigation', () => {
  test('bottom navigation should work on all pages', async ({ page }) => {
    await page.goto('/')
    
    // Test each navigation item
    const navItems = ['Home', 'Markets', 'Trade', 'Portfolio', 'Activity']
    
    for (const item of navItems) {
      await page.click(`text=${item}`)
      // Wait for navigation
      await page.waitForLoadState('networkidle')
      // Check that we're on the correct page
      await expect(page.locator('nav').last()).toBeVisible()
    }
  })
})

test.describe('API Integration', () => {
  test('should load market data from API', async ({ page }) => {
    // Intercept API call
    await page.route('**/api/markets', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            symbol: 'BTC',
            name: 'Bitcoin',
            price: 50000,
            changePercent24h: 5.5,
          }
        ])
      })
    })
    
    await page.goto('/markets')
    
    // Check that mocked data is displayed
    await expect(page.locator('text=Bitcoin')).toBeVisible()
  })
})

