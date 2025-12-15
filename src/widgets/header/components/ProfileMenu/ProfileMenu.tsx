import {
  Avatar,
  Group,
  Menu,
  Text,
  UnstyledButton,
  useMantineColorScheme,
} from "@mantine/core";
import classes from "./ProfileMenu.module.css";
import cx from "clsx";
import { useDisclosure } from "@mantine/hooks";

const user = {
  name: "Jane Spoonfighter",
  email: "janspoon@fighter.dev",
  image:
    "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-5.png",
};

export const ProfileMenu = () => {
  const [opened, { close, open }] = useDisclosure(false);
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  const colorSchemeText =
    colorScheme === "dark" ? "Светлая тема" : "Темная тема";

  return (
    <Menu
      width={260}
      position="bottom-end"
      transitionProps={{ transition: "pop-top-right" }}
      onClose={close}
      onOpen={open}
      withinPortal
    >
      <Menu.Target>
        <UnstyledButton
          className={cx(classes.user, { [classes.userActive]: opened })}
        >
          <Group gap={7}>
            <Avatar src={user.image} alt={user.name} radius="xl" size={20} />
            <Text fw={500} size="sm" lh={1} mr={3}>
              {user.name}
            </Text>
          </Group>
        </UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item>Личный профиль</Menu.Item>
        <Menu.Item onClick={toggleColorScheme}>{colorSchemeText}</Menu.Item>
        <Menu.Item>Информация о системе</Menu.Item>
        <Menu.Item>Последние обновления</Menu.Item>
        <Menu.Item>Техническая поддержка</Menu.Item>

        <Menu.Divider />
        <Menu.Item color="red">Выйти</Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};
