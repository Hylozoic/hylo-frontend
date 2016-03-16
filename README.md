## hi!

Thanks for checking out our code. The documentation below may be incomplete or incorrect. We welcome pull requests! But we're a very small team, so we can't guarantee timely responses.

[![Code Climate](https://codeclimate.com/github/Hylozoic/hylo-frontend/badges/gpa.svg)](https://codeclimate.com/github/Hylozoic/hylo-frontend)

## Setup

First, run good old `npm install`. Also run this after changing anything in `bower.json` or `package.json`.

Create a file named `.env` in the root of the repo, with contents like this:

```
ASSET_HOST_URL=http://localhost:1337
AWS_S3_BUCKET=hylo-dev
AWS_S3_CONTENT_URL=http://hylo-dev.s3.amazonaws.com
FACEBOOK_APP_ID=foo
SLACK_APP_CLIENT_ID=foo
FILEPICKER_API_KEY=foo
HEROKU_API_TOKEN=foo
ROLLBAR_CLIENT_TOKEN=foo
SEGMENT_KEY=foo
NEW_RELIC_LICENSE_KEY=foo
BRANCH_API_KEY=foo
```

`ASSET_HOST_URL` and `AWS_S3_CONTENT_URL` are identical on staging and production, but not in development. In development we want the asset server to serve assets locally, but uploaded files are always saved to S3.

### Asset server

Start it with `npm run start`. It watches changes to the Javascript, CSS, and HTML files under `src`, and creates output files in `dist`, which it serves at `localhost:1337` by default.

#### Live Reload

Install [Live Reload browser extension](https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei?hl=en) and turn it on for the browser tab in which you're doing development work by pressing the button that was added by the extension.

Once installed and turned on for the page, it will automatically reload your page after you make any changes to the code.

### Deploying

Commit all your changes before deploying. The filenames of the deployed assets will include the first 8 characters of the most recent commit hash.

Make sure to have your [Heroku API token](https://heroku.com/account) to the `.env` file like so:

```
HEROKU_API_TOKEN=[your token here]
```

Run `grunt deploy --to=env`, where `app` is either `staging` or `production`. The task will upload assets to the app's S3 bucket and change the app's config variables to point to the newly-uploaded assets.

## License

    Hylo is a mobile and web application to help people do more together. 
    Hylo helps communities better understand who in their community has what skills, 
    and how they can create things together.
    Copyright (C) 2016, Hylozoic, Inc.

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
