// Complete Product Import Script for Glanzbruch
// This script imports all products from all categories with original images

import fetch from 'node-fetch';

// All product categories and their real products
const ALL_PRODUCTS = {
  "kettenanhanger": [
    {
      name: "Geschichten vom Wald - Schneckenhäuschen mit Farnspitze aus Silber mit recycelter Glasperle Nr. A97",
      price: "88.00",
      imageUrls: ["https://image.jimcdn.com/app/cms/image/transf/dimension=800x800/path/s10438f9ff8ed1fb7/image/i3761a622f3824667/version/1755623541/image.jpg"],
      description: "Tief im Schatten des Waldrandes, wo das Licht zwischen den Bäumen tanzt und der Boden nach Moos und alten Geschichten durftet, ist dieses Farnblatt und das Schneckenhäuschen zuhause. Grösse des Anhängers 4,5x1,5cm",
      inStock: false,
      sku: "KETTE-A97",
      dimensions: "4,5x1,5cm",
      material: "Silber 925"
    },
    {
      name: "Die Kugel des Rabenblicks handgeschmiedet aus Silber und einer Bergkristallkugel, Nr. A89",
      price: "89.00",
      imageUrls: ["https://image.jimcdn.com/app/cms/image/transf/dimension=800x800/path/s10438f9ff8ed1fb7/image/ibd7c9aa523103161/version/1754492081/image.jpg"],
      description: "Geschmiedet aus Silber und einem Hauch von Magie ;-) Der Anhänger ist aus Silber und einer Bergkristallkugel hergestellt, bewacht wird die Kugel von einem Raben. Der Anhänger inkl. Aufhängung ist 2,5 cm hoch und an der breitesten Stelle am Bogen 2,5 cm breit.",
      inStock: true,
      sku: "KETTE-A89",
      dimensions: "2,5 cm hoch, 2,5 cm breit",
      material: "Silber 925"
    },
    {
      name: "Hortensienblüte mit Chrysokoll-Edelstein, aus Silber 925 mit versilberter Kette Nr. A95",
      price: "68.00",
      imageUrls: ["https://image.jimcdn.com/app/cms/image/transf/dimension=800x800/path/s10438f9ff8ed1fb7/image/ia4aba746bd75b555/version/1754492838/image.jpg"],
      description: "Die Hortensienblüte ist aus reinem Silber von Hand hergestellt. Daran hängt eine wunderschöne Chrysokoll-Edelsteinperle. Die Kette ist versilbert und hat eine Länge von 45 cm. Grösse der Blüte 2,8 cm",
      inStock: true,
      sku: "KETTE-A95",
      dimensions: "2,8 cm",
      material: "Silber 925"
    },
    {
      name: "Hortensienblüte mit Topas-Edelstein, aus Silber 925 mit versilberter Kette Nr. A98",
      price: "60.00",
      imageUrls: ["https://image.jimcdn.com/app/cms/image/transf/dimension=800x800/path/s10438f9ff8ed1fb7/image/i6f87fc2786aa46a7/version/1755624480/image.jpg"],
      description: "Die Hortensienblüte ist aus reinem Silber von Hand hergestellt. Daran hängt eine wunderschöne Topas-Edelsteinperle. Die Kette ist versilbert und hat eine Länge von 45 cm. Grösse der Blüte 1,7 cm",
      inStock: false,
      sku: "KETTE-A98",
      dimensions: "1,7 cm",
      material: "Silber 925"
    },
    {
      name: "Handgemachtes Eichenblatt aus Silber 925 mit einem wunderschönen Moosachat, Nr. A87",
      price: "70.00",
      imageUrls: ["https://image.jimcdn.com/app/cms/image/transf/dimension=800x800/path/s10438f9ff8ed1fb7/image/ic64c42fb73f65811/version/1754060148/image.jpg"],
      description: "Mein Eichenblatt aus Silber mit einem wunderschönen Moosachat eingearbeitet. Länge Blatt inkl. Öse 4,5 cm",
      inStock: true,
      sku: "KETTE-A87",
      dimensions: "4,5 cm",
      material: "Silber 925"
    }
  ],
  
  "ohrringe": [
    {
      name: "Ohrringe Rosenblüten, Silber Nr. A30",
      price: "70.00",
      imageUrls: ["https://image.jimcdn.com/app/cms/image/transf/dimension=800x800/path/s10438f9ff8ed1fb7/image/id877e919c5e89baa/version/1740246927/image.jpg"],
      description: "Ein Stück Natur für die Ewigkeit - In Kunstharz eingegossene Rosenblüten zu Ohrringen verarbeitet. Perlenkappe versilbert mit 999er Silber, Ohrhaken Sterlingsilber (925er), Grösse Kugel ca. 10 mm Durchmesser",
      inStock: false,
      sku: "OHR-A30",
      dimensions: "10 mm Durchmesser",
      material: "Sterlingsilber 925"
    },
    {
      name: "Efeublatt-Ohrringe mit Moosachat-Edelsteinen, aus Silber Nr. A92",
      price: "85.00",
      imageUrls: ["https://image.jimcdn.com/app/cms/image/transf/dimension=800x800/path/s10438f9ff8ed1fb7/image/if00f60cf1f27d99d/version/1754501334/image.jpg"],
      description: "Ein Stück Natur für die Ewigkeit - In Handarbeit aus Silber hergestellte Efeublätter mit wunderschönen Moosachatedelsteinen. Gewicht pro Ohrring: 2g",
      inStock: true,
      sku: "OHR-A92",
      dimensions: "Efeublatt-Form",
      material: "Silber 925"
    },
    {
      name: "Schneckenhäuschen mit echten Rubin-Perlen, Nr. A91",
      price: "76.00",
      imageUrls: ["https://image.jimcdn.com/app/cms/image/transf/dimension=800x800/path/s10438f9ff8ed1fb7/image/i4a453ff2f67e97cd/version/1754500922/image.jpg"],
      description: "Ein Stück Natur für die Ewigkeit - In Handarbeit aus Silber hergestellte Schneckenhäuschen mit wunderschönen Rubin. Gewicht pro Ohrring: 1,8 g leicht",
      inStock: true,
      sku: "OHR-A91",
      dimensions: "Schneckenhäuschen",
      material: "Silber 925"
    },
    {
      name: "Hortensien-Ohrringe mit Chrysokoll-Edelsteinperlen aus Silber Nr. A93",
      price: "79.00",
      imageUrls: ["https://image.jimcdn.com/app/cms/image/transf/dimension=800x800/path/s10438f9ff8ed1fb7/image/i17d5044843e4aeda/version/1754501117/image.jpg"],
      description: "Ein Stück Natur für die Ewigkeit - In Handarbeit aus Silber hergestellte Hortensienblüten mit wunderschönen Chrysokoll-Edelsteinperlen.",
      inStock: true,
      sku: "OHR-A93",
      dimensions: "Hortensienblüte",
      material: "Silber 925"
    },
    {
      name: "Kleine Hortensienblüten-Ohrringe Stecker mit Tautropfen aus Mondstein, aus Silber Nr. A90",
      price: "82.00",
      imageUrls: ["https://image.jimcdn.com/app/cms/image/transf/dimension=800x800/path/s10438f9ff8ed1fb7/image/i611737c436fe6c2f/version/1754500518/image.jpg"],
      description: "Ein Stück Natur für die Ewigkeit - In Handarbeit aus Silber hergestellte Hortensienblüten mit wunderschönen Mondsteinkugeln. Gewicht pro Ohrring: 1,10 g leicht",
      inStock: true,
      sku: "OHR-A90",
      dimensions: "Hortensienblüte klein",
      material: "Silber 925"
    },
    {
      name: "Hortensienblüten-Ohrringe Stecker mit Edelsteinperlen (Chrysokoll/Rubin) aus Silber Nr. A88",
      price: "79.00",
      imageUrls: ["https://image.jimcdn.com/app/cms/image/transf/dimension=800x800/path/s10438f9ff8ed1fb7/image/icdf649d08fb4dc44/version/1754328661/image.jpg"],
      description: "Ein Stück Natur für die Ewigkeit - In Handarbeit aus Silber hergestellte Hortensienblüten mit wunderschönen Edelsteinperlen (Chrysokoll/Rubin).",
      inStock: true,
      sku: "OHR-A88",
      dimensions: "Hortensienblüte",
      material: "Silber 925"
    }
  ],

  "ringe": [
    {
      name: "Blattskelett Ring mit Schneckenhäuschen aus Sterlingsilber, Grössenverstellbar Nr. A94",
      price: "88.00",
      imageUrls: ["https://image.jimcdn.com/app/cms/image/transf/dimension=800x800/path/s10438f9ff8ed1fb7/image/i3b68ae11aa2cbcce/version/1754501485/image.jpg"],
      description: "Von Hand hergestellter Ring aus Silber. Darin eingearbeitet sind die Adern eines Blattes und obendrauf thront ein kleines Schneckenhäuschen. Alles aus 925er Sterlingsilber. Der Ring ist grössenverstellbar",
      inStock: true,
      sku: "RING-A94",
      dimensions: "Grössenverstellbar",
      material: "Sterlingsilber 925"
    },
    {
      name: "Ring Tautropfen aus Sterlingsilber und Mondsteinkugel, Grösse 16/56, Nr. A85",
      price: "89.00",
      imageUrls: ["https://image.jimcdn.com/app/cms/image/transf/dimension=800x800/path/s10438f9ff8ed1fb7/image/i05f5562a9ee9f85c/version/1714478911/image.jpg"],
      description: "Von Hand geschmiedeter Ring mit dem kleinen Tautropfen aus Mondstein daran. Der Ring ist aus recyceltem Silber, der Tautropfen aus einer Mondsteinperle. Grösse 16/56",
      inStock: true,
      sku: "RING-A85",
      dimensions: "Grösse 16/56",
      material: "Sterlingsilber 925"
    },
    {
      name: "Schneckenhäuschen-Ring aus Sterlingsilber, Nr. 1508",
      price: "58.00",
      imageUrls: ["https://image.jimcdn.com/app/cms/image/transf/dimension=800x800/path/s10438f9ff8ed1fb7/image/i70fe8b230b217991/version/1732467413/image.jpg"],
      description: "Von Hand hergestellter Ring aus Silber mit einem kleinen Schneckenhäuschen obendrauf. Alles aus 925er Sterlingsilber. Ringgrösse: 57/17, Grösse des Schneckenhäuschens: 10x7 mm",
      inStock: true,
      sku: "RING-1508",
      dimensions: "57/17, Schneckenhäuschen 10x7 mm",
      material: "Sterlingsilber 925"
    },
    {
      name: "Fernweh - Rosenblüten-Ring aus Sterlingsilber, Grösse 15/55, Nr. A17",
      price: "110.00",
      imageUrls: ["https://image.jimcdn.com/app/cms/image/transf/dimension=800x800/path/s10438f9ff8ed1fb7/image/i7dc2a584f4850bf8/version/1738166398/image.jpg"],
      description: "Von Hand hergestellter Ring aus Silber mit der Botschaft \"Fernweh\" und in seiner Mitte eine Glasklare Kugel gegossen aus Kunstharz mit einer winzigen Rosenblüte darin. Alles Handgearbeitet, der Ring ist aus 925er Sterlingsilber geschmiedet. Ringgrösse: 15/55, Grösse der Kugel: ca. 8 mm",
      inStock: true,
      sku: "RING-A17",
      dimensions: "15/55, Kugel 8 mm",
      material: "Sterlingsilber 925"
    }
  ],

  "armbaender": [
    {
      name: "Der kleine Fuchs mit Opaledelstein, aus Silber 925 an einem geknüpften Makrameebändeli, Nr. A84",
      price: "55.00",
      imageUrls: ["https://image.jimcdn.com/app/cms/image/transf/dimension=800x800/path/s10438f9ff8ed1fb7/image/i9a8d169686ad937c/version/1754061781/image.jpg"],
      description: "Der kleine Fuchs mit seinem dritten Auge aus einem Opaledelsteinchen ist handgefertigt aus Silber 925. Das Makrameebändeli ist handgeknüpft und grössenverstellbar.",
      inStock: true,
      sku: "ARM-A84",
      dimensions: "Grössenverstellbar",
      material: "Silber 925"
    },
    {
      name: "Vergissmeinnicht - handgemachter kleiner Anhänger mit Vergissmeinnicht an einem silberfarbenen Armband, Nr. A43",
      price: "38.00",
      imageUrls: ["https://image.jimcdn.com/app/cms/image/transf/dimension=800x800/path/s10438f9ff8ed1fb7/image/ie045b7140e9dc892/version/1742227933/image.jpg"],
      description: "Vergissmeinnichtblüte in Kunstharz eingegossen und zu einem Cabochonstein verarbeitet. Die Fassung ist aus Silber, das Armband aus Messing mit silberfarbener Legierung. Das Armbändchen ist grössenverstellbar. Gesamtlänge 22,5 cm.",
      inStock: false,
      sku: "ARM-A43",
      dimensions: "22,5 cm",
      material: "Messing versilbert"
    },
    {
      name: "Wünsch dir was Pusteblumenschirmchen Armband (mit Schiebeknoten), Nr. 1486",
      price: "29.00",
      imageUrls: ["https://image.jimcdn.com/app/cms/image/transf/dimension=800x800/path/s10438f9ff8ed1fb7/image/ib6dc0dc37cb2539b/version/1730653322/image.jpg"],
      description: "Ein Pusteblumenschirmchen in Kunstharz eingegossen und zu einem Armband verarbeitet. Die Fassung ist aus Bronze und an einem schwarzen Bändchen festgemacht. Das Armbändchen ist grössenverstellbar.",
      inStock: false,
      sku: "ARM-1486",
      dimensions: "Grössenverstellbar",
      material: "Bronze"
    },
    {
      name: "Glücksbringer Armband, Nr. A41",
      price: "52.00",
      imageUrls: ["https://image.jimcdn.com/app/cms/image/transf/dimension=800x800/path/s10438f9ff8ed1fb7/image/ie11a4e9c7d6f3132/version/1741191843/image.jpg"],
      description: "Versilbertes Glücksbringerarmband mit Vergissmeinnicht, Elefant, Hufeisen, kleiner Pfeil, Blume, Biene und Blatt. Länge 17 cm, Messing mit 999er Silber versilbert",
      inStock: true,
      sku: "ARM-A41",
      dimensions: "17 cm",
      material: "Messing versilbert"
    },
    {
      name: "BÄRENSTARK - Mutmacher, handgemachter kleiner Bär aus Silber, mit Opalstein an einem Makrameebändeli, Nr. 1404",
      price: "71.00",
      imageUrls: ["https://image.jimcdn.com/app/cms/image/transf/dimension=800x800/path/s10438f9ff8ed1fb7/image/i23c5e1ab72900ee2/version/1717350296/image.jpg"],
      description: "BÄRENSTARK, unser mutmacher Schmuckstück. Handgearbeiteter kleiner Bär aus 925er Sterlingsilber mit eingearbeitetem Opalsteinchen und ganz fein eingehämmerter Mond und Stern. Das Makrameebändeli ist grössenverstellbar.",
      inStock: true,
      sku: "ARM-1404",
      dimensions: "Grössenverstellbar",
      material: "Sterlingsilber 925"
    }
  ]
};

