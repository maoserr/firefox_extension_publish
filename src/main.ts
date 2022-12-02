import * as fs from 'fs';
import * as core from '@actions/core'
import {ChromeWebStore} from "./chrome_webstore.js";
import {getWebStoreInputs, ChromeInputs, FirefoxInputs} from "./get_inputs.js";

/**
 * Runs the Chrome store logic
 * @param inp
 */
async function runChrome(inp: ChromeInputs): Promise<void> {
    try {
        core.info(`Uploading extension ${inp.extensionId}...`)

        const store = new ChromeWebStore(
            inp.extensionId,
            inp.clientId,
            inp.refreshToken,
            inp.clientSecret,
        );
        const myZipFile = fs.createReadStream(inp.file);
        store.uploadExisting(myZipFile).then((res: any) => {
            core.debug(res)
            // Response is a Resource Representation
            // https://developer.chrome.com/webstore/webstore_api/items#resource
        });
        store.publish().then((res: any) => {
            core.debug(res)
            // Response is documented here:
            // https://developer.chrome.com/webstore/webstore_api/items/publish
        });
    } catch (error) {
        if (error instanceof Error) core.setFailed(error.message)
    }
}

/**
 * Runs the Firefox store logic
 * @param inp
 */
async function runFirefox(inp:FirefoxInputs): Promise<void> {

}

/**
 * Run all
 */
async function run(): Promise<void> {
    core.info("Running webstore upload workflow.")
    const inputs = getWebStoreInputs()
    if (inputs.chrome) {
        await runChrome(inputs.chrome)
    }
    if (inputs.firefox) {
        await runFirefox(inputs.firefox)
    }
}

run().then()
