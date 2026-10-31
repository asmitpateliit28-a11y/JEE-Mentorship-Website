/**
 * JEE Mentorship Platform - Global State & Data Store
 * Handles persistent localStorage synchronization and configuration
 */

// Default Seed Mentors (Guided exclusively by Founder Asmit Patel - IIT BHU Varanasi)
const defaultMentors = [
    {
        id: 'MENTOR-BHU-01',
        name: 'Asmit Patel',
        college: 'IIT (BHU) Varanasi',
        branch: 'Civil Engineering (Batch 2024)',
        rank: 'Founder & Lead Mentor',
        bio: 'Founder & Lead Mentor at JEE Circle. Civil Engineering (Batch 2024) at IIT (BHU) Varanasi. Guided hundreds of JEE aspirants with customized daily targets, mock analysis, and personalized roadmaps.',
        rating: 5.0,
        activeMentees: 18,
        whatsapp: '+91 9450287685',
        photoUrl: ''
    }
];

const defaultReviews = [
    {
        id: 1,
        menteeName: 'Sreyash Gupta',
        mentorName: 'Asmit Patel [IIT (BHU) Varanasi]',
        rating: 5,
        comment: 'Asmit bhaiya completely transformed my daily discipline. The 1-on-1 strategy sessions on Google Meet and daily WhatsApp tracking kept me focused every single day!',
        date: '28 Oct 2026',
        visible: true
    },
    {
        id: 2,
        menteeName: 'Arpan Roy',
        mentorName: 'Asmit Patel [IIT (BHU) Varanasi]',
        rating: 5,
        comment: 'Jumped from 132 to 198 marks in full syllabus mock tests within 2 months just by following the mistake diagnosis framework and revision schedules.',
        date: '25 Oct 2026',
        visible: true
    },
    {
        id: 3,
        menteeName: 'Purwa Patle',
        mentorName: 'Asmit Patel [IIT (BHU) Varanasi]',
        rating: 5,
        comment: 'Being in Class 11, I had severe backlog fear. Asmit bhaiya helped me plan chapter-by-chapter catchup and daily numerical targets.',
        date: '22 Oct 2026',
        visible: true
    }
];

// Initialize storage if clean or empty, or purge old dummy mentors
let storedMentors = [];
try {
    storedMentors = JSON.parse(localStorage.getItem('jee_mentors') || '[]');
} catch (e) {
    storedMentors = [];
}
if (!storedMentors || storedMentors.length === 0 || storedMentors.some(m => m.id === 'MENTOR-BOM-02' || m.id === 'MENTOR-DEL-03' || (m.name === 'Asmit Patel' && m.branch !== 'Civil Engineering (Batch 2024)'))) {
    storedMentors = defaultMentors;
    localStorage.setItem('jee_mentors', JSON.stringify(defaultMentors));
}

let storedReviews = [];
try {
    storedReviews = JSON.parse(localStorage.getItem('jee_reviews') || '[]');
} catch (e) {
    storedReviews = [];
}
if (!storedReviews || storedReviews.length === 0 || storedReviews.some(r => r.mentorName.includes('Aditya') || r.mentorName.includes('Priya'))) {
    storedReviews = defaultReviews;
    localStorage.setItem('jee_reviews', JSON.stringify(defaultReviews));
}

