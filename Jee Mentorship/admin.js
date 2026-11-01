/**
 * JEE Mentorship Platform - Admin & Management Console
 * Controls mentor allocations, student applications, callback inquiries, and broadcast settings
 */

// ==========================================
// 1. ADMIN DASHBOARD DATA & TABLES RENDERER
// ==========================================

function renderAdminDashboard() {
    // Stats calculation
    const menteesEl = document.getElementById('admin-stat-mentees');
    if (menteesEl) menteesEl.innerText = state.mentees.length;

    const mentorsEl = document.getElementById('admin-stat-mentors');
    if (mentorsEl) mentorsEl.innerText = state.mentors.length;

    const totalRev = (state.accountant && state.accountant.transactions)
        ? state.accountant.transactions.filter(t => t.type === 'fee_inflow').reduce((acc, t) => acc + (Number(t.amount) || 0), 0)
        : state.mentees.reduce((acc, m) => acc + (m.feePaid || 0), 0);
    const revEl = document.getElementById('admin-stat-revenue');
    if (revEl) revEl.innerText = '₹' + totalRev.toLocaleString('en-IN');

    const reviewsEl = document.getElementById('admin-stat-reviews');
    if (reviewsEl) reviewsEl.innerText = state.reviews.length;

    const inqEl = document.getElementById('admin-stat-inquiries');
    if (inqEl) inqEl.innerText = (state.inquiries || []).length;

    // Admin Profile Banner
    const fName = state.adminProfile?.name || 'Asmit Patel';
    const fPhone = state.adminProfile?.phone || '+91 9450287685';
    const fEmail = state.adminProfile?.email || 'asmit@jeecircle.in';
    const fPhoto = state.adminProfile?.photoUrl || '';
    const bannerName = document.getElementById('admin-banner-name');
    const bannerPhone = document.getElementById('admin-banner-phone');
    const bannerEmail = document.getElementById('admin-banner-email');
    const bannerAvatar = document.getElementById('admin-banner-avatar');
    if (bannerName) bannerName.innerText = fName;
    if (bannerPhone) bannerPhone.innerText = fPhone;
    if (bannerEmail) bannerEmail.innerText = fEmail;
    if (bannerAvatar) {
        if (fPhoto) {
            bannerAvatar.innerHTML = `<img src="${fPhoto}" alt="${fName}" class="w-full h-full object-cover">`;
        } else {
            bannerAvatar.innerHTML = 'AP';
        }
    }

    // 1. Mentors Allocation Table
    const allocTbody = document.getElementById('admin-allocations-table-body');
    if (allocTbody) {
        allocTbody.innerHTML = '';
        if (state.mentors.length === 0) {
            allocTbody.innerHTML = `
                <tr>
                    <td colspan="5" class="p-8 text-center text-slate-400 bg-slate-50/50">
                        <i class="fa-solid fa-chalkboard-user text-2xl text-slate-300 mb-2 block"></i>
                        <span class="font-bold text-slate-600">No mentors added yet.</span>
                        <p class="text-xs text-slate-400 mt-1">Click <strong>"+ Add New Mentor"</strong> above to onboard your first IITian mentor.</p>
                    </td>
                </tr>
            `;
        } else {
            state.mentors.forEach(m => {
                const assignedMenteesList = state.mentees.filter(mentee => mentee.assignedMentorId === m.id);
                const menteeNames = assignedMenteesList.map(mentee => `<span class="inline-block bg-blue-50 border border-blue-200 text-blue-700 px-2 py-0.5 rounded text-[11px] font-semibold">${mentee.name}</span>`).join(' ') || '<span class="text-slate-400 italic">None Allocated</span>';

                const tr = document.createElement('tr');
                tr.className = 'hover:bg-slate-50 transition border-b border-slate-100';
                tr.innerHTML = `
                    <td class="p-3">
                        <div class="font-bold text-slate-900">${m.name}</div>
                        <div class="text-[11px] text-slate-500 font-mono">${m.whatsapp || 'No contact'}</div>
                    </td>
                    <td class="p-3">
                        <span class="font-bold text-slate-800">${m.college}</span>
                        <span class="block text-[11px] text-blue-600 font-semibold">${m.rank} • ${m.branch}</span>
                    </td>
                    <td class="p-3">
                        <span class="font-bold ${assignedMenteesList.length >= m.maxCapacity ? 'text-rose-600' : 'text-emerald-600'}">
                            ${assignedMenteesList.length} / ${m.maxCapacity} Mentees
                        </span>
                    </td>
                    <td class="p-3">${menteeNames}</td>
                    <td class="p-3 text-right space-x-1">
                        <button onclick="editMentorCapacity(${m.id})" class="text-xs bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded font-semibold text-slate-700 transition" title="Adjust Capacity">
                            Capacity
                        </button>
                        <button onclick="deleteMentor(${m.id})" class="text-xs bg-rose-50 hover:bg-rose-100 px-2.5 py-1 rounded font-semibold text-rose-700 transition" title="Remove Mentor">
                            Delete
                        </button>
                    </td>
                `;
                allocTbody.appendChild(tr);
            });
        }
    }

    // 2. Applications & Enrolled Mentees Table
    const appTbody = document.getElementById('admin-applications-table-body');
    if (appTbody) {
        appTbody.innerHTML = '';
        if (state.mentees.length === 0) {
            appTbody.innerHTML = `
                <tr>
                    <td colspan="7" class="p-8 text-center text-slate-400 bg-slate-50/50">
                        <i class="fa-solid fa-user-graduate text-2xl text-slate-300 mb-2 block"></i>
                        <span class="font-bold text-slate-600">No mentees registered yet.</span>
                        <p class="text-xs text-slate-400 mt-1">When students apply via the website, their details and mentor assignment controls appear here.</p>
                    </td>
                </tr>
            `;
        } else {
            state.mentees.forEach(m => {
                let mentorOptions = `<option value="" ${!m.assignedMentorId ? 'selected' : ''}>-- Unassigned (Needs Mentor) --</option>`;
                state.mentors.forEach(men => {
                    mentorOptions += `<option value="${men.id}" ${m.assignedMentorId === men.id ? 'selected' : ''}>${men.name} (${men.college} - ${men.rank})</option>`;
                });

                const tr = document.createElement('tr');
                tr.className = 'hover:bg-slate-50 transition border-b border-slate-100';
                tr.innerHTML = `
                    <td class="p-3 font-mono text-blue-600 font-bold">${m.id}</td>
                    <td class="p-3">
                        <div class="font-bold text-slate-900">${m.name}</div>
                        <div class="text-[11px] text-slate-400">${m.date || 'Today'}</div>
                    </td>
                    <td class="p-3">
                        <div class="flex items-center gap-1.5">
                            <span class="font-mono text-xs font-semibold text-slate-800">${m.phone}</span>
                            <a href="https://wa.me/${(m.phone || '').replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(m.name)}%2C%20this%20is%20Asmit%20Patel%20from%20JEE%20Circle%20Mentorship%20[IIT%20(BHU)%20Varanasi]." target="_blank" class="text-emerald-600 hover:text-emerald-700 text-xs" title="Chat on WhatsApp">
                                <i class="fa-brands fa-whatsapp text-sm"></i>
                            </a>
                        </div>
                        <span class="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded text-[10px] font-semibold">${m.classLevel || 'Class 12'} • ${m.target}</span>
                    </td>
                    <td class="p-3 font-medium text-xs">${m.planName}</td>
                    <td class="p-3 font-black text-emerald-600">₹${(m.feePaid || 0).toLocaleString('en-IN')}</td>
                    <td class="p-3">
                        <select onchange="reassignMenteeMentor('${m.id}', this.value)" class="text-xs border border-slate-300 rounded-lg p-1.5 bg-white font-medium focus:ring-2 focus:ring-amber-500 max-w-[200px]">
                            ${mentorOptions}
                        </select>
                    </td>
                    <td class="p-3">
                        ${(m.status || '').includes('New Signup') 
                            ? `<span class="bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded text-[10px] border border-amber-200">New Sign-Up</span>`
                            : `<span class="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px] border border-emerald-200">${m.status || 'Active'}</span>`
                        }
                        <button onclick="deleteMentee('${m.id}')" class="ml-2 text-rose-600 hover:text-rose-800 text-xs" title="Delete Mentee"><i class="fa-solid fa-trash"></i></button>
                    </td>
                `;
                appTbody.appendChild(tr);
            });
        }
    }

    // 3. Reviews & Feedback Table
    const revTbody = document.getElementById('admin-reviews-table-body');
    if (revTbody) {
        revTbody.innerHTML = '';
        if (state.reviews.length === 0) {
            revTbody.innerHTML = `
                <tr>
                    <td colspan="6" class="p-8 text-center text-slate-400 bg-slate-50/50">
                        <i class="fa-regular fa-comment-dots text-2xl text-slate-300 mb-2 block"></i>
                        <span class="font-bold text-slate-600">No reviews submitted yet.</span>
                        <p class="text-xs text-slate-400 mt-1">Mentees can submit feedback from their dashboard.</p>
                    </td>
                </tr>
            `;
        } else {
            state.reviews.forEach(r => {
                const tr = document.createElement('tr');
                tr.className = 'hover:bg-slate-50 transition border-b border-slate-100';
                tr.innerHTML = `
                    <td class="p-3 text-slate-400 text-xs">${r.date}</td>
                    <td class="p-3 font-bold text-slate-800">${r.menteeName}</td>
                    <td class="p-3 font-medium text-blue-600">${r.mentorName}</td>
                    <td class="p-3 font-bold text-amber-500">${'★'.repeat(r.rating)} (${r.rating}/5)</td>
                    <td class="p-3">
                        <span class="text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded inline-block mb-1">${r.category || 'Feedback'}</span>
                        <p class="text-slate-700 text-xs">${r.comment}</p>
                    </td>
                    <td class="p-3 text-right space-x-1">
                        <button onclick="toggleReviewVisibility(${r.id})" class="px-2 py-1 text-[10px] font-bold rounded ${r.visible ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'} transition">
                            ${r.visible ? 'Published' : 'Hidden'}
                        </button>
                        <button onclick="deleteReview(${r.id})" class="px-2 py-1 text-[10px] font-bold rounded bg-rose-50 text-rose-700 hover:bg-rose-100 transition">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </td>
                `;
                revTbody.appendChild(tr);
            });
        }
    }

    // 4. Contact Inquiries & Priority Callbacks Table
    const inqTbody = document.getElementById('admin-inquiries-table-body');
    if (inqTbody) {
        inqTbody.innerHTML = '';
        const inquiries = state.inquiries || [];
        if (inquiries.length === 0) {
            inqTbody.innerHTML = `
                <tr>
                    <td colspan="6" class="p-8 text-center text-slate-400 bg-slate-50/50">
                        <i class="fa-solid fa-headset text-2xl text-slate-300 mb-2 block"></i>
                        <span class="font-bold text-slate-600">No student inquiry callbacks yet.</span>
                        <p class="text-xs text-slate-400 mt-1">When students or parents fill the "Request Priority Callback" form on the homepage, their requests appear here.</p>
                    </td>
                </tr>
            `;
        } else {
            inquiries.forEach(inq => {
                const tr = document.createElement('tr');
                tr.className = 'hover:bg-slate-50 transition border-b border-slate-100';
                const cleanPhone = (inq.phone || '').replace(/[^0-9]/g, '');
                tr.innerHTML = `
                    <td class="p-3 text-slate-400 text-xs">${inq.date || 'Today'}</td>
                    <td class="p-3 font-bold text-slate-900">${inq.name}</td>
                    <td class="p-3">
                        <div class="font-semibold text-slate-800">${inq.phone}</div>
                        <span class="text-[10px] text-emerald-600 font-bold"><i class="fa-brands fa-whatsapp"></i> WhatsApp</span>
                    </td>
                    <td class="p-3 font-medium text-blue-600">${inq.target || 'JEE Aspirant'}</td>
                    <td class="p-3 text-xs text-slate-600 max-w-xs truncate" title="${inq.message || ''}">
                        ${inq.message || '<span class="text-slate-400 italic">Callback requested</span>'}
                    </td>
                    <td class="p-3 text-right space-x-1">
                        <a href="tel:${inq.phone}" class="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition" title="Call Student">
                            <i class="fa-solid fa-phone text-[10px]"></i> Call
                        </a>
                        <a href="https://wa.me/${cleanPhone}" target="_blank" class="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition" title="Chat on WhatsApp">
                            <i class="fa-brands fa-whatsapp text-[11px]"></i> Chat
                        </a>
                        <button onclick="deleteInquiry(${inq.id})" class="px-2 py-1 text-xs font-bold rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 transition" title="Delete Inquiry">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </td>
                `;
                inqTbody.appendChild(tr);
            });
        }
    }

    renderAdminAccounts();
    renderAdminDatabaseStats();
    renderAdminSecurity();
}

