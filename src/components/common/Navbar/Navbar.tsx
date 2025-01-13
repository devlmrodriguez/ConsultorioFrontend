import { Group } from "@mantine/core";
import {
  IconCircleDottedLetterL,
  // Icon2fa,
  // IconBellRinging,
  // IconDatabaseImport,
  // IconFingerprint,
  IconHome,
  IconIndentIncrease,
  // IconKey,
  IconLogout,
  IconTemperature,
  // IconReceipt2,
  // IconSettings,
  IconUser,
  IconUsers,
} from "@tabler/icons-react";
import classes from "./Navbar.module.css";
import { Link } from "@tanstack/react-router";

// const data = [
//   { link: "", label: "Notifications", icon: IconBellRinging },
//   { link: "", label: "Billing", icon: IconReceipt2 },
//   { link: "", label: "Security", icon: IconFingerprint },
//   { link: "", label: "SSH Keys", icon: IconKey },
//   { link: "", label: "Databases", icon: IconDatabaseImport },
//   { link: "", label: "Authentication", icon: Icon2fa },
//   { link: "", label: "Other Settings", icon: IconSettings },
// ];

interface NavbarProps {
  onExitButtonClick: () => void;
}

export function Navbar(props: NavbarProps) {
  const links = [
    <Link
      className={classes.link}
      key="Inicio"
      to="/dashboard"
      activeProps={{ "data-active": true }}
      activeOptions={{ exact: true }}
    >
      <IconHome className={classes.linkIcon} stroke={1.5} />
      <span>Inicio</span>
    </Link>,
    <Link
      className={classes.link}
      key="Leads"
      to="/dashboard/leads"
      activeProps={{ "data-active": true }}
      activeOptions={{ exact: true }}
    >
      <IconCircleDottedLetterL className={classes.linkIcon} stroke={1.5} />
      <span>Leads</span>
    </Link>,
    <Link
      className={classes.link}
      key="Clientes"
      to="/dashboard/clientes"
      activeProps={{ "data-active": true }}
      activeOptions={{ exact: true }}
    >
      <IconUsers className={classes.linkIcon} stroke={1.5} />
      <span>Clientes</span>
    </Link>,
    <Link
      className={classes.link}
      key="Podologia - Razones"
      to="/dashboard/podologia/razones"
      activeProps={{ "data-active": true }}
      activeOptions={{ exact: true }}
    >
      <IconIndentIncrease className={classes.linkIcon} stroke={1.5} />
      <span>Podologia - Razones</span>
    </Link>,
    <Link
      className={classes.link}
      key="Podologia - Precondiciones"
      to="/dashboard/podologia/precondiciones"
      activeProps={{ "data-active": true }}
      activeOptions={{ exact: true }}
    >
      <IconTemperature className={classes.linkIcon} stroke={1.5} />
      <span>Podologia - Precondiciones</span>
    </Link>,
    // ...data.map((item) => (
    //   <a
    //     className={classes.link}
    //     // data-active={item.label === active || undefined}
    //     href={item.link}
    //     key={item.label}
    //     onClick={(event) => {
    //       event.preventDefault();
    //       // setActive(item.label);
    //     }}
    //   >
    //     <item.icon className={classes.linkIcon} stroke={1.5} />
    //     <span>{item.label}</span>
    //   </a>
    // )),
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
          <span>Mi cuenta</span>
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
