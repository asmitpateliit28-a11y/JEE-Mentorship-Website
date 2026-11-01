/**
 * JEE Mentorship Platform - Mentee & Mentor Portals & Application Flow
 * Handles student workspaces, mentor assignments, review submissions, and receipt generation
 */

// ==========================================
// 1. MENTEE PORTAL CONTROLLER
// ==========================================

function getCurrentMentee() {
    if (state.currentUser && state.currentUser.role === 'mentee') {
        const found = state.mentees.find(m => m.id === state.currentUser.id || m.student_id === state.currentUser.id || m.phone === state.currentUser.phone || m.email === state.currentUser.email);
        if (found) return found;
        return state.currentUser;
    }
    // Admin role previewing mentee dashboard
    if (state.currentUser && state.currentUser.role === 'admin' && state.mentees && state.mentees.length > 0) {
        return state.mentees[0];
    }
    // Fix IDOR: Unauthenticated or non-mentee guests do NOT get access to other students' profiles
    return null;
}

function renderMenteePortal() {
    const currentMentee = getCurrentMentee();

    const nameEl = document.getElementById('mentee-dash-name');
    const badgeEl = document.getElementById('mentee-dash-badge');
    const subtitleEl = document.getElementById('mentee-dash-subtitle');
    const feeEl = document.getElementById('mentee-dash-fee');
    const mentorCard = document.getElementById('mentee-assigned-mentor-card');

    if (!currentMentee) {
        if (nameEl) nameEl.innerText = 'No Active Mentee Session';
        if (badgeEl) badgeEl.innerText = 'Guest Aspirant';
        if (feeEl) feeEl.innerHTML = 'Fee Status: Not Enrolled';
        if (mentorCard) {
            mentorCard.innerHTML = `
                <div class="p-6 bg-slate-50 border border-slate-200 rounded-2xl text-center space-y-3">
                    <div class="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto text-xl">
                        <i class="fa-solid fa-user-graduate"></i>
                    </div>
                    <h4 class="font-extrabold text-slate-800 text-sm">No Active Mentee Enrolled</h4>
                    <p class="text-xs text-slate-500 max-w-xs mx-auto">Please apply via "Apply for Mentorship" to register, deposit fee, and access your personal IITian mentorship workspace.</p>
                    <button onclick="openApplyModal()" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow transition">
                        <i class="fa-solid fa-paper-plane mr-1"></i> Apply & Register as Mentee
                    </button>
                </div>
            `;
        }
        renderMenteeFeedbackHistory('Guest');
        return;
    }

    if (nameEl) nameEl.innerText = currentMentee.name;
    if (badgeEl) badgeEl.innerText = `${currentMentee.classLevel || 'Class 12'} · ${currentMentee.target || 'JEE 2027'}`;
    if (subtitleEl) {
        subtitleEl.innerText = `Target Exam: ${currentMentee.target || 'JEE Advanced 2027'} | Plan: ${currentMentee.plan || '1-on-1 Mentorship'}`;
    }
    if (feeEl) {
        const isPaid = (currentMentee.feeStatus === 'Paid' || currentMentee.paymentStatus === 'Paid' || currentMentee.feePaid);
        const amount = currentMentee.amount || currentMentee.feePaid || '2,500';
        if (isPaid) {
            feeEl.innerHTML = `₹${amount.toString().replace(/[^0-9,]/g, '') || '2,500'} Paid (Active)`;
        } else {
            feeEl.innerHTML = `<span class="text-amber-600 font-bold">Admission Reserved (Pending Confirmation)</span>`;
        }
    }

    // Populate Mentee Enrollment & Validity Pass
    const dojEl = document.getElementById('mentee-dash-doj');
    const feeAmtEl = document.getElementById('mentee-dash-fee-amount');
    const validityEl = document.getElementById('mentee-dash-validity');
    const receiptNoEl = document.getElementById('mentee-dash-receipt-no');
    const modeEl = document.getElementById('mentee-dash-mode');
    const daysLeftBadgeEl = document.getElementById('mentee-dash-days-left');

    const doj = currentMentee.dateOfJoining || currentMentee.date || '28 Oct 2026';
    const valTill = currentMentee.validityTill || '28 Apr 2027';
    const rNo = currentMentee.receiptNo || 'REC-2026-7841';
    const fAmt = currentMentee.amount || currentMentee.feePaid || '2,500';
    const pMode = currentMentee.paymentMode || 'UPI / PhonePe';

    if (dojEl) dojEl.innerText = doj;
    if (feeAmtEl) feeAmtEl.innerText = `₹${fAmt.toString().replace(/[^0-9,]/g, '')}`;
    if (validityEl) validityEl.innerText = valTill;
    if (receiptNoEl) receiptNoEl.innerText = rNo;
    if (modeEl) modeEl.innerText = pMode;

    if (daysLeftBadgeEl) {
        let daysLeft = 179;
        try {
            const parsedVal = new Date(valTill);
            if (!isNaN(parsedVal.getTime())) {
                const diffTime = parsedVal.getTime() - Date.now();
                daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            }
        } catch (e) {
            daysLeft = 179;
        }

        if (daysLeft > 30) {
            daysLeftBadgeEl.className = 'text-[11px] font-extrabold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30';
            daysLeftBadgeEl.innerText = `${daysLeft} Days Remaining · Active Pass`;
        } else if (daysLeft > 0) {
            daysLeftBadgeEl.className = 'text-[11px] font-extrabold px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30';
            daysLeftBadgeEl.innerText = `Expiring Soon (${daysLeft} Days Left)`;
        } else {
            daysLeftBadgeEl.className = 'text-[11px] font-extrabold px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-400/30';
            daysLeftBadgeEl.innerText = 'Pass Expired · Renewal Due';
        }
    }

    // Render Assigned Mentor Card
    let assignedMentor = null;
    if (currentMentee.assignedMentorId) {
        assignedMentor = state.mentors.find(m => m.id === currentMentee.assignedMentorId);
    }

    if (assignedMentor) {
        const initials = assignedMentor.name ? assignedMentor.name.trim().split(/\s+/).map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'M';
        const cleanPhone = (assignedMentor.whatsapp || '').replace(/[^0-9]/g, '');
        const mentorPhoto = assignedMentor.photoUrl || (assignedMentor.name.includes('Asmit') ? state.adminProfile?.photoUrl : '');
        mentorCard.innerHTML = `
            <div class="bg-gradient-to-br from-blue-50 to-indigo-50/60 p-5 rounded-2xl border border-blue-100 shadow-sm space-y-4">
                <div class="flex items-center justify-between">
                    <span class="text-[10px] font-bold text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded-full uppercase">Your Assigned 1-on-1 Mentor</span>
                    <span class="text-xs font-bold text-amber-500 flex items-center gap-1">★ ${assignedMentor.rating || 5.0}</span>
                </div>
                <div class="flex items-center gap-3">
                    <div class="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-600 to-stone-800 text-white font-bold text-base flex items-center justify-center shadow overflow-hidden flex-shrink-0">
                        ${mentorPhoto ? `<img src="${mentorPhoto}" alt="${assignedMentor.name}" class="w-full h-full object-cover">` : initials}
                    </div>
                    <div>
                        <h4 class="font-bold text-slate-900 text-sm">${assignedMentor.name}</h4>
                        <p class="text-xs text-amber-700 font-semibold">${assignedMentor.college} (${assignedMentor.branch})</p>
                        <p class="text-[11px] text-slate-500">${assignedMentor.rank}</p>
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-2 pt-2 border-t border-stone-200">
                    <a href="https://wa.me/${cleanPhone}?text=Hi%20${encodeURIComponent(assignedMentor.name)}%2C%20I%20am%20your%20assigned%20mentee%20${encodeURIComponent(currentMentee.name)}." target="_blank" class="py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 shadow-sm">
                        <i class="fa-brands fa-whatsapp"></i> Chat on WhatsApp
                    </a>
                    <button onclick="alert('Mentor video call sync scheduled for this Sunday!')" class="py-2 px-3 bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 shadow-sm">
                        <i class="fa-solid fa-video text-amber-600"></i> Video Call
                    </button>
                </div>
            </div>
        `;
    } else {
        mentorCard.innerHTML = `
            <div class="bg-amber-50 border border-amber-200 p-5 rounded-2xl space-y-3">
                <div class="flex items-center gap-2 text-amber-800 font-bold text-xs">
                    <i class="fa-solid fa-clock-rotate-left text-amber-600"></i>
                    <span>Evaluation &amp; Mentor Allocation In Progress</span>
                </div>
                <p class="text-xs text-stone-600 leading-relaxed">
                    Your details are currently being evaluated by Founder &amp; Lead Admin <strong>Asmit Patel [IIT (BHU) Varanasi · Civil 2024]</strong>. You will be paired with your dedicated mentor within 24 hours.
                </p>
                <div class="pt-1">
                    <a href="https://wa.me/919450287685?text=Hi%20Asmit%20bhaiya%2C%20I%20have%20registered%20on%20JEE%20Circle%20(ID%3A%20${encodeURIComponent(currentMentee.id)})." target="_blank" class="inline-flex items-center gap-1.5 py-2 px-3.5 bg-slate-900 text-amber-300 font-bold text-xs rounded-xl hover:bg-stone-800 transition shadow-sm">
                        <i class="fa-brands fa-whatsapp text-emerald-400"></i> Connect with Asmit Patel
                    </a>
                </div>
            </div>
        `;
    }

    renderMenteeTargets(currentMentee);
    renderMenteeFeedbackHistory(currentMentee.name);
}

