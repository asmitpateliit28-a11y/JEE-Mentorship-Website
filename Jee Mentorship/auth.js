/**
 * JEE Mentorship Platform - Authentication & Access Controls
 * Handles 2-Tier Login/Signup interfaces and exclusive Admin management security
 */

// ==========================================
// 1. ON-PAGE 2-TIER PORTAL SWITCHERS
// ==========================================

function switchMainPortalTab(mode) {
    const loginPanel = document.getElementById('portal-panel-login');
    const signupPanel = document.getElementById('portal-panel-signup');
    const tabLogin = document.getElementById('portal-tab-login');
    const tabSignup = document.getElementById('portal-tab-signup');

    if (mode === 'login') {
        if (loginPanel) loginPanel.classList.remove('hidden');
        if (signupPanel) signupPanel.classList.add('hidden');
        if (tabLogin) {
            tabLogin.className = 'py-2.5 rounded-xl text-xs sm:text-sm font-bold transition bg-white text-slate-900 shadow-sm flex items-center justify-center gap-2 border border-slate-200';
        }
        if (tabSignup) {
            tabSignup.className = 'py-2.5 rounded-xl text-xs sm:text-sm font-bold transition text-slate-400 hover:text-white flex items-center justify-center gap-2 border border-transparent';
        }
        switchPortalRole('mentee');
    } else {
        if (loginPanel) loginPanel.classList.add('hidden');
        if (signupPanel) signupPanel.classList.remove('hidden');
        if (tabLogin) {
            tabLogin.className = 'py-2.5 rounded-xl text-xs sm:text-sm font-bold transition text-slate-400 hover:text-white flex items-center justify-center gap-2 border border-transparent';
        }
        if (tabSignup) {
            tabSignup.className = 'py-2.5 rounded-xl text-xs sm:text-sm font-bold transition bg-white text-slate-900 shadow-sm flex items-center justify-center gap-2 border border-slate-200';
        }
        switchSignupRole('mentee');
    }
}

function switchPortalRole(role) {
    const menteeForm = document.getElementById('portal-form-mentee');
    const mentorForm = document.getElementById('portal-form-mentor');
    const btnMentee = document.getElementById('portal-role-btn-mentee');
    const btnMentor = document.getElementById('portal-role-btn-mentor');

    if (role === 'mentee') {
        if (menteeForm) menteeForm.classList.remove('hidden');
        if (mentorForm) mentorForm.classList.add('hidden');
        if (btnMentee) {
            btnMentee.className = 'p-3.5 rounded-2xl border-2 border-blue-500 bg-blue-950/40 text-left transition shadow-md flex items-center gap-3';
        }
        if (btnMentor) {
            btnMentor.className = 'p-3.5 rounded-2xl border-2 border-slate-700/80 bg-slate-800/40 text-left transition hover:border-slate-600 flex items-center gap-3';
        }
    } else {
        if (menteeForm) menteeForm.classList.add('hidden');
        if (mentorForm) mentorForm.classList.remove('hidden');
        if (btnMentee) {
            btnMentee.className = 'p-3.5 rounded-2xl border-2 border-slate-700/80 bg-slate-800/40 text-left transition hover:border-slate-600 flex items-center gap-3';
        }
        if (btnMentor) {
            btnMentor.className = 'p-3.5 rounded-2xl border-2 border-indigo-500 bg-indigo-950/40 text-left transition shadow-md flex items-center gap-3';
        }
    }
}

function switchSignupRole(role) {
    const signupMentee = document.getElementById('signup-card-mentee');
    const signupMentor = document.getElementById('signup-card-mentor');
    const btnMentee = document.getElementById('signup-role-btn-mentee');
    const btnMentor = document.getElementById('signup-role-btn-mentor');

    if (role === 'mentee') {
        if (signupMentee) signupMentee.classList.remove('hidden');
        if (signupMentor) signupMentor.classList.add('hidden');
        if (btnMentee) {
            btnMentee.className = 'p-3.5 rounded-2xl border-2 border-blue-500 bg-blue-950/40 text-left transition shadow-md flex items-center gap-3';
        }
        if (btnMentor) {
            btnMentor.className = 'p-3.5 rounded-2xl border-2 border-slate-700/80 bg-slate-800/40 text-left transition hover:border-slate-600 flex items-center gap-3';
        }
    } else {
        if (signupMentee) signupMentee.classList.add('hidden');
        if (signupMentor) signupMentor.classList.remove('hidden');
        if (btnMentee) {
            btnMentee.className = 'p-3.5 rounded-2xl border-2 border-slate-700/80 bg-slate-800/40 text-left transition hover:border-slate-600 flex items-center gap-3';
        }
        if (btnMentor) {
            btnMentor.className = 'p-3.5 rounded-2xl border-2 border-indigo-500 bg-indigo-950/40 text-left transition shadow-md flex items-center gap-3';
        }
    }
}

// ==========================================
// 2. MODAL 2-TIER GATEWAY SWITCHERS
// ==========================================

