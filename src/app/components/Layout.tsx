import { Outlet, Link, useLocation } from "react-router";
import { BookOpen, GraduationCap, Building2, Link2, Settings, LayoutDashboard } from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Curriculums", href: "/curriculums", icon: BookOpen },
  { name: "Schools", href: "/schools", icon: Building2 },
  { name: "Assignments", href: "/assignments", icon: Link2 },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Layout() {
  const location = useLocation();

  return (
    <div className="flex h-screen bg-slate-50">
      <aside className="w-64 bg-[#082762] text-white flex flex-col">
        <div className="p-6 border-b border-blue-900/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-semibold text-lg">EduManage</h1>
              <p className="text-xs text-blue-300">Curriculum System</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href ||
              (item.href !== "/" && location.pathname.startsWith(item.href));

            return (
              <Link
                key={item.name}
                to={item.href}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                  ${isActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20"
                    : "text-blue-100 hover:bg-blue-900/30 hover:text-white"
                  }
                `}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-blue-900/30">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-sm font-semibold">
              AD
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">Admin User</p>
              <p className="text-xs text-blue-300 truncate">admin@school.com</p>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
