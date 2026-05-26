const c = {
  cyan:  '\x1b[36m',
  green: '\x1b[32m',
  yellow:'\x1b[33m',
  reset: '\x1b[0m',
  bold:  '\x1b[1m',
};

console.log(`
${c.cyan}${c.bold}
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║      █████╗ ██████╗     ██╗  ██╗██╗   ██╗██████╗         ║
║     ██╔══██╗██╔══██╗    ██║  ██║██║   ██║██╔══██╗        ║
║     ███████║██████╔╝    ███████║██║   ██║██║  ██║        ║
║     ██╔══██║██╔══██╗    ██╔══██║██║   ██║██║  ██║        ║
║     ██║  ██║██║  ██║    ██║  ██║╚██████╔╝██████╔╝        ║
║     ╚═╝  ╚═╝╚═╝  ╚═╝    ╚═╝  ╚═╝ ╚═════╝ ╚═════╝         ║
║                                                           ║
║       ${c.green}AUGMENTED REALITY HEAD-UP DISPLAY${c.cyan}                  ║
║                ${c.green}SIMULATOR v1.0.0${c.cyan}                          ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
${c.reset}
${c.green}  ➜  Initializing simulation environment...${c.reset}
${c.yellow}  ➜  Run 'npm run kiosk' for fullscreen experience${c.reset}
`);
