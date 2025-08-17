# Glanzbruch Gallery Project

A full-stack React application with Express backend for managing a photo gallery.

## Development Workflow

### 🚀 Quick Start (Recommended)
**For local development with Windsurf:**
1. Double-click `run-dev.bat` in Windows Explorer
2. Keep the terminal window open while developing
3. Visit http://localhost:3000
4. Make changes in Windsurf - server auto-restarts on file changes

### For Replit Development
1. The project is already configured to run on Replit
2. Environment variables are set in the `.env` file
3. Run with: `npm run dev` (uses port 5000)

### For Local Development (Alternative Methods)
1. **Auto-restart server:** `npm run dev:watch`
2. **Simple server:** `npm run dev:local`
3. **Robust server:** `npm run dev:server`
4. **Build for production:** `npm run build`
5. **Production server:** `npm run start:local`

## Environment Variables

The following environment variables are required:

- `DATABASE_URL`: PostgreSQL connection string (Neon database)
- `PGDATABASE`, `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`: Database connection details
- `SESSION_SECRET`: Secret key for session management
- `NODE_ENV`: Environment mode (development/production)
- `PORT`: Server port (5000 for Replit, 3000 for local)

## Available Scripts

- `npm run dev` - Development server for Replit (port 5000)
- `npm run dev:local` - Development server for local (port 3000)
- `npm run build` - Build for production
- `npm run start` - Production server for Replit
- `npm run start:local` - Production server for local
- `npm run db:push` - Push database schema changes
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Drizzle Studio

## Project Structure

- `client/` - React frontend application
- `server/` - Express backend server
- `shared/` - Shared TypeScript schemas
- `scripts/` - Database and utility scripts

## Technologies Used

- **Frontend**: React, TypeScript, Tailwind CSS, Radix UI
- **Backend**: Express.js, TypeScript
- **Database**: PostgreSQL (Neon), Drizzle ORM
- **Build Tools**: Vite, ESBuild
- **Development**: TSX for TypeScript execution
