'use client';

import React, { useState } from 'react';
import { Building2, Search, Plus, Filter, CheckCircle2, AlertTriangle, ShieldCheck, Database, Server } from 'lucide-react';
import { StatCard } from '@/components/shared/StatCard';

interface Tenant {
  id: string;
  name: string;
  code: string;
  type: 'GOVERNMENT_AUTHORITY' | 'EPC_CONTRACTOR' | 'SUBCONTRACTOR' | 'MONITORING_AGENCY';
  activeProjects: number;
  activeUsers: number;
  storageUsed: string;
  tier: 'ENTERPRISE_PLUS' | 'GOVERNMENT_NODAL' | 'STANDARD_EPC';
  status: 'ACTIVE' | 'SUSPENDED' | 'PROVISIONING';
  createdDate: string;
  contactPerson: string;
}

const INITIAL_TENANTS: Tenant[] = [
  {
    id: 'TEN-001',
    name: 'National Infrastructure Monitoring Authority',
    code: 'NIMA-GOV',
    type: 'GOVERNMENT_AUTHORITY',
    activeProjects: 4,
    activeUsers: 34,
    storageUsed: '42.8 GB',
    tier: 'GOVERNMENT_NODAL',
    status: 'ACTIVE',
    createdDate: '2025-01-10',
    contactPerson: 'Dr. Anandvardhan Sharma, IAS',
  },
  {
    id: 'TEN-002',
    name: 'Enterprise Infrastructure Ltd',
    code: 'EIL-EPC',
    type: 'EPC_CONTRACTOR',
    activeProjects: 3,
    activeUsers: 68,
    storageUsed: '128.4 GB',
    tier: 'ENTERPRISE_PLUS',
    status: 'ACTIVE',
    createdDate: '2025-02-15',
    contactPerson: 'Er. Rajeshwar Verma, PMP',
  },
  {
    id: 'TEN-003',
    name: 'Assam State Highway Development Board',
    code: 'ASHDB-STATE',
    type: 'GOVERNMENT_AUTHORITY',
    activeProjects: 2,
    activeUsers: 19,
    storageUsed: '24.1 GB',
    tier: 'GOVERNMENT_NODAL',
    status: 'ACTIVE',
    createdDate: '2025-03-01',
    contactPerson: 'Er. J. N. Gogoi',
  },
  {
    id: 'TEN-004',
    name: 'National Highway Builders Corp',
    code: 'NHBC-EPC',
    type: 'EPC_CONTRACTOR',
    activeProjects: 2,
    activeUsers: 45,
    storageUsed: '86.2 GB',
    tier: 'ENTERPRISE_PLUS',
    status: 'ACTIVE',
    createdDate: '2025-04-12',
    contactPerson: 'Sunil Mathur',
  },
  {
    id: 'TEN-005',
    name: 'Brahmaputra Subsurface Engineering Ltd',
    code: 'BSE-SUB',
    type: 'SUBCONTRACTOR',
    activeProjects: 1,
    activeUsers: 12,
    storageUsed: '15.6 GB',
    tier: 'STANDARD_EPC',
    status: 'ACTIVE',
    createdDate: '2025-05-20',
    contactPerson: 'Kalyan Hazarika',
  },
  {
    id: 'TEN-006',
    name: 'Third-Party Independent QA Audits Ltd',
    code: 'TPI-QA',
    type: 'MONITORING_AGENCY',
    activeProjects: 3,
    activeUsers: 8,
    storageUsed: '11.3 GB',
    tier: 'STANDARD_EPC',
    status: 'ACTIVE',
    createdDate: '2025-06-05',
    contactPerson: 'Dr. Meenakshi Sundaram',
  },
];

export default function AdminTenantsPage() {
  const [tenants, setTenants] = useState<Tenant[]>(INITIAL_TENANTS);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string>('ALL');

  const filteredTenants = tenants.filter(t => {
    const matchesSearch =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.code.toLowerCase().includes(search.toLowerCase()) ||
      t.contactPerson.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === 'ALL' || t.type === filterType;
    return matchesSearch && matchesType;
  });

  const toggleStatus = (id: string) => {
    setTenants(prev =>
      prev.map(t =>
        t.id === id ? { ...t, status: t.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE' } : t
      )
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-mono text-cyan-400 mb-1.5">
            <Building2 className="w-3.5 h-3.5" />
            <span>Multi-Tenant Architecture</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Tenant Organizations Directory
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Provision, manage, and isolate government nodal authorities, EPC contractors, and QA partners.
          </p>
        </div>

        <button
          onClick={() => alert('Tenant self-provisioning is simulated in this prototype. New tenants are isolated via workspace IDs.')}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-500/20 transition"
        >
          <Plus className="w-4 h-4" />
          Provision New Tenant
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard title="Total Tenants" value={tenants.length} subtitle="Active organizations" icon={Building2} variant="cyan" />
        <StatCard title="Total Projects" value="15" subtitle="Across all tenants" icon={Server} variant="blue" />
        <StatCard title="Provisioned Storage" value="308 GB" subtitle="AES-256 encrypted" icon={Database} variant="emerald" />
        <StatCard title="Isolation Status" value="100% Strict" subtitle="Zero cross-tenant bleed" icon={ShieldCheck} variant="amber" />
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search tenant, code, or lead..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-blue-500 w-full sm:w-auto"
          >
            <option value="ALL">All Organization Types</option>
            <option value="GOVERNMENT_AUTHORITY">Government Authority</option>
            <option value="EPC_CONTRACTOR">EPC Contractor</option>
            <option value="SUBCONTRACTOR">Subcontractor</option>
            <option value="MONITORING_AGENCY">Monitoring Agency</option>
          </select>
        </div>
      </div>

      {/* Tenants Table */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/60 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800/80">
              <tr>
                <th className="px-4 py-3">Tenant Details</th>
                <th className="px-4 py-3">Type & Tier</th>
                <th className="px-4 py-3">Usage Metrics</th>
                <th className="px-4 py-3">Lead Contact</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredTenants.map(t => (
                <tr key={t.id} className="hover:bg-slate-800/30 transition">
                  <td className="px-4 py-3.5">
                    <div className="font-semibold text-white">{t.name}</div>
                    <div className="text-[11px] font-mono text-cyan-400 mt-0.5">{t.code} • {t.id}</div>
                  </td>

                  <td className="px-4 py-3.5">
                    <div className="inline-block px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono text-[10px]">
                      {t.type.replace('_', ' ')}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1 font-mono">{t.tier}</div>
                  </td>

                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3 text-slate-300">
                      <span>{t.activeProjects} Projects</span>
                      <span>•</span>
                      <span>{t.activeUsers} Users</span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5 font-mono">{t.storageUsed} data stored</div>
                  </td>

                  <td className="px-4 py-3.5">
                    <div className="font-medium text-slate-200">{t.contactPerson}</div>
                    <div className="text-[11px] text-slate-400">Created: {t.createdDate}</div>
                  </td>

                  <td className="px-4 py-3.5">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono ${
                        t.status === 'ACTIVE'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}
                    >
                      {t.status === 'ACTIVE' ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                      {t.status}
                    </span>
                  </td>

                  <td className="px-4 py-3.5 text-right">
                    <button
                      onClick={() => toggleStatus(t.id)}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] transition"
                    >
                      {t.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
