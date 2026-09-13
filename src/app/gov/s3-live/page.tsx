'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  getS3Stats,
  getS3Sheets,
  getS3SheetData,
  refreshS3Cache,
  checkBackendHealth,
  API_BASE_URL,
  S3StatsResponse,
  SheetDataResponse,
} from '@/lib/api';
import {
  Database,
  RefreshCw,
  Search,
  Filter,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Layers,
  AlertTriangle,
  TrendingUp,
  Activity,
  DollarSign,
  Clock,
  ShieldCheck,
  Server,
  FileSpreadsheet,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';
import { BackendStatusBadge } from '@/components/shared/BackendStatusBadge';

const AVAILABLE_SHEETS = [
  { id: 'Integrated_L1_L6', label: 'Integrated L1–L6 Master', count: '4,999' },
  { id: 'L1_Project', label: 'L1 Project Scope', count: '500' },
  { id: 'L2_Baseline', label: 'L2 Baseline & Cost', count: '500' },
  { id: 'L3_Progress', label: 'L3 Progress & Spend', count: '500' },
  { id: 'L4_Issues', label: 'L4 Impediments & Issues', count: '500' },
  { id: 'L5_Outcome', label: 'L5 Outcome & Delays', count: '500' },
  { id: 'L6_Analysis', label: 'L6 Root Cause & Action', count: '500' },
];

export default function S3LiveExplorerPage() {
  const [activeSheet, setActiveSheet] = useState('Integrated_L1_L6');
  const [stats, setStats] = useState<S3StatsResponse | null>(null);
  const [sheetData, setSheetData] = useState<SheetDataResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isBackendOnline, setIsBackendOnline] = useState<boolean | null>(null);

  // Filter & pagination state
  const [search, setSearch] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedRisk, setSelectedRisk] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);

  // Check backend health
  const checkHealth = useCallback(async () => {
    const health = await checkBackendHealth();
    setIsBackendOnline(health.isOnline);
    return health.isOnline;
  }, []);

  // Fetch KPI Stats
  const loadStats = useCallback(async () => {
    const res = await getS3Stats();
    if (res.success) {
      setStats(res);
    }
  }, []);

  // Fetch Sheet Records
  const loadSheetRecords = useCallback(async () => {
    setIsLoading(true);
    const res = await getS3SheetData(activeSheet, {
      page,
      limit,
      search,
      state: selectedState,
      risk: selectedRisk,
    });
    setSheetData(res);
    setIsLoading(false);
  }, [activeSheet, page, limit, search, selectedState, selectedRisk]);

  // Initial load
  useEffect(() => {
    checkHealth().then((online) => {
      if (online) {
        loadStats();
        loadSheetRecords();
      } else {
        setIsLoading(false);
      }
    });
  }, [checkHealth, loadStats, loadSheetRecords]);

  // Handle Sheet Tab Change
  const handleSheetChange = (sheetId: string) => {
    setActiveSheet(sheetId);
    setPage(1);
  };

  // Trigger S3 force refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshS3Cache();
    await loadStats();
    await loadSheetRecords();
    setIsRefreshing(false);
  };

  // List of states from stats if available
  const availableStates = stats?.distributions?.byState
    ? Object.keys(stats.distributions.byState).sort()
    : [];

  return (
    <div className="space-y-6">
      {/* Top Banner & Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-mono font-bold tracking-wider uppercase">
              Live Express + S3 Stream
            </span>
            <span className="text-slate-500 text-xs">•</span>
            <span className="text-slate-400 text-xs font-mono">Bucket: cherrodu</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Database className="w-7 h-7 text-cyan-400" />
            <span>AWS S3 Bridge Construction Dataset</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Streamed in real-time through the Express.js backend (port 4500) from Amazon S3. 
            Contains 4,999 Level 1–Level 6 Work Breakdown Structure infrastructure records.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <BackendStatusBadge />
          <button
            onClick={handleRefresh}
            disabled={isRefreshing || isBackendOnline === false}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition flex items-center gap-1.5 shadow-sm disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
            <span>{isRefreshing ? 'Syncing S3...' : 'Refresh S3'}</span>
          </button>
        </div>
      </div>

      {/* Backend Offline Warning Banner */}
      {isBackendOnline === false && (
        <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-800/50 text-amber-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-white">Express Backend is Not Running</p>
              <p className="text-amber-300/80 mt-0.5">
                The frontend could not connect to <code className="font-mono bg-slate-900 px-1 py-0.5 rounded text-amber-200">http://localhost:4500</code>.
                Start the backend in your terminal with:
              </p>
              <div className="mt-2 inline-block px-2.5 py-1 rounded bg-black/40 border border-amber-900/60 font-mono text-[11px] text-amber-300">
                cd intelligencereport-backend &amp;&amp; npm start
              </div>
            </div>
          </div>
          <button
            onClick={async () => {
              const online = await checkHealth();
              if (online) {
                loadStats();
                loadSheetRecords();
              }
            }}
            className="px-3 py-1.5 rounded-lg bg-amber-500 text-black font-semibold text-xs hover:bg-amber-400 transition shrink-0"
          >
            Retry Connection
          </button>
        </div>
      )}

      {/* Metric Cards */}
      {stats?.metrics && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Total Records</span>
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="text-xl font-bold text-white font-mono">
              {stats.metrics.totalProjects.toLocaleString()}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">Integrated L1–L6</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Avg Physical</span>
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-xl font-bold text-emerald-400 font-mono">
              {stats.metrics.avgPhysicalProgress}%
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">Physical completion</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Avg Financial</span>
              <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
            </div>
            <div className="text-xl font-bold text-blue-400 font-mono">
              {stats.metrics.avgFinancialProgress}%
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">Budget disbursed</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Total Cost</span>
              <DollarSign className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="text-xl font-bold text-amber-400 font-mono">
              ₹{(stats.metrics.totalCostCr / 1000).toFixed(1)}k Cr
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">Sanctioned Value</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Delayed</span>
              <Clock className="w-3.5 h-3.5 text-rose-400" />
            </div>
            <div className="text-xl font-bold text-rose-400 font-mono">
              {stats.metrics.delayedProjectsCount.toLocaleString()}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">Schedule slippage</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>High Risk</span>
              <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
            </div>
            <div className="text-xl font-bold text-red-400 font-mono">
              {stats.metrics.highRiskProjectsCount.toLocaleString()}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">Critical review</div>
          </div>
        </div>
      )}

      {/* Sheet Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800 scrollbar-none">
        {AVAILABLE_SHEETS.map((sheet) => {
          const isActive = activeSheet === sheet.id;
          return (
            <button
              key={sheet.id}
              onClick={() => handleSheetChange(sheet.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-medium transition whitespace-nowrap flex items-center gap-2 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <span>{sheet.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                  isActive ? 'bg-blue-700 text-blue-100' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {sheet.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search project ID, name, agency, issue..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* State Filter */}
        {availableStates.length > 0 && (
          <select
            value={selectedState}
            onChange={(e) => {
              setSelectedState(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-cyan-500 cursor-pointer"
          >
            <option value="">All States ({availableStates.length})</option>
            {availableStates.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        )}

        {/* Risk Filter */}
        <select
          value={selectedRisk}
          onChange={(e) => {
            setSelectedRisk(e.target.value);
            setPage(1);
          }}
          className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-cyan-500 cursor-pointer"
        >
          <option value="">All Risk Levels</option>
          <option value="High">High Risk</option>
          <option value="Medium">Medium Risk</option>
          <option value="Low">Low Risk</option>
        </select>

        {/* Rows per page */}
        <select
          value={limit}
          onChange={(e) => {
            setLimit(Number(e.target.value));
            setPage(1);
          }}
          className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-cyan-500 cursor-pointer"
        >
          <option value={10}>10 rows</option>
          <option value={20}>20 rows</option>
          <option value={50}>50 rows</option>
          <option value={100}>100 rows</option>
        </select>
      </div>

      {/* Data Table */}
      <div className="rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden shadow-xl">
        <div className="px-5 py-3.5 bg-slate-950/70 border-b border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <FileSpreadsheet className="w-4 h-4 text-cyan-400" />
            <span className="font-semibold text-white">{activeSheet}</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400 font-mono">
              {sheetData ? sheetData.totalRecords.toLocaleString() : 0} matching records
            </span>
          </div>

          <div className="flex items-center gap-2 text-slate-400 font-mono text-[11px]">
            <span>Page {page} of {sheetData ? sheetData.totalPages || 1 : 1}</span>
          </div>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-slate-400 text-xs flex flex-col items-center justify-center gap-3">
            <RefreshCw className="w-6 h-6 animate-spin text-cyan-400" />
            <span>Streaming records from Express API (Port 4500)...</span>
          </div>
        ) : !sheetData || sheetData.records.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs flex flex-col items-center justify-center gap-2">
            <Database className="w-8 h-8 text-slate-600" />
            <span className="font-medium text-slate-300">No records found</span>
            <span className="text-slate-500">Try adjusting your search query or state filters</span>
          </div>
        ) : (
          <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-950/80 sticky top-0 z-10 text-slate-400 border-b border-slate-800 font-mono text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4 font-semibold">Project ID</th>
                  <th className="py-3 px-4 font-semibold">Project Name</th>
                  {activeSheet === 'Integrated_L1_L6' && (
                    <>
                      <th className="py-3 px-4 font-semibold">State</th>
                      <th className="py-3 px-4 font-semibold">Type</th>
                      <th className="py-3 px-4 font-semibold">Cost (₹ Cr)</th>
                      <th className="py-3 px-4 font-semibold">Physical %</th>
                      <th className="py-3 px-4 font-semibold">Financial %</th>
                      <th className="py-3 px-4 font-semibold">Risk</th>
                      <th className="py-3 px-4 font-semibold">Milestone / Issue</th>
                    </>
                  )}
                  {activeSheet !== 'Integrated_L1_L6' &&
                    sheetData.columns
                      .filter((c) => c !== 'project_id' && c !== 'project_name')
                      .slice(0, 7)
                      .map((col) => (
                        <th key={col} className="py-3 px-4 font-semibold">
                          {col.replace(/_/g, ' ')}
                        </th>
                      ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {sheetData.records.map((row, idx) => {
                  const riskUpper = String(row.risk_level || '').toUpperCase();
                  const isHigh = riskUpper === 'HIGH';
                  const isMed = riskUpper === 'MEDIUM';

                  return (
                    <tr
                      key={row.project_id || idx}
                      className="hover:bg-slate-800/40 transition group"
                    >
                      <td className="py-3 px-4 font-mono font-medium text-cyan-400 whitespace-nowrap">
                        {row.project_id || `ROW-${idx + 1}`}
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-200 max-w-xs truncate">
                        {row.project_name || '—'}
                      </td>

                      {activeSheet === 'Integrated_L1_L6' ? (
                        <>
                          <td className="py-3 px-4 text-slate-300 whitespace-nowrap">
                            {row.state || '—'}
                          </td>
                          <td className="py-3 px-4 text-slate-400 whitespace-nowrap">
                            {row.bridge_type || '—'}
                          </td>
                          <td className="py-3 px-4 font-mono text-slate-200 whitespace-nowrap">
                            ₹{row.revised_cost_cr || row.original_cost_cr || '—'}
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-[11px] text-emerald-400 w-10 text-right">
                                {row.physical_progress_pct}%
                              </span>
                              <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-emerald-500 rounded-full"
                                  style={{ width: `${Math.min(100, Number(row.physical_progress_pct) || 0)}%` }}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-[11px] text-blue-400 w-10 text-right">
                                {row.financial_progress_pct}%
                              </span>
                              <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-blue-500 rounded-full"
                                  style={{ width: `${Math.min(100, Number(row.financial_progress_pct) || 0)}%` }}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                isHigh
                                  ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                                  : isMed
                                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                  : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              }`}
                            >
                              {row.risk_level || 'Normal'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-slate-300 max-w-sm">
                            <div className="font-medium truncate text-white">
                              {row.current_milestone || 'In Execution'}
                            </div>
                            {row.primary_issue && (
                              <div className="text-[11px] text-amber-400 truncate">
                                Issue: {row.primary_issue}
                              </div>
                            )}
                          </td>
                        </>
                      ) : (
                        sheetData.columns
                          .filter((c) => c !== 'project_id' && c !== 'project_name')
                          .slice(0, 7)
                          .map((col) => (
                            <td key={col} className="py-3 px-4 text-slate-300 whitespace-nowrap font-mono text-[11px]">
                              {String(row[col] ?? '—')}
                            </td>
                          ))
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        {sheetData && sheetData.totalPages > 1 && (
          <div className="px-5 py-3 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-xs">
            <div className="text-slate-400">
              Showing {(page - 1) * limit + 1} to{' '}
              {Math.min(page * limit, sheetData.totalRecords)} of{' '}
              <span className="font-semibold text-white font-mono">
                {sheetData.totalRecords.toLocaleString()}
              </span>{' '}
              records
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-xs transition flex items-center gap-1"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Prev</span>
              </button>
              <span className="px-3 py-1 text-slate-400 font-mono text-xs">
                {page} / {sheetData.totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(sheetData.totalPages, p + 1))}
                disabled={page >= sheetData.totalPages}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-xs transition flex items-center gap-1"
              >
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Integration Technical Details Box */}
      <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 text-xs text-slate-400">
        <div className="flex items-center gap-2 text-slate-200 font-semibold mb-2">
          <Server className="w-4 h-4 text-cyan-400" />
          <span>Express.js &amp; Next.js Architecture Pipeline</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-slate-400 mt-2 font-mono text-[11px]">
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80">
            <span className="text-cyan-400 font-bold block mb-1">1. S3 Cloud Storage</span>
            <span>Bucket: cherrodu • us-east-1</span>
            <p className="text-[10px] text-slate-500 mt-1">bridge_construction_dummy_100000_rows_updated.xlsx</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80">
            <span className="text-blue-400 font-bold block mb-1">2. Express REST Service</span>
            <span>Port 4500 • CORS Enabled</span>
            <p className="text-[10px] text-slate-500 mt-1">In-Memory Cache (TTL 1h) • Sub-10ms response time</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80">
            <span className="text-emerald-400 font-bold block mb-1">3. Next.js Frontend</span>
            <span>Port 3000 • React 19 UI</span>
            <p className="text-[10px] text-slate-500 mt-1">Direct Fetch via NEXT_PUBLIC_API_URL + Auto-Fallback</p>
          </div>
        </div>
      </div>
    </div>
  );
}
