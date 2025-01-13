import {
  Select,
  Space,
  Stack,
  Table,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import {
  ReadLeadData,
  SaveLeadData,
  saveLeadDataSchema,
} from "../../models/lead/lead-data";
import { CrudForm, CrudFormProps } from "../common/CrudForm/CrudForm";
import { leadSourceValues } from "../../models/common/lead-source";
import {
  leadStateNewValue,
  leadStateValues,
} from "../../models/common/lead-state";
import dayjs from "dayjs";
import { LeadStateBadge } from "./LeadStateBadge";

export function LeadForm(props: CrudFormProps<ReadLeadData>) {
  const propsAsSaveData = { ...props } as SaveLeadData;
  return (
    <Stack>
      <CrudForm saveSchema={saveLeadDataSchema} {...propsAsSaveData}>
        {(form) => (
          <>
            <TextInput
              label="Teléfono"
              withAsterisk
              {...form.getInputProps("phoneNumber")}
              readOnly={props.readOnly}
            />

            <TextInput
              label="Nombre"
              {...form.getInputProps("firstName")}
              readOnly={props.readOnly}
            />

            <TextInput
              label="Segundo nombre"
              {...form.getInputProps("middleName")}
              readOnly={props.readOnly}
            />

            <TextInput
              label="Apellidos"
              {...form.getInputProps("lastName")}
              readOnly={props.readOnly}
            />

            <TextInput
              label="Email"
              {...form.getInputProps("email")}
              readOnly={props.readOnly}
            />

            <Select
              label="Fuente del lead"
              placeholder="Seleccione ..."
              data={leadSourceValues}
              {...form.getInputProps("source")}
              readOnly={props.readOnly}
            />

            <Textarea
              label="Notas"
              {...form.getInputProps("notes")}
              readOnly={props.readOnly}
            />

            {props.data === undefined ? (
              <input
                type="hidden"
                {...form.getInputProps("state")}
                value={leadStateNewValue}
              />
            ) : (
              <Select
                label="Estado del lead"
                withAsterisk
                placeholder="Seleccione ..."
                data={leadStateValues}
                {...form.getInputProps("state")}
                readOnly={props.readOnly}
              />
            )}
          </>
        )}
      </CrudForm>
      {props.data !== undefined && props.data.history.length > 0 && (
        <>
          <Space />
          <Stack>
            <Title order={3}>Historial</Title>
            <Space />
            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Fecha</Table.Th>
                  <Table.Th>Notas</Table.Th>
                  <Table.Th>Estado</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {props.data.history.map((leadHistory) => (
                  <Table.Tr key={leadHistory.id}>
                    <Table.Td>
                      {dayjs(leadHistory.dateOfCreation).format("DD/MM/YYYY")}
                    </Table.Td>
                    <Table.Td>{leadHistory.notes ?? "-"}</Table.Td>
                    <Table.Td>
                      <LeadStateBadge leadState={leadHistory.state} />
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Stack>
        </>
      )}
    </Stack>
  );
}
