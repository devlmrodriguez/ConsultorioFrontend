import {
  createFileRoute,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import {
  readPodiatryReasonDataSchema,
  SavePodiatryReasonData,
  savePodiatryReasonDataSchema,
} from "../../../../../../models/podiatry-reason/podiatry-reason-data";
import { Button, Group, Loader, Stack } from "@mantine/core";
import { PodiatryReasonForm } from "../../../../../../components/podiatry-reason/PodiatryReasonForm";
import {
  usePodiatryReasonDeleteMutation,
  usePodiatryReasonQuery,
  usePodiatryReasonUpdateMutation,
} from "../../../../../../hooks/podiatry-reason-hooks";

export const Route = createFileRoute(
  "/_authenticated/dashboard/_layout/podologia/razones/$podiatryReasonId",
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { podiatryReasonId } = Route.useParams();
  const navigate = useNavigate({
    from: "/dashboard/podologia/razones/$podiatryReasonId",
  });
  const { history } = useRouter();

  const query = usePodiatryReasonQuery(podiatryReasonId);
  const updateMutation = usePodiatryReasonUpdateMutation(podiatryReasonId);
  const deleteMutation = usePodiatryReasonDeleteMutation();

  const onUpdateClick = (savePodiatryReasonData: SavePodiatryReasonData) => {
    const parsedData = savePodiatryReasonDataSchema.parse(
      savePodiatryReasonData,
    );
    void updateMutation
      .mutateAsync(parsedData)
      .then(() => navigate({ to: "/dashboard/podologia/razones" }));
  };

  const onDeleteClick = () => {
    void deleteMutation
      .mutateAsync(podiatryReasonId)
      .then(() => navigate({ to: "/dashboard/podologia/razones" }));
  };

  if (query.isPending) {
    return <Loader />;
  }

  if (query.error) {
    return <Group>{query.error.details.title}</Group>;
  }

  const parsedData = readPodiatryReasonDataSchema.parse(query.data);

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
      <PodiatryReasonForm
        data={parsedData}
        readOnly={false}
        onUpdateClick={onUpdateClick}
        onDeleteClick={onDeleteClick}
      />
    </Stack>
  );
}