function switchModalMainTab(mode) {
    const loginRolesBar = document.getElementById('modal-login-roles-bar');
    const loginFormMentee = document.getElementById('modal-login-form-mentee');
    const loginFormMentor = document.getElementById('modal-login-form-mentor');
    const signupFormMentee = document.getElementById('modal-signup-form-mentee');
    const tabLogin = document.getElementById('modal-tab-login');
    const tabSignup = document.getElementById('modal-tab-signup');

    if (mode === 'login') {
        if (loginRolesBar) loginRolesBar.classList.remove('hidden');
        if (tabLogin) {
            tabLogin.className = 'py-2 rounded-xl bg-white text-slate-900 shadow-sm font-bold transition flex items-center justify-center gap-2 border border-slate-200';
        }
        if (tabSignup) {
            tabSignup.className = 'py-2 rounded-xl text-slate-500 hover:text-slate-800 font-semibold transition flex items-center justify-center gap-2';
        }
        if (signupFormMentee) signupFormMentee.classList.add('hidden');
        switchModalRole('mentee');
    } else {
        if (loginRolesBar) loginRolesBar.classList.add('hidden');
        if (tabLogin) {
            tabLogin.className = 'py-2 rounded-xl text-slate-500 hover:text-slate-800 font-semibold transition flex items-center justify-center gap-2';
        }
        if (tabSignup) {
            tabSignup.className = 'py-2 rounded-xl bg-white text-slate-900 shadow-sm font-bold transition flex items-center justify-center gap-2 border border-slate-200';
        }
        if (loginFormMentee) loginFormMentee.classList.add('hidden');
        if (loginFormMentor) loginFormMentor.classList.add('hidden');
        if (signupFormMentee) signupFormMentee.classList.remove('hidden');
    }
}

// ==========================================
// SECURITY & BRUTE-FORCE DEFENSE
// ==========================================
const SecurityGuard = {
    MAX_ATTEMPTS: 5,
    LOCKOUT_DURATION_MS: 5 * 60 * 1000, // 5 minutes
    SESSION_TIMEOUT_MS: 2 * 60 * 60 * 1000, // 2 hours

    getAttempts() {
        try {
            const raw = localStorage.getItem('jee_sec_lockout');
            return raw ? JSON.parse(raw) : { count: 0, lockedUntil: 0 };
        } catch (e) {
            return { count: 0, lockedUntil: 0 };
        }
    },

    recordFailed() {
        const data = this.getAttempts();
        data.count = (data.count || 0) + 1;
        if (data.count >= this.MAX_ATTEMPTS) {
            data.lockedUntil = Date.now() + this.LOCKOUT_DURATION_MS;
            this.recordSecurityEvent('Brute-Force Lockout Triggered', 'IP/Browser Client', 'BLOCKED', '5 consecutive failed attempts. System locked for 5 minutes.');
        } else {
            this.recordSecurityEvent('Failed Admin Authentication Attempt', 'Unknown Client', 'WARNING', `Failed attempt ${data.count} of ${this.MAX_ATTEMPTS}`);
        }
        localStorage.setItem('jee_sec_lockout', JSON.stringify(data));
        return data;
    },

    reset() {
        localStorage.removeItem('jee_sec_lockout');
    },

    isLocked() {
        const data = this.getAttempts();
        if (data.lockedUntil && Date.now() < data.lockedUntil) {
            const remainingSec = Math.ceil((data.lockedUntil - Date.now()) / 1000);
            return { locked: true, remainingSec: remainingSec, count: data.count || 0 };
        }
        if (data.lockedUntil && Date.now() >= data.lockedUntil) {
            this.reset();
        }
        return { locked: false, remainingSec: 0, count: data.count || 0 };
    },

    generateAdminSessionToken() {
        const token = 'SEC-ADM-' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) + '-' + Date.now();
        const sessionPayload = {
            token: token,
            role: 'admin',
            userId: 'ADMIN-ASMIT-01',
            createdAt: Date.now(),
            expiresAt: Date.now() + this.SESSION_TIMEOUT_MS
        };
        sessionStorage.setItem('jee_admin_token', JSON.stringify(sessionPayload));
        return token;
    },

    verifySessionToken() {
        try {
            const raw = sessionStorage.getItem('jee_admin_token');
            if (!raw) return false;
            const payload = JSON.parse(raw);
            if (!payload || !payload.token || !payload.expiresAt) return false;
            if (Date.now() > payload.expiresAt) {
                this.revokeAdminSessionToken();
                return false;
            }
            return true;
        } catch (e) {
            return false;
        }
    },

    revokeAdminSessionToken() {
        sessionStorage.removeItem('jee_admin_token');
    },

    recordSecurityEvent(event, user, status, details = '') {
        if (!state.accountant) state.accountant = { transactions: [], securityAuditLogs: [] };
        if (!state.accountant.securityAuditLogs) state.accountant.securityAuditLogs = [];

        const logEntry = {
            id: 'SEC-LOG-' + Date.now(),
            timestamp: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ' ' + new Date().toLocaleTimeString('en-GB'),
            event: event,
            user: user || 'Anonymous',
            origin: 'Campus / Secured Gateway',
            device: navigator.userAgent.includes('Windows') ? 'Windows Client' : 'Browser Client',
            status: status || 'INFO',
            details: details
        };

        state.accountant.securityAuditLogs.unshift(logEntry);
        if (state.accountant.securityAuditLogs.length > 50) {
            state.accountant.securityAuditLogs = state.accountant.securityAuditLogs.slice(0, 50);
        }
        saveToStorage();
    },

    sanitize(str) {
        if (!str) return '';
        return String(str).replace(/[<>]/g, '').trim();
    },

    escapeHTML(str) {
        if (str === null || str === undefined) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    },

    validateIndianPhone(phone) {
        if (!phone) return false;
        const cleaned = String(phone).replace(/[\s\-\(\)]/g, '').replace(/^(\+91|0)/, '');
        return /^[6-9]\d{9}$/.test(cleaned);
    },

    cleanIndianPhone(phone) {
        if (!phone) return '';
        const cleaned = String(phone).replace(/[\s\-\(\)]/g, '').replace(/^(\+91|0)/, '');
        return cleaned.length === 10 ? '+91 ' + cleaned : phone;
    },

    generateMenteeId() {
        const rand = Math.floor(10000 + Math.random() * 90000);
        let id = 'JEE-M-' + rand;
        if (state.mentees && state.mentees.some(m => m.id === id || m.student_id === id)) {
            id = 'JEE-M-' + Math.floor(10000 + Math.random() * 90000);
        }
        return id;
    },

    // Captcha Engine for Forms
    captchaChallenges: {},

    generateCaptcha(formKey) {
        const n1 = Math.floor(Math.random() * 8) + 2; // 2 to 9
        const n2 = Math.floor(Math.random() * 8) + 1; // 1 to 8
        const ans = n1 + n2;
        this.captchaChallenges[formKey] = ans;
        return {
            question: `${n1} + ${n2} = ?`,
            answer: ans
        };
    },

    validateCaptcha(formKey, userAnswer) {
        const expected = this.captchaChallenges[formKey];
        if (expected === undefined || expected === null) return false;
        return parseInt(userAnswer, 10) === expected;
    },

    refreshCaptcha(formKey) {
        const challenge = this.generateCaptcha(formKey);
        const el = document.getElementById(`${formKey}-captcha-question`);
        const inp = document.getElementById(`${formKey}-captcha-input`);
        if (el) el.innerText = challenge.question;
        if (inp) inp.value = '';
    },

    initCaptchas() {
        this.refreshCaptcha('contact');
        this.refreshCaptcha('signup');
    },

    // Mentee Session Guard
    generateMenteeSessionToken(menteeId) {
        const token = 'SEC-MNT-' + Math.random().toString(36).substring(2, 15) + '-' + Date.now();
        const payload = {
            token: token,
            role: 'mentee',
            userId: menteeId,
            expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
        };
        sessionStorage.setItem('jee_mentee_token', JSON.stringify(payload));
        return token;
    },

    verifyMenteeSession() {
        try {
            const raw = sessionStorage.getItem('jee_mentee_token');
            if (!raw) return false;
            const p = JSON.parse(raw);
            if (!p || !p.token || !p.expiresAt) return false;
            return Date.now() < p.expiresAt;
        } catch (e) {
            return false;
        }
    },

    revokeMenteeSession() {
        sessionStorage.removeItem('jee_mentee_token');
    }
};

