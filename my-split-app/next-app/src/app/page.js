import { getMembers, getTransactions } from '../actions/data';
import MainView from '../components/MainView';

// Revalidate every 0 seconds (dynamic) or use standard action revalidation
// 'force-dynamic' ensures we fetch fresh data on every request
export const dynamic = 'force-dynamic';

export default async function Page() {
  const members = await getMembers();
  const rawTransactions = await getTransactions();

  // Create Lookup Map
  const memberMap = {};
  members.forEach(m => {
    memberMap[m.id] = m.name;
  });

  // Transform Transactions using IDs to lookup Names
  // rawTransactions expected: { id, title, amount, payer_id, for_who_ids (array), date }
  const transactions = rawTransactions.map(t => {
    // Safety check for arrays
    const targetIds = Array.isArray(t.for_who_ids) ? t.for_who_ids : [];

    // Safety check for keys (assuming snake_case from supabase)
    // Note: If you created table with camelCase, adjust here. Supabase usually defaults to what you write.
    // I assumed snake_case in fetch.

    return {
      ...t,
      payer_name: memberMap[t.payer_id] || 'Unknown',
      for_who_names: targetIds.map(id => memberMap[id] || 'Unknown')
    };
  });

  return (
    <MainView members={members} transactions={transactions} />
  );
}
