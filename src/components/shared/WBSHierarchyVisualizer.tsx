'use client';

import React, { useState } from 'react';
import {
  Layers,
  ChevronRight,
  ChevronDown,
  Sparkles,
  ArrowDown,
  CheckCircle2,
  Clock,
  ShieldCheck,
  FolderGit2,
  Info,
  Flame,
  Zap,
} from 'lucide-react';
import { WBSNode, WBSLevel, WBS_LEVEL_DEFINITIONS } from '@/types';
import { INITIAL_WBS_HIERARCHY } from '@/lib/mock/activities';
import { cn } from '@/lib/utils';
import { ProgressBar } from './ProgressBar';

interface WBSHierarchyVisualizerProps {
  initialExpandedLevel?: WBSLevel;
  showTree?: boolean;
}

export function WBSHierarchyVisualizer({
  initialExpandedLevel = 'L6',
  showTree = true,
}: WBSHierarchyVisualizerProps) {
  const [selectedLevel, setSelectedLevel] = useState<WBSLevel>('L6');
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({
    'wbs-l1': true,
    'wbs-l2': true,
    'wbs-l3': true,
    'wbs-l4-mech': true,
    'wbs-l5-weld': true,
  });

  const toggleNode = (nodeId: string) => {
    setExpandedNodes(prev => ({ ...prev, [nodeId]: !prev[nodeId] }));
  };

  const levels: WBSLevel[] = ['L1', 'L2', 'L3', 'L4', 'L5', 'L6'];

  const levelDetails = {
    L1: {
      code: 'L1-PRJ-ASSAM',
      sampleName: 'Assam Natural Gas Grid Expansion Project',
      owner: 'Government Authority & Project Director',
      frequency: 'Baseline Milestone Review (Monthly/Quarterly)',
      roleInPlatform: 'High-level executive dashboard tracking national capital outlay, macro milestone dates, and S-Curves.',
    },
    L2: {
      code: 'L2-PKG-02',
      sampleName: 'Pipeline Package 02: Mainline Transmission Corridor',
      owner: 'EPC Contractor & Corporate Admin',
      frequency: 'Contract Package Accounting',
      roleInPlatform: 'Defines commercial procurement packages, billing milestones, and overall EPC contractual scope.',
    },
    L3: {
      code: 'L3-SEC-04',
      sampleName: 'Pipeline Section 04: Cachar Valley Corridor (KP 0 to KP 25)',
      owner: 'Deputy Project Manager / Corridor Lead',
      frequency: 'Weekly Progress Review',
      roleInPlatform: 'Corridor geofencing boundaries, GIS pipeline alignment, and right-of-way (RoW) jurisdictional stretches.',
    },
    L4: {
      code: 'L4-PHS-MECH',
      sampleName: 'Mechanical & Civil Construction Phase',
      owner: 'Construction Engineering Head',
      frequency: 'Phase Handover & Milestone Gating',
      roleInPlatform: 'Coordinates cross-discipline dependencies between civil trenching, mechanical piping, and pre-commissioning.',
    },
    L5: {
      code: 'L5-ERECTION-WELD',
      sampleName: 'Mainline Pipeline Erection & Welding (CORE FOCUS)',
      owner: 'Project Manager & Lead Field Engineer',
      frequency: 'Daily Deployment & Crew Balancing',
      roleInPlatform: 'Physical erection work package level where certified crews, heavy machinery (sidebooms, rigs), and daily shifts are deployed.',
    },
    L6: {
      code: 'L6-PIP-0245',
      sampleName: '24-inch CS Pipeline Welding (CORE FOCUS)',
      owner: 'Site Manager & Mobile Inspector',
      frequency: 'Continuous Field Capture (Hourly / Daily Shifts)',
      roleInPlatform: 'The granular ground-truth execution unit: Mobile photo uploads, geotag checks, voice notes, prototype AI cross-matching, and daily quantity recording.',
    },
  };

  // Recursive Tree Node Renderer
  const renderWBSNode = (node: WBSNode, depth = 0) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = !!expandedNodes[node.id];
    const isFocus = node.level === 'L5' || node.level === 'L6';

    return (
      <div key={node.id} className="space-y-1">
        <div
          onClick={() => hasChildren && toggleNode(node.id)}
          className={cn(
            'flex items-center justify-between p-3 rounded-2xl border text-xs transition select-none group',
            hasChildren ? 'cursor-pointer hover:bg-slate-800/80' : 'bg-slate-950/40',
            node.level === 'L6'
              ? 'bg-blue-950/30 border-cyan-500/40 hover:border-cyan-400/80 shadow-md shadow-cyan-950/20'
              : node.level === 'L5'
              ? 'bg-slate-900/90 border-blue-500/40 hover:border-blue-400/70'
              : 'bg-slate-900/60 border-slate-800'
          )}
          style={{ marginLeft: `${depth * 18}px` }}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            {hasChildren ? (
              <button
                type="button"
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 group-hover:text-white transition"
              >
                {isExpanded ? <ChevronDown className="w-4 h-4 text-cyan-400" /> : <ChevronRight className="w-4 h-4" />}
              </button>
            ) : (
              <span className="w-4 h-4 inline-block shrink-0" />
            )}

            {/* Level Tag */}
            <div className="flex items-center gap-1.5 shrink-0">
              <span
                className={cn(
                  'px-2 py-0.5 rounded-lg font-mono text-[10px] font-bold shadow-sm',
                  node.level === 'L6'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-cyan-500/20'
                    : node.level === 'L5'
                    ? 'bg-blue-600 text-white shadow-blue-500/20'
                    : 'bg-slate-800 text-slate-300'
                )}
              >
                {node.level}
              </span>
              <span className="text-[10px] font-semibold text-slate-400 uppercase hidden sm:inline">
                {WBS_LEVEL_DEFINITIONS[node.level].title}
              </span>
            </div>

            {/* Focus Area Glow Badge for L5 and L6 */}
            {isFocus && (
              <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[9px] font-mono font-bold flex items-center gap-1 shrink-0">
                <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                <span>FOCUS AREA</span>
              </span>
            )}

            <span className="font-mono text-slate-400 text-[11px] shrink-0">{node.code}</span>
            <span className="text-white font-medium truncate">{node.name}</span>
          </div>

          {/* Progress Metrics */}
          <div className="flex items-center gap-4 shrink-0 font-mono text-xs">
            <div className="hidden md:block text-[11px] text-slate-400">
              Target: <span className="text-slate-200">{node.plannedProgress}%</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-20 hidden sm:block">
                <ProgressBar
                  value={node.actualProgress}
                  target={node.plannedProgress}
                  size="sm"
                  variant={node.actualProgress >= node.plannedProgress ? 'emerald' : 'amber'}
                />
              </div>
              <span
                className={cn(
                  'font-bold',
                  node.actualProgress >= node.plannedProgress ? 'text-emerald-400' : 'text-amber-400'
                )}
              >
                {node.actualProgress}%
              </span>
            </div>
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div className="space-y-1.5 pt-1">
            {node.children!.map(child => renderWBSNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Visual Workflow Cascade Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900/90 via-[#0a1122] to-slate-950 border border-slate-800 shadow-2xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-mono text-cyan-400 mb-2">
              <Layers className="w-3.5 h-3.5" />
              <span>Standard WBS Architecture (SIH26122)</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              6-Level Work Breakdown Structure: L1 → L6
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Hierarchical schedule cascade from Master Project down to daily field execution activities.
            </p>
          </div>

          {/* Operational Focus Banner */}
          <div className="px-4 py-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-amber-300">SITE2SCHEDULE AI Focus Area</div>
              <div className="text-[11px] text-slate-300 font-medium">Level 5 (Pipeline Erection) & Level 6 (Specific Activities)</div>
            </div>
          </div>
        </div>

        {/* The 6-Level Horizontal Workflow Stepper */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
          {levels.map((lvl, index) => {
            const def = WBS_LEVEL_DEFINITIONS[lvl];
            const isSelected = selectedLevel === lvl;
            const isFocus = def.isFocusArea;

            return (
              <button
                key={lvl}
                type="button"
                onClick={() => setSelectedLevel(lvl)}
                className={cn(
                  'p-3.5 rounded-2xl border text-left transition-all duration-200 relative flex flex-col justify-between group cursor-pointer',
                  isSelected
                    ? isFocus
                      ? 'bg-cyan-950/40 border-cyan-400 shadow-lg shadow-cyan-500/20 ring-2 ring-cyan-500/20'
                      : 'bg-blue-950/40 border-blue-400 shadow-lg shadow-blue-500/20'
                    : isFocus
                    ? 'bg-amber-950/10 border-amber-500/30 hover:border-amber-400/60'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                )}
              >
                {/* Focus Area Pill */}
                {isFocus && (
                  <span className="absolute -top-2.5 right-2 px-1.5 py-0.5 rounded-full bg-amber-500 text-slate-950 font-mono font-bold text-[8px] uppercase tracking-wider shadow">
                    Core Focus
                  </span>
                )}

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className={cn(
                        'w-7 h-7 rounded-xl flex items-center justify-center font-mono font-bold text-xs shadow-sm',
                        isFocus
                          ? 'bg-gradient-to-tr from-cyan-500 to-blue-600 text-white'
                          : 'bg-slate-800 text-slate-300'
                      )}
                    >
                      {lvl}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">Step 0{index + 1}</span>
                  </div>

                  <div className="text-xs font-bold text-white group-hover:text-cyan-300 transition leading-snug">
                    {def.title}
                  </div>
                </div>

                <div className="text-[10px] text-slate-400 mt-2 line-clamp-2">
                  {def.shortDesc}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Level Deep-Dive Inspection Box */}
        <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-mono font-bold text-sm">
                {selectedLevel}
              </span>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white">
                  {WBS_LEVEL_DEFINITIONS[selectedLevel].title}
                </h3>
                <p className="text-xs text-slate-400">
                  {WBS_LEVEL_DEFINITIONS[selectedLevel].shortDesc}
                </p>
              </div>
            </div>

            {WBS_LEVEL_DEFINITIONS[selectedLevel].isFocusArea && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>SITE2SCHEDULE AI Primary Operating Level</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-slate-500 text-[10px] block uppercase font-mono">Sample Code & Reference</span>
              <span className="text-cyan-400 font-mono font-bold mt-0.5 block">{levelDetails[selectedLevel].code}</span>
              <span className="text-white text-[11px] truncate block mt-0.5">{levelDetails[selectedLevel].sampleName}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-slate-500 text-[10px] block uppercase font-mono">Operational Owner</span>
              <span className="text-white font-medium block mt-0.5">{levelDetails[selectedLevel].owner}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-slate-500 text-[10px] block uppercase font-mono">Execution Frequency</span>
              <span className="text-slate-300 font-mono block mt-0.5">{levelDetails[selectedLevel].frequency}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-slate-500 text-[10px] block uppercase font-mono">Rollup Flow</span>
              <span className="text-emerald-400 font-mono block mt-0.5">
                {selectedLevel === 'L6' ? 'Ground Zero (Input)' : selectedLevel === 'L5' ? 'L6 → L5 (Erection)' : `${selectedLevel} ← Child Levels`}
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-blue-950/20 border border-blue-500/30 text-xs text-slate-300 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white">Role in SITE2SCHEDULE AI: </strong>
              <span>{levelDetails[selectedLevel].roleInPlatform}</span>
            </div>
          </div>
        </div>

        {/* Why Focus on L5 and L6 Explainer */}
        <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Why SITE2SCHEDULE AI Focuses on Level 5 (Pipeline Erection) & Level 6 (Specific Activity)</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
              <div className="font-bold text-cyan-400">1. Granular Field Truth</div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Levels 1–4 are macro planning abstractions. Physical reality happens at <strong>L5 (Pipeline Erection)</strong>, where daily shifts execute <strong>L6 specific operations</strong> (welding joints, crawler radiography, 3LPE coating, lowering).
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
              <div className="font-bold text-cyan-400">2. Automated AI Verification</div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Computer vision cannot audit an entire project (L1) at once. It inspects geotagged photos against the specific engineering criteria of an <strong>L6 activity</strong> (e.g. 24&quot; weld root pass, preheating temperature 110°C).
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
              <div className="font-bold text-cyan-400">3. Bottom-Up Schedule Rollup</div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                When PMs validate L6 actuals (e.g. 63% vs 65%), the platform mathematically aggregates physical progress into L5 Erection packages, updating L4, L3, L2, and L1 with zero manual data-entry errors.
              </p>
            </div>
          </div>
        </div>

        {/* Interactive WBS Tree Drilldown */}
        {showTree && (
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">
                  Interactive WBS Execution Hierarchy Tree
                </h3>
                <p className="text-xs text-slate-400">
                  Click any node with children to expand and inspect the L1 → L6 structural breakdown.
                </p>
              </div>
              <span className="text-xs font-mono text-cyan-400">
                L5 & L6 highlighted in Cyan & Gold
              </span>
            </div>

            <div className="space-y-1.5 pt-2 max-h-[550px] overflow-y-auto p-1 scrollbar-thin scrollbar-thumb-slate-700">
              {renderWBSNode(INITIAL_WBS_HIERARCHY)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
