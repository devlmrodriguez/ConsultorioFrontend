import { IconPencil, IconTrash } from "@tabler/icons-react";
import { ActionIcon, Avatar, Group, Table, Text } from "@mantine/core";
import { ClientData } from "../../models/client/client-data";
import dayjs from "dayjs";
import { Link } from "@tanstack/react-router";

interface ClientsTableProps {
  data: ClientData[];
  onDeleteClientClick?: (clientId: string) => void;
}

export function ClientsTable(props: ClientsTableProps) {
  const rows = props.data.map((item) => (
    <Table.Tr key={item.id}>
      <Table.Td>
        <Group gap="sm">
          <Avatar
            size={30}
            src={
              "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-1.png"
            }
            radius={30}
          />
          <Text fz="sm" fw={500}>
            {item.firstName + " " + item.lastName}
          </Text>
        </Group>
      </Table.Td>

      <Table.Td>
        <Text fz="sm">{dayjs(item.dateOfBirth).format("DD/MM/YYYY")}</Text>
      </Table.Td>

      <Table.Td>
        <Text fz="sm">{item.sex}</Text>
      </Table.Td>

      <Table.Td>
        <Text fz="sm">{item.phoneNumber ?? "-"}</Text>
      </Table.Td>

      <Table.Td>
        <Text fz="sm">{item.email ?? "-"}</Text>
      </Table.Td>

      <Table.Td>
        <Group gap={0} justify="flex-end">
          <Link
            to="/dashboard/clientes/$clientId"
            params={{
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              clientId: item.id!.toString(),
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
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              props.onDeleteClientClick?.(item.id!.toString());
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
            <Table.Th>Cliente</Table.Th>
            <Table.Th>Fecha de nacimiento</Table.Th>
            <Table.Th>Sexo</Table.Th>
            <Table.Th>Teléfono</Table.Th>
            <Table.Th>Email</Table.Th>
            <Table.Th />
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  );
}
