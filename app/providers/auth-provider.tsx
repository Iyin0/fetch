import { userAtom } from "@/app/atoms";
import { useSetAtom } from "jotai";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { logout } from "@/app/queries/auth";
import { verifyCookie } from "@/lib/cookies";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const setUser = useSetAtom(userAtom);
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const onAuthenticatedScreen = !pathname.includes("/signup") && pathname !== "/";
  
  const handleLogout = async () => {
    const response = await logout();
    if (response.ok) {
      setUser(null);
      router.push("/");
    }
  }

  const handleVerifyCookie = async () => {
    const isAuthenticated = await verifyCookie();
    setUser({
      name: isAuthenticated.name ?? "",
      email: isAuthenticated.email ?? "",
    })
    if (isAuthenticated.expired && onAuthenticatedScreen) {
      setIsOpen(true);
    }
  }

  useEffect(() => {
    handleVerifyCookie();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <div>
      {children}
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>  </AlertDialogTitle>
            <AlertDialogDescription>
              Your session has expired. Please log in again.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleLogout}>
              Login
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}