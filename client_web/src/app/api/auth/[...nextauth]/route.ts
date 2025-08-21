import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { fetchApi } from "@/lib/api"

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          const user = await fetchApi("/auth/login", {
            method: "POST",
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          })

          if (user) {
            return {
              id: user._id,
              email: user.email,
              name: user.fullName,
            }
          }
        } catch (error) {
          console.error("Error during login:", error)
          return null
        }

        return null
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
      }
      return session
    },
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
})

export { handler as GET, handler as POST }