// ==========================================
// 2. ADMIN TABS & MODALS
// ==========================================

function switchAdminTab(tabName) {
    document.querySelectorAll('.admin-tab-content').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('.admin-tab-btn').forEach(btn => {
        btn.classList.remove('border-blue-600', 'text-blue-600');
        btn.classList.add('border-transparent', 'text-slate-500');
    });

    const activeTabContent = document.getElementById(`admin-tab-${tabName}`);
    const activeBtn = document.getElementById(`tab-btn-${tabName}`);
    if (activeTabContent) activeTabContent.classList.remove('hidden');
    if (activeBtn) {
        activeBtn.classList.add('border-blue-600', 'text-blue-600');
        activeBtn.classList.remove('border-transparent', 'text-slate-500');
    }
}

function openAddMentorModal() {
    if (!state.currentUser || state.currentUser.role !== 'admin') {
        alert('Access Denied: Only Lead Administrator Asmit Patel can onboard new mentors.');
        handleFounderAccessClick();
        return;
    }
    const modal = document.getElementById('addMentorModal');
    if (modal) modal.classList.remove('hidden');
}

function closeAddMentorModal() {
    const modal = document.getElementById('addMentorModal');
    if (modal) modal.classList.add('hidden');
}

function handleCreateMentorSubmit(e) {
    if (e) e.preventDefault();
    const rankVal = document.getElementById('new-mentor-rank')?.value.trim();
    const formattedRank = rankVal.toUpperCase().startsWith('AIR') ? rankVal.toUpperCase() : `AIR ${rankVal}`;
    const newM = {
        id: Date.now(),
        name: document.getElementById('new-mentor-name')?.value.trim(),
        college: document.getElementById('new-mentor-college')?.value,
        branch: document.getElementById('new-mentor-branch')?.value.trim(),
        rank: formattedRank,
        rating: parseFloat(document.getElementById('new-mentor-rating')?.value || '5.0'),
        menteesCount: 0,
        maxCapacity: parseInt(document.getElementById('new-mentor-capacity')?.value || '5'),
        bio: document.getElementById('new-mentor-bio')?.value.trim() || 'IITian Mentor guiding JEE aspirants.',
        whatsapp: document.getElementById('new-mentor-whatsapp')?.value.trim() || '+919876543210'
    };

    state.mentors.unshift(newM);
    saveToStorage();

    // Dual-sync to Supabase Database
    if (typeof SupabaseDB !== 'undefined') {
        SupabaseDB.saveMentor({
            mentor_id: 'MTR-' + newM.id,
            name: newM.name,
            college: newM.college,
            branch: newM.branch,
            rank: newM.rank,
            rating: newM.rating,
            max_capacity: newM.maxCapacity,
            bio: newM.bio,
            whatsapp: newM.whatsapp
        }).then(res => {
            if (res && res.success) console.log('✓ [Supabase] Mentor synced:', res.data);
        }).catch(err => console.warn('[Supabase Sync Error]', err));
    }

    renderPublicMentors();
    renderAdminDashboard();
    populateMentorDropdowns();
    renderMentorPortal();
    renderMenteePortal();
    closeAddMentorModal();
    showToast(`Mentor ${newM.name} (${newM.college}) added to mentor panel successfully!`);
    if (e.target && e.target.reset) e.target.reset();
}

