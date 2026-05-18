import { useState } from "react";
import { os } from "@neutralinojs/lib";
import "./App.css";

function App() {
  const [username, setUsername] = useState<string>("");
  const [loaded, setLoaded] = useState<boolean>(false);

  const getUsername = async (): Promise<void> => {
    try {
      const key = NL_OS === "Windows" ? "USERNAME" : "USER";
      const value = await os.getEnv(key);
      setUsername(value);
      setLoaded(true);
    } catch (err) {
      console.error("Failed to get username:", err);
      setUsername("Unknown");
      setLoaded(true);
    }
  };

  return (
    <div className="app">
      <div className="card">
        <img src="/neutralino.png" alt="Neutralinojs logo" className="logo" />
        <h1>Neutralinojs + Vite + React</h1>
        <p className="subtitle">
          Lightweight cross-platform desktop apps with web technologies
        </p>

        {loaded ? (
          <p className="greeting">Hello, <strong>{username}</strong> 👋</p>
        ) : (
          <button onClick={getUsername}>
            Say Hello via Native API
          </button>
        )}

        <p className="hint">
          Edit <code>src/App.tsx</code> and save to see HMR updates
        </p>
      </div>
    </div>
  );
}

export default App;
