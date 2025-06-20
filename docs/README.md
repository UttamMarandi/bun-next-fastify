# Documentation

This directory contains all project documentation organized by scope and purpose.

## Structure

```
docs/
├── README.md                    # This file
├── apps/                        # App-specific documentation
│   ├── frontend/               
│   │   ├── dependencies.md      # Frontend packages and usage
│   │   └── PRD.md              # Product requirements (future)
│   └── server/                 
│       ├── dependencies.md      # Server packages (future)
│       └── PRD.md              # Product requirements (future)
└── architecture/               # System architecture docs (future)
```

## Quick Links

- **Frontend Dependencies**: [apps/frontend/dependencies.md](./apps/frontend/dependencies.md)
- **Project Setup**: See root [README.md](../README.md) and [CLAUDE.md](../CLAUDE.md)
- **Development Rules**: See [.cursor/rules/](../.cursor/rules/)

## Contributing

When adding documentation:
- Place app-specific docs in the relevant `apps/` subdirectory
- Use clear, descriptive filenames
- Update this README when adding new sections
- Follow existing formatting and structure