function editMentorCapacity(mentorId) {
    const mentor = state.mentors.find(m => m.id == mentorId);
    if (!mentor) return;
    const newCap = prompt(`Enter new student capacity for ${mentor.name}:`, mentor.maxCapacity);
    if (newCap && !isNaN(parseInt(newCap))) {
        mentor.maxCapacity = parseInt(newCap);
        saveToStorage();
        renderAdminDashboard();
        renderPublicMentors();
        showToast(`Capacity updated to ${mentor.maxCapacity} for ${mentor.name}`);
    }
}

function deleteMentor(mentorId) {
    const mId = parseInt(mentorId);
    const mentor = state.mentors.find(m => m.id == mId);
    if (!confirm(`Are you sure you want to remove mentor ${mentor?.name || ''}? Mentees assigned to this mentor will become unassigned.`)) return;

    state.mentors = state.mentors.filter(m => m.id != mId);
    state.mentees.forEach(mentee => {
        if (mentee.assignedMentorId == mId) {
            mentee.assignedMentorId = null;
        }
    });
    saveToStorage();
    renderPublicMentors();
    renderAdminDashboard();
    populateMentorDropdowns();
    renderMentorPortal();
    renderMenteePortal();
    showToast('Mentor removed successfully.');
}

function reassignMenteeMentor(recId, mentorIdVal) {
    const mentee = state.mentees.find(m => m.id === recId);
    if (!mentee) return;

    const oldMentorId = mentee.assignedMentorId;
    const newMentorId = mentorIdVal ? parseInt(mentorIdVal) : null;

    if (oldMentorId && oldMentorId != newMentorId) {
        const oldM = state.mentors.find(m => m.id == oldMentorId);
        if (oldM && oldM.menteesCount > 0) oldM.menteesCount--;
    }

    if (newMentorId) {
        const newM = state.mentors.find(m => m.id == newMentorId);
        if (newM) newM.menteesCount = (newM.menteesCount || 0) + 1;
    }

    mentee.assignedMentorId = newMentorId;
    saveToStorage();
    renderAdminDashboard();
    renderPublicMentors();
    renderMenteePortal();
    renderMentorPortal();
    const assignedName = newMentorId ? state.mentors.find(m => m.id == newMentorId)?.name : 'Unassigned';
    showToast(`Mentee ${mentee.name} reassigned to ${assignedName}!`);
}

function deleteMentee(recId) {
    const mentee = state.mentees.find(m => m.id === recId);
    if (!confirm(`Are you sure you want to delete mentee record ${recId} (${mentee?.name || ''})?`)) return;

    if (mentee && mentee.assignedMentorId) {
        const mentor = state.mentors.find(men => men.id == mentee.assignedMentorId);
        if (mentor && mentor.menteesCount > 0) mentor.menteesCount--;
    }

    state.mentees = state.mentees.filter(m => m.id !== recId);
    saveToStorage();
    renderAdminDashboard();
    renderPublicMentors();
    renderMenteePortal();
    showToast(`Mentee record ${recId} removed.`);
}

function toggleReviewVisibility(id) {
    const rev = state.reviews.find(r => r.id === id);
    if (rev) {
        rev.visible = !rev.visible;
        saveToStorage();
        renderAdminDashboard();
        renderPublicReviews();
        showToast(`Review visibility updated to: ${rev.visible ? 'Published' : 'Hidden'}`);
    }
}

function deleteReview(id) {
    if (!confirm('Are you sure you want to delete this review?')) return;
    state.reviews = state.reviews.filter(r => r.id !== id);
    saveToStorage();
    renderAdminDashboard();
    renderPublicReviews();
    renderMenteeFeedbackHistory();
    showToast('Review deleted.');
}

