"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormEvent, useState } from "react";
import styles from "./styles.module.css";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { replace } = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    replace("/");
  };

  return (
    <div className={styles.wrapper}>
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
          Iniciar sesión con tu cuenta
        </h2>
      </div>
      <div className={styles.formWrapper}>
        <form onSubmit={submit} className={styles.form}>
          <div className={styles.inputWrapper}>
            <Label className={styles.label} htmlFor="email">
              Correo electrónico
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className={styles.inputWrapper}>
            <Label className={styles.label} htmlFor="password">
              Contraseña
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <Button type="submit" className={styles.button}>
              Iniciar sesión
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
