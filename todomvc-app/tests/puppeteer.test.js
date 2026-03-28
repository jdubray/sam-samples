/**
 * Puppeteer end-to-end tests for todomvc-app.
 *
 * Serves the workspace root (sam/) via http-server so that the relative
 * path ../../sam-lib/dist/SAM.js in index.html resolves correctly.
 */

const puppeteer = require('puppeteer')
const httpServer = require('http-server')
const path = require('path')
const assert = require('assert')

// Serve from the sam/ workspace root: tests/ -> todomvc-app/ -> sam-samples/ -> sam/
const SERVE_ROOT = path.resolve(__dirname, '..', '..', '..')
let APP_URL  // set dynamically once the OS assigns a port

let server, browser, page
let passed = 0, failed = 0

// ─── helpers ────────────────────────────────────────────────────────────────

async function setup() {
  server = httpServer.createServer({ root: SERVE_ROOT, cache: -1, silent: true })
  // Use port 0 so the OS picks a free port — eliminates EADDRINUSE on reruns.
  // http-server doesn't forward errors to the listen callback, so we wire
  // the error listener on the underlying node http.Server directly.
  const port = await new Promise((resolve, reject) => {
    server.server.once('error', reject)
    server.listen(0, '127.0.0.1', () => resolve(server.server.address().port))
  })
  APP_URL = `http://localhost:${port}/sam-samples/todomvc-app/`

  browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })
  page = await browser.newPage()
  page.on('pageerror', err => console.error('  [page error]', err.message))
  // Silence expected 404s (css/app.css etc.) so they don't clutter output
  page.on('requestfailed', () => {})
}

async function teardown() {
  if (browser) await browser.close()
  if (server) server.close()
}

/** Load a fresh copy of the app before each test group. */
async function reload() {
  // 'load' fires after all synchronous scripts run; the module script is async,
  // so we poll for the SAM-rendered list rather than relying on networkidle0.
  const response = await page.goto(APP_URL, { waitUntil: 'load', timeout: 15000 })
  if (response && !response.ok()) {
    throw new Error(`Page load failed: ${response.status()} ${APP_URL}`)
  }
  await page.waitForSelector('.todo-list li', { timeout: 10000 })
}

async function it(name, fn) {
  try {
    await fn()
    console.log(`  ✓ ${name}`)
    passed++
  } catch (e) {
    console.error(`  ✗ ${name}`)
    console.error(`    ${e.message}`)
    failed++
  }
}

/** Call a SAM intent by its window-global name. */
async function intent(name, data = {}) {
  await page.evaluate((n, d) => window[n](d), name, data)
  // Give the SAM cycle one animation frame to flush DOM
  await page.evaluate(() => new Promise(r => requestAnimationFrame(r)))
}

async function itemCount() {
  return page.$$eval('.todo-list li', els =>
    els.filter(el => !el.classList.contains('hidden')).length
  )
}

// ─── tests ──────────────────────────────────────────────────────────────────

