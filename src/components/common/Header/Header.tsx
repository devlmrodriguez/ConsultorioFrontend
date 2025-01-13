import cx from "clsx";
import {
  Avatar,
  Burger,
  Group,
  Loader,
  Menu,
  Text,
  UnstyledButton,
} from "@mantine/core";
import { MantineLogo } from "@mantinex/mantine-logo";
import { IconChevronDown, IconLogout, IconSettings } from "@tabler/icons-react";
import { useState } from "react";
import { useApiQuery } from "../../../hooks/api-query.hook";
import { API_ROUTES } from "../../../constants/api-routes";
import {
  AccountData,
  accountDataSchema,
} from "../../../models/common/account-data";
import classes from "./Header.module.css";

interface HeaderProps {
  isBurgerOpened?: boolean;
  onBurgerClick?: React.MouseEventHandler<HTMLButtonElement>;
  onExitButtonClick: () => void;
}

export function Header(props: HeaderProps) {
  const [userMenuOpened, setUserMenuOpened] = useState(false);
  const accountDataQuery = useApiQuery<AccountData>(API_ROUTES.AccountData, [
    "account",
  ]);

  const parsedAccountData = accountDataQuery.data
    ? accountDataSchema.parse(accountDataQuery.data)
    : undefined;

  return (
    <Group h="100%" px="md" justify="space-between">
      <Group>
        <Burger
          opened={props.isBurgerOpened}
          onClick={props.onBurgerClick}
          hiddenFrom="sm"
          size="sm"
        />

        <MantineLogo size={30} />
      </Group>

      <Menu
        width={260}
        position="bottom-end"
        transitionProps={{ transition: "pop-top-right" }}
        onClose={() => {
          setUserMenuOpened(false);
        }}
        onOpen={() => {
          setUserMenuOpened(true);
        }}
        withinPortal
      >
        <Menu.Target>
          <UnstyledButton
            className={cx(classes.user, {
              [classes.userActive]: userMenuOpened,
            })}
          >
            <Group gap={7}>
              {parsedAccountData === undefined ? (
                <Loader />
              ) : (
                <>
                  <Avatar
                    src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-5.png"
                    alt={
                      parsedAccountData.firstName + parsedAccountData.lastName
                    }
                    radius="xl"
                    size={20}
                  />
                  <Text fw={500} size="sm" lh={1} mr={3}>
                    {parsedAccountData.firstName +
                      " " +
                      parsedAccountData.lastName}
                  </Text>
                  <IconChevronDown size={12} stroke={1.5} />
                </>
              )}
            </Group>
          </UnstyledButton>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Label>Configuración</Menu.Label>
          <Menu.Item leftSection={<IconSettings size={16} stroke={1.5} />}>
            Mi configuración
          </Menu.Item>
          <Menu.Item
            leftSection={<IconLogout size={16} stroke={1.5} />}
            onClick={props.onExitButtonClick}
          >
            Salir
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Group>
  );
}
