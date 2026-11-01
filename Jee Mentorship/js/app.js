/**
 * JEE Mentorship Platform - Main Application Initialization & Public Controllers
 * Manages view switching, public mentor grids, pricing cards, reviews, inquiries, and theme engine
 */

// ==========================================
// 1. APPLICATION BOOTSTRAP
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    if (typeof SecurityGuard !== 'undefined' && SecurityGuard.initCaptchas) {
        SecurityGuard.initCaptchas();
    }
    if (typeof updateAvatarDisplays === 'function') updateAvatarDisplays();
    renderPublicMentors();
    renderFeeStructure();
    renderPublicReviews();
    renderAdminDashboard();
    renderMenteePortal();
    renderMentorPortal();
    populateMentorDropdowns();
    initChart();
    updateSessionUI();

    // Global ESC key listener to close modals
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeApplyModal();
            closeLoginModal();
            if (typeof closeBroadcastModal === 'function') closeBroadcastModal();
            if (typeof closeAddMentorModal === 'function') closeAddMentorModal();
            if (typeof closeFounderAccessModal === 'function') closeFounderAccessModal();
            if (typeof closeEditFounderProfileModal === 'function') closeEditFounderProfileModal();
        }
    });

    // Secret shortcut: Ctrl + Shift + A unlocks Management Console
    window.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
            e.preventDefault();
            handleFounderAccessClick();
        }
    });

    // URL Hash trigger: e.g. #admin
    if (window.location.hash === '#admin') {
        handleFounderAccessClick();
    }

    // Scroll to Top Listener
    const backToTopBtn = document.getElementById('back-to-top-btn');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopBtn.classList.remove('opacity-0', 'pointer-events-none');
                backToTopBtn.classList.add('opacity-100');
            } else {
                backToTopBtn.classList.add('opacity-0', 'pointer-events-none');
                backToTopBtn.classList.remove('opacity-100');
            }
        });
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});

// Modal Backdrop Click Handler (Instant Close on outside click)
function handleModalBackdropClick(e, modalId) {
    if (e.target && e.target.id === modalId) {
        if (modalId === 'applyModal') closeApplyModal();
        else if (modalId === 'loginModal') closeLoginModal();
        else {
            const m = document.getElementById(modalId);
            if (m) m.classList.add('hidden');
        }
    }
}

// ==========================================
// 2. THEME ENGINE & DISPLAY PREFERENCES (Light, Flux, Dark)
// ==========================================

function initTheme() {
    const savedTheme = localStorage.getItem('jee_site_theme') || 'light';
    setSiteTheme(savedTheme, false);
}

function setSiteTheme(themeName, save = true) {
    if (!['light', 'flux', 'dark'].includes(themeName)) themeName = 'light';
    document.documentElement.setAttribute('data-theme', themeName);
    document.body.setAttribute('data-theme', themeName);

    if (save) {
        localStorage.setItem('jee_site_theme', themeName);
    }
    updateThemeUI(themeName);
}

function updateThemeUI(themeName) {
    // Update active highlight on all theme buttons (both in portals and header)
    document.querySelectorAll('[data-theme-btn]').forEach(btn => {
        const t = btn.getAttribute('data-theme-btn');
        if (t === themeName) {
            btn.classList.add('ring-2', 'ring-amber-500', 'font-bold', 'scale-105');
            btn.classList.remove('opacity-60');
        } else {
            btn.classList.remove('ring-2', 'ring-amber-500', 'font-bold', 'scale-105');
            btn.classList.add('opacity-60');
        }
    });

    // Update global navbar theme button
    const themeIcon = document.getElementById('navbar-theme-icon');
    const themeLabel = document.getElementById('navbar-theme-label');
    const sessionThemeText = document.getElementById('session-theme-text');

    if (themeIcon) {
        if (themeName === 'flux') themeIcon.className = 'fa-solid fa-fire-flame-curved text-amber-600 text-xs';
        else if (themeName === 'dark') themeIcon.className = 'fa-solid fa-moon text-indigo-400 text-xs';
        else themeIcon.className = 'fa-solid fa-sun text-amber-500 text-xs';
    }
    if (themeLabel) {
        if (themeName === 'flux') themeLabel.innerText = 'Flux Mode';
        else if (themeName === 'dark') themeLabel.innerText = 'Dark Mode';
        else themeLabel.innerText = 'Light Mode';
    }
    if (sessionThemeText) {
        sessionThemeText.innerText = themeName === 'flux' ? 'Flux' : (themeName === 'dark' ? 'Dark' : 'Light');
    }
}

function cycleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next = current === 'light' ? 'flux' : (current === 'flux' ? 'dark' : 'light');
    setSiteTheme(next);
}

// ==========================================
// 3. VIEW SWITCHING & NAVIGATION
// ==========================================

function switchView(viewName) {
    // 1. Advanced Security Guard: Admin view is protected with Cryptographic Token & Credentials
    if (viewName === 'admin') {
        const isAuth = state.currentUser && state.currentUser.role === 'admin';
        const hasValidToken = typeof SecurityGuard !== 'undefined' && SecurityGuard.verifySessionToken();

        if (!isAuth || !hasValidToken) {
            if (typeof SecurityGuard !== 'undefined') {
                SecurityGuard.recordSecurityEvent('Admin Route Direct Intrusion Blocked', 'Anonymous Intrusion Attempt', 'BLOCKED', 'Attempted unauthorized navigation to view-admin without active token');
            }
            alert('SECURITY RESTRICTION: Admin Control Room is encrypted and protected. Please authenticate with Admin ID and Master Password.');
            openLoginModal('admin');
            return;
        }
    }

    // 2. Mentee Route Guard: Protects against IDOR & unauthorized viewing (Fixes VULN-03)
    if (viewName === 'mentee') {
        const isMentee = state.currentUser && (state.currentUser.role === 'mentee' || state.currentUser.role === 'admin');
        if (!isMentee) {
            showToast('Access Restricted: Please login to your Mentee Student Account.');
            openLoginModal('mentee');
            return;
        }
    }

    // 3. Mentor Route Guard: Protects against unauthorized mentor dashboard access
    if (viewName === 'mentor') {
        const isMentor = state.currentUser && (state.currentUser.role === 'mentor' || state.currentUser.role === 'admin');
        if (!isMentor) {
            showToast('Access Restricted: Please login with your Verified Mentor credentials.');
            openLoginModal('mentor');
            return;
        }
    }

    state.activeView = viewName;

    ['public', 'admin', 'mentee', 'mentor'].forEach(v => {
        const el = document.getElementById(`view-${v}`);
        if (el) el.classList.add('hidden');
        const btn = document.getElementById(`btn-view-${v}`);
        if (btn) {
            btn.classList.remove('bg-amber-600', 'text-white');
            btn.classList.add('bg-stone-100', 'text-stone-700');
        }
    });

    const activeEl = document.getElementById(`view-${viewName}`);
    if (activeEl) activeEl.classList.remove('hidden');

    const activeBtn = document.getElementById(`btn-view-${viewName}`);
    if (activeBtn) {
        activeBtn.classList.add('bg-amber-600', 'text-white');
        activeBtn.classList.remove('bg-stone-100', 'text-stone-700');
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function handleLogoClick() {
    switchView('public');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Helper to open apply modal with target batch pre-selected
function openApplyModalWithBatch(batchYear) {
    openApplyModal('', '', batchYear);
}

// ==========================================
// 4. PUBLIC MENTOR LIST & FILTERS
// ==========================================

function renderPublicMentors() {
    const grid = document.getElementById('mentors-grid');
    if (!grid) return;
    grid.innerHTML = '';

    // Populate College Filter Dropdown
    const collegeSelect = document.getElementById('college-filter');
    if (collegeSelect) {
        const currentVal = collegeSelect.value || 'ALL';
        const defaultColleges = ['IIT BHU Varanasi', 'IIT Bombay', 'IIT Delhi', 'IIT Madras', 'IIT Kanpur', 'IIT Kharagpur', 'IIT Roorkee'];
        const dynamicColleges = Array.from(new Set([...defaultColleges, ...state.mentors.map(m => m.college).filter(Boolean)]));
        collegeSelect.innerHTML = '<option value="ALL">All Institutes</option>' +
            dynamicColleges.map(c => `<option value="${c}" ${c === currentVal ? 'selected' : ''}>${c}</option>`).join('');
    }

    if (state.mentors.length === 0) {
        grid.innerHTML = `
            <div class="col-span-full bg-white border border-stone-200 rounded-3xl p-10 sm:p-14 text-center space-y-4 shadow-sm">
                <div class="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 mx-auto flex items-center justify-center text-2xl shadow-sm">
                    <i class="fa-solid fa-chalkboard-user"></i>
                </div>
                <div>
                    <h3 class="text-xl font-extrabold text-slate-800">No Mentors Listed Yet</h3>
                    <p class="text-xs text-slate-500 max-w-md mx-auto mt-1">
                        IITian mentors are vetted and allocated directly under the supervision of Founder Asmit Patel (IIT BHU Varanasi).
                    </p>
                </div>
            </div>
        `;
        return;
    }

    state.mentors.forEach(m => {
        grid.appendChild(createMentorCardElement(m));
    });
}

function createMentorCardElement(m) {
    const card = document.createElement('div');
    card.className = 'bg-white rounded-2xl p-6 border border-stone-200/90 shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between hover-lift';
    const initials = m.name ? m.name.trim().split(/\s+/).map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'M';
    const photo = m.photoUrl || (m.name.includes('Asmit') ? state.adminProfile?.photoUrl : '');

    card.innerHTML = `
        <div class="space-y-3">
            <div class="flex items-start justify-between">
                <div class="flex items-center gap-3">
                    <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-600 to-stone-800 text-white font-extrabold flex items-center justify-center text-base shadow-sm overflow-hidden flex-shrink-0">
                        ${photo ? `<img src="${photo}" alt="${m.name}" class="w-full h-full object-cover">` : initials}
                    </div>
                    <div>
                        <h3 class="font-bold text-slate-900 text-base leading-tight">${m.name}</h3>
                        <p class="text-xs text-amber-700 font-semibold">${m.college}</p>
                    </div>
                </div>
                <span class="bg-amber-50 text-amber-800 font-bold text-[11px] px-2.5 py-1 rounded-full border border-amber-200">
                    ${m.rank}
                </span>
            </div>

            <p class="text-xs text-slate-600 leading-relaxed">${m.bio || 'Dedicated IITian mentor helping JEE aspirants build conceptual clarity and exam temperament.'}</p>

            <div class="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-stone-100">
                <span class="font-semibold text-slate-700">
                    ${m.branch || 'Engineering'}
                </span>
                <span class="flex items-center gap-1 text-amber-600 font-bold">
                    ★ ${m.rating || 5.0} (${m.activeMentees || m.menteesCount || 10}+ mentees)
                </span>
            </div>
        </div>

        <div class="pt-2">
            <button onclick="openApplyModal('${m.id}')" class="w-full py-2.5 bg-slate-900 hover:bg-amber-600 text-white font-bold text-xs rounded-full transition flex items-center justify-center gap-2 shadow-sm">
                <span>Select Mentor & Apply</span>
                <i class="fa-solid fa-arrow-right text-[10px]"></i>
            </button>
        </div>
    `;
    return card;
}

function filterMentors() {
    const searchVal = document.getElementById('mentor-search')?.value.toLowerCase() || '';
    const collegeVal = document.getElementById('college-filter')?.value || 'ALL';

    const filtered = state.mentors.filter(m => {
        const matchesSearch = (m.name && m.name.toLowerCase().includes(searchVal)) ||
            (m.branch && m.branch.toLowerCase().includes(searchVal)) ||
            (m.rank && m.rank.toLowerCase().includes(searchVal));
        const matchesCollege = collegeVal === 'ALL' || m.college.toLowerCase().includes(collegeVal.toLowerCase());
        return matchesSearch && matchesCollege;
    });

    const grid = document.getElementById('mentors-grid');
    if (!grid) return;
    grid.innerHTML = '';
    if (filtered.length === 0) {
        grid.innerHTML = `<div class="col-span-full text-center py-10 text-slate-400 text-xs">No mentors found matching your filter criteria.</div>`;
        return;
    }

    filtered.forEach(m => {
        grid.appendChild(createMentorCardElement(m));
    });
}

// ==========================================
// 5. PUBLIC FEE STRUCTURE
// ==========================================

function renderFeeStructure() {
    const container = document.getElementById('fee-cards-container');
    if (!container) return;
    container.innerHTML = '';

    state.plans.forEach(plan => {
        const card = document.createElement('div');
        const isPopular = plan.popular;

        card.className = `rounded-3xl p-6 sm:p-8 ${
            isPopular 
                ? 'bg-[#1E1A17] text-white border-2 border-amber-500/90 relative shadow-xl scale-100 lg:scale-105' 
                : 'bg-white text-slate-900 border border-stone-200/90 shadow-sm'
        } space-y-6 flex flex-col justify-between transition-all hover:shadow-xl hover-lift`;

        let badge = plan.badge 
            ? `<span class="absolute -top-3.5 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-[11px] uppercase tracking-wider px-4 py-1 rounded-full shadow-md">${plan.badge}</span>` 
            : '';

        card.innerHTML = `
            ${badge}
            <div class="space-y-5">
                <div>
                    <h3 class="text-xl font-extrabold ${isPopular ? 'text-white' : 'text-slate-900'}">${plan.name}</h3>
                    <div class="mt-3 flex items-baseline gap-1.5">
                        <span class="text-4xl font-black ${isPopular ? 'text-amber-400' : 'text-slate-900'}">₹${plan.fee.toLocaleString('en-IN')}</span>
                        <span class="text-xs font-semibold ${isPopular ? 'text-stone-300' : 'text-stone-500'}">/${plan.period}</span>
                    </div>
                </div>

                <div class="pt-4 border-t ${isPopular ? 'border-stone-800' : 'border-stone-100'}">
                    <p class="text-xs font-bold uppercase tracking-wider ${isPopular ? 'text-amber-400' : 'text-stone-400'} mb-3">What's Included:</p>
                    <ul class="space-y-2.5 text-xs ${isPopular ? 'text-stone-200' : 'text-slate-600'}">
                        ${plan.features.map(f => `
                            <li class="flex items-start gap-2.5">
                                <i class="fa-solid fa-circle-check text-sm ${isPopular ? 'text-amber-400' : 'text-emerald-600'} flex-shrink-0 mt-0.5"></i>
                                <span>${f}</span>
                            </li>
                        `).join('')}
                    </ul>
                </div>
            </div>

            <button onclick="openApplyModal('', '${plan.name}|${plan.fee}')" class="w-full py-3.5 rounded-full font-bold text-sm transition-all shadow-sm ${
                isPopular 
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 hover:shadow-md' 
                    : 'bg-slate-900 hover:bg-stone-800 text-white'
            }">
                Enroll in Mentorship →
            </button>
        `;
        container.appendChild(card);
    });
}

// ==========================================
// 6. PUBLIC REVIEWS
// ==========================================

function renderPublicReviews() {
    const list = document.getElementById('public-reviews-list') || document.getElementById('reviews-list');
    if (!list) return;
    list.innerHTML = '';

    const visibleReviews = state.reviews.filter(r => r.visible);

    if (visibleReviews.length === 0) {
        list.innerHTML = `
            <div class="col-span-full bg-white border border-stone-200 rounded-2xl p-8 text-center text-slate-500 text-xs space-y-2 shadow-sm">
                <i class="fa-regular fa-comment-dots text-3xl text-stone-300 block mb-1"></i>
                <p class="font-bold text-slate-700">No Student Reviews Published Yet</p>
                <p class="text-slate-400">Authentic student reviews will appear here once mentees submit feedback from their dashboard.</p>
            </div>
        `;
        return;
    }

    visibleReviews.forEach(r => {
        const card = document.createElement('div');
        card.className = 'bg-white p-5 rounded-2xl border border-stone-200/90 shadow-sm space-y-3 hover-lift';
        const safeName = typeof SecurityGuard !== 'undefined' ? SecurityGuard.escapeHTML(r.menteeName) : r.menteeName;
        const safeMentor = typeof SecurityGuard !== 'undefined' ? SecurityGuard.escapeHTML(r.mentorName) : r.mentorName;
        const safeComment = typeof SecurityGuard !== 'undefined' ? SecurityGuard.escapeHTML(r.comment) : r.comment;
        const safeInitial = (safeName || 'M')[0];

        card.innerHTML = `
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-2.5">
                    <div class="w-9 h-9 rounded-full bg-amber-100 text-amber-800 font-bold text-xs flex items-center justify-center border border-amber-200">
                        ${safeInitial}
                    </div>
                    <div>
                        <h4 class="font-bold text-slate-900 text-xs">${safeName}</h4>
                        <p class="text-[11px] text-amber-700 font-medium">Guided by ${safeMentor}</p>
                    </div>
                </div>
                <div class="text-amber-500 text-xs font-semibold">
                    ${'★'.repeat(r.rating || 5)}
                </div>
            </div>
            <p class="text-xs text-slate-600 leading-relaxed italic">"${safeComment}"</p>
            <div class="flex justify-between items-center text-[10px] text-stone-400 pt-1 border-t border-stone-100">
                <span class="text-emerald-700 font-semibold flex items-center gap-1">
                    <i class="fa-solid fa-circle-check text-[9px]"></i> Verified Aspirant
                </span>
                <span>${r.date}</span>
            </div>
        `;
        list.appendChild(card);
    });
}

// ==========================================
// 7. DROPDOWN POPULATION
// ==========================================

function populateMentorDropdowns() {
    const selectApp = document.getElementById('app-mentor');
    if (selectApp) {
        selectApp.innerHTML = '<option value="AUTO">Auto-Allocate Best IITian Match (Recommended)</option>';
        state.mentors.forEach(m => {
            const opt = document.createElement('option');
            opt.value = m.id;
            opt.innerText = `${m.name} (${m.college} - ${m.rank})`;
            selectApp.appendChild(opt);
        });
    }

    const selectSec = document.getElementById('sec-mentor-profile-select');
    const secStatusText = document.getElementById('sec-mentor-status-text');
    if (selectSec) {
        selectSec.innerHTML = '';
        if (state.mentors.length === 0) {
            selectSec.innerHTML = '<option disabled selected>No mentors onboarded yet</option>';
            if (secStatusText) secStatusText.innerText = 'No mentors onboarded yet. Admin can add mentors in the control console.';
        } else {
            state.mentors.forEach(m => {
                const opt = document.createElement('option');
                opt.value = m.id;
                opt.innerText = `${m.name} — ${m.college} (${m.rank})`;
                selectSec.appendChild(opt);
            });
            if (secStatusText) secStatusText.innerText = 'Select your mentor profile to sign in.';
        }
    }

    const selectModal = document.getElementById('modal-mentor-profile-select');
    const modalStatusText = document.getElementById('modal-mentor-status-text');
    if (selectModal) {
        selectModal.innerHTML = '';
        if (state.mentors.length === 0) {
            selectModal.innerHTML = '<option disabled selected>No mentors onboarded yet</option>';
            if (modalStatusText) modalStatusText.innerText = 'No mentors onboarded yet. Please add a mentor via Admin.';
        } else {
            state.mentors.forEach(m => {
                const opt = document.createElement('option');
                opt.value = m.id;
                opt.innerText = `${m.name} — ${m.college} (${m.rank})`;
                selectModal.appendChild(opt);
            });
            if (modalStatusText) modalStatusText.innerText = 'Select your mentor profile to sign in.';
        }
    }
}

// ==========================================
// 8. CONTACT & CALLBACK INQUIRY CONTROLLER
// ==========================================

function handleContactInquirySubmit(e) {
    if (e) e.preventDefault();
    const name = document.getElementById('inquiry-name')?.value.trim();
    const phone = document.getElementById('inquiry-phone')?.value.trim();
    const target = document.getElementById('inquiry-target')?.value || 'JEE 2027';
    const message = document.getElementById('inquiry-message')?.value.trim();
    const captchaAns = document.getElementById('contact-captcha-input')?.value.trim();

    if (!name || !phone) {
        alert('Please enter your Name and WhatsApp phone number.');
        return;
    }

    // Anti-Bot Captcha Verification (Fixes VULN-05)
    if (typeof SecurityGuard !== 'undefined' && !SecurityGuard.validateCaptcha('contact', captchaAns)) {
        alert('Incorrect security captcha answer. Please solve the math verification to submit your inquiry.');
        SecurityGuard.refreshCaptcha('contact');
        return;
    }

    // Phone Number Strict Validation (Fixes BUG-02)
    if (typeof SecurityGuard !== 'undefined' && !SecurityGuard.validateIndianPhone(phone)) {
        alert('Please enter a valid 10-digit Indian WhatsApp mobile number (e.g. 9876543210).');
        return;
    }
    const cleanPhone = typeof SecurityGuard !== 'undefined' ? SecurityGuard.cleanIndianPhone(phone) : phone;

    const newInq = {
        id: Date.now(),
        name,
        phone: cleanPhone,
        target,
        message: message || 'Student requested a priority callback.',
        date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        status: 'New Callback'
    };

    if (!state.inquiries) state.inquiries = [];
    state.inquiries.unshift(newInq);
    // Circular buffer limit for storage quota protection
    if (state.inquiries.length > 50) state.inquiries = state.inquiries.slice(0, 50);

    saveToStorage();
    renderAdminDashboard();

    // Dual-sync to Supabase Database
    if (typeof SupabaseDB !== 'undefined') {
        SupabaseDB.saveInquiry({
            name: newInq.name,
            phone: cleanPhone,
            target_exam: newInq.target,
            message: newInq.message,
            status: newInq.status,
            source: 'Website Inquiry Form'
        }).then(res => {
            if (res && res.success) {
                console.log('✓ [Supabase] Inquiry synced:', res.data);
            }
        }).catch(err => console.warn('[Supabase Sync Error]', err));
    }

    // Generate Instant WhatsApp Lead Dispatch to Lead Admin Asmit Patel (+91 9450287685)
    const adminWhatsApp = '919450287685';
    const nowStr = new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
    const leadMsg = `*🚀 New JEE Circle Mentorship Lead*\n` +
                   `─────────────────────\n` +
                   `👤 *Student Name:* ${name}\n` +
                   `📞 *WhatsApp:* ${cleanPhone}\n` +
                   `🎯 *Target Exam:* ${target}\n` +
                   `💬 *Doubt/Message:* ${message || 'Requested priority callback & study roadmap.'}\n` +
                   `⏰ *Received:* ${nowStr}\n` +
                   `─────────────────────\n` +
                   `_Sent via jeecircle.in verified inquiry gateway_`;

    const waUrl = `https://wa.me/${adminWhatsApp}?text=${encodeURIComponent(leadMsg)}`;

    if (typeof SecurityGuard !== 'undefined') {
        SecurityGuard.recordSecurityEvent(`New Inquiry from ${name}`, name, 'INFO', `Phone: ${cleanPhone}, Target: ${target}`);
        SecurityGuard.refreshCaptcha('contact');
    }

    showToast(`✓ Thank you, ${name}! Your callback request is recorded. Opening WhatsApp to connect with Asmit Patel...`);

    // Open WhatsApp in new tab so admin gets instant message from student
    try {
        window.open(waUrl, '_blank');
    } catch (e) {
        console.log('Popup blocked for WhatsApp redirect');
    }

    if (e.target && e.target.reset) e.target.reset();
}

// ==========================================
// 9. TOAST NOTIFICATION HELPER
// ==========================================

function showToast(message) {
    const toast = document.getElementById('system-toast');
    const msgEl = document.getElementById('toast-message');
    if (!toast || !msgEl) return;
    msgEl.innerText = message;
    toast.classList.remove('translate-y-24', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');
    setTimeout(() => {
        toast.classList.remove('translate-y-0', 'opacity-100');
        toast.classList.add('translate-y-24', 'opacity-0');
    }, 3500);
}
