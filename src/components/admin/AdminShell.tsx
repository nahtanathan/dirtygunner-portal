import { ReactNode } from 'react';
import PageShell from '@/components/layout/PageShell';

export function AdminShell({ children }: { children: ReactNode }) {
  return <PageShell>{children}</PageShell>;
}