'use client';

import React, { useState } from 'react';
import { Users, Search, Filter, ShieldCheck, Mail, Phone, CheckCircle2, XCircle, KeyRound, UserCheck } from 'lucide-react';
import { StatCard } from '@/components/shared/StatCard';
import { INITIAL_USERS, EnterpriseUser } from '@/lib/mock/users';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<EnterpriseUser[]>(INITIAL_USERS);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('ALL');

  const filteredUsers = users.filter(u => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.assignedCorridor.toLowerCase().includes(search.toLowerCase()) ||
      u.id.toLowerCase().includes(search.toLowerCase());
    const matchesRole = filterRole === 'ALL' || u.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const toggleUserStatus = (id: string) => {
    setUsers(prev =>
      prev.map(u =>
        u.id === id ? { ...u, status: u.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' } : u
      )
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-mono text-cyan-400 mb-1.5">
            <Users className="w-3.5 h-3.5" />
            <span>Platform Identity Directory</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Global User Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Centrally audit and control accounts across Government Authorities, EPC Contractors, and Platform Admins.
          </p>
        </div>

        <button
          onClick={() => alert('New user registration is governed by tenant admins or platform SSO.')}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-500/20 transition"
        >
          <UserCheck className="w-4 h-4" />
          Create Platform Account
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard title="Total Accounts" value={users.length} subtitle="System identities" icon={Users} variant="cyan" />
        <StatCard title="Active Sessions" value="28" subtitle="Real-time tokens" icon={KeyRound} variant="blue" />
        <StatCard title="MFA Enforced" value="100%" subtitle="FIDO2 / TOTP required" icon={ShieldCheck} variant="emerald" />
        <StatCard title="Privileged Admins" value="2" subtitle="Super administrator tier" icon={KeyRound} variant="amber" />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search name, email, ID, or corridor..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={filterRole}
            onChange={e => setFilterRole(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-blue-500 w-full sm:w-auto"
          >
            <option value="ALL">All Roles</option>
            <option value="GOVERNMENT_OFFICER">Government Officer</option>
            <option value="PROJECT_MANAGER">Project Manager</option>
            <option value="SITE_MANAGER">Site Manager</option>
            <option value="COMPANY_ADMIN">Company Admin</option>
            <option value="PLATFORM_ADMIN">Platform Admin</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/60 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800/80">
              <tr>
                <th className="px-4 py-3">User & ID</th>
                <th className="px-4 py-3">Assigned Role</th>
                <th className="px-4 py-3">Corridor / Jurisdiction</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredUsers.map(u => (
                <tr key={u.id} className="hover:bg-slate-800/30 transition">
                  <td className="px-4 py-3.5">
                    <div className="font-semibold text-white">{u.name}</div>
                    <div className="text-[11px] font-mono text-cyan-400 mt-0.5">{u.id}</div>
                  </td>

                  <td className="px-4 py-3.5">
                    <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono text-[10px]">
                      {u.role}
                    </span>
                    <div className="text-[11px] text-slate-400 mt-1">{u.project}</div>
                  </td>

                  <td className="px-4 py-3.5 max-w-xs truncate">
                    <div className="text-slate-300">{u.assignedCorridor}</div>
                  </td>

                  <td className="px-4 py-3.5 font-mono text-[11px]">
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <Mail className="w-3 h-3 text-slate-500" />
                      {u.email}
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-400 mt-0.5">
                      <Phone className="w-3 h-3 text-slate-500" />
                      {u.phone}
                    </div>
                  </td>

                  <td className="px-4 py-3.5">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono ${
                        u.status === 'ACTIVE'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}
                    >
                      {u.status === 'ACTIVE' ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      {u.status}
                    </span>
                  </td>

                  <td className="px-4 py-3.5 text-right">
                    <button
                      onClick={() => toggleUserStatus(u.id)}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] transition"
                    >
                      {u.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
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
