const { Server } = require('node-osc');
const { WebSocketServer } = require('ws');
const { initializeApp } = require('firebase/app');
const { getDatabase, ref, set, update } = require('firebase/database');

// Configuration
const OSC_PORT = 53001;
const WS_PORT = 8081;

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyCbhWOj-6nbiEDsXmgcDhXEjI0u1iqZWgE",
    authDomain: "listening-not-found.firebaseapp.com",
    databaseURL: "https://listening-not-found-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "listening-not-found",
    storageBucket: "listening-not-found.firebasestorage.app",
    messagingSenderId: "659911475972",
    appId: "1:659911475972:web:561ad1ee64e3b5ccd94651"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Start OSC Server
const oscServer = new Server(OSC_PORT, '0.0.0.0', () => {
  console.log(`[OSC] Listening on port ${OSC_PORT}`);
});

// Start WebSocket Server
const wss = new WebSocketServer({ port: WS_PORT });
console.log(`[WS] Server started on port ${WS_PORT}`);

wss.on('connection', (ws) => {
  console.log('[WS] Client connected');
  ws.send(JSON.stringify({ type: 'info', message: 'Connected to OSC Bridge' }));
});

// Forward OSC to WebSockets and handle commands
oscServer.on('message', (msg) => {
  const [address, ...args] = msg;
  const lowerAddress = address.toLowerCase();
  const timestamp = new Date().toISOString();
  
  console.log(`[OSC] Received: ${address} ${args}`);
  
  // Forward to monitor
  const payload = JSON.stringify({
    type: 'osc',
    timestamp,
    address,
    args
  });

  wss.clients.forEach((client) => {
    if (client.readyState === 1) { // OPEN
      client.send(payload);
    }
  });

  // --- COMMAND HANDLING ---

  // Handle /color command
  if (lowerAddress === '/color' && args.length > 0) {
    let colorVal = args[0];
    let colorStr;

    // Handle case where OSC client sends hex as a number (e.g. 000000 -> 0)
    if (typeof colorVal === 'number') {
      // Convert to hex and pad with zeros to 6 chars
      colorStr = colorVal.toString(16).padStart(6, '0');
    } else {
      colorStr = String(colorVal).trim();
    }

    // Ensure # prefix
    if (!colorStr.startsWith('#')) {
      colorStr = '#' + colorStr;
    }

    // Validate hex format
    if (/^#[0-9A-F]{6}$/i.test(colorStr)) {
      console.log(`[FIREBASE] Setting color to ${colorStr}`);
      set(ref(db, 'config/color'), colorStr.toUpperCase())
        .catch(err => console.error('[FIREBASE] Error updating color:', err));
    } else {
      console.warn(`[OSC] Invalid color format received: ${colorStr} (Original: ${colorVal})`);
    }
  }

  // Handle /bassoon command
  if (lowerAddress === '/bassoon' && args.length > 0) {
    const val = parseInt(args[0]) === 1 ? 'bassoon' : 'contrabassoon';
    console.log(`[FIREBASE] Setting pos3 to ${val}`);
    set(ref(db, 'config/instruments/pos3'), val);
  }

  // Handle /drumset command
  if (lowerAddress === '/drumset' && args.length > 0) {
    const val = parseInt(args[0]) === 1 ? 'drumset' : 'percussion';
    console.log(`[FIREBASE] Setting pos4 to ${val}`);
    set(ref(db, 'config/instruments/pos4'), val);
  }

  // Handle /piano command
  if (lowerAddress === '/piano' && args.length > 0) {
    const val = parseInt(args[0]) === 1 ? 'piano' : 'theremin';
    console.log(`[FIREBASE] Setting pos5 to ${val}`);
    set(ref(db, 'config/instruments/pos5'), val);
  }

  // Handle /bassoonOp command
  if (lowerAddress === '/bassoonop' && args.length > 0) {
    const isVisible = parseInt(args[0]) !== 0;
    console.log(`[FIREBASE] Setting Rodrigo visibility to ${isVisible}`);
    set(ref(db, 'config/instruments/rodrigoVisible'), isVisible);
  }

  // Handle /pianoOp command
  if (lowerAddress === '/pianoop' && args.length > 0) {
    const isVisible = parseInt(args[0]) !== 0;
    console.log(`[FIREBASE] Setting Valentina visibility to ${isVisible}`);
    set(ref(db, 'config/instruments/valentinaVisible'), isVisible);
  }

  // Handle /drumsetOp command
  if (lowerAddress === '/drumsetop' && args.length > 0) {
    const isVisible = parseInt(args[0]) !== 0;
    console.log(`[FIREBASE] Setting Vitalia visibility to ${isVisible}`);
    set(ref(db, 'config/instruments/vitaliaVisible'), isVisible);
  }

  // Handle /fluteOp command
  if (lowerAddress === '/fluteop' && args.length > 0) {
    const isVisible = parseInt(args[0]) !== 0;
    console.log(`[FIREBASE] Setting Giusy visibility to ${isVisible}`);
    set(ref(db, 'config/instruments/giusyVisible'), isVisible);
  }

  // Handle /violinOp command
  if (lowerAddress === '/violinop' && args.length > 0) {
    const isVisible = parseInt(args[0]) !== 0;
    console.log(`[FIREBASE] Setting Bahar visibility to ${isVisible}`);
    set(ref(db, 'config/instruments/baharVisible'), isVisible);
  }

  // Handle /start command
  if (lowerAddress === '/start' && args.length > 0) {
    const startVal = parseInt(args[0]);
    if (startVal === 1) {
      console.log('[FIREBASE] Starting Sequence (Section 2)');
      set(ref(db, 'sequence'), {
        currentIndex: 1,
        startTime: Date.now(),
        isRunning: true
      });
    } else if (startVal === 0) {
      console.log('[FIREBASE] Resetting Sequence and Instruments (Positions only)');
      set(ref(db, 'sequence'), {
        currentIndex: 0,
        startTime: 0,
        isRunning: false
      });
      set(ref(db, 'config/instruments/pos3'), 'bassoon');
      set(ref(db, 'config/instruments/pos4'), 'drumset');
      set(ref(db, 'config/instruments/pos5'), 'piano');
      set(ref(db, 'config/color'), '#000000');
    }
  }

  // Handle Section Loading Commands (lowercase slugs)
  const sectionSlugs = [
    'entryloop', 'activation', 'exploratoryfield', 'latentspacewalk', 
    'orbitaldeepfake', 'ghosttakeover', 'digitalerror', 'void', 
    'virtualrain', 'lyricstream', 'gearnetwork', 'memoryleak', 
    'ghostswarm', 'postdigitaltempest', 'buffererror', 'resonator', 
    'micro', 'uploadascension'
  ];

  const sectionIndex = sectionSlugs.indexOf(lowerAddress.replace('/', ''));
  if (sectionIndex !== -1) {
    console.log(`[FIREBASE] Loading Section ${sectionIndex + 1}: ${sectionSlugs[sectionIndex]}`);
    set(ref(db, 'sequence'), {
      currentIndex: sectionIndex,
      startTime: 0,
      isRunning: false
    });
  }

  // Handle /startagain command
  if (lowerAddress === '/startagain') {
    console.log('[FIREBASE] Starting/Resuming Sequence via /startagain');
    update(ref(db, 'sequence'), {
      startTime: Date.now(),
      isRunning: true
    });
  }
});

process.on('SIGINT', () => {
  oscServer.close();
  wss.close();
  process.exit();
});
