import { IGenericExternalServiceResponse } from "../interfaces";

export async function handlerPostExternal(url: string, body: any, token?: any): Promise<IGenericExternalServiceResponse> {
  let res: IGenericExternalServiceResponse;

  try {
    const response = await fetch(url, {
      body: JSON.stringify(body),
      headers: token
        ? {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        }
        : { "Content-Type": "application/json" },
      method: "POST",
    });
    const responseJson = await response.json();
    res = responseJson;
  } catch (error: any) {
    throw new Error(`${error}`);
  }

  return res;
}

export async function handlerGetExternal(url: string, token?: string): Promise<IGenericExternalServiceResponse> {
  let res: IGenericExternalServiceResponse;
  const tok = "Bearer " + token

  try {
    const response = await fetch(url, {
      headers: token
        ? {
          "Content-Type": "application/json",
          "Authorization": tok,
        }
        : { "Content-Type": "application/json" },
      method: "GET",
    });

    const responseJson = await response.json()
    res = responseJson
  } catch (error) {
    throw new Error(`${error}`)
  }

  return res
}

export async function handlerDeleteExternal(url: string, body?: any, token?: string): Promise<IGenericExternalServiceResponse> {
  let res: IGenericExternalServiceResponse;
  console.log({ body })
  try {
    const response = body === 0 ? await fetch(url, {

      headers: token
        ? {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        }
        : { "Content-Type": "application/json" },
      method: "DELETE",
    }) : await fetch(url, {
      body: JSON.stringify(body),
      headers: token
        ? {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        }
        : { "Content-Type": "application/json" },
      method: "DELETE",
    });
    const responseJson = await response.json();
    res = responseJson;
  } catch (error: any) {
    throw new Error(`${error}`);
  }

  return res;
}

export async function handlerPutExternal(url: string, body: any, token?: string): Promise<IGenericExternalServiceResponse> {
  let res: IGenericExternalServiceResponse

  try {
    const response = await fetch(url, {
      method: 'PUT',
      body: JSON.stringify(body),
      headers: token
        ? {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        }
        : { "Content-Type": "application/json" },
    })
    const responseJson = await response.json();
    res = responseJson;
  } catch (error) {
    throw new Error(`${error}`);
  }

  return res
}