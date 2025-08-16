import { storage } from '../server/storage.ts';
import { performance } from 'perf_hooks';

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
const categoryMapping = {
  'silver-bronze': 'Silber und Bronze',
  'nature': 'Haare, Asche, Blüten, etc.',
  'resin': 'Kunstharz',
  'worn': 'Tragebilder'
};

async function importGalleryImages() {
  console.log('🎨 Starting gallery import from Glanzbruch.ch...\n');
  const startTime = performance.now();
  
  let totalImported = 0;
  
  for (const [category, images] of Object.entries(galleryData)) {
    console.log(`📂 Processing ${categoryMapping[category]} (${images.length} images)`);
    
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
        
        // Progress indicator
        if ((i + 1) % 5 === 0 || i === images.length - 1) {
          process.stdout.write(`\r   ✓ ${i + 1}/${images.length} imported`);
        }
      } catch (error) {
        console.error(`\n   ❌ Failed to import image ${i + 1}:`, error.message);
      }
    }
    
    console.log('\n');
  }
  
  const endTime = performance.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);
  
  console.log(`🎉 Gallery import completed!`);
  console.log(`📊 Total images imported: ${totalImported}`);
  console.log(`⏱️  Duration: ${duration} seconds\n`);
  
  // Show category breakdown
  console.log('📋 Category breakdown:');
  for (const [category, images] of Object.entries(galleryData)) {
    console.log(`   ${categoryMapping[category]}: ${images.length} images`);
  }
}

// Run the import
importGalleryImages().catch(error => {
  console.error('❌ Gallery import failed:', error);
  process.exit(1);
});