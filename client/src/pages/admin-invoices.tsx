import { useState } from "react";
import { DashboardLayout } from "@/components/layout-dashboard";
import { useInvoices, useUsers, useUpdateInvoice } from "@/hooks/use-crm";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, CheckCircle, Eye, ExternalLink, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { User, Invoice } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export default function AdminInvoices() {
  const { data: invoices, isLoading } = useInvoices();
  const { data: users } = useUsers();
  const { mutate: updateInvoice } = useUpdateInvoice();
  const { toast } = useToast();

  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const getUserName = (userId: number) => {
    return users?.find((u: User) => u.id === userId)?.name || "Unknown User";
  };

  const handleApprove = (invoice: Invoice) => {
    updateInvoice({
      id: invoice.id,
      status: 'paid',
      paidAt: new Date()
    }, {
      onSuccess: () => {
        toast({ title: "Payment Approved", description: "Invoice updated to Paid status and seat blocked." });
        setSelectedInvoice(null);
      }
    });
  };

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Payments & Invoices</h2>
          <p className="text-muted-foreground">Review pending transactions and approve admissions</p>
        </div>
      </div>

      <Card className="border-none shadow-md overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-gray-50/50">
              <TableRow>
                <TableHead className="px-6">Invoice ID</TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Ref ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right px-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">Loading payments...</TableCell>
                </TableRow>
              ) : invoices?.length === 0 ? (
                <TableRow>
                   <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">No payment history found.</TableCell>
                </TableRow>
              ) : (
                invoices?.map((inv: Invoice) => (
                  <TableRow key={inv.id} className="hover:bg-muted/5 transition-colors">
                    <TableCell className="px-6 font-mono text-[10px] text-muted-foreground">
                      #INV-{inv.id.toString().padStart(4, '0')}
                    </TableCell>
                    <TableCell className="font-semibold">{getUserName(inv.userId)}</TableCell>
                    <TableCell className="font-bold">${Number(inv.amount).toFixed(2)}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {inv.transactionId || "REF-12345678"}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={inv.status === 'paid' ? 'default' : inv.status === 'verifying' ? 'outline' : 'destructive'} 
                        className={cn(
                          "px-2 py-0.5",
                          inv.status === 'paid' && "bg-emerald-500 hover:bg-emerald-600",
                          (inv.status === 'verifying' || !inv.status) && "text-amber-600 border-amber-200 bg-amber-50"
                        )}
                      >
                        {inv.status || 'verifying'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right px-6 space-x-2">
                      {(inv.status === 'verifying' || !inv.status) && (
                        <Button size="sm" variant="outline" className="h-8 border-primary text-primary hover:bg-primary/5" onClick={() => setSelectedInvoice(inv)}>
                          <ShieldCheck className="w-3.5 h-3.5 mr-1" /> Verify
                        </Button>
                      )}
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                        <Download className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!selectedInvoice} onOpenChange={(open) => !open && setSelectedInvoice(null)}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Review Payment</DialogTitle>
            <DialogDescription>Verify transaction for {selectedInvoice && getUserName(selectedInvoice.userId)}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="p-4 bg-muted/30 rounded-lg border space-y-3">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Reference ID</span>
                <span className="font-mono font-bold uppercase">{selectedInvoice?.transactionId || "REF-12345678"}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Amount Paid</span>
                <span className="font-bold text-emerald-600">${selectedInvoice?.amount}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-bold text-muted-foreground">Payment Proof</Label>
              <div className="aspect-[4/3] bg-muted rounded-lg border flex flex-col items-center justify-center relative group overflow-hidden">
                <p className="text-[10px] text-muted-foreground">Screenshot Preview</p>
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
                   <ExternalLink className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="ghost" onClick={() => setSelectedInvoice(null)}>Cancel</Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => selectedInvoice && handleApprove(selectedInvoice)}>
              <CheckCircle className="w-4 h-4 mr-2" /> Confirm & Activate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
