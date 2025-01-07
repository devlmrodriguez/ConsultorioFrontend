import {
  createFileRoute,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import { ClientData } from "../../../../../models/client/client-data";
import { ClientForm } from "../../../../../components/client/ClientForm";
import { useClientCreateMutation } from "../../../../../hooks/client-mutation.hook";
import { Button, Group, Stack } from "@mantine/core";

export const Route = createFileRoute(
  "/_authenticated/dashboard/_layout/clientes/nuevo"
)({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate({ from: "/dashboard/clientes/nuevo" });
  const { history } = useRouter();

  const createMutation = useClientCreateMutation();

  const onCreateClick = (clientData: ClientData) => {
    void createMutation
      .mutateAsync(clientData)
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
