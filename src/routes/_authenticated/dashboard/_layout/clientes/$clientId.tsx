import {
  createFileRoute,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import { ClientForm } from "../../../../../components/client/ClientForm";
import { Button, Group, Loader, Stack } from "@mantine/core";
import { useClientQuery } from "../../../../../hooks/client-query-hook";
import {
  useClientDeleteMutation,
  useClientUpdateMutation,
} from "../../../../../hooks/client-mutation.hook";
import { ClientData } from "../../../../../models/client/client-data";

export const Route = createFileRoute(
  "/_authenticated/dashboard/_layout/clientes/$clientId"
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { clientId } = Route.useParams();
  const navigate = useNavigate({ from: "/dashboard/clientes/$clientId" });
  const { history } = useRouter();

  const query = useClientQuery(clientId);
  const updateMutation = useClientUpdateMutation(clientId);
  const deleteMutation = useClientDeleteMutation();

  const onUpdateClick = (clientData: ClientData) => {
    void updateMutation
      .mutateAsync(clientData)
      .then(() => navigate({ to: "/dashboard/clientes" }));
  };

  const onDeleteClick = () => {
    void deleteMutation
      .mutateAsync(clientId)
      .then(() => navigate({ to: "/dashboard/clientes" }));
  };

  if (query.isPending) {
    return <Loader />;
  }

  if (query.error) {
    return <Group>{query.error.details.title}</Group>;
  }

  return (
    <Stack>
      <Group justify="start">
        <Button
          onClick={() => {
            history.go(-1);
          }}
        >
          Atrás
        </Button>
      </Group>
      <ClientForm
        data={query.data}
        readOnly={false}
        onUpdateClick={onUpdateClick}
        onDeleteClick={onDeleteClick}
      />
    </Stack>
  );
}
