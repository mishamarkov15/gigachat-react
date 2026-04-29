import { FormEvent, useState } from "react";
import { Button } from "../ui/Button";
import { ErrorMessage } from "../ui/ErrorMessage";

type AuthFormProps = {
  onLogin: () => void;
};

const scopes = [
  "GIGACHAT_API_PERS",
  "GIGACHAT_API_B2B",
  "GIGACHAT_API_CORP"
] as const;

export function AuthForm({ onLogin }: AuthFormProps) {
  const [credentials, setCredentials] = useState("");
  const [scope, setScope] = useState<(typeof scopes)[number]>(scopes[0]);
  const [error, setError] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!credentials.trim()) {
      setError("Введите Credentials в формате Base64.");
      return;
    }

    setError("");
    onLogin();
  };

  return (
    <main className="auth-screen">
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="auth-form__brand">GigaChat UI</div>
        <h1>Авторизация</h1>
        <label className="field">
          <span className="field__label">Credentials</span>
          <input
            onChange={(event) => setCredentials(event.target.value)}
            placeholder="Base64-строка"
            type="password"
            value={credentials}
          />
        </label>
        {error && <ErrorMessage text={error} />}

        <fieldset className="scope-group">
          <legend>Scope</legend>
          {scopes.map((item) => (
            <label key={item}>
              <input
                checked={scope === item}
                name="scope"
                onChange={() => setScope(item)}
                type="radio"
              />
              <span>{item}</span>
            </label>
          ))}
        </fieldset>

        <Button type="submit" variant="primary">
          Войти
        </Button>
      </form>
    </main>
  );
}