// Default Starter Mentees with Complete Accounting & Validity Records
const defaultMentees = [
    {
        id: 'JEE-2025-0101',
        name: 'Rahul Sharma',
        phone: '+91 9876543210',
        email: 'rahul.jee2027@gmail.com',
        password: '1234',
        classLevel: 'Class 12',
        target: 'JEE Advanced 2027',
        plan: '6-Month Intensive Mentorship',
        feeStatus: 'Paid',
        paymentStatus: 'Paid',
        feePaid: 2500,
        amount: '2,500',
        date: '28 Oct 2026',
        dateOfJoining: '28 Oct 2026',
        validityTill: '28 Apr 2027',
        receiptNo: 'REC-2026-7841',
        paymentMode: 'UPI / PhonePe',
        assignedMentorId: 'MENTOR-BHU-01',
        assignedMentorName: 'Asmit Patel [IIT (BHU) Varanasi · Civil 2024]',
        targets: [
            { id: 1, text: 'Physics: Solve 25 PYQs from Rotational Motion & Moments', done: true },
            { id: 2, text: 'Chemistry: Revise GOC reaction mechanisms & acidity orders', done: true },
            { id: 3, text: 'Maths: Complete 1-hour Definite Integration numerical drill', done: false },
            { id: 4, text: 'Analysis: Review weekly mock test error log and revise weak formulas', done: false }
        ]
    },
    {
        id: 'JEE-2025-0102',
        name: 'Sreyash Gupta',
        phone: '+91 9811223344',
        email: 'sreyash.iit@gmail.com',
        password: '1234',
        classLevel: 'Class 12',
        target: 'JEE Advanced 2027',
        plan: '1-Year Comprehensive Ranker Plan',
        feeStatus: 'Paid',
        paymentStatus: 'Paid',
        feePaid: 4000,
        amount: '4,000',
        date: '20 Oct 2026',
        dateOfJoining: '20 Oct 2026',
        validityTill: '20 Oct 2027',
        receiptNo: 'REC-2026-7819',
        paymentMode: 'Google Pay UPI',
        assignedMentorId: 'MENTOR-BHU-01',
        assignedMentorName: 'Asmit Patel [IIT (BHU) Varanasi · Civil 2024]',
        targets: []
    },
    {
        id: 'JEE-2025-0103',
        name: 'Purwa Patle',
        phone: '+91 9723456789',
        email: 'purwa.jee2028@gmail.com',
        password: '1234',
        classLevel: 'Class 11',
        target: 'JEE Advanced 2028',
        plan: '6-Month Intensive Mentorship',
        feeStatus: 'Paid',
        paymentStatus: 'Paid',
        feePaid: 2500,
        amount: '2,500',
        date: '15 Oct 2026',
        dateOfJoining: '15 Oct 2026',
        validityTill: '15 Apr 2027',
        receiptNo: 'REC-2026-7782',
        paymentMode: 'Paytm UPI',
        assignedMentorId: 'MENTOR-BHU-01',
        assignedMentorName: 'Asmit Patel [IIT (BHU) Varanasi · Civil 2024]',
        targets: []
    },
    {
        id: 'JEE-2025-0104',
        name: 'Arpan Roy',
        phone: '+91 9654321098',
        email: 'arpan.roy.jee@gmail.com',
        password: '1234',
        classLevel: 'Dropper',
        target: 'JEE Advanced 2026',
        plan: 'Monthly Mentorship Plan',
        feeStatus: 'Paid',
        paymentStatus: 'Paid',
        feePaid: 500,
        amount: '500',
        date: '01 Oct 2026',
        dateOfJoining: '01 Oct 2026',
        validityTill: '01 Nov 2026',
        receiptNo: 'REC-2026-7640',
        paymentMode: 'Net Banking',
        assignedMentorId: 'MENTOR-BHU-01',
        assignedMentorName: 'Asmit Patel [IIT (BHU) Varanasi · Civil 2024]',
        targets: []
    }
];

let storedMentees = [];
try {
    storedMentees = JSON.parse(localStorage.getItem('jee_mentees') || '[]');
} catch (e) {
    storedMentees = [];
}
if (!storedMentees || storedMentees.length === 0 || storedMentees.length === 1) {
    storedMentees = defaultMentees;
    localStorage.setItem('jee_mentees', JSON.stringify(defaultMentees));
} else {
    // Ensure all stored mentees have dateOfJoining and validityTill
    storedMentees.forEach(m => {
        if (!m.dateOfJoining) m.dateOfJoining = m.date || '28 Oct 2026';
        if (!m.validityTill) m.validityTill = '28 Apr 2027';
        if (!m.receiptNo) m.receiptNo = 'REC-2026-' + (Math.floor(1000 + Math.random() * 9000));
        if (!m.paymentMode) m.paymentMode = 'UPI / PhonePe';
    });
    localStorage.setItem('jee_mentees', JSON.stringify(storedMentees));
}

