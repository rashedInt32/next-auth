import { Button } from "@/components/ui/button";
import styles from "./page.module.css";
import Link from "next/link";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Button asChild>
          <Link href="/auth/login">Login</Link>
        </Button>
      </main>
    </div>
  );
}
