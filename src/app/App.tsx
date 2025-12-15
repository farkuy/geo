import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import { Header } from "@/widgets";
import { theme } from "@/shared/theme";
import { Outlet } from "react-router";

const App = () => {
  return (
    <MantineProvider theme={theme}>
      <Header />
      <Outlet />
    </MantineProvider>
  );
};
export default App;
