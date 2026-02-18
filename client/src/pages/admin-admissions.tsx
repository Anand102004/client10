import { useState } from "react";
import { DashboardLayout } from "@/components/layout-dashboard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useSeats, useUpdateSeat, useCreateUser, useEnquiries } from "@/hooks/use-crm";
import { Seat, Enquiry } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Check } from "lucide-react";

export default function AdminAdmissions() {
  const { data: seats, isLoading: seatsLoading } = useSeats();
  const { data: enquiries } = useEnquiries();
  const { mutate: updateSeat } = useUpdateSeat();
  const { mutate: createUser, isPending: isCreatingUser } = useCreateUser();
  const { toast } = useToast();

  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedEnquiryId, setSelectedEnquiryId] = useState<string>("");
  const [selectedPlan, setSelectedPlan] = useState<string>("3_hours");

  // Generate 10x10 grid (rows 1-10, seats 1-100)
  // Mock seats if data not available yet
  const gridSeats = Array.from({ length: 100 }, (_, i) => {
    const seatNum = i + 1;
    const existing = seats?.find((s: Seat) => s.seatNumber === seatNum);
    if (existing) return existing;
    // Default structure for demo
    const row = Math.ceil(seatNum / 10);
    return {
      id: seatNum,
      seatNumber: seatNum,
      rowNumber: row,
      isReserved: false,
      planType: row <= 2 ? '15_hours' : 'any', // First 2 rows reserved for 15 hours
    } as Seat;
  });

  const handleSeatClick = (seat: Seat) => {
    if (seat.isReserved) {
      toast({ title: "Seat Unavailable", description: "This seat is already booked.", variant: "destructive" });
      return;
    }
    setSelectedSeat(seat);
    setIsDialogOpen(true);
    // Reset form
    setSelectedEnquiryId("");
    setSelectedPlan(seat.rowNumber <= 2 ? "15_hours" : "3_hours");
  };

  const handleAdmission = () => {
    if (!selectedSeat || !selectedEnquiryId) return;

    const enquiry = enquiries?.find((e: Enquiry) => e.id.toString() === selectedEnquiryId);
    if (!enquiry) return;

    // 1. Create User
    createUser({
      name: enquiry.name,
      email: enquiry.email,
      phone: enquiry.phone,
      role: 'student',
      course: enquiry.course,
      planType: selectedPlan
    }, {
      onSuccess: (newUser) => {
        // 2. Reserve Seat
        updateSeat({
          id: selectedSeat.id,
          isReserved: true,
          userId: newUser.id,
          planType: selectedPlan
        });
        setIsDialogOpen(false);
        toast({ title: "Admission Successful", description: `Student assigned to Seat ${selectedSeat.seatNumber}` });
      }
    });
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Seat Allocation</h2>
          <p className="text-muted-foreground">Click on an available seat to admit a student.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Legend */}
          <Card className="lg:w-64 h-fit border-none shadow-md">
            <CardHeader>
              <CardTitle className="text-base">Legend</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded bg-emerald-100 border border-emerald-200"></div>
                <span className="text-sm">Available</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded bg-rose-100 border border-rose-200"></div>
                <span className="text-sm">Booked</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded bg-slate-100 border border-slate-200"></div>
                <span className="text-sm">Restricted (15hr Only)</span>
              </div>
            </CardContent>
          </Card>

          {/* Seat Map */}
          <Card className="flex-1 border-none shadow-md">
            <CardContent className="p-6 overflow-x-auto">
              {seatsLoading ? (
                <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-primary" /></div>
              ) : (
                <div className="grid grid-cols-10 gap-2 min-w-[600px] mx-auto w-fit">
                  {gridSeats.map((seat) => {
                    const isRestricted = seat.rowNumber <= 2;
                    let statusClass = "available";
                    if (seat.isReserved) statusClass = "booked";
                    else if (isRestricted) statusClass = "blocked";

                    // Override blocked visual if selected plan fits, but for overview we just show blocked
                    // Actually, let's make restricted clickable but visually distinct
                    
                    return (
                      <div
                        key={seat.seatNumber}
                        onClick={() => handleSeatClick(seat)}
                        className={cn(
                          "seat relative group",
                          statusClass,
                          isRestricted && !seat.isReserved && "bg-slate-100 hover:bg-emerald-100 text-slate-500 hover:text-emerald-700 border-slate-200 hover:border-emerald-200"
                        )}
                      >
                        {seat.seatNumber}
                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-black text-white text-xs py-1 px-2 rounded whitespace-nowrap z-10 pointer-events-none">
                          Row {seat.rowNumber} • {isRestricted ? "Priority (15hr)" : "Standard"}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              <div className="text-center mt-6 text-sm text-muted-foreground">Screen / Front Desk</div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Admit Student to Seat {selectedSeat?.seatNumber}</DialogTitle>
            <DialogDescription>
              Select a pending enquiry or enter details manually.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Select Enquiry</Label>
              <Select value={selectedEnquiryId} onValueChange={setSelectedEnquiryId}>
                <SelectTrigger>
                  <SelectValue placeholder="Search pending enquiries..." />
                </SelectTrigger>
                <SelectContent>
                  {enquiries?.filter((e: Enquiry) => e.status === 'pending').map((e: Enquiry) => (
                    <SelectItem key={e.id} value={e.id.toString()}>
                      {e.name} ({e.course})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Plan Duration</Label>
              <Select value={selectedPlan} onValueChange={setSelectedPlan}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15_hours">15 Hours (Full Day)</SelectItem>
                  {selectedSeat && selectedSeat.rowNumber > 2 && (
                    <>
                      <SelectItem value="5_hours">5 Hours</SelectItem>
                      <SelectItem value="3_hours">3 Hours</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
              {selectedSeat && selectedSeat.rowNumber <= 2 && (
                <p className="text-xs text-amber-600">Rows 1-2 are restricted to 15 Hour plans only.</p>
              )}
            </div>
            
            <div className="pt-4 border-t mt-2">
              <div className="flex justify-between font-medium text-sm">
                 <span>Total Payable:</span>
                 <span>
                    {selectedPlan === '3_hours' ? '$15' : selectedPlan === '5_hours' ? '$25' : '$60'} / day
                 </span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAdmission} disabled={isCreatingUser || !selectedEnquiryId}>
              {isCreatingUser && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Confirm Admission
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
