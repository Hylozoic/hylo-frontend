hylo-frontend
=============

## Setup

First, run good old `npm install`. Also run this after changing anything in `bower.json` or `package.json`.

Create a file named `.env` in the root of the repo, and add your [Heroku API token](https://heroku.com/account).

### Development server

Start it with `grunt dev`, then visit `localhost:3001`. It watches changes to the Javascript and CSS files under `src`, and creates/updates the "bundle" files named `bundle.js` and `bundle.css` in the `dist/` directory.

It serves files in `dist/` and proxies all other requests to the "upstream" servers.

#### Live Reload

Install [Live Reload browser extension](https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei?hl=en) and turn it on for the
localhost:3001 page by pressing the livereload button that was added to the toolbar next to the URL.

Once installed and turned on for the page, it will automatically reload your page after you make any changes
to the code.

### Proxy behavior

Requests that start with `/noo` are proxied to the Node upstream, which is `hylo-node-dev.herokuapp.com` by default. Change it with `--node-upstream`.

All other requests are proxied to `hylo-dev.herokuapp.com` by default. Change it with `--upstream`.

e.g.: `grunt dev --upstream localhost:9000 --node-upstream localhost:1337`

### Deploying

Commit all your changes before deploying. The filenames of the deployed assets will include the first 8 characters of the most recent commit hash.

Run `grunt bundle deploy:app`, where `app` is the name of a Heroku app, e.g. "hylo-staging". The task will upload assets to the app's S3 bucket and change the app's config variables to point to the newly-uploaded assets.
