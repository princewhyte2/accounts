import "../styles/globals.css"
import { SessionProvider, useSession } from "next-auth/react"

function MyApp({ Component, pageProps }) {
  return (
    <SessionProvider session={pageProps.session}>
      {Component.auth ? (
        <Auth>
          <Component {...pageProps} />
        </Auth>
      ) : (
        <Component {...pageProps} />
      )}
    </SessionProvider>
  )
}

export default MyApp

function Auth({ children }) {
  const { status } = useSession({ required: true })

  if (status === "loading") {
    return (
      <div className="w-screen flex h-screen items-center justify-center">
        <div className=" animate-ping">
          <p className=" font-extrabold text-4xl">Accounts</p>
        </div>
      </div>
    )
  }

  return children
}
