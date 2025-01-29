"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { fetchApi } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface UserData {
  fullName: string
  email: string
  phoneNumber: string
  emailVerified: boolean
  phoneVerified: boolean
}

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [userData, setUserData] = useState<UserData | null>(null)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    } else if (status === "authenticated") {
      fetchApi("/user/profile")
        .then((data) => setUserData(data))
        .catch((error) => console.error("Error fetching user data:", error))
    }
  }, [status, router])

  if (status === "loading") {
    return <div>Loading...</div>
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Welcome to your Dashboard</h1>
      {userData ? (
        <Card>
          <CardHeader>
            <CardTitle>Your Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              <strong>Name:</strong> {userData.fullName}
            </p>
            <p>
              <strong>Email:</strong> {userData.email} {userData.emailVerified ? "(Verified)" : "(Not Verified)"}
            </p>
            <p>
              <strong>Phone:</strong> {userData.phoneNumber} {userData.phoneVerified ? "(Verified)" : "(Not Verified)"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  )
}

