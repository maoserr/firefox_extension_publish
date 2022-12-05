import {sign} from "jsonwebtoken"
import fs from "fs";
import {got, Response} from "got";

export class MozillaWebStore {
    readonly extensionId: string
    readonly apiKey: string
    readonly apiSecret: string
    readonly rootURL: string = 'https://addons.mozilla.org'

    /**
     * Creates a new instance of the webstore
     * @param extensionId Extension ID
     * @param apiKey API Key
     * @param apiSecret API Secret
     */
    constructor(extensionId: string,
                apiKey: string,
                apiSecret: string
    ) {
        this.extensionId = extensionId
        this.apiKey = apiKey
        this.apiSecret = apiSecret
    }

    async uploadExisting(readStream: fs.ReadStream, wait: boolean = true) {
        const hdr = await this.setHeaders()
        got.post(
            `${this.rootURL}/api/v5/addons/upload/`,
            {
                headers: hdr,
                body: ""
            }
        )
    }

    async createNewVersion(readStream: fs.ReadStream) {
        const hdr = await this.setHeaders()
        got.post(
            `${this.rootURL}/api/v5/addons/addon/${this.extensionId}/versions/`,
            {
                headers: hdr,
                body: JSON.stringify({})
            }
        )

    }

    /**
     * Gets a new token
     * @private
     */
    private async getToken(): Promise<string> {
        const issuedAt = Math.floor(Date.now() / 1000);
        const payload = {
            iss: this.apiKey,
            jti: Math.random().toString(),
            iat: issuedAt,
            exp: issuedAt + 60,
        };

        return sign(payload, this.apiSecret, {
            algorithm: 'HS256',  // HMAC-SHA256 signing algorithm
        })
    }

    /**
     * Sets header for any API calls
     * @private
     */
    private async setHeaders(): Promise<any> {
        const token = await this.getToken()
        return {
            Authorization: `JWT ${token}`
        }
    }
}