// Mentee Personal Targets & To-Dos Engine
function renderMenteeTargets(mentee) {
    const listEl = document.getElementById('mentee-targets-list');
    const badgeEl = document.getElementById('mentee-targets-badge');
    const percentEl = document.getElementById('mentee-targets-percent');
    const barEl = document.getElementById('mentee-targets-bar');
    const assignedByEl = document.getElementById('mentee-targets-assigned-by');

    if (!listEl) return;

    if (!mentee.targets || mentee.targets.length === 0) {
        mentee.targets = [
            { id: 1, text: 'Physics: Solve 25 PYQs from Rotational Motion & Moments', done: true },
            { id: 2, text: 'Chemistry: Revise GOC reaction mechanisms & acidity orders', done: true },
            { id: 3, text: 'Maths: Complete 1-hour Definite Integration numerical drill', done: false },
            { id: 4, text: 'Analysis: Review weekly mock test error log and revise weak formulas', done: false }
        ];
        saveToStorage();
    }

    if (assignedByEl) {
        assignedByEl.innerText = mentee.assignedMentorName && mentee.assignedMentorName !== 'Pending Admin Allocation'
            ? `Assigned & monitored by ${mentee.assignedMentorName}`
            : 'Supervised by Founder Asmit Patel [IIT (BHU) Varanasi · Civil 2024]';
    }

    const total = mentee.targets.length;
    const completed = mentee.targets.filter(t => t.done).length;
    const pct = total === 0 ? 0 : Math.round((completed / total) * 100);

    if (badgeEl) badgeEl.innerText = `${completed} / ${total} Done`;
    if (percentEl) percentEl.innerText = `${pct}%`;
    if (barEl) barEl.style.width = `${pct}%`;

    listEl.innerHTML = '';
    mentee.targets.forEach(t => {
        const row = document.createElement('div');
        row.className = `flex items-center justify-between p-3 rounded-xl border transition ${
            t.done ? 'bg-stone-50 border-stone-200 text-stone-400' : 'bg-white border-stone-200 text-slate-800 shadow-sm'
        }`;
        const safeText = typeof SecurityGuard !== 'undefined' ? SecurityGuard.escapeHTML(t.text) : t.text;
        row.innerHTML = `
            <label class="flex items-center gap-3 cursor-pointer flex-1">
                <input type="checkbox" ${t.done ? 'checked' : ''} onchange="toggleMenteeTarget(${t.id})" class="w-4 h-4 text-amber-600 rounded focus:ring-amber-500 cursor-pointer">
                <span class="${t.done ? 'line-through text-stone-400' : 'font-semibold text-slate-800'}">${safeText}</span>
            </label>
            <button type="button" onclick="deleteMenteeTarget(${t.id})" class="text-stone-400 hover:text-rose-600 text-xs px-2 py-1 transition" title="Remove Target">
                ✕
            </button>
        `;
        listEl.appendChild(row);
    });
}

