import {
  createFileRoute,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import {
  SaveClientData,
  saveClientDataSchema,
} from "../../../../../models/client/client-data";
import { ClientForm } from "../../../../../components/client/ClientForm";
import { Button, Group, Stack } from "@mantine/core";
import { useClientCreateMutation } from "../../../../../hooks/client-hooks";

export const Route = createFileRoute(
  "/_authenticated/dashboard/_layout/clientes/nuevo",
)({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate({ from: "/dashboard/clientes/nuevo" });
  const { history } = useRouter();

  const createMutation = useClientCreateMutation();

  const onCreateClick = (saveClientData: SaveClientData) => {
    const parsedData = saveClientDataSchema.parse(saveClientData);
    void createMutation
      .mutateAsync(parsedData)
      .then(() => navigate({ to: "/dashboard/clientes" }));
  };

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
      <ClientForm readOnly={false} onCreateClick={onCreateClick} />
    </Stack>
  );
}
