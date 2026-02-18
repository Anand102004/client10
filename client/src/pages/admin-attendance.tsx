import { DashboardLayout } from "@/components/layout-dashboard";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function AdminAttendance() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  // Mock data for the selected date
  const dailyAttendance = [
    { id: 1, name: "Alice Smith", timeIn: "08:45 AM", timeOut: "04:30 PM", status: "present" },
    { id: 2, name: "Bob Jones", timeIn: "09:15 AM", timeOut: "-", status: "present" },
    { id: 3, name: "Charlie Brown", timeIn: "-", timeOut: "-", status: "absent" },
    { id: 4, name: "Diana Prince", timeIn: "08:00 AM", timeOut: "01:00 PM", status: "present" },
  ];

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
         <div>
          <h2 className="text-2xl font-bold tracking-tight">Daily Attendance</h2>
          <p className="text-muted-foreground">Monitor student check-ins and check-outs</p>
        </div>

        <div className="grid md:grid-cols-12 gap-8">
          <div className="md:col-span-4">
             <Card className="border-none shadow-md">
               <CardHeader>
                 <CardTitle>Select Date</CardTitle>
               </CardHeader>
               <CardContent>
                 <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border mx-auto"
                 />
               </CardContent>
             </Card>
          </div>

          <div className="md:col-span-8">
            <Card className="border-none shadow-md h-full">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>
                  Records for {date ? format(date, "MMMM dd, yyyy") : "Selected Date"}
                </CardTitle>
                <Badge variant="outline" className="px-3 py-1">
                  Total: {dailyAttendance.length}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dailyAttendance.map((record) => (
                    <div key={record.id} className="flex items-center justify-between p-4 rounded-xl bg-gray-50/80 hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarFallback className="bg-primary/10 text-primary">{record.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-sm">{record.name}</p>
                          <p className="text-xs text-muted-foreground">Student ID: #{1000 + record.id}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-8 text-sm">
                        <div className="text-center">
                          <p className="text-xs text-muted-foreground mb-1">In</p>
                          <p className="font-medium">{record.timeIn}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-muted-foreground mb-1">Out</p>
                          <p className="font-medium">{record.timeOut}</p>
                        </div>
                        <Badge variant={record.status === 'present' ? 'default' : 'destructive'} className="w-20 justify-center capitalize">
                          {record.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
