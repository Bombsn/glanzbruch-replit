# Overview

This is a modern e-commerce web application for "Glanzbruch", a Swiss jewelry brand specializing in handcrafted unique pieces made with UV-resin, silver, and bronze. The application features a full-stack architecture with a React frontend and Express.js backend, designed to showcase and sell artisanal jewelry while also offering craft courses and custom commission services.

The application supports multiple product categories (necklace pendants, earrings, rings, bracelets), course bookings, custom commission requests, and includes a shopping cart system. The design emphasizes the magical, nature-inspired aesthetic of the brand with a warm color palette and elegant typography.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **Routing**: Wouter for client-side routing with pages for home, shop, courses, gallery, about, and contact
- **UI Framework**: Shadcn/ui components built on Radix UI primitives with Tailwind CSS for styling
- **State Management**: Zustand for shopping cart state management
- **Data Fetching**: TanStack Query (React Query) for server state management and caching
- **Forms**: React Hook Form with Zod validation for type-safe form handling
- **Styling**: Custom CSS variables for brand colors (forest green, gold, sage, cream, charcoal) with Playfair Display and Inter fonts

## Backend Architecture
- **Framework**: Express.js with TypeScript running on Node.js
- **API Design**: RESTful API structure with routes for products, courses, orders, course bookings, and commission requests
- **Development Setup**: Vite middleware integration for hot module replacement during development
- **Error Handling**: Centralized error handling middleware with proper HTTP status codes
- **Request Logging**: Custom middleware for API request logging with performance timing

## Data Storage Solutions
- **ORM**: Drizzle ORM with PostgreSQL dialect for type-safe database operations
- **Database**: PostgreSQL (configured for Neon Database via connection string)
- **Schema**: Well-defined tables for products, courses, orders, course bookings, and commission requests
- **Migrations**: Drizzle Kit for database schema migrations

## Authentication and Authorization
- **Current State**: No authentication system implemented yet
- **Session Management**: Basic session configuration present (connect-pg-simple) but not actively used
- **Security**: Basic CORS and request validation, but no user authentication or authorization

## External Dependencies
- **Database Hosting**: Neon Database (serverless PostgreSQL)
- **Image Hosting**: Real product images via database storage and admin interface
- **Payment Processing**: Stripe integration planned but not yet implemented
- **Email Service**: No email service currently integrated
- **Fonts**: Google Fonts for typography (Playfair Display, Inter, Dancing Script)
- **Icons**: Lucide React icons and React Icons for UI elements
- **Development Tools**: Replit-specific plugins for development environment integration

The architecture follows a clean separation of concerns with shared TypeScript types between frontend and backend, comprehensive error handling, and a scalable component structure. The application is designed for easy deployment and includes proper TypeScript configuration for both client and server code.

## Recent Changes (2025-08-28)
- **Complete Product Import System**: Implemented comprehensive import functionality for Kettenanhänger products
  - Full product import from current Glanzbruch website (https://www.glanzbruch.ch/onlineshop/einzelst%C3%BCcke-kunstharz/)
  - Automated image download and migration to Object Storage system
  - All 5 real Kettenanhänger products successfully imported with local image storage
  - Admin dashboard extended with dedicated Import tab for future imports
  - Image migration system for moving existing jimcdn.com URLs to local Object Storage
- **Object Storage Integration**: Complete object storage setup for image management
  - All product images now stored locally under `/public-objects/products/` paths
  - Independence from external jimcdn.com URLs ensures long-term stability
  - HTTP 200 responses confirmed for all imported product images
- **Import System Features**:
  - Duplicate detection prevents re-importing existing products
  - Comprehensive error handling and logging
  - Real-time import progress tracking in admin interface
  - Metadata tracking for import dates and source URLs