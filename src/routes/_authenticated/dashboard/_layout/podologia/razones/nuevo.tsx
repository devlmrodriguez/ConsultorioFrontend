import {
  createFileRoute,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import {
  SavePodiatryReasonData,
  savePodiatryReasonDataSchema,
} from "../../../../../../models/podiatry-reason/podiatry-reason-data";
import { Button, Group, Stack } from "@mantine/core";
import { PodiatryReasonForm } from "../../../../../../components/podiatry-reason/PodiatryReasonForm";
import { usePodiatryReasonCreateMutation } from "../../../../../../hooks/podiatry-reason-hooks";

export const Route = createFileRoute(
  "/_authenticated/dashboard/_layout/podologia/razones/nuevo",
)({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate({ from: "/dashboard/podologia/razones/nuevo" });
  const { history } = useRouter();

  const createMutation = usePodiatryReasonCreateMutation();

  const onCreateClick = (savePodiatryReasonData: SavePodiatryReasonData) => {
    const parsedData = savePodiatryReasonDataSchema.parse(
      savePodiatryReasonData,
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
      <PodiatryReasonForm readOnly={false} onCreateClick={onCreateClick} />
    </Stack>
  );
}
