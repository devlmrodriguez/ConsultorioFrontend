import { Group } from "@mantine/core";
import {
  Icon2fa,
  IconBellRinging,
  IconDatabaseImport,
  IconFingerprint,
  IconKey,
  IconLogout,
  IconReceipt2,
  IconSettings,
  IconUser,
  IconUsers,
} from "@tabler/icons-react";
import { useState } from "react";
import classes from "./Navbar.module.css";
import { Link } from "@tanstack/react-router";

const data = [
  { link: "", label: "Notifications", icon: IconBellRinging },
  { link: "", label: "Billing", icon: IconReceipt2 },
  { link: "", label: "Security", icon: IconFingerprint },
  { link: "", label: "SSH Keys", icon: IconKey },
  { link: "", label: "Databases", icon: IconDatabaseImport },
  { link: "", label: "Authentication", icon: Icon2fa },
  { link: "", label: "Other Settings", icon: IconSettings },
];

interface NavbarProps {
  onExitButtonClick: () => void;
}

export function Navbar(props: NavbarProps) {
  const [active, setActive] = useState("Billing");

  const links = [
    <Link className={classes.link} key="Clientes" to="/dashboard/clientes">
      <IconUsers className={classes.linkIcon} stroke={1.5} />
      <span>Clientes</span>
    </Link>,
    ...data.map((item) => (
      <a
        className={classes.link}
        data-active={item.label === active || undefined}
        href={item.link}
        key={item.label}
        onClick={(event) => {
          event.preventDefault();
          setActive(item.label);
        }}
      >
        <item.icon className={classes.linkIcon} stroke={1.5} />
        <span>{item.label}</span>
      </a>
    )),
  ];

  return (
    <Group className={classes.navbarContainer}>
      <div className={classes.navbarMain}>{links}</div>

      <div className={classes.footer}>
        <a
          href="#"
          className={classes.link}
          onClick={(event) => {
            event.preventDefault();
          }}
        >
          <IconUser className={classes.linkIcon} stroke={1.5} />
          <span>Mi usuario</span>
        </a>

        <a
          href="#"
          className={classes.link}
          onClick={(event) => {
            event.preventDefault();
            props.onExitButtonClick();
          }}
        >
          <IconLogout className={classes.linkIcon} stroke={1.5} />
          <span>Salir</span>
        </a>
      </div>
    </Group>
  );
}