function toggleMenteeTarget(targetId) {
    let currentMentee = getCurrentMentee();
    if (!currentMentee) return;
    if (!currentMentee.targets) currentMentee.targets = [];
    const target = currentMentee.targets.find(t => t.id == targetId);
    if (target) {
        target.done = !target.done;
        if (state.currentUser && state.currentUser.role === 'mentee') {
            state.currentUser.targets = currentMentee.targets;
        }
        saveToStorage();
        renderMenteeTargets(currentMentee);
    }
}

function handleAddMenteeTodo(e) {
    if (e) e.preventDefault();
    const inp = document.getElementById('new-mentee-todo-inp');
    const text = inp?.value ? inp.value.trim() : '';
    if (!text) return;

    let currentMentee = getCurrentMentee();
    if (!currentMentee) {
        currentMentee = {
            id: 'JEE-2025-0101',
            name: 'Rahul Sharma',
            phone: '+91 9876543210',
            classLevel: 'Class 12',
            target: 'JEE Advanced 2027',
            plan: '6-Month Intensive Mentorship',
            feeStatus: 'Paid',
            amount: '2,500',
            targets: []
        };
        state.mentees.push(currentMentee);
        if (!state.currentUser) {
            state.currentUser = { role: 'mentee', ...currentMentee };
        }
    }
    if (!currentMentee.targets) currentMentee.targets = [];

    currentMentee.targets.push({
        id: Date.now(),
        text: text,
        done: false
    });

    if (state.currentUser && state.currentUser.role === 'mentee') {
        state.currentUser.targets = currentMentee.targets;
    }

    if (inp) inp.value = '';
    saveToStorage();

    // Dual-sync to Supabase Database
    if (typeof SupabaseDB !== 'undefined') {
        SupabaseDB.saveTodo({
            mentee_id: currentMentee.id,
            task_text: text,
            completed: false
        }).catch(err => console.warn('[Supabase Sync Error]', err));
    }

    renderMenteeTargets(currentMentee);
    showToast('New target added to your daily schedule!');
}

