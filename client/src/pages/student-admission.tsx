import { useState } from "react";
import { DashboardLayout } from "@/components/layout-dashboard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Armchair, QrCode, Upload, CheckCircle2, ShieldCheck, ArrowRight, ReceiptText } from "lucide-react";

const SEATS = Array.from({ length: 90 }, (_, i) => i + 1);

const PLAN_DATA = {
  "3_hours": { price: 15, slots: ["9am-12pm", "12pm-3pm", "3pm-6pm", "6pm-9pm"] },
  "5_hours": { price: 25, slots: ["7am-12pm", "12pm-5pm", "5pm-10pm"] },
  "10_hours": { price: 45, slots: ["8am-6pm", "10am-8pm"] },
  "15_hours": { price: 60, slots: ["7am-10pm"] }
};

export default function StudentAdmission() {
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<string>("5_hours");
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [selectedSeat, setSelectedSeat] = useState<number | null>(null);
  const [step, setStep] = useState<"selection" | "payment" | "success">("selection");
  const [refId, setRefId] = useState("");
  const [screenshot, setScreenshot] = useState<string | null>(null);

  const handleSeatClick = (seatNum: number) => {
    // Mock availability logic: if seat is 4 and slot is 5pm-10pm, it's "booked"
    if (seatNum === 4 && selectedSlot === "5pm-10pm") {
      toast({ title: "Seat Occupied", description: "This seat is already booked for this time slot.", variant: "destructive" });
      return;
    }
    setSelectedSeat(seatNum);
  };

  const handlePaymentSubmit = () => {
    if (!refId || !screenshot) {
      toast({ title: "Missing Information", description: "Please provide reference ID and screenshot.", variant: "destructive" });
      return;
    }
    setStep("success");
    toast({ title: "Payment Submitted", description: "Admin will verify your payment shortly." });
  };

  if (step === "success") {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto py-12 text-center space-y-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 mb-4">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <h2 className="text-3xl font-bold">Admission Request Sent!</h2>
          <p className="text-muted-foreground text-lg">
            Your payment verification for Seat #{selectedSeat} is currently under review by the admin. 
            Once verified, your seat will be permanently blocked and your invoice will be generated.
          </p>
          <Button onClick={() => window.location.href = "/dashboard"} size="lg" className="px-8">
            Back to Dashboard
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">New Admission</h2>
          <p className="text-muted-foreground">Select your plan, time slot, and preferred seat.</p>
        </div>

        {step === "selection" ? (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-none shadow-md overflow-hidden">
                <CardHeader className="bg-primary/5 border-b">
                  <div className="flex flex-wrap gap-6">
                    <div className="space-y-1.5 min-w-[150px]">
                      <Label className="text-[10px] uppercase font-bold text-muted-foreground">Plan Duration</Label>
                      <Select value={selectedPlan} onValueChange={(v) => { setSelectedPlan(v); setSelectedSlot(""); }}>
                        <SelectTrigger className="h-10">
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
                    <div className="space-y-1.5 min-w-[200px]">
                      <Label className="text-[10px] uppercase font-bold text-muted-foreground">Time Slot</Label>
                      <Select value={selectedSlot} onValueChange={setSelectedSlot}>
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Choose a time slot..." />
                        </SelectTrigger>
                        <SelectContent>
                          {PLAN_DATA[selectedPlan as keyof typeof PLAN_DATA].slots.map(s => (
                            <SelectItem key={s} value={s}>{s}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="grid grid-cols-10 gap-x-2 gap-y-4 max-w-[600px] mx-auto">
                    {SEATS.map(s => {
                      const isBooked = s === 4 && selectedSlot === "5pm-10pm";
                      const isSelected = selectedSeat === s;
                      return (
                        <div 
                          key={s}
                          onClick={() => handleSeatClick(s)}
                          className={cn(
                            "flex flex-col items-center gap-1 cursor-pointer transition-all hover:scale-110",
                            isBooked ? "opacity-40 cursor-not-allowed" : "hover:text-primary"
                          )}
                        >
                          <Armchair className={cn(
                            "w-8 h-8",
                            isBooked ? "text-rose-500 fill-rose-100" : 
                            isSelected ? "text-primary fill-primary/20 scale-125" : 
                            "text-slate-300"
                          )} />
                          <span className="text-[10px] font-bold text-slate-500">{s}</span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-12 pt-6 border-t flex justify-center items-center gap-8 text-[10px] uppercase font-bold text-muted-foreground">
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-slate-300"></div> Available</div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-rose-500"></div> Booked</div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-primary"></div> Selected</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="border-none shadow-lg bg-slate-900 text-white sticky top-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ReceiptText className="w-5 h-5 text-primary" />
                    Invoice Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between text-sm py-2 border-b border-white/10">
                    <span className="text-white/60">Selected Seat</span>
                    <span className="font-bold">{selectedSeat ? `Seat #${selectedSeat}` : "None"}</span>
                  </div>
                  <div className="flex justify-between text-sm py-2 border-b border-white/10">
                    <span className="text-white/60">Duration</span>
                    <span className="font-bold">{selectedPlan.replace("_", " ")}</span>
                  </div>
                  <div className="flex justify-between text-sm py-2 border-b border-white/10">
                    <span className="text-white/60">Time Slot</span>
                    <span className="font-bold">{selectedSlot || "Not selected"}</span>
                  </div>
                  <div className="flex justify-between text-lg pt-4">
                    <span className="font-bold">Total Payable</span>
                    <span className="font-black text-primary">${PLAN_DATA[selectedPlan as keyof typeof PLAN_DATA].price}</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full h-12 text-lg font-bold" 
                    disabled={!selectedSeat || !selectedSlot}
                    onClick={() => setStep("payment")}
                  >
                    Proceed to Pay <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        ) : (
          <Card className="max-w-md mx-auto border-none shadow-xl">
            <CardHeader className="text-center">
              <CardTitle>Complete Payment</CardTitle>
              <CardDescription>Scan the QR code and upload verification details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center gap-4 py-4">
                <div className="p-4 bg-white rounded-2xl shadow-inner border">
                  <QrCode className="w-40 h-40 text-slate-900" />
                </div>
                <p className="text-sm font-bold text-primary">Pay: ${PLAN_DATA[selectedPlan as keyof typeof PLAN_DATA].price}</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Transaction Reference ID</Label>
                  <Input 
                    placeholder="Enter 12-digit Ref No." 
                    value={refId}
                    onChange={(e) => setRefId(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Payment Screenshot</Label>
                  <div 
                    className="h-32 border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-slate-50 transition-colors"
                    onClick={() => setScreenshot("mock_image")}
                  >
                    {screenshot ? (
                      <div className="flex items-center text-emerald-600 font-bold">
                        <CheckCircle2 className="mr-2" /> Uploaded!
                      </div>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-slate-400" />
                        <span className="text-xs text-slate-500">Click to upload screenshot</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex gap-4">
              <Button variant="outline" className="flex-1" onClick={() => setStep("selection")}>Back</Button>
              <Button className="flex-1 font-bold" onClick={handlePaymentSubmit}>
                <ShieldCheck className="mr-2 h-4 w-4" /> Verify & Submit
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
