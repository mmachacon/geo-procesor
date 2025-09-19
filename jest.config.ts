// jest.config.ts
import type { Config } from "jest";
import nextJest from "next/jest";

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./",
});

// Add any custom config to be passed to Jest
const customJestConfig: Config = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"], // <--- Add this line
  testEnvironment: "jest-environment-jsdom",
  transform: {
    "^.+.jsx?$": "babel-jest",
  },
  //moduleFileExtensions: ["js", "jsx", "json", "node"],
  transformIgnorePatterns: [
    "node_modules/(?!react-leaflet|@react-leaflet|@react-leaflet/core)",
  ],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(customJestConfig);
