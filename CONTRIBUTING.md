# 🤝 Contributing to NSBS Platform

Thank you for your interest in contributing to the National Society of Business
Sciences Certification Platform! This guide will help you get started with
contributing to our project.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Contribution Guidelines](#contribution-guidelines)
- [Pull Request Process](#pull-request-process)
- [Issue Reporting](#issue-reporting)
- [Development Standards](#development-standards)
- [Testing Requirements](#testing-requirements)

## 📜 Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct:

- **Be respectful** and inclusive of all contributors
- **Be collaborative** and help others learn and grow
- **Be constructive** in feedback and discussions
- **Be professional** in all communications
- **Follow** project guidelines and coding standards

## 🚀 Getting Started

### Prerequisites

Before contributing, ensure you have:

- **Node.js** 22.16.0+ installed
- **pnpm** package manager
- **Git** for version control
- **VS Code** (recommended) with suggested extensions
- Basic knowledge of **TypeScript**, **React**, and **Next.js**

### Development Environment

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:

   ```bash
   git clone https://github.com/your-username/nsbs-platform.git
   cd nsbs-platform
   ```

3. **Add upstream remote**:

   ```bash
   git remote add upstream https://github.com/AahPlexX/nsbs-platform.git
   ```

4. **Install dependencies**:

   ```bash
   pnpm install
   ```

5. **Set up environment variables** (see README.md for details)

6. **Start development server**:
   ```bash
   pnpm dev
   ```

## 📝 Development Setup

### Recommended VS Code Extensions

Install these extensions for the best development experience:

```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-eslint",
    "bradlc.vscode-tailwindcss"
  ]
}
```

### Project Structure Understanding

Familiarize yourself with our project structure:

- `app/` - Next.js 15 App Router pages and layouts
- `components/` - Reusable React components
- `lib/` - Utility functions and configurations
- `scripts/` - Database and deployment scripts
- `memory-bank/` - Project documentation and decisions

## 🛠️ Contribution Guidelines

### Types of Contributions

We welcome these types of contributions:

- **🐛 Bug fixes** - Fixing existing issues
- **✨ New features** - Adding new functionality
- **📝 Documentation** - Improving docs and comments
- **🎨 UI/UX improvements** - Enhancing user experience
- **⚡ Performance optimizations** - Making things faster
- **🧪 Tests** - Adding or improving test coverage
- **🔧 Tooling** - Development tool improvements

### Before You Start

1. **Check existing issues** to avoid duplicate work
2. **Create an issue** for new features or major changes
3. **Discuss** your approach in the issue before coding
4. **Keep changes focused** - one feature/fix per PR

## 🔄 Pull Request Process

### 1. Create a Feature Branch

```bash
# Update your main branch
git checkout main
git pull upstream main

# Create a new feature branch
git checkout -b feature/your-feature-name
```

### 2. Make Your Changes

- Follow our [coding standards](#development-standards)
- Write tests for new functionality
- Update documentation as needed
- Ensure all tests pass

### 3. Commit Your Changes

Use conventional commit messages:

```bash
# Format: type(scope): description
git commit -m "feat(auth): add magic link authentication"
git commit -m "fix(ui): resolve button alignment issue"
git commit -m "docs(readme): update installation instructions"
```

**Commit Types:**

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### 4. Push and Create PR

```bash
# Push your branch
git push origin feature/your-feature-name

# Create PR through GitHub interface
```

### 5. PR Requirements

Your pull request must:

- [ ] **Pass all CI checks** (tests, linting, type checking)
- [ ] **Include tests** for new functionality
- [ ] **Update documentation** if needed
- [ ] **Follow coding standards** and conventions
- [ ] **Have a clear description** of changes made
- [ ] **Reference related issues** using keywords (fixes #123)
- [ ] **Be focused** on a single feature/fix

### 6. Review Process

- **Code review** by maintainers
- **Feedback incorporation** if needed
- **Final approval** and merge

## 🐛 Issue Reporting

### Bug Reports

When reporting bugs, include:

- **Clear title** describing the issue
- **Steps to reproduce** the problem
- **Expected behavior** vs actual behavior
- **Environment details** (OS, browser, Node version)
- **Screenshots** or videos if applicable
- **Error messages** or console logs

### Feature Requests

For feature requests, include:

- **Clear description** of the proposed feature
- **Use case** and user story
- **Acceptance criteria** or requirements
- **Mock-ups** or wireframes if applicable

## 💻 Development Standards

### Code Style

We use automated tooling for consistency:

- **Prettier** for code formatting
- **ESLint** for code linting
- **TypeScript** for type checking

Run before committing:

```bash
pnpm format      # Format code
pnpm lint        # Check linting
pnpm typecheck   # Check types
```

### TypeScript Guidelines

- **Use strict TypeScript** - no `any` types
- **Define interfaces** for all data structures
- **Use Zod schemas** for runtime validation
- **Export types** from dedicated files

### Component Guidelines

- **Use functional components** with hooks
- **Implement proper TypeScript** interfaces
- **Follow naming conventions** (PascalCase for components)
- **Use composition** over inheritance
- **Keep components focused** and single-purpose

### CSS/Styling Guidelines

- **Use TailwindCSS** for styling
- **Follow NSBS color palette** (mocha-mousse, evergreen, mint-sage, sage)
- **Use CSS variables** for custom properties
- **Ensure responsive design** (mobile-first)
- **Maintain accessibility** (WCAG 2.1 AA)

## 🧪 Testing Requirements

### Test Coverage

- **Unit tests** for utility functions
- **Integration tests** for API routes
- **Component tests** for UI components
- **End-to-end tests** for critical user flows

### Running Tests

```bash
pnpm test              # Run all tests
pnpm test:watch        # Run in watch mode
pnpm test:coverage     # Generate coverage report
```

### Writing Tests

- **Use Jest** and React Testing Library
- **Test behavior**, not implementation
- **Mock external dependencies**
- **Aim for >80% coverage** on new code

## 📚 Documentation

### Code Documentation

- **Comment complex logic** and algorithms
- **Use JSDoc** for function documentation
- **Update README** for new features
- **Maintain memory-bank** documentation

### API Documentation

- **Document all endpoints** in OpenAPI format
- **Include request/response examples**
- **Specify error codes** and messages

## 🔐 Security Guidelines

- **Never commit secrets** or API keys
- **Use environment variables** for configuration
- **Validate all user inputs** with Zod
- **Follow OWASP guidelines** for web security
- **Report security issues** privately

## 🚀 Release Process

1. **Feature freeze** for release candidate
2. **Testing phase** with QA team
3. **Version bump** following semantic versioning
4. **Tag release** and update changelog
5. **Deploy to production** with monitoring

## 📞 Getting Help

If you need help:

- **Join our Discord** community
- **Ask in GitHub Discussions**
- **Email** the development team
- **Check existing documentation**

## 🙏 Recognition

Contributors will be:

- **Listed in CONTRIBUTORS.md**
- **Mentioned in release notes**
- **Invited to contributor events**
- **Given contributor badge** on Discord

---

Thank you for contributing to the NSBS Platform! Your efforts help us deliver
better business education technology. 🎓✨
