import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    //console.log("REQ BODY", req.body);
    const { id } = req.body;

    try {
      const response = await fetch(`https://livepeer.studio/api/asset/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_LIVEPEER_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          storage: {
            ipfs: true,
          },
        }),
      });
      const data = await response.json();
      console.log("RESPONSE IPFS", data);
      return res.status(200).json(data);
    } catch (err) {
      console.log(err);
    }
  }
}
