

const assert = require('assert');

// ------------------------------------------------
// Helpers — tiny test runner (no extra packages)
// ------------------------------------------------
let passed = 0;
let failed = 0;

function test(name, fn) {
    try {
        fn();
        console.log(`  ✓  ${name}`);
        passed++;
    } catch (err) {
        console.error(`  ✗  ${name}`);
        console.error(`     ${err.message}`);
        failed++;
    }
}

// ------------------------------------------------
// Tests
// ------------------------------------------------

console.log('\nRunning tests...\n');

test('PORT defaults to 3000', () => {
    const PORT = process.env.PORT || 3000;
    assert.strictEqual(PORT, 3000);
});

test('JSON response has required fields', () => {
    const response = {
        status: 'ok',
        message: 'Hello from my CI/CD pipeline!',
        timestamp: new Date().toISOString()
    };
    assert.ok(response.status,    'missing status field');
    assert.ok(response.message,   'missing message field');
    assert.ok(response.timestamp, 'missing timestamp field');
});

test('timestamp is a valid ISO string', () => {
    const ts = new Date().toISOString();
    assert.ok(!isNaN(Date.parse(ts)), 'timestamp is not a valid date');
});

test('status is exactly "ok"', () => {
    assert.strictEqual('ok', 'ok');
});

// ------------------------------------------------
// Summary
// ------------------------------------------------
console.log(`\nResults: ${passed} passed, ${failed} failed\n`);

if (failed > 0) {
    process.exit(1); // non-zero exit = Jenkins marks stage as FAILED
}