async function runTests() {
  // ── 1. Initial state ──────────────────────────────────────────────────────
  console.log('\nInitial state')
  await reload()

  await it('loads with 2 items', async () => {
    assert.strictEqual(await itemCount(), 2)
  })

  await it('shows item count of 2', async () => {
    const text = await page.$eval('.todo-count strong', el => el.textContent.trim())
    assert.strictEqual(text, '2')
  })

  await it('renders the todo header input', async () => {
    const el = await page.$('#new-todo')
    assert.ok(el, '#new-todo input not found')
  })

  // ── 2. Add item ───────────────────────────────────────────────────────────
  console.log('\nAdd item')
  await reload()

  await it('adds a new todo via save intent', async () => {
    await intent('save', { name: 'Buy milk' })
    await page.waitForFunction(
      () => document.querySelectorAll('.todo-list li').length === 3,
      { timeout: 3000 }
    )
    assert.strictEqual(await itemCount(), 3)
  })

  await it('new item appears in the list', async () => {
    await intent('save', { name: 'Walk the dog' })
    await page.waitForFunction(
      () => [...document.querySelectorAll('.todo-list li label')]
        .some(el => el.textContent.includes('Walk the dog')),
      { timeout: 3000 }
    )
    const labels = await page.$$eval('.todo-list li label', els => els.map(e => e.textContent))
    assert.ok(labels.some(l => l.includes('Walk the dog')), 'new item label not found')
  })

  // ── 3. Complete item ──────────────────────────────────────────────────────
  console.log('\nComplete item')
  await reload()

  await it('marks an item as complete', async () => {
    // Click the first toggle checkbox
    await page.click('.toggle')
    await page.waitForFunction(
      () => document.querySelector('.todo-list li.completed') !== null,
      { timeout: 3000 }
    )
    const completed = await page.$$eval('.todo-list li.completed', els => els.length)
    assert.strictEqual(completed, 1)
  })

  await it('decrements active count when item is completed', async () => {
    // Reload fresh, then complete one item and verify the counter drops
    await reload()
    await page.click('.toggle')
    await page.waitForFunction(
      () => document.querySelector('.todo-count strong')?.textContent === '1',
      { timeout: 3000 }
    )
    const count = await page.$eval('.todo-count strong', el => el.textContent.trim())
    assert.strictEqual(count, '1')
  })

  // ── 4. Delete item ────────────────────────────────────────────────────────
  console.log('\nDelete item')
  await reload()

  await it('deletes an item via del intent', async () => {
    const firstId = await page.$eval('.todo-list li button.destroy', el =>
      el.getAttribute('onclick').match(/'id':'(\d+)'/)?.[1]
    )
    // Capture count BEFORE the delete so our waitForFunction threshold is correct
    const beforeCount = await page.$$eval('.todo-list li', els => els.length)
    await intent('del', { id: firstId })
    await page.waitForFunction(
      n => document.querySelectorAll('.todo-list li').length < n,
      { timeout: 3000 },
      beforeCount
    )
    const afterCount = await page.$$eval('.todo-list li', els => els.length)
    assert.ok(afterCount < beforeCount, `expected fewer than ${beforeCount} items, got ${afterCount}`)
  })

  // ── 5. Filters ────────────────────────────────────────────────────────────
  console.log('\nFilters')
  await reload()

  await it('filter Active hides completed items', async () => {
    // Complete item 1
    await intent('done', { id: '1' })
    await page.waitForFunction(
      () => document.querySelector('.todo-list li.completed') !== null,
      { timeout: 3000 }
    )
    // Switch to Active filter
    await intent('displayActive')
    await page.waitForFunction(
      () => document.querySelectorAll('.todo-list li.completed').length === 0,
      { timeout: 3000 }
    )
    const completed = await page.$$eval('.todo-list li.completed', els => els.length)
    assert.strictEqual(completed, 0)
  })

  await it('filter Completed shows only completed items', async () => {
    await reload()
    await intent('done', { id: '1' })
    await page.waitForFunction(
      () => document.querySelector('.todo-list li.completed') !== null,
      { timeout: 3000 }
    )
    await intent('displayCompleted')
    // Non-completed items should not be rendered
    await page.waitForFunction(
      () => {
        const items = [...document.querySelectorAll('.todo-list li')]
        return items.every(li => li.classList.contains('completed'))
      },
      { timeout: 3000 }
    )
    const items = await page.$$eval('.todo-list li', els => els.length)
    const completedItems = await page.$$eval('.todo-list li.completed', els => els.length)
    assert.strictEqual(items, completedItems)
  })

  await it('filter All shows all items', async () => {
    await reload()
    await intent('done', { id: '1' })
    await intent('displayCompleted')
    await intent('displayAll')
    await page.waitForFunction(
      () => document.querySelectorAll('.todo-list li').length === 2,
      { timeout: 3000 }
    )
    assert.strictEqual(await itemCount(), 2)
  })

  // ── 6. Toggle all ─────────────────────────────────────────────────────────
  console.log('\nToggle all')
  await reload()

  await it('toggleAll marks all items as complete', async () => {
    await intent('toggleAll')
    await page.waitForFunction(
      () => [...document.querySelectorAll('.todo-list li')]
        .every(li => li.classList.contains('completed')),
      { timeout: 3000 }
    )
    const count = await page.$eval('.todo-count strong', el => el.textContent.trim())
    assert.strictEqual(count, '0')
  })

  // ── 7. Clear completed ────────────────────────────────────────────────────
  console.log('\nClear completed')
  await reload()

  await it('clear completed removes checked items', async () => {
    await intent('toggleAll')
    await page.waitForFunction(
      () => document.querySelector('.clear-completed') !== null,
      { timeout: 3000 }
    )
    await page.click('.clear-completed')
    await page.waitForFunction(
      () => document.querySelectorAll('.todo-list li.completed').length === 0,
      { timeout: 3000 }
    )
    const completed = await page.$$eval('.todo-list li.completed', els => els.length)
    assert.strictEqual(completed, 0)
  })
}

// ─── runner ──────────────────────────────────────────────────────────────────

;(async () => {
  try {
    await setup()
    await runTests()
  } catch (e) {
    console.error('\nFatal setup error:', e.message)
    failed++
  } finally {
    await teardown()
    console.log(`\n${passed + failed} tests: ${passed} passed, ${failed} failed`)
    process.exit(failed > 0 ? 1 : 0)
  }
})()
