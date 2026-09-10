'use client';

import React, { useState } from 'react';
import { useTasks } from '@/hooks/useTasks';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { GovReviewBadge } from '@/components/shared/GovReviewBadge';
import { RiskBadge } from '@/components/shared/RiskBadge';
import { ProgressBar } from '@/components/shared/ProgressBar';
import { Modal } from '@/components/shared/Modal';
import { INITIAL_L6_ACTIVITIES } from '@/lib/mock/activities';
import {
  CheckSquare,
  Plus,
  Search,
  Filter,
  Calendar,
  Layers,
  User,
  AlertCircle,
  Image as ImageIcon,
  CheckCircle2,
} from 'lucide-react';
import { DailyTask } from '@/types';
import { cn } from '@/lib/utils';

export default function PMDailyTasksPage() {
  const { tasks, createDailyTask, updateTask } = useTasks('PRJ-ASSAM-025');

  const [activeFilter, setActiveFilter] = useState<'ALL' | 'TODAY' | 'OVERDUE' | 'INCOMPLETE' | 'HIGH_RISK'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State for creating daily task
  const [formActivityCode, setFormActivityCode] = useState('L6-PIP-0245');
  const [formTaskName, setFormTaskName] = useState('');
  const [formDate, setFormDate] = useState('2026-09-10');
  const [formDeadline, setFormDeadline] = useState('2026-09-11');
  const [formPlannedQty, setFormPlannedQty] = useState(20);
  const [formUnit, setFormUnit] = useState('Joints');
  const [formSiteManager, setFormSiteManager] = useState('Vikramjit Singh');
  const [formPriority, setFormPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'>('HIGH');
  const [formExpectedCompletion, setFormExpectedCompletion] = useState('18:00');
  const [formInstructions, setFormInstructions] = useState('');

  // Handle Create Task Submission
  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedAct = INITIAL_L6_ACTIVITIES.find(a => a.code === formActivityCode) || INITIAL_L6_ACTIVITIES[0];

    createDailyTask({
      projectId: 'PRJ-ASSAM-025',
      activityId: selectedAct.id,
      activityCode: selectedAct.code,
      taskName: formTaskName || `${selectedAct.name} Daily Execution`,
      date: formDate,
      deadline: formDeadline,
      location: selectedAct.location,
      chainage: selectedAct.chainage,
      unit: formUnit || selectedAct.unit,
      plannedQuantity: Number(formPlannedQty),
      plannedProgress: 0,
      assignedSiteManagerId: 'SM-X72K91AB',
      assignedSiteManagerName: formSiteManager,
      priority: formPriority,
      status: 'PLANNED',
      instructions: formInstructions,
      expectedCompletion: `${formDeadline} ${formExpectedCompletion}`,
      risk: formPriority === 'CRITICAL' ? 'CRITICAL' : formPriority === 'HIGH' ? 'HIGH' : 'MEDIUM',
    });

    setToastMessage(`Official daily task "${formTaskName || selectedAct.name}" assigned to ${formSiteManager}.`);
    setIsCreateModalOpen(false);

    // Reset Form
    setFormTaskName('');
    setFormInstructions('');

    setTimeout(() => setToastMessage(null), 5000);
  };

  // Filter tasks
  const filteredTasks = tasks.filter(t => {
    const matchesSearch =
      t.taskName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.activityCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.assignedSiteManagerName.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (activeFilter === 'TODAY') return t.date === '2026-09-10';
    if (activeFilter === 'OVERDUE') return t.status === 'OVERDUE';
    if (activeFilter === 'INCOMPLETE') return t.status === 'INCOMPLETE';
    if (activeFilter === 'HIGH_RISK') return t.risk === 'HIGH' || t.risk === 'CRITICAL';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Official Daily Task Execution Board
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Project Manager creates and governs the master daily work assignments for site supervisors.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition shadow-lg shadow-blue-900/30 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Create Daily Task</span>
        </button>
      </div>

      {/* Toast */}
      {toastMessage && (
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Filters Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search daily tasks by name, L6 activity or supervisor..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
          {[
            { id: 'ALL', label: 'All Tasks' },
            { id: 'TODAY', label: "Today's" },
            { id: 'INCOMPLETE', label: 'Incomplete' },
            { id: 'OVERDUE', label: 'Overdue' },
            { id: 'HIGH_RISK', label: 'High Risk' },
          ].map(f => (
            <button
              key={f.id}
              type="button"
              onClick={() => setActiveFilter(f.id as typeof activeFilter)}
              className={cn(
                'px-3 py-1.5 rounded-xl font-medium transition whitespace-nowrap',
                activeFilter === f.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Daily Tasks Table */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800/80">
              <tr>
                <th className="px-4 py-3.5">Task Name & Activity</th>
                <th className="px-4 py-3.5">Assigned Site Mgr</th>
                <th className="px-4 py-3.5">Target Qty</th>
                <th className="px-4 py-3.5">Site Reported</th>
                <th className="px-4 py-3.5">PM Validated</th>
                <th className="px-4 py-3.5">Task Status</th>
                <th className="px-4 py-3.5">Gov Review Status</th>
                <th className="px-4 py-3.5">Evidence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filteredTasks.map(task => (
                <tr key={task.id} className="hover:bg-slate-800/30 transition">
                  <td className="px-4 py-3.5 max-w-xs">
                    <span className="font-mono text-cyan-400 text-xs font-semibold block">
                      {task.activityCode}
                    </span>
                    <span className="font-bold text-white block mt-0.5 truncate">
                      {task.taskName}
                    </span>
                    <span className="text-[11px] text-slate-500 block mt-0.5">
                      {task.location} ({task.chainage})
                    </span>
                  </td>

                  <td className="px-4 py-3.5 whitespace-nowrap text-slate-200 font-medium">
                    {task.assignedSiteManagerName}
                  </td>

                  <td className="px-4 py-3.5 whitespace-nowrap font-mono text-slate-300">
                    {task.plannedQuantity} {task.unit}
                  </td>

                  <td className="px-4 py-3.5 whitespace-nowrap font-mono text-cyan-400 font-semibold">
                    {task.reportedProgress}%
                  </td>

                  <td className="px-4 py-3.5 whitespace-nowrap font-mono text-emerald-400 font-bold">
                    {task.validatedProgress}%
                  </td>

                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <StatusBadge status={task.status} />
                  </td>

                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <GovReviewBadge status={task.governmentReviewStatus} />
                  </td>

                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 text-slate-400 text-xs font-mono">
                      <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
                      {task.photoCount} photos
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE DAILY TASK MODAL */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create Official Daily Task"
        subtitle="Project Manager Daily Work Order Deployment"
        maxWidth="xl"
      >
        <form onSubmit={handleCreateTask} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Select L5/L6 Activity
            </label>
            <select
              value={formActivityCode}
              onChange={e => {
                setFormActivityCode(e.target.value);
                const act = INITIAL_L6_ACTIVITIES.find(a => a.code === e.target.value);
                if (act) {
                  setFormUnit(act.unit);
                  setFormTaskName(`${act.name} (${act.chainage})`);
                }
              }}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500 font-mono text-xs"
            >
              {INITIAL_L6_ACTIVITIES.map(act => (
                <option key={act.id} value={act.code}>
                  {act.code} — {act.name} ({act.chainage})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Task Name</label>
            <input
              type="text"
              required
              value={formTaskName}
              onChange={e => setFormTaskName(e.target.value)}
              placeholder="e.g. 24-inch Pipeline Root Pass Welding KP 17.2-18.1"
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500 text-xs"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Execution Date</label>
              <input
                type="date"
                required
                value={formDate}
                onChange={e => setFormDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500 text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Planned Quantity</label>
              <input
                type="number"
                min="1"
                required
                value={formPlannedQty}
                onChange={e => setFormPlannedQty(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500 font-mono text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Unit</label>
              <input
                type="text"
                required
                value={formUnit}
                onChange={e => setFormUnit(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500 text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Assigned Site Manager</label>
              <select
                value={formSiteManager}
                onChange={e => setFormSiteManager(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500 text-xs"
              >
                <option value="Vikramjit Singh">Vikramjit Singh (Sector 4)</option>
                <option value="Er. Debojit Barua">Er. Debojit Barua (Sector 1)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Execution Priority</label>
              <select
                value={formPriority}
                onChange={e => setFormPriority(e.target.value as typeof formPriority)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500 text-xs"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Specific Instructions</label>
            <textarea
              rows={3}
              value={formInstructions}
              onChange={e => setFormInstructions(e.target.value)}
              placeholder="Instructions regarding weather precautions, preheating, crane mats, etc."
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500 text-xs resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-900/30"
            >
              Deploy Daily Task
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