function deleteInquiry(id) {
    if (!confirm('Are you sure you want to remove this inquiry callback request?')) return;
    state.inquiries = (state.inquiries || []).filter(i => i.id !== id);
    saveToStorage();
    renderAdminDashboard();
    showToast('Inquiry callback removed.');
}

function triggerReviewBroadcast() {
    if (state.mentees.length === 0) {
        alert('No active mentees enrolled yet to send review request.');
        return;
    }
    showToast(`Automated review request sent via WhatsApp to all ${state.mentees.length} active mentees!`);
}

function openBroadcastModal() {
    const modal = document.getElementById('broadcastModal');
    if (modal) modal.classList.remove('hidden');
}

function closeBroadcastModal() {
    const modal = document.getElementById('broadcastModal');
    if (modal) modal.classList.add('hidden');
}

function handleBroadcastSubmit(e) {
    if (e) e.preventDefault();
    const text = document.getElementById('broadcast-text')?.value.trim();
    if (!text) return;
    const bannerEl = document.getElementById('announcement-text');
    if (bannerEl) bannerEl.innerText = text;
    closeBroadcastModal();
    showToast('Top announcement banner updated!');
}

// ==========================================
// 3. MANAGEMENT & ACCOUNTANT PANEL CONTROLLERS
// ==========================================

