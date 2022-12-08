# Webextension Publish

This GitHub action published web extensions Firefox web store.

Use `maoserr/firefox_extension_publish` for Firefox


To generate zip you can use the GitHub bash action definition below:

```yaml
      - name: Zip chrome
        run: zip -qq -r firefox.zip *
        working-directory: dist/firefox_prod
```

See full example: https://github.com/maoserr/epublifier/blob/develop/.github/workflows/build.yml

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

