/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import got from 'got';

const httpRequester = {
  async get(url: string) {
    const { body } = await got.get(url, {
      responseType: 'json',
    });

    return body;
  },

  async patch(url: string, data: any) {
    const { body } = await got.patch(url, {
      json: data,
      responseType: 'json',
    });

    return body;
  },

  async post(url: string, data: any) {
    const { body } = await got.post(url, {
      json: data,
      responseType: 'json',
    });

    return body;
  },
};

export { httpRequester };
