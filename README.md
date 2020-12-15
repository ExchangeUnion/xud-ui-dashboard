# XUD UI DASHBOARD

A graphical user interface for interacting with a [xud-docker](https://github.com/ExchangeUnion/xud-docker) environment.

## Development

### Requirements

- Node v12.1.0+
- Yarn

### Install dependencies

`yarn`

### Start in development mode

- Make a copy of `.env.example` and name it `.env`.
- Set a value for `REACT_APP_API_URL` to match with the url you have an [xud-docker-api](https://github.com/ExchangeUnion/xud-docker-api) accessible.
- `yarn start`
- If the connection between the dashboard and [xud-docker-api](https://github.com/ExchangeUnion/xud-docker-api) cannot be established, try navigating to the `REACT_APP_API_URL` via the browser and accepting its certificate.

### Tests

`yarn test`

### Lint

`yarn lint`
