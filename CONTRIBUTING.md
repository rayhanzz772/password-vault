# Contributing to Vault Password Frontend

First off, thank you for considering contributing to Vault Password! It's people like you that make Vault Password such a great tool.

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

* **Use a clear and descriptive title**
* **Describe the exact steps which reproduce the problem**
* **Provide specific examples to demonstrate the steps**
* **Describe the behavior you observed after following the steps**
* **Explain which behavior you expected to see instead and why**
* **Include screenshots and animated GIFs** if possible
* **Include your environment details** (OS, browser, Node version, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

* **Use a clear and descriptive title**
* **Provide a step-by-step description of the suggested enhancement**
* **Provide specific examples to demonstrate the steps**
* **Describe the current behavior** and **explain which behavior you expected to see instead**
* **Explain why this enhancement would be useful**

### Pull Requests

* Fill in the required template
* Follow the JavaScript/React style guide
* Include screenshots and animated GIFs in your pull request whenever possible
* End all files with a newline
* Avoid platform-dependent code

## Development Process

### Setup Development Environment

1. Fork the repo and create your branch from `main`
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`

### Making Changes

1. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

2. Make your changes and commit:
   ```bash
   git add .
   git commit -m "feat: add amazing feature"
   ```

3. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

4. Open a Pull Request

### Commit Message Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

* `feat:` - A new feature
* `fix:` - A bug fix
* `docs:` - Documentation only changes
* `style:` - Changes that don't affect the meaning of the code
* `refactor:` - A code change that neither fixes a bug nor adds a feature
* `perf:` - A code change that improves performance
* `test:` - Adding missing tests
* `chore:` - Changes to the build process or auxiliary tools

Examples:
```
feat: add dark mode toggle animation
fix: resolve mobile menu overflow issue
docs: update README with deployment instructions
style: format code with prettier
refactor: simplify theme context logic
```

### Coding Style

* Use 2 spaces for indentation
* Use semicolons
* Use single quotes for strings
* Add trailing commas in multiline objects/arrays
* Use meaningful variable and function names
* Add comments for complex logic
* Keep components small and focused
* Use functional components with hooks

### Component Structure

```jsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Icon } from 'lucide-react';

const MyComponent = ({ prop1, prop2 }) => {
  const [state, setState] = useState(null);

  const handleClick = () => {
    // Handler logic
  };

  return (
    <div className="container">
      {/* Component JSX */}
    </div>
  );
};

export default MyComponent;
```

### File Naming

* Components: `PascalCase.jsx` (e.g., `Header.jsx`)
* Utilities: `camelCase.js` (e.g., `formatDate.js`)
* Styles: `kebab-case.css` (e.g., `custom-styles.css`)

### Testing

* Write tests for new features
* Update tests for modified features
* Ensure all tests pass before submitting PR: `npm test`

## Project Structure

```
src/
├── components/     # Reusable React components
├── contexts/       # React Context providers
├── hooks/          # Custom React hooks
├── utils/          # Utility functions
├── assets/         # Static assets (images, icons)
├── styles/         # Global styles
└── App.jsx         # Main app component
```

## Questions?

Feel free to open an issue with your question or reach out to the maintainers.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing! 🎉
