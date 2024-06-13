export default {
    preset: "ts-jest",
    testEnvironment: "node",
    moduleNameMapper: {
        "^@src/(.*)$": "<rootDir>/src/$1"
    },
    extensionsToTreatAsEsm: [".ts"],
    globals: {
        "ts-jest": {
            useESM: true
        }
    }
};
