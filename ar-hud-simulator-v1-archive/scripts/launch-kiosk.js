const { exec, spawn } = require('child_process');
const os = require('os');

const port = 5173;
const url = `http://localhost:${port}`;

console.log('\n🚀 Starting AR HUD Simulator in Kiosk Mode...\n');

const vite = spawn('npx', ['vite', '--port', port, '--host'], {
  stdio: 'inherit',
  shell: true,
});

setTimeout(() => {
  const platform = os.platform();
  let cmd;

  if (platform === 'darwin') {
    cmd = `open -na "Google Chrome" --args --kiosk --app=${url}`;
  } else if (platform === 'win32') {
    cmd = `start chrome --kiosk --app=${url}`;
  } else {
    cmd = `google-chrome --kiosk --app=${url} 2>/dev/null || chromium --kiosk --app=${url}`;
  }

  exec(cmd, (err) => {
    if (err) {
      console.log('⚠️  Could not launch Chrome automatically.');
      console.log(`📌 Open this URL manually in fullscreen: ${url}\n`);
    }
  });
}, 2500);

process.on('SIGINT', () => {
  vite.kill();
  process.exit();
});