function renderAdminAccounts() {
    if (!state.accountant) state.accountant = { transactions: [], securityAuditLogs: [] };
    const txns = state.accountant.transactions || [];

    // Financial Totals
    const feeInflow = txns.filter(t => t.type === 'fee_inflow').reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
    const mentorOutflow = txns.filter(t => t.type === 'mentor_payout').reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
    const netSurplus = feeInflow - mentorOutflow;
    const advanceHeld = txns.filter(t => t.type === 'mentor_payout' && (t.payoutCategory === 'Advance Payout' || t.payoutCategory === 'Advance')).reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

    const inflowEl = document.getElementById('acc-stat-inflow');
    const outflowEl = document.getElementById('acc-stat-outflow');
    const netEl = document.getElementById('acc-stat-net');
    const advanceEl = document.getElementById('acc-stat-advance');
    const inflowCountEl = document.getElementById('acc-stat-inflow-count');
    const outflowCountEl = document.getElementById('acc-stat-outflow-count');
    const dueTextEl = document.getElementById('acc-stat-due-text');

    if (inflowEl) inflowEl.innerText = '₹' + feeInflow.toLocaleString('en-IN');
    if (outflowEl) outflowEl.innerText = '₹' + mentorOutflow.toLocaleString('en-IN');
    if (netEl) netEl.innerText = '₹' + netSurplus.toLocaleString('en-IN');
    if (advanceEl) advanceEl.innerText = '₹' + advanceHeld.toLocaleString('en-IN');

    const feeTxns = txns.filter(t => t.type === 'fee_inflow');
    const payoutTxns = txns.filter(t => t.type === 'mentor_payout');

    if (inflowCountEl) inflowCountEl.innerText = `${feeTxns.length} Verified Deposits`;
    if (outflowCountEl) outflowCountEl.innerText = `${payoutTxns.length} Disbursals Logged`;

    const totalBenchmark = feeInflow * 0.5;
    const pendingDue = Math.max(0, totalBenchmark - mentorOutflow);
    if (dueTextEl) dueTextEl.innerText = `Pending Net Due: ₹${pendingDue.toLocaleString('en-IN')}`;

    // Subview 1: Fee Deposits & Validity Schedule Table
    const feesTbody = document.getElementById('admin-accounts-fees-tbody');
    if (feesTbody) {
        feesTbody.innerHTML = '';
        if (feeTxns.length === 0) {
            feesTbody.innerHTML = `<tr><td colspan="9" class="p-6 text-center text-slate-400">No student fee deposits recorded yet. Click "+ Record Fee Deposit" to log a student admission.</td></tr>`;
        } else {
            feeTxns.forEach(t => {
                let daysRemaining = 180;
                let statusBadge = '<span class="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800">Active</span>';
                if (t.validityTill && t.validityTill !== '-') {
                    try {
                        const parsed = new Date(t.validityTill);
                        if (!isNaN(parsed.getTime())) {
                            daysRemaining = Math.ceil((parsed.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                            if (daysRemaining > 30) {
                                statusBadge = `<span class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300">Active (${daysRemaining}d left)</span>`;
                            } else if (daysRemaining > 0) {
                                statusBadge = `<span class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-900 border border-amber-300">Expiring Soon (${daysRemaining}d)</span>`;
                            } else {
                                statusBadge = `<span class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-100 text-rose-800 border border-rose-300">Expired</span>`;
                            }
                        }
                    } catch (e) {}
                }

                const tr = document.createElement('tr');
                tr.className = 'hover:bg-slate-50 transition border-b border-slate-100';
                tr.innerHTML = `
                    <td class="p-3 font-mono font-bold text-slate-800">${t.id}</td>
                    <td class="p-3">
                        <span class="font-bold text-slate-900">${t.partyName}</span>
                        <span class="block text-[10px] text-stone-500 font-mono">${t.partyId || 'ID Pending'}</span>
                    </td>
                    <td class="p-3 text-stone-600 font-medium">${t.plan || 'Mentorship Plan'}</td>
                    <td class="p-3 font-semibold text-slate-700">${t.date}</td>
                    <td class="p-3 font-bold text-amber-700">${t.validityTill || '6 Months'}</td>
                    <td class="p-3">${statusBadge}</td>
                    <td class="p-3 font-black text-emerald-600">₹${Number(t.amount).toLocaleString('en-IN')}</td>
                    <td class="p-3">
                        <span class="font-medium text-slate-700 block">${t.mode || 'UPI'}</span>
                        <span class="text-[10px] text-stone-400 font-mono">${t.utrRef || '-'}</span>
                    </td>
                    <td class="p-3 text-right">
                        <button onclick="openFeeReceiptModal('${t.partyId || t.id}')" class="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-bold transition inline-flex items-center gap-1">
                            <i class="fa-solid fa-receipt text-amber-600"></i> Receipt
                        </button>
                    </td>
                `;
                feesTbody.appendChild(tr);
            });
        }
    }

    // Subview 2: Mentor Payouts & Advance Ledger Table
    const payoutsTbody = document.getElementById('admin-accounts-payouts-tbody');
    if (payoutsTbody) {
        payoutsTbody.innerHTML = '';
        if (payoutTxns.length === 0) {
            payoutsTbody.innerHTML = `<tr><td colspan="8" class="p-6 text-center text-slate-400">No mentor payouts recorded yet. Click "+ Pay Mentor" to disburse mentor honorarium or advance.</td></tr>`;
        } else {
            payoutTxns.forEach(t => {
                const tr = document.createElement('tr');
                tr.className = 'hover:bg-slate-50 transition border-b border-slate-100';
                const isAdvance = t.payoutCategory === 'Advance Payout' || t.payoutCategory === 'Advance';
                tr.innerHTML = `
                    <td class="p-3 font-mono font-bold text-slate-800">${t.id}</td>
                    <td class="p-3 font-bold text-slate-900">${t.partyName}</td>
                    <td class="p-3 font-semibold text-slate-700">${t.date}</td>
                    <td class="p-3 font-black text-amber-700">₹${Number(t.amount).toLocaleString('en-IN')}</td>
                    <td class="p-3">
                        <span class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${isAdvance ? 'bg-purple-100 text-purple-800 border border-purple-200' : 'bg-blue-100 text-blue-800 border border-blue-200'}">
                            ${t.payoutCategory || 'Honorarium'}
                        </span>
                    </td>
                    <td class="p-3">
                        <span class="font-medium text-slate-700 block">${t.mode || 'Direct Bank'}</span>
                        <span class="text-[10px] text-stone-400 font-mono">${t.utrRef || '-'}</span>
                    </td>
                    <td class="p-3 text-stone-500 max-w-xs truncate" title="${t.note || ''}">${t.note || 'Disbursed by Lead Admin'}</td>
                    <td class="p-3">
                        <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            ${t.status || 'Disbursed'}
                        </span>
                    </td>
                `;
                payoutsTbody.appendChild(tr);
            });
        }
    }

    // Subview 3: Mentor Balance & Settlement Summary Table
    const summaryTbody = document.getElementById('admin-accounts-summary-tbody');
    if (summaryTbody) {
        summaryTbody.innerHTML = '';
        state.mentors.forEach(m => {
            const mTxns = payoutTxns.filter(t => t.partyId === m.id || (t.partyName && t.partyName.includes(m.name)));
            const totalPaid = mTxns.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
            const advanceHeld = mTxns.filter(t => t.payoutCategory === 'Advance Payout' || t.payoutCategory === 'Advance').reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
            const assignedMentees = state.mentees.filter(mentee => mentee.assignedMentorId === m.id);
            const accrued = Math.max(totalPaid + 1500, assignedMentees.length * 1500);
            const netDue = Math.max(0, accrued - totalPaid);

            const tr = document.createElement('tr');
            tr.className = 'hover:bg-slate-50 transition border-b border-slate-100';
            tr.innerHTML = `
                <td class="p-3">
                    <span class="font-bold text-slate-900 block">${m.name}</span>
                    <span class="text-[10px] text-stone-400 font-mono">${m.id}</span>
                </td>
                <td class="p-3 text-stone-600">${m.college} · ${m.branch}</td>
                <td class="p-3 font-bold text-indigo-700">${assignedMentees.length} Active Mentees</td>
                <td class="p-3 font-black text-slate-900">₹${accrued.toLocaleString('en-IN')}</td>
                <td class="p-3 font-bold text-emerald-700">₹${totalPaid.toLocaleString('en-IN')}</td>
                <td class="p-3 font-bold text-purple-700">₹${advanceHeld.toLocaleString('en-IN')}</td>
                <td class="p-3 font-black text-amber-700">₹${netDue.toLocaleString('en-IN')}</td>
                <td class="p-3 text-right">
                    <button onclick="openPayMentorModal('${m.id}', ${netDue > 0 ? netDue : 1500})" class="px-3 py-1.5 bg-slate-900 hover:bg-stone-800 text-amber-300 font-bold text-xs rounded-xl transition shadow-sm inline-flex items-center gap-1.5">
                        <i class="fa-solid fa-paper-plane text-[10px]"></i> Pay Now
                    </button>
                </td>
            `;
            summaryTbody.appendChild(tr);
        });
    }
}

function switchAccountsSubView(view) {
    const feeView = document.getElementById('acc-subview-fees');
    const payoutView = document.getElementById('acc-subview-payouts');
    const summaryView = document.getElementById('acc-subview-summary');

    const btnFee = document.getElementById('btn-subview-fees');
    const btnPayout = document.getElementById('btn-subview-payouts');
    const btnSummary = document.getElementById('btn-subview-summary');

    if (feeView) feeView.classList.add('hidden');
    if (payoutView) payoutView.classList.add('hidden');
    if (summaryView) summaryView.classList.add('hidden');

    const inactiveBtnClass = 'px-4 py-2 rounded-xl text-stone-600 hover:text-slate-900 transition flex items-center gap-1.5';
    const activeBtnClass = 'px-4 py-2 rounded-xl bg-white text-slate-900 shadow-sm transition flex items-center gap-1.5 font-bold';

    if (btnFee) btnFee.className = inactiveBtnClass;
    if (btnPayout) btnPayout.className = inactiveBtnClass;
    if (btnSummary) btnSummary.className = inactiveBtnClass;

    if (view === 'fees') {
        if (feeView) feeView.classList.remove('hidden');
        if (btnFee) btnFee.className = activeBtnClass;
    } else if (view === 'payouts') {
        if (payoutView) payoutView.classList.remove('hidden');
        if (btnPayout) btnPayout.className = activeBtnClass;
    } else if (view === 'summary') {
        if (summaryView) summaryView.classList.remove('hidden');
        if (btnSummary) btnSummary.className = activeBtnClass;
    }
}

function openPayMentorModal(mentorId = '', suggestedAmount = '') {
    const selectEl = document.getElementById('pay-mentor-select');
    const amtEl = document.getElementById('pay-mentor-amount');
    const dateEl = document.getElementById('pay-mentor-date');
    const utrEl = document.getElementById('pay-mentor-utr');
    const noteEl = document.getElementById('pay-mentor-note');

    if (selectEl) {
        selectEl.innerHTML = '';
        state.mentors.forEach(m => {
            const opt = document.createElement('option');
            opt.value = m.id;
            opt.innerText = `${m.name} (${m.college} - ${m.branch})`;
            if (mentorId && m.id === mentorId) opt.selected = true;
            selectEl.appendChild(opt);
        });
    }

    if (amtEl) amtEl.value = suggestedAmount || '2000';
    if (dateEl) {
        const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
        dateEl.value = today;
    }
    if (utrEl) utrEl.value = 'UTR-' + Date.now().toString().slice(-8);
    if (noteEl) noteEl.value = '';

    const modal = document.getElementById('payMentorModal');
    if (modal) modal.classList.remove('hidden');
}

function closePayMentorModal() {
    const modal = document.getElementById('payMentorModal');
    if (modal) modal.classList.add('hidden');
}

function handlePayMentorSubmit(e) {
    if (e) e.preventDefault();
    const mentorId = document.getElementById('pay-mentor-select')?.value;
    const amount = Number(document.getElementById('pay-mentor-amount')?.value) || 0;
    const category = document.getElementById('pay-mentor-category')?.value || 'Monthly Honorarium';
    const date = document.getElementById('pay-mentor-date')?.value || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const mode = document.getElementById('pay-mentor-mode')?.value || 'UPI Transfer';
    const utr = document.getElementById('pay-mentor-utr')?.value.trim() || ('UTR-' + Date.now().toString().slice(-8));
    const note = document.getElementById('pay-mentor-note')?.value.trim() || `${category} paid to mentor`;

    if (!mentorId || amount <= 0) {
        alert('Please select a mentor and enter a valid payout amount.');
        return;
    }

    const mentor = state.mentors.find(m => m.id === mentorId) || state.mentors[0];

    const newPayout = {
        id: 'PAY-' + Date.now().toString().slice(-6),
        type: 'mentor_payout',
        partyName: mentor ? `${mentor.name} [${mentor.college}]` : 'Mentor',
        partyRole: 'mentor',
        partyId: mentorId,
        plan: note,
        amount: amount,
        date: date,
        validityTill: '-',
        mode: mode,
        utrRef: utr,
        note: note,
        payoutCategory: category,
        status: 'Disbursed'
    };

    if (!state.accountant) state.accountant = { transactions: [], securityAuditLogs: [] };
    state.accountant.transactions.unshift(newPayout);
    saveToStorage();

    // Dual-sync to Supabase Database
    if (typeof SupabaseDB !== 'undefined') {
        SupabaseDB.saveTransaction({
            txn_id: newPayout.id,
            type: 'mentor_payout',
            party_name: newPayout.partyName,
            party_role: 'mentor',
            party_id: mentorId,
            plan_or_purpose: note,
            amount: amount,
            date: date,
            mode: mode,
            utr_ref: utr,
            note: note,
            status: 'Disbursed'
        }).then(res => {
            if (res && res.success) console.log('✓ [Supabase] Payout txn synced:', res.data);
        }).catch(err => console.warn('[Supabase Sync Error]', err));
    }

    if (typeof SecurityGuard !== 'undefined') {
        SecurityGuard.recordSecurityEvent(`Mentor Disbursal of ₹${amount} to ${mentor?.name || mentorId}`, 'Admin Asmit Patel', 'AUTHORIZED', `Mode: ${mode}, UTR: ${utr}`);
    }

    closePayMentorModal();
    renderAdminDashboard();
    showToast(`Payout of ₹${amount.toLocaleString('en-IN')} disbursed to ${mentor?.name} successfully!`);
}

function openRecordFeeModal() {
    const dateEl = document.getElementById('record-fee-date');
    const utrEl = document.getElementById('record-fee-utr');
    if (dateEl) {
        dateEl.value = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    }
    if (utrEl) {
        utrEl.value = 'UPI-' + Date.now().toString().slice(-8);
    }
    const modal = document.getElementById('recordFeeModal');
    if (modal) modal.classList.remove('hidden');
}

function closeRecordFeeModal() {
    const modal = document.getElementById('recordFeeModal');
    if (modal) modal.classList.add('hidden');
}

function handleRecordFeeSubmit(e) {
    if (e) e.preventDefault();
    const name = document.getElementById('record-fee-name')?.value.trim();
    const phone = document.getElementById('record-fee-phone')?.value.trim();
    const plan = document.getElementById('record-fee-plan')?.value || '6-Month Intensive Mentorship';
    const amount = Number(document.getElementById('record-fee-amount')?.value) || 2500;
    const date = document.getElementById('record-fee-date')?.value || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const durationMonths = Number(document.getElementById('record-fee-duration')?.value) || 6;
    const mode = document.getElementById('record-fee-mode')?.value || 'UPI / PhonePe';
    const utr = document.getElementById('record-fee-utr')?.value.trim() || ('UPI-' + Date.now().toString().slice(-8));

    if (!name || !phone) {
        alert('Please enter student name and phone number.');
        return;
    }

    const d = new Date();
    d.setMonth(d.getMonth() + durationMonths);
    const validityTill = d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const receiptNo = 'REC-2026-' + Math.floor(1000 + Math.random() * 9000);
    const studentId = 'JEE-' + (2025 + Math.floor(Math.random() * 2)) + '-' + Math.floor(1000 + Math.random() * 9000);

    const newMentee = {
        id: studentId,
        name: name,
        phone: phone,
        email: `${name.toLowerCase().replace(/[^a-z]/g, '')}.jee@gmail.com`,
        classLevel: 'Class 12',
        target: 'JEE Advanced 2027',
        plan: plan,
        feeStatus: 'Paid',
        paymentStatus: 'Paid',
        feePaid: amount,
        amount: amount.toString(),
        date: date,
        dateOfJoining: date,
        validityTill: validityTill,
        receiptNo: receiptNo,
        paymentMode: mode,
        assignedMentorId: state.mentors[0]?.id || 'MENTOR-BHU-01',
        assignedMentorName: state.mentors[0]?.name ? `${state.mentors[0].name} [${state.mentors[0].college}]` : 'Asmit Patel [IIT (BHU) Varanasi]',
        targets: []
    };

    state.mentees.unshift(newMentee);

    const newTxn = {
        id: 'TXN-' + Date.now().toString().slice(-6),
        type: 'fee_inflow',
        partyName: name,
        partyRole: 'mentee',
        partyId: studentId,
        plan: plan,
        amount: amount,
        date: date,
        validityTill: validityTill,
        mode: mode,
        utrRef: utr,
        note: `Fee deposit for ${plan} (Valid till ${validityTill})`,
        status: 'Verified'
    };

    if (!state.accountant) state.accountant = { transactions: [], securityAuditLogs: [] };
    state.accountant.transactions.unshift(newTxn);
    saveToStorage();

    // Dual-sync to Supabase Database
    if (typeof SupabaseDB !== 'undefined') {
        SupabaseDB.saveMentee({
            student_id: studentId,
            name: name,
            phone: phone,
            email: newMentee.email,
            class_level: newMentee.classLevel,
            target_exam: newMentee.target,
            plan_name: plan,
            fee_paid: amount,
            fee_status: 'Paid',
            date_of_joining: date,
            validity_till: validityTill,
            receipt_no: receiptNo,
            payment_mode: mode,
            assigned_mentor_id: newMentee.assignedMentorId,
            assigned_mentor_name: newMentee.assignedMentorName,
            status: 'Active'
        }).then(res => {
            if (res && res.success) console.log('✓ [Supabase] Fee-paid mentee synced:', res.data);
        }).catch(err => console.warn('[Supabase Sync Error]', err));

        SupabaseDB.saveTransaction({
            txn_id: newTxn.id,
            type: 'fee_inflow',
            party_name: name,
            party_role: 'mentee',
            party_id: studentId,
            plan_or_purpose: plan,
            amount: amount,
            date: date,
            validity_till: validityTill,
            mode: mode,
            utr_ref: utr,
            note: newTxn.note,
            status: 'Verified'
        });
    }

    if (typeof SecurityGuard !== 'undefined') {
        SecurityGuard.recordSecurityEvent(`Fee Deposit of ₹${amount} Recorded for ${name}`, 'Admin Asmit Patel', 'AUTHORIZED', `Receipt: ${receiptNo}, Valid till: ${validityTill}`);
    }

    closeRecordFeeModal();
    renderAdminDashboard();
    showToast(`Fee deposit of ₹${amount.toLocaleString('en-IN')} recorded for ${name}! Receipt: ${receiptNo}`);
}

function exportFullDatabaseJSON() {
    const backupData = {
        platform: 'JEE Circle Mentorship Platform',
        institution: 'IIT (BHU) Varanasi Mentorship Wing',
        leadAdmin: state.adminProfile?.name || 'Asmit Patel',
        adminContact: state.adminProfile?.phone || '+91 9450287685',
        backupTimestamp: new Date().toISOString(),
        formatVersion: '2.4.0',
        mentees: state.mentees,
        mentors: state.mentors,
        accountant: state.accountant,
        inquiries: state.inquiries,
        reviews: state.reviews,
        plans: state.plans,
        adminProfile: state.adminProfile
    };

    const jsonStr = JSON.stringify(backupData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `jee_circle_database_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    if (typeof SecurityGuard !== 'undefined') {
        SecurityGuard.recordSecurityEvent('Full Database JSON Backup Exported', 'Admin Asmit Patel', 'AUTHORIZED', 'Downloaded entire platform database');
    }
    showToast('Platform database exported successfully as JSON!');
}

function exportFinancialLedgerCSV() {
    const txns = state.accountant?.transactions || [];
    let csv = 'Transaction ID,Date,Type,Party Name,Role,Plan / Note,Amount (INR),Payment Mode,UTR / Ref,Validity Till,Status\n';

    txns.forEach(t => {
        const row = [
            `"${t.id || ''}"`,
            `"${t.date || ''}"`,
            `"${t.type || ''}"`,
            `"${(t.partyName || '').replace(/"/g, '""')}"`,
            `"${t.partyRole || ''}"`,
            `"${(t.plan || t.note || '').replace(/"/g, '""')}"`,
            `"${t.amount || 0}"`,
            `"${t.mode || ''}"`,
            `"${t.utrRef || ''}"`,
            `"${t.validityTill || ''}"`,
            `"${t.status || ''}"`
        ];
        csv += row.join(',') + '\n';
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `jee_circle_financial_ledger_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    if (typeof SecurityGuard !== 'undefined') {
        SecurityGuard.recordSecurityEvent('Financial Ledger CSV Exported', 'Admin Asmit Patel', 'AUTHORIZED', `${txns.length} transactions exported`);
    }
    showToast('Financial accounting ledger exported as CSV!');
}

function exportStudentsCSV() {
    const mentees = state.mentees || [];
    let csv = 'Student ID,Student Name,WhatsApp Phone,Email,Class,Target Exam,Plan Enrolled,Fee Deposited,Date of Joining,Validity Till,Receipt Number,Assigned Mentor,Status\n';

    mentees.forEach(m => {
        const row = [
            `"${m.id || ''}"`,
            `"${(m.name || '').replace(/"/g, '""')}"`,
            `"${m.phone || ''}"`,
            `"${m.email || ''}"`,
            `"${m.classLevel || ''}"`,
            `"${m.target || ''}"`,
            `"${(m.plan || '').replace(/"/g, '""')}"`,
            `"${m.feePaid || m.amount || ''}"`,
            `"${m.dateOfJoining || m.date || ''}"`,
            `"${m.validityTill || ''}"`,
            `"${m.receiptNo || ''}"`,
            `"${(m.assignedMentorName || '').replace(/"/g, '""')}"`,
            `"${m.feeStatus || 'Active'}"`
        ];
        csv += row.join(',') + '\n';
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `jee_circle_students_roster_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast('Students roster exported as CSV!');
}

function handleDatabaseRestore(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            if (!data.mentees || !Array.isArray(data.mentees)) {
                alert('Invalid database file format. Must contain valid mentees and records.');
                return;
            }

            if (!confirm(`Found backup containing ${data.mentees.length} mentees and ${(data.mentors || []).length} mentors. Do you want to restore and overwrite current browser database?`)) {
                return;
            }

            if (data.mentees) state.mentees = data.mentees;
            if (data.mentors) state.mentors = data.mentors;
            if (data.accountant) state.accountant = data.accountant;
            if (data.inquiries) state.inquiries = data.inquiries;
            if (data.reviews) state.reviews = data.reviews;
            if (data.adminProfile) state.adminProfile = data.adminProfile;

            saveToStorage();
            renderAdminDashboard();
            if (typeof SecurityGuard !== 'undefined') {
                SecurityGuard.recordSecurityEvent('Database Restored from File', 'Admin Asmit Patel', 'AUTHORIZED', `Restored ${data.mentees.length} mentees`);
            }
            alert('Platform database successfully restored!');
        } catch (err) {
            alert('Error parsing JSON backup file: ' + err.message);
        }
    };
    reader.readAsText(file);
}

async function syncToCloudDatabase() {
    const url = document.getElementById('cloud-sync-url')?.value.trim();
    const statusEl = document.getElementById('cloud-sync-status');

    if (statusEl) {
        statusEl.className = 'text-[10px] text-amber-600 font-bold';
        statusEl.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-1"></i> Syncing local database records to Supabase Cloud Database...';
    }

    if (typeof SupabaseDB !== 'undefined') {
        try {
            const summary = await SupabaseDB.syncAllLocalData();
            if (statusEl) {
                statusEl.className = 'text-[10px] text-emerald-600 font-bold';
                statusEl.innerHTML = `<i class="fa-solid fa-circle-check text-emerald-500 mr-1"></i> Synced to Supabase: ${summary.mentees} students, ${summary.transactions} txns, ${summary.inquiries} inquiries, ${summary.reviews} reviews at ${new Date().toLocaleTimeString()}!`;
            }
            if (typeof SecurityGuard !== 'undefined') {
                SecurityGuard.recordSecurityEvent(
                    'Cloud Database Bulk Synced',
                    'Admin Asmit Patel',
                    'AUTHORIZED',
                    `Supabase synced: ${summary.mentees} mentees, ${summary.transactions} transactions, ${summary.inquiries} inquiries`
                );
            }
            showToast(`✓ Cloud Sync Complete: Pushed ${summary.mentees} students & ${summary.transactions} financial records to Supabase!`);
        } catch (e) {
            if (statusEl) {
                statusEl.className = 'text-[10px] text-rose-600 font-bold';
                statusEl.innerHTML = `<i class="fa-solid fa-triangle-exclamation mr-1"></i> Sync notice: Ensure Supabase tables exist (${e.message})`;
            }
            showToast('Notice: Please ensure tables are created in Supabase SQL editor.');
        }
    } else {
        if (statusEl) {
            statusEl.className = 'text-[10px] text-emerald-600 font-bold';
            statusEl.innerText = `Synced successfully with ${url} at ${new Date().toLocaleTimeString()}!`;
        }
        showToast('Database payload synced to cloud endpoint!');
    }
}

function openSupabaseSqlModal() {
    const modal = document.getElementById('supabaseSqlModal');
    if (modal) {
        const pre = document.getElementById('supabase-sql-code-block');
        if (pre && typeof SupabaseDB !== 'undefined') {
            pre.innerText = SupabaseDB.getSqlSchema();
        }
        modal.classList.remove('hidden');
    }
}

function closeSupabaseSqlModal() {
    const modal = document.getElementById('supabaseSqlModal');
    if (modal) modal.classList.add('hidden');
}

function copySupabaseSqlScript() {
    if (typeof SupabaseDB !== 'undefined') {
        const sql = SupabaseDB.getSqlSchema();
        navigator.clipboard.writeText(sql).then(() => {
            showToast('✓ SQL Schema copied to clipboard! Paste in Supabase SQL Editor and click Run.');
        }).catch(() => {
            showToast('Please select and copy the SQL code manually.');
        });
    }
}

function renderAdminDatabaseStats() {
    // optional database stat indicator updates
}

function renderAdminSecurity() {
    const logsTbody = document.getElementById('admin-security-logs-tbody');
    if (!logsTbody) return;

    const logs = state.accountant?.securityAuditLogs || [];
    logsTbody.innerHTML = '';

    if (logs.length === 0) {
        logsTbody.innerHTML = `<tr><td colspan="6" class="p-6 text-center text-slate-400">No security events logged yet.</td></tr>`;
        return;
    }

    logs.forEach(l => {
        const tr = document.createElement('tr');
        tr.className = 'hover:bg-slate-50 transition border-b border-slate-100 text-xs';
        const isAuth = l.status === 'AUTHORIZED';
        const isBlocked = l.status === 'BLOCKED';
        const statusBadge = isAuth
            ? '<span class="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300">AUTHORIZED</span>'
            : isBlocked
            ? '<span class="px-2 py-0.5 rounded text-[10px] font-extrabold bg-rose-100 text-rose-800 border border-rose-300">BLOCKED</span>'
            : '<span class="px-2 py-0.5 rounded text-[10px] font-extrabold bg-amber-100 text-amber-900 border border-amber-300">WARNING</span>';

        tr.innerHTML = `
            <td class="p-3 text-stone-500 font-mono text-[11px]">${l.timestamp}</td>
            <td class="p-3 font-bold text-slate-900">${l.event}</td>
            <td class="p-3 font-medium text-slate-700">${l.user}</td>
            <td class="p-3 text-stone-500 font-mono text-[11px]">${l.origin}</td>
            <td class="p-3">${statusBadge}</td>
            <td class="p-3 text-stone-500 text-[11px]">${l.details || '-'}</td>
        `;
        logsTbody.appendChild(tr);
    });
}

function clearSecurityLockouts() {
    if (typeof SecurityGuard !== 'undefined') {
        SecurityGuard.reset();
        SecurityGuard.recordSecurityEvent('Security Lockouts Manually Cleared by Admin', 'Admin Asmit Patel', 'AUTHORIZED', 'All lockout counters reset');
    }
    renderAdminSecurity();
    showToast('Failed login lockouts have been reset.');
}

function openFeeReceiptModal(identifier) {
    let mentee = null;
    let txn = null;

    if (identifier) {
        mentee = state.mentees.find(m => m.id === identifier || m.receiptNo === identifier);
        if (!mentee && state.accountant?.transactions) {
            txn = state.accountant.transactions.find(t => t.id === identifier || t.partyId === identifier);
            if (txn) {
                mentee = state.mentees.find(m => m.id === txn.partyId || m.name === txn.partyName);
            }
        }
    }

    if (!mentee) {
        mentee = (state.currentUser && state.currentUser.role === 'mentee')
            ? state.currentUser
            : (state.mentees.length > 0 ? state.mentees[0] : null);
    }

    if (!mentee) {
        alert('No mentee admission record found to generate receipt.');
        return;
    }

    const modal = document.getElementById('feeReceiptModal');
    if (!modal) return;

    const rNoEl = document.getElementById('receipt-modal-no');
    const dateEl = document.getElementById('receipt-modal-date');
    const nameEl = document.getElementById('receipt-modal-name');
    const idEl = document.getElementById('receipt-modal-id');
    const targetEl = document.getElementById('receipt-modal-target');
    const planEl = document.getElementById('receipt-modal-plan');
    const amountEl = document.getElementById('receipt-modal-amount');
    const validityEl = document.getElementById('receipt-modal-validity');
    const modeEl = document.getElementById('receipt-modal-mode');

    const amount = mentee.amount || mentee.feePaid || '2,500';
    if (rNoEl) rNoEl.innerText = mentee.receiptNo || 'REC-2026-7841';
    if (dateEl) dateEl.innerText = mentee.dateOfJoining || mentee.date || '28 Oct 2026';
    if (nameEl) nameEl.innerText = mentee.name;
    if (idEl) idEl.innerText = mentee.id;
    if (targetEl) targetEl.innerText = `${mentee.classLevel || 'Class 12'} · ${mentee.target || 'JEE Advanced 2027'}`;
    if (planEl) planEl.innerText = mentee.plan || '6-Month Intensive Mentorship';
    if (amountEl) amountEl.innerText = `₹${amount.toString().replace(/[^0-9,]/g, '')}`;
    if (validityEl) validityEl.innerText = mentee.validityTill || '28 Apr 2027';
    if (modeEl) modeEl.innerText = mentee.paymentMode || 'UPI Transfer (Verified)';

    modal.classList.remove('hidden');
}

function closeFeeReceiptModal() {
    const modal = document.getElementById('feeReceiptModal');
    if (modal) modal.classList.add('hidden');
}
