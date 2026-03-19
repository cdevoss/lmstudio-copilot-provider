# Changelog

All notable changes to this project will be documented in this file.

The format is based on Keep a Changelog, and this project adheres loosely to Semantic Versioning.

## [0.1.1] - 2026-03-18

### Changed
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

### Changed
- Improved repository metadata, README, licensing, and packaging scripts for GitHub and Marketplace readiness
