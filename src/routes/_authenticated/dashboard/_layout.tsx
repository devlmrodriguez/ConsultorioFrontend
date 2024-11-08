import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useDisclosure } from "@mantine/hooks";
import { AppShell, Burger, Button, Group, Text } from "@mantine/core";
import { Helmet } from "react-helmet-async";
import { useUserCredentialsStore } from "../../../stores/user-credentials-store";
import { useApiMutation } from "../../../hooks/api-mutation.hook";
import { AuthLogoutRequest } from "../../../models/auth/auth-logout-request";
import { API_ROUTES } from "../../../constants/api-routes";
import { useApiQuery } from "../../../hooks/api-query.hook";
import { User } from "../../../models/common/user";

export const Route = createFileRoute("/_authenticated/dashboard/_layout")({
  component: RouteComponent,
});

function RouteComponent() {
  const [opened, { toggle }] = useDisclosure();

  const userCredentialsStore = useUserCredentialsStore();
  const userCredentials = userCredentialsStore.userCredentials;
  const removeCredentials = userCredentialsStore.removeCredentials;

  const userQuery = useApiQuery<User>(API_ROUTES.User, ["user"]);

  const logoutMutation = useApiMutation<unknown, AuthLogoutRequest>(
    API_ROUTES.AuthLogout,
    "POST",
  );

  const navigate = useNavigate({ from: "/dashboard" });

  const removeCredentialsAndNavigate = () => {
    removeCredentials();
    void navigate({ to: "/login" });
  };

  const onExitButtonClicked = () => {
    if (userCredentials === null) {
      return;
    }

    const request: AuthLogoutRequest = {
      tenantId: userCredentials.tenantId,
      userId: userCredentials.userId,
      refreshToken: userCredentials.refreshToken,
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
    <>
      <Helmet>
        <title>Consultorio | Dashboard</title>
      </Helmet>

      <AppShell
        header={{ height: 60 }}
        navbar={{
          width: 300,
          breakpoint: "sm",
          collapsed: { mobile: !opened },
        }}
        padding="md"
      >
        <AppShell.Header>
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Group h="100%" px="md" justify="space-between">
            <div>Logo</div>
            <Group>
              {userQuery.data !== undefined && (
                <Text>
                  {`${userQuery.data.firstName} ${userQuery.data.lastName} `}
                </Text>
              )}
              <Button
                variant="filled"
                type="button"
                color="red"
                onClick={onExitButtonClicked}
                loading={logoutMutation.isPending}
              >
                Salir
              </Button>
            </Group>
          </Group>
        </AppShell.Header>

        <AppShell.Navbar p="md">Navbar</AppShell.Navbar>

        <AppShell.Main>
          <Outlet />
        </AppShell.Main>
      </AppShell>
    </>
  );
}
