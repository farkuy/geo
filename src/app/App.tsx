import "./App.css";
import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import { Header } from "@/widgets/header";
import { theme } from "@/shared/theme";

const App = () => {
  return (
    <MantineProvider theme={theme}>
      <Header />
    </MantineProvider>
  );
};
export default App;
