# 🚢 Ship: deploy webhook

> Ship is a simple, efficient deploy webhook for GitHub, designed to automate deployment workflows. It provides a fast and secure way to automate deployments upon GitHub push events.

## Features

- Rate limiting to prevent abuse
- CORS and Helmet for enhanced security
- Signature verification for GitHub payloads
- Automated deployment upon push to the master branch

## Prerequisites

- Node.js (v14+ recommended)
- A GitHub repository
- Server access to deploy the webhook

## Installation

```bash
# Clone the repository
git clone https://github.com/yerofey/ship.git
cd ship
```

## Configuration

```bash
# Install dependencies
npm install
```

```bash
# Copy the example configuration file
cp env.example .env
```

## Usage

```bash
# Start the server (using pm2)
npm start
```

## Setup GitHub webhook

```bash
Payload URL: https://your-domain.com/webhook?repository=username/repo&branch=master&folder=/your-folder
Content-type: application/json
Secret: The same as GITHUB_SECRET in your .env file
Which events would you like to trigger this webhook? Select Just the push event.
```

## Requirements for your project

Your project must have a `package.json` file with a `start` script defined.
I also recommend using [pm2](https://pm2.keymetrics.io/) to manage your Node.js processes.

## Contributing

Contributions are welcome! Please feel free to submit a pull request.

## Author

[Yerofey S.](https://github.com/yerofey)

## License

[MIT](https://github.com/yerofey/ship/blob/master/LICENSE)
