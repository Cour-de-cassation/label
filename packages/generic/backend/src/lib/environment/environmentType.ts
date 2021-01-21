export type { environmentType };

type environmentType = {
  dbName: string;
  pathName: {
    server: string;
    db: string;
  };
  port: {
    server: number;
    db: number;
  };
};
