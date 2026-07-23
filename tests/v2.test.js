/**
 * Puppeteer smoke tests for the v2/ strict-profile samples (#20–#25).
 *
 * Three assertion layers per sample:
 *   1. strict-error guard — interacting with the sample must not surface an
 *      unexpected SamShapeError / SamFrameError / SamSchemaError (the failure
 *      signature of a bad acceptor migration or a stale vendored build)
 *   2. one functional assertion — the sample demonstrably *does something*
 *      (the silent no-op is the failure family v2 exists to kill)
 *   3. deliberate-failure demos asserted positively — a sample built to
 *      demonstrate a strict-mode throw must still throw it
 * Plus a node-side vendor-drift guard: v2/lib/SAM.js must be byte-identical
 * to sam-lib/dist/SAM.js when a built dist is present.
 *
 * Run from the sam-samples/tests/ directory:
 *   node v2.test.js
 */

const puppeteer = require('puppeteer')
const httpServer = require('http-server')
const path = require('path')
const fs = require('fs')
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
  BASE_URL = `http://localhost:${port}/sam-samples/v2`

  browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })
}

async function teardown() {
  await browser.close()
  server.close()
}

// opens a sample page and collects strict-profile errors from the console and
// page errors — the layer-1 guard reads this after interacting
async function openPage(sample, opts = {}) {
  page = await browser.newPage()
  const samErrors = []
  const trap = (text) => {
    if (/Sam(Shape|Frame|Schema)Error/.test(text)) samErrors.push(text)
  }
  page.on('console', (m) => trap(m.text()))
  page.on('pageerror', (e) => trap(`${e.name}: ${e.message}`))
  await page.goto(`${BASE_URL}/${sample}/index.html`, {
    waitUntil: opts.waitUntil || 'networkidle0', timeout: 20000
  })
  return samErrors
}