function switchModalRole(role) {
    const formMentee = document.getElementById('modal-login-form-mentee');
    const formMentor = document.getElementById('modal-login-form-mentor');
    const formAdmin = document.getElementById('modal-login-form-admin');

    const roleMenteeBtn = document.getElementById('modal-role-mentee');
    const roleMentorBtn = document.getElementById('modal-role-mentor');
    const roleAdminBtn = document.getElementById('modal-role-admin');

    if (formMentee) formMentee.classList.add('hidden');
    if (formMentor) formMentor.classList.add('hidden');
    if (formAdmin) formAdmin.classList.add('hidden');

    const inactiveClass = 'py-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-white transition flex items-center justify-center gap-1.5 font-semibold';

    if (roleMenteeBtn) roleMenteeBtn.className = inactiveClass;
    if (roleMentorBtn) roleMentorBtn.className = inactiveClass;
    if (roleAdminBtn) roleAdminBtn.className = inactiveClass;

    if (role === 'mentee') {
        if (formMentee) formMentee.classList.remove('hidden');
        if (roleMenteeBtn) {
            roleMenteeBtn.className = 'py-2 rounded-lg bg-emerald-600 text-white shadow font-bold transition flex items-center justify-center gap-1.5';
        }
    } else if (role === 'mentor') {
        if (formMentor) formMentor.classList.remove('hidden');
        if (roleMentorBtn) {
            roleMentorBtn.className = 'py-2 rounded-lg bg-indigo-600 text-white shadow font-bold transition flex items-center justify-center gap-1.5';
        }
    } else if (role === 'admin') {
        if (formAdmin) formAdmin.classList.remove('hidden');
        if (roleAdminBtn) {
            roleAdminBtn.className = 'py-2 rounded-lg bg-slate-900 text-amber-300 shadow font-bold transition flex items-center justify-center gap-1.5';
        }

        // Live Lockout Status Check
        const lock = SecurityGuard.isLocked();
        const statusBox = document.getElementById('modal-admin-status-box');
        const statusText = document.getElementById('modal-admin-status-text');
        const submitBtn = document.getElementById('modal-admin-submit-btn');

        if (lock.locked) {
            if (statusBox) statusBox.className = 'p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-[11px] flex items-center gap-2';
            if (statusText) statusText.innerText = `SECURITY LOCKOUT: Too many attempts. Try again in ${lock.remainingSec}s.`;
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.classList.add('opacity-50', 'cursor-not-allowed');
            }
        } else {
            if (statusBox) statusBox.className = 'p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-600 text-[11px] flex items-center gap-2';
            if (statusText) statusText.innerText = lock.count > 0 ? `Attempts remaining: ${SecurityGuard.MAX_ATTEMPTS - lock.count} of ${SecurityGuard.MAX_ATTEMPTS}` : 'Brute-force protection enabled. Max 5 attempts.';
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.classList.remove('opacity-50', 'cursor-not-allowed');
            }
        }
    }
}

