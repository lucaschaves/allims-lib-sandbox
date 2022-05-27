import axios from "axios";
import { ALLIMS_TOKEN, baseUrl } from "../../contants";

const api = axios.create();

const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    Accept: "application/json",
};

interface IPutDataProps {
    url: string;
    body?: any;
}

interface IResponseData {
    success: boolean;
    data: any;
    message?: string;
}

export default async function putData(
    props: IPutDataProps
): Promise<IResponseData> {
    const { url, body = {} } = props;

    api.defaults.timeout = 30000;
    if (window.origin.includes("localhost")) {
        api.defaults.baseURL = baseUrl;
    } else {
        api.defaults.baseURL = window.origin;
    }

    api.defaults.headers.common["Authorization"] =
        window.sessionStorage.getItem(ALLIMS_TOKEN)?.replaceAll('"', "") || "";

    try {
        const res = await api.put(url, body, { headers });

        return {
            success: true,
            data: res.data.data,
            message: res.data?.warn || null,
        };
    } catch (err: any) {
        if (err?.response) {
            return {
                success: false,
                data: null,
                message:
                    err?.response?.data?.error ||
                    err?.response?.data?.warn ||
                    "Erro, verifique com o suporte!",
            };
        }
        console.error("Error", err);
        return {
            success: false,
            data: null,
            message: "Lamentamos, houve um erro, verifique com o suporte!",
        };
    }
}
