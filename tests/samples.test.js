/**
 * Puppeteer smoke tests for all browser-based SAM samples.
 *
 * Serves the workspace root (sam/) so that ../../sam-lib/dist/SAM.js
 * and all node_modules/ relative paths resolve correctly.
 *
 * Run from the sam-samples/tests/ directory:
 *   node samples.test.js
 */

const puppeteer = require('puppeteer')
const httpServer = require('http-server')
const path = require('path')
const assert = require('assert')

// sam/ workspace root  (tests/ -> sam-samples/ -> sam/)
const SERVE_ROOT = path.resolve(__dirname, '..', '..')
let BASE_URL
let server, browser, page
let passed = 0, failed = 0, skipped = 0

// ─── helpers ────────────────────────────────────────────────────────────────

async function setup() {
  server = httpServer.createServer({ root: SERVE_ROOT, cache: -1, silent: true })
  const port = await new Promise((resolve, reject) => {
    server.server.once('error', reject)
    server.listen(0, '127.0.0.1', () => resolve(server.server.address().port))
  })
  BASE_URL = `http://localhost:${port}/sam-samples`

  browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })
}

async function teardown() {
  await browser.close()
  server.close()
}

async function openPage(url, opts = {}) {
  page = await browser.newPage()
  const errors = []
  page.on('pageerror', err => errors.push(err.message))

  const waitUntil = opts.waitUntil || 'load'
  await page.goto(url, { waitUntil, timeout: 20000 })
  return errors
}

async function closePage() {
  if (page) { await page.close(); page = null }
}

function ok(label) {
  console.log(`  ✓ ${label}`)
  passed++
}

function fail(label, err) {
  console.log(`  ✗ ${label}`)
  console.log(`    ${err.message || err}`)
  failed++
}

function skip(label, reason) {
  console.log(`  - ${label} (skipped: ${reason})`)
  skipped++
}

async function test(label, fn) {
  try {
    await fn()
    ok(label)
  } catch (err) {
    fail(label, err)
  } finally {
    await closePage()
  }
}

// ─── test suites ─────────────────────────────────────────────────────────────

async function testLauncher() {
  console.log('\nRoot launcher (index.html)')
  await test('serves index.html at workspace root', async () => {
    await openPage(`http://localhost:${BASE_URL.split(':')[2].split('/')[0]}/`)
    const title = await page.title()
    assert.ok(title.includes('SAM'), `expected SAM in title, got "${title}"`)
    const links = await page.$$('a[href*="sam-samples"]')
    assert.ok(links.length > 0, 'no sample links found')
  })
}

async function testTodoMVCVanilla() {
  console.log('\ntodomvc-app (vanilla JS)')
  await test('loads with todo items', async () => {
    await openPage(`${BASE_URL}/todomvc-app/`, { waitUntil: 'load' })
    await page.waitForSelector('.todo-list li', { timeout: 8000 })
    const items = await page.$$('.todo-list li')
    assert.ok(items.length >= 2, `expected >=2 items, got ${items.length}`)
  })

  await test('no page-level JS errors on load', async () => {
    const errors = await openPage(`${BASE_URL}/todomvc-app/`, { waitUntil: 'load' })
    await page.waitForSelector('.todo-list li', { timeout: 8000 })
    assert.strictEqual(errors.length, 0, `page errors: ${errors.join('; ')}`)
  })
}

async function testTodoMVCLitHtml() {
  console.log('\ntodomvc-app-lit-html')
  await test('loads with todo items', async () => {
    await openPage(`${BASE_URL}/todomvc-app-lit-html/`, { waitUntil: 'load' })
    await page.waitForSelector('.todo-list li', { timeout: 10000 })
    const items = await page.$$('.todo-list li')
    assert.ok(items.length >= 2, `expected >=2 items, got ${items.length}`)
  })

  await test('no page-level JS errors on load', async () => {
    const errors = await openPage(`${BASE_URL}/todomvc-app-lit-html/`, { waitUntil: 'load' })
    await page.waitForSelector('.todo-list li', { timeout: 10000 })
    assert.strictEqual(errors.length, 0, `page errors: ${errors.join('; ')}`)
  })
}