async function closePage() {
  if (page) { await page.close(); page = null }
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// clicks every button on the page except deliberate failure demos
async function clickAllButtons({ skipLabels = ['break'] } = {}) {
  const buttons = await page.$$('button')
  for (const b of buttons) {
    const label = (await page.evaluate((el) => el.textContent || '', b)).toLowerCase()
    if (skipLabels.some((s) => label.includes(s))) continue
    try { await b.click({ delay: 5 }); await sleep(50) } catch { /* detached/hidden */ }
  }
  await sleep(120)
}

// clicks the first button whose text includes the label (for framework-rendered
// buttons without ids)
async function clickButtonByText(label) {
  const clicked = await page.evaluate((text) => {
    const b = [...document.querySelectorAll('button')]
      .find((el) => (el.textContent || '').includes(text))
    if (b) { b.click(); return true }
    return false
  }, label)
  assert.ok(clicked, `no button with text "${label}"`)
  await sleep(80)
}

// sets an input's value the framework-visible way (dispatches input event)
async function typeInto(selector, value) {
  await page.evaluate((sel, v) => {
    const el = document.querySelector(sel)
    el.value = v
    el.dispatchEvent(new Event('input', { bubbles: true }))
  }, selector, value)
  await sleep(80)
}

const text = (selector) => page.$eval(selector, (el) => el.textContent.trim())

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

// asserts the layer-1 guard: no unexpected strict-profile errors surfaced
const assertNoStrictErrors = (samErrors) => {
  assert.strictEqual(samErrors.length, 0, `strict-profile errors: ${samErrors.join('; ')}`)
}

// ─── vendor-drift guard ─────────────────────────────────────────────────────

function testVendorDrift() {
  console.log('\nvendored lib (v2/lib/SAM.js)')
  const vendored = path.resolve(__dirname, '..', 'v2', 'lib', 'SAM.js')
  const dist = path.resolve(__dirname, '..', '..', 'sam-lib', 'dist', 'SAM.js')
  try {
    assert.ok(fs.existsSync(vendored), 'v2/lib/SAM.js missing')
    if (!fs.existsSync(dist)) {
      skip('matches sam-lib/dist/SAM.js', 'no built dist (standalone checkout or unbuilt sam-lib)')
      return
    }
    assert.ok(
      fs.readFileSync(vendored).equals(fs.readFileSync(dist)),
      'v2/lib/SAM.js differs from sam-lib/dist/SAM.js — re-vendor: cp sam-lib/dist/SAM.js sam-samples/v2/lib/SAM.js'
    )
    ok('matches sam-lib/dist/SAM.js byte-for-byte')
  } catch (err) {
    fail('matches sam-lib/dist/SAM.js', err)
  }
}

// ─── per-sample suites ──────────────────────────────────────────────────────

async function testCounter() {
  console.log('\n01-counter-vanilla')
  await test('increments and survives all controls', async () => {
    const errs = await openPage('01-counter-vanilla')
    // #count renders empty until the first step commits
    await page.click('#inc'); await sleep(80)
    assert.strictEqual(await text('#count'), '1')
    await clickAllButtons()
    assertNoStrictErrors(errs)
  })

  await test('"Break it" demo still throws SamSchemaError (deliberate)', async () => {
    await openPage('01-counter-vanilla')
    await page.click('#break'); await sleep(150)
    const log = await text('#log')
    assert.ok(log.includes('SamSchemaError'), `expected SamSchemaError in log, got "${log}"`)
  })
}

async function testTemperature() {
  console.log('\n02-temperature-alpine')
  await test('converts C to F through the strict step', async () => {
    const errs = await openPage('02-temperature-alpine')
    await typeInto('input[type=number]', '100')
    await sleep(150)
    const inputs = await page.$$eval('input[type=number]', (els) => els.map((e) => e.value))
    assert.strictEqual(Number(inputs[1]), 212, `expected 212F, got ${inputs[1]}`)
    assertNoStrictErrors(errs)
  })
}

async function testStopwatch() {
  console.log('\n03-stopwatch-vanjs')
  await test('starts, ticks, laps, stops', async () => {
    const errs = await openPage('03-stopwatch-vanjs')
    await clickButtonByText('Start')
    await sleep(400)
    await clickButtonByText('Lap')
    await clickButtonByText('Stop')
    const body = await text('body')
    assert.ok(!body.includes('0.0s') || body.match(/0\.[1-9]|[1-9]\.\d/),
      'display never advanced past 0.0s')
    assertNoStrictErrors(errs)
  })
}

async function testRocket() {
  console.log('\n04-rocket-launcher-lit')
  await test('counts down after Start', async () => {
    const errs = await openPage('04-rocket-launcher-lit')
    const before = await text('.counter')
    await clickButtonByText('Start')
    await sleep(1400)
    const after = await text('.counter')
    assert.notStrictEqual(after, before, `counter stuck at ${before}`)
    assertNoStrictErrors(errs)
  })
}

async function testTodos() {
  console.log('\n05-todos-preact')
  await test('adds and toggles a todo', async () => {
    const errs = await openPage('05-todos-preact')
    await typeInto('input[name=title]', 'write the harness')
    await clickButtonByText('Add')
    await sleep(150)
    const items = await page.$$('li')
    assert.ok(items.length >= 1, 'todo was not added')
    await page.click('li input[type=checkbox]'); await sleep(120)
    const done = await page.$$('li.done')
    assert.strictEqual(done.length, 1, 'toggle did not mark the todo done')
    assertNoStrictErrors(errs)
  })
}

async function testCrud() {
  console.log('\n06-crud-vue')
  await test('selecting a contact populates the form', async () => {
    const errs = await openPage('06-crud-vue')
    await sleep(200) // Vue mount
    const rows = await page.$$('li')
    assert.ok(rows.length >= 1, 'no seeded contacts rendered')
    await rows[0].click(); await sleep(150)
    const name = await page.$eval('input', (el) => el.value)
    assert.ok(name.length > 0, 'Select did not populate the form')
    assertNoStrictErrors(errs)
  })
}

async function testWizard() {
  console.log('\n07-wizard-petite-vue')
  await test('Next advances the step', async () => {
    const errs = await openPage('07-wizard-petite-vue')
    await sleep(200) // petite-vue mount
    const before = await text('.crumb.here')
    await clickButtonByText('Next')
    await sleep(150)
    const after = await text('.crumb.here')
    assert.notStrictEqual(after, before, `step stuck at ${before}`)
    assertNoStrictErrors(errs)
  })
}

async function testRating() {
  console.log('\n08-rating-webcomponent')
  await test('rating a component updates the average', async () => {
    const errs = await openPage('08-rating-webcomponent')
    await page.evaluate(() => {
      const stars = document.querySelector('star-rating[name="yaml"]')
        .shadowRoot.querySelectorAll('button')
      stars[2].click() // rate 3
    })
    await sleep(150)
    const summary = await text('#summary')
    assert.ok(summary.includes('Average rating:'), `no average rendered: "${summary}"`)
    assertNoStrictErrors(errs)
  })
}

async function testSnake() {
  console.log('\n09-snake-canvas')
  await test('runs, turns, restarts', async () => {
    const errs = await openPage('09-snake-canvas')
    for (const key of ['ArrowDown', 'ArrowRight', 'ArrowUp']) {
      await page.keyboard.press(key); await sleep(150)
    }
    await page.click('#restart'); await sleep(150)
    assert.strictEqual(await text('#score'), 'Score: 0', 'restart did not reset the score')
    assertNoStrictErrors(errs)
  })
}

async function testRaft() {
  console.log('\n10-raft-visualizer')
  await test('timeout + two votes elects a leader', async () => {
    const errs = await openPage('10-raft-visualizer')
    assert.strictEqual(await text('#role'), 'follower')
    await page.click('#timeout'); await sleep(100)
    assert.strictEqual(await text('#role'), 'candidate', 'timeout did not start campaign')
    await page.click('#vote2'); await sleep(100)
    await page.click('#vote3'); await sleep(100)
    assert.strictEqual(await text('#role'), 'leader', 'quorum did not elect')
    assertNoStrictErrors(errs)
  })

  await test('stale heartbeat is rejected, not absorbed (deliberate)', async () => {
    await openPage('10-raft-visualizer')
    await page.click('#timeout'); await sleep(100)
    await page.click('#hbLow'); await sleep(150)
    // the rejection must be observable (steps log) and the role unchanged
    assert.strictEqual(await text('#role'), 'candidate', 'stale heartbeat changed the role')
    const steps = await text('#steps')
    assert.ok(/reject|stale/i.test(steps), `no visible rejection in steps log: "${steps}"`)
  })
}

async function testChecker() {
  console.log('\n11-checker-playground')
  await test('runs the checker off the instance manifest', async () => {
    const errs = await openPage('11-checker-playground')
    await page.click('#run')
    await page.waitForFunction(
      () => document.getElementById('out').textContent.trim().length > 0,
      { timeout: 10000 }
    )
    const out = await text('#out')
    assert.ok(out.length > 0, 'checker produced no output')
    assertNoStrictErrors(errs)
  })
}

async function testTimeTravel() {
  console.log('\n12-time-travel-debugger')
  await test('logs steps and travels back', async () => {
    const errs = await openPage('12-time-travel-debugger')
    const cartBefore = await page.$$eval('#cart div', (els) => els.length)
    await page.click('#addDuck'); await sleep(100)
    await page.click('#addBoat'); await sleep(100)
    // the cart renders item rows plus a total row — assert relatively
    const cartAfter = await page.$$eval('#cart div', (els) => els.length)
    assert.strictEqual(cartAfter, cartBefore + 2, `expected ${cartBefore + 2} cart rows, got ${cartAfter}`)
    const logRows = await page.$$('#log tr')
    assert.ok(logRows.length >= 2, 'steps were not logged')
    await logRows[0].click(); await sleep(150)
    const cartBack = await page.$$eval('#cart div', (els) => els.length)
    assert.ok(cartBack < cartAfter, `travel did not restore an earlier state (still ${cartBack} rows)`)
    assertNoStrictErrors(errs)
  })
}

// ─── runner ─────────────────────────────────────────────────────────────────

async function run() {
  testVendorDrift()
  await setup()
  try {
    await testCounter()
    await testTemperature()
    await testStopwatch()
    await testRocket()
    await testTodos()
    await testCrud()
    await testWizard()
    await testRating()
    await testSnake()
    await testRaft()
    await testChecker()
    await testTimeTravel()
  } finally {
    await teardown()
  }
  console.log(`\n${passed + failed + skipped} tests: ${passed} passed, ${failed} failed, ${skipped} skipped`)
  process.exit(failed > 0 ? 1 : 0)
}

run().catch((err) => { console.error(err); process.exit(1) })
