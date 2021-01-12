import { Express } from 'express';
import { mapValues } from 'lodash';
import { apiSchema, apiSchemaMethodNameType } from '@label/core';
import { controllers } from './controllers';

export { buildApi };

const API_BASE_URL = '/api';

function buildApi(app: Express) {
  const methodNames = (Object.keys(
    apiSchema,
  ) as any) as apiSchemaMethodNameType[];

  methodNames.map((methodName) => buildMethod(app, methodName));
}

function buildMethod(app: Express, methodName: apiSchemaMethodNameType) {
  switch (methodName) {
    case 'get':
      buildGetRoutes(app);
      break;
    case 'post':
      buildPostRoutes(app);
      break;
  }
}

function buildGetRoutes(app: Express) {
  const getRoutes = (Object.keys(apiSchema.get) as any) as Array<
    keyof typeof apiSchema['get']
  >;

  getRoutes.forEach((getRoute) => {
    app.get(
      `${API_BASE_URL}/${getRoute}`,
      buildController('get', controllers.get[getRoute]),
    );
  });
}

function buildPostRoutes(app: Express) {
  const postRoutes = (Object.keys(apiSchema.post) as any) as Array<
    keyof typeof apiSchema['post']
  >;

  postRoutes.forEach((postRoute) => {
    app.post(
      `${API_BASE_URL}/${postRoute}`,
      buildController('post', controllers.post[postRoute]),
    );
  });
}

function buildController(method: apiSchemaMethodNameType, controller: any) {
  /* eslint-disable @typescript-eslint/no-unsafe-assignment */
  /* eslint-disable @typescript-eslint/no-unsafe-member-access */
  /* eslint-disable @typescript-eslint/no-unsafe-call */
  /* eslint-disable @typescript-eslint/no-unsafe-return */
  return async (req: any, res: any, next: any) => {
    try {
      const response = await executeController();
      res.send(response);
    } catch (error) {
      res.status(500);
      next(error);
    }

    async function executeController() {
      switch (method) {
        case 'get':
          const sanitizedQuery = mapValues(req.query, (queryValue) =>
            JSON.parse(queryValue),
          );
          return controller({ headers: req.headers, args: sanitizedQuery });
        case 'post':
          return controller({ headers: req.headers, args: req.body });
      }
    }
  };
}