// Accountant & Financial Store Seed Data
const defaultAccountantData = {
    transactions: [
        {
            id: 'TXN-2026-1001',
            type: 'fee_inflow',
            partyName: 'Rahul Sharma',
            partyRole: 'mentee',
            partyId: 'JEE-2025-0101',
            plan: '6-Month Intensive Mentorship',
            amount: 2500,
            date: '28 Oct 2026',
            validityTill: '28 Apr 2027',
            mode: 'UPI / PhonePe',
            utrRef: 'UPI-9450287685-01',
            note: 'Enrolled in 6-Month Intensive Mentorship with Lead Mentor Asmit Patel',
            status: 'Verified'
        },
        {
            id: 'TXN-2026-1002',
            type: 'fee_inflow',
            partyName: 'Sreyash Gupta',
            partyRole: 'mentee',
            partyId: 'JEE-2025-0102',
            plan: '1-Year Comprehensive Ranker Plan',
            amount: 4000,
            date: '20 Oct 2026',
            validityTill: '20 Oct 2027',
            mode: 'Google Pay',
            utrRef: 'UPI-8849201948-02',
            note: 'Full Year Comprehensive Mentorship & Daily Tracking',
            status: 'Verified'
        },
        {
            id: 'TXN-2026-1003',
            type: 'fee_inflow',
            partyName: 'Purwa Patle',
            partyRole: 'mentee',
            partyId: 'JEE-2025-0103',
            plan: '6-Month Intensive Mentorship',
            amount: 2500,
            date: '15 Oct 2026',
            validityTill: '15 Apr 2027',
            mode: 'Paytm UPI',
            utrRef: 'UPI-7719284910-03',
            note: 'Class 11 Backlog Catchup & Strategy Mentorship',
            status: 'Verified'
        },
        {
            id: 'TXN-2026-1004',
            type: 'fee_inflow',
            partyName: 'Arpan Roy',
            partyRole: 'mentee',
            partyId: 'JEE-2025-0104',
            plan: 'Monthly Mentorship Plan',
            amount: 500,
            date: '01 Oct 2026',
            validityTill: '01 Nov 2026',
            mode: 'Net Banking',
            utrRef: 'IMPS-6612984-04',
            note: 'Monthly Mentorship Trial & Test Analysis',
            status: 'Verified'
        },
        {
            id: 'TXN-2026-1005',
            type: 'mentor_payout',
            partyName: 'Asmit Patel [IIT (BHU) Varanasi]',
            partyRole: 'mentor',
            partyId: 'MENTOR-BHU-01',
            plan: 'Mentor Honorarium & Session Remuneration',
            amount: 3000,
            date: '25 Oct 2026',
            validityTill: '-',
            mode: 'IMPS Direct Bank',
            utrRef: 'IMPS-BHU-945028-01',
            note: 'Monthly Honorarium & Guidance Remuneration (October 2026)',
            payoutCategory: 'Monthly Honorarium',
            status: 'Disbursed'
        },
        {
            id: 'TXN-2026-1006',
            type: 'mentor_payout',
            partyName: 'Asmit Patel [IIT (BHU) Varanasi]',
            partyRole: 'mentor',
            partyId: 'MENTOR-BHU-01',
            plan: 'Advance Mentor Disbursal',
            amount: 1500,
            date: '29 Oct 2026',
            validityTill: '-',
            mode: 'UPI Transfer',
            utrRef: 'UPI-ADV-945028-02',
            note: 'Advance Mentor Disbursal for 1-on-1 mock analysis materials',
            payoutCategory: 'Advance Payout',
            status: 'Disbursed'
        }
    ],
    securityAuditLogs: [
        {
            id: 'SEC-LOG-01',
            timestamp: '31 Oct 2026, 21:30:15',
            event: 'Admin Login Authenticated',
            user: 'Asmit Patel (ADMIN-ASMIT-01)',
            origin: '103.21.125.88 (IIT-BHU Campus Network)',
            device: 'Windows 11 / Chrome Desktop',
            status: 'AUTHORIZED'
        },
        {
            id: 'SEC-LOG-02',
            timestamp: '31 Oct 2026, 20:15:40',
            event: 'Brute-Force Guard Checked',
            user: 'System Guard',
            origin: 'Local Host Sandbox',
            device: 'Engine Service',
            status: 'AUTHORIZED'
        },
        {
            id: 'SEC-LOG-03',
            timestamp: '31 Oct 2026, 22:10:05',
            event: 'Route Guard Protection Verified',
            user: 'SecurityGuard Engine',
            origin: 'Internal Session',
            device: 'System Shield',
            status: 'AUTHORIZED'
        }
    ]
};

let storedAccountant = null;
try {
    storedAccountant = JSON.parse(localStorage.getItem('jee_accountant') || 'null');
} catch (e) {
    storedAccountant = null;
}
if (!storedAccountant || !storedAccountant.transactions || storedAccountant.transactions.length === 0) {
    storedAccountant = defaultAccountantData;
    localStorage.setItem('jee_accountant', JSON.stringify(defaultAccountantData));
}

