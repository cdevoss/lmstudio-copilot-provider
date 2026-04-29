# LM Studio for Copilot Chat

[![GitHub release](https://img.shields.io/github/v/release/yoy123/lmstudio-copilot-provider?sort=semver)](https://github.com/yoy123/lmstudio-copilot-provider/releases)
[![GitHub last commit](https://img.shields.io/github/last-commit/yoy123/lmstudio-copilot-provider)](https://github.com/yoy123/lmstudio-copilot-provider/commits/main)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![VS Code](https://img.shields.io/badge/VS%20Code-%5E1.104.0-007ACC?logo=visualstudiocode)](https://code.visualstudio.com/)

Run local LM Studio models inside VS Code Copilot Chat with streaming responses, tool calling, terminal execution, filesystem tools, and optional image generation.

## What it does

- Adds LM Studio-hosted chat models to the Copilot Chat model picker
- Streams responses from LM Studio into VS Code chat
- Exposes a small built-in toolset for terminal and filesystem actions
- Supports tool-calling friendly local models with configurable tool budgeting
- Supports optional image generation through either A1111 or DALL-E-compatible APIs

## Features

- 🔌 **Auto-discovery**: Automatically detects models loaded in LM Studio
- 💬 **Chat Integration**: Use LM Studio models directly in VS Code's chat interface
- 🔄 **Streaming**: Real-time streaming responses
- 🛠️ **Tool Calling**: Built-in terminal, file, directory, search, and image generation tools
- 🖥️ **Integrated Terminal Launch**: Start LM Studio server from VS Code terminal
- 🖼️ **Optional Image Generation**: Route image requests to Automatic1111 or DALL-E-compatible endpoints
- ⚙️ **Configurable**: Customize server URL, timeouts, tool budget, and more

## Requirements

- VS Code 1.104.0 or later
- [LM Studio](https://lmstudio.ai/) running with a model loaded
- LM Studio's local server enabled (default: `http://localhost:1234`)

## Setup

1. Install and open LM Studio
2. Load a model in LM Studio
3. Start the local server in LM Studio (usually enabled by default)
4. Install this extension in VS Code
5. (Optional) Set `lmstudio-copilot.launchCommand` (for example: `lms server start`)
6. Open the Command Palette and run "LM Studio: Start Server in Integrated Terminal"
7. Run "LM Studio: Refresh Available Models"

## Extension Settings

This extension contributes the following settings:

- `lmstudio-copilot.serverUrl`: LM Studio server URL (default: `http://localhost:1234`)
- `lmstudio-copilot.apiKey`: Optional API key for LM Studio-compatible servers
- `lmstudio-copilot.launchCommand`: Command to launch LM Studio server in integrated terminal (example: `lms server start`)
- `lmstudio-copilot.terminalName`: Terminal name used to run the server (default: `LM Studio Server`)
- `lmstudio-copilot.autoStartServer`: Auto-run `launchCommand` when extension activates (default: `false`)
- `lmstudio-copilot.startupWaitMs`: Wait time before connection check after terminal start (default: `3000`)
- `lmstudio-copilot.enableTerminalTool`: Allow model-invoked terminal commands (default: `true`)
- `lmstudio-copilot.terminalToolName`: Terminal name for model tool commands (default: `LM Studio Tool Terminal`)
- `lmstudio-copilot.autoRefreshModels`: Automatically refresh models on startup (default: `true`)
- `lmstudio-copilot.requestTimeout`: Request timeout in milliseconds (default: `60000`)
- `lmstudio-copilot.maxTools`: Maximum number of tools exposed to the model per request (default: `20`)
- `lmstudio-copilot.enableToolCalling`: Enable tool calling support when the model can use tools
- `lmstudio-copilot.enableThinking`: Allow models to use extended thinking / chain-of-thought. Disable if your model errors on `enable_thinking` or produces noisy `<think>` blocks (default: `true`)
- `lmstudio-copilot.reasoningEffort`: Reasoning effort level for models that support the `reasoning_effort` parameter — `"low"`, `"medium"`, `"high"`, or `"default"` (do not send the parameter). Affects models like o1, o3, and QwQ (default: `"default"`)
- `lmstudio-copilot.imageGenBackend`: Choose `dalle` or `a1111`
- `lmstudio-copilot.imageGenEndpointUrl`: Base URL for the selected image generation backend
- `lmstudio-copilot.imageGenModel`: Image model name for DALL-E-compatible backends
- `lmstudio-copilot.imageGenWidth`, `lmstudio-copilot.imageGenHeight`, `lmstudio-copilot.imageGenSteps`, `lmstudio-copilot.imageGenOutputDir`: Image defaults

## Commands

- `LM Studio: Refresh Available Models` - Refresh the list of available models from LM Studio
- `LM Studio: Start Server in Integrated Terminal` - Starts LM Studio server command in VS Code terminal
- `LM Studio: Stop Server Terminal` - Stops the dedicated LM Studio terminal
- `LM Studio: Check Server Connection` - Test connection to LM Studio server

## Usage

1. Make sure LM Studio is running with a model loaded
2. Open VS Code's Chat view (Ctrl+Shift+I or Cmd+Shift+I)
3. Click on the model selector dropdown
4. Select an LM Studio model (prefixed with "LM Studio")
5. Start chatting!

### Let models run commands in the integrated terminal

The extension now exposes a chat tool named `#runInTerminal`.

- In chat, ask the model to use `#runInTerminal` to run commands (for example, compile or test commands).
- Commands run in a dedicated integrated terminal (`lmstudio-copilot.terminalToolName`).
- Invocations are automatically executed without a confirmation prompt.

### Tool budget for local models

Many local models become unreliable when given dozens of tool schemas at once, especially when MCP servers add very large tool inventories.

- By default, the extension sends at most `20` tools per request.
- Tools already used in the current conversation are prioritized.
- Set `lmstudio-copilot.maxTools` to `0` to disable the limit.

This helps reduce hallucinated tool names, malformed inputs, and context-window bloat.

### Extended thinking and reasoning effort

Some models (Qwen3-thinking, QwQ, o1, o3, and similar) can perform multi-step internal reasoning before responding.

Two settings control this behaviour:

| Setting | Purpose | Values |
|---|---|---|
| `lmstudio-copilot.enableThinking` | Toggle `enable_thinking` in the request | `true` (default) / `false` |
| `lmstudio-copilot.reasoningEffort` | Set `reasoning_effort` in the request | `"default"` (don't send) / `"low"` / `"medium"` / `"high"` |

**To enable maximum reasoning**, set `reasoningEffort` to `"high"` in your VS Code settings:

```json
{
  "lmstudio-copilot.reasoningEffort": "high"
}
```

**To disable thinking** for models that produce noisy `<think>` blocks:

```json
{
  "lmstudio-copilot.enableThinking": false
}
```

The extension automatically strips `<think>…</think>` traces from the visible response — they are never shown in the chat window.

### Image generation

The built-in `lmstudio_generate_image` tool supports:

- **Automatic1111 / Stable Diffusion WebUI** via `lmstudio-copilot.imageGenBackend = a1111`
- **DALL-E-compatible APIs** via `lmstudio-copilot.imageGenBackend = dalle`

Set `lmstudio-copilot.imageGenEndpointUrl` to your image server URL.

## Troubleshooting

### Models not appearing

- Make sure LM Studio is running
- Make sure a model is loaded in LM Studio
- Check that the server URL is correct in settings
- Run "LM Studio: Check Server Connection" to verify connectivity

### Slow responses

- LM Studio performance depends on your hardware and the model size
- Consider using a smaller/faster model
- Increase the timeout in settings if needed

## Development

```bash
# Install dependencies
npm install

# Compile and watch
npm run watch

# Package the extension
npm run package

# Build a VSIX for local install / Marketplace submission
npm run package:vsix
```

## Releases

- Git tags use the format `v<package.json version>`
- GitHub releases are created from those tags
- The first release for this repo is `v0.1.0`

## Contributors

Thank you to everyone who has contributed code, pull requests, or issues to this project:

- [yoy123](https://github.com/yoy123) — 21 contributions
- [Copilot](https://github.com/apps/copilot-swe-agent) — 5 contributions
- [szkane](https://github.com/szkane) — 2 contributions
- [NHausleitner](https://github.com/NHausleitner) — issue author
- [Pixelzated](https://github.com/Pixelzated) — issue author
- [fmuntean](https://github.com/fmuntean) — issue author

## License

MIT
