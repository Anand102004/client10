import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { InsertEnquiry, InsertUser, InsertSeat, InsertInvoice, InsertAttendance } from "@shared/schema";

// --- Users ---
export function useUsers() {
  return useQuery({
    queryKey: [api.users.list.path],
    queryFn: async () => {
      const res = await fetch(api.users.list.path);
      if (!res.ok) throw new Error("Failed to fetch users");
      return await res.json(); // Schema validation would happen here in a real app
    },
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertUser) => {
      const res = await fetch(api.users.create.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create user");
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.users.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.stats.dashboard.path] });
    },
  });
}

// --- Seats ---
export function useSeats() {
  return useQuery({
    queryKey: [api.seats.list.path],
    queryFn: async () => {
      const res = await fetch(api.seats.list.path);
      if (!res.ok) throw new Error("Failed to fetch seats");
      return await res.json();
    },
  });
}

export function useUpdateSeat() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }: { id: number } & Partial<InsertSeat>) => {
      const url = buildUrl(api.seats.update.path, { id });
      const res = await fetch(url, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update seat");
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.seats.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.stats.dashboard.path] });
    },
  });
}

// --- Enquiries ---
export function useEnquiries() {
  return useQuery({
    queryKey: [api.enquiries.list.path],
    queryFn: async () => {
      const res = await fetch(api.enquiries.list.path);
      if (!res.ok) throw new Error("Failed to fetch enquiries");
      return await res.json();
    },
  });
}

export function useCreateEnquiry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertEnquiry) => {
      const res = await fetch(api.enquiries.create.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to submit enquiry");
      return await res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.enquiries.list.path] }),
  });
}

// --- Invoices ---
export function useInvoices() {
  return useQuery({
    queryKey: [api.invoices.list.path],
    queryFn: async () => {
      const res = await fetch(api.invoices.list.path);
      if (!res.ok) throw new Error("Failed to fetch invoices");
      return await res.json();
    },
  });
}

// --- Attendance ---
export function useAttendance() {
  return useQuery({
    queryKey: [api.attendance.list.path],
    queryFn: async () => {
      const res = await fetch(api.attendance.list.path);
      if (!res.ok) throw new Error("Failed to fetch attendance");
      return await res.json();
    },
  });
}

// --- Stats ---
export function useStats() {
  return useQuery({
    queryKey: [api.stats.dashboard.path],
    queryFn: async () => {
      const res = await fetch(api.stats.dashboard.path);
      if (!res.ok) throw new Error("Failed to fetch stats");
      return await res.json();
    },
  });
}
