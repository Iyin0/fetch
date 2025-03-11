"use client"

import { useAtomValue } from "jotai"
import { userAtom } from "@/app/atoms"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getUserInitials } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { logout } from "@/app/queries/auth"

export default function Profile() {
  const user = useAtomValue(userAtom)
  const router = useRouter()

  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      const response = await logout();
      if (response.ok) {
        router.push("/");
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-medium mt-4 mb-10">Profile</h1>
      <div className="flex gap-10">
        <div className="flex flex-col gap-2">
          <p className="text-lg font-medium">{user?.name}</p>
          <p className="text-sm text-primary/60">{user?.email}</p>
        </div>
        <Avatar className="w-20 h-20 text-2xl font-medium">
          <AvatarImage src="" />
          <AvatarFallback>
            {getUserInitials(user?.name || "")}
          </AvatarFallback>
        </Avatar>
      </div>
      <Button className="mt-10" onClick={handleLogout} disabled={isLoading}>Logout</Button>
    </div>
  )
}