function deleteMenteeTarget(targetId) {
    let currentMentee = getCurrentMentee();
    if (!currentMentee || !currentMentee.targets) return;
    currentMentee.targets = currentMentee.targets.filter(t => t.id != targetId);
    if (state.currentUser && state.currentUser.role === 'mentee') {
        state.currentUser.targets = currentMentee.targets;
    }
    saveToStorage();
    renderMenteeTargets(currentMentee);
    showToast('Target removed.');
}

function renderMenteeFeedbackHistory(menteeName = '') {
    const container = document.getElementById('mentee-feedback-history');
    if (!container) return;
    container.innerHTML = '';

    const menteeReviews = state.reviews.filter(r => !menteeName || r.menteeName.toLowerCase() === menteeName.toLowerCase());

    if (menteeReviews.length === 0) {
        container.innerHTML = `<p class="text-slate-400 italic text-[11px]">No feedback submitted yet. Share your experience using the form above.</p>`;
        return;
    }

    menteeReviews.forEach(r => {
        const item = document.createElement('div');
        item.className = 'p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1';
        item.innerHTML = `
            <div class="flex justify-between items-center text-[11px]">
                <span class="font-bold text-slate-800">${r.category} · For ${r.mentorName}</span>
                <span class="text-amber-500 font-bold">${'★'.repeat(r.rating)}</span>
            </div>
            <p class="text-slate-600 text-xs italic">"${r.comment}"</p>
            <div class="flex justify-between text-[10px] text-slate-400 pt-1">
                <span>Status: ${r.visible ? '<span class="text-emerald-600 font-bold">Published</span>' : '<span class="text-slate-500">Sent to Management</span>'}</span>
                <span>${r.date}</span>
            </div>
        `;
        container.appendChild(item);
    });
}

