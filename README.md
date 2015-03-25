hylo-frontend
=============

## Setup

First, run good old `npm install`. Also run this after changing anything in `bower.json` or `package.json`.

Create a file named `.env` in the root of the repo, and these development properties:

```
AWS_S3_BUCKET=hylo-dev
AWS_S3_CONTENT_URL=http://hylo-dev.s3.amazonaws.com
FB_CLIENTID=186895474801147
FILEPICKER_API_KEY=AIJP3OgRmRXWz4i7IHv1Lz
ROLLBAR_CLIENT_TOKEN=a351dee7c5074bf7a54e317aeca379f2
SEGMENT_IO_KEY=x21s22l2gt
NEW_RELIC_LICENSE_KEY=ca3a46107243dea4e082cdd4702e056d1910c9f8
```

### Development server

Start it with `npm run start`, then visit `localhost:3001`. It watches changes to the Javascript and CSS files under `src`, and creates/updates the "bundle" files named `bundle.js` and `bundle.css` in the `dist/` directory.

It serves files in `dist/` and proxies all other requests to the "upstream" servers (see `Proxy behavior`)

#### Live Reload

Install [Live Reload browser extension](https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei?hl=en) and turn it on for the
localhost:3001 page by pressing the livereload button that was added to the toolbar next to the URL.

Once installed and turned on for the page, it will automatically reload your page after you make any changes
to the code.

### Proxy behavior

Requests that start with `/noo` are proxied to the Node upstream, which is `hylo-node-dev.herokuapp.com` by default. Change it with `--node-upstream`.

All other requests are proxied to `hylo-dev.herokuapp.com` by default. Change it with `--upstream`.

e.g.: `grunt dev --upstream localhost:9000 --node-upstream localhost:1337`

#### Shortcuts

Use `npm run start-local` as an alias for setting both `play` and `node` upstreams to local. ie: `grunt dev --upstream localhost:9000 --node-upstream localhost:1337`

Use `npm run start-node-local` as an alias for setting ONLY `node` upstream to local.  ie: `grunt dev --node-upstream localhost:1337`

### Deploying

Commit all your changes before deploying. The filenames of the deployed assets will include the first 8 characters of the most recent commit hash.

Make sure to have your [Heroku API token](https://heroku.com/account) to the `.env` file like so:

```
HEROKU_API_TOKEN=[your token here]
```

Run `grunt bundle deploy:app`, where `app` is the name of a Heroku app, e.g. "hylo-staging". The task will upload assets to the app's S3 bucket and change the app's config variables to point to the newly-uploaded assets.
