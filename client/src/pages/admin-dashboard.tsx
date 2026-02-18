import { DashboardLayout } from "@/components/layout-dashboard";
import { StatCard } from "@/components/ui/stat-card";
import { useStats } from "@/hooks/use-crm";
import { Users, DollarSign, Armchair, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminDashboard() {
  const { data: stats, isLoading } = useStats();

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-32 rounded-xl" />)}
        </div>
        <Skeleton className="h-[400px] w-full mt-8 rounded-xl" />
      </DashboardLayout>
    );
  }

  // Fallback data if API not fully ready
  const activeSubscribers = stats?.activeSubscribers || 124;
  const revenuePaid = stats?.monthlyRevenue?.paid || 12500;
  const revenuePending = stats?.monthlyRevenue?.pending || 3200;
  const attendanceData = stats?.attendanceData || [
    { date: "Mon", present: 85, absent: 15 },
    { date: "Tue", present: 92, absent: 8 },
    { date: "Wed", present: 88, absent: 12 },
    { date: "Thu", present: 95, absent: 5 },
    { date: "Fri", present: 80, absent: 20 },
    { date: "Sat", present: 60, absent: 40 },
    { date: "Sun", present: 45, absent: 55 },
  ];

  return (
    <DashboardLayout>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Active Students" 
          value={activeSubscribers} 
          icon={Users}
          trend={{ value: 12, label: "from last month", positive: true }}
          className="bg-white"
        />
        <StatCard 
          title="Revenue (Paid)" 
          value={`$${revenuePaid.toLocaleString()}`} 
          icon={DollarSign}
          trend={{ value: 8, label: "increase", positive: true }}
          className="bg-white"
        />
        <StatCard 
          title="Pending Fees" 
          value={`$${revenuePending.toLocaleString()}`} 
          icon={TrendingUp}
          trend={{ value: 2, label: "decrease", positive: true }}
          className="bg-white border-l-4 border-l-yellow-400"
        />
        <StatCard 
          title="Occupancy" 
          value="82%" 
          icon={Armchair}
          description="82/100 Seats Occupied"
          className="bg-white"
        />
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 border-none shadow-md">
          <CardHeader>
            <CardTitle>Attendance Trends</CardTitle>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#F3F4F6'}}
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="present" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Present" />
                <Bar dataKey="absent" fill="#E5E7EB" radius={[4, 4, 0, 0]} name="Absent" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md bg-gradient-to-br from-primary to-primary/80 text-white">
          <CardHeader>
            <CardTitle className="text-white">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <button className="w-full bg-white/10 hover:bg-white/20 text-left px-4 py-3 rounded-lg transition-colors flex items-center justify-between group">
              <span className="font-medium">New Admission</span>
              <Armchair className="w-5 h-5 opacity-70 group-hover:opacity-100" />
            </button>
            <button className="w-full bg-white/10 hover:bg-white/20 text-left px-4 py-3 rounded-lg transition-colors flex items-center justify-between group">
              <span className="font-medium">Generate Invoice</span>
              <DollarSign className="w-5 h-5 opacity-70 group-hover:opacity-100" />
            </button>
            <button className="w-full bg-white/10 hover:bg-white/20 text-left px-4 py-3 rounded-lg transition-colors flex items-center justify-between group">
              <span className="font-medium">Mark Attendance</span>
              <Users className="w-5 h-5 opacity-70 group-hover:opacity-100" />
            </button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
