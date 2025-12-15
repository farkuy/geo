import { createBrowserRouter } from "react-router";
import App from "@/app/App";
import NotFoundPage from "@/pages/notFound/NotFoundPage";

//TODO: добавить типизацию для путей
export const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    children: [
      {
        path: "auth",
        lazy: async () => {
          const { AuthPage } = await import("@/pages/auth/AuthPage");
          return { Component: AuthPage };
        },
      },
      {
        path: "main",
        lazy: async () => {
          const { MainPage } = await import("@/pages/main/MainPage");
          return { Component: MainPage };
        },
      },
      {
        path: "projects",
        lazy: async () => {
          const { ProjectsPage } =
            await import("@/pages/projects/ProjectsPage");
          return { Component: ProjectsPage };
        },
      },
    ],
  },
  { path: "*", Component: NotFoundPage },
]);
