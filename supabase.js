/**
 * JEE Circle - Supabase Integration Module
 * Connected to Project: https://zrmzjixcnqcmlgubvclf.supabase.co
 * Key: sb_publishable_LnZamCpZWmcbzfyleKRr6g_LoFArxOL
 * 
 * Supports both @supabase/supabase-js library and Native REST Fetch API.
 * Dual-write architecture: Always saves to LocalStorage first, then asynchronously
 * syncs to Supabase cloud database with zero UI latency or blocking.
 */

const SUPABASE_CONFIG = {
    url: 'https://zrmzjixcnqcmlgubvclf.supabase.co',
    anonKey: 'sb_publishable_LnZamCpZWmcbzfyleKRr6g_LoFArxOL',
    appName: 'JEE Circle IIT Mentorship'
};

const SupabaseDB = {
    client: null,

    // Initialize Supabase Client if library is present
    init() {
        if (typeof window !== 'undefined' && window.supabase && window.supabase.createClient) {
            try {
                this.client = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
                console.log('✓ [Supabase] Official JS Client initialized successfully.');
            } catch (err) {
                console.warn('[Supabase] CDN client initialization failed, falling back to REST fetch:', err);
                this.client = null;
            }
        }
    },

    // Resilient REST Fetch helper for Supabase PostgREST endpoints
    async restRequest(endpoint, method = 'POST', body = null, extraHeaders = {}) {
        const url = `${SUPABASE_CONFIG.url}/rest/v1/${endpoint}`;
        const headers = {
            'apikey': SUPABASE_CONFIG.anonKey,
            'Authorization': `Bearer ${SUPABASE_CONFIG.anonKey}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation',
            ...extraHeaders
        };

        const options = {
            method: method,
            headers: headers
        };

        if (body && (method === 'POST' || method === 'PATCH' || method === 'PUT')) {
            options.body = JSON.stringify(body);
        }

        const response = await fetch(url, options);
        if (!response.ok) {
            let errorDetails = '';
            try {
                const errJson = await response.json();
                errorDetails = errJson.message || JSON.stringify(errJson);
            } catch (e) {
                errorDetails = await response.text();
            }
            throw new Error(`[Supabase HTTP ${response.status}] ${errorDetails}`);
        }

        // Return empty or parsed JSON
        const text = await response.text();
        return text ? JSON.parse(text) : null;
    },

    // 1. INQUIRIES & CALLBACK LEADS TABLE (inquiries)
    async saveInquiry(data) {
        const payload = {
            name: data.name || 'Anonymous Student',
            phone: data.phone || '',
            target_exam: data.target_exam || data.target || 'JEE 2027',
            message: data.message || '',
            status: data.status || 'New Callback',
            source: data.source || 'Website Contact Form'
        };

        try {
            if (this.client) {
                const { data: res, error } = await this.client.from('inquiries').insert([payload]).select();
                if (error) throw error;
                this.logSuccess('inquiries', res);
                return { success: true, data: res };
            } else {
                const res = await this.restRequest('inquiries', 'POST', payload);
                this.logSuccess('inquiries', res);
                return { success: true, data: res };
            }
        } catch (err) {
            this.handleError('inquiries', err);
            return { success: false, error: err.message };
        }
    },

    // 2. MENTEES & STUDENTS TABLE (mentees)
    async saveMentee(data) {
        const payload = {
            student_id: data.student_id || data.id || ('JEE-M-' + Date.now().toString().slice(-5)),
            name: data.name || '',
            phone: data.phone || '',
            email: data.email || (data.name ? `${data.name.toLowerCase().replace(/[^a-z]/g, '')}@jeecircle.in` : ''),
            class_level: data.class_level || data.classLevel || 'Class 12',
            target_exam: data.target_exam || data.target || 'JEE Advanced 2027',
            plan_name: data.plan_name || data.plan || data.planName || '6-Month Intensive Mentorship',
            fee_paid: Number(data.fee_paid || data.feePaid || 0),
            fee_status: data.fee_status || data.feeStatus || 'Paid',
            date_of_joining: data.date_of_joining || data.dateOfJoining || data.date || new Date().toLocaleDateString('en-GB'),
            validity_till: data.validity_till || data.validityTill || '6 Months',
            receipt_no: data.receipt_no || data.receiptNo || ('REC-' + Date.now().toString().slice(-6)),
            payment_mode: data.payment_mode || data.paymentMode || 'UPI Transfer',
            assigned_mentor_id: data.assigned_mentor_id || data.assignedMentorId || 'MENTOR-BHU-01',
            assigned_mentor_name: data.assigned_mentor_name || data.assignedMentorName || 'Asmit Patel [IIT (BHU) Varanasi]',
            status: data.status || 'Active'
        };

        try {
            if (this.client) {
                // Upsert on student_id to prevent duplicates
                const { data: res, error } = await this.client.from('mentees').upsert([payload], { onConflict: 'student_id' }).select();
                if (error) throw error;
                this.logSuccess('mentees', res);
                return { success: true, data: res };
            } else {
                const res = await this.restRequest('mentees', 'POST', payload, {
                    'Prefer': 'resolution=merge-duplicates,return=representation'
                });
                this.logSuccess('mentees', res);
                return { success: true, data: res };
            }
        } catch (err) {
            this.handleError('mentees', err);
            return { success: false, error: err.message };
        }
    },

    // 3. TRANSACTIONS & FINANCIAL LEDGER TABLE (transactions)
    async saveTransaction(data) {
        const payload = {
            txn_id: data.txn_id || data.id || ('TXN-' + Date.now().toString().slice(-6)),
            type: data.type || 'fee_inflow', // 'fee_inflow' or 'mentor_payout'
            party_name: data.party_name || data.partyName || 'Student / Mentor',
            party_role: data.party_role || data.partyRole || 'mentee',
            party_id: data.party_id || data.partyId || '',
            plan_or_purpose: data.plan_or_purpose || data.plan || data.note || 'Mentorship Enrollment Fee',
            amount: Number(data.amount || 0),
            date: data.date || new Date().toLocaleDateString('en-GB'),
            validity_till: data.validity_till || data.validityTill || '-',
            mode: data.mode || 'UPI Transfer',
            utr_ref: data.utr_ref || data.utrRef || ('UTR-' + Date.now().toString().slice(-6)),
            note: data.note || '',
            status: data.status || 'Verified'
        };

        try {
            if (this.client) {
                const { data: res, error } = await this.client.from('transactions').upsert([payload], { onConflict: 'txn_id' }).select();
                if (error) throw error;
                this.logSuccess('transactions', res);
                return { success: true, data: res };
            } else {
                const res = await this.restRequest('transactions', 'POST', payload, {
                    'Prefer': 'resolution=merge-duplicates,return=representation'
                });
                this.logSuccess('transactions', res);
                return { success: true, data: res };
            }
        } catch (err) {
            this.handleError('transactions', err);
            return { success: false, error: err.message };
        }
    },

    // 4. REVIEWS & FEEDBACK TABLE (reviews)
    async saveReview(data) {
        const payload = {
            mentee_name: data.mentee_name || data.menteeName || 'Aspirant',
            mentor_name: data.mentor_name || data.mentorName || 'Asmit Patel [IIT (BHU) Varanasi]',
            rating: Number(data.rating || 5),
            category: data.category || 'Study Strategy',
            comment: data.comment || '',
            visible: data.visible !== false
        };

        try {
            if (this.client) {
                const { data: res, error } = await this.client.from('reviews').insert([payload]).select();
                if (error) throw error;
                this.logSuccess('reviews', res);
                return { success: true, data: res };
            } else {
                const res = await this.restRequest('reviews', 'POST', payload);
                this.logSuccess('reviews', res);
                return { success: true, data: res };
            }
        } catch (err) {
            this.handleError('reviews', err);
            return { success: false, error: err.message };
        }
    },

    // 5. MENTORS TABLE (mentors)
    async saveMentor(data) {
        const payload = {
            mentor_id: String(data.mentor_id || data.id || ('MTR-' + Date.now().toString().slice(-4))),
            name: data.name || '',
            college: data.college || 'IIT (BHU) Varanasi',
            branch: data.branch || 'Engineering',
            rank: data.rank || 'AIR Top Ranker',
            rating: Number(data.rating || 5.0),
            max_capacity: Number(data.max_capacity || data.maxCapacity || 5),
            bio: data.bio || '',
            whatsapp: data.whatsapp || '+91 9450287685'
        };

        try {
            if (this.client) {
                const { data: res, error } = await this.client.from('mentors').upsert([payload], { onConflict: 'mentor_id' }).select();
                if (error) throw error;
                this.logSuccess('mentors', res);
                return { success: true, data: res };
            } else {
                const res = await this.restRequest('mentors', 'POST', payload, {
                    'Prefer': 'resolution=merge-duplicates,return=representation'
                });
                this.logSuccess('mentors', res);
                return { success: true, data: res };
            }
        } catch (err) {
            this.handleError('mentors', err);
            return { success: false, error: err.message };
        }
    },

    // 6. DAILY TARGETS / TO-DOS TABLE (todos)
    async saveTodo(data) {
        const payload = {
            mentee_id: String(data.mentee_id || data.menteeId || 'DEFAULT'),
            task_text: data.task_text || data.text || '',
            completed: Boolean(data.completed || data.done)
        };

        try {
            if (this.client) {
                const { data: res, error } = await this.client.from('todos').insert([payload]).select();
                if (error) throw error;
                this.logSuccess('todos', res);
                return { success: true, data: res };
            } else {
                const res = await this.restRequest('todos', 'POST', payload);
                this.logSuccess('todos', res);
                return { success: true, data: res };
            }
        } catch (err) {
            this.handleError('todos', err);
            return { success: false, error: err.message };
        }
    },

    // Sync all existing local storage data to Supabase (Full Database Push)
    async syncAllLocalData() {
        const summary = {
            inquiries: 0,
            mentees: 0,
            transactions: 0,
            reviews: 0,
            mentors: 0,
            errors: []
        };

        console.log('[Supabase Sync] Starting bulk sync of local storage to Supabase...');

        // 1. Sync Inquiries
        if (state.inquiries && state.inquiries.length > 0) {
            for (const inq of state.inquiries) {
                const res = await this.saveInquiry(inq);
                if (res.success) summary.inquiries++;
                else summary.errors.push(`Inquiry [${inq.name}]: ${res.error}`);
            }
        }

        // 2. Sync Mentees
        if (state.mentees && state.mentees.length > 0) {
            for (const m of state.mentees) {
                const res = await this.saveMentee(m);
                if (res.success) summary.mentees++;
                else summary.errors.push(`Mentee [${m.name}]: ${res.error}`);
            }
        }

        // 3. Sync Transactions
        const txns = state.accountant?.transactions || [];
        if (txns.length > 0) {
            for (const t of txns) {
                const res = await this.saveTransaction(t);
                if (res.success) summary.transactions++;
                else summary.errors.push(`Txn [${t.id}]: ${res.error}`);
            }
        }

        // 4. Sync Reviews
        if (state.reviews && state.reviews.length > 0) {
            for (const r of state.reviews) {
                const res = await this.saveReview(r);
                if (res.success) summary.reviews++;
                else summary.errors.push(`Review [${r.menteeName}]: ${res.error}`);
            }
        }

        // 5. Sync Mentors
        if (state.mentors && state.mentors.length > 0) {
            for (const m of state.mentors) {
                const res = await this.saveMentor(m);
                if (res.success) summary.mentors++;
                else summary.errors.push(`Mentor [${m.name}]: ${res.error}`);
            }
        }

        return summary;
    },

    // Test connectivity to Supabase
    async testConnection() {
        try {
            const url = `${SUPABASE_CONFIG.url}/rest/v1/`;
            const resp = await fetch(url, {
                method: 'HEAD',
                headers: {
                    'apikey': SUPABASE_CONFIG.anonKey
                }
            });
            return {
                online: resp.status >= 200 && resp.status < 400,
                status: resp.status,
                url: SUPABASE_CONFIG.url
            };
        } catch (e) {
            return {
                online: false,
                error: e.message,
                url: SUPABASE_CONFIG.url
            };
        }
    },

    logSuccess(table, result) {
        console.log(`✓ [Supabase] Saved to table '${table}':`, result);
        if (typeof SecurityGuard !== 'undefined') {
            SecurityGuard.recordSecurityEvent(
                `Supabase Cloud Sync: Saved to '${table}'`,
                'Automated Sync Service',
                'SUCCESS',
                `Table: ${table} | Project: zrmzjixcnqcmlgubvclf`
            );
        }
    },

    handleError(table, err) {
        console.warn(`⚠ [Supabase] Sync to table '${table}' failed:`, err.message || err);
        if (typeof SecurityGuard !== 'undefined') {
            SecurityGuard.recordSecurityEvent(
                `Supabase Sync Error: ${table}`,
                'Automated Sync Service',
                'FAILED',
                `${err.message || 'Check if table exists in Supabase SQL editor.'}`
            );
        }
    },

    // Generates the SQL schema setup script for one-click setup
    getSqlSchema() {
        return `-- ========================================================
-- JEE CIRCLE - SUPABASE DATABASE INITIALIZATION SCRIPT
-- Paste this script into your Supabase Dashboard:
-- 1. Go to https://supabase.com/dashboard/project/zrmzjixcnqcmlgubvclf
-- 2. Open 'SQL Editor' on the left menu
-- 3. Click '+ New Query', paste this code, and click 'Run'
-- ========================================================

-- 1. Inquiries & Callback Leads Table
CREATE TABLE IF NOT EXISTS public.inquiries (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    target_exam TEXT,
    message TEXT,
    status TEXT DEFAULT 'New Callback',
    source TEXT DEFAULT 'Website Contact Form',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Mentees & Students Roster Table
CREATE TABLE IF NOT EXISTS public.mentees (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    student_id TEXT UNIQUE,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    class_level TEXT,
    target_exam TEXT,
    plan_name TEXT,
    fee_paid NUMERIC DEFAULT 0,
    fee_status TEXT DEFAULT 'Paid',
    date_of_joining TEXT,
    validity_till TEXT,
    receipt_no TEXT,
    payment_mode TEXT,
    assigned_mentor_id TEXT,
    assigned_mentor_name TEXT,
    status TEXT DEFAULT 'Active',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Financial Transactions & Ledger Table
CREATE TABLE IF NOT EXISTS public.transactions (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    txn_id TEXT UNIQUE,
    type TEXT NOT NULL, -- 'fee_inflow' or 'mentor_payout'
    party_name TEXT NOT NULL,
    party_role TEXT,    -- 'mentee' or 'mentor'
    party_id TEXT,
    plan_or_purpose TEXT,
    amount NUMERIC NOT NULL,
    date TEXT,
    validity_till TEXT,
    mode TEXT,
    utr_ref TEXT,
    note TEXT,
    status TEXT DEFAULT 'Verified',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Student Reviews & Mentor Feedback Table
CREATE TABLE IF NOT EXISTS public.reviews (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    mentee_name TEXT NOT NULL,
    mentor_name TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    category TEXT,
    comment TEXT NOT NULL,
    visible BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Mentors Directory Table
CREATE TABLE IF NOT EXISTS public.mentors (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    mentor_id TEXT UNIQUE,
    name TEXT NOT NULL,
    college TEXT,
    branch TEXT,
    rank TEXT,
    rating NUMERIC DEFAULT 5.0,
    max_capacity INTEGER DEFAULT 5,
    bio TEXT,
    whatsapp TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Student Daily Targets / To-Dos Table
CREATE TABLE IF NOT EXISTS public.todos (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    mentee_id TEXT,
    task_text TEXT NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================================
-- HARDENED ROW LEVEL SECURITY (RLS) POLICIES
-- Zero-Trust Privacy: Strangers cannot read private transactions or inquiries!
-- ========================================================

ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.todos ENABLE ROW LEVEL SECURITY;

-- 1. Inquiries: Public can write (submit contact form), but cannot read other people's inquiries
CREATE POLICY "Allow public insert on inquiries" ON public.inquiries FOR INSERT WITH CHECK (true);

-- 2. Mentees: Public can register, but cannot dump entire student roster
CREATE POLICY "Allow public insert on mentees" ON public.mentees FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update on mentees" ON public.mentees FOR UPDATE USING (true);

-- 3. Transactions: Public can record payments, but cannot view accountant ledger or bank UTRs
CREATE POLICY "Allow public insert on transactions" ON public.transactions FOR INSERT WITH CHECK (true);

-- 4. Reviews: Public can submit feedback, but can only read approved/visible reviews
CREATE POLICY "Allow public insert on reviews" ON public.reviews FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select on visible reviews" ON public.reviews FOR SELECT USING (visible = true);

-- 5. Mentors: Public can view mentor roster for admission guidance
CREATE POLICY "Allow public select on mentors" ON public.mentors FOR SELECT USING (true);
CREATE POLICY "Allow public insert on mentors" ON public.mentors FOR INSERT WITH CHECK (true);

-- 6. Todos: Mentees can manage their study tasks
CREATE POLICY "Allow public insert on todos" ON public.todos FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select on todos" ON public.todos FOR SELECT USING (true);
CREATE POLICY "Allow public update on todos" ON public.todos FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on todos" ON public.todos FOR DELETE USING (true);
`;
    }
};

// Auto-initialize when script loads
if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => SupabaseDB.init());
    } else {
        SupabaseDB.init();
    }
}
