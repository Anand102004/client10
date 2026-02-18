import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Users, 
  CalendarCheck, 
  Receipt, 
  LogOut, 
  Armchair,
  BookOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [location] = useLocation();
  const { role, logout, user } = useAuth();

  const adminLinks = [
    { href: "/admin/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/admin/enquiries", label: "Enquiries", icon: Users },
    { href: "/admin/admissions", label: "Admissions & Seats", icon: Armchair },
    { href: "/admin/invoices", label: "Invoices", icon: Receipt },
    { href: "/admin/attendance", label: "Attendance", icon: CalendarCheck },
  ];

  const studentLinks = [
    { href: "/student/dashboard", label: "My Dashboard", icon: LayoutDashboard },
    { href: "/student/invoices", label: "My Invoices", icon: Receipt },
    { href: "/student/attendance", label: "My Attendance", icon: CalendarCheck },
  ];

  const links = role === 'admin' ? adminLinks : studentLinks;

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-gray-200 flex-shrink-0 z-20 md:h-screen sticky top-0">
        <div className="h-16 flex items-center px-6 border-b border-gray-100">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary cursor-pointer">
            <BookOpen className="h-6 w-6" />
            <span>Study Hall</span>
          </Link>
        </div>

        <div className="p-4">
          <div className="mb-6 px-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              {role === 'admin' ? 'Administration' : 'Student Portal'}
            </p>
            <div className="flex items-center gap-3 p-2 rounded-lg bg-primary/5 text-primary">
              <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold">
                {user?.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user?.name}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              </div>
            </div>
          </div>

          <nav className="space-y-1">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = location === link.href;
              return (
                <Link key={link.href} href={link.href} className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group",
                  isActive 
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" 
                    : "text-muted-foreground hover:bg-gray-100 hover:text-foreground"
                )}>
                  <Icon className={cn("h-4 w-4", isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground")} />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto p-4 border-t border-gray-100">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            onClick={logout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="h-16 border-b border-gray-200 bg-white/50 backdrop-blur-sm sticky top-0 z-10 px-8 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-foreground">
            {links.find(l => l.href === location)?.label || 'Dashboard'}
          </h1>
          <div className="text-sm text-muted-foreground">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>
        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
          {children}
        </div>
      </main>
    </div>
  );
}
