import { IconPencil, IconTrash } from "@tabler/icons-react";
import { ActionIcon, Group, Table, Text } from "@mantine/core";
import { ReadLeadData } from "../../models/lead/lead-data";
import { Link } from "@tanstack/react-router";
import { LeadStateBadge } from "./LeadStateBadge";
import dayjs from "dayjs";
import {
  useDepartmentsLookup,
  useDistrictsLookup,
  useProvincesLookup,
} from "../../hooks/ubigeo-hooks";
import { joinValuesOrPlaceholder } from "../../utils/utils";

interface LeadsTableProps {
  data: ReadLeadData[];
  onDeleteLeadClick?: (leadId: string) => void;
}

export function LeadsTable(props: LeadsTableProps) {
  const departments = useDepartmentsLookup();
  const getDepartmentLabelById = (id: string | null | undefined) => {
    if (id === null || id === undefined) {
      return "-";
    }
    const department = departments?.find((d) => d.value === id);
    return department?.label ?? "-";
  };

  const provinces = useProvincesLookup();
  const getProvinceLabelById = (id: string | null | undefined) => {
    if (id === null || id === undefined) {
      return "-";
    }
    const province = provinces?.find((p) => p.value === id);
    return province?.label ?? "-";
  };

  const districts = useDistrictsLookup();
  const getDistrictLabelById = (id: string | null | undefined) => {
    if (id === null || id === undefined) {
      return "-";
    }
    const district = districts?.find((d) => d.value === id);
    return district?.label ?? "-";
  };

  const rows = props.data.map((item) => (
    <Table.Tr key={item.id}>
      <Table.Td>
        <Text fz="sm" fw={500}>
          {item.phoneNumber}
        </Text>
      </Table.Td>

      <Table.Td>
        <Text fz="sm">
          {joinValuesOrPlaceholder([item.firstName, item.lastName])}
        </Text>
      </Table.Td>

      <Table.Td>
        <Text fz="sm">{item.email ?? "-"}</Text>
      </Table.Td>

      <Table.Td>
        <Text fz="sm">{getDepartmentLabelById(item.department)}</Text>
      </Table.Td>

      <Table.Td>
        <Text fz="sm">{getProvinceLabelById(item.province)}</Text>
      </Table.Td>

      <Table.Td>
        <Text fz="sm">{getDistrictLabelById(item.district)}</Text>
      </Table.Td>

      <Table.Td>
        <Text fz="sm">{item.location ?? "-"}</Text>
      </Table.Td>

      <Table.Td>
        <LeadStateBadge leadState={item.state} />
      </Table.Td>

      <Table.Td>
        <Text fz="sm">{dayjs(item.dateOfCreation).format("DD/MM/YYYY")}</Text>
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
            <Table.Th>Departamento</Table.Th>
            <Table.Th>Provincia</Table.Th>
            <Table.Th>Distrito</Table.Th>
            <Table.Th>Lugar</Table.Th>
            <Table.Th>Estado</Table.Th>
            <Table.Th>Fecha</Table.Th>
            <Table.Th />
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  );
}
