// Development server wrapper that handles errors gracefully
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { config } from 'dotenv';

// Load environment variables from .env file
config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🚀 Starting Glanzbruch Development Server...');
console.log('📁 Project Directory:', __dirname);
console.log('🌐 Server will be available at: http://localhost:5000');
console.log('💡 Press Ctrl+C to stop\n');

// Set environment variables
process.env.NODE_ENV = 'development';
process.env.PORT = process.env.PORT || '5000';

console.log('🔍 Environment check:');
console.log('  NODE_ENV:', process.env.NODE_ENV);
console.log('  PORT:', process.env.PORT);
console.log('  DATABASE_URL:', process.env.DATABASE_URL ? 'SET' : 'NOT SET');

function startServer() {
  const serverProcess = spawn('npx', ['tsx', 'server/index.ts'], {
    cwd: __dirname,
    stdio: 'inherit',
    shell: true,
    env: { ...process.env }
  });

  serverProcess.on('error', (error) => {
    console.error('❌ Failed to start server:', error.message);
    console.log('🔄 Retrying in 3 seconds...');
    setTimeout(startServer, 3000);
  });

  serverProcess.on('exit', (code, signal) => {
    if (signal === 'SIGINT' || signal === 'SIGTERM') {
      console.log('\n👋 Server stopped by user');
      process.exit(0);
    } else if (code === 1) {
      console.log(`\n❌ Server failed to start (code ${code})`);
      console.log('🛑 Stopping auto-restart to prevent loop');
      console.log('💡 Check the error above and restart manually');
      process.exit(1);
    } else {
      console.log(`\n⚠️  Server exited with code ${code}`);
      console.log('🔄 Restarting in 3 seconds...');
      setTimeout(startServer, 3000);
    }
  });

  return serverProcess;
}

// Handle Ctrl+C gracefully
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down development server...');
  process.exit(0);
});

// Start the server
startServer();
