
import { useState } from "react";
import { DashboardLayout } from "@/components/layout-dashboard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useSeats, useUpdateSeat, useCreateUser, useEnquiries, useCreateInvoice, useCreateBooking } from "@/hooks/use-crm";
import { Seat, Enquiry } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { Loader2, QrCode, Upload, CheckCircle2, ShieldCheck } from "lucide-react";

export default function AdminAdmissions() {
  const { data: seats, isLoading: seatsLoading } = useSeats();
  const { data: enquiries } = useEnquiries();
  const { mutate: updateSeat } = useUpdateSeat();
  const { mutate: createUser, isPending: isCreatingUser } = useCreateUser();
  const { mutate: createInvoice } = useCreateInvoice();
  const { mutate: createBooking } = useCreateBooking();
  const { toast } = useToast();

  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [step, setStep] = useState<"details" | "payment">("details");
  
  const [selectedEnquiryId, setSelectedEnquiryId] = useState<string>("");
  const [selectedPlan, setSelectedPlan] = useState<string>("3_hours");
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  
  const [transactionId, setTransactionId] = useState("");
  const [screenshot, setScreenshot] = useState<string | null>(null);

  const durationSlots: Record<string, string[]> = {
    "3_hours": ["9am-12pm", "12pm-3pm", "3pm-6pm", "6pm-9pm"],
    "5_hours": ["7am-12pm", "12pm-5pm", "5pm-10pm"],
    "10_hours": ["8am-6pm", "10am-8pm"],
    "15_hours": ["7am-10pm"]
  };

  const planPrices: Record<string, number> = {
    "3_hours": 15,
    "5_hours": 25,
    "10_hours": 45,
    "15_hours": 60
  };

  const gridSeats = Array.from({ length: 100 }, (_, i) => {
    const seatNum = i + 1;
    const existing = seats?.find((s: Seat) => s.seatNumber === seatNum);
    if (existing) return existing;
    const row = Math.ceil(seatNum / 10);
    return {
      id: seatNum,
      seatNumber: seatNum,
      rowNumber: row,
      isReserved: false,
      planType: row <= 2 ? '15_hours' : 'any',
    } as Seat;
  });

  const handleSeatClick = (seat: Seat) => {
    if (seat.isReserved) {
      toast({ title: "Seat Unavailable", description: "This seat is already booked.", variant: "destructive" });
      return;
    }
    
    const isRestricted = seat.rowNumber <= 2;
    if (isRestricted && selectedPlan !== "15_hours") {
      toast({ title: "Plan Restriction", description: "Rows 1-2 are reserved for 15-hour plans.", variant: "destructive" });
      return;
    }

    setSelectedSeat(seat);
    setIsDialogOpen(true);
    setStep("details");
    setTransactionId("");
    setScreenshot(null);
  };

  const handleAdmissionSubmit = () => {
    if (!selectedSeat || !selectedEnquiryId || !transactionId) return;

    const enquiry = enquiries?.find((e: Enquiry) => e.id.toString() === selectedEnquiryId);
    if (!enquiry) return;

    createUser({
      name: enquiry.name,
      email: enquiry.email,
      phone: enquiry.phone,
      role: 'student',
      course: enquiry.course,
      planType: selectedPlan
    }, {
      onSuccess: (newUser) => {
        // Create Booking
        createBooking({
          seatId: selectedSeat.id,
          userId: newUser.id,
          hours: selectedPlan.replace("_hours", ""),
          slot: selectedSlot,
          date: new Date().toISOString().split('T')[0],
          status: 'pending'
        });

        // Create Invoice with 'verifying' status
        createInvoice({
          userId: newUser.id,
          amount: planPrices[selectedPlan].toString(),
          status: 'verifying',
          dueDate: new Date(),
          transactionId,
          paymentScreenshot: screenshot || ""
        }, {
          onSuccess: () => {
            setIsDialogOpen(false);
            toast({ 
              title: "Payment Submitted", 
              description: "Verification request sent to admin." 
            });
          }
        });
      }
    });
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Seat Admission</h2>
            <p className="text-muted-foreground">Select a plan and slot, then choose an available seat.</p>
          </div>
          
          <div className="flex flex-wrap gap-4 p-4 bg-white rounded-xl border shadow-sm w-full md:w-auto">
            <div className="space-y-1.5 min-w-[140px]">
              <Label className="text-[10px] uppercase font-bold text-muted-foreground">Duration</Label>
              <Select value={selectedPlan} onValueChange={(v) => {
                setSelectedPlan(v);
                setSelectedSlot("");
              }}>
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3_hours">3 Hours</SelectItem>
                  <SelectItem value="5_hours">5 Hours</SelectItem>
                  <SelectItem value="10_hours">10 Hours</SelectItem>
                  <SelectItem value="15_hours">15 Hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-1.5 min-w-[180px]">
              <Label className="text-[10px] uppercase font-bold text-muted-foreground">Time Slot</Label>
              <Select value={selectedSlot} onValueChange={setSelectedSlot}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Select slot..." />
                </SelectTrigger>
                <SelectContent>
                  {durationSlots[selectedPlan]?.map(slot => (
                    <SelectItem key={slot} value={slot}>{slot}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <Card className="lg:w-64 h-fit border-none shadow-md">
            <CardHeader className="p-4">
              <CardTitle className="text-sm">Price Info</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-4">
              <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
                <p className="text-xs text-muted-foreground mb-1">Selected Plan Price</p>
                <p className="text-2xl font-bold text-primary">${planPrices[selectedPlan]}</p>
              </div>
              
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded bg-emerald-500"></div>
                  <span className="text-xs">Available</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded bg-rose-500"></div>
                  <span className="text-xs">Booked</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded bg-slate-300"></div>
                  <span className="text-xs">Priority (15hr)</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="flex-1 border-none shadow-md overflow-hidden">
            <CardContent className="p-6">
              <div className="grid grid-cols-10 gap-2 min-w-[500px] max-w-[700px] mx-auto">
                {gridSeats.map((seat) => {
                  const isRestricted = seat.rowNumber <= 2;
                  const canSelect = !seat.isReserved && (!isRestricted || selectedPlan === "15_hours");
                  
                  return (
                    <div
                      key={seat.seatNumber}
                      onClick={() => handleSeatClick(seat)}
                      className={cn(
                        "h-10 w-full flex items-center justify-center rounded-md text-xs font-bold cursor-pointer transition-all",
                        seat.isReserved ? "bg-rose-500 text-white cursor-not-allowed" :
                        isRestricted && selectedPlan !== "15_hours" ? "bg-slate-200 text-slate-400 cursor-not-allowed" :
                        "bg-emerald-50 text-emerald-700 border-2 border-emerald-200 hover:bg-emerald-500 hover:text-white hover:border-emerald-600"
                      )}
                    >
                      {seat.seatNumber}
                    </div>
                  );
                })}
              </div>
              <div className="mt-8 pt-4 border-t text-center text-[10px] uppercase font-bold text-muted-foreground tracking-widest">
                Front Desk / Entrance
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[450px]">
          {step === "details" ? (
            <>
              <DialogHeader>
                <DialogTitle>Admission Details</DialogTitle>
                <DialogDescription>Seat {selectedSeat?.seatNumber} • {selectedPlan.replace("_", " ")} ({selectedSlot})</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label>Select Enquiry</Label>
                  <Select value={selectedEnquiryId} onValueChange={setSelectedEnquiryId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Search student enquiry..." />
                    </SelectTrigger>
                    <SelectContent>
                      {enquiries?.filter((e: Enquiry) => e.status === 'pending').map((e: Enquiry) => (
                        <SelectItem key={e.id} value={e.id.toString()}>{e.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg space-y-2 border">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Base Price</span>
                    <span className="font-bold">${planPrices[selectedPlan]}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Processing Fee</span>
                    <span className="font-bold">$0.00</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t font-bold text-primary">
                    <span>Total Payable</span>
                    <span>${planPrices[selectedPlan]}</span>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button onClick={() => setStep("payment")} disabled={!selectedEnquiryId || !selectedSlot}>
                  Proceed to Payment
                </Button>
              </DialogFooter>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>Scan & Pay</DialogTitle>
                <DialogDescription>Pay ${planPrices[selectedPlan]} to finalize admission</DialogDescription>
              </DialogHeader>
              <div className="flex flex-col items-center py-6 gap-6">
                <div className="p-4 bg-white rounded-2xl border-4 border-primary/20 shadow-xl">
                  <QrCode className="w-32 h-32 text-primary" />
                </div>
                
                <div className="w-full space-y-4">
                  <div className="space-y-2">
                    <Label>Transaction Reference ID</Label>
                    <Input 
                      placeholder="Enter 12-digit Ref ID" 
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Payment Screenshot</Label>
                    <div className="flex items-center justify-center w-full h-24 border-2 border-dashed rounded-lg hover:bg-muted/50 cursor-pointer transition-colors" onClick={() => setScreenshot("mock_screenshot_url")}>
                      {screenshot ? (
                        <div className="flex items-center text-emerald-600 font-medium text-sm">
                          <CheckCircle2 className="w-4 h-4 mr-2" /> Screenshot Uploaded
                        </div>
                      ) : (
                        <div className="flex flex-col items-center text-muted-foreground">
                          <Upload className="w-6 h-6 mb-1" />
                          <span className="text-xs">Click to upload image</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="ghost" onClick={() => setStep("details")}>Back</Button>
                <Button onClick={handleAdmissionSubmit} disabled={!transactionId || isCreatingUser}>
                  {isCreatingUser && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <ShieldCheck className="w-4 h-4 mr-2" /> Submit Verification
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