async function testTodoMVCVue() {
  console.log('\ntodomvc-app-vue')
  await test('loads and renders todo list', async () => {
    await openPage(`${BASE_URL}/todomvc-app-vue/`, { waitUntil: 'load' })
    // Vue app mounts to #app; wait for any child content
    await page.waitForFunction(
      () => document.querySelector('#app') && document.querySelector('#app').children.length > 0,
      { timeout: 10000 }
    )
    const app = await page.$('#app')
    assert.ok(app, '#app not found')
  })

  await test('no page-level JS errors on load', async () => {
    const errors = await openPage(`${BASE_URL}/todomvc-app-vue/`, { waitUntil: 'load' })
    await page.waitForFunction(
      () => document.querySelector('#app') && document.querySelector('#app').children.length > 0,
      { timeout: 10000 }
    )
    assert.strictEqual(errors.length, 0, `page errors: ${errors.join('; ')}`)
  })
}

async function testInfernoRocket() {
  console.log('\ninferno-rocket')
  await test('loads and shows Start button', async () => {
    const errors = await openPage(`${BASE_URL}/inferno-rocket/`, { waitUntil: 'load' })
    await page.waitForFunction(
      () => {
        const inputs = document.querySelectorAll('input[type="submit"]')
        return Array.from(inputs).some(i => i.value === 'Start')
      },
      { timeout: 8000 }
    )
    assert.strictEqual(errors.length, 0, `page errors: ${errors.join('; ')}`)
  })

  await test('shows countdown after Start', async () => {
    await openPage(`${BASE_URL}/inferno-rocket/`, { waitUntil: 'load' })
    await page.waitForFunction(
      () => Array.from(document.querySelectorAll('input[type="submit"]')).some(i => i.value === 'Start'),
      { timeout: 8000 }
    )
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('input[type="submit"]')).find(i => i.value === 'Start')
      btn.closest('form').dispatchEvent(new Event('submit'))
    })
    await page.waitForFunction(
      () => Array.from(document.querySelectorAll('input[type="submit"]')).some(i => i.value === 'Abort'),
      { timeout: 5000 }
    )
    const text = await page.$eval('#representation', el => el.textContent)
    assert.ok(text.includes('Count down'), `expected "Count down" in text, got: "${text}"`)
  })
}


async function testReactCounter() {
  console.log('\nreact-counter')
  await test('loads click counter button', async () => {
    const errors = await openPage(`${BASE_URL}/react-counter/`, { waitUntil: 'load' })
    await page.waitForSelector('button', { timeout: 10000 })
    const text = await page.$eval('button', el => el.textContent)
    assert.ok(text.includes('Click me'), `expected button with "Click me", got: "${text}"`)
    assert.strictEqual(errors.length, 0, `page errors: ${errors.join('; ')}`)
  })

  await test('click increments counter', async () => {
    await openPage(`${BASE_URL}/react-counter/`, { waitUntil: 'load' })
    await page.waitForSelector('button', { timeout: 10000 })
    await page.click('button')
    await page.evaluate(() => new Promise(r => requestAnimationFrame(r)))
    const text = await page.$eval('button', el => el.textContent)
    assert.ok(text.includes('1'), `expected count 1 after click, got: "${text}"`)
  })
}

async function testReactChildInstance() {
  console.log('\nreact-child-instance')
  await test('loads the child form', async () => {
    const errors = await openPage(`${BASE_URL}/react-child-instance/`, { waitUntil: 'load' })
    await page.waitForSelector('input[type="text"]', { timeout: 10000 })
    const inputs = await page.$$('input[type="text"], input[type="password"], input[type="email"]')
    assert.ok(inputs.length >= 3, `expected name/password/email fields, got ${inputs.length}`)
    // React.createClass raises a deprecation console warn — not a fatal error
    const fatal = errors.filter(e => !e.includes('deprecated') && !e.includes('Warning'))
    assert.strictEqual(fatal.length, 0, `fatal page errors: ${fatal.join('; ')}`)
  })
}

