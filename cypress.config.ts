import { defineConfig } from "cypress";
import webpack = require("@cypress/webpack-preprocessor");
import { addCucumberPreprocessorPlugin } from "@badeball/cypress-cucumber-preprocessor";
import { v4 as uuidv4 } from 'uuid';

async function setupNodeEvents(
    on: Cypress.PluginEvents,
    config: Cypress.PluginConfigOptions
): Promise<Cypress.PluginConfigOptions> {
    await addCucumberPreprocessorPlugin(on, config);

    on(
        "file:preprocessor",
        webpack({
            webpackOptions: {
                resolve: {
                    extensions: [".ts", ".js"],
                },
                module: {
                    rules: [
                        {
                            test: /\.ts$/,
                            exclude: [/node_modules/],
                            use: [
                                {
                                    loader: "ts-loader",
                                },
                            ],
                        },
                        {
                            test: /\.feature$/,
                            use: [
                                {
                                    loader: "@badeball/cypress-cucumber-preprocessor/webpack",
                                    options: config,
                                },
                            ],
                        },
                    ],
                },
            },
        })
    );

    return config;
}

export default defineConfig({
    defaultCommandTimeout: 30000,
    requestTimeout: 30000,
    responseTimeout: 30000,
    pageLoadTimeout: 60000,
    viewportHeight: 1080,
    viewportWidth: 1920,
    // numTestsKeptInMemory: 0,
    videoCompression: false,
    videosFolder: `./output/${uuidv4()}/videos`,
    screenshotsFolder: `./output/${uuidv4()}/screenshots`,
    screenshotOnRunFailure: true,
    projectId: "6fsma3",
    reporter: "junit",
    reporterOptions: {
        mochaFile: "results/output-[hash].xml",
    },
    retries: {
        runMode: 1,
        openMode: 0,
    },
    env: {
        host: "https://www.security.org/password-generator/"
    },
    e2e: {
        specPattern: ["**/*.feature"],
        supportFile: "cypress/support/e2e.ts",
        baseUrl: "https://www.security.org/password-generator/",
        setupNodeEvents,
    }
});