import Image from "next/image";
import AuthButtons from "@/components/layout/authButtons";
import LoggedInNav from "@/components/layout/loggedInNav";

export default function Header({
  isAuth = false,
  isLoggedIn = false,
}: {
  isAuth?: boolean;
  isLoggedIn?: boolean;
}) {
  return (
    <header className="flex justify-between items-center p-4 sticky top-0 bg-white z-50">
      <div className="flex items-center gap-2">
        <Image src="/images/logo.png" alt="Fetch" width={40} height={40} />
        <h1 className="text-2xl font-medium">Fetch</h1>
      </div>

      {isLoggedIn ? <LoggedInNav /> : null}

      {isAuth ? <AuthButtons /> : null}
    </header>
  );
}
