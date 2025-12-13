import { useState } from "react";
import "./App.css";
import "@mantine/core/styles.css";
import { Button, MantineProvider } from "@mantine/core";
import { Header } from "../widgets/header/Header";

function App() {
  const [count, setCount] = useState(0);

  return (
    <MantineProvider>
      <Header />
      <Button onClick={() => setCount((count) => count + 1)}>
        count is {count}
      </Button>
    </MantineProvider>
  );
}

export default App;
