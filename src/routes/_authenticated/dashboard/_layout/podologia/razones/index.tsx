import { createFileRoute, Link } from "@tanstack/react-router";
import { Button, Group, Loader, Stack } from "@mantine/core";
import {
  pagedListReadPodiatryReasonSchema,
  readPodiatryReasonDataSchema,
} from "../../../../../../models/podiatry-reason/podiatry-reason-data";
import { PodiatryReasonsTable } from "../../../../../../components/podiatry-reason/PodiatryReasonsTable";
import {
  usePodiatryReasonDeleteMutation,
  usePodiatryReasonsQuery,
} from "../../../../../../hooks/podiatry-reason-hooks";

export const Route = createFileRoute(
  "/_authenticated/dashboard/_layout/podologia/razones/",
)({
  component: RouteComponent,
});

function RouteComponent() {
  const query = usePodiatryReasonsQuery();
  const deleteMutation = usePodiatryReasonDeleteMutation();

  const onDeletePodiatryReasonClick = (podiatryReasonId: string) => {
    void deleteMutation.mutateAsync(podiatryReasonId);
  };

  if (query.isPending) {
    return <Loader />;
  }

  if (query.error) {
    return <Group>{query.error.details.title}</Group>;
  }

  const parsedData = pagedListReadPodiatryReasonSchema.parse(query.data);

  const parsedDataItems = parsedData.items.map((readPodiatryReasonData) =>
    readPodiatryReasonDataSchema.parse(readPodiatryReasonData),
  );

  return (
    <Stack>
      <Group>
        <Button>
          <Link to="/dashboard/podologia/razones/nuevo">Nuevo</Link>
        </Button>
      </Group>
      <PodiatryReasonsTable
        data={parsedDataItems}
        onDeletePodiatryReasonClick={onDeletePodiatryReasonClick}
      />
    </Stack>
  );
}
