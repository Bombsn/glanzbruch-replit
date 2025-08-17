// Simple Node.js starter script
process.env.NODE_ENV = 'development';
process.env.PORT = '3000';

console.log('Starting development server...');
console.log('Environment:', process.env.NODE_ENV);
console.log('Port:', process.env.PORT);

// Import and run the server
import('./index.ts').catch(console.error);
