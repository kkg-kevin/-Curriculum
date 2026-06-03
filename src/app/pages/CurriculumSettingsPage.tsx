import { useState, type ReactNode } from "react";
import { Link } from "react-router";
import {
  Bell,
  Box,
  CalendarDays,
  Check,
  ChevronDown,
  CircleHelp,
  ClipboardCheck,
  FileCheck2,
  Globe2,
  History,
  Info,
  Languages,
  LineChart,
  LockKeyhole,
  PackageCheck,
  RefreshCw,
  RotateCcw,
  Search,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  Users,
  Workflow,
  X,
} from "lucide-react";
import { defaultSettings, getMockSettings, saveMockSettings } from "../data/mockData";

type Permission = "create" | "edit" | "publish" | "approve";

const rolePermissions: Array<{
  role: string;
  permissions: Record<Permission, boolean>;
}> = [
  { role: "Super Admin", permissions: { create: true, edit: true, publish: true, approve: true } },
  { role: "Curriculum Admin", permissions: { create: true, edit: true, publish: true, approve: true } },
  { role: "Deployment Admin", permissions: { create: false, edit: true, publish: true, approve: false } },
  { role: "School Admin", permissions: { create: false, edit: false, publish: false, approve: true } },
  { role: "Teacher", permissions: { create: false, edit: false, publish: false, approve: false } },
];

