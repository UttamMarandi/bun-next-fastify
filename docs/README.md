# Documentation

This directory contains all project documentation organized by scope and purpose.

## Structure

```
docs/
├── README.md                    # This file
├── apps/                        # App-specific documentation
│   ├── frontend/               # Original frontend docs (legacy)
│   │   └── dependencies.md      
│   ├── frontend-web/           # Web-optimized frontend
│   │   └── dependencies.md      # Web-specific packages
│   ├── frontend-mobile/        # Mobile-optimized frontend  
│   │   └── dependencies.md      # Mobile/Capacitor packages
│   └── server/                 
│       ├── dependencies.md      # Server packages (future)
│       └── PRD.md              # Product requirements (future)
└── architecture/               # System architecture docs (future)
```

## Quick Links

- **Web Frontend Dependencies**: [apps/frontend-web/dependencies.md](./apps/frontend-web/dependencies.md)
- **Mobile Frontend Dependencies**: [apps/frontend-mobile/dependencies.md](./apps/frontend-mobile/dependencies.md)
- **Original Frontend Dependencies**: [apps/frontend/dependencies.md](./apps/frontend/dependencies.md) (legacy)
- **Project Setup**: See root [README.md](../README.md) and [CLAUDE.md](../CLAUDE.md)
- **Development Rules**: See [.cursor/rules/](../.cursor/rules/)

## Contributing

When adding documentation:
- Place app-specific docs in the relevant `apps/` subdirectory
- Use clear, descriptive filenames
- Update this README when adding new sections
- Follow existing formatting and structure