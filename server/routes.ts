import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import crypto from "crypto";
import { 
  insertProductSchema,
  insertCourseSchema,
  insertOrderSchema,
  insertCourseBookingSchema,
  insertCommissionRequestSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Products
  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get("/api/products/category/:category", async (req, res) => {
    try {
      const { category } = req.params;
      const products = await storage.getProductsByCategory(category);
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products by category" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const product = await storage.getProduct(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  // Courses
  app.get("/api/courses", async (req, res) => {
    try {
      // For now, return course types directly as we haven't seeded courses yet
      const courseTypes = await storage.getCourseTypes();
      res.json(courseTypes);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch courses" });
    }
  });

  // Get all course types
  app.get("/api/course-types", async (req, res) => {
    try {
      const courseTypes = await storage.getCourseTypes();
      res.json(courseTypes);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch course types" });
    }
  });

  app.get("/api/courses/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const course = await storage.getCourse(id);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      res.json(course);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch course" });
    }
  });

  // Course Bookings
  app.post("/api/course-bookings", async (req, res) => {
    try {
      const validatedData = insertCourseBookingSchema.parse(req.body);
      const booking = await storage.createCourseBooking(validatedData);
      res.status(201).json(booking);
    } catch (error) {
      res.status(400).json({ message: "Invalid booking data", error });
    }
  });

  // Commission Requests
  app.post("/api/commission-requests", async (req, res) => {
    try {
      const validatedData = insertCommissionRequestSchema.parse(req.body);
      const request = await storage.createCommissionRequest(validatedData);
      res.status(201).json(request);
    } catch (error) {
      res.status(400).json({ message: "Invalid commission request data", error });
    }
  });

  // Orders (for future Stripe integration)
  app.post("/api/orders", async (req, res) => {
    try {
      const validatedData = insertOrderSchema.parse(req.body);
      const order = await storage.createOrder(validatedData);
      res.status(201).json(order);
    } catch (error) {
      res.status(400).json({ message: "Invalid order data", error });
    }
  });

  app.get("/api/orders", async (req, res) => {
    try {
      const orders = await storage.getOrders();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  // Newsletter subscription (placeholder for future implementation)
  app.post("/api/newsletter", async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ message: "Email ist erforderlich" });
      }
      // TODO: Implement newsletter subscription logic
      res.status(201).json({ message: "Erfolgreich für Newsletter angemeldet" });
    } catch (error) {
      res.status(400).json({ message: "Fehler beim Anmelden für Newsletter" });
    }
  });

  // Seed endpoint for initial data loading
  app.post("/api/seed-products", async (req, res) => {
    try {
      if ('seedProducts' in storage) {
        await (storage as any).seedProducts();
        res.json({ message: "Products seeded successfully" });
      } else {
        res.status(400).json({ message: "Seeding not supported with current storage" });
      }
    } catch (error) {
      console.error("Error seeding products:", error);
      res.status(500).json({ message: "Failed to seed products" });
    }
  });

  // Admin endpoints
  // Simple admin login
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Benutzername und Passwort sind erforderlich" });
      }

      // Check for default admin credentials
      if (username === "glanzbruch" && password === "admin2025") {
        // Create a simple token (in production, use JWT)
        const token = crypto.randomBytes(32).toString('hex');
        return res.json({ token, message: "Anmeldung erfolgreich" });
      }

      return res.status(401).json({ message: "Ungültiger Benutzername oder Passwort" });
    } catch (error) {
      console.error("Admin login error:", error);
      res.status(500).json({ message: "Serverfehler" });
    }
  });

  // Get courses with course types for admin dashboard
  app.get("/api/admin/courses", async (req, res) => {
    try {
      const courses = await storage.getCoursesWithTypes();
      res.json(courses);
    } catch (error) {
      console.error("Get admin courses error:", error);
      res.status(500).json({ message: "Failed to fetch courses" });
    }
  });

  // Create new course instance
  app.post("/api/admin/courses", async (req, res) => {
    try {
      const data = req.body;
      
      // Validate required fields
      if (!data.courseTypeId || !data.title || !data.date) {
        return res.status(400).json({ message: "Kurstyp, Titel und Datum sind erforderlich" });
      }
      
      // Convert date string to Date object and set start/end times
      const courseData = {
        ...data,
        date: new Date(data.date),
        startTime: data.startTime || '09:00',
        endTime: data.endTime || '17:00',
        availableSpots: data.maxParticipants
      };
      
      const course = await storage.createCourse(courseData);
      res.status(201).json(course);
    } catch (error) {
      console.error("Create course error:", error);
      res.status(500).json({ message: "Failed to create course" });
    }
  });

  // Update course
  app.put("/api/admin/courses/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const data = req.body;
      
      // Convert date string to Date object for database
      const courseData = {
        ...data,
        date: new Date(data.date),
      };
      
      const updatedCourse = await storage.updateCourse(id, courseData);
      if (updatedCourse) {
        res.json(updatedCourse);
      } else {
        res.status(404).json({ message: "Kurs nicht gefunden" });
      }
    } catch (error) {
      console.error("Update course error:", error);
      res.status(500).json({ message: "Failed to update course" });
    }
  });

  // Delete course
  app.delete("/api/admin/courses/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteCourse(id);
      if (success) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: "Kurs nicht gefunden" });
      }
    } catch (error) {
      console.error("Delete course error:", error);
      res.status(500).json({ message: "Failed to delete course" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
