## hi!

Thanks for checking out our code. The documentation below may be incomplete or incorrect. We welcome pull requests! But we're a very small team, so we can't guarantee timely responses.

## Setup

First, run good old `npm install`. Also run this after changing anything in `bower.json` or `package.json`.

Create a file named `.env` in the root of the repo, with contents like this:

```
AWS_S3_BUCKET=hylo-dev
AWS_S3_CONTENT_URL=http://hylo-dev.s3.amazonaws.com
FB_CLIENTID=foo
FILEPICKER_API_KEY=foo
ROLLBAR_CLIENT_TOKEN=foo
SEGMENT_IO_KEY=foo
NEW_RELIC_LICENSE_KEY=foo
```

### Development server

Start it with `npm run start`, then visit `localhost:3001`. It watches changes to the Javascript and CSS files under `src`, and creates/updates the "bundle" files named `bundle.js` and `bundle.css` in the `dist/` directory.

It serves files in `dist/` and proxies all other requests to the "upstream" server. (see `Proxy behavior`)

#### Live Reload

Install [Live Reload browser extension](https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei?hl=en) and turn it on for the
localhost:3001 page by pressing the livereload button that was added to the toolbar next to the URL.

Once installed and turned on for the page, it will automatically reload your page after you make any changes
to the code.

### Proxy behavior

Requests that start with `/noo` are proxied to the Node API. Set its location with `--upstream`.

e.g.: `grunt dev --upstream localhost:1337`, aliased as `npm run dev`

### Deploying

Commit all your changes before deploying. The filenames of the deployed assets will include the first 8 characters of the most recent commit hash.

Make sure to have your [Heroku API token](https://heroku.com/account) to the `.env` file like so:

```
HEROKU_API_TOKEN=[your token here]
```

Run `grunt deploy --to=env`, where `app` is either `staging` or `production`. The task will upload assets to the app's S3 bucket and change the app's config variables to point to the newly-uploaded assets.