function handleMenteeReviewSubmit(e) {
    if (e) e.preventDefault();
    const rating = parseInt(document.getElementById('review-rating')?.value || '5');
    const comment = document.getElementById('review-comment')?.value.trim();
    const category = document.getElementById('review-category')?.value || 'Study Strategy';
    const menteeName = document.getElementById('review-mentee-name')?.value.trim() || state.currentUser?.name || 'Aspirant';

    let mentorName = 'IITian Mentor';
    if (state.currentUser && state.currentUser.assignedMentorId) {
        const mObj = state.mentors.find(m => m.id === state.currentUser.assignedMentorId);
        if (mObj) mentorName = mObj.name;
    } else if (state.mentors.length > 0) {
        mentorName = state.mentors[0].name;
    }

    if (!comment) {
        alert('Please write your feedback comment.');
        return;
    }

    const newReview = {
        id: Date.now(),
        menteeName: menteeName,
        mentorName: mentorName,
        rating: rating,
        category: category,
        comment: comment,
        date: new Date().toISOString().split('T')[0],
        visible: true
    };

    state.reviews.unshift(newReview);
    saveToStorage();
    renderPublicReviews();
    renderAdminDashboard();
    renderMenteeFeedbackHistory(menteeName);

    // Dual-sync to Supabase Database
    if (typeof SupabaseDB !== 'undefined') {
        SupabaseDB.saveReview({
            mentee_name: newReview.menteeName,
            mentor_name: newReview.mentorName,
            rating: newReview.rating,
            category: newReview.category,
            comment: newReview.comment,
            visible: true
        }).then(res => {
            if (res && res.success) console.log('✓ [Supabase] Review synced:', res.data);
        }).catch(err => console.warn('[Supabase Sync Error]', err));
    }

    const commentEl = document.getElementById('review-comment');
    if (commentEl) commentEl.value = '';
    showToast('Thank you! Your feedback has been sent to management.');
}

// ==========================================
// 2. MENTOR WORKSPACE CONTROLLER
// ==========================================

function renderMentorPortal() {
    const currentMentor = (state.currentUser && state.currentUser.role === 'mentor')
        ? state.currentUser
        : (state.mentors.length > 0 ? state.mentors[0] : null);

    const nameEl = document.getElementById('mentor-dash-name');
    const subEl = document.getElementById('mentor-dash-subtitle');
    const menteesTbody = document.getElementById('mentor-assigned-mentees-tbody');

    if (!currentMentor) {
        if (nameEl) nameEl.innerText = 'Mentor Workspace';
        if (subEl) subEl.innerText = 'No mentor account active. Sign in to view assigned students.';
        if (menteesTbody) {
            menteesTbody.innerHTML = `
                <tr>
                    <td colspan="5" class="p-8 text-center text-slate-400">
                        No active mentor session. Please log in using your mentor account.
                    </td>
                </tr>
            `;
        }
        return;
    }

    if (nameEl) nameEl.innerText = `Mentor: ${currentMentor.name}`;
    if (subEl) subEl.innerText = `${currentMentor.college} (${currentMentor.branch}) · ${currentMentor.rank}`;

    const assignedMentees = state.mentees.filter(m => m.assignedMentorId === currentMentor.id);

    if (menteesTbody) {
        menteesTbody.innerHTML = '';
        if (assignedMentees.length === 0) {
            menteesTbody.innerHTML = `
                <tr>
                    <td colspan="5" class="p-8 text-center text-slate-400">
                        <i class="fa-solid fa-user-graduate text-2xl text-slate-300 mb-2 block"></i>
                        No mentees allocated to you yet. Admin will allocate new students to your batch.
                    </td>
                </tr>
            `;
        } else {
            assignedMentees.forEach(m => {
                const cleanPhone = (m.phone || '').replace(/[^0-9]/g, '');
                const tr = document.createElement('tr');
                tr.className = 'hover:bg-slate-50 transition border-b border-slate-100';
                tr.innerHTML = `
                    <td class="p-3">
                        <div class="font-bold text-slate-900">${m.name}</div>
                        <div class="text-[11px] text-slate-400">${m.id}</div>
                    </td>
                    <td class="p-3">
                        <span class="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-[11px] font-bold">${m.target || 'JEE 2027'}</span>
                        <div class="text-[11px] text-slate-500">${m.classLevel || 'Class 12'}</div>
                    </td>
                    <td class="p-3 text-xs">${m.planName}</td>
                    <td class="p-3">
                        <div class="font-mono text-xs">${m.phone}</div>
                    </td>
                    <td class="p-3 text-right space-x-1">
                        <a href="https://wa.me/${cleanPhone}" target="_blank" class="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold rounded-lg transition inline-flex items-center gap-1">
                            <i class="fa-brands fa-whatsapp"></i> Chat
                        </a>
                        <button onclick="alert('Video call link sent to ${m.name} on WhatsApp!')" class="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-lg transition">
                            <i class="fa-solid fa-video"></i> Call
                        </button>
                    </td>
                `;
                menteesTbody.appendChild(tr);
            });
        }
    }
}

