import { IconPencil, IconTrash } from "@tabler/icons-react";
import { ActionIcon, Group, Table, Text } from "@mantine/core";
import { ReadPodiatryPreconditionData } from "../../models/podiatry-precondition/podiatry-precondition-data";
import { Link } from "@tanstack/react-router";

interface PodiatryPreconditionsTableProps {
  data: ReadPodiatryPreconditionData[];
  onDeletePodiatryPreconditionClick?: (podiatryPreconditionId: string) => void;
}

export function PodiatryPreconditionsTable(
  props: PodiatryPreconditionsTableProps,
) {
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
            to="/dashboard/podologia/precondiciones/$podiatryPreconditionId"
            params={{
              podiatryPreconditionId: item.id,
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
              props.onDeletePodiatryPreconditionClick?.(item.id);
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
