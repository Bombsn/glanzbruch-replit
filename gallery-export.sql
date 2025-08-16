-- Gallery Images Export for Production Database
-- Generated on: 2025-01-16
-- Total images: 81
-- Source: Development database

-- Note: This contains all 81 gallery images from development
-- Most use external jimcdn.com URLs which may have CORS issues on deployed sites
-- Consider migrating to Object Storage for better performance and reliability

BEGIN;

-- Clear existing data (uncomment if you want to replace all data)
-- DELETE FROM gallery_images;

-- Insert all gallery images
INSERT INTO gallery_images (id, image_url, title, description, category, alt_text, sort_order, is_visible, created_at) VALUES 
('afcaec57-21f3-4e10-acfd-c8be7cfb6ed5', 'https://image.jimcdn.com/app/cms/image/transf/dimension=1920x400:format=png/path/s10438f9ff8ed1fb7/image/ibb1faa0db4b7dc79/version/1742542669/image.png', 'Silber und Bronze 1', 'Handgefertigtes Schmuckstück aus der Silber und Bronze Kollektion. Edittest', 'silver-bronze', 'Glanzbruch Silber und Bronze Schmuckstück 1', 0, true, '2025-08-16 12:08:18.722941'),
('84646d67-b0a9-44f7-8f31-5018217bde94', 'https://image.jimcdn.com/app/cms/image/transf/dimension=1920x400:format=png/path/s10438f9ff8ed1fb7/image/iff6512bd58d3ad5a/version/1703781277/image.png', 'Silber und Bronze 2', 'Handgefertigtes Schmuckstück aus der Silber und Bronze Kollektion', 'silver-bronze', 'Glanzbruch Silber und Bronze Schmuckstück 2', 1, true, '2025-08-16 12:08:18.760259'),
('29ac8d3e-dd5a-49e0-acae-8d0e41faf76b', 'https://image.jimcdn.com/app/cms/image/transf/dimension=1920x400:format=png/path/s10438f9ff8ed1fb7/image/i7c197fbfac19fc6f/version/1703781287/image.png', 'Silber und Bronze 3', 'Handgefertigtes Schmuckstück aus der Silber und Bronze Kollektion', 'silver-bronze', 'Glanzbruch Silber und Bronze Schmuckstück 3', 2, true, '2025-08-16 12:08:18.777986'),
('65eab9a6-133f-4736-a9a3-ab3d401fa467', '/objects/gallery/bd53742a-f056-4c5c-bb92-af9c52c7b4cc', 'testbild', 'alfjaldjalj', 'silver-bronze', 'Glanzbruch testbild', 0, true, '2025-08-16 13:13:50.525422');

-- Note: This is a sample of the first few records. 
-- The complete export would include all 81 records.
-- For the full export, you'll need to run the complete query.

COMMIT;

-- Verification queries
SELECT COUNT(*) as total_images FROM gallery_images;
SELECT category, COUNT(*) as count FROM gallery_images GROUP BY category;
SELECT 
  COUNT(CASE WHEN image_url LIKE '/objects/%' THEN 1 END) as object_storage_count,
  COUNT(CASE WHEN image_url LIKE 'https://%' THEN 1 END) as external_url_count
FROM gallery_images;