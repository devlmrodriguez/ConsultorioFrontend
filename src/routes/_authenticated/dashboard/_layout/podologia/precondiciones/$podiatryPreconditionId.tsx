import {
  createFileRoute,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import {
  usePodiatryPreconditionDeleteMutation,
  usePodiatryPreconditionQuery,
  usePodiatryPreconditionUpdateMutation,
} from "../../../../../../hooks/podiatry-precondition-hooks";
import {
  readPodiatryPreconditionDataSchema,
  SavePodiatryPreconditionData,
  savePodiatryPreconditionDataSchema,
} from "../../../../../../models/podiatry-precondition/podiatry-precondition-data";
import { Button, Group, Loader, Stack } from "@mantine/core";
import { PodiatryPreconditionForm } from "../../../../../../components/podiatry-precondition/PodiatryPreconditionForm";

export const Route = createFileRoute(
  "/_authenticated/dashboard/_layout/podologia/precondiciones/$podiatryPreconditionId",
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { podiatryPreconditionId } = Route.useParams();
  const navigate = useNavigate({
    from: "/dashboard/podologia/precondiciones/$podiatryPreconditionId",
  });
  const { history } = useRouter();

  const query = usePodiatryPreconditionQuery(podiatryPreconditionId);
  const updateMutation = usePodiatryPreconditionUpdateMutation(
    podiatryPreconditionId,
  );
  const deleteMutation = usePodiatryPreconditionDeleteMutation();

  const onUpdateClick = (
    savePodiatryPreconditionData: SavePodiatryPreconditionData,
  ) => {
    const parsedData = savePodiatryPreconditionDataSchema.parse(
      savePodiatryPreconditionData,
    );
    void updateMutation
      .mutateAsync(parsedData)
      .then(() => navigate({ to: "/dashboard/podologia/precondiciones" }));
  };

  const onDeleteClick = () => {
    void deleteMutation
      .mutateAsync(podiatryPreconditionId)
      .then(() => navigate({ to: "/dashboard/podologia/precondiciones" }));
  };

  if (query.isPending) {
    return <Loader />;
  }

  if (query.error) {
    return <Group>{query.error.details.title}</Group>;
  }

  const parsedData = readPodiatryPreconditionDataSchema.parse(query.data);

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
        data={parsedData}
        readOnly={false}
        onUpdateClick={onUpdateClick}
        onDeleteClick={onDeleteClick}
      />
    </Stack>
  );
}
