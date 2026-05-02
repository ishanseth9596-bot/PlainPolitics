# Contributing to PlainPolitics

Thank you for contributing to PlainPolitics! This project follows strict coding standards to ensure high quality and security for our civic users.

## 🏗️ Naming Conventions
- **Variables & Functions:** `camelCase`
- **React Components & Hooks:** `PascalCase` (Hooks: `useSomething`)
- **Filenames:** `kebab-case` or `camelCase` (Backend routes: `camelCase`)

## 🛣️ Adding a New API Route
All routes must use the standardized response helper and include basic validation.

**Template:**
```javascript
import express from "express";
import { body } from "express-validator";
import { successResponse, errorResponse } from "../utils/responseHelper.js";

const router = express.Router();

router.post("/example", [
  body("field").notEmpty()
], (req, res) => {
  // Logic here
  successResponse(res, { result: "ok" });
});

export default router;
```

## 🪝 Adding a New React Hook
Hooks should reside in `client/src/hooks` and follow the `{ data, isLoading, error }` pattern.

**Template:**
```javascript
import { useState, useEffect } from "react";

export const useMyHook = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch logic here

  return { data, isLoading, error };
};
```

## 🧪 Testing Requirements
- Run `npm test` before every commit.
- Coverage must stay above **80%**.
- Add a regression test for any bug fix.

## 🚀 Deployment
We use Google Cloud Build for automated deployment to Cloud Run. Ensure your changes pass the `test:ci` step in `cloudbuild.yaml`.
