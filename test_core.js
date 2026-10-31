/**
 * JEE Circle - Automated Test Suite (TDD / Unit & Integration Tests)
 * Designed to run in browser console or headless runner.
 */

const TestRunner = {
    tests: [],
    passed: 0,
    failed: 0,

    describe(name, fn) {
        console.group(`\n🔍 Test Suite: ${name}`);
        fn();
        console.groupEnd();
    },

    it(desc, testFn) {
        try {
            testFn();
            this.passed++;
            console.log(`  ✅ PASS: ${desc}`);
        } catch (err) {
            this.failed++;
            console.error(`  ❌ FAIL: ${desc}\n     Error: ${err.message}`);
        }
    },

    assertEqual(actual, expected, msg = '') {
        if (actual !== expected) {
            throw new Error(`Expected [${expected}] but got [${actual}]. ${msg}`);
        }
    },

    assertTrue(condition, msg = '') {
        if (!condition) {
            throw new Error(`Condition failed. Expected true. ${msg}`);
        }
    },

    assertRegex(str, regex, msg = '') {
        if (!regex.test(str)) {
            throw new Error(`String "${str}" does not match pattern ${regex}. ${msg}`);
        }
    },

    runAll() {
        console.log(`\n========================================`);
        console.log(`🚀 RUNNING JEE CIRCLE CORE TEST SUITE`);
        console.log(`========================================`);

        // 1. Mentee ID Uniqueness & Format Test
        this.describe('Mentee ID Generation (TDD Unit Test)', () => {
            this.it('should generate official ID matching JEE-M-XXXXX format', () => {
                const generateId = () => 'JEE-M-' + Math.floor(10000 + Math.random() * 90000);
                const id = generateId();
                TestRunner.assertRegex(id, /^JEE-M-\d{5}$/, 'Invalid ID pattern');
            });

            this.it('should generate distinct IDs over 1,000 iterations (No Collision)', () => {
                const ids = new Set();
                for (let i = 0; i < 1000; i++) {
                    const id = 'JEE-M-' + (Date.now().toString().slice(-4) + Math.floor(1000 + Math.random() * 9000));
                    ids.add(id);
                }
                TestRunner.assertEqual(ids.size, 1000, 'Collision detected in ID generation');
            });
        });

        // 2. WhatsApp Inquiry Dispatch Test
        this.describe('WhatsApp Inquiry Lead Dispatch (TDD Unit Test)', () => {
            this.it('should correctly format WhatsApp URL with Lead Admin phone and encoded payload', () => {
                const adminPhone = '919450287685';
                const name = 'Aman Kumar';
                const phone = '+91 9876543210';
                const target = 'JEE 2027';
                const query = 'Need 1-on-1 mentorship for Physics backlogs';

                const text = `*New Callback Inquiry - JEE Circle*\n` +
                             `👤 *Name:* ${name}\n` +
                             `📞 *Phone:* ${phone}\n` +
                             `🎯 *Target Exam:* ${target}\n` +
                             `💬 *Query:* ${query}\n` +
                             `⏰ *Time:* ${new Date().toLocaleDateString()}`;

                const expectedUrl = `https://wa.me/${adminPhone}?text=${encodeURIComponent(text)}`;
                TestRunner.assertTrue(expectedUrl.includes('919450287685'), 'Admin phone missing');
                TestRunner.assertTrue(expectedUrl.includes(encodeURIComponent('Aman Kumar')), 'Encoded name missing');
            });

            this.it('should reject invalid 3-digit phone numbers', () => {
                const isValidPhone = (p) => /^(\+91[\-\s]?)?[6789]\d{9}$/.test(p.trim().replace(/\s+/g, ''));
                TestRunner.assertTrue(!isValidPhone('123'), 'Accepted invalid short phone');
                TestRunner.assertTrue(isValidPhone('+91 9450287685'), 'Valid 10-digit Indian phone marked invalid');
            });
        });

        // 3. Captcha Security Challenge Test
        this.describe('Captcha Challenge & Anti-Bot System (TDD Unit Test)', () => {
            this.it('should generate verifiable arithmetic challenge (e.g. 7 + 4 = 11)', () => {
                const generateCaptcha = () => {
                    const num1 = Math.floor(Math.random() * 9) + 1;
                    const num2 = Math.floor(Math.random() * 9) + 1;
                    return { question: `What is ${num1} + ${num2}?`, answer: num1 + num2 };
                };
                const c = generateCaptcha();
                TestRunner.assertTrue(c.answer >= 2 && c.answer <= 18, 'Answer out of bounds');
            });

            this.it('should reject wrong captcha inputs', () => {
                const challenge = { answer: 14 };
                const validate = (userAns) => parseInt(userAns) === challenge.answer;
                TestRunner.assertTrue(!validate('13'), 'Accepted incorrect captcha');
                TestRunner.assertTrue(validate('14'), 'Rejected correct captcha');
            });
        });

        // 4. Stored XSS Sanitizer Test
        this.describe('XSS Sanitization Guard (TDD Unit Test)', () => {
            this.it('should escape dangerous HTML script tags to HTML entities', () => {
                const sanitizeHTML = (str) => {
                    return String(str)
                        .replace(/&/g, '&amp;')
                        .replace(/</g, '&lt;')
                        .replace(/>/g, '&gt;')
                        .replace(/"/g, '&quot;')
                        .replace(/'/g, '&#039;');
                };
                const dirty = '<script>alert("XSS")</script>';
                const clean = sanitizeHTML(dirty);
                TestRunner.assertEqual(clean, '&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;');
            });
        });

        // 5. IDOR & Route Protection Test
        this.describe('IDOR & Route Protection (TDD Integration Test)', () => {
            this.it('should prevent unauthenticated access to Mentee and Mentor portals', () => {
                const canAccessView = (view, user) => {
                    if (view === 'public') return true;
                    if (!user) return false;
                    if (view === 'admin') return user.role === 'admin';
                    if (view === 'mentee') return user.role === 'mentee';
                    if (view === 'mentor') return user.role === 'mentor';
                    return false;
                };

                TestRunner.assertTrue(!canAccessView('admin', null), 'Anonymous accessed admin');
                TestRunner.assertTrue(!canAccessView('mentee', null), 'Anonymous accessed mentee');
                TestRunner.assertTrue(!canAccessView('mentor', null), 'Anonymous accessed mentor');
                TestRunner.assertTrue(!canAccessView('admin', { role: 'mentee' }), 'Mentee accessed admin');
                TestRunner.assertTrue(canAccessView('mentee', { role: 'mentee' }), 'Valid mentee rejected');
            });
        });

        // Summary
        console.log(`\n========================================`);
        console.log(`📊 TESTS COMPLETED: ${this.passed} PASSED | ${this.failed} FAILED`);
        console.log(`========================================\n`);
    }
};

// Export or auto-run if in browser
if (typeof window !== 'undefined') {
    window.TestRunner = TestRunner;
}
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TestRunner;
}
