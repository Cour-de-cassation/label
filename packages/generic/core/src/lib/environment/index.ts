export type { environmentType };

type environmentType = {
  dbName: string;
  pathName: {
    nlpApi: string;
    server: string;
    db: string;
    db_api: string;
  };
  port: {
    nlpApi: number;
    server: number;
    db: number;
    db_api: string;
  };
  api_key: {
    db_api: string;
  };
  version: {
    db_api: string;
  };
  db_api_enabled: boolean;
};
