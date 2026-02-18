import { DashboardLayout } from "@/components/layout-dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEnquiries } from "@/hooks/use-crm";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Filter, MoreHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Enquiry } from "@shared/schema";

export default function AdminEnquiries() {
  const { data: enquiries, isLoading } = useEnquiries();

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Enquiries</h2>
          <p className="text-muted-foreground">Manage incoming student requests</p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search name, email..." className="pl-9 bg-white" />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card className="border-none shadow-md overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-gray-50/50">
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Preferred Slot</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">Loading...</TableCell>
                </TableRow>
              ) : enquiries?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">No enquiries found.</TableCell>
                </TableRow>
              ) : (
                enquiries?.map((enquiry: Enquiry) => (
                  <TableRow key={enquiry.id} className="hover:bg-gray-50/50 transition-colors">
                    <TableCell className="font-medium">{enquiry.name}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-xs">{enquiry.email}</span>
                        <span className="text-xs text-muted-foreground">{enquiry.phone}</span>
                      </div>
                    </TableCell>
                    <TableCell>{enquiry.course || '-'}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="capitalize">
                        {enquiry.preferredSlot?.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={
                        enquiry.status === 'pending' ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' :
                        enquiry.status === 'admitted' ? 'bg-green-100 text-green-700 hover:bg-green-200' :
                        'bg-gray-100 text-gray-700'
                      }>
                        {enquiry.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
