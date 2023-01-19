// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next/types";
import { prisma } from "../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const post_id = req.query.id;

  if (req.method === "PUT") {
    const { title, content } = req.body;
    console.log("this is the id to update", req.body.id);

    try {
      await prisma.post.update({
        where: { id: String(post_id) },
        data: {
          title: title,
          content: content,
        },
      });
      res.status(200).json({ message: "data" }); // this line is must have
    } catch (error) {
      console.log("failure");
    }
  }
  if (req.method === "DELETE") {
    try {
      await prisma.post.delete({
        where: { id: String(post_id) },
      });
      res.status(200).json({ message: "data" });
      //res.json(post);
    } catch (error) {
      console.log("error");
    }
  }
}
