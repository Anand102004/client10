import { DashboardLayout } from "@/components/layout-dashboard";
import { useInvoices, useUsers } from "@/hooks/use-crm";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { User, Invoice } from "@shared/schema";

export default function AdminInvoices() {
  const { data: invoices, isLoading } = useInvoices();
  const { data: users } = useUsers();

  const getUserName = (userId: number) => {
    return users?.find((u: User) => u.id === userId)?.name || "Unknown User";
  };

  const downloadInvoice = (id: number) => {
    // Mock download
    alert(`Downloading invoice #${id}...`);
  };

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Invoices</h2>
          <p className="text-muted-foreground">Track payments and subscriptions</p>
        </div>
        <Button>
          <FileText className="mr-2 h-4 w-4" />
          Create Invoice
        </Button>
      </div>

      <Card className="border-none shadow-md">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-gray-50/50">
              <TableRow>
                <TableHead>Invoice ID</TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Download</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">Loading...</TableCell>
                </TableRow>
              ) : invoices?.length === 0 ? (
                <TableRow>
                   <TableCell colSpan={6} className="h-24 text-center">No invoices generated yet.</TableCell>
                </TableRow>
              ) : (
                invoices?.map((inv: Invoice) => (
                  <TableRow key={inv.id}>
                    <TableCell className="font-mono text-xs">INV-{inv.id.toString().padStart(4, '0')}</TableCell>
                    <TableCell className="font-medium">{getUserName(inv.userId)}</TableCell>
                    <TableCell>${Number(inv.amount).toFixed(2)}</TableCell>
                    <TableCell>{inv.createdAt ? format(new Date(inv.createdAt), 'MMM dd, yyyy') : '-'}</TableCell>
                    <TableCell>
                      <Badge variant={inv.status === 'paid' ? 'default' : 'destructive'} className={inv.status === 'paid' ? 'bg-emerald-500 hover:bg-emerald-600' : ''}>
                        {inv.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => downloadInvoice(inv.id)}>
                        <Download className="h-4 w-4 text-muted-foreground" />
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
