import { createContext, useContext, useState, type ReactNode } from 'react';
import { Link, useRouterState } from '@tanstack/react-router';
import { Building2, ChevronDown, CircleHelp, ClipboardCheck, FileCheck2, FileText, Layers3, Mail, ShieldCheck, Star, UserRound, Umbrella } from 'lucide-react';
import { Button } from '@/components/ui/button';

export type BusinessType = 'Individual' | 'Corporate' | 'Government';
export type DocumentRow = { code: string; name: string };
export const businessTypes: BusinessType[] = ['Individual', 'Corporate', 'Government'];
const initialDocuments: Record<BusinessType, DocumentRow[]> = {
 Corporate: [{ code: 'COR-001', name: 'Certificate of Incorporation' }, { code: 'COR-002', name: 'VAT Registration Certificate' }, { code: 'COR-003', name: 'Bank Confirmation Letter' }, { code: 'COR-004', name: 'Audited Financial Statements' }],
 Individual: [{ code: 'IND-001', name: 'National Identity Card' }, { code: 'IND-002', name: 'Bank Confirmation Letter' }],
 Government: [{ code: 'GOV-001', name: 'Government Establishment Certificate' }, { code: 'GOV-002', name: 'Authorized Signatory Letter' }],
};
type WorkspaceContextValue = { role: 'supplier' | 'rainco'; setRole: (role: 'supplier' | 'rainco') => void; documents: Record<BusinessType, DocumentRow[]>; setDocuments: (documents: Record<BusinessType, DocumentRow[]>) => void };
const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);
export function useWorkspace() { const context = useContext(WorkspaceContext); if (!context) throw new Error('Workspace provider required'); return context; }
export function WorkspaceProvider({ children }: { children: ReactNode }) {
 const [role, setRole] = useState<'supplier' | 'rainco'>('supplier');
 const [documents, setDocuments] = useState(initialDocuments);
 return <WorkspaceContext.Provider value={{ role, setRole, documents, setDocuments }}>{children}</WorkspaceContext.Provider>;
}
const portalNav = [{ to: '/' as const, label: 'Supplier Registration', icon: UserRound }, { to: '/ratings' as const, label: 'My Ratings', icon: Star }, { to: '/quotations' as const, label: 'Purchase Quotations', icon: FileText }];
const evaluationNav = [{ to: '/checklist' as const, label: 'Supplier Checklist', icon: FileCheck2 }, { to: '/evaluation' as const, label: 'Supplier Evaluation', icon: ClipboardCheck }, { to: '/invitations' as const, label: 'Supplier Invitations', icon: Mail }];
export function WorkspaceShell({ children }: { children: ReactNode }) {
 const { role, setRole } = useWorkspace();
 const pathname = useRouterState({ select: state => state.location.pathname });
 return <div className="workspace"><aside className="sidebar">
  <Link to="/" className="brand"><div className="brand-mark"><Umbrella size={22}/></div><div><strong>rainco<span className="brand-period">.</span></strong><small>Procurement Suite</small></div></Link>
  <div className="sidebar-nav"><div className="nav-caption">WORKSPACE</div>
  <Button variant="module" data-active={role === 'supplier'} onClick={() => setRole('supplier')}><Layers3/>Supplier Portal{role === 'supplier' && <ChevronDown className="ml-auto"/>}</Button>
  {role === 'supplier' && <div className="subnav">{portalNav.map(item => <Button key={item.to} asChild variant="navigation" data-active={pathname === item.to}><Link to={item.to}><item.icon/>{item.label}</Link></Button>)}</div>}
  <Button variant="module" data-active={role === 'rainco'} onClick={() => setRole('rainco')}><ClipboardCheck/>Supplier Evaluation{role === 'rainco' && <ChevronDown className="ml-auto"/>}</Button>
  {role === 'rainco' && <div className="subnav">{evaluationNav.map(item => <Button key={item.to} asChild variant="navigation" data-active={pathname === item.to}><Link to={item.to}><item.icon/>{item.label}</Link></Button>)}</div>}
  </div>
  <div className="sidebar-bottom"><div className="integration"><div className="flex items-center justify-between"><strong>SAP Business One</strong><span className="status-dot"/></div><small>Integration preview · Not connected</small><div className="integration-line"><Building2 size={14}/> Business partner master</div></div>
  <div className="profile"><span className="avatar">{role === 'supplier' ? 'NT' : 'RC'}</span><div><strong>{role === 'supplier' ? 'Northwind Traders' : 'Rainco Procurement'}</strong><small>{role === 'supplier' ? 'Supplier' : 'Rainco user'} · Preview</small></div><ShieldCheck size={16}/></div></div>
 </aside><div className="workspace-main"><header className="topbar"><div className="breadcrumb"><span>{role === 'supplier' ? 'Supplier Portal' : 'Supplier Evaluation'}</span><span>/</span><strong>{[...portalNav, ...evaluationNav].find(item => item.to === pathname)?.label ?? 'Registration'}</strong></div><span className="preview-label"><span className="status-dot"/>Interactive wireframe</span><CircleHelp size={18} className="text-muted-foreground"/></header><main className="main-content">{children}</main><footer className="workspace-footer"><span>© 2026 Rainco. Procurement Suite</span><span>Wireframe · Sample data · No live transactions</span></footer></div></div>;
}
export function AccessNotice({ audience }: { audience: 'supplier' | 'rainco' }) {
 const { setRole } = useWorkspace();
 return <div className="access-notice"><ShieldCheck size={32}/><h1>{audience === 'supplier' ? 'Supplier Portal' : 'Supplier Evaluation'}</h1><p>This view is reserved for {audience === 'supplier' ? 'suppliers' : 'Rainco users'}.</p><Button onClick={() => setRole(audience)}>Preview as {audience === 'supplier' ? 'a supplier' : 'a Rainco user'}</Button><small>Audience simulation only; no secure sign-in is connected.</small></div>;
}
export function PageHeading({ eyebrow, title, description, children }: { eyebrow: string; title: string; description: string; children?: ReactNode }) { return <div className="page-heading"><div><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{description}</p></div>{children}</div>; }
export function pageMeta(title: string, description: string) { return { meta: [{ title: `${title} | Rainco Procurement` }, { name: 'description', content: description }, { property: 'og:title', content: `${title} | Rainco Procurement` }, { property: 'og:description', content: description }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' }] }; }
