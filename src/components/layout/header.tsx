import styles from "./styles.module.css";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";
import { deleteCookie } from "cookies-next";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    deleteCookie("token");
    router.replace("/login");
  };

  return (
    <header className={styles.header}>
      <div className={styles.logo}>LN</div>
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
