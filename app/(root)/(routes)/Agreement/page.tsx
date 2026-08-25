import {
  LayoutDashboard,
  Briefcase,
  FileText,
  ShieldCheck,
  ListChecks,
  Users,
  Files,
  MessagesSquare,
  BarChart3,
  CalendarDays,
  Settings,
  HelpCircle,
  LogOut,
  Bell,
  ChevronDown,
  ChevronRight,
  SlidersHorizontal,
  GitCompareArrows,
  UploadCloud,
  Lock,
  MoreHorizontal,
  Minus,
  Plus,
  Download,
  Maximize2,
  Search,
  Copy,
  Info,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "My Cases", icon: Briefcase },
  { label: "Agreement", icon: FileText, active: true },
  { label: "ILA", icon: ShieldCheck },
  { label: "Tasks", icon: ListChecks, badge: "5" },
  { label: "Clients", icon: Users },
  { label: "Documents", icon: Files },
  { label: "Communications", icon: MessagesSquare },
  { label: "Reports", icon: BarChart3 },
  { label: "Calendar", icon: CalendarDays },
  { label: "Settings", icon: Settings },
];

type Version = {
  v: string;
  title: string;
  by: string;
  date: string;
  tag: string;
  tagTone: string;
  dot: string;
  latest?: boolean;
};

const versions: Version[] = [
  {
    v: "v3.4",
    title: "Latest Agreed Version",
    by: "Alex Johnson (P1 Lawyer)",
    date: "15 May 2025, 10:30 AM",
    tag: "L1",
    tagTone: "bg-accent text-accent-foreground",
    dot: "bg-primary",
    latest: true,
  },
  {
    v: "v3.3",
    title: "Lawyer Revision",
    by: "Michael Brown (P2 Lawyer)",
    date: "06 May 2025, 03:50 PM",
    tag: "L2",
    tagTone: "bg-accent text-accent-foreground",
    dot: "bg-primary",
  },
  {
    v: "v3.2",
    title: "Lawyer Revision",
    by: "Alex Johnson (P1 Lawyer)",
    date: "02 May 2025, 09:30 AM",
    tag: "L1",
    tagTone: "bg-accent text-accent-foreground",
    dot: "bg-primary",
  },
  {
    v: "v2.1",
    title: "P2 Lawyer Draft",
    by: "Michael Brown (P2 Lawyer)",
    date: "23 Apr 2025, 04:15 PM",
    tag: "L2",
    tagTone: "bg-accent text-accent-foreground",
    dot: "bg-primary/60",
  },
  {
    v: "v2.0",
    title: "P1 Lawyer Draft",
    by: "Alex Johnson (P1 Lawyer)",
    date: "20 Apr 2025, 10:20 AM",
    tag: "L1",
    tagTone: "bg-accent text-accent-foreground",
    dot: "bg-primary/60",
  },
  {
    v: "v1.2",
    title: "Case Manager Version",
    by: "Case Manager",
    date: "14 Apr 2025, 11:05 AM",
    tag: "CM",
    tagTone:
      "bg-[color-mix(in_oklab,var(--chart-1)_18%,white)] text-[var(--chart-1)]",
    dot: "bg-[var(--chart-1)]",
  },
  {
    v: "v1.1",
    title: "P2 Draft",
    by: "Sarah Smith (P2)",
    date: "11 Apr 2025, 02:40 PM",
    tag: "P2",
    tagTone:
      "bg-[color-mix(in_oklab,var(--chart-2)_18%,white)] text-[var(--chart-2)]",
    dot: "bg-[var(--chart-2)]",
  },
  {
    v: "v1.0",
    title: "P1 Draft",
    by: "John Smith (P1)",
    date: "10 Apr 2025, 09:15 AM",
    tag: "P1",
    tagTone:
      "bg-[color-mix(in_oklab,var(--chart-2)_18%,white)] text-[var(--chart-2)]",
    dot: "bg-[var(--chart-2)]",
  },
];

