import { globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

// Reuse the Next.js recommended rules through ESLint's flat configuration format.
const config = [globalIgnores([".next/**", "node_modules/**", "test-results/**", ".playwright-cli/**"]), ...nextVitals];

export default config;
