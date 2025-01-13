import {
  createFileRoute,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import { usePodiatryPreconditionCreateMutation } from "../../../../../../hooks/podiatry-precondition-hooks";
import {
  SavePodiatryPreconditionData,
  savePodiatryPreconditionDataSchema,
} from "../../../../../../models/podiatry-precondition/podiatry-precondition-data";
import { Button, Group, Stack } from "@mantine/core";
import { PodiatryPreconditionForm } from "../../../../../../components/podiatry-precondition/PodiatryPreconditionForm";

export const Route = createFileRoute(
  "/_authenticated/dashboard/_layout/podologia/precondiciones/nuevo",
)({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate({
    from: "/dashboard/podologia/precondiciones/nuevo",
  });
  const { history } = useRouter();

  const createMutation = usePodiatryPreconditionCreateMutation();

  const onCreateClick = (
    savePodiatryPreconditionData: SavePodiatryPreconditionData,
  ) => {
    const parsedData = savePodiatryPreconditionDataSchema.parse(
      savePodiatryPreconditionData,
    );
    void createMutation
      .mutateAsync(parsedData)
      .then(() => navigate({ to: "/dashboard/podologia/razones" }));
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
      <PodiatryPreconditionForm
        readOnly={false}
        onCreateClick={onCreateClick}
      />
    </Stack>
  );
}
