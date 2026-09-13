'use client';

import React, { useState } from 'react';
import { INITIAL_USERS, EnterpriseUser } from '@/lib/mock/users';
import { Users, UserCheck, UserX, FolderPlus, Search, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function CompanyAdminUsersPage() {
  const [users, setUsers] = useState<EnterpriseUser[]>(INITIAL_USERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const toggleStatus = (id: string) => {
    setUsers(prev =>
      prev.map(u => {
        if (u.id === id) {
          const nextStatus = u.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
          setToastMessage(`User ${u.name} status updated to ${nextStatus}.`);
          return { ...u, status: nextStatus };
        }
        return u;
      })
    );
    setTimeout(() => setToastMessage(null), 4000);
  };

  const reassignProject = (id: string) => {
    setToastMessage(`Reassigned project for user.`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const filteredUsers = users.filter(
    u =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Enterprise User & Workforce Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage project manager assignments, field supervisor credentials, and corridor permissions.
          </p>
        </div>
      </div>

      {toastMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Search */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search users by name, role, or email..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800/80">
              <tr>
                <th className="px-4 py-3.5">User</th>
                <th className="px-4 py-3.5">Assigned Role</th>
                <th className="px-4 py-3.5">Active Project & Corridor</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filteredUsers.map(user => (
                <tr key={user.id} className="hover:bg-slate-800/30 transition">
                  <td className="px-4 py-3.5">
                    <div className="font-bold text-white">{user.name}</div>
                    <div className="text-[11px] text-slate-500 font-mono mt-0.5">{user.email}</div>
                  </td>

                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded bg-blue-500/10 text-cyan-300 font-mono text-[11px] border border-blue-500/20">
                      {user.role}
                    </span>
                  </td>

                  <td className="px-4 py-3.5">
                    <div className="text-slate-200 font-medium">{user.project}</div>
                    <div className="text-[11px] text-slate-500">{user.assignedCorridor}</div>
                  </td>

                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span
                      className={cn(
                        'px-2 py-0.5 rounded text-[11px] font-bold font-mono',
                        user.status === 'ACTIVE'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-red-500/10 text-red-400 border border-red-500/20'
                      )}
                    >
                      {user.status}
                    </span>
                  </td>

                  <td className="px-4 py-3.5 whitespace-nowrap text-right space-x-2">
                    <button
                      type="button"
                      onClick={() => toggleStatus(user.id)}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
                    >
                      {user.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                    </button>

                    <button
                      type="button"
                      onClick={() => reassignProject(user.id)}
                      className="px-2.5 py-1 rounded-lg bg-blue-600/20 text-cyan-300 hover:bg-blue-600 hover:text-white border border-blue-500/30 text-xs"
                    >
                      Assign Project
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
