import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import NotFound from "@/pages/not-found";

// Pages
import Home from "@/pages/home";
import Login from "@/pages/login";
import AdminDashboard from "@/pages/admin-dashboard";
import AdminEnquiries from "@/pages/admin-enquiries";
import AdminAdmissions from "@/pages/admin-admissions";
import AdminInvoices from "@/pages/admin-invoices";
import AdminAttendance from "@/pages/admin-attendance";
import StudentDashboard from "@/pages/student-dashboard";

// Route Guards
function ProtectedRoute({ component: Component, allowedRole }: { component: any, allowedRole: 'admin' | 'student' }) {
  const { role } = useAuth();
  
  if (!role) return <Redirect to="/login" />;
  if (role !== allowedRole) return <Redirect to={role === 'admin' ? '/admin/dashboard' : '/student/dashboard'} />;
  
  return <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      
      {/* Admin Routes */}
      <Route path="/admin/dashboard">
        <ProtectedRoute component={AdminDashboard} allowedRole="admin" />
      </Route>
      <Route path="/admin/enquiries">
        <ProtectedRoute component={AdminEnquiries} allowedRole="admin" />
      </Route>
      <Route path="/admin/admissions">
        <ProtectedRoute component={AdminAdmissions} allowedRole="admin" />
      </Route>
      <Route path="/admin/invoices">
        <ProtectedRoute component={AdminInvoices} allowedRole="admin" />
      </Route>
      <Route path="/admin/attendance">
        <ProtectedRoute component={AdminAttendance} allowedRole="admin" />
      </Route>

      {/* Student Routes */}
      <Route path="/student/dashboard">
        <ProtectedRoute component={StudentDashboard} allowedRole="student" />
      </Route>
      {/* Reusing existing components for demo, ideally student versions would be simpler */}
      <Route path="/student/invoices">
        <ProtectedRoute component={AdminInvoices} allowedRole="student" />
      </Route>
      <Route path="/student/attendance">
        <ProtectedRoute component={AdminAttendance} allowedRole="student" />
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
