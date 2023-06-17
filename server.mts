import http, { IncomingMessage, ServerResponse } from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { connectToDatabase, saveUser } from "public/db.js";

const server = http.createServer();
const PORT = 3000;
const connection = connectToDatabase();

const extentions: Record<string, string | undefined> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".js": "text/javascript",
  ".css": "text/css",
};

// ... existing request handlers ...

async function getIndex(req: IncomingMessage, res: ServerResponse) {
  const fileName: string = "./public/login.html";
  const login = await readFile(fileName);
  res.writeHead(200, {
      "Content-Type": "text/html"
  });
  res.end(login);
}

async function getRegisterRequest(req: IncomingMessage, res: ServerResponse) {
  const fileName: string = "./public/register.html";
  const register = await readFile(fileName);
  res.writeHead(200, {
      "Content-Type": "text/html"
  });
  res.end(register);
}

async function getTopRequest(req: IncomingMessage, res: ServerResponse) {
  const fileName: string = "./public/top.html";
  const top = await readFile(fileName);
  res.writeHead(200, {
      "Content-Type": "text/html"
  });
  res.end(top);
}

function isIndexRequest(req: IncomingMessage): boolean {
  return ((req.url === "/" || req.url === "/login") && req.method === "GET");
}

function isRegisterRequest(req: IncomingMessage): boolean {
  return (req.url === "/register" && req.method === "GET");
}

function isTopRequest(req: IncomingMessage): boolean {
  return (req.url === "/top" && req.method === "GET");
}

async function getStaticFiles(req: IncomingMessage, res: ServerResponse) {
  const filepath = path.resolve(path.join(".", req.url!))
  const type = extentions[path.extname(filepath)];
  if(!type) {
      res.statusCode = 404;
      res.end("Not Found.");
      return;
  }
  const content = await readFile(filepath);
  res.writeHead(200, {
      "Content-Type": type,
  });
  res.end(content);
}

function isStaticFileRequest(req: IncomingMessage): boolean {
  return (req.url?.startsWith("/public")! && req.method === "GET");
} 




async function postRegisterRequest(req: IncomingMessage, res: ServerResponse) {
  // Assuming the registration form data is sent in the request body
  let body = '';
  req.on('data', (chunk) => {
    body += chunk;
  });

  req.on('end', async () => {
    // Parse the form data (assuming it's in key-value format)
    const formData = new URLSearchParams(body);

    // Get the username and password from the form data
    const username = formData.get('username');
    const password = formData.get('password');

    if (!username || !password) {
      res.statusCode = 400;
      res.end('Invalid registration data');
      return;
    }

    try {
      // Save the user data to the database
      await saveUser(username, password);

      // Redirect the user to the top page or display a success message
      res.writeHead(302, { Location: '/top' });
      res.end();
    } catch (error) {
      console.error('Error saving user:', error);
      res.statusCode = 500;
      res.end('An error occurred');
    }
  });
}



// ... existing request handlers ...

server.on("request", async (req, res) => {
  try {
    if (isIndexRequest(req)) {
      await getIndex(req, res);
    } else if (isStaticFileRequest(req)) {
      await getStaticFiles(req, res);
    } else if (isRegisterRequest(req)) {
      await postRegisterRequest(req, res); // Changed to postRegisterRequest
    } else if (isTopRequest(req)) {
      await getTopRequest(req, res);
    } else {
      res.statusCode = 404;
      res.end("Not Found");
    }
  } catch (e) {
    console.error(e);
    res.statusCode = 500;
    if (e instanceof Error) {
      res.end(e.toString());
    } else {
      res.end('An error occurred');
    }
  }
});

server.listen(PORT, () => {
  console.log(`Listen on ` + PORT);
});
