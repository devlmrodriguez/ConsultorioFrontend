import { createFileRoute } from "@tanstack/react-router";
import { useUserCredentialsStore } from "../../../../stores/user-credentials-store";
import { Container, Table, Textarea, Title } from "@mantine/core";

export const Route = createFileRoute("/_authenticated/dashboard/_layout/")({
  component: RouteComponent,
});

function RouteComponent() {
  const userCredentials = useUserCredentialsStore().userCredentials;

  if (userCredentials !== null) {
    return (
      <Container fluid>
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
              <Table.Td>{userCredentials.tenantId}</Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td>UserId</Table.Td>
              <Table.Td>{userCredentials.userId}</Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td>AccessToken</Table.Td>
              <Table.Td>
                <Textarea readOnly defaultValue={userCredentials.accessToken} />
              </Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td>RefreshToken</Table.Td>
              <Table.Td>
                <Textarea
                  readOnly
                  defaultValue={userCredentials.refreshToken}
                />
              </Table.Td>
            </Table.Tr>
          </Table.Tbody>
        </Table>
      </Container>
    );
  }

  return "Hello /_authenticated/dashboard/!";
}
