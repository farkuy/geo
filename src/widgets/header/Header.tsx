import { useState } from "react";
import {
  Burger,
  Button,
  Container,
  Group,
  useMantineColorScheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import classes from "./Header.module.css";
import { Link, useLocation } from "react-router";

const links = [
  { link: "/main", label: "MainPage" },
  { link: "/projects", label: "ProjectsPage" },
];

export function Header() {
  const { setColorScheme } = useMantineColorScheme();
  const [opened, { toggle }] = useDisclosure(false);
  const { pathname } = useLocation();
  const [active, setActive] = useState(pathname ?? links[0].link);

  const items = links.map((link) => (
    <Link
      key={link.label}
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
        <Button onClick={() => setColorScheme("light")}>Light</Button>
        <Button onClick={() => setColorScheme("dark")}>Dark</Button>
        <Burger opened={opened} onClick={toggle} hiddenFrom="xs" size="sm" />
      </Container>
    </header>
  );
}
