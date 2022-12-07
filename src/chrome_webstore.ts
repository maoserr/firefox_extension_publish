import fetch from "node-fetch";
import fs from "fs";

/**
 * API Client for Chrome Web Store
 */
export class ChromeWebStore {
    readonly extensionId: string;
    readonly clientId: string;
    readonly refreshToken: string;
    readonly clientSecret?: string;
    readonly rootURL: string = "https://www.googleapis.com";
    private token?: string;


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

        this.extensionId = extensionId;
        this.clientId = clientId;
        this.refreshToken = refreshToken;

        if (clientSecret) {
            this.clientSecret = clientSecret;
        }
    }

    /**
     * Uploads to an existing extension
     * @param file File to upload
     */
    async uploadExisting(file: fs.ReadStream | string): Promise<any> {
        const hdr = await this.setHeaders();
        let readStream: fs.ReadStream
        if (typeof file === "string") {
            readStream = fs.createReadStream(file)
        } else {
            readStream = file
        }
        const resp = await fetch(
            `${this.rootURL}/upload/chromewebstore/v1.1/items/${this.extensionId}`,
            {
                method: "PUT",
                headers: hdr,
                body: readStream
            });
        const resp_body = await resp.json()
        if (!resp.ok) {
            throw new Error(`Invalid response: ${resp.statusText}, ` +
                `${JSON.stringify(resp_body)}`)
        }
        return resp_body
    }

    /**
     * Publish the extension
     * @param target Target group
     */
    async publish(target = "default"): Promise<any> {
        const response = await fetch(
            `${this.rootURL}/chromewebstore/v1.1/items/` +
            `${this.extensionId}/publish?publishTarget=${target}`,
            {
                method: "POST",
                headers: await this.setHeaders()
            });
        const resp_body = await response.json()
        if (!response.ok) {
            throw new Error(`Invalid response: ${response.statusText}, ` +
                `${JSON.stringify(resp_body)}`)
        }
        return resp_body
    }

    /**
     * Gets an extension's info
     * @param projection
     */
    async get(projection = "DRAFT"): Promise<any> {
        const hdr = await this.setHeaders()
        const res = await fetch(
            `${this.rootURL}/chromewebstore/v1.1/items/` +
            `${this.extensionId}?projection=${projection}`,
            {
                method: "GET",
                headers: hdr
            });

        return res.json()
    }

    /**
     * Clears token
     */
    clearToken(): void {
        this.token = undefined;
    }

    /**
     * Check if a new token is needed
     * @private
     */
    private async checkToken(): Promise<string> {
        if (this.token) {
            return this.token!;
        }
        const refreshTokenURI = "https://www.googleapis.com/oauth2/v4/token";
        let json: any = {
            client_id: this.clientId,
            refresh_token: this.refreshToken,
            grant_type: "refresh_token"
        };

        if (this.clientSecret) {
            json.client_secret = this.clientSecret;
        }

        const response = await fetch(refreshTokenURI,
            {method: "POST", body: JSON.stringify(json)});
        const resp_body: any = await response.json()
        this.token = resp_body.access_token;
        return this.token!;
    }

    /**
     * Sets header for any API calls
     * @private
     */
    private async setHeaders(): Promise<any> {
        await this.checkToken().then();
        return {
            Authorization: `Bearer ${this.token}`,
            "x-goog-api-version": "2"
        };
    }
}