const historyRows = [
  {
    v: "v3.4",
    by: "Alex Johnson (P1 Lawyer)",
    date: "15 May 2025, 10:30 AM",
    summary: "Amended Clause 45, Clause 56. Updated Appendix 1.",
  },
  {
    v: "v3.3",
    by: "Michael Brown (P2 Lawyer)",
    date: "06 May 2025, 03:50 PM",
    summary: "Revised financial disclosure section. Updated Clause 23.",
  },
  {
    v: "v3.2",
    by: "Alex Johnson (P1 Lawyer)",
    date: "02 May 2025, 09:30 AM",
    summary: "Added Clause 56. Minor wording changes in Clause 12.",
  },
  {
    v: "v2.1",
    by: "Michael Brown (P2 Lawyer)",
    date: "23 Apr 2025, 04:15 PM",
    summary: "Initial draft by P2 Lawyer.",
  },
];

function Thumb({ n }: { n: number }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="h-[86px] w-[74px] overflow-hidden rounded-sm border border-border bg-card p-2 shadow-sm">
        <div className="mx-auto mb-1.5 h-1 w-8 rounded-full bg-muted-foreground/40" />
        <div className="space-y-[3px]">
          {Array.from({ length: 11 }).map((_, i) => (
            <div
              key={i}
              className="h-[2px] rounded-full bg-muted-foreground/25"
              style={{ width: `${60 + ((i * 13) % 40)}%` }}
            />
          ))}
        </div>
      </div>
      <span className="text-[11px] text-muted-foreground">{n}</span>
    </div>
  );
}

