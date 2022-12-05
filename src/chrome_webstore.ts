import {got, Response} from "got";
import fs from "fs";

/**
 * API Client for Chrome Web Store
 */
export class ChromeWebStore {
    readonly extensionId: string
    readonly clientId: string
    readonly refreshToken: string
    readonly clientSecret?: string
    readonly rootURL: string = 'https://www.googleapis.com'
    private token?: string


    /**
     * Creates a new instance of the webstore
     * @param extensionId Extension ID
     * @param clientId Client ID
     * @param refreshToken Refresh Token
     * @param clientSecret (Optional) Client Secret
     */
    constructor(extensionId: string,
                clientId: string,
                refreshToken: string,
                clientSecret?: string
    ) {

        this.extensionId = extensionId
        this.clientId = clientId
        this.refreshToken = refreshToken

        if (clientSecret) {
            this.clientSecret = clientSecret;
        }
    }

    /**
     * Uploads to an existing extension
     * @param readStream FS readStream
     */
    async uploadExisting(readStream: fs.ReadStream):Promise<Response> {
        const hdr = await this.setHeaders()
        return got
            .put(
                `${this.rootURL}/upload/chromewebstore/v1.1/items/${this.extensionId}`,
                {
                    headers: hdr,
                    body: readStream,
                })
            .json();
    }

    /**
     * Uploads to an existing extension
     * @param file
     */
    async uploadExistingFile(file: string):Promise<Response> {
        const zipfile = fs.createReadStream(file)
        return this.uploadExisting(zipfile)
    }
    /**
     * Publish the extension
     * @param target Target group
     */
    async publish(target = 'default'): Promise<Response>{
        return got
            .post(
                `${this.rootURL}/chromewebstore/v1.1/items/` +
                `${this.extensionId}/publish?publishTarget=${target}`,
                {
                    headers: await this.setHeaders(),
                })
            .json();
    }

    /**
     * Gets an extension's info
     * @param projection
     */
    async get(projection = 'DRAFT'):Promise<Response> {
        return got
            .get(
                `${this.rootURL}/chromewebstore/v1.1/items/` +
                `${this.extensionId}?projection=${projection}`,
                {
                    headers: await this.setHeaders(),
                })
            .json();
    }

    /**
     * Clears token
     */
    clearToken(): void {
        this.token = undefined
    }

    /**
     * Check if a new token is needed
     * @private
     */
    private async checkToken(): Promise<string> {
        if (this.token) {
            return this.token!
        }
        const refreshTokenURI = 'https://www.googleapis.com/oauth2/v4/token';
        let json: any = {
            client_id: this.clientId,
            refresh_token: this.refreshToken,
            grant_type: 'refresh_token',
        };

        if (this.clientSecret) {
            json.client_secret = this.clientSecret;
        }

        const response: any = await got.post(refreshTokenURI, {json}).json();
        this.token = response.access_token
        return this.token!
    }

    /**
     * Sets header for any API calls
     * @private
     */
    private async setHeaders():Promise<any> {
        await this.checkToken().then()
        return {
            Authorization: `Bearer ${this.token}`,
            'x-goog-api-version': '2',
        };
    }
}
