import express, { Express, NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import jwt, { VerifyCallback } from "jsonwebtoken";
import cookieParser from "cookie-parser";
import SgidClient from "@opengovsg/sgid-client";

const dummyDatabase: Record<
  string,
  { sub: string; data: Record<string, string> }
> = {};

dotenv.config();

const app: Express = express();

const port = process.env.PORT;

const clientId = process.env.SGID_CLIENT_ID ?? "";
const clientSecret = process.env.SGID_CLIENT_SECRET ?? "";
const privateKey = process.env.SGID_PRIVATE_KEY ?? "";
const redirectUri = process.env.SGID_REDIRECT_URI ?? "";

const state = "thisIsAState";
const nonce = "thisIsANonce";
const secret = "thisIsASecret";

const sgidClient = new SgidClient({
  clientId,
  clientSecret,
  privateKey,
  redirectUri,
});

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());

app.get("/api", (req: Request, res: Response) => {
  res.json({ body: "Hello World!" });
});

app.get("/api/authorization-url", (req: Request, res: Response) => {
  res.json(sgidClient.authorizationUrl(state, "openid myinfo.name", nonce));
});

app.get("/api/callback", async (req: Request, res: Response) => {
  const { code } = req.query;

  try {
    if (typeof code !== "string") {
      throw new Error("[code] query param must be provided");
    }

    const { accessToken } = await sgidClient.callback(code, nonce);

    const data = await sgidClient.userinfo(accessToken);
    const token = jwt.sign(data, secret, {
      expiresIn: 86400,
    });

    dummyDatabase[token] = data;

    res
      .cookie("authToken", token, {
        httpOnly: true,
      })
      .json(data);
  } catch (error) {
    res
      .status(400)
      .send(error instanceof Error ? error.message : "An error has occurred");
  }
});

function verifyToken(req: Request, res: Response, next: NextFunction) {
  const { authToken } = req.cookies;
  const verifyCallback: VerifyCallback = function (err) {
    if (err) {
      return res
        .status(401)
        .send(
          "Authentication failed. Please return to the home page to sign in"
        );
    }

    next();
  };

  jwt.verify(authToken, secret, verifyCallback);
}

app.get("/api/whoami", verifyToken, (req: Request, res: Response) => {
  const { authToken } = req.cookies;
  const userData = dummyDatabase[authToken];
  if (!userData) {
    res.status(400).send("User does not exist in database");
  }

  res.json(userData);
});

app.get(
  "/api/protected-message",
  verifyToken,
  (req: Request, res: Response) => {
    res.send({ message: "You look handsome/beautiful today <3" });
  }
);

app.post("/api/logout", verifyToken, (req: Request, res: Response) => {
  const { authToken } = req.cookies;
  delete dummyDatabase[authToken];
  res.clearCookie("authToken");

  res.send({ message: "Logged out" });
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is ru❤️nning at http://localhost:${port}`);
});
