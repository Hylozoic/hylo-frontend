hylo-frontend
=============

## Usage

Run `npm install` after cloning the repo or after changing anything in `bower.json` or `package.json`.

### Development server

* Start it with `grunt dev`, then visit `localhost:3001`.
* It will watch changes to the Javascript and CSS files under `src`, and create/update the "bundle" files named `bundle.js` and `bundle.css` in the `dist/` directory.
* It will serve files in `dist/` and proxy all other requests to the "upstream" server, which is `hylo-dev.herokuapp.com` by default. Change it with the `--upstream` option, e.g. `grunt dev --upstream localhost:9000`.

### Deploying

* Your Heroku API token needs to be set in the shell environment variable `HEROKU_API_TOKEN`. 
* You should have run `npm install` prior to performing this task for the first time
* Commit all your changes before deploying. The filenames of the deployed assets will include the first 8 characters of the most recent commit hash.
* Run `grunt bundle deploy:app`, where `app` is the name of a Heroku app, e.g. "hylo-staging". The task will upload assets to the app's S3 bucket and change the app's config variables to point to the newly-uploaded assets.