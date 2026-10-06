import { createFileRoute } from '@tanstack/react-router';
import { Registration } from '@/components/rainco/registration';
import { pageMeta } from '@/components/rainco/workspace';
export const Route = createFileRoute('/')({ head: () => pageMeta('Supplier Registration','Rainco invitation-based supplier registration with contacts, addresses, and required business documents.'), component: Registration });
