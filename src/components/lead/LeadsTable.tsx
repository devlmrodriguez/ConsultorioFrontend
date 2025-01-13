import { IconPencil, IconTrash } from "@tabler/icons-react";
import { ActionIcon, Group, Table, Text } from "@mantine/core";
import { ReadLeadData } from "../../models/lead/lead-data";
import { Link } from "@tanstack/react-router";
import { LeadStateBadge } from "./LeadStateBadge";

interface LeadsTableProps {
  data: ReadLeadData[];
  onDeleteLeadClick?: (leadId: string) => void;
}

export function LeadsTable(props: LeadsTableProps) {
  const rows = props.data.map((item) => (
    <Table.Tr key={item.id}>
      <Table.Td>
        <Text fz="sm" fw={500}>
          {item.phoneNumber}
        </Text>
      </Table.Td>

      <Table.Td>
        <Text fz="sm">
          {`${item.firstName ?? ""} ${item.lastName ?? ""}`.trim() === ""
            ? "-"
            : `${item.firstName ?? ""} ${item.lastName ?? ""}`.trim()}
        </Text>
      </Table.Td>

      <Table.Td>
        <Text fz="sm">{item.email ?? "-"}</Text>
      </Table.Td>

      <Table.Td>
        <Text fz="sm">
          <LeadStateBadge leadState={item.state} />
        </Text>
      </Table.Td>

      <Table.Td>
        <Group gap={0} justify="flex-end">
          <Link
            to="/dashboard/leads/$leadId"
            params={{
              leadId: item.id,
            }}
          >
            <ActionIcon variant="subtle" color="gray">
              <IconPencil size={16} stroke={1.5} />
            </ActionIcon>
          </Link>
          <ActionIcon
            variant="subtle"
            color="red"
            onClick={() => {
              props.onDeleteLeadClick?.(item.id);
            }}
          >
            <IconTrash size={16} stroke={1.5} />
          </ActionIcon>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Table.ScrollContainer minWidth={800}>
      <Table verticalSpacing="sm">
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Teléfono</Table.Th>
            <Table.Th>Nombres</Table.Th>
            <Table.Th>Email</Table.Th>
            <Table.Th>Estado</Table.Th>
            <Table.Th />
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  );
}
