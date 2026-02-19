
import { db } from "./db";
import {
  users, seats, enquiries, invoices, attendance, seatBookings, posts, comments,
  type User, type InsertUser,
  type Seat, type InsertSeat,
  type Enquiry, type InsertEnquiry,
  type Invoice, type InsertInvoice,
  type Attendance, type InsertAttendance,
  type SeatBooking, type InsertSeatBooking,
  type Post, type InsertPost,
  type Comment, type InsertComment
} from "@shared/schema";
import { eq, sql, and } from "drizzle-orm";

export interface IStorage {
  // Users
  getUsers(): Promise<User[]>;
  getUser(id: number): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Seats
  getSeats(): Promise<Seat[]>;
  updateSeat(id: number, seat: Partial<InsertSeat>): Promise<Seat>;
  initializeSeats(): Promise<void>;
  getSeatAvailability(hours: string, slot: string, date: string): Promise<any[]>;

  // Bookings
  createBooking(booking: InsertSeatBooking): Promise<SeatBooking>;

  // Community
  getPosts(): Promise<(Post & { user: User; comments: (Comment & { user: User })[] })[]>;
  createPost(post: InsertPost): Promise<Post>;
  deletePost(id: number): Promise<void>;
  getComments(postId: number): Promise<(Comment & { user: User })[]>;
  createComment(comment: InsertComment): Promise<Comment>;

  // Enquiries
  getEnquiries(): Promise<Enquiry[]>;
  createEnquiry(enquiry: InsertEnquiry): Promise<Enquiry>;

  // Invoices
  getInvoices(): Promise<Invoice[]>;
  createInvoice(invoice: InsertInvoice): Promise<Invoice>;
  updateInvoice(id: number, updates: any): Promise<Invoice>;

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
          planType: row <= 2 ? '15_hours' : 'any'
        });
      }
      await db.insert(seats).values(newSeats);
    }
  }

  async getSeatAvailability(hours: string, slot: string, date: string): Promise<any[]> {
    const allSeats = await this.getSeats();
    const bookings = await db.select().from(seatBookings).where(
      and(
        eq(seatBookings.hours, hours),
        eq(seatBookings.slot, slot),
        eq(seatBookings.date, date)
      )
    );

    return allSeats.map(seat => ({
      ...seat,
      isBooked: bookings.some(b => b.seatId === seat.id)
    }));
  }

  async createBooking(booking: InsertSeatBooking): Promise<SeatBooking> {
    const [newBooking] = await db.insert(seatBookings).values(booking).returning();
    return newBooking;
  }

  async getPosts(): Promise<(Post & { user: User; comments: (Comment & { user: User })[] })[]> {
    const allPosts = await db.select().from(posts).orderBy(sql`${posts.createdAt} DESC`);
    const results = [];
    for (const post of allPosts) {
      const user = await this.getUser(post.userId);
      const postComments = await this.getComments(post.id);
      results.push({ ...post, user: user!, comments: postComments });
    }
    return results;
  }

  async createPost(post: InsertPost): Promise<Post> {
    const [newPost] = await db.insert(posts).values(post).returning();
    return newPost;
  }

  async deletePost(id: number): Promise<void> {
    await db.delete(comments).where(eq(comments.postId, id));
    await db.delete(posts).where(eq(posts.id, id));
  }

  async getComments(postId: number): Promise<(Comment & { user: User })[]> {
    const postComments = await db.select().from(comments).where(eq(comments.postId, postId));
    const results = [];
    for (const comment of postComments) {
      const user = await this.getUser(comment.userId);
      results.push({ ...comment, user: user! });
    }
    return results;
  }

  async createComment(comment: InsertComment): Promise<Comment> {
    const [newComment] = await db.insert(comments).values(comment).returning();
    return newComment;
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

  async updateInvoice(id: number, updates: any): Promise<Invoice> {
    const [updated] = await db.update(invoices).set(updates).where(eq(invoices.id, id)).returning();
    return updated;
  }

  async getAttendance(): Promise<Attendance[]> {
    return await db.select().from(attendance).orderBy(sql`${attendance.date} DESC`);
  }

  async getDashboardStats(): Promise<any> {
    const activeSubscribers = await db.select({ count: sql<number>`count(*)` }).from(users).where(eq(users.role, 'student'));
    return {
      activeSubscribers: Number(activeSubscribers[0].count),
      monthlyRevenue: { paid: 15000, pending: 5000, total: 20000 },
      attendanceData: [
        { date: '2024-03-01', present: 45, absent: 5 },
        { date: '2024-03-02', present: 48, absent: 2 },
        { date: '2024-03-03', present: 42, absent: 8 },
        { date: '2024-03-04', present: 47, absent: 3 },
        { date: '2024-03-05', present: 46, absent: 4 },
      ]
    };
  }
}

export const storage = new DatabaseStorage();
