# Changelog

All notable changes to this project will be documented in this file.

The format is based on Keep a Changelog, and this project adheres loosely to Semantic Versioning.

## [0.1.5] - 2026-03-27

### Change 6

- Improved Qwen-family model compatibility by normalizing outgoing messages before sending requests
- Added safer content sanitization for outgoing chat payloads to reduce malformed tool-call interactions
- Updated provider behavior to avoid injecting an extra system prompt when the target model or message layout already handles it

## [0.1.4] - 2026-03-27

### Change 5

- Updated extension marketplace metadata and publisher alignment for release consistency
- Switched to a PNG-only extension icon bundle and removed unused SVG icon assets

## [0.1.3] - 2026-03-19

### Change 4

- Refined the bundled extension icon based on the uploaded design: added a white background card, removed outer border bars, and adjusted the lower LM Studio symbol for cleaner overlap at small sizes

## [0.1.2] - 2026-03-19

### Change 3

- Replaced the text-heavy extension icon with a cleaner LM-style monogram mark for better small-size readability

## [0.1.1] - 2026-03-18

### Change 2

- Added a new bundled extension icon branded as **LMStudio Co-Pilot**
- Wired the icon into the extension manifest and VSIX package output

## [0.1.0] - 2026-03-18

### Added

- LM Studio model discovery and Copilot Chat provider integration
- Streaming chat completions through the LM Studio OpenAI-compatible API
- Built-in tools for terminal, file read/write, directory listing, file search, and image generation
- Optional Automatic1111 and DALL-E-compatible image generation support
- Tool budgeting for local models via `lmstudio-copilot.maxTools`
- Commands to refresh models, start the LM Studio server, stop the server terminal, and check connectivity

### Change 1

- Improved repository metadata, README, licensing, and packaging scripts for GitHub and Marketplace readiness
