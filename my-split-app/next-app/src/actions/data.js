'use server';

import { supabase } from '../lib/supabaseClient';
import { revalidatePath } from 'next/cache';

/**
 * Fetch all members
 */
export async function getMembers() {
    const { data, error } = await supabase
        .from('members')
        .select('*')
        .order('created_at', { ascending: true });

    if (error) {
        console.error('Error fetching members:', error);
        return [];
    }
    return data;
}

/**
 * Add a new member
 */
export async function addMember(name) {
    const { error } = await supabase
        .from('members')
        .insert([{ name }]);

    if (error) throw new Error(error.message);
    revalidatePath('/');
}

/**
 * Update a member
 */
export async function updateMember(id, name) {
    const { error } = await supabase
        .from('members')
        .update({ name })
        .eq('id', id);

    if (error) throw new Error(error.message);
    revalidatePath('/');
}

/**
 * Delete a member
 */
export async function deleteMember(id) {
    const { error } = await supabase
        .from('members')
        .delete()
        .eq('id', id);

    if (error) throw new Error(error.message);
    revalidatePath('/');
}

/**
 * Fetch all transactions
 */
export async function getTransactions() {
    // We fetch raw data. 
    // payer_id and for_who_ids (Array) are stored.
    const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: false });

    if (error) {
        console.error('Error fetching transactions:', error);
        return [];
    }
    return data;
}

/**
 * Add a transaction
 */
export async function addTransaction(transactionData) {
    // transactionData expected: { title, amount, payer_id, for_who_ids, date }
    const { error } = await supabase
        .from('transactions')
        .insert([transactionData]);

    if (error) throw new Error(error.message);
    revalidatePath('/');
}

/**
 * Update a transaction
 */
export async function updateTransaction(id, transactionData) {
    const { error } = await supabase
        .from('transactions')
        .update(transactionData)
        .eq('id', id);

    if (error) throw new Error(error.message);
    revalidatePath('/');
}

/**
 * Delete a transaction
 */
export async function deleteTransaction(id) {
    const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);

    if (error) throw new Error(error.message);
    revalidatePath('/');
}
