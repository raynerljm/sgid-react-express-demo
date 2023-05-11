// SDK imports
import { SgidClient } from "@opengovsg/sgid-client";

// Other imports
import express, { Express } from "express";
import dotenv from "dotenv"
import NodeCache from "node-cache";
import cookieParser from "cookie-parser";
import cors from "cors"
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

dotenv.config();

// Replace the values below with your own client credentials
const sgidClient = new SgidClient({
  clientId: String(process.env.SGID_CLIENT_ID),
  clientSecret: String(process.env.SGID_CLIENT_SECRET),
  privateKey: String(process.env.SGID_PRIVATE_KEY),
  redirectUri: "http://localhost:3000/api/callback",
});

const nodeCache = new NodeCache();

const app: Express = express();

app.use(cors())
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Hello from sgID");
});

app.get("/api/auth-url", (req, res) => {
  const { state } = req.query;

  // Generate a session ID
  const sessionId = uuidv4();

  // Store the state in memory
  const memoryObject = { state };
  nodeCache.set(sessionId, memoryObject);

  // Generate an authorization URL
  const { url } = sgidClient.authorizationUrl(
    String(state),
    "openid myinfo.name",
    null
  );

  // Set the session ID in the browser's cookies
  res.cookie("sessionId", sessionId, {sameSite:"none", domain:"http://localhost:5173"});

  // Redirect to the authorization URL (i.e. QR code page)
  // res.redirect(url);
  res.json({url})
});

app.get("/api/callback", async (req, res) => {
  const { state } = req.query;

  // Retrieve the authorization code from the query params
  let { code } = req.query;
  code = z.string().parse(code);

  // Retrieve the session ID from the browser's cookies
  const { sessionId } = req.cookies;

  // Retrieve the code verifier from memory using the session ID
  const memoryObject = nodeCache.take(sessionId);
  const parsedMemoryObject = z
    .object({ state: z.string() })
    .parse(memoryObject);
  const { state: storedState } = parsedMemoryObject;

  if (state !== storedState) {
    console.error("State does not match stored state");
    res.status(400);
  }

  // Exchange the auth code for the access token
  const { accessToken, sub } = await sgidClient.callback(code);

  // Store the access token in memory
  const newMemoryObject = { accessToken };
  nodeCache.set(sessionId, newMemoryObject);

  res.redirect("http://localhost:5173/logged-in");
});

app.get("/api/userinfo", async (req, res) => {
  // Retrieve the session ID from the browser's cookies
  const { sessionId } = req.cookies;

  // Retrieve the access token from memory using the session ID
  const memoryObject = nodeCache.take(sessionId);
  const parsedMemoryObject = z
    .object({ accessToken: z.string() })
    .parse(memoryObject);
  const { accessToken } = parsedMemoryObject;

  // Request the userinfo using the access token
  const data = await sgidClient.userinfo(accessToken);

  // Return the user data
  res.json(data);
});

app.listen(3000, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:3000`);
});