export function CurriculumSettingsPage() {
  const [settings, setSettings] = useState(() => getMockSettings());
  const [saveMessage, setSaveMessage] = useState("");

  const toggle = (key: keyof typeof settings) => {
    setSettings((current) => ({ ...current, [key]: !current[key] }));
  };

  return (
    <div className="min-h-full bg-[#F7F9FC]">
      <div className="mx-auto max-w-[1540px] px-6 py-5 lg:px-8">
        <header className="mb-5">
          <div className="mb-5 flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2 text-sm">
                <span className="font-medium text-blue-600">Curriculum</span>
                <ChevronDown className="-rotate-90 h-4 w-4 text-slate-400" />
                <span className="font-semibold text-slate-700">Settings</span>
              </div>
              <h1 className="text-3xl font-semibold tracking-[0px] text-slate-900">Curriculum Settings</h1>
              <p className="mt-4 text-base text-slate-600">
                Configure global preferences, governance, and rules that keep your curriculum consistent and compliant.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="relative hidden h-11 min-w-[320px] lg:block">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  placeholder="Search Digifunzi..."
                  className="h-full w-full rounded-xl border-0 bg-slate-100 pl-12 pr-4 text-sm text-slate-700 outline-none focus:ring-4 focus:ring-blue-100"
                />
              </div>
              <button className="grid h-11 w-11 place-items-center rounded-full border border-slate-200 bg-white text-blue-600 shadow-sm">
                <CircleHelp className="h-5 w-5" />
              </button>
              <button className="relative grid h-11 w-11 place-items-center rounded-full border border-slate-200 bg-white text-blue-600 shadow-sm">
                <Bell className="h-5 w-5" />
                <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-red-500 text-[11px] font-semibold text-white">3</span>
              </button>
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-full bg-slate-200 text-sm font-semibold text-slate-700">JK</div>
                <div className="hidden sm:block">
                  <p className="text-sm font-semibold text-slate-900">Jane K.</p>
                  <p className="text-xs text-slate-500">Super Admin</p>
                </div>
                <ChevronDown className="hidden h-4 w-4 text-slate-400 sm:block" />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap justify-end gap-3">
            <button className="inline-flex h-11 items-center gap-2 rounded-lg bg-blue-600 px-7 text-sm font-semibold text-white shadow-sm hover:bg-blue-700">
            <button
              onClick={() => {
                saveMockSettings(settings);
                setSaveMessage("Settings saved");
              }}
              className="inline-flex h-11 items-center gap-2 rounded-lg bg-blue-600 px-7 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
            >
              <Check className="h-4 w-4" />
              Save Changes
            </button>
            <button
              onClick={() => {
                setSettings(defaultSettings);
                saveMockSettings(defaultSettings);
                setSaveMessage("Settings reset");
              }}
              className="inline-flex h-11 items-center gap-2 rounded-lg border border-slate-300 bg-white px-7 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </button>
          </div>
          {saveMessage && <p className="mt-3 text-right text-sm font-semibold text-emerald-600">{saveMessage}</p>}
        </header>

        <nav className="mb-5 flex overflow-x-auto rounded-lg border border-slate-200 bg-white">
          {[
            { label: "General", icon: Settings, active: true },
            { label: "Governance", icon: LockKeyhole },
            { label: "Version Control", icon: History, href: "/settings/version-control" },
            { label: "Supplement Rules", icon: Box },
            { label: "Deployment", icon: BookIcon },
            { label: "Integrations", icon: RefreshCw },
            { label: "Notifications", icon: Bell },
            { label: "Audit", icon: ClipboardCheck },
          ].map((tab) => (
            <Link
              key={tab.label}
              to={tab.href || "/settings"}
              className={`inline-flex h-14 min-w-max items-center gap-2 border-b-2 px-6 text-sm font-semibold ${
                tab.active
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </Link>
          ))}
        </nav>

        <div className="grid gap-5 xl:grid-cols-[1.05fr_1fr]">
          <div className="space-y-5">
            <SettingsCard title="General Preferences" description="Configure how curriculum operates across the platform.">
              <SettingSelect
                icon={<CalendarDays className="h-6 w-6" />}
                title="Default Academic Cycle"
                description="Select the default cycle model for new curricula."
                value="3 Terms (Term 1, Term 2, Term 3)"
              />
              <SettingSelect
                icon={<CalendarDays className="h-6 w-6" />}
                title="Default Academic Week"
                description="Define the starting day of the academic week."
                value="Monday"
              />
              <SettingSelect
                icon={<LineChart className="h-6 w-6" />}
                title="Progress Calculation"
                description="Choose how learner progress is calculated."
                value="Competency-Based"
              />
              <SettingRow
                icon={<ShieldCheck className="h-6 w-6" />}
                title="Enable Competencies"
                description="Track learning using competencies and outcomes."
                control={<Switch checked={settings.competencies} onChange={() => toggle("competencies")} />}
              />
              <SettingRow
                icon={<PackageCheck className="h-6 w-6" />}
                title="Auto-Archive Inactive Versions"
                description="Automatically archive curriculum versions after"
                control={
                  <div className="flex items-center gap-3">
                    <input className="h-10 w-16 rounded-lg border border-slate-200 px-3 text-center text-sm font-semibold outline-none" defaultValue="24" />
                    <span className="text-sm text-slate-700">months</span>
                    <Switch checked={settings.autoArchive} onChange={() => toggle("autoArchive")} />
                  </div>
                }
              />
              <SettingSelect
                icon={<Globe2 className="h-6 w-6" />}
                title="Language Preference"
                description="Default language for curriculum content."
                value="English"
              />
            </SettingsCard>

            <SettingsCard title="Content & Standards" description="Manage curriculum standards and content behavior.">
              <SettingRow
                icon={<Box className="h-6 w-6" />}
                title="Outcome Framework"
                description="Select the framework for learning outcomes."
                control={
                  <div className="flex items-center gap-3">
                    <SelectLike value="Digifunzi Competency Framework" width="w-64" />
                    <Info className="h-4 w-4 text-blue-600" />
                  </div>
                }
              />
              <SettingRow
                icon={<Workflow className="h-6 w-6" />}
                title="Require Outcome Mapping"
                description="Ensure every course maps to at least one outcome."
                control={<Switch checked={settings.outcomeMapping} onChange={() => toggle("outcomeMapping")} />}
              />
              <SettingRow
                icon={<ClipboardCheck className="h-6 w-6" />}
                title="Minimum Assessments per Course"
                description="Set the minimum number of assessments required."
                control={<NumberInput value="2" />}
              />
              <SettingRow
                icon={<SlidersHorizontal className="h-6 w-6" />}
                title="Allow Course Reuse"
                description="Allow courses to be reused across terms or classes."
                control={<Switch checked={settings.courseReuse} onChange={() => toggle("courseReuse")} />}
              />
            </SettingsCard>
          </div>

          <div className="space-y-5">
            <SettingsCard title="Governance & Permissions" description="Control who can create, edit, and approve curriculum.">
              <div className="overflow-hidden rounded-lg border border-slate-200">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-600">
                    <tr>
                      <th className="px-4 py-3">Role</th>
                      <th className="px-4 py-3 text-center">Create</th>
                      <th className="px-4 py-3 text-center">Edit</th>
                      <th className="px-4 py-3 text-center">Publish</th>
                      <th className="px-4 py-3 text-center">Approve</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {rolePermissions.map((row) => (
                      <tr key={row.role}>
                        <td className="px-4 py-3 font-medium text-slate-700">{row.role}</td>
                        {(["create", "edit", "publish", "approve"] as Permission[]).map((permission) => (
                          <td key={permission} className="px-4 py-3 text-center">
                            <PermissionDot enabled={row.permissions[permission]} />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg bg-blue-50 px-4 py-3 text-sm text-blue-700">
                <span className="inline-flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  Permission changes apply to all users with the selected role.
                </span>
                <button className="font-semibold">Manage Roles →</button>
              </div>
            </SettingsCard>

            <SettingsCard title="Supplement Settings" description="Control how supplements and overrides work.">
              <SettingRow
                icon={<ShieldCheck className="h-6 w-6" />}
                title="Enable Supplements"
                description="Allow schools to request and use supplements."
                control={<Switch checked={settings.supplements} onChange={() => toggle("supplements")} />}
              />
              <SettingRow
                icon={<PackageCheck className="h-6 w-6" />}
                title="Require Approval"
                description="All supplements must be approved before activation."
                control={<Switch checked={settings.supplementApproval} onChange={() => toggle("supplementApproval")} />}
              />
              <SettingRow
                icon={<FileCheck2 className="h-6 w-6" />}
                title="Allowed Supplement Types"
                description="Select which types of supplements are allowed."
                control={<PillSelect values={["Additive", "Substitutive", "Pacing", "Cohort-Specific"]} />}
              />
              <SettingRow
                icon={<History className="h-6 w-6" />}
                title="Default Expiry (days)"
                description="Supplements expire after the set number of days."
                control={<input className="h-10 w-24 rounded-lg border border-slate-200 px-3 text-sm font-semibold outline-none" defaultValue="180" />}
              />
              <div className="mt-4 flex gap-3 rounded-lg border border-emerald-100 bg-emerald-50 px-4 py-3">
                <ShieldCheck className="h-7 w-7 shrink-0 text-emerald-600" />
                <div>
                  <p className="text-sm text-slate-700">Your supplement policies ensure quality and consistency.</p>
                  <button className="mt-1 text-sm font-semibold text-blue-600">Learn more ↗</button>
                </div>
              </div>
            </SettingsCard>
          </div>
        </div>

        <SettingsCard title="Data & Compliance" description="Ensure data integrity and auditability." className="mt-5">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <ComplianceItem
              icon={<Workflow className="h-6 w-6" />}
              title="Audit Logging"
              description="Track all curriculum changes."
              detail="Enabled"
              control={<Switch checked={settings.auditLogging} onChange={() => toggle("auditLogging")} />}
            />
            <ComplianceItem
              icon={<Users className="h-6 w-6" />}
              title="Data Retention"
              description="Keep curriculum data for"
              detail=""
              control={<SelectLike value="7 years" width="w-28" />}
            />
            <ComplianceItem
              icon={<FileCheck2 className="h-6 w-6" />}
              title="Export Options"
              description="Allow curriculum exports."
              detail="Enabled"
              control={<Switch checked={settings.exportOptions} onChange={() => toggle("exportOptions")} />}
            />
            <ComplianceItem
              icon={<LockKeyhole className="h-6 w-6" />}
              title="Compliance Mode"
              description="Enforce strict governance rule."
              detail="Enabled"
              control={<Switch checked={settings.complianceMode} onChange={() => toggle("complianceMode")} />}
            />
          </div>
        </SettingsCard>
      </div>
    </div>
  );
}

function BookIcon(props: { className?: string }) {
  return <Languages {...props} />;
}

function SettingsCard({
  title,
  description,
  children,
  className = "",
}: {
  title: string;
  description: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`overflow-hidden rounded-lg border border-slate-200 bg-white ${className}`}>
      <div className="border-b border-slate-200 px-5 py-5">
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
        <p className="mt-2 text-sm text-slate-500">{description}</p>
      </div>
      <div>{children}</div>
    </section>
  );
}

function SettingRow({
  icon,
  title,
  description,
  control,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  control: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 border-b border-slate-200 px-5 py-4 last:border-b-0 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-blue-50 text-blue-600">{icon}</div>
        <div>
          <p className="font-semibold text-slate-900">{title}</p>
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        </div>
      </div>
      <div className="sm:ml-4">{control}</div>
    </div>
  );
}

function SettingSelect({ icon, title, description, value }: { icon: ReactNode; title: string; description: string; value: string }) {
  return <SettingRow icon={icon} title={title} description={description} control={<SelectLike value={value} width="w-64" />} />;
}

function SelectLike({ value, width }: { value: string; width: string }) {
  return (
    <button className={`inline-flex h-10 ${width} max-w-full items-center justify-between rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700`}>
      <span className="truncate">{value}</span>
      <ChevronDown className="h-4 w-4 shrink-0 text-slate-400" />
    </button>
  );
}

function Switch({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`relative h-7 w-12 rounded-full transition ${checked ? "bg-blue-600" : "bg-slate-300"}`}
      aria-pressed={checked}
    >
      <span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${checked ? "left-6" : "left-1"}`} />
    </button>
  );
}

function NumberInput({ value }: { value: string }) {
  return (
    <div className="inline-flex h-10 w-20 items-center justify-between rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700">
      {value}
      <div className="grid gap-0.5 text-slate-400">
        <ChevronDown className="h-3 w-3 rotate-180" />
        <ChevronDown className="h-3 w-3" />
      </div>
    </div>
  );
}

function PermissionDot({ enabled }: { enabled: boolean }) {
  return enabled ? (
    <span className="inline-grid h-5 w-5 place-items-center rounded-full bg-emerald-500 text-white">
      <Check className="h-3.5 w-3.5" />
    </span>
  ) : (
    <span className="inline-grid h-5 w-5 place-items-center rounded-full bg-slate-300 text-white">
      <X className="h-3.5 w-3.5" />
    </span>
  );
}

function PillSelect({ values }: { values: string[] }) {
  return (
    <div className="flex min-h-11 w-80 max-w-full flex-wrap items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2">
      {values.map((value) => (
        <span key={value} className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-slate-600">
          {value}
          <X className="h-3 w-3 text-slate-400" />
        </span>
      ))}
      <ChevronDown className="ml-auto h-4 w-4 text-slate-400" />
    </div>
  );
}

function ComplianceItem({
  icon,
  title,
  description,
  detail,
  control,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  detail: string;
  control: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex min-w-0 items-center gap-4">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-blue-50 text-blue-600">{icon}</div>
        <div className="min-w-0">
          <p className="font-semibold text-slate-900">{title}</p>
          <p className="truncate text-sm text-slate-500">{description}</p>
          {detail && <p className="mt-1 text-xs font-semibold text-blue-600">{detail}</p>}
        </div>
      </div>
      <div className="shrink-0">{control}</div>
    </div>
  );
}
