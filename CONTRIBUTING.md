# Contributing to SetLog

## Development Setup
1. Clone the repository
2. Copy `.env.local.example` to `.env.local` and fill in values
3. `npm install`
4. `npm run dev`

## Code Style
- TypeScript strict mode
- ESLint for linting
- Tailwind CSS for styling
- shadcn/ui for components

## Pull Request Process
1. Create a feature branch from `main`
2. Ensure all tests pass: `npm run test`
3. Ensure type checking passes: `npm run typecheck`
4. Submit PR with clear description

## Architecture Guidelines
- Prefer server components unless interactivity is needed
- Use TanStack Query for client-side data fetching
- Validate all API inputs with Zod
- Use `force-dynamic` for pages that use Supabase server client
- Follow existing patterns in the codebase
