
import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Initialize seats on startup
  await storage.initializeSeats();

  // Users
  app.get(api.users.list.path, async (req, res) => {
    const users = await storage.getUsers();
    res.json(users);
  });

  app.get(api.users.get.path, async (req, res) => {
    const user = await storage.getUser(Number(req.params.id));
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  });

  app.post(api.users.create.path, async (req, res) => {
    const user = await storage.createUser(req.body);
    res.status(201).json(user);
  });

  // Seats
  app.get(api.seats.list.path, async (req, res) => {
    const seats = await storage.getSeats();
    res.json(seats);
  });

  app.patch(api.seats.update.path, async (req, res) => {
    const seat = await storage.updateSeat(Number(req.params.id), req.body);
    res.json(seat);
  });

  // Enquiries
  app.get(api.enquiries.list.path, async (req, res) => {
    const enquiries = await storage.getEnquiries();
    res.json(enquiries);
  });

  app.post(api.enquiries.create.path, async (req, res) => {
    const enquiry = await storage.createEnquiry(req.body);
    res.status(201).json(enquiry);
  });

  // Invoices
  app.get(api.invoices.list.path, async (req, res) => {
    const invoices = await storage.getInvoices();
    res.json(invoices);
  });

  // Attendance
  app.get(api.attendance.list.path, async (req, res) => {
    const attendance = await storage.getAttendance();
    res.json(attendance);
  });

  // Stats
  app.get(api.stats.dashboard.path, async (req, res) => {
    const stats = await storage.getDashboardStats();
    res.json(stats);
  });

  // Seed Data Endpoint (For demo purposes)
  app.post('/api/seed', async (req, res) => {
    // Add some dummy enquiries
    await storage.createEnquiry({
      name: "John Doe",
      email: "john@example.com",
      phone: "1234567890",
      course: "UPSC",
      preferredSlot: "Morning",
      status: "pending"
    });
    
    // Add some dummy users
    await storage.createUser({
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "9876543210",
      role: "student",
      planType: "5_hours",
      course: "CAT"
    });

    res.json({ message: "Seeded" });
  });

  return httpServer;
}
