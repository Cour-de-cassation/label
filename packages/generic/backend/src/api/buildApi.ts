import { Express } from 'express';
import { mapValues } from 'lodash';
import { CustomError, httpStatusCodeHandler } from 'sder-core';
import { apiSchema, apiSchemaMethodNameType } from '@label/core';
import { logger } from '../utils';
import { controllers } from './controllers';
import { ssoService } from '../modules/sso';

export { buildApi };

const API_BASE_URL = '/label/api';

function buildApi(app: Express) {
  const methodNames = (Object.keys(
    apiSchema,
  ) as any) as apiSchemaMethodNameType[];

  methodNames.map((methodName) => buildMethod(app, methodName));

  // urls SSO
  buildApiSso(app);
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

function buildController(
  method: apiSchemaMethodNameType,
  controller: (param: {
    headers: any;
    args: any;
    session: any;
    path: string;
  }) => Promise<any>,
) {
  /* eslint-disable @typescript-eslint/no-unsafe-assignment */
  /* eslint-disable @typescript-eslint/no-unsafe-member-access */
  /* eslint-disable @typescript-eslint/no-unsafe-call */
  /* eslint-disable @typescript-eslint/no-unsafe-return */
  return async (req: any, res: any, next: any) => {
    try {
      const { data, statusCode } = await executeController();
      res.status(statusCode);
      res.send(data);
    } catch (error) {
      logger.error({ operationName: 'buildController', msg: `${error}` });

      if (error instanceof CustomError) {
        res.status(error.statusCode);
      } else {
        res.status(httpStatusCodeHandler.HTTP_STATUS_CODE.ERROR.SERVER_ERROR);
      }

      next(error);
    }

    async function executeController(): Promise<{
      data: any;
      statusCode: number;
    }> {
      switch (method) {
        case 'get':
          const sanitizedQuery = mapValues(req.query, (queryValue) =>
            JSON.parse(queryValue),
          );
          return {
            data: await controller({
              headers: req.headers,
              args: sanitizedQuery,
              session: req.session,
              path: req.path,
            }),
            statusCode: httpStatusCodeHandler.HTTP_STATUS_CODE.SUCCESS.OK,
          };
        case 'post':
          return {
            data: await controller({
              headers: req.headers,
              args: req.body,
              session: req.session,
              path: req.path,
            }),
            statusCode: httpStatusCodeHandler.HTTP_STATUS_CODE.SUCCESS.CREATED,
          };
      }
    }
  };
}

function buildApiSso(app: Express) {
  app.get(`${API_BASE_URL}/sso/metadata`, async (req, res) => {
    try {
      const xml = await ssoService.getMetadata();
      res.type('application/xml').send(xml);
    } catch (err) {
      res
        .status(httpStatusCodeHandler.HTTP_STATUS_CODE.ERROR.SERVER_ERROR)
        .send(`Metadata SAML protocol erreur ${err}`);
    }
  });

  app.get(`${API_BASE_URL}/sso/login`, async (req, res) => {
    try {
      const context = await ssoService.login();
      res.redirect(context);
    } catch (err) {
      await logger.error({
        operationName: 'login SSO ',
        msg: `${err}`,
      });
      res
        .status(
          httpStatusCodeHandler.HTTP_STATUS_CODE.ERROR.AUTHENTICATION_ERROR,
        )
        .json({ status: 401, message: err.message });
    }
  });

  app.get(`${API_BASE_URL}/sso/logout`, (req, res) => {
    const nameID = String(req.session.user?.email);
    const sessionIndex = String(req.session.user?.sessionIndex);
    req.session.destroy(async (err) => {
      if (err) {
        res.status(httpStatusCodeHandler.HTTP_STATUS_CODE.ERROR.SERVER_ERROR);
      }
      try {
        const context = await ssoService.logout({ nameID, sessionIndex });
        res.redirect(context);
      } catch (err) {
        await logger.error({
          operationName: 'logoutSso SamlService ',
          msg: `${err}`,
        });
        res
          .status(httpStatusCodeHandler.HTTP_STATUS_CODE.ERROR.SERVER_ERROR)
          .json({ status: 500, message: err.message });
      }
    });
  });

  app.get(`${API_BASE_URL}/sso/whoami`, (req, res) => {
    const user = req.session?.user ?? null;
    if (!user) {
      return res
        .status(
          httpStatusCodeHandler.HTTP_STATUS_CODE.ERROR.AUTHENTICATION_ERROR,
        )
        .send({ status: 401, message: `Session invalid or expired` });
    }
    res.type('application/json').send(user);
  });

  app.post(`${API_BASE_URL}/sso/acs`, async (req, res) => {
    try {
      const url = await ssoService.acs(req);
      res.redirect(url);
    } catch (err) {
      res
        .status(httpStatusCodeHandler.HTTP_STATUS_CODE.ERROR.SERVER_ERROR)
        .json({ status: 500, message: err.message });
    }
  });
}
