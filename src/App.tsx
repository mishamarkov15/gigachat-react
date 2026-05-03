import { useEffect, useState } from "react";
import { ErrorBoundary } from "./components/error/ErrorBoundary";
import { AppLayout } from "./components/layout/AppLayout";
import { ChatProvider } from "./store/chatStore";
import "./styles/theme.css";

function App() {
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.theme = isDarkTheme ? "dark" : "light";
  }, [isDarkTheme]);

  return (
    <ErrorBoundary>
      <ChatProvider>
        <AppLayout isDarkTheme={isDarkTheme} onThemeChange={setIsDarkTheme} />
      </ChatProvider>
    </ErrorBoundary>
  );
}

export default App;