function switchModalSignupRole(role) {
    const signupMentee = document.getElementById('modal-signup-form-mentee');
    const signupMentor = document.getElementById('modal-signup-form-mentor');
    const btnMentee = document.getElementById('modal-signup-role-mentee');
    const btnMentor = document.getElementById('modal-signup-role-mentor');

    if (role === 'mentee') {
        if (signupMentee) signupMentee.classList.remove('hidden');
        if (signupMentor) signupMentor.classList.add('hidden');
        if (btnMentee) {
            btnMentee.className = 'py-2 rounded-lg bg-blue-600 text-white shadow font-bold transition flex items-center justify-center gap-1.5';
        }
        if (btnMentor) {
            btnMentor.className = 'py-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition flex items-center justify-center gap-1.5';
        }
    } else {
        if (signupMentee) signupMentee.classList.add('hidden');
        if (signupMentor) signupMentor.classList.remove('hidden');
        if (btnMentee) {
            btnMentee.className = 'py-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition flex items-center justify-center gap-1.5';
        }
        if (btnMentor) {
            btnMentor.className = 'py-2 rounded-lg bg-indigo-600 text-white shadow font-bold transition flex items-center justify-center gap-1.5';
        }
    }
}

function switchModalLoginTab(role) {
    switchModalMainTab('login');
    switchModalRole(role);
}

function openLoginModal(role = 'mentee') {
    switchModalMainTab('login');
    switchModalRole(role);
    const modal = document.getElementById('loginModal');
    if (modal) modal.classList.remove('hidden');
}

function closeLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) modal.classList.add('hidden');
}

// ==========================================
// 3. AUTHENTICATION & LOGIN PROCESSORS
// ==========================================