async function testVanillaChildInstance() {
  console.log('\nvanilla-child-instance')
  await test('loads parent UI with Create SAM Child button', async () => {
    const errors = await openPage(`${BASE_URL}/vanilla-child-instance/`, { waitUntil: 'load' })
    await page.waitForFunction(
      () => {
        const inputs = document.querySelectorAll('input[type="submit"]')
        return Array.from(inputs).some(i => i.value === 'Create SAM Child')
      },
      { timeout: 8000 }
    )
    assert.strictEqual(errors.length, 0, `page errors: ${errors.join('; ')}`)
  })

  await test('creates child instance when button clicked', async () => {
    await openPage(`${BASE_URL}/vanilla-child-instance/`, { waitUntil: 'load' })
    await page.waitForFunction(
      () => Array.from(document.querySelectorAll('input[type="submit"]')).some(i => i.value === 'Create SAM Child'),
      { timeout: 8000 }
    )
    await page.evaluate(() => {
      Array.from(document.querySelectorAll('input[type="submit"]'))
        .find(i => i.value === 'Create SAM Child')
        .closest('form').dispatchEvent(new Event('submit'))
    })
    await page.waitForSelector('input[type="range"]', { timeout: 5000 })
    const slider = await page.$('input[type="range"]')
    assert.ok(slider, 'weight slider not found in child instance')
  })
}

async function testVanillaFocusFields() {
  console.log('\nvanilla-focus-fields')
  await test('loads timesheet form', async () => {
    const errors = await openPage(`${BASE_URL}/vanilla-focus-fields/`, { waitUntil: 'load' })
    await page.waitForFunction(
      () => document.querySelector('.timein') !== null,
      { timeout: 8000 }
    )
    const timeInputs = await page.$$('.timein')
    assert.ok(timeInputs.length >= 1, 'no time-in fields found')
    assert.strictEqual(errors.length, 0, `page errors: ${errors.join('; ')}`)
  })

  await test('add row button appends a row', async () => {
    await openPage(`${BASE_URL}/vanilla-focus-fields/`, { waitUntil: 'load' })
    await page.waitForSelector('#addRow', { timeout: 8000 })
    const before = (await page.$$('.timein')).length
    await page.click('#addRow')
    await page.evaluate(() => new Promise(r => requestAnimationFrame(r)))
    const after = (await page.$$('.timein')).length
    assert.ok(after > before, `row count did not increase (before: ${before}, after: ${after})`)
  })
}

async function testLighterHtml() {
  console.log('\nlighterhtml')
  await test('loads and renders blockquote placeholder', async () => {
    // lighterhtml uses CDN; if offline this will fail — acceptable
    const errors = await openPage(`${BASE_URL}/lighterhtml/`, { waitUntil: 'networkidle2', timeout: 15000 })
      .catch(() => null)
    if (errors === null) {
      skip('lighterhtml load', 'CDN unavailable or timeout')
      return
    }
    await page.waitForSelector('#representation', { timeout: 5000 })
    const el = await page.$('#representation')
    assert.ok(el, '#representation not found')
  })
}

async function testVanillaApiCalls() {
  console.log('\nvanilla-api-calls')
  await test('loads initial status UI (API calls skipped — external server required)', async () => {
    const errors = await openPage(`${BASE_URL}/vanilla-api-calls/`, { waitUntil: 'load' })
    await page.waitForFunction(
      () => document.querySelector('#representation') && document.querySelector('#representation').textContent.includes('Status'),
      { timeout: 8000 }
    )
    // Only fatal errors — network errors to cloudsentinel.com are expected
    const fatal = errors.filter(e => !e.toLowerCase().includes('network') && !e.toLowerCase().includes('fetch'))
    assert.strictEqual(fatal.length, 0, `fatal page errors: ${fatal.join('; ')}`)
  })
}

// ─── main ────────────────────────────────────────────────────────────────────

;(async () => {
  await setup()

  // Resolve actual port for launcher test
  const port = server.server.address().port
  console.log(`\nServing ${SERVE_ROOT} on port ${port}`)

  await testLauncher()
  await testTodoMVCVanilla()
  await testTodoMVCLitHtml()
  await testTodoMVCVue()
  await testInfernoRocket()
  await testReactCounter()
  await testReactChildInstance()
  await testVanillaChildInstance()
  await testVanillaFocusFields()
  await testLighterHtml()
  await testVanillaApiCalls()

  await teardown()

  const total = passed + failed + skipped
  console.log(`\n${total} tests: ${passed} passed, ${failed} failed, ${skipped} skipped`)
  process.exit(failed > 0 ? 1 : 0)
})()
