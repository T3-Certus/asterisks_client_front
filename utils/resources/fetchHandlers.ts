export async function handlerPostExternal(url: string, body: any, token?: any) {
  let res;

  try {
    const response = await fetch(url, {
      body: JSON.stringify(body),
      headers: token
      ? {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        }
      : { "Content-Type": "application/json" },
      method: "POST",
    });
    const responseJson = await response.json();
    res = responseJson;
  } catch (error: any) {
    throw new Error(`${error}`);
  }

  return { res };
}

export async function handlerGetExternal(url: string, token?: string) {
  let res;
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

  return {res}
}

export async function handlerDeleteExternal(url: string, body: any, token?: string){
  let res;

  try {
    const response = await fetch(url, {
      body: JSON.stringify(body),
      headers: token
      ? {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        }
      : { "Content-Type": "application/json" },
      method: "DELETE",
    });
    const responseJson = await response.json();
    res = responseJson;
  } catch (error: any) {
    throw new Error(`${error}`);
  }

  return { res };
}

export async function handlerPutExternal(url: string, body: any, token?: string){
  let res

  try {
    const response = await fetch(url, {
      method: 'PUT',
      body: JSON.stringify(body),
      headers: token
      ? {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        }
      : { "Content-Type": "application/json" },
    })
    const responseJson = await response.json();
    res = responseJson;
  } catch (error) {
    throw new Error(`${error}`);
  }

  return {res}
}