function handleFormLogin(e, role) {
    if (e) e.preventDefault();

    if (role === 'mentee') {
        const rawPhone = (document.getElementById('sec-mentee-phone')?.value || document.getElementById('modal-mentee-phone')?.value || '').trim();
        const identifier = SecurityGuard.sanitize(rawPhone);
        const pass = (document.getElementById('modal-mentee-pass')?.value || '').trim();

        if (state.mentees.length === 0) {
            const starterMentee = {
                id: 'JEE-2025-0101',
                name: 'Rahul Sharma',
                phone: identifier || '+91 9876543210',
                email: 'rahul@example.com',
                password: pass || '1234',
                classLevel: 'Class 12',
                target: 'JEE Advanced 2027',
                plan: '6-Month Intensive Mentorship',
                feeStatus: 'Paid',
                amount: '2,500',
                targets: [
                    { id: 1, text: 'Physics: Solve 25 PYQs from Rotational Motion & Moments', done: true },
                    { id: 2, text: 'Chemistry: Revise GOC reaction mechanisms & acidity orders', done: true },
                    { id: 3, text: 'Maths: Complete 1-hour Definite Integration numerical drill', done: false },
                    { id: 4, text: 'Analysis: Review weekly mock test error log and revise weak formulas', done: false }
                ]
            };
            state.mentees.push(starterMentee);
            saveToStorage();
        }

        const cleanPhone = identifier.replace(/[^0-9]/g, '');
        const matchedMentee = state.mentees.find(m => {
            if (m.id && m.id.toLowerCase() === identifier.toLowerCase()) return true;
            if (m.email && m.email.toLowerCase() === identifier.toLowerCase()) return true;
            const mClean = (m.phone || '').replace(/[^0-9]/g, '');
            if (cleanPhone && mClean && (mClean.includes(cleanPhone) || cleanPhone.includes(mClean))) return true;
            return false;
        }) || state.mentees[0];

        state.currentUser = {
            role: 'mentee',
            ...matchedMentee
        };
        updateSessionUI();
        renderMenteePortal();
        closeLoginModal();
        switchView('mentee');
        showToast(`Welcome back, ${state.currentUser.name}! Mentee workspace active.`);
    } else if (role === 'mentor') {
        if (state.mentors.length === 0) {
            alert('No mentors onboarded yet. Please contact management or add mentors via the admin console.');
            return;
        }
        const mentorSelectVal = document.getElementById('sec-mentor-profile-select')?.value || document.getElementById('modal-mentor-profile-select')?.value;
        const mentorObj = state.mentors.find(m => m.id == mentorSelectVal) || state.mentors[0];
        state.currentUser = {
            role: 'mentor',
            id: mentorObj.id,
            name: mentorObj.name,
            college: mentorObj.college,
            branch: mentorObj.branch,
            rank: mentorObj.rank,
            whatsapp: mentorObj.whatsapp,
            photoUrl: mentorObj.photoUrl
        };
        updateSessionUI();
        renderMentorPortal();
        closeLoginModal();
        switchView('mentor');
        showToast(`Welcome, ${mentorObj.name}! Signed in as Mentor.`);
    } else if (role === 'admin') {
        const lock = SecurityGuard.isLocked();
        if (lock.locked) {
            alert(`Access temporarily locked due to repeated failed attempts. Please wait ${lock.remainingSec} seconds before trying again.`);
            return;
        }

        const identifier = SecurityGuard.sanitize(document.getElementById('modal-admin-identifier')?.value || '');
        const pass = (document.getElementById('modal-admin-pass')?.value || '').trim();

        if (!identifier || !pass) {
            alert('Please enter your Admin ID / Email / Phone and Master Password.');
            return;
        }

        const cleanInp = identifier.replace(/[^0-9]/g, '');
        const adminPhone = (state.adminProfile?.phone || '+91 9450287685').replace(/[^0-9]/g, '');
        const adminEmail = (state.adminProfile?.email || 'asmit@jeecircle.in').toLowerCase();
        const expectedPass = state.adminProfile?.password || 'asmit2024';

        const idMatches = (
            identifier.toUpperCase() === 'ADMIN-ASMIT-01' ||
            identifier.toUpperCase() === 'ADMIN' ||
            identifier.toUpperCase() === 'ASMIT' ||
            identifier.toLowerCase() === adminEmail ||
            identifier.toLowerCase() === 'contact@jeecircle.in' ||
            (cleanInp.length >= 8 && adminPhone.includes(cleanInp))
        );

        if (idMatches && pass === expectedPass) {
            SecurityGuard.reset();
            SecurityGuard.generateAdminSessionToken();
            SecurityGuard.recordSecurityEvent('Admin Authenticated & Session Token Granted', 'Asmit Patel (ADMIN-ASMIT-01)', 'AUTHORIZED', 'Login via Master Credentials');
            state.currentUser = {
                role: 'admin',
                id: 'ADMIN-ASMIT-01',
                name: state.adminProfile?.name || 'Asmit Patel',
                email: state.adminProfile?.email || 'asmit@jeecircle.in',
                phone: state.adminProfile?.phone || '+91 9450287685',
                college: state.adminProfile?.college || 'IIT (BHU) Varanasi',
                branch: state.adminProfile?.branch || 'Civil Engineering (Batch 2024)'
            };
            updateSessionUI();
            renderAdminDashboard();
            closeLoginModal();
            switchView('admin');
            showToast(`Admin Console Unlocked! Welcome, ${state.currentUser.name}.`);
        } else {
            const data = SecurityGuard.recordFailed();
            const attemptsLeft = SecurityGuard.MAX_ATTEMPTS - data.count;
            if (data.count >= SecurityGuard.MAX_ATTEMPTS) {
                alert('Security Lockout Triggered: 5 failed attempts reached. System locked for 5 minutes.');
            } else {
                alert(`Authentication failed! Incorrect credentials.\nWarning: ${attemptsLeft} attempt(s) remaining before security lockout.`);
            }
            switchModalRole('admin');
        }
    }
}

function quickFillAndLogin(role) {
    handleFormLogin(null, role);
}

function handleLogout() {
    SecurityGuard.revokeAdminSessionToken();
    SecurityGuard.recordSecurityEvent('Session Terminated / Logout', state.currentUser?.name || 'User', 'INFO', 'User clicked logout');
    state.currentUser = null;
    updateSessionUI();
    switchView('public');
    showToast('Signed out successfully.');
}

function updateSessionUI() {
    const loginBtn = document.getElementById('header-login-btn');
    const sessionPill = document.getElementById('user-session-pill');
    const roleBadge = document.getElementById('session-role-badge');
    const userName = document.getElementById('session-user-name');

    if (state.currentUser) {
        if (loginBtn) loginBtn.classList.add('hidden');
        if (sessionPill) {
            sessionPill.classList.remove('hidden');
            sessionPill.classList.add('flex');
        }

        if (state.currentUser.role === 'mentee') {
            if (roleBadge) {
                roleBadge.className = 'px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300';
                roleBadge.innerText = 'Mentee';
            }
            if (userName) userName.innerText = state.currentUser.name;
        } else if (state.currentUser.role === 'mentor') {
            if (roleBadge) {
                roleBadge.className = 'px-2 py-0.5 rounded-full text-[10px] font-bold bg-stone-200 text-stone-800 border border-stone-300';
                roleBadge.innerText = 'Mentor';
            }
            if (userName) userName.innerText = state.currentUser.name;
        } else if (state.currentUser.role === 'admin') {
            if (roleBadge) {
                roleBadge.className = 'px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950';
                roleBadge.innerText = 'Admin';
            }
            if (userName) userName.innerText = state.currentUser.name || 'Asmit Patel';
        }
    } else {
        if (loginBtn) loginBtn.classList.remove('hidden');
        if (sessionPill) {
            sessionPill.classList.add('hidden');
            sessionPill.classList.remove('flex');
        }
    }
}

