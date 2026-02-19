
import { storage } from "./storage";

async function seed() {
  console.log("Seeding database...");
  await storage.initializeSeats();

  // Create admin user
  await storage.createUser({
    name: "Admin User",
    email: "admin@studyhall.com",
    role: "admin",
    phone: "0000000000"
  });

  // Create some students
  const student1 = await storage.createUser({
    name: "Alice Johnson",
    email: "alice@example.com",
    role: "student",
    phone: "1234567890",
    course: "UPSC",
    planType: "5_hours"
  });

  const student2 = await storage.createUser({
    name: "Bob Smith",
    email: "bob@example.com",
    role: "student",
    phone: "0987654321",
    course: "CAT",
    planType: "15_hours"
  });

  // Create some community posts
  await storage.createPost({
    userId: student1.id,
    content: "Can someone help me with this UPSC question? It's about the basic structure doctrine.",
  });

  await storage.createPost({
    userId: student2.id,
    content: "Check out this video on CAT preparation strategy!",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
  });

  // Create some enquiries
  await storage.createEnquiry({
    name: "Charlie Brown",
    email: "charlie@example.com",
    phone: "1122334455",
    course: "GATE",
    preferredSlot: "Evening",
    status: "pending"
  });

  await storage.createEnquiry({
    name: "David Lee",
    email: "david@example.com",
    phone: "5566778899",
    course: "NEET",
    preferredSlot: "Morning",
    status: "admitted"
  });

  // Create invoices
  await storage.createInvoice({
    userId: student1.id,
    amount: "5000.00",
    status: "paid",
    dueDate: new Date(),
    paidAt: new Date()
  });

  await storage.createInvoice({
    userId: student2.id,
    amount: "7000.00",
    status: "pending",
    dueDate: new Date()
  });

  console.log("Database seeded successfully!");
}

seed().catch(console.error);
