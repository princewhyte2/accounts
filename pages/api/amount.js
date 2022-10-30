// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { getSession } from "next-auth/react"
import prisma from "../../lib/prisma.js"

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const session = await getSession({ req })
      const email = session.user.email
      const data = await prisma.user.findUnique({
        where: {
          email,
        },
      })
      return res.status(200).json(data)
    } catch (err) {
      console.error(err)
      return res.status(500).json({ msg: "Something went wrong" })
    }
  } else if (req.method === "PATCH") {
    if (!req.body.amount && req.body.amount !== 0) {
      return res.status(400).json({ msg: "Malformed request" })
    }
    const amount = Number(req.body.amount)

    try {
      const session = await getSession({ req })
      const email = session.user.email
      const data = await prisma.user.update({
        where: {
          email,
        },
        data: {
          amount,
        },
      })
      return res.status(200).json(data)
    } catch (err) {
      console.error(err)
      return res.status(500).json({ msg: "Something went wrong" })
    }
  } else {
    return res.status(405).json({ msg: "Method not allowed" })
  }
}