// ==========================================
// 3. APPLICATION & FEE DEPOSIT WORKFLOW
// ==========================================

function openApplyModal(mentorId = '', planVal = '', targetBatch = '') {
    const successContainer = document.getElementById('receipt-success-container');
    const formEl = document.getElementById('application-form');
    if (successContainer) successContainer.classList.add('hidden');
    if (formEl) formEl.classList.remove('hidden');

    if (mentorId) {
        const sel = document.getElementById('app-mentor');
        if (sel) sel.value = mentorId;
    }
    if (planVal) {
        const planSel = document.getElementById('app-plan');
        if (planSel) {
            for (let opt of planSel.options) {
                if (opt.value === planVal || opt.value.startsWith(planVal.split('|')[0])) {
                    opt.selected = true;
                    break;
                }
            }
        }
    }
    if (targetBatch) {
        const targetSel = document.getElementById('app-target');
        if (targetSel) {
            for (let opt of targetSel.options) {
                if (opt.value.includes(targetBatch) || opt.innerText.includes(targetBatch)) {
                    opt.selected = true;
                    break;
                }
            }
        }
    }

    updateDepositAmount();
    const modal = document.getElementById('applyModal');
    if (modal) modal.classList.remove('hidden');
}

function closeApplyModal() {
    const modal = document.getElementById('applyModal');
    if (modal) modal.classList.add('hidden');
}

function updateDepositAmount() {
    const val = document.getElementById('app-plan')?.value || '6-Month Intensive Mentorship|2500';
    const amount = val.split('|')[1] || '2500';
    const amountEl = document.getElementById('app-payable-amount');
    if (amountEl) {
        amountEl.innerText = `₹${parseInt(amount).toLocaleString('en-IN')}`;
    }
}

