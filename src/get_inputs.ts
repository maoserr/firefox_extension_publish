import * as core from '@actions/core'

export interface ChromeInputs {
    extensionId: string
    clientId: string
    refreshToken: string
    clientSecret?: string
    file: string
}

export interface FirefoxInputs {
    extensionId: string
    apiKey: string
    apiSecret: string
    file: string
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
            clientId: core.getInput(""),
            refreshToken: core.getInput(""),
            clientSecret: core.getInput(""),
            file: core.getInput("")
        }
    }
    const ff_id = core.getInput("firefox_extension_id")
    if (ff_id) {
        inp.firefox = {
            extensionId: ff_id,
            apiKey: core.getInput(""),
            apiSecret: core.getInput(""),
            file: core.getInput("")
        }
    }
    return inp
}
