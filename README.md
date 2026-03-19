# LM Studio for Copilot Chat

A VS Code extension that adds LM Studio language models to VS Code's Copilot Chat interface.

## Features

- 🔌 **Auto-discovery**: Automatically detects models loaded in LM Studio
- 💬 **Chat Integration**: Use LM Studio models directly in VS Code's chat interface
- 🔄 **Streaming**: Real-time streaming responses
- 🖥️ **Integrated Terminal Launch**: Start LM Studio server from VS Code terminal
- ⚙️ **Configurable**: Customize server URL, timeouts, and more

## Requirements

- VS Code 1.90.0 or later
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

* `lmstudio-copilot.serverUrl`: LM Studio server URL (default: `http://localhost:1234`)
* `lmstudio-copilot.launchCommand`: Command to launch LM Studio server in integrated terminal (example: `lms server start`)
* `lmstudio-copilot.terminalName`: Terminal name used to run the server (default: `LM Studio Server`)
* `lmstudio-copilot.autoStartServer`: Auto-run `launchCommand` when extension activates (default: `false`)
* `lmstudio-copilot.startupWaitMs`: Wait time before connection check after terminal start (default: `3000`)
* `lmstudio-copilot.enableTerminalTool`: Allow model-invoked terminal commands (default: `true`)
* `lmstudio-copilot.terminalToolName`: Terminal name for model tool commands (default: `LM Studio Tool Terminal`)
* `lmstudio-copilot.autoRefreshModels`: Automatically refresh models on startup (default: `true`)
* `lmstudio-copilot.requestTimeout`: Request timeout in milliseconds (default: `60000`)

## Commands

* `LM Studio: Refresh Available Models` - Refresh the list of available models from LM Studio
* `LM Studio: Start Server in Integrated Terminal` - Starts LM Studio server command in VS Code terminal
* `LM Studio: Stop Server Terminal` - Stops the dedicated LM Studio terminal
* `LM Studio: Check Server Connection` - Test connection to LM Studio server

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
```

## License

MIT