// Global App State
const state = {
    activeView: 'public',
    currentUser: null,
    adminProfile: JSON.parse(localStorage.getItem('jee_admin_profile') || '{"name":"Asmit Patel","adminId":"ADMIN-ASMIT-01","college":"IIT (BHU) Varanasi","branch":"Civil Engineering (Batch 2024)","phone":"+91 9450287685","email":"asmit@jeecircle.in","password":"asmit2024","photoUrl":""}'),
    inquiries: JSON.parse(localStorage.getItem('jee_inquiries') || '[]'),
    mentors: storedMentors,
    mentees: storedMentees,
    accountant: storedAccountant,
    reviews: storedReviews,
    plans: [
        {
            id: 'monthly',
            name: 'Monthly Mentorship Plan',
            fee: 500,
            period: 'per month',
            popular: false,
            badge: 'Flexible Monthly',
            features: [
                '2x 1-on-1 Video Guidance Calls per month',
                'Custom Weekly Target Checklist & Schedule',
                'WhatsApp Doubt & Strategy Support',
                'Monthly Mock Test Mistake Diagnostics'
            ]
        },
        {
            id: 'semester',
            name: '6-Month Intensive Mentorship',
            fee: 2500,
            period: 'for 6 months (Save ₹500)',
            popular: true,
            badge: 'Most Popular Choice',
            features: [
                'Weekly 1-on-1 Video Syncs with IITian Mentor',
                'Personalized Daily Study Plan & Milestones',
                'Direct Mentor WhatsApp Access for Daily Tracking',
                'Micro-level Question & Error Diagnostics',
                'Monthly Progress Review by Lead Team'
            ]
        },
        {
            id: 'yearly',
            name: '1-Year Comprehensive Ranker Plan',
            fee: 4000,
            period: 'per year (Save ₹2,000)',
            popular: false,
            badge: 'Best Long-term Value',
            features: [
                'Unlimited 1-on-1 Video Guidance throughout the year',
                'Top 500 Ranker Exclusive Formula Sheets & Short Notes',
                'Priority Call & Real-time Doubt Support',
                'Full JEE Main & Advanced Diagnostic Framework',
                'Continuous Mentoring till JEE Exam Day'
            ]
        }
    ]
};

// Sync Asmit photo from admin profile to mentor profile
if (state.adminProfile) {
    if (!state.adminProfile.password) state.adminProfile.password = 'asmit2024';
    if (!state.adminProfile.adminId) state.adminProfile.adminId = 'ADMIN-ASMIT-01';
    if (!state.adminProfile.email) state.adminProfile.email = 'asmit@jeecircle.in';
    if (!state.adminProfile.branch || state.adminProfile.branch.includes('Chemical')) {
        state.adminProfile.branch = 'Civil Engineering (Batch 2024)';
    }
    if (state.adminProfile.photoUrl) {
        const asmit = state.mentors.find(m => m.id === 'MENTOR-BHU-01' || m.name.includes('Asmit'));
        if (asmit) asmit.photoUrl = state.adminProfile.photoUrl;
    }
}

// Persistence Helper
function saveToStorage() {
    try {
        // High-load circular buffer protection (prevents 5MB LocalStorage Quota Crash)
        if (state.inquiries && state.inquiries.length > 50) {
            state.inquiries = state.inquiries.slice(0, 50);
        }
        if (state.accountant && state.accountant.securityAuditLogs && state.accountant.securityAuditLogs.length > 50) {
            state.accountant.securityAuditLogs = state.accountant.securityAuditLogs.slice(0, 50);
        }

        localStorage.setItem('jee_mentors', JSON.stringify(state.mentors));
        localStorage.setItem('jee_mentees', JSON.stringify(state.mentees));
        localStorage.setItem('jee_reviews', JSON.stringify(state.reviews));
        if (state.adminProfile) {
            localStorage.setItem('jee_admin_profile', JSON.stringify(state.adminProfile));
        }
        localStorage.setItem('jee_inquiries', JSON.stringify(state.inquiries || []));
        if (state.accountant) {
            localStorage.setItem('jee_accountant', JSON.stringify(state.accountant));
        }
    } catch (e) {
        console.warn('Storage save quota warning, applying emergency truncation:', e);
        try {
            // Emergency fallback: keep only top 20 items to recover from quota lock
            if (state.inquiries) state.inquiries = state.inquiries.slice(0, 20);
            if (state.mentees) state.mentees = state.mentees.slice(0, 20);
            localStorage.setItem('jee_inquiries', JSON.stringify(state.inquiries || []));
            localStorage.setItem('jee_mentees', JSON.stringify(state.mentees || []));
        } catch (innerErr) {
            console.error('Critical LocalStorage exhaustion:', innerErr);
        }
    }
}
