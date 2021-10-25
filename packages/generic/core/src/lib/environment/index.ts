export type { environmentType };

type environmentType = {
  dbName: string;
  pathName: {
    nlpApi: string;
    server: string;
    db: string;
  };
  port: {
    nlpApi: number;
    server: number;
    db: number;
  };
};
