
import { db } from "./db";
import {
  users, seats, enquiries, invoices, attendance,
  type User, type InsertUser,
  type Seat, type InsertSeat,
  type Enquiry, type InsertEnquiry,
  type Invoice, type InsertInvoice,
  type Attendance, type InsertAttendance
} from "@shared/schema";
import { eq, sql } from "drizzle-orm";

export interface IStorage {
  // Users
  getUsers(): Promise<User[]>;
  getUser(id: number): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Seats
  getSeats(): Promise<Seat[]>;
  updateSeat(id: number, seat: Partial<InsertSeat>): Promise<Seat>;
  initializeSeats(): Promise<void>;

  // Enquiries
  getEnquiries(): Promise<Enquiry[]>;
  createEnquiry(enquiry: InsertEnquiry): Promise<Enquiry>;

  // Invoices
  getInvoices(): Promise<Invoice[]>;
  createInvoice(invoice: InsertInvoice): Promise<Invoice>;

  // Attendance
  getAttendance(): Promise<Attendance[]>;
  
  // Stats
  getDashboardStats(): Promise<any>;
}

export class DatabaseStorage implements IStorage {
  async getUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getSeats(): Promise<Seat[]> {
    return await db.select().from(seats).orderBy(seats.seatNumber);
  }

  async updateSeat(id: number, updates: Partial<InsertSeat>): Promise<Seat> {
    const [seat] = await db.update(seats).set(updates).where(eq(seats.id, id)).returning();
    return seat;
  }

  async initializeSeats(): Promise<void> {
    const existing = await db.select({ count: sql<number>`count(*)` }).from(seats);
    if (Number(existing[0].count) === 0) {
      const newSeats: InsertSeat[] = [];
      for (let i = 1; i <= 100; i++) {
        const row = Math.ceil(i / 10);
        newSeats.push({
          seatNumber: i,
          rowNumber: row,
          isReserved: false,
          planType: row <= 2 ? '15_hours' : 'any' // Logic for first 2 rows restriction
        });
      }
      await db.insert(seats).values(newSeats);
    }
  }

  async getEnquiries(): Promise<Enquiry[]> {
    return await db.select().from(enquiries).orderBy(sql`${enquiries.createdAt} DESC`);
  }

  async createEnquiry(enquiry: InsertEnquiry): Promise<Enquiry> {
    const [newEnquiry] = await db.insert(enquiries).values(enquiry).returning();
    return newEnquiry;
  }

  async getInvoices(): Promise<Invoice[]> {
    return await db.select().from(invoices).orderBy(sql`${invoices.createdAt} DESC`);
  }

  async createInvoice(invoice: InsertInvoice): Promise<Invoice> {
    const [newInvoice] = await db.insert(invoices).values(invoice).returning();
    return newInvoice;
  }

  async getAttendance(): Promise<Attendance[]> {
    return await db.select().from(attendance).orderBy(sql`${attendance.date} DESC`);
  }

  async getDashboardStats(): Promise<any> {
    const activeSubscribers = await db.select({ count: sql<number>`count(*)` }).from(users).where(eq(users.role, 'student'));
    
    // Mock revenue stats for demo since we might not have enough data initially
    const monthlyRevenue = {
      paid: 15000,
      pending: 5000,
      total: 20000
    };

    // Mock attendance data
    const attendanceData = [
      { date: '2024-03-01', present: 45, absent: 5 },
      { date: '2024-03-02', present: 48, absent: 2 },
      { date: '2024-03-03', present: 42, absent: 8 },
      { date: '2024-03-04', present: 47, absent: 3 },
      { date: '2024-03-05', present: 46, absent: 4 },
    ];

    return {
      activeSubscribers: Number(activeSubscribers[0].count),
      monthlyRevenue,
      attendanceData
    };
  }
}

export const storage = new DatabaseStorage();
