import { dependencyManager } from './utils';

export { environment, environments };

const dbName = 'labelDb';

const ip = {
  db: '10.5.0.5',
  server: '10.5.0.6',
};

const port = {
  client: 55432,
  db: 55431,
  server: 55430,
};

const environments = {
  local: {
    dbName,
    port,
    ip,
    url: {
      client: `http://localhost:${port.client}`,
      db: `mongodb://${dbName}:${port.db}`,
      server: `http://localhost:${port.server}`,
    },
  },
  preProd: {
    dbName,
    ip,
    port,
    url: {
      client: `http://bkpanonym:${port.client}`,
      db: `mongodb://${ip.db}:${port.db}`,
      server: `http://bkpanonym:${port.server}`,
    },
  },
  prod: {
    dbName,
    ip,
    port,
    url: {
      client: `http://srpanonym:${port.client}`,
      db: `mongodb://${ip.db}:${port.db}`,
      server: `http://srpanonym:${port.server}`,
    },
  },
};

const environment = dependencyManager.inject({
  forLocal: environments.local,
  forPreProd: environments.preProd,
  forProd: environments.prod,
});
