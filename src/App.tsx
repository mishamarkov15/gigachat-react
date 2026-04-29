import { useEffect, useState } from "react";
import { AuthForm } from "./components/auth/AuthForm";
import { AppLayout } from "./components/layout/AppLayout";
import "./styles/theme.css";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.theme = isDarkTheme ? "dark" : "light";
  }, [isDarkTheme]);

  if (!isAuthenticated) {
    return <AuthForm onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <AppLayout isDarkTheme={isDarkTheme} onThemeChange={setIsDarkTheme} />
  );
}

export default App;
