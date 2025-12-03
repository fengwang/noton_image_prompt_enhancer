## Image Prompt Enhancer

A Streamlit-based “prompt studio” that transforms quick image ideas into richer, copy-ready prompts via an LLM backend. The UI offers curated suggestions, refinement controls (detail, mood, visual lens), and an enhanced prompt panel with one-click copy.

### Key Features
- Guided refinement: select detail depth, mood, and visual style to steer the enhancement.
- Quick-start templates and prompt stats to stay concise.
- Copy-ready enhanced output displayed alongside your input.
- Light-themed, responsive layout with modern typography and glassy panels.

### Screenshot
![Screenshot](screenshot.png)

### Run Locally
1) Install dependencies (Python 3.10+ recommended):
```bash
pip install -r requirements.txt
```
2) Set environment variables:
```bash
export PROMPT_ENHANCER_BASE_URL="https://openrouter.ai/api/v1"
export PROMPT_ENHANCER_MODEL="moonshotai/kimi-k2:free"
export PROMPT_ENHANCER_API_KEY="your-api-key"
```
3) Start the app:
```bash
streamlit run ImagePromptEnhancer.py
```

### Docker
Build:
```bash
docker build -t noton-image-prompt-enhancer .
```
Run:
```bash
docker run --rm -it -p 8501:8501 \
  -e PROMPT_ENHANCER_BASE_URL=xxx \
  -e PROMPT_ENHANCER_MODEL=xxx \
  -e PROMPT_ENHANCER_API_KEY=xxx \
  noton-image-prompt-enhancer
```

### Environment Variables
- `PROMPT_ENHANCER_BASE_URL` – LLM endpoint URL.
- `PROMPT_ENHANCER_MODEL` – model id/name.
- `PROMPT_ENHANCER_API_KEY` – API key for the provider.

