import { spawn } from 'child_process';
import path from 'path';

console.log('🚀 Starting RecoverAI Full Unified Stack...\n');

// 1. Start Python FastAPI ML Engine (Port 8000)
console.log('📦 Launching Python FastAPI ML Engine on http://localhost:8000...');
const mlProcess = spawn('python', ['-m', 'uvicorn', 'ml_service.main:app', '--host', '0.0.0.0', '--port', '8000'], {
  stdio: 'inherit',
  shell: true
});

// 2. Start Express Backend API & Webhooks (Port 3001)
console.log('⚡ Launching Express Backend Server on http://localhost:3001...');
const serverProcess = spawn('node', ['server/index.js'], {
  stdio: 'inherit',
  shell: true
});

// 3. Start Vite Frontend App (Port 5173)
console.log('🎨 Launching Vite Frontend App on http://localhost:5173...');
const viteProcess = spawn('npx', ['vite'], {
  stdio: 'inherit',
  shell: true
});

process.on('SIGINT', () => {
  console.log('\nStopping all RecoverAI processes...');
  mlProcess.kill();
  serverProcess.kill();
  viteProcess.kill();
  process.exit();
});
