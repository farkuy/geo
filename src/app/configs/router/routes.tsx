import { createBrowserRouter } from "react-router";
import App from "../../App";
import NotFoundPage from "../../../pages/notFound/NotFoundPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    children: [
      {
        path: "/auth",
        lazy: async () => {
          const { AuthPage } = await import("../../../pages/auth/AuthPage");
          return { Component: AuthPage };
        },
      },
      {
        path: "/main",
        lazy: async () => {
          const { MainPage } = await import("../../../pages/main/MainPage");
          return { Component: MainPage };
        },
      },
    ],
  },
  { path: "*", Component: NotFoundPage },
]);
