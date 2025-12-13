import "./App.css";
import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import { Header } from "../widgets/header/Header";

const App = () => {
  return (
    <MantineProvider>
      <Header />
    </MantineProvider>
  );
};
export default App;
