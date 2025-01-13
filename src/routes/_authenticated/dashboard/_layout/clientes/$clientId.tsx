import {
  createFileRoute,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import { ClientForm } from "../../../../../components/client/ClientForm";
import { Button, Group, Loader, Stack } from "@mantine/core";
import {
  readClientDataSchema,
  SaveClientData,
  saveClientDataSchema,
} from "../../../../../models/client/client-data";
import {
  useClientDeleteMutation,
  useClientQuery,
  useClientUpdateMutation,
} from "../../../../../hooks/client-hooks";

export const Route = createFileRoute(
  "/_authenticated/dashboard/_layout/clientes/$clientId",
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

  const onUpdateClick = (saveClientData: SaveClientData) => {
    const parsedData = saveClientDataSchema.parse(saveClientData);
    void updateMutation
      .mutateAsync(parsedData)
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

  const parsedData = readClientDataSchema.parse(query.data);

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
        data={parsedData}
        readOnly={false}
        onUpdateClick={onUpdateClick}
        onDeleteClick={onDeleteClick}
      />
    </Stack>
  );
}
