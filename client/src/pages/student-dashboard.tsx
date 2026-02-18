import { DashboardLayout } from "@/components/layout-dashboard";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, CalendarCheck, Award, Receipt } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function StudentDashboard() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-primary to-accent rounded-3xl p-8 text-white shadow-lg">
          <h2 className="text-3xl font-bold mb-2">Welcome back, Alex!</h2>
          <p className="text-blue-100 max-w-2xl">
            You've studied for <span className="font-bold text-white">42 hours</span> this month. Keep up the great momentum!
          </p>
          <div className="mt-8 flex gap-4">
             <Button variant="secondary" className="bg-white/10 hover:bg-white/20 text-white border-none shadow-none">
                Check In Now
             </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-6 md:grid-cols-3">
          <StatCard 
            title="Attendance" 
            value="92%" 
            icon={CalendarCheck}
            trend={{ value: 2, label: "this week", positive: true }}
            className="bg-white"
          />
          <StatCard 
            title="Study Hours" 
            value="156" 
            icon={Clock}
            description="Total hours this semester"
            className="bg-white"
          />
          <StatCard 
            title="Plan Status" 
            value="Active" 
            icon={Award}
            description="5 Hours / Day Plan"
            className="bg-white border-l-4 border-l-emerald-500"
          />
        </div>

        {/* Recent Invoice */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-none shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="h-5 w-5 text-muted-foreground" />
                Recent Invoice
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center py-4 border-b">
                <div>
                  <p className="font-semibold">September Subscription</p>
                  <p className="text-sm text-muted-foreground">Due Oct 1, 2024</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">$25.00</p>
                  <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">Paid</span>
                </div>
              </div>
              <div className="mt-4 text-sm text-muted-foreground">
                <p>Plan: 5 Hours Daily</p>
                <p>Payment Method: Visa ending 4242</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">Download PDF</Button>
            </CardFooter>
          </Card>

          <Card className="border-none shadow-md">
             <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-muted-foreground" />
                Course Progress
              </CardTitle>
             </CardHeader>
             <CardContent className="space-y-6">
               <div>
                 <div className="flex justify-between text-sm mb-2">
                   <span className="font-medium">UPSC Prelims Prep</span>
                   <span className="text-muted-foreground">75%</span>
                 </div>
                 <Progress value={75} className="h-2" />
               </div>
               <div>
                 <div className="flex justify-between text-sm mb-2">
                   <span className="font-medium">Mock Tests Completed</span>
                   <span className="text-muted-foreground">4/10</span>
                 </div>
                 <Progress value={40} className="h-2 bg-gray-100" />
               </div>
             </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
