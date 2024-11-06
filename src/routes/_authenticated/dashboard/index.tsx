import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useUserStore } from "../../../stores/user-store";
import {
  Button,
  Container,
  Stack,
  Table,
  Textarea,
  Title,
} from "@mantine/core";
import { useApiMutation } from "../../../hooks/api-mutation.hook";
import { AuthLogoutRequest } from "../../../models/auth/auth-logout-request";
import { API_ROUTES } from "../../../constants/api-routes";

export const Route = createFileRoute("/_authenticated/dashboard/")({
  component: RouteComponent,
});

function RouteComponent() {
  const user = useUserStore().user;
  const userRemoveCredentials = useUserStore().removeCredentials;

  const logoutMutation = useApiMutation<unknown, AuthLogoutRequest>(
    API_ROUTES.AuthLogout,
    "POST",
  );

  const navigate = useNavigate({ from: "/dashboard" });

  const removeCredentialsAndNavigate = () => {
    userRemoveCredentials();
    void navigate({ to: "/login" });
  };

  const onButtonClicked = () => {
    if (user === null) {
      return;
    }

    const request: AuthLogoutRequest = {
      tenantId: user.tenantId,
      userId: user.userId,
      refreshToken: user.refreshToken,
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

  if (user !== null) {
    return (
      <Container>
        <Stack>
          <Title>Detalles de usuario</Title>
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Propiedad</Table.Th>
                <Table.Th>Valor</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              <Table.Tr>
                <Table.Td>TenantId</Table.Td>
                <Table.Td>{user.tenantId}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>UserId</Table.Td>
                <Table.Td>{user.userId}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>AccessToken</Table.Td>
                <Table.Td>
                  <Textarea readOnly defaultValue={user.accessToken} />
                </Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>RefreshToken</Table.Td>
                <Table.Td>
                  <Textarea readOnly defaultValue={user.refreshToken} />
                </Table.Td>
              </Table.Tr>
            </Table.Tbody>
          </Table>
          <Stack justify="end">
            <Button
              variant="filled"
              type="button"
              color="red"
              onClick={onButtonClicked}
            >
              Salir
            </Button>
          </Stack>
        </Stack>
      </Container>
    );
  }

  return "Hello /_authenticated/dashboard/!";
}