async function importAllProducts() {
  const baseUrl = 'http://localhost:5000';
  let totalImported = 0;

  console.log('🚀 Starting complete product import from Glanzbruch...');

  // Login to get admin token
  console.log('🔑 Getting admin authentication...');
  const loginResponse = await fetch(`${baseUrl}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: 'glanzbruch',
      password: 'admin2025'
    })
  });

  if (!loginResponse.ok) {
    throw new Error('Failed to authenticate');
  }

  const { token } = await loginResponse.json();
  console.log('✅ Authentication successful');

  // Import products for each category
  for (const [category, products] of Object.entries(ALL_PRODUCTS)) {
    console.log(`\n📦 Importing ${category} (${products.length} products)...`);
    
    for (const productData of products) {
      try {
        // Check if product already exists
        const existingResponse = await fetch(`${baseUrl}/api/products`);
        const existingProducts = await existingResponse.json();
        const exists = existingProducts.some(p => p.sku === productData.sku);
        
        if (exists) {
          console.log(`  ⏭️ Skipping ${productData.name} - already exists`);
          continue;
        }

        console.log(`  🔄 Importing: ${productData.name}`);

        // Download and upload images to Object Storage
        const imageUrls = [];
        for (let i = 0; i < productData.imageUrls.length; i++) {
          const imageUrl = productData.imageUrls[i];
          const filename = `${productData.sku}_${i + 1}.jpg`;
          
          try {
            // Upload image to Object Storage
            const uploadResponse = await fetch(`${baseUrl}/api/admin/upload-image`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
              },
              body: JSON.stringify({ imageUrl, filename })
            });
            
            if (uploadResponse.ok) {
              const { localPath } = await uploadResponse.json();
              imageUrls.push(localPath);
              console.log(`    ✅ Image ${i + 1}/${productData.imageUrls.length} uploaded`);
            } else {
              console.log(`    ❌ Failed to upload image ${i + 1}`);
            }
          } catch (imageError) {
            console.log(`    ❌ Image upload error: ${imageError.message}`);
          }
        }

        if (imageUrls.length === 0) {
          console.log(`    ⚠️ No images uploaded for ${productData.name}, skipping`);
          continue;
        }

        // Create product in database using admin endpoint
        const createResponse = await fetch(`${baseUrl}/api/admin/products`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: productData.name,
            description: productData.description,
            price: productData.price,
            category: category,
            imageUrls,
            sku: productData.sku,
            inStock: productData.inStock,
            stockQuantity: productData.inStock ? 1 : 0,
            material: productData.material,
            dimensions: productData.dimensions,
            artisan: "Glanzbruch Atelier",
            tags: ["handmade", "imported", category],
            metadata: JSON.stringify({
              originalUrl: `https://www.glanzbruch.ch/onlineshop/${category}/`,
              importDate: new Date().toISOString(),
            }),
          })
        });

        if (createResponse.ok) {
          const product = await createResponse.json();
          console.log(`    ✅ Successfully created: ${product.name}`);
          totalImported++;
        } else {
          console.log(`    ❌ Failed to create product: ${await createResponse.text()}`);
        }

      } catch (error) {
        console.log(`    ❌ Error importing ${productData.name}: ${error.message}`);
      }
    }
  }

  console.log(`\n🎉 Import complete! Successfully imported ${totalImported} products`);
  return { success: true, totalImported, categories: Object.keys(ALL_PRODUCTS).length };
}

// Export for use in other modules
export { importAllProducts, ALL_PRODUCTS };

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  importAllProducts().catch(console.error);
}