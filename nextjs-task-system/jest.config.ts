import type { Config } from 'jest'
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
})

// Add any custom config to be passed to Jest
const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  rootDir: './', modulePaths: ['<rootDir>'],
  moduleDirectories: ['node_modules', 'src'],
  moduleNameMapper:{
    "/src/(.*)": "<rootDir>/src/$1", // Ajusta la ruta si tu código fuente está en otra carpeta
  },
  // Add more setup options before each test is run
  // setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
}



// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config)