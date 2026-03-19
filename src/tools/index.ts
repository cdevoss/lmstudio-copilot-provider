import * as vscode from 'vscode';
import { TERMINAL_TOOL_NAME, createTerminalTool } from './terminal-tool';
import {
  READ_FILE_TOOL_NAME,
  WRITE_FILE_TOOL_NAME,
  LIST_DIRECTORY_TOOL_NAME,
  SEARCH_FILES_TOOL_NAME,
  createReadFileTool,
  createWriteFileTool,
  createListDirectoryTool,
  createSearchFilesTool,
} from './file-tools';
import { IMAGE_GEN_TOOL_NAME, createImageGenTool } from './image-tool';

export {
  TERMINAL_TOOL_NAME,
  READ_FILE_TOOL_NAME,
  WRITE_FILE_TOOL_NAME,
  LIST_DIRECTORY_TOOL_NAME,
  SEARCH_FILES_TOOL_NAME,
  IMAGE_GEN_TOOL_NAME,
};

/**
 * Registers all LM tools with the extension context.
 * Each tool must also have a matching entry in package.json contributes.languageModelTools.
 */
export function registerAllTools(
  context: vscode.ExtensionContext,
  outputChannel: vscode.OutputChannel
): void {
  context.subscriptions.push(
    vscode.lm.registerTool(TERMINAL_TOOL_NAME, createTerminalTool(outputChannel)),
    vscode.lm.registerTool(READ_FILE_TOOL_NAME, createReadFileTool(outputChannel)),
    vscode.lm.registerTool(WRITE_FILE_TOOL_NAME, createWriteFileTool(outputChannel)),
    vscode.lm.registerTool(LIST_DIRECTORY_TOOL_NAME, createListDirectoryTool(outputChannel)),
    vscode.lm.registerTool(SEARCH_FILES_TOOL_NAME, createSearchFilesTool(outputChannel)),
    vscode.lm.registerTool(IMAGE_GEN_TOOL_NAME, createImageGenTool(outputChannel))
  );

  outputChannel.appendLine(
    `✅ Registered LM tools: ${
      [
        TERMINAL_TOOL_NAME,
        READ_FILE_TOOL_NAME,
        WRITE_FILE_TOOL_NAME,
        LIST_DIRECTORY_TOOL_NAME,
        SEARCH_FILES_TOOL_NAME,
        IMAGE_GEN_TOOL_NAME,
      ].join(', ')
    }`
  );
}
