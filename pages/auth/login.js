import { getProviders, signIn } from "next-auth/react"

export default function SignIn({ providers }) {
  return (
    <div className="w-screen h-screen flex items-center justify-center ">
      {Object.values(providers).map((provider) => (
        <div key={provider.name}>
          <button className="border rounded-md px-4 h-16" onClick={() => signIn(provider.id, { callbackUrl: "/" })}>
            Sign in with {provider.name}
          </button>
        </div>
      ))}
    </div>
  )
}

export async function getServerSideProps(context) {
  const providers = await getProviders()
  return {
    props: { providers },
  }
}
