import {
  createFileRoute,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import { LeadForm } from "../../../../../components/lead/LeadForm";
import { Button, Group, Loader, Stack } from "@mantine/core";
import {
  readLeadDataSchema,
  SaveLeadData,
  saveLeadDataSchema,
} from "../../../../../models/lead/lead-data";
import {
  useLeadDeleteMutation,
  useLeadQuery,
  useLeadUpdateMutation,
} from "../../../../../hooks/lead-hooks";

export const Route = createFileRoute(
  "/_authenticated/dashboard/_layout/leads/$leadId",
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { leadId } = Route.useParams();
  const navigate = useNavigate({ from: "/dashboard/leads/$leadId" });
  const { history } = useRouter();

  const query = useLeadQuery(leadId);
  const updateMutation = useLeadUpdateMutation(leadId);
  const deleteMutation = useLeadDeleteMutation();

  const onUpdateClick = (saveLeadData: SaveLeadData) => {
    const parsedData = saveLeadDataSchema.parse(saveLeadData);
    void updateMutation
      .mutateAsync(parsedData)
      .then(() => navigate({ to: "/dashboard/leads" }));
  };

  const onDeleteClick = () => {
    void deleteMutation
      .mutateAsync(leadId)
      .then(() => navigate({ to: "/dashboard/leads" }));
  };

  if (query.isPending) {
    return <Loader />;
  }

  if (query.error) {
    return <Group>{query.error.details.title}</Group>;
  }

  const parsedData = readLeadDataSchema.parse(query.data);

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
      <LeadForm
        data={parsedData}
        readOnly={false}
        onUpdateClick={onUpdateClick}
        onDeleteClick={onDeleteClick}
      />
    </Stack>
  );
}
