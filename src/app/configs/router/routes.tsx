import { createBrowserRouter } from "react-router";
import App from "@/app/App";
import { ProjectsPage } from "@/pages/projects";

//TODO: добавить типизацию для путей и убрать ленивую подгрузку
export const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    children: [
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
      {
        path: "security-journal",
        lazy: async () => {
          const { SecurityJournalPage } =
            await import("@/pages/securityJournal/SecurityJournalPage");
          return { Component: SecurityJournalPage };
        },
      },
    ],
  },
  {
    path: "/auth",
    lazy: async () => {
      const { AuthPage } = await import("@/pages/auth/AuthPage");
      return { Component: AuthPage };
    },
  },
  { path: "*", Component: ProjectsPage },
]);
