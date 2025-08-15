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
  products,
  courses,
  courseTypes,
  orders,
  courseBookings,
  commissionRequests,
  admins
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import type { IStorage } from "./storage";

export class DatabaseStorage implements IStorage {
  // Seed products with authentic Glanzbruch data
  async seedProducts(): Promise<void> {
    // Check if products already exist
    const existingProducts = await this.getProducts();
    if (existingProducts.length > 0) {
      return; // Don't seed if products already exist
    }

    const authentischeProdukts: InsertProduct[] = [
      {
        name: "Die Kugel des Rabenblicks handgeschmiedet aus Silber und einer Bergkristallkugel, Nr. A89",
        description: "Geschmiedet aus Silber und einem Hauch von Magie ;-) Der Anhänger ist aus Silber und einer Bergkristallkugel hergestellt, bewacht wird die Kugel von einem Raben. Der Anhänger inkl. Aufhängung ist 2,5 cm hoch und an der breitesten Stelle am Bogen 2,5 cm breit. Der Kettenanhänger kommt an einem langen Seidenband in einem unserer wunderschönen Geschenkschachteli.",
        price: "89.00",
        category: "kettenanhanger",
        imageUrls: [
          "https://image.jimcdn.com/app/cms/image/transf/dimension=1820x1280:format=jpg/path/s10438f9ff8ed1fb7/image/ibd7c9aa523103161/version/1754492081/image.jpg",
          "https://image.jimcdn.com/app/cms/image/transf/dimension=50x50:mode=crop:format=jpg/path/s10438f9ff8ed1fb7/image/i8d362ce364d6d478/version/1754492081/image.jpg",
          "https://image.jimcdn.com/app/cms/image/transf/dimension=50x50:mode=crop:format=jpg/path/s10438f9ff8ed1fb7/image/i71be1a6368ce49eb/version/1754492081/image.jpg",
          "https://image.jimcdn.com/app/cms/image/transf/dimension=50x50:mode=crop:format=jpg/path/s10438f9ff8ed1fb7/image/i845386e041798c8d/version/1754492081/image.jpg"
        ],
        sku: "A89",
        inStock: true,
        material: "925er Silber, Bergkristall",
        dimensions: "2,5 cm hoch x 2,5 cm breit"
      },
      {
        name: "Hortensienblüte mit Chrysokoll-Edelstein, aus Silber 925 mit versilberter Kette Nr. A95",
        description: "Die Hortensienblüte ist aus reinem Silber von Hand hergestellt. Daran hängt eine wunderschöne Chrysokoll-Edelsteinperle. Die Kette ist versilbert und hat eine Länge von 45 cm. Grösse der Blüte 2,8 cm. Der Anhänger kommt schön verpackt in einem unserer zauberhaften kleinen Geschenkschachteli zu dir.",
        price: "68.00",
        category: "kettenanhanger",
        imageUrls: [
          "https://image.jimcdn.com/app/cms/image/transf/dimension=1820x1280:format=jpg/path/s10438f9ff8ed1fb7/image/ia4aba746bd75b555/version/1754492838/image.jpg",
          "https://image.jimcdn.com/app/cms/image/transf/dimension=50x50:mode=crop:format=jpg/path/s10438f9ff8ed1fb7/image/i4269f6352f7be904/version/1754492838/image.jpg",
          "https://image.jimcdn.com/app/cms/image/transf/dimension=50x50:mode=crop:format=jpg/path/s10438f9ff8ed1fb7/image/ic57ff89f05e18b98/version/1754492838/image.jpg"
        ],
        sku: "A95",
        inStock: true,
        material: "925er Silber, Chrysokoll-Edelstein",
        dimensions: "Blüte 2,8 cm, Kette 45 cm"
      },
      {
        name: "Efeublatt mit Moosachat aus Silber, inkl. versilberter Kette, Nr. A96",
        description: "Das Efeublatt ist von Hand aus Silber hergestellt und hat eine Grösse von 2,5x1,8 cm. ein kleiner Moosachat in Silber gefasst erinnert an einen kleinen Zauberwald. Der Anhänger kommt an einer versilberten Kette à 45 cm, schön verpackt in einem unserer zauberhaften kleinen Geschenkschachteli zu dir.",
        price: "65.00",
        category: "kettenanhanger",
        imageUrls: [
          "https://image.jimcdn.com/app/cms/image/transf/dimension=1820x1280:format=jpg/path/s10438f9ff8ed1fb7/image/ida371535f8c2ae32/version/1754491305/image.jpg",
          "https://image.jimcdn.com/app/cms/image/transf/dimension=50x50:mode=crop:format=jpg/path/s10438f9ff8ed1fb7/image/i07b64c6b8fd0b1ad/version/1754491305/image.jpg",
          "https://image.jimcdn.com/app/cms/image/transf/dimension=50x50:mode=crop:format=jpg/path/s10438f9ff8ed1fb7/image/i9750ae652188570d/version/1754491305/image.jpg"
        ],
        sku: "A96",
        inStock: false,
        material: "925er Silber, Moosachat",
        dimensions: "2,5x1,8 cm, Kette 45 cm"
      },
      {
        name: "Handgemachtes Eichenblatt aus Silber 925 mit einem wunderschönen Moosachat, Nr. A87",
        description: "Mein Eichenblatt aus Silber mit einem wunderschönen Moosachat eingearbeitet. Länge Blatt inkl. Öse 4,5 cm. Das Eichenblatt kommt an einem braunen Kunstlederband schön verpackt in einem unserer zauberhaften kleinen Geschenkschachteli.",
        price: "70.00",
        category: "kettenanhanger",
        imageUrls: [
          "https://image.jimcdn.com/app/cms/image/transf/dimension=1820x1280:format=jpg/path/s10438f9ff8ed1fb7/image/ic64c42fb73f65811/version/1754060148/image.jpg",
          "https://image.jimcdn.com/app/cms/image/transf/dimension=50x50:mode=crop:format=jpg/path/s10438f9ff8ed1fb7/image/ife6a5c0779313ba4/version/1754060205/image.jpg",
          "https://image.jimcdn.com/app/cms/image/transf/dimension=50x50:mode=crop:format=jpg/path/s10438f9ff8ed1fb7/image/ibbcadfa2b26084de/version/1754060205/image.jpg"
        ],
        sku: "A87",
        inStock: true,
        material: "925er Silber, Moosachat",
        dimensions: "4,5 cm inkl. Öse"
      },
      // Ohrringe
      {
        name: "Efeublatt-Ohrringe mit Moosachat-Edelsteinen, aus Silber Nr. A92",
        description: "Ein Stück Natur für die Ewigkeit - In Handarbeit aus Silber hergestellte Efeublätter mit wunderschönen Moosachatedelsteinen. Gewicht pro Ohrring: 2g",
        price: "85.00",
        category: "ohrringe",
        imageUrls: [
          "https://image.jimcdn.com/app/cms/image/transf/dimension=1820x1280:format=jpg/path/s10438f9ff8ed1fb7/image/if00f60cf1f27d99d/version/1754501334/image.jpg",
          "https://image.jimcdn.com/app/cms/image/transf/dimension=50x50:mode=crop:format=jpg/path/s10438f9ff8ed1fb7/image/i9d8537169987941d/version/1754501334/image.jpg",
          "https://image.jimcdn.com/app/cms/image/transf/dimension=50x50:mode=crop:format=jpg/path/s10438f9ff8ed1fb7/image/iff7ebc7080a87736/version/1754501334/image.jpg"
        ],
        sku: "A92",
        inStock: true,
        material: "925er Silber, Moosachat-Edelsteine",
        weight: "2g pro Ohrring"
      },
      {
        name: "Schneckenhäuschen mit echten Rubin-Perlen, Nr. A91",
        description: "Ein Stück Natur für die Ewigkeit - In Handarbeit aus Silber hergestellte Schneckenhäuschen mit wunderschönen Rubin. Gewicht pro Ohrring: 1,8 g leicht",
        price: "76.00",
        category: "ohrringe",
        imageUrls: [
          "https://image.jimcdn.com/app/cms/image/transf/dimension=1820x1280:format=jpg/path/s10438f9ff8ed1fb7/image/i4a453ff2f67e97cd/version/1754500922/image.jpg",
          "https://image.jimcdn.com/app/cms/image/transf/dimension=50x50:mode=crop:format=jpg/path/s10438f9ff8ed1fb7/image/ica6ab14d8266b419/version/1754500922/image.jpg",
          "https://image.jimcdn.com/app/cms/image/transf/dimension=50x50:mode=crop:format=jpg/path/s10438f9ff8ed1fb7/image/ib4176bbde5a9b51c/version/1754500922/image.jpg"
        ],
        sku: "A91",
        inStock: true,
        material: "925er Silber, Rubin-Perlen",
        weight: "1,8g pro Ohrring"
      },
      // Fingerringe
      {
        name: "Blattskelett Ring mit Schneckenhäuschen aus Sterlingsilber, Grössenverstellbar Nr. A94",
        description: "Von Hand hergestellter Ring aus Silber. Darin eingearbeitet sind die Adern eines Blattes und obendrauf thront ein kleines Schneckenhäuschen. Alles aus 925er Sterlingsilber. Der Ring ist grössenverstellbar. Der Ring kommt schön verpackt in einem unserer Geschenkschachteli zu dir.",
        price: "88.00",
        category: "fingerringe",
        imageUrls: [
          "https://image.jimcdn.com/app/cms/image/transf/dimension=1820x1280:format=jpg/path/s10438f9ff8ed1fb7/image/i3b68ae11aa2cbcce/version/1754501485/image.jpg",
          "https://image.jimcdn.com/app/cms/image/transf/dimension=50x50:mode=crop:format=jpg/path/s10438f9ff8ed1fb7/image/idd9652c89ee0916a/version/1754501485/image.jpg",
          "https://image.jimcdn.com/app/cms/image/transf/dimension=50x50:mode=crop:format=jpg/path/s10438f9ff8ed1fb7/image/ibf232c6602efc562/version/1754501485/image.jpg"
        ],
        sku: "A94",
        inStock: true,
        material: "925er Sterlingsilber",
        dimensions: "Grössenverstellbar"
      },
      {
        name: "Ring Tautropfen aus Sterlingsilber und Mondsteinkugel, Grösse 16/56, Nr. A85",
        description: "Von Hand geschmiedeter Ring mit dem kleinen Tautropfen aus Mondstein daran. Der Ring ist aus recyceltem Silber, der Tautropfen aus einer Mondsteinperle. Grösse 16/56",
        price: "89.00",
        category: "fingerringe",
        imageUrls: [
          "https://image.jimcdn.com/app/cms/image/transf/dimension=1820x1280:format=jpg/path/s10438f9ff8ed1fb7/image/i05f5562a9ee9f85c/version/1714478911/image.jpg",
          "https://image.jimcdn.com/app/cms/image/transf/dimension=50x50:mode=crop:format=jpg/path/s10438f9ff8ed1fb7/image/i1e52e6cdc9b07be2/version/1754061405/image.jpg",
          "https://image.jimcdn.com/app/cms/image/transf/dimension=50x50:mode=crop:format=jpg/path/s10438f9ff8ed1fb7/image/i0677e49777d48fd3/version/1754061405/image.jpg"
        ],
        sku: "A85",
        inStock: true,
        material: "925er Sterlingsilber, Mondstein",
        dimensions: "Grösse 16/56"
      }
    ];

    // Insert all products into the database
    for (const product of authentischeProdukts) {
      await this.createProduct(product);
    }

    // Seed course types
    const kursTypen: InsertCourseType[] = [
      {
        name: "UV-Resin Ganztageskurs",
        description: "Wir arbeiten mit UV-Resin. Ich zeige euch all die vielen Möglichkeiten die dieses Material bietet. Es stehen euch eine riesengrosse Auswahl an verschiedenen Silikonformen, Metallfassungen, Blüten, Glitzer und vieles mehr zur Verfügung. Ausserdem sprechen wir über Vor- und Nachteile sowie Unterschiede von UV-Resin und Epoxydharzes. Ich zeige euch zudem, wie Pflänzchen und Pilze getrocknet werden. Ein toller Ganztageskurs für Bastel-Freaks oder die, die es werden möchten😉 (keine Vorkenntnisse notwendig)",
        price: "200.00",
        duration: "Ganztag (6,5 Stunden)",
        maxParticipants: 8,
        minAge: 12,
        materials: ["UV-Resin", "Silikonformen", "Metallfassungen", "Blüten", "Glitzer", "Verpflegung"],
        requirements: "Keine Vorkenntnisse notwendig. Schürze oder alte Kleider mitbringen (Harz geht beim Waschen nicht mehr raus).",
        imageUrl: "https://image.jimcdn.com/app/cms/image/transf/dimension=330x1024:format=jpg/path/s10438f9ff8ed1fb7/image/i8cfcf59a7999fabe/version/1707816852/image.jpg"
      },
      {
        name: "UV-Resin Halbtageskurs",
        description: "UV-Resin bietet wahnsinnig viele Einsatzmöglichkeiten. Im Kurs steht dir eine Vielfalt an Schmuckgestaltungsmöglichkeiten zur Verfügung. Wir giessen mit Hilfe von UV-Resin und giessen damit Naturmaterialien, Folien, Glitzer und vieles mehr ein. UV-Resin ist ein neuer Kunstharz, der mit UV-Licht innert weniger Sekunden aushärtet und nach mehreren Minuten klebefrei ist. Die Zeit reicht für ca. 3-5 Schmuckstücke.",
        price: "98.00",
        duration: "Halbtag (3 Stunden)",
        maxParticipants: 8,
        minAge: 12,
        materials: ["UV-Resin", "Silikonformen", "Naturalien", "Glitzer"],
        requirements: "Keine Vorkenntnisse notwendig. Schürze oder alte Kleider mitbringen.",
        imageUrl: "https://image.jimcdn.com/app/cms/image/transf/dimension=330x1024:format=jpg/path/s10438f9ff8ed1fb7/image/i8cfcf59a7999fabe/version/1707816852/image.jpg"
      },
      {
        name: "Metal-Clay Silber Kurs - Blüten und Blätter",
        description: "Von der Blüte bis zu fertigen Schmuckstück. Wir starten mit Silikonformen, die aus echten Blüten und Blättern hergestellt wurden. Abgeformt wird mit Metal Clay Silber - das ist ein wunderbares Material, das beim Brennen bei 800 Grad den Binder verliert und zurück bleibt reines Silber - Magisch, oder? Wer möchte, darf gerne Blätter und Blüten mitbringen. Es können mehrere Schmuckstücke hergestellt werden.",
        price: "95.00",
        duration: "3 Stunden",
        maxParticipants: 5,
        minAge: 12,
        materials: ["Metal Clay Silber (ca. CHF 40 für 2-3 Schmuckstücke)", "Silikonformen", "Brennofen"],
        requirements: "Keine Vorkenntnisse notwendig. Das Silber wird nach Gramm berechnet.",
        imageUrl: "https://image.jimcdn.com/app/cms/image/transf/dimension=330x1024:format=jpg/path/s10438f9ff8ed1fb7/image/i73fadaa9489816f0/version/1753290531/image.jpg"
      },
      {
        name: "Metal-Clay Silber Kurs - Münzen gestalten",
        description: "Münze aus einer anderen Welt. Von der Idee bis zur Münze werden wir alles von Hand entwerfen und herstellen. Wir starten mit der Skizze und stechen mit Carving Tools unsere Idee in Silikon. Abgeformt wird mit Metal Clay Silber - das ist ein wunderbares Material, das beim Brennen bei 800 Grad den Binder verliert und zurück bleibt reines Silber - Magisch, oder?",
        price: "95.00",
        duration: "3 Stunden", 
        maxParticipants: 5,
        minAge: 12,
        materials: ["Metal Clay Silber (ca. CHF 40 für 2-3 Stücke)", "Carving Tools", "Silikon", "Brennofen"],
        requirements: "Keine Vorkenntnisse notwendig. Das Silber wird nach Gramm berechnet.",
        imageUrl: "https://image.jimcdn.com/app/cms/image/transf/dimension=330x1024:format=jpg/path/s10438f9ff8ed1fb7/image/i0d0bf8c4bc9d5ec9/version/1753279077/image.jpg"
      }
    ];

    // Insert course types
    for (const courseType of kursTypen) {
      await this.createCourseType(courseType);
    }
  }
  // Products
  async getProducts(): Promise<Product[]> {
    return await db.select().from(products);
  }

  async getProduct(id: string): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product || undefined;
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.category, category));
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const [newProduct] = await db.insert(products).values(product).returning();
    return newProduct;
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

  async getCoursesWithTypes() {
    return await db.select({
      id: courses.id,
      courseTypeId: courses.courseTypeId,
      date: courses.date,
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
    .leftJoin(courseTypes, eq(courses.courseTypeId, courseTypes.id));
  }

  async getCourse(id: string): Promise<Course | undefined> {
    const [course] = await db.select().from(courses).where(eq(courses.id, id));
    return course || undefined;
  }

  async createCourse(course: InsertCourse): Promise<Course> {
    const [newCourse] = await db.insert(courses).values(course).returning();
    return newCourse;
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
    return await db.select().from(courseBookings);
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
  
  // Delete course method for admin
  async deleteCourse(id: string): Promise<boolean> {
    const result = await db.delete(courses).where(eq(courses.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }
  
  // Admin methods
  async getAdminByUsername(username: string): Promise<any> {
    const [admin] = await db.select().from(admins).where(eq(admins.username, username));
    return admin || undefined;
  }
  
  async createAdmin(admin: any): Promise<any> {
    const [createdAdmin] = await db.insert(admins).values(admin).returning();
    return createdAdmin;
  }
}