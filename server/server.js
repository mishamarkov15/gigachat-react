const http = require("http");
const fs = require("fs");
const path = require("path");
const { randomUUID } = require("crypto");

const PORT = Number(process.env.PORT || 3001);
const ROOT_DIR = path.resolve(__dirname, "..");
const BUILD_DIR = path.join(ROOT_DIR, "build");

loadEnv(path.join(ROOT_DIR, ".env"));

if (process.env.GIGACHAT_REJECT_UNAUTHORIZED !== "true") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

const OAUTH_URL =
  process.env.GIGACHAT_OAUTH_URL ||
  "https://ngw.devices.sberbank.ru:9443/api/v2/oauth";
const API_BASE_URL =
  process.env.GIGACHAT_API_BASE_URL ||
  "https://gigachat.devices.sberbank.ru/api/v1";

let cachedToken = null;

const server = http.createServer(async (request, response) => {
  try {
    if (request.url === "/api/health") {
      sendJson(response, 200, { ok: true });
      return;
    }

    if (request.url === "/api/models" && request.method === "GET") {
      await handleModels(response);
      return;
    }

    if (request.url === "/api/chat/completions" && request.method === "POST") {
      await handleChat(request, response);
      return;
    }

    serveStatic(request, response);
  } catch (error) {
    sendJson(response, 500, {
      error: error instanceof Error ? error.message : "Unknown server error"
    });
  }
});

server.listen(PORT, () => {
  console.log(`GigaChat proxy is listening on http://localhost:${PORT}`);
});

function loadEnv(filePath) {
  if (!fs.existsSync(filePath)) {
    return;
  }

  const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim().replace(/^"|"$/g, "");
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

async function handleModels(response) {
  const token = await getAccessToken();
  const apiResponse = await fetch(`${API_BASE_URL}/models`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`
    }
  });

  const payload = await apiResponse.text();
  response.writeHead(apiResponse.status, {
    "Content-Type": apiResponse.headers.get("content-type") || "application/json"
  });
  response.end(payload);
}

async function handleChat(request, response) {
  const body = await readJson(request);
  const token = await getAccessToken();
  const apiResponse = await fetch(`${API_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      Accept: body.stream ? "text/event-stream" : "application/json",
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  const contentType = apiResponse.headers.get("content-type") || "";

  if (!apiResponse.ok) {
    const payload = await apiResponse.text();
    response.writeHead(apiResponse.status, {
      "Content-Type": contentType || "application/json"
    });
    response.end(payload);
    return;
  }

  if (body.stream && apiResponse.body) {
    response.writeHead(200, {
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "Content-Type": "text/event-stream; charset=utf-8"
    });

    const reader = apiResponse.body.getReader();
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      response.write(Buffer.from(value));
    }
    response.end();
    return;
  }

  const payload = await apiResponse.text();
  response.writeHead(200, {
    "Content-Type": contentType || "application/json"
  });
  response.end(payload);
}

async function getAccessToken() {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 30_000) {
    return cachedToken.value;
  }

  const authorizationKey = process.env.AUTHORIZATION_KEY;
  if (!authorizationKey) {
    throw new Error("AUTHORIZATION_KEY is not configured in .env");
  }

  const scope = process.env.SCOPE || "GIGACHAT_API_PERS";
  const oauthResponse = await fetch(OAUTH_URL, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Basic ${authorizationKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
      RqUID: process.env.CLIENT_ID || randomUUID()
    },
    body: new URLSearchParams({ scope })
  });

  const payload = await oauthResponse.json();
  if (!oauthResponse.ok) {
    throw new Error(payload.message || "Failed to receive GigaChat access token");
  }

  cachedToken = {
    value: payload.access_token,
    expiresAt: Number(payload.expires_at || Date.now() + 25 * 60 * 1000)
  };

  return cachedToken.value;
}

function readJson(request) {
  return new Promise((resolve, reject) => {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk;
    });
    request.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        reject(error);
      }
    });
    request.on("error", reject);
  });
}

function sendJson(response, status, payload) {
  response.writeHead(status, { "Content-Type": "application/json" });
  response.end(JSON.stringify(payload));
}

function serveStatic(request, response) {
  const indexPath = path.join(BUILD_DIR, "index.html");
  if (!fs.existsSync(indexPath)) {
    sendJson(response, 404, {
      error:
        "Frontend build was not found. Run npm run build or use npm start with the dev proxy."
    });
    return;
  }

  const urlPath = request.url === "/" ? "/index.html" : request.url || "/";
  const filePath = path.normalize(path.join(BUILD_DIR, urlPath));

  if (!filePath.startsWith(BUILD_DIR)) {
    sendJson(response, 403, { error: "Forbidden" });
    return;
  }

  const resolvedPath = fs.existsSync(filePath) ? filePath : indexPath;
  response.writeHead(200, { "Content-Type": getContentType(resolvedPath) });
  fs.createReadStream(resolvedPath).pipe(response);
}

function getContentType(filePath) {
  if (filePath.endsWith(".html")) return "text/html";
  if (filePath.endsWith(".js")) return "text/javascript";
  if (filePath.endsWith(".css")) return "text/css";
  if (filePath.endsWith(".json")) return "application/json";
  if (filePath.endsWith(".png")) return "image/png";
  if (filePath.endsWith(".ico")) return "image/x-icon";
  return "application/octet-stream";
}
