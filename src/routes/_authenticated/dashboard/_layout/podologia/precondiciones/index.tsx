import { createFileRoute, Link } from "@tanstack/react-router";
import {
  usePodiatryPreconditionDeleteMutation,
  usePodiatryPreconditionsQuery,
} from "../../../../../../hooks/podiatry-precondition-hooks";
import {
  pagedListReadPodiatryPreconditionSchema,
  readPodiatryPreconditionDataSchema,
} from "../../../../../../models/podiatry-precondition/podiatry-precondition-data";
import { Button, Group, Loader, Stack } from "@mantine/core";
import { PodiatryPreconditionsTable } from "../../../../../../components/podiatry-precondition/PodiatryReasonsTable";

export const Route = createFileRoute(
  "/_authenticated/dashboard/_layout/podologia/precondiciones/",
)({
  component: RouteComponent,
});

function RouteComponent() {
  const query = usePodiatryPreconditionsQuery();
  const deleteMutation = usePodiatryPreconditionDeleteMutation();

  const onDeletePodiatryPreconditionClick = (
    podiatryPreconditionId: string,
  ) => {
    void deleteMutation.mutateAsync(podiatryPreconditionId);
  };

  if (query.isPending) {
    return <Loader />;
  }

  if (query.error) {
    return <Group>{query.error.details.title}</Group>;
  }

  const parsedData = pagedListReadPodiatryPreconditionSchema.parse(query.data);

  const parsedDataItems = parsedData.items.map((readPodiatryPreconditionData) =>
    readPodiatryPreconditionDataSchema.parse(readPodiatryPreconditionData),
  );

  return (
    <Stack>
      <Group>
        <Button>
          <Link to="/dashboard/podologia/razones/nuevo">Nuevo</Link>
        </Button>
      </Group>
      <PodiatryPreconditionsTable
        data={parsedDataItems}
        onDeletePodiatryPreconditionClick={onDeletePodiatryPreconditionClick}
      />
    </Stack>
  );
}
