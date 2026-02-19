
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

  app.get(api.seats.availability.path, async (req, res) => {
    const { hours, slot, date } = req.query;
    if (!hours || !slot || !date) {
      return res.status(400).json({ message: "Missing required query parameters" });
    }
    const availability = await storage.getSeatAvailability(String(hours), String(slot), String(date));
    res.json(availability);
  });

  app.patch(api.seats.update.path, async (req, res) => {
    const seat = await storage.updateSeat(Number(req.params.id), req.body);
    res.json(seat);
  });

  // Bookings
  app.post(api.bookings.create.path, async (req, res) => {
    const booking = await storage.createBooking(req.body);
    res.status(201).json(booking);
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

  app.patch(api.invoices.update.path, async (req, res) => {
    const invoice = await storage.updateInvoice(Number(req.params.id), req.body);
    res.json(invoice);
  });

  // Posts
  app.get(api.posts.list.path, async (req, res) => {
    const posts = await storage.getPosts();
    res.json(posts);
  });

  app.post(api.posts.create.path, async (req, res) => {
    try {
      const input = api.posts.create.input.parse(req.body);
      const post = await storage.createPost(input);
      res.status(201).json(post);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete(api.posts.delete.path, async (req, res) => {
    await storage.deletePost(Number(req.params.id));
    res.json({ success: true });
  });

  // Comments
  app.post(api.comments.create.path, async (req, res) => {
    const comment = await storage.createComment(req.body);
    res.status(201).json(comment);
  });

  app.get(api.comments.list.path, async (req, res) => {
    const comments = await storage.getComments(Number(req.params.postId));
    res.json(comments);
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