function handleFeeDepositSubmit(e) {
    if (e) e.preventDefault();

    const name = document.getElementById('app-name')?.value.trim();
    const phone = document.getElementById('app-phone')?.value.trim();
    const classLevel = document.getElementById('app-class')?.value || 'Class 12';
    const target = document.getElementById('app-target')?.value || 'JEE 2027';
    const planRaw = document.getElementById('app-plan')?.value || '6-Month Intensive Mentorship|2500';
    const [planName, feeStr] = planRaw.split('|');
    const feePaid = parseInt(feeStr) || 2500;

    // Mentor is assigned exclusively by Admin
    const newReceiptId = 'JEE-REC-' + Math.floor(100000 + Math.random() * 900000);

    const newMentee = {
        id: newReceiptId,
        name: name,
        phone: phone,
        classLevel: classLevel,
        target: target,
        planName: planName,
        feePaid: feePaid,
        assignedMentorId: null,
        assignedMentorName: 'Pending Admin Allocation',
        date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        status: 'Active (Pending Mentor Assignment)'
    };

    state.mentees.unshift(newMentee);
    saveToStorage();

    // Dual-sync to Supabase Database
    if (typeof SupabaseDB !== 'undefined') {
        SupabaseDB.saveMentee({
            student_id: newReceiptId,
            name: name,
            phone: phone,
            class_level: classLevel,
            target_exam: target,
            plan_name: planName,
            fee_paid: feePaid,
            fee_status: 'Paid',
            date_of_joining: newMentee.date,
            receipt_no: '#' + newReceiptId,
            payment_mode: 'Online Admission Portal',
            assigned_mentor_name: 'Pending Admin Allocation',
            status: 'Active (Pending Mentor Assignment)'
        }).then(res => {
            if (res && res.success) console.log('✓ [Supabase] Enrolled mentee synced:', res.data);
        }).catch(err => console.warn('[Supabase Sync Error]', err));

        SupabaseDB.saveTransaction({
            txn_id: 'TXN-' + newReceiptId,
            type: 'fee_inflow',
            party_name: name,
            party_role: 'mentee',
            party_id: newReceiptId,
            plan_or_purpose: planName,
            amount: feePaid,
            date: newMentee.date,
            mode: 'Online Admission Portal',
            utr_ref: 'ADM-' + newReceiptId,
            note: `Online Enrollment for ${planName}`,
            status: 'Verified'
        });
    }

    // Fill Receipt
    const recId = document.getElementById('rec-id');
    const recDate = document.getElementById('rec-date');
    const recName = document.getElementById('rec-name');
    const recPhone = document.getElementById('rec-phone');
    const recClass = document.getElementById('rec-class');
    const recTarget = document.getElementById('rec-target');
    const recPlan = document.getElementById('rec-plan');
    const recAmount = document.getElementById('rec-amount');
    const recMentor = document.getElementById('rec-mentor');

    if (recId) recId.innerText = '#' + newReceiptId;
    if (recDate) recDate.innerText = newMentee.date;
    if (recName) recName.innerText = name;
    if (recPhone) recPhone.innerText = phone;
    if (recClass) recClass.innerText = classLevel;
    if (recTarget) recTarget.innerText = target;
    if (recPlan) recPlan.innerText = planName;
    if (recAmount) recAmount.innerText = '₹' + feePaid.toLocaleString('en-IN');
    if (recMentor) recMentor.innerText = 'Assigned by Admin Asmit Patel within 24 hours';

    // Show Receipt Success View
    const formEl = document.getElementById('application-form');
    const successContainer = document.getElementById('receipt-success-container');
    if (formEl) formEl.classList.add('hidden');
    if (successContainer) successContainer.classList.remove('hidden');

    // Refresh UI
    renderAdminDashboard();
    renderMenteePortal();
    renderMentorPortal();
    renderPublicMentors();
    populateMentorDropdowns();
    showToast(`Registration complete for ${name}! Fee receipt generated.`);
}

function printReceipt() {
    window.print();
}

function openMentorOnboardModal() {
    openAddMentorModal();
}

function closeMentorOnboardModal() {
    closeAddMentorModal();
}

// Chart.js Progress Chart
function initChart() {
    const canvas = document.getElementById('menteeProgressChart');
    if (!canvas || typeof Chart === 'undefined') return;
    const ctx = canvas.getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Mock 1', 'Mock 2', 'Mock 3', 'Mock 4', 'Mock 5', 'Latest Mock'],
            datasets: [{
                label: 'JEE Advanced Total Score (out of 300)',
                data: [112, 128, 145, 139, 168, 184],
                borderColor: '#2563eb',
                backgroundColor: 'rgba(37, 99, 235, 0.08)',
                fill: true,
                tension: 0.35,
                pointRadius: 5,
                pointBackgroundColor: '#1d4ed8'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: true, position: 'top' }
            },
            scales: {
                y: { beginAtZero: false, min: 80, max: 250 }
            }
        }
    });
}
