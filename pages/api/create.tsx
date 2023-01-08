// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../lib/prisma";

type Data = {
  title: string;
  content: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { title, content } = req.body;

  try {
    await prisma.post.create({
      data: {
        title: title,
        content: content,
      },
    });
  } catch (error) {
    console.log("failure");
  }
}
