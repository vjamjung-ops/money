// supabase.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'

const SUPABASE_URL = 'https://xxwnsmmdtmnxzlxjktnv.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4d25zbW1kdG1ueHpseGprdG52Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUwOTM2ODUsImV4cCI6MjA3MDY2OTY4NX0.cik6US_wkUrq6Indv8hBpNz1Vgr1Vo2K-aY6QAyy0vU'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// ฟังก์ชันจัดการ user ID
function getUserId() {
    let userId = localStorage.getItem('userId')
    if (!userId) {
        userId = 'user_' + Date.now() + '_' + Math.random().toString(36)
        localStorage.setItem('userId', userId)
    }
    return userId
}

// บันทึกรายการ
async function saveTransactionToSupabase(transaction) {
    const { data, error } = await supabase
        .from('transactions')
        .insert([{
            ...transaction,
            user_id: getUserId()
        }])
    
    if (error) console.error('Error:', error)
    return data
}

// ดึงรายการ
async function getTransactionsFromSupabase() {
    const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', getUserId())
        .order('date', { ascending: false })
    
    if (error) console.error('Error:', error)
    return data || []
}

// ลบรายการ
async function deleteTransactionFromSupabase(id) {
    const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id)
        .eq('user_id', getUserId())
    
    if (error) console.error('Error:', error)
}

// Export functions
window.supabaseDB = {
    saveTransaction: saveTransactionToSupabase,
    getTransactions: getTransactionsFromSupabase,
    deleteTransaction: deleteTransactionFromSupabase
}