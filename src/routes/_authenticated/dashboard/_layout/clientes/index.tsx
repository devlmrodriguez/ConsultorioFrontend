import { createFileRoute, Link } from "@tanstack/react-router";
import { ClientsTable } from "../../../../../components/client/ClientsTable";
import { useClientsQuery } from "../../../../../hooks/clients-query-hook";
import { Button, Group, Loader, Stack } from "@mantine/core";
import { useClientDeleteMutation } from "../../../../../hooks/client-mutation.hook";

export const Route = createFileRoute(
  "/_authenticated/dashboard/_layout/clientes/"
)({
  component: RouteComponent,
});

function RouteComponent() {
  const query = useClientsQuery();
  const deleteMutation = useClientDeleteMutation();

  const onDeleteClientClick = (clientId: string) => {
    void deleteMutation.mutateAsync(clientId);
  };

  if (query.isPending) {
    return <Loader />;
  }

  if (query.error) {
    return <Group>{query.error.details.title}</Group>;
  }

  return (
    <Stack>
      <Group>
        <Button>
          <Link to="/dashboard/clientes/nuevo">Nuevo</Link>
        </Button>
      </Group>
      <ClientsTable
        data={query.data}
        onDeleteClientClick={onDeleteClientClick}
      />
    </Stack>
  );
}
