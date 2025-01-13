import { IconPencil, IconTrash } from "@tabler/icons-react";
import { ActionIcon, Group, Table, Text } from "@mantine/core";
import { ReadPodiatryReasonData } from "../../models/podiatry-reason/podiatry-reason-data";
import { Link } from "@tanstack/react-router";

interface PodiatryReasonsTableProps {
  data: ReadPodiatryReasonData[];
  onDeletePodiatryReasonClick?: (podiatryReasonId: string) => void;
}

export function PodiatryReasonsTable(props: PodiatryReasonsTableProps) {
  const rows = props.data.map((item) => (
    <Table.Tr key={item.id}>
      <Table.Td>
        <Text fz="sm">{item.name}</Text>
      </Table.Td>

      <Table.Td>
        <Text fz="sm">{item.description}</Text>
      </Table.Td>

      <Table.Td>
        <Group gap={0} justify="flex-end">
          <Link
            to="/dashboard/podologia/razones/$podiatryReasonId"
            params={{
              podiatryReasonId: item.id,
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
              props.onDeletePodiatryReasonClick?.(item.id);
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
            <Table.Th>Nombre</Table.Th>
            <Table.Th>Descripción</Table.Th>
            <Table.Th />
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  );
}
