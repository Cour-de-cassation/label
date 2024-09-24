import axios, {AxiosError, AxiosResponse} from "axios";

export class SsoUserRepository {
    async callSso() : Promise<any> {
        return await axios({
            method: 'get',
            baseURL: `http://localhost:3005/saml`,
            url: `/metadata`,
        })
            .then((response: AxiosResponse) => {
                if (response.status != 200) {
                    throw new Error(`${response.status} ${response.statusText}`);
                } else {
                    return response.data as Record<string, unknown>;
                }
            })
            .catch((error: AxiosError) => {
                if (error.response) {
                    throw new Error(
                        `${error.response.status} ${error.response.statusText}`,
                    );
                }
                throw new Error(`${error.code ?? 'Unknown'} on /saml`);
            });
    }
}