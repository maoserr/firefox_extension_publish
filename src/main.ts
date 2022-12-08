import * as core from '@actions/core'
import {getWebStoreInputs, FirefoxInputs} from "./get_inputs.js";
import {MozillaWebStore} from "webextension-store";


/**
 * Runs the Firefox store logic
 * @param inp
 */
async function runFirefox(inp: FirefoxInputs): Promise<void> {
    try {
        core.info(`Uploading Firefox extension ${inp.extensionId}...`)

        const store = new MozillaWebStore(
            inp.extensionId,
            inp.apiKey,
            inp.apiSecret
        )
        const ff_res = await store.uploadPackage(inp.file)
        core.info(JSON.stringify(ff_res))
        const new_res = await store.createNewVersion(ff_res.uuid, inp.srcFile)
        core.info(JSON.stringify(new_res))
    } catch (error) {
        if (error instanceof Error) core.setFailed(error.message)
    }
}

/**
 * Run all
 */
async function run(): Promise<void> {
    if(core.getInput("test")){
        core.info("Skipping workflow due to test flag")
        return
    }
    core.info("Running webstore upload workflow.")
    const inputs = getWebStoreInputs()
    await runFirefox(inputs)
}

run().then()
