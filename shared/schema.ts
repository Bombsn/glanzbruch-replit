import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const products = pgTable("products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  category: text("category").notNull(), // kettenanhanger, ohrringe, fingerringe, armbander
  imageUrls: text("image_urls").array().notNull(), // Multiple images
  sku: text("sku").unique(),
  inStock: boolean("in_stock").notNull().default(true),
  weight: text("weight"),
  dimensions: text("dimensions"),
  material: text("material"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const courseTypes = pgTable("course_types", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  duration: text("duration").notNull(), // e.g., "3 hours", "full day"
  maxParticipants: integer("max_participants").notNull(),
  minAge: integer("min_age").default(12),
  materials: text("materials").array(),
  requirements: text("requirements"),
  imageUrl: text("image_url").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const courses = pgTable("courses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  courseTypeId: varchar("course_type_id").references(() => courseTypes.id).notNull(),
  date: timestamp("date").notNull(),
  availableSpots: integer("available_spots").notNull(),
  location: text("location"),
  instructor: text("instructor").default("Glanzbruch Atelier"),
  status: text("status").default("scheduled"), // scheduled, cancelled, completed
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const orders = pgTable("orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone"),
  items: text("items").notNull(), // JSON string
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default("pending"), // pending, confirmed, shipped, delivered
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const courseBookings = pgTable("course_bookings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  courseId: varchar("course_id").references(() => courses.id).notNull(),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone"),
  participants: integer("participants").default(1),
  totalPrice: decimal("total_price", { precision: 10, scale: 2 }).notNull(),
  message: text("message"),
  status: text("status").notNull().default("pending"), // pending, confirmed, cancelled
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const commissionRequests = pgTable("commission_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone"),
  description: text("description").notNull(),
  specialMaterials: text("special_materials"),
  budget: text("budget"),
  status: text("status").notNull().default("pending"), // pending, in_progress, completed, cancelled
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
});

export const insertCourseTypeSchema = createInsertSchema(courseTypes).omit({
  id: true,
  createdAt: true,
});

export const insertCourseSchema = createInsertSchema(courses).omit({
  id: true,
  createdAt: true,
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
});

export const insertCourseBookingSchema = createInsertSchema(courseBookings).omit({
  id: true,
  createdAt: true,
});

export const insertCommissionRequestSchema = createInsertSchema(commissionRequests).omit({
  id: true,
  createdAt: true,
});

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;

export type InsertCourseType = z.infer<typeof insertCourseTypeSchema>;
export type CourseType = typeof courseTypes.$inferSelect;

export type InsertCourse = z.infer<typeof insertCourseSchema>;
export type Course = typeof courses.$inferSelect;

export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;

export type InsertCourseBooking = z.infer<typeof insertCourseBookingSchema>;
export type CourseBooking = typeof courseBookings.$inferSelect;

export type InsertCommissionRequest = z.infer<typeof insertCommissionRequestSchema>;
export type CommissionRequest = typeof commissionRequests.$inferSelect;

// Extended types for course with course type information
export interface CourseWithType extends Course {
  courseType: CourseType;
}
export type CommissionRequest = typeof commissionRequests.$inferSelect;
