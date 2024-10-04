// jest.config.js
module.exports = {
	preset: 'ts-jest', // Use ts-jest preset
	testEnvironment: 'node', // Set the test environment to Node.js
	testPathIgnorePatterns: ['/node_modules/', '/dist/'], // Ignore certain paths
	moduleNameMapper: {
		'^src/(.*)$': '<rootDir>/src/$1', // Path mapping for src
	},
};