// ==========================================
// 4. ADMIN & MANAGEMENT SECURE ACCESS
// ==========================================

function handleFounderAccessClick() {
    const modal = document.getElementById('founderAccessModal');
    if (!modal) return;

    const setupMode = document.getElementById('founder-setup-mode');
    const loginMode = document.getElementById('founder-login-mode');
    const titleEl = document.getElementById('founder-modal-title');

    if (!state.adminProfile) {
        // First-time Setup
        if (setupMode) setupMode.classList.remove('hidden');
        if (loginMode) loginMode.classList.add('hidden');
        if (titleEl) titleEl.innerText = 'Admin Profile Setup';
        const nameInp = document.getElementById('setup-admin-name');
        const phoneInp = document.getElementById('setup-admin-phone');
        const emailInp = document.getElementById('setup-admin-email');
        if (nameInp) nameInp.value = 'Asmit Patel';
        if (phoneInp) phoneInp.value = '+91 9450287685';
        if (emailInp) emailInp.value = 'asmit@jeecircle.in';
    } else {
        // Returning Sign In
        if (setupMode) setupMode.classList.add('hidden');
        if (loginMode) loginMode.classList.remove('hidden');
        if (titleEl) titleEl.innerText = `Admin Sign In — ${state.adminProfile.name || 'Asmit Patel'}`;
        const passInp = document.getElementById('founder-login-password');
        if (passInp) passInp.value = '';
    }

    modal.classList.remove('hidden');
}

function closeFounderAccessModal() {
    const modal = document.getElementById('founderAccessModal');
    if (modal) modal.classList.add('hidden');
}

function handleFounderSetupSubmit(e) {
    if (e) e.preventDefault();
    const name = document.getElementById('setup-admin-name')?.value.trim() || 'Asmit Patel';
    const phone = document.getElementById('setup-admin-phone')?.value.trim() || '+91 9450287685';
    const email = document.getElementById('setup-admin-email')?.value.trim() || 'asmit@jeecircle.in';
    const pass = document.getElementById('setup-admin-password')?.value;
    const confirmPass = document.getElementById('setup-admin-confirm-password')?.value;

    if (!pass || pass.length < 4) {
        alert('Please choose a secure master password of at least 4 characters.');
        return;
    }

    if (pass !== confirmPass) {
        alert('Passwords do not match! Please re-enter your password.');
        return;
    }

    state.adminProfile = {
        name,
        phone,
        email,
        password: pass,
        role: 'Administrator',
        createdAt: new Date().toISOString()
    };

    saveToStorage();

    state.currentUser = {
        role: 'admin',
        name: state.adminProfile.name,
        email: state.adminProfile.email,
        phone: state.adminProfile.phone
    };

    updateSessionUI();
    renderAdminDashboard();
    closeFounderAccessModal();
    switchView('admin');
    showToast(`Profile configured successfully! Welcome, ${name}.`);
}

function handleFounderLoginSubmit(e) {
    if (e) e.preventDefault();
    const pass = document.getElementById('founder-login-password')?.value;
    const expectedPass = state.adminProfile?.password || 'adminmaster2026';

    if (pass === expectedPass) {
        state.currentUser = {
            role: 'admin',
            name: state.adminProfile?.name || 'Asmit Patel',
            email: state.adminProfile?.email || 'asmit@jeecircle.in',
            phone: state.adminProfile?.phone || '+91 9450287685'
        };
        updateSessionUI();
        renderAdminDashboard();
        closeFounderAccessModal();
        switchView('admin');
        showToast(`Welcome back, ${state.currentUser.name}! Control console ready.`);
    } else {
        alert('Incorrect master password! Click "Forgot Password?" to reset using your phone number.');
    }
}

function handleFounderResetPrompt() {
    const enteredPhone = prompt('Enter your registered administrator phone (+91 9450287685):');
    if (!enteredPhone) return;

    const cleanEntered = enteredPhone.replace(/[^0-9]/g, '');
    const cleanSaved = (state.adminProfile?.phone || '9450287685').replace(/[^0-9]/g, '');

    if (cleanEntered.includes(cleanSaved) || cleanSaved.includes(cleanEntered)) {
        const newPass = prompt('Identity verified! Enter new master password:');
        if (newPass && newPass.length >= 4) {
            if (!state.adminProfile) {
                state.adminProfile = { name: 'Asmit Patel', phone: '+91 9450287685', email: 'asmit@jeecircle.in' };
            }
            state.adminProfile.password = newPass;
            saveToStorage();
            alert('Password updated successfully! You can now log in.');
        } else if (newPass) {
            alert('Password must be at least 4 characters.');
        }
    } else {
        alert('Phone number did not match registered administrator profile.');
    }
}

let currentPhotoUpload = '';

function handleFounderPhotoFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
        alert('Please choose an image under 2MB.');
        return;
    }
    const reader = new FileReader();
    reader.onload = function(evt) {
        currentPhotoUpload = evt.target.result;
        updateFounderPhotoPreview(currentPhotoUpload);
    };
    reader.readAsDataURL(file);
}

function handleFounderPhotoUrlInput(url) {
    currentPhotoUpload = (url || '').trim();
    updateFounderPhotoPreview(currentPhotoUpload);
}

function clearFounderPhoto() {
    currentPhotoUpload = '';
    const fileInp = document.getElementById('edit-founder-photo-file');
    const urlInp = document.getElementById('edit-founder-photo-url');
    if (fileInp) fileInp.value = '';
    if (urlInp) urlInp.value = '';
    updateFounderPhotoPreview('');
}

function updateFounderPhotoPreview(photoUrl) {
    const preview = document.getElementById('founder-photo-preview');
    if (preview) {
        if (photoUrl) {
            preview.innerHTML = `<img src="${photoUrl}" alt="Asmit Patel" class="w-full h-full object-cover">`;
        } else {
            preview.innerHTML = 'AP';
        }
    }
}

function updateAvatarDisplays(photoUrl) {
    const photo = photoUrl || state.adminProfile?.photoUrl || '';
    ['contact-asmit-avatar', 'hero-asmit-avatar', 'admin-banner-avatar'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            if (photo) {
                el.innerHTML = `<img src="${photo}" alt="Asmit Patel" class="w-full h-full object-cover">`;
            } else {
                el.innerHTML = 'AP';
            }
        }
    });
}

function openEditFounderProfileModal() {
    const modal = document.getElementById('founderEditProfileModal');
    if (!modal) return;
    const nameInp = document.getElementById('edit-founder-name');
    const phoneInp = document.getElementById('edit-founder-phone');
    const emailInp = document.getElementById('edit-founder-email');
    const collegeInp = document.getElementById('edit-founder-college');
    const branchInp = document.getElementById('edit-founder-branch');
    const passInp = document.getElementById('edit-founder-password');
    const urlInp = document.getElementById('edit-founder-photo-url');

    const profile = state.adminProfile || {};
    if (nameInp) nameInp.value = profile.name || 'Asmit Patel';
    if (phoneInp) phoneInp.value = profile.phone || '+91 9450287685';
    if (emailInp) emailInp.value = profile.email || 'asmit@jeecircle.in';
    if (collegeInp) collegeInp.value = profile.college || 'IIT (BHU) Varanasi';
    if (branchInp) branchInp.value = profile.branch || 'Civil Engineering (Batch 2024)';
    if (passInp) passInp.value = '';

    currentPhotoUpload = profile.photoUrl || '';
    if (urlInp) urlInp.value = currentPhotoUpload.startsWith('http') ? currentPhotoUpload : '';
    updateFounderPhotoPreview(currentPhotoUpload);

    modal.classList.remove('hidden');
}

function closeEditFounderProfileModal() {
    const modal = document.getElementById('founderEditProfileModal');
    if (modal) modal.classList.add('hidden');
}

function handleEditFounderProfileSubmit(e) {
    if (e) e.preventDefault();
    const name = document.getElementById('edit-founder-name')?.value.trim() || 'Asmit Patel';
    const phone = document.getElementById('edit-founder-phone')?.value.trim() || '+91 9450287685';
    const email = document.getElementById('edit-founder-email')?.value.trim() || 'asmit@jeecircle.in';
    const college = document.getElementById('edit-founder-college')?.value.trim() || 'IIT (BHU) Varanasi';
    const branch = document.getElementById('edit-founder-branch')?.value.trim() || 'Civil Engineering (Batch 2024)';
    const newPass = document.getElementById('edit-founder-password')?.value;

    if (!name || !phone || !email) {
        alert('Please fill out Name, Phone, and Email.');
        return;
    }

    if (!state.adminProfile) {
        state.adminProfile = { role: 'Administrator', createdAt: new Date().toISOString() };
    }

    state.adminProfile.name = name;
    state.adminProfile.phone = phone;
    state.adminProfile.email = email;
    state.adminProfile.college = college;
    state.adminProfile.branch = branch;
    state.adminProfile.photoUrl = currentPhotoUpload;

    if (newPass && newPass.trim().length >= 4) {
        state.adminProfile.password = newPass.trim();
    }

    // Sync with Asmit Patel's mentor profile
    const asmitMentor = state.mentors.find(m => m.id === 'MENTOR-BHU-01' || m.name.includes('Asmit'));
    if (asmitMentor) {
        asmitMentor.name = name;
        asmitMentor.college = college;
        asmitMentor.branch = branch;
        asmitMentor.whatsapp = phone;
        asmitMentor.photoUrl = currentPhotoUpload;
    }

    saveToStorage();

    if (state.currentUser && state.currentUser.role === 'admin') {
        state.currentUser.name = name;
        state.currentUser.phone = phone;
        state.currentUser.email = email;
    }

    updateAvatarDisplays(currentPhotoUpload);
    updateSessionUI();
    renderAdminDashboard();
    renderPublicMentors();
    closeEditFounderProfileModal();
    showToast('Founder profile, photo, and mentor listings updated successfully!');
}

