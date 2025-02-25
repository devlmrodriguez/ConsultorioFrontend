import { IconPencil, IconTrash } from "@tabler/icons-react";
import { ActionIcon, Group, Table, Text } from "@mantine/core";
import { ReadClientData } from "../../models/client/client-data";
import dayjs from "dayjs";
import { Link } from "@tanstack/react-router";
import { ClientAvatarWithWarning } from "./ClientWarning";
import { computeAge } from "../../utils/utils";
import {
  useDepartmentsLookup,
  useDistrictsLookup,
  useProvincesLookup,
} from "../../hooks/ubigeo-hooks";

interface ClientsTableProps {
  data: ReadClientData[];
  onDeleteClientClick?: (clientId: string) => void;
}

export function ClientsTable(props: ClientsTableProps) {
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
          {item.legacyCode ?? "-"}
        </Text>
      </Table.Td>

      <Table.Td>
        <Group gap="sm">
          <ClientAvatarWithWarning
            warningType={item.warningType}
            warning={item.warning}
          />
          <Text fz="sm" fw={500}>
            {item.firstName + " " + item.lastName}
          </Text>
        </Group>
      </Table.Td>

      <Table.Td>
        <Text fz="sm">{computeAge(item.dateOfBirth)}</Text>
      </Table.Td>

      <Table.Td>
        <Text fz="sm">{item.phoneNumber ?? "-"}</Text>
      </Table.Td>

      <Table.Td>
        <Text fz="sm">{item.email ?? "-"}</Text>
      </Table.Td>

      <Table.Td>
        <Text fz="sm">
          {(item.idDocumentType ?? "-") + " " + (item.idDocument ?? "")}
        </Text>
      </Table.Td>

      <Table.Td>
        <Text fz="sm">{item.sex}</Text>
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
        <Text fz="sm">{item.representative ? "Si" : "No"}</Text>
      </Table.Td>

      <Table.Td>
        <Text fz="sm">No</Text>
      </Table.Td>

      <Table.Td>
        <Text fz="sm">{dayjs(item.dateOfCreation).format("DD/MM/YYYY")}</Text>
      </Table.Td>

      <Table.Td>
        <Group gap={0} justify="flex-end">
          <Link
            to="/dashboard/clientes/$clientId"
            params={{
              clientId: item.id,
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
              props.onDeleteClientClick?.(item.id);
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
            <Table.Th>Código</Table.Th>
            <Table.Th>Cliente</Table.Th>
            <Table.Th>Edad</Table.Th>
            <Table.Th>Teléfono</Table.Th>
            <Table.Th>Email</Table.Th>
            <Table.Th>Documento</Table.Th>
            <Table.Th>Sexo</Table.Th>
            <Table.Th>Departamento</Table.Th>
            <Table.Th>Provincia</Table.Th>
            <Table.Th>Distrito</Table.Th>
            <Table.Th>Lugar</Table.Th>
            <Table.Th>¿Tiene Apoderado?</Table.Th>
            <Table.Th>¿Ya es Paciente?</Table.Th>
            <Table.Th>Fecha</Table.Th>
            <Table.Th />
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  );
}
