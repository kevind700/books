import styles from "./styles.module.css";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";
import { deleteCookie, getCookie } from "cookies-next";
import { useEffect, useState } from "react";
import { User } from "@/types/user";

export default function Header() {
  const [user, setUser] = useState<User>();
  const pathname = usePathname();
  const router = useRouter();

  const fetchUser = async () => {
    try {
      const token = getCookie("token");
      const response = await fetch("/api/user", {
        headers: {
          token: token as string,
        },
      });
      const data = (await response.json()) as User;
      setUser(data);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleLogout = () => {
    deleteCookie("token");
    router.replace("/login");
  };

  return (
    <header className={styles.header}>
      <div className="flex items-center gap-10">
        <div className={styles.logo}>LN</div>
        {user && (
          <div
            className={styles.name}
          >{`Hola, ${user.firstName} ${user.lastName}`}</div>
        )}
      </div>
      <nav className={styles.navigation}>
        <Link
          href={"/"}
          className={pathname === "/" ? styles.linkSelected : ""}
        >
          Libros
        </Link>
        <Button className={"font-bold"} onClick={handleLogout}>
          Cerrar sesión
        </Button>
      </nav>
    </header>
  );
}
