import * as core from '@actions/core'

export interface ChromeInputs {
    extensionId: string
    clientId: string
    refreshToken: string
    clientSecret?: string
    file: string
    publish: boolean
}

export interface FirefoxInputs {
    extensionId: string
    apiKey: string
    apiSecret: string
    file: string
    srcFile: string
}

interface WebStoreInputs {
    chrome?: ChromeInputs
    firefox?: FirefoxInputs
}

/**
 * Gets input for this action from Actions API
 */
export function getWebStoreInputs(): WebStoreInputs {
    let inp: WebStoreInputs = {}
    const chrome_id = core.getInput("chrome_extension_id")
    if (chrome_id) {
        inp.chrome = {
            extensionId: chrome_id,
            clientId: core.getInput("client_id", {required: true}),
            refreshToken: core.getInput("refresh_token", {required: true}),
            clientSecret: core.getInput("client_secret", {required: true}),
            file: core.getInput("file", {required: true}),
            publish: core.getBooleanInput("publish")
        }
    }
    const ff_id = core.getInput("firefox_extension_id")
    if (ff_id) {
        inp.firefox = {
            extensionId: ff_id,
            apiKey: core.getInput("api_key"),
            apiSecret: core.getInput("api_secret"),
            file: core.getInput("file"),
            srcFile: core.getInput("src_file")
        }
    }
    return inp
}
