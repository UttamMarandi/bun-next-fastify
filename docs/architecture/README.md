# Architecture Documentation

This directory contains all system architecture documentation for the passport-maker application.

## Overview

The passport-maker is a monorepo application that provides passport photo processing capabilities across web and mobile platforms, with a shared backend API.

## Documentation Structure

### Core Architecture

- **[System Overview](./system-overview.md)** - High-level system design and components
- **[Tech Stack](./tech-stack.md)** - Technology choices and rationale
- **[Data Flow](./data-flow.md)** - How data moves through the system
- **[API Design](./api-design.md)** - Backend API architecture and patterns

### Platform Considerations

- **[Mobile vs Web Differences](./mobile-web-differences.md)** - Platform-specific architectural decisions
- **[Deployment](./deployment.md)** - Deployment architecture and strategies

## Visual Diagrams

Architectural diagrams are stored in the [`../diagrams/`](../diagrams/) directory:

- System architecture overview
- Data flow diagrams
- Deployment topology

## Quick Navigation

- **Implementation Details**: See [`../apps/`](../apps/) for app-specific documentation
- **Development Setup**: See root [`../README.md`](../../README.md) and [`../CLAUDE.md`](../../CLAUDE.md)
- **Development Rules**: See [`../../.cursor/rules/`](../../.cursor/rules/)

## Reading Order

For new team members, read the architecture docs in this order:

1. [System Overview](./system-overview.md) - Start here
2. [Tech Stack](./tech-stack.md) - Understand technology choices
3. [Data Flow](./data-flow.md) - Learn how the system works
4. [Mobile vs Web Differences](./mobile-web-differences.md) - Platform considerations
5. [API Design](./api-design.md) - Backend architecture
6. [Deployment](./deployment.md) - How it all comes together
