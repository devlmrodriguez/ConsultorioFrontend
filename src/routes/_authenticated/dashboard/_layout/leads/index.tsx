import { createFileRoute, Link } from "@tanstack/react-router";
import { LeadsTable } from "../../../../../components/lead/LeadsTable";
import { Button, Group, Loader, Stack } from "@mantine/core";
import { readLeadDataSchema } from "../../../../../models/lead/lead-data";
import {
  useLeadDeleteMutation,
  useLeadsQuery,
} from "../../../../../hooks/lead-hooks";

export const Route = createFileRoute(
  "/_authenticated/dashboard/_layout/leads/",
)({
  component: RouteComponent,
});

function RouteComponent() {
  const query = useLeadsQuery();
  const deleteMutation = useLeadDeleteMutation();

  const onDeleteLeadClick = (leadId: string) => {
    void deleteMutation.mutateAsync(leadId);
  };

  if (query.isPending) {
    return <Loader />;
  }

  if (query.error) {
    return <Group>{query.error.details.title}</Group>;
  }

  const parsedData = query.data.map((readLeadData) =>
    readLeadDataSchema.parse(readLeadData),
  );

  return (
    <Stack>
      <Group>
        <Button>
          <Link to="/dashboard/leads/nuevo">Nuevo</Link>
        </Button>
      </Group>
      <LeadsTable data={parsedData} onDeleteLeadClick={onDeleteLeadClick} />
    </Stack>
  );
}
