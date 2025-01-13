import { createFileRoute, Link } from "@tanstack/react-router";
import { ClientsTable } from "../../../../../components/client/ClientsTable";
import { Button, Group, Loader, Stack } from "@mantine/core";
import { readClientDataSchema } from "../../../../../models/client/client-data";
import {
  useClientDeleteMutation,
  useClientsQuery,
} from "../../../../../hooks/client-hooks";

export const Route = createFileRoute(
  "/_authenticated/dashboard/_layout/clientes/",
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

  const parsedData = query.data.map((readClientData) =>
    readClientDataSchema.parse(readClientData),
  );

  return (
    <Stack>
      <Group>
        <Button>
          <Link to="/dashboard/clientes/nuevo">Nuevo</Link>
        </Button>
      </Group>
      <ClientsTable
        data={parsedData}
        onDeleteClientClick={onDeleteClientClick}
      />
    </Stack>
  );
}
