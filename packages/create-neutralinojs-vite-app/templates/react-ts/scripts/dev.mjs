import { createServer } from 'node:net';
import { readFileSync, writeFileSync } from 'node:fs';
import { spawn } from 'node:child_process';

function findFreePort(startPort) {
  return new Promise((resolve) => {
    const server = createServer();
    server.listen(startPort, () => {
      const port = server.address().port;
      server.close(() => resolve(port));
    });
    server.on('error', () => {
      resolve(findFreePort(startPort + 1));
    });
  });
}

async function run() {
  const port = await findFreePort(5173);
  
  console.log(`\x1b[36m[create-neutralinojs-vite-app]\x1b[0m Starting dev server...`);
  console.log(`\x1b[36m[create-neutralinojs-vite-app]\x1b[0m Vite (React) will run on port: \x1b[32m${port}\x1b[0m`);
  console.log(`\x1b[36m[create-neutralinojs-vite-app]\x1b[0m Neutralinojs will connect to: \x1b[32mhttp://localhost:${port}\x1b[0m\n`);

  // Update neutralino config
  const configPath = 'neutralino.config.json';
  const config = JSON.parse(readFileSync(configPath, 'utf8'));
  if (config.cli.frontendLibrary.devUrl !== `http://localhost:${port}`) {
    config.cli.frontendLibrary.devUrl = `http://localhost:${port}`;
    writeFileSync(configPath, JSON.stringify(config, null, 2));
  }

  // Run vite and neu concurrently
  const child = spawn('npx', ['concurrently', `"vite --port ${port} --strictPort"`, `"neu run"`], {
    stdio: 'inherit',
    shell: true
  });

  child.on('exit', (code) => {
    process.exit(code || 0);
  });
}

run();
