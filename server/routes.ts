import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { ObjectStorageService } from "./objectStorage";
import crypto from "crypto";
import { 
  insertProductSchema,
  insertCourseSchema,
  insertOrderSchema,
  insertCourseBookingSchema,
  insertCommissionRequestSchema,
  insertGalleryImageSchema
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

  app.get("/api/products/random/:count", async (req, res) => {
    try {
      const count = parseInt(req.params.count);
      if (isNaN(count) || count <= 0) {
        return res.status(400).json({ message: "Invalid count parameter" });
      }
      const products = await storage.getRandomProducts(count);
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch random products" });
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

  // Admin Product Management Routes
  app.get("/api/admin/products", async (req, res) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.post("/api/admin/products", async (req, res) => {
    try {
      const productData = insertProductSchema.parse(req.body);
      const newProduct = await storage.createProduct(productData);
      res.status(201).json(newProduct);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Failed to create product" });
      }
    }
  });

  app.put("/api/admin/products/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const productData = insertProductSchema.parse(req.body);
      const updatedProduct = await storage.updateProduct(id, productData);
      if (!updatedProduct) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(updatedProduct);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Failed to update product" });
      }
    }
  });

  app.delete("/api/admin/products/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteProduct(id);
      if (!deleted) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json({ message: "Product deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete product" });
    }
  });

  // Object Storage Routes - Real implementation
  app.post("/api/objects/upload", async (req, res) => {
    try {
      const privateObjectDir = process.env.PRIVATE_OBJECT_DIR;
      if (!privateObjectDir) {
        return res.status(500).json({ message: "PRIVATE_OBJECT_DIR not set" });
      }

      const objectId = crypto.randomUUID();
      let fullPath = `${privateObjectDir}/gallery/${objectId}`;
      
      if (!fullPath.startsWith("/")) {
        fullPath = `/${fullPath}`;
      }
      const pathParts = fullPath.split("/");
      if (pathParts.length < 3) {
        return res.status(500).json({ message: "Invalid path structure" });
      }
      const bucketName = pathParts[1];
      const objectName = pathParts.slice(2).join("/");
      
      // Direct sidecar call
      const request = {
        bucket_name: bucketName,
        object_name: objectName,
        method: "PUT",
        expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
      };
      
      const response = await fetch(
        "http://127.0.0.1:1106/object-storage/signed-object-url",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(request),
        }
      );
      
      if (!response.ok) {
        const errorText = await response.text();
        return res.status(500).json({ message: "Failed to get signed URL", error: errorText });
      }
      
      const { signed_url: uploadURL } = await response.json();
      res.json({ uploadURL });
    } catch (error) {
      console.error("Failed to get upload URL:", error);
      res.status(500).json({ message: "Failed to get upload URL", error: (error as Error).message });
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

  // Gallery API Routes
  app.get("/api/gallery", async (req, res) => {
    try {
      const images = await storage.getGalleryImages();
      res.json(images);
    } catch (error) {
      console.error("Failed to fetch gallery images:", error);
      res.status(500).json({ message: "Failed to fetch gallery images" });
    }
  });

  app.get("/api/gallery/category/:category", async (req, res) => {
    try {
      const { category } = req.params;
      const images = await storage.getGalleryImagesByCategory(category);
      res.json(images);
    } catch (error) {
      console.error(`Failed to fetch gallery images for category ${req.params.category}:`, error);
      res.status(500).json({ message: "Failed to fetch gallery images" });
    }
  });

  app.post("/api/gallery", async (req, res) => {
    try {
      const result = insertGalleryImageSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid gallery image data", errors: result.error.issues });
      }

      const image = await storage.createGalleryImage(result.data);
      res.status(201).json(image);
    } catch (error) {
      console.error("Failed to create gallery image:", error);
      res.status(500).json({ message: "Failed to create gallery image" });
    }
  });

  app.put("/api/gallery/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updatedImage = await storage.updateGalleryImage(id, req.body);
      if (!updatedImage) {
        return res.status(404).json({ message: "Gallery image not found" });
      }
      res.json(updatedImage);
    } catch (error) {
      console.error("Failed to update gallery image:", error);
      res.status(500).json({ message: "Failed to update gallery image" });
    }
  });

  app.delete("/api/gallery/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteGalleryImage(id);
      if (!success) {
        return res.status(404).json({ message: "Gallery image not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Failed to delete gallery image:", error);
      res.status(500).json({ message: "Failed to delete gallery image" });
    }
  });

  // Gallery import endpoint
  app.post("/api/gallery/import", async (req, res) => {
    try {
      console.log('🎨 Starting gallery import from Glanzbruch.ch...');
      
      // Gallery data extracted from the website
      const galleryData = {
        'silver-bronze': [
          'https://image.jimcdn.com/app/cms/image/transf/dimension=1920x400:format=png/path/s10438f9ff8ed1fb7/image/ibb1faa0db4b7dc79/version/1742542669/image.png',
          'https://image.jimcdn.com/app/cms/image/transf/dimension=1920x400:format=png/path/s10438f9ff8ed1fb7/image/iff6512bd58d3ad5a/version/1703781277/image.png',
          'https://image.jimcdn.com/app/cms/image/transf/dimension=1920x400:format=png/path/s10438f9ff8ed1fb7/image/i7c197fbfac19fc6f/version/1703781287/image.png',
          'https://image.jimcdn.com/app/cms/image/transf/dimension=1920x400:format=png/path/s10438f9ff8ed1fb7/image/i4d38922aefa09a9a/version/1703781287/image.png',
          'https://image.jimcdn.com/app/cms/image/transf/dimension=1920x400:format=jpg/path/s10438f9ff8ed1fb7/image/i772e6eece123229d/version/1703781287/image.jpg',
          'https://image.jimcdn.com/app/cms/image/transf/dimension=1920x400:format=jpg/path/s10438f9ff8ed1fb7/image/ie986a8c1e703401e/version/1703781287/image.jpg',
          'https://image.jimcdn.com/app/cms/image/transf/dimension=1920x400:format=jpg/path/s10438f9ff8ed1fb7/image/idd3aeb4bab2b90b6/version/1703781287/image.jpg',
          'https://image.jimcdn.com/app/cms/image/transf/dimension=1920x400:format=jpg/path/s10438f9ff8ed1fb7/image/if68a31b77a38d170/version/1703781287/image.jpg',
          'https://image.jimcdn.com/app/cms/image/transf/dimension=1920x400:format=jpg/path/s10438f9ff8ed1fb7/image/i0fd7754e72e2cbf6/version/1703781287/image.jpg',
          'https://image.jimcdn.com/app/cms/image/transf/dimension=1920x400:format=jpg/path/s10438f9ff8ed1fb7/image/iba7351de4001bfcc/version/1703781287/image.jpg',
          'https://image.jimcdn.com/app/cms/image/transf/dimension=1920x400:format=jpg/path/s10438f9ff8ed1fb7/image/ie250e19027bd7d78/version/1703781287/image.jpg',
          'https://image.jimcdn.com/app/cms/image/transf/dimension=1920x400:format=jpg/path/s10438f9ff8ed1fb7/image/ie4401acf0027e62a/version/1703781287/image.jpg',
          'https://image.jimcdn.com/app/cms/image/transf/dimension=1920x400:format=jpg/path/s10438f9ff8ed1fb7/image/i964f628a064a8f7c/version/1703781287/image.jpg',
          'https://image.jimcdn.com/app/cms/image/transf/dimension=1920x400:format=jpg/path/s10438f9ff8ed1fb7/image/ie49289902893fb0e/version/1703781287/image.jpg',
          'https://image.jimcdn.com/app/cms/image/transf/dimension=1920x400:format=png/path/s10438f9ff8ed1fb7/image/i37a9ad529b23311a/version/1703781287/image.png',
          'https://image.jimcdn.com/app/cms/image/transf/dimension=1920x400:format=png/path/s10438f9ff8ed1fb7/image/i1e0d9a18960cd106/version/1703781287/image.png',
          'https://image.jimcdn.com/app/cms/image/transf/dimension=1920x400:format=png/path/s10438f9ff8ed1fb7/image/i299e8859a3acee40/version/1703781287/image.png',
          'https://image.jimcdn.com/app/cms/image/transf/dimension=1920x400:format=png/path/s10438f9ff8ed1fb7/image/ia9a1ee9a9a7558de/version/1703781287/image.png',
          'https://image.jimcdn.com/app/cms/image/transf/dimension=1920x400:format=png/path/s10438f9ff8ed1fb7/image/iddf3766513ebb4ec/version/1703781287/image.png',
          'https://image.jimcdn.com/app/cms/image/transf/dimension=1920x400:format=png/path/s10438f9ff8ed1fb7/image/ifa4287419b57b0bd/version/1703781287/image.png'
        ],
        'nature': [
          'https://image.jimcdn.com/app/cms/image/transf/dimension=1920x400:format=jpg/path/s10438f9ff8ed1fb7/image/i83c6934c1231c52e/version/1625409223/image.jpg',
          'https://image.jimcdn.com/app/cms/image/transf/dimension=1920x400:format=jpg/path/s10438f9ff8ed1fb7/image/i54c075cb30000cd7/version/1625409223/image.jpg',
          'https://image.jimcdn.com/app/cms/image/transf/dimension=1920x400:format=jpg/path/s10438f9ff8ed1fb7/image/i8c3a8a65f14e28a1/version/1625409223/image.jpg',
          'https://image.jimcdn.com/app/cms/image/transf/dimension=1920x400:format=jpg/path/s10438f9ff8ed1fb7/image/id794bf2ec696f5ae/version/1625409223/image.jpg',
          'https://image.jimcdn.com/app/cms/image/transf/dimension=1920x400:format=jpg/path/s10438f9ff8ed1fb7/image/i7866b53a3a942975/version/1625409223/image.jpg',
          'https://image.jimcdn.com/app/cms/image/transf/dimension=1920x400:format=jpg/path/s10438f9ff8ed1fb7/image/i42c2bb4a69634e03/version/1625409223/image.jpg',
          'https://image.jimcdn.com/app/cms/image/transf/dimension=1920x400:format=jpg/path/s10438f9ff8ed1fb7/image/i9d83366ff873b6a2/version/1625409223/image.jpg',
          'https://image.jimcdn.com/app/cms/image/transf/dimension=1920x400:format=jpg/path/s10438f9ff8ed1fb7/image/i0b8b20ae3956222b/version/1625409223/image.jpg',
          'https://image.jimcdn.com/app/cms/image/transf/dimension=1920x400:format=jpg/path/s10438f9ff8ed1fb7/image/ice84efe5095426b7/version/1625409223/image.jpg',
          'https://image.jimcdn.com/app/cms/image/transf/dimension=1920x400:format=jpg/path/s10438f9ff8ed1fb7/image/i4e33a2299c244605/version/1625409223/image.jpg',
          'https://image.jimcdn.com/app/cms/image/transf/dimension=1920x400:format=jpg/path/s10438f9ff8ed1fb7/image/ied0f5a1df9dd8abf/version/1625409223/image.jpg',
          'https://image.jimcdn.com/app/cms/image/transf/dimension=1920x400:format=jpg/path/s10438f9ff8ed1fb7/image/if54e3904a253c00e/version/1625409223/image.jpg',
          'https://image.jimcdn.com/app/cms/image/transf/dimension=1920x400:format=jpg/path/s10438f9ff8ed1fb7/image/i78d02ed8227f4cc9/version/1625409223/image.jpg',
          'https://image.jimcdn.com/app/cms/image/transf/dimension=1920x400:format=jpg/path/s10438f9ff8ed1fb7/image/i2091ceeafb3aa6ba/version/1625409223/image.jpg',
          'https://image.jimcdn.com/app/cms/image/transf/dimension=1920x400:format=jpg/path/s10438f9ff8ed1fb7/image/i15e9069014037bbc/version/1625409223/image.jpg',
          'https://image.jimcdn.com/app/cms/image/transf/dimension=1920x400:format=jpg/path/s10438f9ff8ed1fb7/image/id0c450abcca4ccf6/version/1625409223/image.jpg',
          'https://image.jimcdn.com/app/cms/image/transf/dimension=1920x400:format=jpg/path/s10438f9ff8ed1fb7/image/i6d346894ae862dfb/version/1625409223/image.jpg',
          'https://image.jimcdn.com/app/cms/image/transf/dimension=1920x400:format=jpg/path/s10438f9ff8ed1fb7/image/ibf0d1b889683161b/version/1625409226/image.jpg',
          'https://image.jimcdn.com/app/cms/image/transf/dimension=1920x400:format=jpg/path/s10438f9ff8ed1fb7/image/i91a05c103cb87574/version/1625409226/image.jpg',
          'https://image.jimcdn.com/app/cms/image/transf/dimension=1920x400:format=jpg/path/s10438f9ff8ed1fb7/image/i19f2534b78446aea/version/1625409226/image.jpg'
        ],
        'resin': [
          'https://image.jimcdn.com/app/cms/image/transf/dimension=1920x400:format=jpg/path/s10438f9ff8ed1fb7/image/i79ef578716559d75/version/1612535477/image.jpg',
          'https://image.jimcdn.com/app/cms/image/transf/dimension=1920x400:format=jpg/path/s10438f9ff8ed1fb7/image/i61df994a33ec2098/version/1612535921/image.jpg',
          'https://image.jimcdn.com/app/cms/image/transf/dimension=1920x400:format=jpg/path/s10438f9ff8ed1fb7/image/i8a01bdac4029a6b9/version/1612535921/image.jpg',
          'https://image.jimcdn.com/app/cms/image/transf/dimension=1920x400:format=jpg/path/s10438f9ff8ed1fb7/image/idc1229c82aec4f47/version/1612535921/image.jpg',
          'https://image.jimcdn.com/app/cms/image/transf/dimension=1920x400:format=jpg/path/s10438f9ff8ed1fb7/image/ieb3795fd68e25aa9/version/1646985689/image.jpg',
          'https://image.jimcdn.com/app/cms/image/transf/dimension=1920x400:format=jpg/path/s10438f9ff8ed1fb7/image/i46abfd4209e6b36a/version/1646985689/image.jpg',
          'https://image.jimcdn.com/app/cms/image/transf/dimension=1920x400:format=jpg/path/s10438f9ff8ed1fb7/image/i91cdf4cc7f80ced5/version/1646985689/image.jpg',
          'https://image.jimcdn.com/app/cms/image/transf/dimension=1920x400:format=jpg/path/s10438f9ff8ed1fb7/image/i4bcbd7203673e396/version/1646985689/image.jpg',
          'https://image.jimcdn.com/app/cms/image/transf/dimension=1920x400:format=jpg/path/s10438f9ff8ed1fb7/image/i9ea7a675ee0d7b1e/version/1646985689/image.jpg',
          'https://image.jimcdn.com/app/cms/image/transf/dimension=1920x400:format=jpg/path/s10438f9ff8ed1fb7/image/i8103c8c066499be9/version/1646985689/image.jpg',
          'https://image.jimcdn.com/app/cms/image/transf/dimension=1920x400:format=jpg/path/s10438f9ff8ed1fb7/image/i8290d1a4de62d4f5/version/1646985689/image.jpg',
          'https://image.jimcdn.com/app/cms/image/transf/dimension=1920x400:format=jpg/path/s10438f9ff8ed1fb7/image/ib4bf2f20f14da012/version/1646985689/image.jpg',
          'https://image.jimcdn.com/app/cms/image/transf/dimension=1920x400:format=jpg/path/s10438f9ff8ed1fb7/image/if6bedd7f5bb22875/version/1646985689/image.jpg',
          'https://image.jimcdn.com/app/cms/image/transf/dimension=1920x400:format=jpg/path/s10438f9ff8ed1fb7/image/i178e95e4a278def6/version/1646985718/image.jpg',
          'https://image.jimcdn.com/app/cms/image/transf/dimension=1920x400:format=jpg/path/s10438f9ff8ed1fb7/image/i63374329de7246ad/version/1646985718/image.jpg',
          'https://image.jimcdn.com/app/cms/image/transf/dimension=1920x400:format=jpg/path/s10438f9ff8ed1fb7/image/i79f9bbeb49f8ab2a/version/1646985718/image.jpg',
          'https://image.jimcdn.com/app/cms/image/transf/dimension=1920x400:format=jpg/path/s10438f9ff8ed1fb7/image/if990958040fd1251/version/1646985718/image.jpg',
          'https://image.jimcdn.com/app/cms/image/transf/dimension=1920x400:format=jpg/path/s10438f9ff8ed1fb7/image/i004625cab19e77fd/version/1646985718/image.jpg',
          'https://image.jimcdn.com/app/cms/image/transf/dimension=1920x400:format=jpg/path/s10438f9ff8ed1fb7/image/i91bf7203efc049c2/version/1646985718/image.jpg',
          'https://image.jimcdn.com/app/cms/image/transf/dimension=1920x400:format=jpg/path/s10438f9ff8ed1fb7/image/idcc989ba80c2c352/version/1646985718/image.jpg'
        ],
        'worn': [
          'https://image.jimcdn.com/app/cms/image/transf/dimension=410x1024:format=jpg/path/s10438f9ff8ed1fb7/image/i1eb2f952d229bdc1/version/1639904999/image.jpg',
          'https://image.jimcdn.com/app/cms/image/transf/dimension=1920x400:format=png/path/s10438f9ff8ed1fb7/image/icfa7e5079b180a9f/version/1702847558/image.png',
          'https://image.jimcdn.com/app/cms/image/transf/dimension=1920x400:format=png/path/s10438f9ff8ed1fb7/image/i87a52a69cc43f382/version/1702847558/image.png',
          'https://image.jimcdn.com/app/cms/image/transf/dimension=1920x400:format=png/path/s10438f9ff8ed1fb7/image/ie58ae4d24afcbf3b/version/1702847558/image.png',
          'https://image.jimcdn.com/app/cms/image/transf/dimension=1920x400:format=png/path/s10438f9ff8ed1fb7/image/i9cd507bd18487da4/version/1702847558/image.png',
          'https://image.jimcdn.com/app/cms/image/transf/dimension=1920x400:format=png/path/s10438f9ff8ed1fb7/image/ifeef33c629a7a668/version/1702847558/image.png',
          'https://image.jimcdn.com/app/cms/image/transf/dimension=1920x400:format=png/path/s10438f9ff8ed1fb7/image/ib64604ac07643e95/version/1702847558/image.png',
          'https://image.jimcdn.com/app/cms/image/transf/dimension=1920x400:format=png/path/s10438f9ff8ed1fb7/image/i6cc3b1d42cc90ede/version/1702847558/image.png',
          'https://image.jimcdn.com/app/cms/image/transf/dimension=1920x400:format=png/path/s10438f9ff8ed1fb7/image/i0b5f853dcd3061df/version/1702847558/image.png',
          'https://image.jimcdn.com/app/cms/image/transf/dimension=1920x400:format=png/path/s10438f9ff8ed1fb7/image/ia7e4f966c8115633/version/1702847558/image.png',
          'https://image.jimcdn.com/app/cms/image/transf/dimension=1920x400:format=png/path/s10438f9ff8ed1fb7/image/i8b3deddcd1bc72ad/version/1702847558/image.png',
          'https://image.jimcdn.com/app/cms/image/transf/dimension=1920x400:format=png/path/s10438f9ff8ed1fb7/image/i31900cb28422a81e/version/1702847558/image.png',
          'https://image.jimcdn.com/app/cms/image/transf/dimension=1920x400:format=png/path/s10438f9ff8ed1fb7/image/id17ccb2be783617f/version/1702847558/image.png',
          'https://image.jimcdn.com/app/cms/image/transf/dimension=1920x400:format=png/path/s10438f9ff8ed1fb7/image/i37e6b2bb276aec08/version/1702847558/image.png',
          'https://image.jimcdn.com/app/cms/image/transf/dimension=1920x400:format=png/path/s10438f9ff8ed1fb7/image/i989fb7967ca9405d/version/1702847558/image.png',
          'https://image.jimcdn.com/app/cms/image/transf/dimension=1920x400:format=jpg/path/s10438f9ff8ed1fb7/image/i67b7372281476858/version/1702847558/image.jpg',
          'https://image.jimcdn.com/app/cms/image/transf/dimension=1920x400:format=jpg/path/s10438f9ff8ed1fb7/image/i2e7194b691e2aacc/version/1702847558/image.jpg',
          'https://image.jimcdn.com/app/cms/image/transf/dimension=1920x400:format=jpg/path/s10438f9ff8ed1fb7/image/i6a55446b16b6f477/version/1702847558/image.jpg',
          'https://image.jimcdn.com/app/cms/image/transf/dimension=1920x400:format=png/path/s10438f9ff8ed1fb7/image/i5cb1fb61b741c5e3/version/1702847558/image.png',
          'https://image.jimcdn.com/app/cms/image/transf/dimension=1920x400:format=jpg/path/s10438f9ff8ed1fb7/image/i22f117973db86ee6/version/1702847558/image.jpg'
        ]
      };

      // Category mappings from German to our internal categories
      const categoryMapping: Record<string, string> = {
        'silver-bronze': 'Silber und Bronze',
        'nature': 'Haare, Asche, Blüten, etc.',
        'resin': 'Kunstharz',
        'worn': 'Tragebilder'
      };

      let totalImported = 0;
      const startTime = Date.now();
      
      for (const [category, images] of Object.entries(galleryData)) {
        for (let i = 0; i < images.length; i++) {
          const imageUrl = images[i];
          
          try {
            const galleryImage = {
              imageUrl,
              title: `${categoryMapping[category]} ${i + 1}`,
              description: `Handgefertigtes Schmuckstück aus der ${categoryMapping[category]} Kollektion`,
              category,
              altText: `Glanzbruch ${categoryMapping[category]} Schmuckstück ${i + 1}`,
              sortOrder: i,
              isVisible: true
            };
            
            await storage.createGalleryImage(galleryImage);
            totalImported++;
          } catch (error) {
            console.error(`Failed to import image ${i + 1} from ${category}:`, (error as Error).message);
          }
        }
      }
      
      const duration = ((Date.now() - startTime) / 1000).toFixed(2);
      
      res.json({
        success: true,
        totalImported,
        duration: `${duration} seconds`,
        categories: Object.entries(galleryData).map(([key, images]) => ({
          category: categoryMapping[key],
          count: images.length
        }))
      });
    } catch (error) {
      console.error("Gallery import failed:", error);
      res.status(500).json({ message: "Gallery import failed", error: (error as Error).message });
    }
  });

  // Test debug route to verify object storage
  app.get("/api/debug/object-storage", async (req, res) => {
    try {
      const privateDir = process.env.PRIVATE_OBJECT_DIR;
      const publicPaths = process.env.PUBLIC_OBJECT_SEARCH_PATHS;
      
      // Direct sidecar test
      const future_date = new Date(Date.now() + 15 * 60 * 1000).toISOString();
      const request = {
        bucket_name: "replit-objstore-764ac426-f2e7-40ac-8c3c-7996aea383ec",
        object_name: ".private/gallery/debug-test",
        method: "PUT",
        expires_at: future_date,
      };
      
      const response = await fetch(
        "http://127.0.0.1:1106/object-storage/signed-object-url",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(request),
        }
      );
      
      const responseText = await response.text();
      
      res.json({
        env: { privateDir, publicPaths },
        sidecar: { 
          ok: response.ok, 
          status: response.status,
          response: responseText
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message, stack: error.stack });
    }
  });



  // Serve objects from storage
  app.get("/objects/:objectPath(*)", async (req, res) => {
    try {
      const objectStorageService = new ObjectStorageService();
      const objectFile = await objectStorageService.getObjectEntityFile(req.path);
      objectStorageService.downloadObject(objectFile, res);
    } catch (error) {
      console.error("Error serving object:", error);
      res.status(404).json({ error: "Object not found" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
