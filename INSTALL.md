# Installation guide

## Requirements

- NodeJs v16

## Installation

Install the frontend with:

```sh
yarn
```

Install the backend with:

```sh
yarn buildLocalDevDocker
```

## Launch

For the first launch, you need to have example data. To do so, follow the `Add documents you want to annotate` step in the [reuser guide](docs/reuserGuide.md) or just rename the `storage-example` folder to `storage`.

Run in two different terminals:

```sh
yarn startLocalDevDocker
```

```sh
yarn startLocalClientDev
```

The container will be started with a database with fresh data.

Then, on your web browser, open http://localhost:55432

## Troubleshooting

To use mongo, you need to run in your terminal:

```
sudo chmod 666 /var/run/docker.sock
```