export default function AgreementPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex">
        {/* Sidebar */}
        <aside className="sticky top-0 hidden h-screen w-[180px] shrink-0 flex-col bg-sidebar text-sidebar-foreground lg:flex">
          <div className="flex items-center gap-2.5 px-4 py-5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
              <ShieldCheck
                className="h-4.5 w-4.5 text-sidebar-primary-foreground"
                strokeWidth={2.5}
              />
            </div>
            <div className="leading-tight">
              <div className="text-[13px] font-bold text-sidebar-accent-foreground">
                PreNuptial
              </div>
              <div className="text-[9px] tracking-[0.18em] text-sidebar-foreground/70">
                AGREEMENTS
              </div>
            </div>
          </div>

          <nav className="mt-2 flex-1 space-y-0.5 px-2">
            {navItems.map(({ label, icon: Icon, active, badge }) => (
              <button
                key={label}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] transition-colors ${
                  active
                    ? "bg-sidebar-primary font-semibold text-sidebar-primary-foreground"
                    : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="flex-1 text-left">{label}</span>
                {badge && (
                  <span className="flex h-4.5 w-4.5 items-center justify-center rounded-full bg-destructive text-[10px] font-semibold text-destructive-foreground">
                    {badge}
                  </span>
                )}
              </button>
            ))}
          </nav>

          <div className="space-y-0.5 px-2 pb-6">
            <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
              <HelpCircle className="h-4 w-4" /> Help
            </button>
            <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
              <LogOut className="h-4 w-4" /> Logout
            </button>
          </div>
        </aside>

        {/* Main */}
        <div className="min-w-0 flex-1">
          {/* Topbar */}
          <header className="flex flex-wrap items-center gap-3 border-b border-border bg-card px-6 py-3">
            <nav className="flex min-w-0 items-center gap-2 text-[13px] text-muted-foreground">
              <span>Cases</span>
              <ChevronRight className="h-3.5 w-3.5" />
              <span>CASE-2025-00011</span>
              <ChevronRight className="h-3.5 w-3.5" />
              <span className="font-semibold text-foreground">Agreement</span>
            </nav>
            <div className="ml-auto flex items-center gap-4">
              <div className="hidden items-center gap-2 sm:flex">
                <span className="text-[13px] text-muted-foreground">
                  Current Status
                </span>
                <span className="rounded-md bg-accent px-2 py-1 text-[11px] font-semibold tracking-wide text-accent-foreground">
                  LAWYER REVIEW
                </span>
              </div>
              <div className="relative">
                <Bell className="h-5 w-5 text-muted-foreground" />
                <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-destructive-foreground">
                  3
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sidebar text-[12px] font-semibold text-sidebar-primary-foreground">
                  AJ
                </div>
                <div className="hidden leading-tight sm:block">
                  <div className="text-[13px] font-semibold">Alex Johnson</div>
                  <div className="text-[11px] text-muted-foreground">
                    P1 Lawyer
                  </div>
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </header>

          <main className="px-6 py-6">
            {/* Title row */}
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="text-[30px] font-bold tracking-tight">
                  Agreement
                </h1>
                <p className="mt-1 text-[13px] text-muted-foreground">
                  View all versions, compare documents and manage check-in /
                  check-out.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button className="inline-flex items-center gap-2 rounded-lg border border-primary/40 bg-card px-4 py-2.5 text-[13px] font-semibold text-primary transition-colors hover:bg-accent">
                  <GitCompareArrows className="h-4 w-4" /> Compare Documents
                </button>
                <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-[13px] font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
                  <UploadCloud className="h-4 w-4" /> Upload New Version
                </button>
              </div>
            </div>

            {/* Summary strip */}
            <section className="mt-5 grid grid-cols-2 gap-y-5 rounded-xl border border-border bg-card px-6 py-4 md:grid-cols-3 xl:grid-cols-6 xl:divide-x xl:divide-border">
              {[
                {
                  label: "Case ID",
                  value: <span className="font-semibold">CASE-2025-00011</span>,
                },
                {
                  label: "Parties",
                  value: (
                    <span className="font-semibold">
                      John Smith (P1) &nbsp;&amp;&nbsp; Sarah Smith (P2)
                    </span>
                  ),
                },
                {
                  label: "Current Status",
                  value: (
                    <span className="inline-block rounded-md bg-accent px-2 py-1 text-[11px] font-semibold tracking-wide text-accent-foreground">
                      LAWYER REVIEW
                    </span>
                  ),
                },
                {
                  label: "Current Version",
                  value: <span className="font-semibold">v3.4</span>,
                },
                {
                  label: "Latest Agreed Version",
                  value: (
                    <span className="inline-block rounded-md bg-[color-mix(in_oklab,var(--chart-2)_15%,white)] px-2 py-1 text-[11px] font-semibold text-[var(--chart-2)]">
                      v3.4 (Clean Master)
                    </span>
                  ),
                },
                {
                  label: "Last Updated",
                  value: (
                    <span className="font-semibold">15 May 2025, 10:30 AM</span>
                  ),
                },
              ].map((cell, i) => (
                <div
                  key={cell.label}
                  className={i === 0 ? "xl:pr-6" : "xl:px-6"}
                >
                  <div className="text-[11px] text-muted-foreground">
                    {cell.label}
                  </div>
                  <div className="mt-1.5 text-[13px]">{cell.value}</div>
                </div>
              ))}
            </section>

            {/* 3 columns */}
            <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-[300px_minmax(0,1fr)_360px]">
              {/* All versions */}
              <section className="flex flex-col rounded-xl border border-border bg-card">
                <div className="flex items-center justify-between px-5 py-4">
                  <h2 className="text-[15px] font-semibold">All Versions</h2>
                  <button className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-[12px] font-medium text-muted-foreground hover:bg-secondary">
                    <SlidersHorizontal className="h-3.5 w-3.5" /> Filter
                  </button>
                </div>

                <ol className="relative flex-1 space-y-2.5 px-5 pb-4">
                  <span
                    className="absolute left-[26px] top-2 bottom-4 w-px bg-border"
                    aria-hidden
                  />
                  {versions.map((ver) => (
                    <li key={ver.v} className="relative pl-7">
                      {ver.latest ? (
                        <span className="absolute left-[-1px] top-4 flex h-3.5 w-3.5 items-center justify-center rounded-full border-2 border-primary bg-card">
                          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                        </span>
                      ) : (
                        <span
                          className={`absolute left-[2px] top-[18px] h-2 w-2 rounded-full ${ver.dot}`}
                        />
                      )}
                      <button
                        className={`w-full rounded-lg border px-3 py-2.5 text-left transition-colors ${
                          ver.latest
                            ? "border-primary/50 bg-accent/60"
                            : "border-transparent hover:bg-secondary"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="rounded-md bg-accent px-1.5 py-0.5 text-[11px] font-bold text-accent-foreground">
                            {ver.v}
                          </span>
                          <span className="text-[13px] font-semibold text-primary">
                            {ver.title}
                          </span>
                          <span
                            className={`ml-auto flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-bold ${ver.tagTone}`}
                          >
                            {ver.tag}
                          </span>
                        </div>
                        <div className="mt-1.5 text-[11.5px] text-muted-foreground">
                          By: {ver.by}
                        </div>
                        <div className="text-[11.5px] text-muted-foreground">
                          {ver.date}
                        </div>
                      </button>
                    </li>
                  ))}
                </ol>

                <div className="flex items-center justify-between border-t border-border px-5 py-4">
                  <span className="text-[13px] text-muted-foreground">
                    Show archived versions
                  </span>
                  <span className="relative h-5 w-9 rounded-full bg-border">
                    <span className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-card shadow" />
                  </span>
                </div>
              </section>

              {/* Viewer + history */}
              <div className="space-y-5">
                <section className="rounded-xl border border-border bg-card">
                  <div className="flex flex-wrap items-center gap-3 px-5 py-4">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="text-[14px] font-semibold">
                        Version v3.4
                      </span>
                      <span className="text-[14px] font-semibold text-primary">
                        Latest Agreed Version
                      </span>
                      <span className="rounded-md bg-[color-mix(in_oklab,var(--chart-2)_15%,white)] px-2 py-0.5 text-[11px] font-semibold text-[var(--chart-2)]">
                        Clean Master
                      </span>
                    </div>
                    <div className="ml-auto flex items-center gap-2">
                      <button className="inline-flex items-center gap-2 rounded-lg border border-primary/40 px-4 py-2 text-[13px] font-semibold text-primary hover:bg-accent">
                        <Lock className="h-3.5 w-3.5" /> Check Out
                      </button>
                      <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-secondary">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="-mt-2 px-5 pb-3 text-[11.5px] text-muted-foreground">
                    Uploaded by Alex Johnson (P1 Lawyer) on 15 May 2025, 10:30
                    AM
                  </div>

                  {/* toolbar */}
                  <div className="flex items-center gap-3 border-y border-border px-5 py-2.5">
                    <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
                      <span className="rounded-md border border-border px-2.5 py-1 text-foreground">
                        1
                      </span>
                      <span>/ 24</span>
                    </div>
                    <div className="mx-auto flex items-center gap-4 text-muted-foreground">
                      <Minus className="h-4 w-4" />
                      <span className="text-[12px] text-foreground">100%</span>
                      <Plus className="h-4 w-4" />
                    </div>
                    <div className="flex items-center gap-4 text-muted-foreground">
                      <Download className="h-4 w-4" />
                      <Maximize2 className="h-4 w-4" />
                      <Search className="h-4 w-4" />
                    </div>
                  </div>

                  {/* document body */}
                  <div className="flex bg-secondary/60">
                    <div className="flex w-[110px] shrink-0 flex-col items-center gap-3 border-r border-border py-4">
                      {[1, 2, 3].map((n) => (
                        <Thumb key={n} n={n} />
                      ))}
                    </div>
                    <article className="flex-1 bg-card px-10 py-8 text-[13px] leading-relaxed">
                      <h3 className="text-center text-[15px] font-bold tracking-wide">
                        PRENUPTIAL AGREEMENT
                      </h3>
                      <p className="mt-6">
                        This Agreement is made on 15 May 2025
                      </p>
                      <p className="mt-4">BETWEEN</p>
                      <p className="mt-3">John Smith (Party 1)</p>
                      <p className="mt-4">AND</p>
                      <p className="mt-3">Sarah Smith (Party 2)</p>
                      <div className="mt-6 space-y-3">
                        <div className="flex gap-6">
                          <span className="font-semibold">1.</span>
                          <span className="font-semibold">DEFINITIONS</span>
                        </div>
                        <div className="flex gap-6">
                          <span>1.1</span>
                          <span>
                            In this Agreement, unless the context otherwise
                            requires:
                            <br />
                            <em>"Agreement"</em> means this Prenuptial Agreement
                            including all schedules and annexures.
                          </span>
                        </div>
                        <div className="flex gap-6">
                          <span>1.2</span>
                          <span>
                            The parties agree as follows:
                            <br />
                            ...
                          </span>
                        </div>
                        <div className="mt-6 flex gap-6">
                          <span className="font-semibold">2.</span>
                          <span className="font-semibold">
                            FINANCIAL DISCLOSURE
                          </span>
                        </div>
                        <div className="flex gap-6">
                          <span>2.1</span>
                          <span>
                            Each party has provided full and frank disclosure of
                            their financial circumstances.
                            <br />
                            ...
                          </span>
                        </div>
                      </div>
                    </article>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-8 gap-y-2 border-t border-border px-5 py-3 text-[11.5px] text-muted-foreground">
                    <span>
                      File:{" "}
                      <span className="text-foreground">
                        Prenuptial_Agreement_v3.4.pdf
                      </span>
                    </span>
                    <span>
                      Size: <span className="text-foreground">1.2 MB</span>
                    </span>
                    <span>
                      Pages: <span className="text-foreground">24</span>
                    </span>
                    <span className="ml-auto flex items-center gap-2">
                      Document Hash:{" "}
                      <span className="text-foreground">8f3e…a9c2</span>
                      <Copy className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </section>

                {/* amendment summary */}
                <section className="rounded-xl border border-border bg-card px-5 py-4">
                  <h2 className="text-[15px] font-semibold">
                    Amendment Summary (Version History)
                  </h2>
                  <div className="mt-3 overflow-x-auto">
                    <table className="w-full text-left text-[12px]">
                      <thead>
                        <tr className="border-b border-border text-muted-foreground">
                          <th className="py-2 pr-4 font-medium">Version</th>
                          <th className="py-2 pr-4 font-medium">By</th>
                          <th className="py-2 pr-4 font-medium">Date</th>
                          <th className="py-2 font-medium">
                            Summary of Changes
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {historyRows.map((r) => (
                          <tr
                            key={r.v}
                            className="border-b border-border/70 last:border-0"
                          >
                            <td className="py-2.5 pr-4">
                              <span className="flex items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                                <span className="font-semibold text-primary">
                                  {r.v}
                                </span>
                              </span>
                            </td>
                            <td className="py-2.5 pr-4 whitespace-nowrap">
                              {r.by}
                            </td>
                            <td className="py-2.5 pr-4 whitespace-nowrap">
                              {r.date}
                            </td>
                            <td className="py-2.5 text-muted-foreground">
                              {r.summary}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-4 flex justify-center">
                    <button className="inline-flex items-center gap-2 rounded-lg border border-primary/40 px-4 py-2 text-[13px] font-semibold text-primary hover:bg-accent">
                      View Full History <ChevronDown className="h-4 w-4" />
                    </button>
                  </div>
                </section>
              </div>

              {/* Right rail */}
              <div className="space-y-5">
                <section className="rounded-xl border border-border bg-card px-5 py-4">
                  <h2 className="text-[15px] font-semibold">
                    Upload New Version (Check-In)
                  </h2>
                  <p className="mt-1 text-[12px] text-muted-foreground">
                    Upload a new version of the agreement.
                  </p>

                  <div className="mt-4 rounded-xl border-2 border-dashed border-primary/35 bg-accent/40 px-4 py-6 text-center">
                    <UploadCloud
                      className="mx-auto h-8 w-8 text-primary"
                      strokeWidth={1.6}
                    />
                    <p className="mt-2 text-[12.5px] text-muted-foreground">
                      Drag &amp; drop file here
                    </p>
                    <p className="text-[12px] text-muted-foreground">or</p>
                    <button className="mt-2 rounded-lg border border-primary/40 bg-card px-3 py-1.5 text-[12.5px] font-semibold text-primary hover:bg-accent">
                      Choose File
                    </button>
                    <p className="mt-3 text-[11px] text-muted-foreground">
                      PDF only. Max size 50MB
                    </p>
                  </div>

                  <label className="mt-4 block text-[11.5px] text-muted-foreground">
                    New Version Number
                  </label>
                  <input
                    defaultValue="v3.5"
                    className="mt-1.5 w-24 rounded-lg border border-input bg-card px-3 py-1.5 text-[13px] outline-none focus:border-ring"
                  />

                  <div className="mt-4">
                    <div className="text-[11.5px] font-semibold tracking-wide text-muted-foreground">
                      AMENDMENT SUMMARY{" "}
                      <span className="text-destructive">*</span>
                    </div>
                    <p className="mt-1 text-[11.5px] text-muted-foreground">
                      Provide a brief summary of the changes in this version.
                    </p>
                    <div className="mt-2 rounded-lg border border-input px-4 py-3">
                      <ul className="list-disc space-y-1.5 pl-4 text-[12.5px]">
                        <li>Amended Clause 45 (Property division)</li>
                        <li>Updated Clause 56 (Spousal Maintenance)</li>
                        <li>Added details to Appendix 1</li>
                      </ul>
                      <div className="h-8" />
                    </div>
                    <p className="mt-2 text-[11px] text-muted-foreground">
                      This summary will be visible in the version history.
                    </p>
                  </div>

                  <div className="mt-4 grid grid-cols-[1fr_1.6fr] gap-3">
                    <button className="rounded-lg border border-primary/40 px-3 py-2.5 text-[13px] font-semibold text-primary hover:bg-accent">
                      Cancel
                    </button>
                    <button className="rounded-lg bg-primary px-3 py-2.5 text-[13px] font-semibold text-primary-foreground hover:bg-primary/90">
                      Upload &amp; Create v3.5
                    </button>
                  </div>
                </section>

                <section className="rounded-xl border border-border bg-card px-5 py-4">
                  <h2 className="text-[15px] font-semibold">
                    Check-In / Check-Out
                  </h2>
                  <dl className="mt-3 space-y-2.5 text-[12.5px]">
                    <div className="flex items-center justify-between gap-4">
                      <dt className="text-muted-foreground">Status</dt>
                      <dd>
                        <span className="rounded-md bg-[color-mix(in_oklab,var(--chart-4)_28%,white)] px-2 py-0.5 text-[11px] font-semibold text-[color-mix(in_oklab,var(--chart-1)_75%,black)]">
                          Checked Out
                        </span>
                      </dd>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <dt className="text-muted-foreground">Checked Out By</dt>
                      <dd className="font-medium">Alex Johnson (P1 Lawyer)</dd>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <dt className="text-muted-foreground">Checked Out On</dt>
                      <dd className="font-medium">15 May 2025, 11:05 AM</dd>
                    </div>
                  </dl>
                  <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-destructive px-3 py-2.5 text-[13px] font-semibold text-destructive-foreground hover:bg-destructive/90">
                    <Lock className="h-3.5 w-3.5" /> Check In
                  </button>
                  <div className="mt-3 flex gap-2.5 rounded-lg bg-accent/60 px-3 py-3">
                    <Info className="h-4 w-4 shrink-0 text-primary" />
                    <p className="text-[11.5px] text-accent-foreground">
                      Please check in the document after you finish reviewing to
                      avoid conflicts.
                    </p>
                  </div>
                </section>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
