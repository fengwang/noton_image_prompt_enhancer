import { useEffect, useMemo, useState } from "react";
import { enhancePrompt } from "./lib/api";
import { detailOptions, mediumOptions, moodOptions, suggestionPrompts } from "./lib/constants";
import { DetailLevel, Medium, Mood, RefinementOptions } from "./types";

const defaultOptions: RefinementOptions = {
  detailLevel: "Layered",
  mood: "Dramatic",
  medium: "Cinematic"
};

function composePrompt(prompt: string, options: RefinementOptions): string {
  const modifiers = [
    `Detail level: ${options.detailLevel}`,
    `Mood: ${options.mood}`,
    `Visual style: ${options.medium}`
  ];

  return `${prompt.trim()}\n\nRefinement preferences: ${modifiers.join("; ")}`;
}

function App() {
  const [userPrompt, setUserPrompt] = useState<string>("");
  const [enhancedPrompt, setEnhancedPrompt] = useState<string>("");
  const [options, setOptions] = useState<RefinementOptions>(defaultOptions);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [baseUrl, setBaseUrl] = useState<string>("");
  const [model, setModel] = useState<string>("");
  const [apiKey, setApiKey] = useState<string>("");
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  const wordCount = useMemo(() => {
    if (!userPrompt.trim()) return 0;
    return userPrompt.trim().split(/\s+/).length;
  }, [userPrompt]);

  const charCount = useMemo(() => userPrompt.length, [userPrompt]);

  useEffect(() => {
    document.body.classList.toggle("theme-dark", theme === "dark");
    document.body.classList.toggle("theme-light", theme === "light");
  }, [theme]);

  const handleEnhance = async () => {
    if (!userPrompt.trim()) {
      setError("Add a prompt to enhance.");
      return;
    }

    setError(null);
    setCopied(false);
    setIsLoading(true);

    try {
      const promptWithGuidance = composePrompt(userPrompt, options);
      const payload = { prompt: promptWithGuidance, options };

      if (baseUrl.trim()) {
        Object.assign(payload, { baseUrl: baseUrl.trim() });
      }
      if (model.trim()) {
        Object.assign(payload, { model: model.trim() });
      }
      if (apiKey.trim()) {
        Object.assign(payload, { apiKey: apiKey.trim() });
      }

      const result = await enhancePrompt(payload);
      setEnhancedPrompt(result.enhanced);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to enhance prompt.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setUserPrompt("");
    setEnhancedPrompt("");
    setError(null);
    setCopied(false);
    setBaseUrl("");
    setModel("");
    setApiKey("");
  };

  const handleCopy = async () => {
    if (!enhancedPrompt) return;
    try {
      await navigator.clipboard.writeText(enhancedPrompt);
      setCopied(true);
    } catch (err) {
      console.error("Failed to copy", err);
      setCopied(false);
    }
  };

  const updateOption = <K extends keyof RefinementOptions>(key: K, value: RefinementOptions[K]) => {
    setOptions((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
        <header className="glass-card overflow-hidden relative">
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_rgba(124,93,255,0.25),transparent_40%)]" />
          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-3">
              <div className="badge">Prompt studio</div>
              <h1 className="text-3xl md:text-4xl font-bold font-display">Image Prompt Enhancer</h1>
              <p className="text-white/70 max-w-2xl text-base">
                Transform quick ideas into immersive, production-ready prompts. Keep the essentials visible, add depth only
                where it matters, and copy the final prompt in one click.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="badge">Context-aware refinement</span>
                <span className="badge">Cinematic + photographic controls</span>
                <span className="badge">Copy-ready output</span>
              </div>
            </div>
            <div className="glass-card border-white/10 p-4 rounded-2xl min-w-[260px] flex flex-col gap-3">
              <div className="card-title">
                <span className="text-accent1">⚡</span> Session status
              </div>
              <div className="text-sm text-white/70">Base URL, Model, and API key can be set per session below.</div>
              <div className="gradient-divider" />
              <div className="grid grid-cols-2 gap-2 text-xs text-white/60">
                <div className="bg-white/5 rounded-lg px-3 py-2 border border-white/5">
                  <div className="text-white/50">Words</div>
                  <div className="text-lg font-semibold text-white">{wordCount}</div>
                </div>
                <div className="bg-white/5 rounded-lg px-3 py-2 border border-white/5">
                  <div className="text-white/50">Characters</div>
                  <div className="text-lg font-semibold text-white">{charCount}</div>
                </div>
              </div>
              <div className="flex gap-2 mt-2">
                <button
                  type="button"
                  className={`flex-1 btn-ghost text-sm ${theme === "dark" ? "border-white/50" : ""}`}
                  onClick={() => setTheme("dark")}
                >
                  Dark
                </button>
                <button
                  type="button"
                  className={`flex-1 btn-ghost text-sm ${theme === "light" ? "border-white/50" : ""}`}
                  onClick={() => setTheme("light")}
                >
                  Light
                </button>
              </div>
            </div>
          </div>
        </header>

        <section className="glass-card p-5 md:p-6 space-y-4">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="card-title">
              <span className="text-accent2">🎨</span> Try a starting point
            </div>
            <div className="text-sm text-white/60">Tap to load instantly</div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
            {suggestionPrompts.map((prompt) => (
              <button
                key={prompt}
                className="glass-card border-white/10 hover:border-white/30 transition-all duration-150 text-left p-3 text-sm text-white/80 hover:-translate-y-[1px]"
                onClick={() => setUserPrompt(prompt)}
                type="button"
              >
                {prompt}
              </button>
            ))}
          </div>
        </section>

        <div className="grid lg:grid-cols-5 gap-5">
          <section className="glass-card p-5 md:p-6 space-y-6 lg:col-span-3">
            <div className="space-y-2">
              <div className="card-title">
                <span className="text-accent2">🔌</span> Model & endpoint
              </div>
              <p className="text-sm text-white/60">
                Override server defaults per session. Keys are sent only with your request and not stored.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-sm text-white/70" htmlFor="baseUrl">
                  Base URL
                </label>
                <input
                  id="baseUrl"
                  className="field"
                  placeholder="https://openrouter.ai/api/v1"
                  value={baseUrl}
                  onChange={(e) => setBaseUrl(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm text-white/70" htmlFor="model">
                  Model
                </label>
                <input
                  id="model"
                  className="field"
                  placeholder="moonshotai/kimi-k2:free"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm text-white/70" htmlFor="apiKey">
                  API key
                </label>
                <input
                  id="apiKey"
                  type="password"
                  className="field"
                  placeholder="Enter key (session only)"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 flex-wrap">
                <div className="card-title">
                  <span className="text-accent1">🧭</span> Describe the scene
                </div>
                <div className="flex gap-2">
                  <span className="badge text-white/60">Detail: {options.detailLevel}</span>
                  <span className="badge text-white/60">Mood: {options.mood}</span>
                  <span className="badge text-white/60">Lens: {options.medium}</span>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-sm text-white/70" htmlFor="detail">
                    Detail boost
                  </label>
                  <select
                    id="detail"
                    className="field"
                    value={options.detailLevel}
                    onChange={(e) => updateOption("detailLevel", e.target.value as DetailLevel)}
                  >
                    {detailOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-sm text-white/70" htmlFor="mood">
                    Mood / pacing
                  </label>
                  <select
                    id="mood"
                    className="field"
                    value={options.mood}
                    onChange={(e) => updateOption("mood", e.target.value as Mood)}
                  >
                    {moodOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-sm text-white/70" htmlFor="medium">
                    Visual lens
                  </label>
                  <select
                    id="medium"
                    className="field"
                    value={options.medium}
                    onChange={(e) => updateOption("medium", e.target.value as Medium)}
                  >
                    {mediumOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-white/70" htmlFor="prompt">
                  Your idea to enhance
                </label>
                <textarea
                  id="prompt"
                  className="field h-44 resize-none"
                  placeholder="A girl in Lolita dress."
                  value={userPrompt}
                  onChange={(e) => setUserPrompt(e.target.value)}
                />
                <div className="flex gap-2 flex-wrap">
                  <div className="badge">Words: {wordCount}</div>
                  <div className="badge">Characters: {charCount}</div>
                </div>
              </div>
            </div>

            {error ? (
              <div className="glass-card border-red-400/30 bg-red-500/10 text-sm text-red-100 px-4 py-3">
                {error}
              </div>
            ) : null}

            <div className="flex flex-wrap gap-3">
              <button className="btn-primary" onClick={handleEnhance} disabled={isLoading} type="button">
                {isLoading ? "Enhancing..." : "Enhance prompt"}
              </button>
              <button className="btn-ghost" onClick={handleClear} type="button">
                Clear
              </button>
            </div>
          </section>

          <section className="glass-card p-5 md:p-6 space-y-4 lg:col-span-2">
            <div className="card-title">
              <span className="text-accent1">✨</span> Enhanced prompt
            </div>
            {enhancedPrompt ? (
              <div className="glass-card border-white/10 bg-white/5 p-4 space-y-3">
                <div className="text-white/90 whitespace-pre-wrap leading-relaxed text-sm">{enhancedPrompt}</div>
                <div className="flex justify-between items-center gap-3">
                  <div className="text-xs text-white/60">Copy and drop into your image generator.</div>
                  <button className="btn-primary px-3 py-2 text-sm" onClick={handleCopy} type="button">
                    {copied ? "Copied" : "Copy"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="glass-card border-white/10 bg-white/5 p-4 text-sm text-white/70">
                Run the enhancer to see the upgraded prompt. It will be formatted as a single, copy-ready block.
              </div>
            )}

            <div className="space-y-2">
              <div className="card-title">
                <span className="text-accent2">💡</span> Quick tips
              </div>
              <div className="grid sm:grid-cols-2 gap-2 text-white/70 text-sm">
                <ul className="list-disc list-inside space-y-1">
                  <li>Anchor the subject: size, pose, focal point.</li>
                  <li>Add light direction and quality.</li>
                </ul>
                <ul className="list-disc list-inside space-y-1">
                  <li>Mention texture or materials for realism.</li>
                  <li>Include foreground/background layers for depth.</li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default App;
