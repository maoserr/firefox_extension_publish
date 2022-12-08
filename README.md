# Webextension Publish

This GitHub action published web extensions to Chrome and Firefox web stores.

Use `maoserr/gitaction_webextension_publish/firefox` for Firefox

Use `maoserr/gitaction_webextension_publish/chrome` for Chrome

To generate zip you can use the GitHub bash action definition below:

```yaml
      - name: Zip chrome
        run: zip -qq -r chrome.zip *
        working-directory: dist/chrome_prod
```

## Chrome Setup

Required parameters:
 - chrome_extension_id: Your extension ID
 - client_id: See below
 - refresh_token: See below
 - client_secret: See below
 - file: The zip file containing the extension

Optional parameters:
 - publish: Defaults to true, disable to hold off on publishing


Follow this link to set up your access tokens:

Note that the `redirect_uri=urn:ietf:wg:oauth:2.0:oob` parameter is no longer supported by google. It is recommended
to use the loop back address as shown in the sample in the second link below.

https://developer.chrome.com/docs/webstore/using_webstore_api/

https://developers.google.com/identity/protocols/oauth2/native-app

Example URL
```
https://accounts.google.com/o/oauth2/v2/auth?
 scope=https://www.googleapis.com/auth/chromewebstore&
 response_type=code&
 redirect_uri=http%3A//127.0.0.1%3A9004&
 client_id=client_id
```

Example Post request (to get refresh token)
```
POST /token HTTP/1.1
Host: oauth2.googleapis.com
Content-Type: application/x-www-form-urlencoded

code=your_code
client_id=your_client_id&
client_secret=your_client_secret&
redirect_uri=http://127.0.0.1:9004&
grant_type=authorization_code
```


## Firefox setup

Required Parameters:
 - firefox_extension_id: Your extension ID
 - api_key: See below (also known as JWT issuer)
 - api_secret: See below (also known as JWT secret)
 - file: Extension zip file

Optional parameters:
 - src_file: File containing src

Note: you can generate src file easily with 

```bash
git archive --format zip --output src.zip develop
```


Follow this link to set up your access tokens:

https://addons.mozilla.org/en-US/developers/addon/api/key/

