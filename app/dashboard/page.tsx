"use client";

import { Bell, CalendarDays, CheckCircle2, ChevronDown, CircleDollarSign, Clock3, FileText, FolderOpen, LayoutDashboard, MessageSquare, MoreHorizontal, Plus, Search, Settings, Upload, UsersRound } from "lucide-react";
import { useState } from "react";
import "./dashboard.css";

const tasks = [
  ["Create ER diagram", "Developer", "Aug 10", "High", "todo"],
  ["Finalize Chapter 3", "You", "Aug 14", "High", "doing"],
  ["Review methodology", "John Cruz", "Aug 16", "Medium", "review"],
  ["Prepare survey forms", "You", "Aug 20", "Medium", "todo"],
  ["Project proposal", "John Cruz", "Completed", "Done", "done"],
];
const files = ["Proposal", "Chapter 1", "Chapter 2", "Chapter 3", "Presentation", "Source Code", "Design Assets", "Others"];
const tabs = ["Overview", "Files", "Tasks", "Messages", "Research", "Engineering", "Development", "Defense", "Payments"];

export default function DashboardPage() {
  const [tab, setTab] = useState("Overview");
  return <main className="dash-shell">
    <aside className="dash-sidebar">
      <a className="dash-brand" href="/"><span>B</span> BEAVER</a>
      <p className="workspace-label">WORKSPACE</p>
      <nav>
        <a className="active" href="/dashboard"><LayoutDashboard size={18}/> Overview</a>
        <a href="#projects"><FolderOpen size={18}/> My projects</a>
        <a href="#calendar"><CalendarDays size={18}/> Calendar</a>
        <a href="#messages"><MessageSquare size={18}/> Messages <i>4</i></a>
      </nav>
      <p className="workspace-label manage-label">MANAGE</p>
      <nav><a href="#settings"><Settings size={18}/> Settings</a></nav>
      <div className="sidebar-help"><span>?</span><div><strong>Need a hand?</strong><p>Talk to the BEAVER team</p></div></div>
      <div className="profile"><div className="avatar">C</div><div><strong>Cha Santos</strong><p>Student account</p></div><ChevronDown size={15}/></div>
    </aside>
    <section className="dash-content">
      <header className="dash-header"><div className="mobile-brand">B</div><div className="search"><Search size={17}/><input placeholder="Search projects, tasks, and files" /></div><button className="icon-button" aria-label="Notifications"><Bell size={19}/><i /></button><div className="header-avatar">C</div></header>
      <div className="page-body">
        <div className="welcome"><div><p className="dash-kicker">MONDAY, AUGUST 3</p><h1>Hello, Cha <span>✦</span></h1><p>Here’s a clear view of what needs your attention.</p></div><button className="new-project"><Plus size={17}/> New project</button></div>
        <section className="project-hero" id="projects"><div className="project-heading"><div className="project-symbol">C</div><div><p>ACTIVE PROJECT</p><h2>CUISINOVA</h2><span>Smart Canteen Ordering System</span></div><button><MoreHorizontal size={20}/></button></div><div className="project-metrics"><div><span>PROGRESS</span><strong>65%</strong><div className="progress"><i /></div></div><div><span>UPCOMING DEADLINE</span><strong>Chapter 3 submission</strong><p><Clock3 size={13}/> August 14, 2026</p></div><div><span>ASSIGNED MENTOR</span><strong>John Cruz</strong><p><div className="mentor">JC</div> Research mentor</p></div><a href="#workspace">Open workspace →</a></div></section>
        <section className="stat-grid"><article><div className="stat-icon peach"><CheckCircle2 size={19}/></div><div><span>PENDING TASKS</span><strong>7</strong><p>2 due this week</p></div></article><article><div className="stat-icon lavender"><MessageSquare size={19}/></div><div><span>UNREAD MESSAGES</span><strong>4</strong><p>Latest: 26m ago</p></div></article><article><div className="stat-icon blue"><FileText size={19}/></div><div><span>FILES TO REVIEW</span><strong>3</strong><p>1 needs approval</p></div></article><article><div className="stat-icon green"><CircleDollarSign size={19}/></div><div><span>REMAINING BALANCE</span><strong>₱12,500</strong><p>Due September 1</p></div></article></section>
        <section className="workspace" id="workspace"><div className="workspace-head"><div><p className="dash-kicker">PROJECT WORKSPACE</p><h2>CUISINOVA</h2></div><span className="project-status">In progress</span></div><div className="tab-row">{tabs.map(item => <button key={item} onClick={() => setTab(item)} className={tab === item ? "selected" : ""}>{item}</button>)}</div>{tab === "Overview" ? <Overview /> : <TabContent tab={tab} />}</section>
      </div>
    </section>
  </main>;
}

function Overview() { return <div className="workspace-grid"><div><section className="panel"><div className="panel-heading"><div><h3>Task board</h3><p>Stay on top of your next steps.</p></div><a href="#tasks">View all tasks</a></div><div className="task-table"><div className="task-columns"><span>TASK</span><span>ASSIGNED TO</span><span>DUE</span><span>PRIORITY</span></div>{tasks.slice(0, 4).map(([task, person, due, priority, state]) => <div className="task-row" key={task}><span><i className={'task-check ' + state}/>{task}</span><span>{person}</span><span>{due}</span><span className={'priority ' + priority.toLowerCase()}>{priority}</span></div>)}</div></section><section className="panel files-panel"><div className="panel-heading"><div><h3>Recent files</h3><p>Files from your workspace.</p></div><a href="#files">Open files</a></div><div className="file-list">{files.slice(0, 4).map((file, i) => <div key={file}><div className="file-icon"><FileText size={18}/></div><span><strong>{file}{i === 0 ? ".pdf" : ""}</strong><small>{i === 0 ? "Updated today" : `Updated ${i + 1} days ago`}</small></span><MoreHorizontal size={18}/></div>)}</div></section></div><div><section className="panel milestones"><div className="panel-heading"><div><h3>Project milestones</h3><p>Your journey to defense.</p></div></div>{[["Proposal", "completed"], ["Research", "completed"], ["System Design", "current"], ["Development", ""], ["Testing", ""], ["Defense", ""]].map(([name, state]) => <div className={'milestone ' + state} key={name}><i>{state === "completed" ? "✓" : ""}</i><span>{name}</span>{state === "current" && <small>In progress</small>}</div>)}</section><section className="panel activity"><div className="panel-heading"><div><h3>Recent activity</h3></div></div><div><b className="activity-avatar mentor">JC</b><p><strong>John Cruz</strong> approved your<br/> methodology draft <small>26m ago</small></p></div><div><b className="activity-avatar">B</b><p><strong>BEAVER team</strong> uploaded Chapter 2 <small>Yesterday</small></p></div></section></div></div> }
function TabContent({ tab }: { tab: string }) { const descriptions: Record<string, string> = { Files: "Your folders, version history, file previews, and approval requests will appear here.", Tasks: "Use this board to create, assign, and track every project task.", Messages: "Your project conversations and announcements will appear here.", Research: "Research objectives, RRL, methodology, references, and advisor feedback live here.", Engineering: "System requirements, architecture, diagrams, wireframes, and APIs live here.", Development: "Repository links, deployments, testing, bugs, and documentation live here.", Defense: "Slides, scripts, panel questions, and mock defense scheduling live here.", Payments: "Invoices, payment history, receipts, and your remaining balance live here." }; return <div className="empty-tab"><FolderOpen size={25}/><h3>{tab}</h3><p>{descriptions[tab]}</p><button>Coming soon</button></div>; }
