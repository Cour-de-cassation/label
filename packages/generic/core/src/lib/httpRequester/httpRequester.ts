/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import axios from 'axios';

type httpRequestType<RequestDataType> = {
  data: RequestDataType;
  headers: any;
  method: 'get' | 'post';
  url: string;
};

type httpResponseType<ResponseDataType> = {
  data: ResponseDataType;
  statusCode: number;
};

const httpRequester = {
  async request<RequestDataType = any, ResponseDataType = any>({
    data,
    headers,
    method,
    url,
  }: httpRequestType<RequestDataType>): Promise<
    httpResponseType<ResponseDataType>
  > {
    const response = await axios({
      data,
      headers,
      method,
      url,
    });

    return {
      data: response.data,
      statusCode: response.status,
    };
  },
};

export { httpRequester };
