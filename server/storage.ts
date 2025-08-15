import { 
  type Product, 
  type InsertProduct,
  type Course,
  type InsertCourse,
  type Order,
  type InsertOrder,
  type CourseBooking,
  type InsertCourseBooking,
  type CommissionRequest,
  type InsertCommissionRequest
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Products
  getProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  getProductsByCategory(category: string): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  
  // Courses
  getCourses(): Promise<Course[]>;
  getCourse(id: string): Promise<Course | undefined>;
  createCourse(course: InsertCourse): Promise<Course>;
  
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
}

export class MemStorage implements IStorage {
  private products: Map<string, Product> = new Map();
  private courses: Map<string, Course> = new Map();
  private orders: Map<string, Order> = new Map();
  private courseBookings: Map<string, CourseBooking> = new Map();
  private commissionRequests: Map<string, CommissionRequest> = new Map();

  constructor() {
    this.seedData();
  }

  private seedData() {
    // Seed products
    const sampleProducts: InsertProduct[] = [
      {
        name: "Waldblüten Anhänger",
        description: "Zarter Anhänger mit eingefassten getrockneten Waldblüten in hochwertigem Kunstharz",
        price: "45.00",
        category: "kettenanhanger",
        imageUrl: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        inStock: true
      },
      {
        name: "Moos & Silber Ohrringe",
        description: "Filigrane Ohrringe mit echtem Moos und Silberelementen",
        price: "35.00",
        category: "ohrringe",
        imageUrl: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        inStock: true
      },
      {
        name: "Farn Harz Ring",
        description: "Mystischer Ring mit eingefasstem Farn und Bronze-Akzenten",
        price: "55.00",
        category: "fingerringe",
        imageUrl: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        inStock: true
      },
      {
        name: "Wildblumen Armband",
        description: "Zauberhafter Armschmuck mit verschiedenen Wildblumen",
        price: "40.00",
        category: "armbander",
        imageUrl: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        inStock: true
      },
      {
        name: "Herbstlaub Kette",
        description: "Goldener Anhänger mit bunten Herbstblättern",
        price: "50.00",
        category: "kettenanhanger",
        imageUrl: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        inStock: true
      },
      {
        name: "Kristall & Blüte Ohrhänger",
        description: "Elegante Ohrhänger mit Kristallen und Blütenelementen",
        price: "42.00",
        category: "ohrringe",
        imageUrl: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        inStock: true
      }
    ];

    sampleProducts.forEach(product => {
      const id = randomUUID();
      this.products.set(id, { ...product, id, createdAt: new Date() });
    });

    // Seed courses
    const sampleCourses: InsertCourse[] = [
      {
        title: "UV-Resin Grundkurs",
        description: "Lerne die Grundlagen des UV-Resin Giessens und erstelle dein erstes Schmuckstück",
        price: "120.00",
        duration: 180,
        maxParticipants: 6,
        imageUrl: "https://image.jimcdn.com/app/cms/image/transf/dimension=291x10000:format=jpg/path/s10438f9ff8ed1fb7/image/i8b6814473a49453d/version/1730743765/image.jpg"
      },
      {
        title: "Fortgeschrittene Techniken",
        description: "Erweitere deine Fähigkeiten mit komplexeren Techniken und Materialien",
        price: "150.00",
        duration: 240,
        maxParticipants: 4,
        imageUrl: "https://image.jimcdn.com/app/cms/image/transf/dimension=291x10000:format=jpg/path/s10438f9ff8ed1fb7/image/i8b6814473a49453d/version/1730743765/image.jpg"
      }
    ];

    sampleCourses.forEach(course => {
      const id = randomUUID();
      this.courses.set(id, { ...course, id, createdAt: new Date() });
    });
  }

  // Products
  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProduct(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(p => p.category === category);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = randomUUID();
    const product: Product = { ...insertProduct, id, createdAt: new Date() };
    this.products.set(id, product);
    return product;
  }

  // Courses
  async getCourses(): Promise<Course[]> {
    return Array.from(this.courses.values());
  }

  async getCourse(id: string): Promise<Course | undefined> {
    return this.courses.get(id);
  }

  async createCourse(insertCourse: InsertCourse): Promise<Course> {
    const id = randomUUID();
    const course: Course = { ...insertCourse, id, createdAt: new Date() };
    this.courses.set(id, course);
    return course;
  }

  // Orders
  async getOrders(): Promise<Order[]> {
    return Array.from(this.orders.values());
  }

  async getOrder(id: string): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = randomUUID();
    const order: Order = { ...insertOrder, id, createdAt: new Date() };
    this.orders.set(id, order);
    return order;
  }

  // Course Bookings
  async getCourseBookings(): Promise<CourseBooking[]> {
    return Array.from(this.courseBookings.values());
  }

  async getCourseBooking(id: string): Promise<CourseBooking | undefined> {
    return this.courseBookings.get(id);
  }

  async createCourseBooking(insertBooking: InsertCourseBooking): Promise<CourseBooking> {
    const id = randomUUID();
    const booking: CourseBooking = { ...insertBooking, id, createdAt: new Date() };
    this.courseBookings.set(id, booking);
    return booking;
  }

  // Commission Requests
  async getCommissionRequests(): Promise<CommissionRequest[]> {
    return Array.from(this.commissionRequests.values());
  }

  async getCommissionRequest(id: string): Promise<CommissionRequest | undefined> {
    return this.commissionRequests.get(id);
  }

  async createCommissionRequest(insertRequest: InsertCommissionRequest): Promise<CommissionRequest> {
    const id = randomUUID();
    const request: CommissionRequest = { ...insertRequest, id, createdAt: new Date() };
    this.commissionRequests.set(id, request);
    return request;
  }
}

export const storage = new MemStorage();
