
import { pgTable, text, serial, integer, boolean, timestamp, date, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Students/Users
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  role: text("role").notNull().default("student"), // 'admin' | 'student'
  course: text("course"),
  planType: text("plan_type"), // '3_hours', '5_hours', '15_hours'
  joinedAt: timestamp("joined_at").defaultNow(),
});

// Seat allocation
export const seats = pgTable("seats", {
  id: serial("id").primaryKey(),
  seatNumber: integer("seat_number").notNull(), // 1-100
  rowNumber: integer("row_number").notNull(),
  isReserved: boolean("is_reserved").default(false),
  userId: integer("user_id").references(() => users.id),
  planType: text("plan_type"), // Restriction: rows 1-2 only for 15_hours
});

// Seat Bookings (to handle slots)
export const seatBookings = pgTable("seat_bookings", {
  id: serial("id").primaryKey(),
  seatId: integer("seat_id").references(() => seats.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  hours: text("hours").notNull(), // '3', '5', '10', '15'
  slot: text("slot").notNull(), // '12-5', '5-10', etc.
  date: date("date").notNull(),
  status: text("status").notNull().default("pending"), // 'pending', 'confirmed'
});

// Community Doubts/Posts
export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  content: text("content").notNull(),
  imageUrl: text("image_url"),
  videoUrl: text("video_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Community Comments/Clarifications
export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").references(() => posts.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Enquiries
export const enquiries = pgTable("enquiries", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  course: text("course"),
  preferredSlot: text("preferred_slot"),
  status: text("status").default("pending"), // 'pending', 'admitted', 'rejected'
  createdAt: timestamp("created_at").defaultNow(),
});

// Invoices/Payments
export const invoices = pgTable("invoices", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull(), // 'paid', 'pending', 'verifying'
  dueDate: timestamp("due_date"),
  paidAt: timestamp("paid_at"),
  transactionId: text("transaction_id"),
  paymentScreenshot: text("payment_screenshot"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Attendance
export const attendance = pgTable("attendance", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  date: date("date").notNull(),
  status: text("status").notNull(), // 'present', 'absent'
  checkIn: timestamp("check_in"),
  checkOut: timestamp("check_out"),
});

// Zod Schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true, joinedAt: true });
export const insertSeatSchema = createInsertSchema(seats).omit({ id: true });
export const insertSeatBookingSchema = createInsertSchema(seatBookings).omit({ id: true });
export const insertPostSchema = createInsertSchema(posts).omit({ id: true, createdAt: true });
export const insertCommentSchema = createInsertSchema(comments).omit({ id: true, createdAt: true });
export const insertEnquirySchema = createInsertSchema(enquiries).omit({ id: true, createdAt: true });
export const insertInvoiceSchema = createInsertSchema(invoices).omit({ id: true, createdAt: true });
export const insertAttendanceSchema = createInsertSchema(attendance).omit({ id: true });

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Seat = typeof seats.$inferSelect;
export type SeatBooking = typeof seatBookings.$inferSelect;
export type Post = typeof posts.$inferSelect;
export type Comment = typeof comments.$inferSelect;
export type Enquiry = typeof enquiries.$inferSelect;
export type Invoice = typeof invoices.$inferSelect;
export type Attendance = typeof attendance.$inferSelect;
