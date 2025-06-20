# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Architecture

This is a monorepo passport-maker application with a Next.js frontend and Fastify backend server, both using Bun as the runtime:

- **Root workspace**: Manages shared dependencies and workspace configuration
- **apps/frontend/**: Next.js 15 application with React 19, Tailwind CSS 4, runs on port 3000
- **apps/server/**: Fastify API server with TypeScript, runs on port 3001
- **Runtime**: All components use Bun instead of Node.js

## Development Commands

### Root level

- `bun install` - Install all workspace dependencies
- `bun run index.ts` - Run the root entry point

### Frontend (apps/frontend/)

- `bun run dev` - Start Next.js development server with Turbopack
- `bun run build` - Build for production
- `bun run start` - Start production server
- `bun run lint` - Run ESLint

### Server (apps/server/)

- `bun run index.ts` - Start Fastify server in development

## Important Conventions

**Use Bun, not Node.js**: This project strictly uses Bun runtime and tooling as defined in .cursor/rules/. Always use:

- `bun <file>` instead of `node <file>`
- `bun install` instead of `npm install`
- `bun run <script>` instead of `npm run <script>`
- `bun test` instead of `jest` or `vitest`

**Workspace Structure**: Use Bun workspaces defined in bunfig.toml. The root package.json defines workspaces for apps/\*.

**TypeScript**: All apps use TypeScript with strict configuration. Server uses module: "index.ts" pattern.

**API Communication**: Frontend (port 3000) communicates with Fastify server (port 3001).
