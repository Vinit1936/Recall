import type { Metadata } from 'next';
import { ProblemsTable } from '@/components/problems-table';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Track and manage your LeetCode and DSA problem revision queue.',
};

export default function DashboardPage() {
  return <ProblemsTable />;
}
