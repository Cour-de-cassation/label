# Label

EIG 4 promotion

URL of the challenge: https://entrepreneur-interet-general.etalab.gouv.fr/defis/2020/label.html

## Docker Backend

To run the backend, use the command associate yarn docker command:

```sh
# Build the container
yarn dockerBackendBuild
# Run the container
yarn dockerBackendStart
```

The container will be started with a database with fresh data.

## Troubleshooting

To use mongo, you need to run in your terminal:

```
sudo chmod 666 /var/run/docker.sock
```
