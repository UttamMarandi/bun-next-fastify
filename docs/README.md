# Documentation

This directory contains all project documentation organized by scope and purpose.

## Structure

```
docs/
├── README.md                    # This file
├── architecture/               # System architecture documentation
│   ├── README.md                # Architecture overview
│   ├── system-overview.md       # High-level system design
│   ├── tech-stack.md           # Technology choices & rationale
│   ├── data-flow.md            # Data flow documentation (future)
│   ├── mobile-web-differences.md # Platform considerations (future)
│   ├── api-design.md           # API architecture (future)
│   └── deployment.md           # Deployment architecture (future)
├── apps/                        # App-specific documentation
│   ├── frontend/               # Shared frontend dependencies
│   │   └── dependencies.md
│   ├── frontend-web/           # Web-optimized frontend
│   │   └── dependencies.md      # Web-specific packages
│   ├── frontend-mobile/        # Mobile-optimized frontend
│   │   └── dependencies.md      # Mobile/Capacitor packages
│   └── server/
│       ├── dependencies.md      # Server packages (future)
│       └── PRD.md              # Product requirements (future)
└── diagrams/                   # Visual architecture diagrams
```

## Quick Links

### Architecture

- **[Architecture Overview](./architecture/README.md)** - Start here for system understanding
- **[System Overview](./architecture/system-overview.md)** - High-level design and components
- **[Technology Stack](./architecture/tech-stack.md)** - Technology choices and rationale

### Dependencies

- **[Shared Dependencies](./apps/frontend/dependencies.md)** - Packages used by both web and mobile
- **[Web Frontend Dependencies](./apps/frontend-web/dependencies.md)** - Web-specific packages
- **[Mobile Frontend Dependencies](./apps/frontend-mobile/dependencies.md)** - Mobile/Capacitor packages
- **Project Setup**: See root [README.md](../README.md) and [CLAUDE.md](../CLAUDE.md)
- **Development Rules**: See [.cursor/rules/](../.cursor/rules/)

## Contributing

When adding documentation:

- Place app-specific docs in the relevant `apps/` subdirectory
- Use clear, descriptive filenames
- Update this README when adding new sections
- Follow existing formatting and structure
