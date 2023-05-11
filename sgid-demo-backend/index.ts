// SDK imports
import { SgidClient } from "@opengovsg/sgid-client";

// Other imports
import express, { Express } from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";
import { store } from "./store";

dotenv.config();

// Replace the values below with your own client credentials
const sgidClient = new SgidClient({
  clientId: String(process.env.SGID_CLIENT_ID),
  clientSecret: String(process.env.SGID_CLIENT_SECRET),
  privateKey: String(process.env.SGID_PRIVATE_KEY).replace(/\\n/g, "\n"),
  redirectUri: "http://localhost:3000/api/callback",
});

const app: Express = express();

app.use(
  cors({ origin: "http://localhost:5173", credentials: true, methods: "GET" })
);
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Hello from sgID");
});

app.get("/api/auth-url", (req, res) => {
  const { icecream: state } = req.query;

  // Generate a session ID
  const sessionId = uuidv4();

  // Store the state in memory
  const memoryObject = { state: String(state) };
  store.set(sessionId, memoryObject);

  // Generate an authorization URL
  const { url } = sgidClient.authorizationUrl(
    String(state),
    "openid myinfo.name",
    null
  );

  // Set the session ID in the browser's cookies
  res.cookie("sessionId", sessionId);
  res.cookie("sessionId", sessionId, { domain: "localhost:5173" });

  // Return the authorization URL (i.e. QR code page)
  res.json({ url });
});

app.get("/api/callback", async (req, res) => {
  const { state } = req.query;

  // Retrieve the authorization code from the query params
  const code = req.query.code;
  if (!code) {
    return res.send(400);
  }

  // Retrieve the session ID from the browser's cookies
  const { sessionId } = req.cookies;

  // Retrieve the code verifier from memory using the session ID
  const memoryObject = store.get(sessionId);
  if (!memoryObject?.state) {
    return res.send(400);
  }
  const { state: storedState } = memoryObject;

  if (state !== storedState) {
    console.error("State does not match stored state");
    return res.send(400);
  }

  // Exchange the auth code for the access token
  const { accessToken } = await sgidClient.callback(String(code));

  // Store the access token in memory
  const newMemoryObject = { ...memoryObject, accessToken };
  store.set(sessionId, newMemoryObject);
  res.redirect("http://localhost:5173/logged-in");
});

app.get("/api/userinfo", async (req, res) => {
  // Retrieve the session ID from the browser's cookies
  const { sessionId } = req.cookies;
  if (!sessionId) {
    console.error("No session ID found");
    return res.send(400);
  }

  // Retrieve the access token from memory using the session ID
  const memoryObject = store.get(sessionId);
  if (!memoryObject?.accessToken) {
    console.error("No access token found");
    return res.send(400);
  }
  const { accessToken, state } = memoryObject;

  // Request the userinfo using the access token
  const data = await sgidClient.userinfo(accessToken);

  // Return the user data
  res.json({ ...data, data: { ...data.data, iceCream: state } });
});

app.listen(3000, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:3000`);
});
