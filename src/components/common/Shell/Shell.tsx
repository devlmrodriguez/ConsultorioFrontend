import { AppShell, Container } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Header } from "../Header/Header";
import { Navbar } from "../Navbar/Navbar";
import { CatchBoundary, Outlet, useNavigate } from "@tanstack/react-router";
import { useCredentialsStore } from "../../../stores/credentials-store";
import { useApiMutation } from "../../../hooks/api-mutation.hook";
import { API_ROUTES } from "../../../constants/api-routes";
import { AuthLogoutRequest } from "../../../models/auth/auth-logout-request";

export function Shell() {
  const [opened, { toggle }] = useDisclosure();

  const credentialsStore = useCredentialsStore();

  const logoutMutation = useApiMutation<unknown, AuthLogoutRequest>(
    API_ROUTES.AuthLogout,
    "POST",
  );

  const navigate = useNavigate({ from: "/dashboard" });

  const removeCredentialsAndNavigate = () => {
    credentialsStore.removeCredentials();
    void navigate({ to: "/login" });
  };

  const onExitButtonClick = () => {
    if (credentialsStore.credentials === null) {
      return;
    }

    const request: AuthLogoutRequest = {
      tenantId: credentialsStore.credentials.tenantId,
      userId: credentialsStore.credentials.userId,
      refreshToken: credentialsStore.credentials.refreshToken,
    };

    logoutMutation.mutate(request, {
      onSuccess: () => {
        removeCredentialsAndNavigate();
      },
      onError: () => {
        removeCredentialsAndNavigate();
      },
    });
  };

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: "sm", collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Header
          isBurgerOpened={opened}
          onBurgerClick={toggle}
          onExitButtonClick={onExitButtonClick}
        />
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <Navbar onExitButtonClick={onExitButtonClick} />
      </AppShell.Navbar>

      <AppShell.Main>
        <CatchBoundary getResetKey={() => "reset"}>
          <Container size="xl" fluid>
            <Outlet />
          </Container>
        </CatchBoundary>
      </AppShell.Main>
    </AppShell>
  );
}
