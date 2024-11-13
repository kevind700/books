"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormEvent, useState } from "react";
import styles from "./styles.module.css";
import { useRouter } from "next/navigation";

interface LoginError extends Error {
  code?: string;
  status?: number;
}

export default function LoginPage() {
  const { replace } = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    try {
      if (!email || !password) {
        throw new Error("Por favor complete todos los campos");
      }

      const res = await fetch("/api/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error("Credenciales inválidas");
      }

      const data = await res.json();

      if (!data.token) {
        throw new Error();
      }

      replace("/");
    } catch (err: unknown) {
      const error = err as LoginError;
      setError(error.message || "Ha ocurrido un error al iniciar sesión");
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.panel}>
        <div className="mb-8">
          <h2 className={styles.title}>Bienvenido</h2>
        </div>
        <form onSubmit={submit} className="space-y-6">
          <div className="space-y-2">
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
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              className={styles.input}
            />
          </div>
          <div className="space-y-2">
            <Label className={styles.label} htmlFor="password">
              Contraseña
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              required
              className={styles.input}
            />
          </div>
          <div>
            <Button type="submit" className={styles.button}>
              Iniciar sesión
            </Button>
            {error && <p className="text-[#ff3b30] text-sm mt-2">{error}</p>}
          </div>
        </form>
      </div>
    </div>
  );
}
