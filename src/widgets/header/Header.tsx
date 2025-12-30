import { useState } from "react";
import { Container, Group } from "@mantine/core";
import classes from "./Header.module.css";
import { Link, useLocation } from "react-router";
import { ProfileMenu } from "./components/index";

const links = [
  { link: "/main", label: "Главная" },
  { link: "/projects", label: "Проекты" },
  { link: "/security-journal", label: "Журнал событий ИБ" },
];

export function Header() {
  const { pathname } = useLocation();
  const [active, setActive] = useState(pathname ?? links[0].link);

  const items = links.map((link) => (
    <Link
      key={link.link}
      to={link.link}
      className={classes.link}
      data-active={active === link?.link || undefined}
      onClick={() => {
        setActive(link.link);
      }}
    >
      {link.label}
    </Link>
  ));

  return (
    <header className={classes.header}>
      <Container size="md" className={classes.inner}>
        <Group gap={5} visibleFrom="xs">
          {items}
        </Group>
        <ProfileMenu />
      </Container>
    </header>
  );
}
