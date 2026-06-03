import { Outlet, Link, useLocation } from "react-router";
import {
  BarChart3,
  BookOpen,
  Building2,
  ClipboardCheck,
  ExternalLink,
  GraduationCap,
  HelpCircle,
  Home,
  Route,
  Settings,
  UserRound,
  Users,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Schools", href: "/schools", icon: Building2 },
  { name: "Curriculum", href: "/curriculums", icon: BookOpen },
  { name: "Learners", href: "/learners", icon: Users },
  { name: "Teachers", href: "/teachers", icon: UserRound },
  { name: "Classes", href: "/classes", icon: Route },
  { name: "Assessments", href: "/assessments", icon: ClipboardCheck },
  { name: "Reports", href: "/reports", icon: BarChart3 },
  { name: "Settings", href: "/settings", icon: Settings },
];

function DigifunziMark({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <div className={`${className} grid shrink-0 place-items-center rounded-xl bg-cyan-400`}>
      <div className="grid h-7 w-7 place-items-center rounded-lg bg-white text-[#0B3C91]">
        <GraduationCap className="h-4 w-4" />
      </div>
    </div>
  );
}

export function Layout() {
  const location = useLocation();

  return (
    <div className="flex h-screen bg-slate-50">
      <aside className="flex w-64 shrink-0 flex-col bg-gradient-to-b from-[#0A3F96] via-[#073985] to-[#062B69] text-white">
        <div className="px-7 pb-10 pt-8">
          <div className="flex items-center gap-3">
            <DigifunziMark />
            <div>
              <h1 className="text-3xl font-semibold leading-7 tracking-[0px]">digifunzi</h1>
              <p className="mt-1 text-xs text-blue-100">Future-Ready Learning</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-2 px-5">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href ||
              (item.href !== "/" && location.pathname.startsWith(item.href));

            return (
              <Link
                key={item.name}
                to={item.href}
                className={`
                  flex items-center gap-4 rounded-lg px-4 py-3 text-base font-medium transition-all
                  ${isActive
                    ? "bg-blue-600/90 text-white shadow-lg shadow-blue-950/20"
                    : "text-blue-50 hover:bg-white/10 hover:text-white"
                  }
                `}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="px-5 pb-8">
          <div className="rounded-lg bg-blue-500/70 p-5 shadow-lg shadow-blue-950/20">
            <h2 className="text-xl font-semibold">Need Help?</h2>
            <p className="mt-4 text-sm leading-6 text-blue-50">Visit our help center or contact support.</p>
            <button className="mt-5 flex h-10 w-full items-center justify-between rounded-lg border border-white/25 px-4 text-sm font-semibold text-white hover:bg-white/10">
              <span className="inline-flex items-center gap-2">
                <HelpCircle className="h-4 w-4" />
                Get Help
              </span>
              <ExternalLink className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-8 border-t border-white/20 pt-6">
            <div className="flex items-center gap-3">
              <DigifunziMark className="h-8 w-8" />
              <span className="text-2xl font-semibold">digifunzi</span>
            </div>
            <p className="mt-4 text-sm text-blue-100">© 2024 Digifunzi LTD.</p>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
