import App from "@/app/App";
import { ProjectsPage } from "@/pages/projects";
import { MainPage } from "@/pages/main/MainPage";
import { SecurityJournalPage } from "@/pages/securityJournal";
import { AuthPage } from "@/pages/auth/AuthPage";
import { createBrowserRouter } from "react-router";
import { authMiddleware } from "./middlewares";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    middleware: [authMiddleware],
    children: [
      {
        path: "main",
        Component: MainPage,
      },
      {
        path: "projects",
        Component: ProjectsPage,
      },
      {
        path: "security-journal",
        Component: SecurityJournalPage,
      },
    ],
  },
  {
    path: "/auth",
    Component: AuthPage,
  },
  { path: "*", Component: ProjectsPage },
]);
