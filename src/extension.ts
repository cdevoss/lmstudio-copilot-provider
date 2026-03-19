import * as vscode from 'vscode';
import { LMStudioProvider } from './lmstudio-provider';
import { LMStudioClient } from './lmstudio-client';
import { registerAllTools } from './tools/index';

let provider: LMStudioProvider | undefined;
let registration: vscode.Disposable | undefined;
let outputChannel: vscode.OutputChannel;
let lmStudioTerminal: vscode.Terminal | undefined;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function activate(context: vscode.ExtensionContext) {
  // Create output channel for logging
  outputChannel = vscode.window.createOutputChannel('LM Studio Provider');
  context.subscriptions.push(outputChannel);
  
  outputChannel.appendLine('LM Studio Copilot Provider is activating...');
  outputChannel.show(true);

  const client = new LMStudioClient(outputChannel);
  provider = new LMStudioProvider(client, context, outputChannel);

  const getOrCreateTerminalByName = (terminalName: string): vscode.Terminal => {
    const existing = vscode.window.terminals.find((t) => t.name === terminalName);
    if (existing) {
      return existing;
    }
    return vscode.window.createTerminal({ name: terminalName });
  };

  const getOrCreateServerTerminal = (): vscode.Terminal => {
    const config = vscode.workspace.getConfiguration('lmstudio-copilot');
    const terminalName = config.get<string>('terminalName', 'LM Studio Server');

    lmStudioTerminal = getOrCreateTerminalByName(terminalName);
    return lmStudioTerminal;
  };

  const startServerInTerminal = async (): Promise<boolean> => {
    const config = vscode.workspace.getConfiguration('lmstudio-copilot');
    const launchCommand = config.get<string>('launchCommand', '').trim();

    if (!launchCommand) {
      const message = 'Set lmstudio-copilot.launchCommand in settings first (example: lms server start).';
      outputChannel.appendLine(`⚠️ ${message}`);
      vscode.window.showWarningMessage(message);
      return false;
    }

    const terminal = getOrCreateServerTerminal();
    terminal.show(true);
    outputChannel.appendLine(`Starting LM Studio server in terminal with command: ${launchCommand}`);
    terminal.sendText(launchCommand, true);

    const startupWaitMs = config.get<number>('startupWaitMs', 3000);
    await sleep(Math.max(startupWaitMs, 0));

    const connected = await client.checkConnection();
    if (connected) {
      outputChannel.appendLine('✅ LM Studio server appears reachable after terminal launch');
      return true;
    }

    outputChannel.appendLine('⚠️ LM Studio server not reachable yet after terminal launch');
    return false;
  };

  const stopServerTerminal = (): void => {
    const config = vscode.workspace.getConfiguration('lmstudio-copilot');
    const terminalName = config.get<string>('terminalName', 'LM Studio Server');
    const terminal = lmStudioTerminal ?? vscode.window.terminals.find((t) => t.name === terminalName);

    if (!terminal) {
      vscode.window.showInformationMessage('LM Studio terminal is not running.');
      return;
    }

    outputChannel.appendLine(`Stopping LM Studio terminal: ${terminal.name}`);
    terminal.dispose();
    lmStudioTerminal = undefined;
    vscode.window.showInformationMessage('LM Studio terminal stopped.');
  };

  // Register the provider with VS Code
  try {
    registration = vscode.lm.registerLanguageModelChatProvider('lmstudio', provider);
    context.subscriptions.push(registration);
    outputChannel.appendLine('✅ Provider registered successfully with vendor: lmstudio');
  } catch (error) {
    outputChannel.appendLine(`❌ Failed to register provider: ${error}`);
    vscode.window.showErrorMessage(`Failed to register LM Studio provider: ${error}`);
  }

  // Register all LM tools (terminal, read_file, write_file, list_directory, search_files)
  registerAllTools(context, outputChannel);

  // Register commands
  context.subscriptions.push(
    vscode.commands.registerCommand('lmstudio-copilot.startServer', async () => {
      const started = await startServerInTerminal();
      if (started) {
        vscode.window.showInformationMessage('LM Studio server launched in integrated terminal');
        await provider?.refreshModels();
      }
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('lmstudio-copilot.stopServer', () => {
      stopServerTerminal();
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('lmstudio-copilot.refreshModels', async () => {
      outputChannel.appendLine('Refreshing models...');
      await provider?.refreshModels();
      vscode.window.showInformationMessage('LM Studio models refreshed');
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('lmstudio-copilot.checkConnection', async () => {
      const connected = await client.checkConnection();
      if (connected) {
        vscode.window.showInformationMessage('✅ Connected to LM Studio server');
        outputChannel.appendLine('✅ Connection check: OK');
      } else {
        vscode.window.showErrorMessage('❌ Cannot connect to LM Studio server. Make sure it is running.');
        outputChannel.appendLine('❌ Connection check: FAILED');
      }
    })
  );

  // Listen for configuration changes
  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration((e) => {
      if (e.affectsConfiguration('lmstudio-copilot')) {
        outputChannel.appendLine('Configuration changed, refreshing models...');
        provider?.refreshModels();
      }
    })
  );

  // Auto-refresh models on startup if enabled
  const config = vscode.workspace.getConfiguration('lmstudio-copilot');
  if (config.get<boolean>('autoStartServer', false)) {
    outputChannel.appendLine('Auto-start server enabled, launching LM Studio in integrated terminal...');
    await startServerInTerminal();
  }

  if (config.get<boolean>('autoRefreshModels', true)) {
    outputChannel.appendLine('Auto-refresh enabled, will refresh models in 2 seconds...');
    // Delay to let LM Studio start if launched with VS Code
    setTimeout(async () => {
      outputChannel.appendLine('Auto-refreshing models now...');
      await provider?.refreshModels();
    }, 2000);
  }

  outputChannel.appendLine('LM Studio Copilot Provider activated');
}

export function deactivate() {
  lmStudioTerminal?.dispose();
  lmStudioTerminal = undefined;
  provider?.dispose();
  provider = undefined;
}
