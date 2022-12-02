import got from "got";
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

    async uploadExisting(readStream: fs.ReadStream) {
        const token = await this.checkToken()
        return got
            .put(
                `${this.rootURL}/upload/chromewebstore/v1.1/items/${this.extensionId}`,
                {
                    headers: this._headers(token),
                    body: readStream,
                })
            .json();
    }

    async publish(target = 'default') {
        const token = await this.checkToken()
        return got
            .post(
                `${this.rootURL}/chromewebstore/v1.1/items/` +
                `${this.extensionId}/publish?publishTarget=${target}`,
                {
                    headers: this._headers(token),
                })
            .json();
    }

    async get(projection = 'DRAFT') {
        const token = await this.checkToken()
        return got
            .get(
                `${this.rootURL}/chromewebstore/v1.1/items/` +
                `${this.extensionId}?projection=${projection}`,
                {
                    headers: this._headers(token),
                })
            .json();
    }

    private async checkToken(): Promise<string> {
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

    private _headers(token: string) {
        return {
            Authorization: `Bearer ${token}`,
            'x-goog-api-version': '2',
        };
    }
}
