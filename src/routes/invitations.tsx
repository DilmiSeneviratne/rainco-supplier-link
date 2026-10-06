import { createFileRoute } from '@tanstack/react-router';
import { Invitations } from '@/components/rainco/business-pages';
import { pageMeta } from '@/components/rainco/workspace';
export const Route = createFileRoute('/invitations')({ head: () => pageMeta('Supplier Invitations','Rainco supplier invitation and registration email preview.'), component: Invitations });
