import { createFileRoute } from "@tanstack/react-router";
import { useCredentialsStore } from "../../../../stores/credentials-store";
import { Container, Table, Textarea, Title } from "@mantine/core";

export const Route = createFileRoute("/_authenticated/dashboard/_layout/")({
  component: RouteComponent,
});

function RouteComponent() {
  const credentialsStore = useCredentialsStore();

  if (credentialsStore.credentials !== null) {
    return (
      <Container fluid>
        <Title order={2} mb="md">
          Detalles de usuario
        </Title>
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
              <Table.Td>{credentialsStore.credentials.tenantId}</Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td>UserId</Table.Td>
              <Table.Td>{credentialsStore.credentials.userId}</Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td>AccessToken</Table.Td>
              <Table.Td>
                <Textarea
                  readOnly
                  defaultValue={credentialsStore.credentials.accessToken}
                />
              </Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td>RefreshToken</Table.Td>
              <Table.Td>
                <Textarea
                  readOnly
                  defaultValue={credentialsStore.credentials.refreshToken}
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
