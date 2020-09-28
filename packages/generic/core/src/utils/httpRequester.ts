/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import axios from "axios";

type httpRequestType = {
  data: any;
  headers: any;
  method: "get" | "post";
  url: string;
};

type httpResponseType = {
  data: any;
  statusCode: number;
};

const httpRequester = {
  async request({
    data,
    headers,
    method,
    url,
  }: httpRequestType): Promise<httpResponseType> {
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
