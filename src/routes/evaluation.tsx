import { createFileRoute } from '@tanstack/react-router';
import { Evaluation } from '@/components/rainco/business-pages';
import { pageMeta } from '@/components/rainco/workspace';
export const Route = createFileRoute('/evaluation')({ head: () => pageMeta('Supplier Evaluation','Rainco supplier performance evaluation wireframe.'), component: Evaluation });
