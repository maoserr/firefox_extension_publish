import * as core from '@actions/core'
import fs from 'fs';
import chromeWebstoreUpload from "./chrome_webstore";

async function run(): Promise<void> {
    try {
        const secret_config: string = core.getInput('secret_name')
        const chrome_extension_id
        core.debug(`Waiting ${ms} milliseconds ...`) // debug is only output if you set the secret `ACTIONS_STEP_DEBUG` to true

        const store = chromeWebstoreUpload({
            extensionId: 'ecnglinljpjkbgmdpeiglonddahpbkeb',
            clientId: 'xxxxxxxxxx',
            clientSecret: 'xxxxxxxxxx',
            refreshToken: 'xxxxxxxxxx',
        });
        const myZipFile = fs.createReadStream('./mypackage.zip');
        const token = 'xxxx'; // optional. One will be fetched if not provided
        store.uploadExisting(myZipFile, token).then(res => {
            // Response is a Resource Representation
            // https://developer.chrome.com/webstore/webstore_api/items#resource
        });
        const target = 'default'; // optional. Can also be 'trustedTesters'
        const token = 'xxxx'; // optional. One will be fetched if not provided
        store.publish(target, token).then(res => {
            // Response is documented here:
            // https://developer.chrome.com/webstore/webstore_api/items/publish
        });
        core.debug(new Date().toTimeString())
        core.debug(new Date().toTimeString())

        core.setOutput('time', new Date().toTimeString())
    } catch (error) {
        if (error instanceof Error) core.setFailed(error.message)
    }
}

run()
