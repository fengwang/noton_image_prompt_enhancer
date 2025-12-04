import fs from "fs";
import compression from "compression";
import cors from "cors";
import express, { Request, Response } from "express";
import path from "path";
import { fileURLToPath } from "url";
import { enhance } from "./llmClient.js";

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(compression());

app.post("/api/enhance", async (req: Request, res: Response) => {
  const { prompt, baseUrl, model, apiKey } = req.body ?? {};

  if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
    return res.status(400).json({ error: "Missing prompt" });
  }

  try {
    const enhanced = await enhance(prompt, { baseUrl, model, apiKey });
    return res.json({ enhanced });
  } catch (err) {
    console.error("Failed to enhance prompt", err);
    const message = err instanceof Error ? err.message : "Unable to enhance prompt";
    return res.status(500).json({ error: message });
  }
});

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const clientDir = path.resolve(__dirname, "../client");
const indexFile = path.join(clientDir, "index.html");
const hasBuiltClient = fs.existsSync(indexFile);

if (hasBuiltClient) {
  app.use(express.static(clientDir));
  app.get("*", (_req, res) => {
    res.sendFile(indexFile);
  });
} else {
  app.get("/", (_req, res) => {
    res.json({ status: "ok", message: "Build frontend with npm run build to serve static assets." });
  });
}

const port = Number(process.env.PORT ?? process.env.PROMPT_ENHANCER_PORT ?? 8501);
app.listen(port, () => {
  console.log(`Image Prompt Enhancer listening on port ${port}`);
});
