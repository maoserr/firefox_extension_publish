import * as core from '@actions/core'

export interface FirefoxInputs {
    extensionId: string
    apiKey: string
    apiSecret: string
    file: string
    srcFile: string
}

/**
 * Gets input for this action from Actions API
 */
export function getWebStoreInputs(): FirefoxInputs {
    const inp = {
        extensionId: core.getInput("firefox_extension_id", {required: true}),
        apiKey: core.getInput("api_key", {required: true}),
        apiSecret: core.getInput("api_secret", {required: true}),
        file: core.getInput("file", {required: true}),
        srcFile: core.getInput("src_file")
    }
    return inp
}
