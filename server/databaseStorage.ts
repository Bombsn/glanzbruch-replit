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
  type GalleryImage,
  type InsertGalleryImage,
  type CourseWithType,
  products,
  courses,
  courseTypes,
  orders,
  courseBookings,
  commissionRequests,
  admins,
  galleryImages
} from "@shared/schema";
import { db } from "./db";
import { eq, sql, asc, and } from "drizzle-orm";
import type { IStorage } from "./storage";

export class DatabaseStorage implements IStorage {
  // Products
  async getProducts(): Promise<Product[]> {
    return await db.select().from(products);
  }

  async getRandomProducts(count: number): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.inStock, true)).orderBy(sql`RANDOM()`).limit(count);
  }

  async getProduct(id: string): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product || undefined;
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return await db.select().from(products).where(and(eq(products.category, category), eq(products.inStock, true)));
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const [newProduct] = await db.insert(products).values(product).returning();
    return newProduct;
  }

  async updateProduct(id: string, product: InsertProduct): Promise<Product | undefined> {
    const [updatedProduct] = await db.update(products)
      .set(product)
      .where(eq(products.id, id))
      .returning();
    return updatedProduct || undefined;
  }

  async deleteProduct(id: string): Promise<boolean> {
    const result = await db.delete(products).where(eq(products.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Course Types
  async getCourseTypes(): Promise<CourseType[]> {
    return await db.select().from(courseTypes);
  }

  async getCourseType(id: string): Promise<CourseType | undefined> {
    const [courseType] = await db.select().from(courseTypes).where(eq(courseTypes.id, id));
    return courseType || undefined;
  }

  async createCourseType(courseType: InsertCourseType): Promise<CourseType> {
    const [newCourseType] = await db.insert(courseTypes).values(courseType).returning();
    return newCourseType;
  }

  // Courses
  async getCourses(): Promise<Course[]> {
    return await db.select().from(courses);
  }

  async getCoursesWithTypes(): Promise<CourseWithType[]> {
    const result = await db.select({
      id: courses.id,
      courseTypeId: courses.courseTypeId,
      title: courses.title,
      date: courses.date,
      startTime: courses.startTime,
      endTime: courses.endTime,
      maxParticipants: courses.maxParticipants,
      availableSpots: courses.availableSpots,
      location: courses.location,
      instructor: courses.instructor,
      status: courses.status,
      notes: courses.notes,
      createdAt: courses.createdAt,
      courseType: {
        id: courseTypes.id,
        name: courseTypes.name,
        description: courseTypes.description,
        price: courseTypes.price,
        duration: courseTypes.duration,
        maxParticipants: courseTypes.maxParticipants,
        minAge: courseTypes.minAge,
        materials: courseTypes.materials,
        requirements: courseTypes.requirements,
        imageUrl: courseTypes.imageUrl,
        createdAt: courseTypes.createdAt,
      }
    })
    .from(courses)
    .leftJoin(courseTypes, eq(courses.courseTypeId, courseTypes.id))
    .orderBy(asc(courses.date));

    // Transform the result to match CourseWithType interface
    return result.map(row => ({
      id: row.id,
      courseTypeId: row.courseTypeId,
      title: row.title,
      date: row.date,
      startTime: row.startTime,
      endTime: row.endTime,
      maxParticipants: row.maxParticipants,
      availableSpots: row.availableSpots,
      location: row.location,
      instructor: row.instructor,
      status: row.status,
      notes: row.notes,
      createdAt: row.createdAt,
      courseType: row.courseType!
    }));
  }

  async getCourse(id: string): Promise<Course | undefined> {
    const [course] = await db.select().from(courses).where(eq(courses.id, id));
    return course || undefined;
  }

  async getCourseWithType(id: string): Promise<CourseWithType | undefined> {
    const result = await db.select({
      id: courses.id,
      courseTypeId: courses.courseTypeId,
      title: courses.title,
      date: courses.date,
      startTime: courses.startTime,
      endTime: courses.endTime,
      maxParticipants: courses.maxParticipants,
      availableSpots: courses.availableSpots,
      location: courses.location,
      instructor: courses.instructor,
      status: courses.status,
      notes: courses.notes,
      createdAt: courses.createdAt,
      courseType: {
        id: courseTypes.id,
        name: courseTypes.name,
        description: courseTypes.description,
        price: courseTypes.price,
        duration: courseTypes.duration,
        maxParticipants: courseTypes.maxParticipants,
        minAge: courseTypes.minAge,
        materials: courseTypes.materials,
        requirements: courseTypes.requirements,
        imageUrl: courseTypes.imageUrl,
        createdAt: courseTypes.createdAt,
      }
    })
    .from(courses)
    .leftJoin(courseTypes, eq(courses.courseTypeId, courseTypes.id))
    .where(eq(courses.id, id));

    if (result.length === 0) {
      return undefined;
    }

    const row = result[0];
    return {
      id: row.id,
      courseTypeId: row.courseTypeId,
      title: row.title,
      date: row.date,
      startTime: row.startTime,
      endTime: row.endTime,
      maxParticipants: row.maxParticipants,
      availableSpots: row.availableSpots,
      location: row.location,
      instructor: row.instructor,
      status: row.status,
      notes: row.notes,
      createdAt: row.createdAt,
      courseType: row.courseType!
    };
  }

  async createCourse(course: InsertCourse): Promise<Course> {
    const [newCourse] = await db.insert(courses).values(course).returning();
    return newCourse;
  }

  async updateCourse(id: string, course: Partial<InsertCourse>): Promise<Course | undefined> {
    console.log(`🔧 DatabaseStorage.updateCourse called with id: ${id}`, course);
    
    try {
      const [updatedCourse] = await db.update(courses)
        .set(course)
        .where(eq(courses.id, id))
        .returning();
        
      console.log('🔧 Database update result:', updatedCourse);
      
      if (!updatedCourse) {
        console.error('❌ No course was updated - course ID might not exist');
      }
      
      return updatedCourse || undefined;
    } catch (error) {
      console.error('❌ Database update error:', error);
      throw error;
    }
  }

  async deleteCourse(id: string): Promise<boolean> {
    const result = await db.delete(courses).where(eq(courses.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Orders
  async getOrders(): Promise<Order[]> {
    return await db.select().from(orders);
  }

  async getOrder(id: string): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order || undefined;
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const [newOrder] = await db.insert(orders).values(order).returning();
    return newOrder;
  }

  // Course Bookings
  async getCourseBookings(): Promise<CourseBooking[]> {
    return await db.select().from(courseBookings).orderBy(courseBookings.createdAt);
  }

  async getCourseBooking(id: string): Promise<CourseBooking | undefined> {
    const [booking] = await db.select().from(courseBookings).where(eq(courseBookings.id, id));
    return booking || undefined;
  }

  async createCourseBooking(booking: InsertCourseBooking): Promise<CourseBooking> {
    const [newBooking] = await db.insert(courseBookings).values(booking).returning();
    return newBooking;
  }

  // Commission Requests
  async getCommissionRequests(): Promise<CommissionRequest[]> {
    return await db.select().from(commissionRequests);
  }

  async getCommissionRequest(id: string): Promise<CommissionRequest | undefined> {
    const [request] = await db.select().from(commissionRequests).where(eq(commissionRequests.id, id));
    return request || undefined;
  }

  async createCommissionRequest(request: InsertCommissionRequest): Promise<CommissionRequest> {
    const [newRequest] = await db.insert(commissionRequests).values(request).returning();
    return newRequest;
  }

  // Admin methods
  async getAdminByUsername(username: string): Promise<Admin | undefined> {
    const [admin] = await db.select().from(admins).where(eq(admins.username, username));
    return admin || undefined;
  }

  async createAdmin(admin: InsertAdmin): Promise<Admin> {
    const [newAdmin] = await db.insert(admins).values(admin).returning();
    return newAdmin;
  }

  // Gallery Images
  async getGalleryImages(): Promise<GalleryImage[]> {
    return await db.select().from(galleryImages).where(eq(galleryImages.isVisible, true)).orderBy(asc(galleryImages.sortOrder), asc(galleryImages.createdAt));
  }

  async getAllGalleryImages(): Promise<GalleryImage[]> {
    return await db.select().from(galleryImages).orderBy(asc(galleryImages.sortOrder), asc(galleryImages.createdAt));
  }

  async getGalleryImagesByCategory(category: string): Promise<GalleryImage[]> {
    return await db.select().from(galleryImages)
      .where(and(eq(galleryImages.category, category), eq(galleryImages.isVisible, true)))
      .orderBy(asc(galleryImages.sortOrder), asc(galleryImages.createdAt));
  }

  async createGalleryImage(image: InsertGalleryImage): Promise<GalleryImage> {
    const [newImage] = await db.insert(galleryImages).values(image).returning();
    return newImage;
  }

  async updateGalleryImage(id: string, image: Partial<InsertGalleryImage>): Promise<GalleryImage | undefined> {
    const [updatedImage] = await db.update(galleryImages)
      .set(image)
      .where(eq(galleryImages.id, id))
      .returning();
    return updatedImage || undefined;
  }

  async deleteGalleryImage(id: string): Promise<boolean> {
    const result = await db.delete(galleryImages).where(eq(galleryImages.id, id));
    return (result.rowCount || 0) > 0;
  }
}