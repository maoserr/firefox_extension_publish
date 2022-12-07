import {sign} from "jsonwebtoken";
import fs from "fs";
import fetch from "node-fetch";
import FormData from "form-data"

export class MozillaWebStore {
    readonly extensionId: string;
    readonly apiKey: string;
    readonly apiSecret: string;
    readonly rootURL: string = "https://addons.mozilla.org";

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
        this.extensionId = extensionId;
        this.apiKey = apiKey;
        this.apiSecret = apiSecret;
    }

    /**
     *
     * @param file Extension package file
     * @param channel "listed" or "unlisted"
     * @param wait Wait for file to finish processing
     */
    async uploadPackage(file: fs.ReadStream | string,
                        channel: string = "listed",
                        wait: boolean = true): Promise<any> {
        const formData = new FormData()
        if (typeof file === "string") {
            formData.append("upload", fs.createReadStream(file))

        } else {
            formData.append("upload", file)
        }
        formData.append("channel", channel)
        const hdr = await this.setHeaders();

        const res = await fetch(
            `${this.rootURL}/api/v5/addons/upload/`,
            {method: "POST", headers: hdr, body: formData}
        );
        const resp_body = await res.json()
        if (!res.ok) {
            throw new Error(`Invalid response: ${res.statusText}, ` +
                `${JSON.stringify(resp_body)}`)
        }
        if (wait) {
            return this.waitPackage(resp_body)
        }
        return resp_body;
    }

    /**
     * Waits for package to finish validation or error
     * @param resp_body Response body
     */
    async waitPackage(resp_body: any): Promise<any> {
        const uuid = resp_body.uuid
        let finished = false
        const max_wait = 120
        const wait_interval = 5
        let res = resp_body
        for (let i = 0; i < max_wait; i + wait_interval) {
            if (res.processed || res.submitted) {
                finished = true
                break
            }
            await new Promise(resolve => setTimeout(resolve, wait_interval*1000));
            res = await this.checkPackage(uuid)
        }
        if (!finished) {
            throw Error("Maximum timeout reached while waiting for validation...")
        }
        return res
    }

    /**
     * Check package upload status
     * @param uuid UUID of the package
     * @private
     */
    private async checkPackage(uuid: string): Promise<any> {
        const hdr = await this.setHeaders();
        const response = await fetch(
            `${this.rootURL}/api/v5/addons/upload/${uuid}/`,
            {
                method:"GET",
                headers:hdr
            }
        )
        const resp_body = await response.json()
        if (!response.ok) {
            throw new Error(`Invalid response: ${response.statusText}, ` +
                `${JSON.stringify(resp_body)}`)
        }
        return resp_body
    }

    /**
     * Creates a new version
     * @param uuid UUID of upload
     * @param srcfile (Optional) srcfile
     */
    async createNewVersion(uuid:string, srcfile?: fs.ReadStream | string):Promise<any> {
        const formData = new FormData()
        if (srcfile && typeof(srcfile) === "string") {
            formData.append("source", fs.createReadStream(srcfile))
        } else if (srcfile) {
            formData.append("source", srcfile)
        } else {
            formData.append("source","")
        }
        const hdr = await this.setHeaders();
        const res = await fetch(
            `${this.rootURL}/api/v5/addons/addon/${this.extensionId}/versions/`,
            {
                method: "POST",
                headers: hdr,
                body: formData
            }
        );
        const resp_body = await res.json()
        if (!res.ok) {
            throw new Error(`Invalid response: ${res.statusText}, ` +
                `${JSON.stringify(resp_body)}`)
        }
        return resp_body
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
            exp: issuedAt + 60
        };

        return sign(payload, this.apiSecret, {
            algorithm: "HS256"  // HMAC-SHA256 signing algorithm
        });
    }

    /**
     * Sets header for any API calls
     * @private
     */
    private async setHeaders(): Promise<any> {
        const token = await this.getToken();
        return {
            Authorization: `JWT ${token}`
        };
    }
}