// Student Mentee Instant Sign Up Handler - Directly Sends Data to Admin
function handleMenteeSignUpSubmit(e) {
    if (e) e.preventDefault();
    const name = document.getElementById('signup-mentee-name')?.value.trim();
    const phone = document.getElementById('signup-mentee-phone')?.value.trim();
    const classLevel = document.getElementById('signup-mentee-class')?.value || 'Class 12';
    const target = document.getElementById('signup-mentee-target')?.value || 'JEE 2027';
    const pass = document.getElementById('signup-mentee-pass')?.value || '1234';
    const captchaAns = document.getElementById('signup-captcha-input')?.value.trim();

    if (!name || !phone) {
        alert('Please enter student name and WhatsApp number.');
        return;
    }

    // Captcha Validation
    if (typeof SecurityGuard !== 'undefined' && !SecurityGuard.validateCaptcha('signup', captchaAns)) {
        alert('Incorrect security captcha answer. Please solve the math verification to sign up.');
        SecurityGuard.refreshCaptcha('signup');
        return;
    }

    // Phone Validation
    if (typeof SecurityGuard !== 'undefined' && !SecurityGuard.validateIndianPhone(phone)) {
        alert('Please enter a valid 10-digit Indian WhatsApp mobile number (e.g. 9876543210).');
        return;
    }
    const cleanPhone = typeof SecurityGuard !== 'undefined' ? SecurityGuard.cleanIndianPhone(phone) : phone;

    const menteeId = typeof SecurityGuard !== 'undefined' ? SecurityGuard.generateMenteeId() : ('JEE-M-' + Math.floor(10000 + Math.random() * 90000));
    const dateStr = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

    const newMentee = {
        id: menteeId,
        student_id: menteeId,
        name: name,
        phone: cleanPhone,
        password: pass,
        classLevel: classLevel,
        target: target,
        planName: '1-on-1 Mentorship (Registered)',
        feePaid: 0,
        assignedMentorId: 'PENDING_ADMIN_ALLOCATION',
        assignedMentorName: 'Under Review by Asmit Patel [IIT (BHU) Varanasi · Civil 2024]',
        date: dateStr,
        status: 'New Signup (Pending Admin Evaluation)'
    };

    state.mentees.unshift(newMentee);

    // Forward immediately to Admin Inquiries list as high-priority notification
    const inquiryMsg = `New Student Registration. Student ID: ${menteeId} | Mentor Status: Awaiting Admin Allocation | Class: ${classLevel} | Target: ${target}. Phone: ${cleanPhone}`;
    state.inquiries.unshift({
        id: Date.now(),
        name: name,
        phone: cleanPhone,
        target: `${target} (${classLevel})`,
        message: inquiryMsg,
        date: dateStr,
        type: 'New Mentee Registration',
        status: 'New Signup'
    });

    saveToStorage();
    renderAdminDashboard();

    // Dual-sync to Supabase Database
    if (typeof SupabaseDB !== 'undefined') {
        SupabaseDB.saveMentee({
            student_id: menteeId,
            name: name,
            phone: cleanPhone,
            class_level: classLevel,
            target_exam: target,
            plan_name: '1-on-1 Mentorship (Registered)',
            fee_paid: 0,
            fee_status: 'Pending Evaluation',
            date_of_joining: dateStr,
            assigned_mentor_id: 'PENDING_ADMIN_ALLOCATION',
            assigned_mentor_name: 'Under Review by Asmit Patel [IIT (BHU) Varanasi]',
            status: 'New Signup (Pending Admin Evaluation)'
        }).then(res => {
            if (res && res.success) console.log('✓ [Supabase] New mentee synced:', res.data);
        }).catch(err => console.warn('[Supabase Sync Error]', err));

        SupabaseDB.saveInquiry({
            name: name,
            phone: cleanPhone,
            target_exam: `${target} (${classLevel})`,
            message: inquiryMsg,
            status: 'New Mentee Registration',
            source: 'Portal Student Sign-Up'
        });
    }

    // Auto-login as mentee with session token
    state.currentUser = {
        role: 'mentee',
        id: menteeId,
        student_id: menteeId,
        name: name,
        phone: cleanPhone,
        assignedMentorName: newMentee.assignedMentorName
    };

    if (typeof SecurityGuard !== 'undefined') {
        SecurityGuard.generateMenteeSessionToken(menteeId);
        SecurityGuard.recordSecurityEvent(`New Mentee Registration: ${name}`, name, 'SUCCESS', `Student ID: ${menteeId}, Phone: ${cleanPhone}`);
        SecurityGuard.refreshCaptcha('signup');
    }

    updateSessionUI();
    renderMenteePortal();
    closeLoginModal();
    switchView('mentee');

    alert(`🎉 Account Created Successfully, ${name}!\n\n📌 Your Official Mentee ID is: ${menteeId}\n👨‍🏫 Assigned Mentor Status: Under Review by Asmit Patel [IIT (BHU) Varanasi]\n\nYour profile has been transmitted to Lead Admin console.`);
}
