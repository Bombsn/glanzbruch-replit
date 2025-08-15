import { 
  type Product, 
  type InsertProduct,
  type Course,
  type InsertCourse,
  type CourseType,
  type InsertCourseType,
  type Order,
  type InsertOrder,
  type CourseBooking,
  type InsertCourseBooking,
  type CommissionRequest,
  type InsertCommissionRequest,
  type Admin,
  type InsertAdmin,
  type CourseWithType,
} from "@shared/schema";
import { DatabaseStorage } from "./databaseStorage";

export interface IStorage {
  // Products
  getProducts(): Promise<Product[]>;
  getRandomProducts(count: number): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  getProductsByCategory(category: string): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  seedProducts(): Promise<void>;
  
  // Course Types
  getCourseTypes(): Promise<CourseType[]>;
  getCourseType(id: string): Promise<CourseType | undefined>;
  createCourseType(courseType: InsertCourseType): Promise<CourseType>;
  
  // Courses
  getCourses(): Promise<Course[]>;
  getCourse(id: string): Promise<Course | undefined>;
  createCourse(course: InsertCourse): Promise<Course>;
  updateCourse(id: string, course: Partial<InsertCourse>): Promise<Course | undefined>;
  
  // Orders
  getOrders(): Promise<Order[]>;
  getOrder(id: string): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  
  // Course Bookings
  getCourseBookings(): Promise<CourseBooking[]>;
  getCourseBooking(id: string): Promise<CourseBooking | undefined>;
  createCourseBooking(booking: InsertCourseBooking): Promise<CourseBooking>;
  
  // Commission Requests
  getCommissionRequests(): Promise<CommissionRequest[]>;
  getCommissionRequest(id: string): Promise<CommissionRequest | undefined>;
  createCommissionRequest(request: InsertCommissionRequest): Promise<CommissionRequest>;
  
  // Courses with types for admin dashboard
  getCoursesWithTypes(): Promise<CourseWithType[]>;
  deleteCourse(id: string): Promise<boolean>;
  
  // Admin methods
  getAdminByUsername(username: string): Promise<Admin | undefined>;
  createAdmin(admin: InsertAdmin): Promise<Admin>;
}

// Use database storage
export const storage = new DatabaseStorage();