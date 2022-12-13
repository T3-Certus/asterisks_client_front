import { NextApiRequest, NextApiResponse } from "next";
import { AsterisksServices } from "../../../../utils";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, body } = req;
  const urlService = AsterisksServices.ms_authentication_admin;

  if (method == "POST") {
    try {
      const response = await fetch(urlService + "/register", {
        body: body,
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });
      const responseJson = await response.json()
      return res.json(responseJson)

    } catch (error) {
      return res.json(error);
    }
  }
}
