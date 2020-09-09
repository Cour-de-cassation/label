# Backend

## Troubleshooting

**When running `yarn compose:start`, I get a `Permission denied` error**

Run the following command in your terminal:
```
sudo chmod 666 /var/run/docker.sock
```