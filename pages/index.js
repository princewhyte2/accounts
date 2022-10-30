/* eslint-disable @next/next/no-img-element */
import { useMemo, useState } from "react"
import { useSession } from "next-auth/react"
import Head from "next/head"
import axios from "axios"
import useSWR, { useSWRConfig } from "swr"
import { signOut } from "next-auth/react"

const fetcher = (url) => axios.get(url).then((res) => res.data)
const updateAmount = async (amount) => {
  const updatedUser = await axios.patch("/api/amount", { amount })

  return updatedUser.data
}
export default function Home() {
  const { data: session } = useSession()
  const [amount, setAmount] = useState("")
  const { data } = useSWR("/api/amount", fetcher)
  const { mutate } = useSWRConfig()
  const userAmount = useMemo(() => {
    return data?.amount || 0
  }, [data])

  const handleDebit = async () => {
    try {
      const amountNum = Number(amount)
      if (!amountNum) return
      const totalBalance = userAmount - amountNum
      if (totalBalance < 0) {
        window.alert("insufficient funds")
        return
      }
      const options = {
        optimisticData: { ...data, amount: totalBalance },
        rollbackOnError: true,
        revalidate: false,
      }
      mutate("/api/amount", updateAmount(totalBalance), options)
    } catch (err) {
      window.alert("something went wrong")
    }
  }

  const handdleCredit = async () => {
    try {
      const amountNum = Number(amount)
      if (!amountNum) return
      const totalBalance = userAmount + amountNum
      const options = {
        optimisticData: { ...data, amount: totalBalance },
        rollbackOnError: true,
        revalidate: false,
      }
      mutate("/api/amount", updateAmount(totalBalance), options)
    } catch (error) {
      window.alert("something went wrong")
    }
  }

  return (
    <div>
      <Head>
        <title>User Accounts</title>
        <meta name="description" content="User Accounts" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="p-10 mx-auto max-w-4xl flex items-center justify-center flex-col">
        <div className="w-24 h-24 rounded-full overflow-hidden">
          <img alt="profile" src={session.user.image} className=" block w-full h-auto" />
        </div>

        <h1 className="text-lg font-bold mb-4 text-center">
          Welcome <br /> {session.user.name}
        </h1>
        <p className="text-center text-4xl">
          Balance: <span>{userAmount}</span>
        </p>
        <form onSubmit={(e) => e.preventDefault()} className="flex flex-col items-center mt-4 space-y-6">
          <input
            value={amount}
            type="number"
            onChange={({ target }) => setAmount(target.value)}
            placeholder="enter amount"
            min={0}
            className="outline-none border h-16 px-4 rounded-lg ring-black"
          />
          <div className="flex items-center justify-center space-x-6">
            <button onClick={handleDebit} className="border px-4 h-14 rounded-md">
              Debit
            </button>
            <button onClick={handdleCredit} className="border px-4 h-14 rounded-md">
              Credit
            </button>
          </div>
        </form>
        <button
          onClick={() => signOut({ redirect: false })}
          className="border border-red-500 text-red-500 mt-8 px-4 h-14 rounded-md"
        >
          Log out
        </button>
      </main>
    </div>
  )
}
Home.auth = true
