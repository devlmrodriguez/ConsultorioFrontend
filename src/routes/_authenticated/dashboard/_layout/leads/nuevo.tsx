import {
  createFileRoute,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import {
  SaveLeadData,
  saveLeadDataSchema,
} from "../../../../../models/lead/lead-data";
import { LeadForm } from "../../../../../components/lead/LeadForm";
import { Button, Group, Stack } from "@mantine/core";
import { useLeadCreateMutation } from "../../../../../hooks/lead-hooks";
import { leadStateNewValue } from "../../../../../models/common/lead-state";

export const Route = createFileRoute(
  "/_authenticated/dashboard/_layout/leads/nuevo",
)({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate({ from: "/dashboard/leads/nuevo" });
  const { history } = useRouter();

  const createMutation = useLeadCreateMutation();

  const onCreateClick = (saveLeadData: SaveLeadData) => {
    const parsedData = saveLeadDataSchema.parse(saveLeadData);
    void createMutation
      .mutateAsync(parsedData)
      .then(() => navigate({ to: "/dashboard/leads" }));
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
      <LeadForm
        readOnly={false}
        onCreateClick={onCreateClick}
        initialValues={{ state: leadStateNewValue }}
      />
    </Stack>
  );
}
