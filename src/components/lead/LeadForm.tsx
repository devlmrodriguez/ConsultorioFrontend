import {
  Select,
  Space,
  Stack,
  Switch,
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
import { leadSourceValues } from "../../models/common/lead-source";
import { leadStateValues } from "../../models/common/lead-state";
import dayjs from "dayjs";
import { LeadStateBadge } from "./LeadStateBadge";
import { useState } from "react";
import {
  LocationType,
  locationTypeValues,
} from "../../models/common/location-type";
import { useForm, zodResolver } from "@mantine/form";
import {
  useDepartmentsQuery,
  useDistrictsQuery,
  useProvincesQuery,
} from "../../hooks/ubigeo-hooks";
import { CrudForm, CrudFormProps } from "../common/CrudForm/CrudForm2";

export function LeadForm(props: CrudFormProps<ReadLeadData>) {
  const propsAsSaveData = { ...props } as SaveLeadData;

  const formatUserNames = (
    firstName?: string | null,
    middleName?: string | null,
    lastName?: string | null,
  ) => {
    const names = [firstName ?? "", lastName ?? ""];
    const fullname = names.join(" ").trim();
    if (fullname === "") {
      return middleName ?? "-";
    }
    return fullname;
  };

  const [department, setDepartment] = useState<string | null | undefined>(
    props.data?.department,
  );
  const [province, setProvince] = useState<string | null | undefined>(
    props.data?.province,
  );

  const [showLocation, setLocation] = useState(
    props.data !== undefined && props.data.location !== null,
  );

  const form = useForm<SaveLeadData>({
    mode: "uncontrolled",
    initialValues: {
      ...(props.data ?? (props.initialValues as SaveLeadData)),
    },
    validate: zodResolver(saveLeadDataSchema),
    onValuesChange: (values, previous) => {
      if (values.department !== previous.department) {
        setDepartment(values.department);
        form.setFieldValue("province", null);
        form.setFieldValue("district", null);
      }

      if (values.province !== previous.province) {
        setProvince(values.province);
        form.setFieldValue("district", null);
      }
    },
  });

  const departmentsQuery = useDepartmentsQuery();
  const provincesQuery = useProvincesQuery(department ?? null);
  const districtsQuery = useDistrictsQuery(
    department ?? null,
    province ?? null,
  );

  return (
    <Stack>
      <CrudForm form={form} {...propsAsSaveData}>
        <TextInput
          label="Teléfono"
          withAsterisk
          key={form.key("phoneNumber")}
          {...form.getInputProps("phoneNumber")}
          readOnly={props.readOnly}
        />

        <TextInput
          label="Nombre"
          key={form.key("firstName")}
          {...form.getInputProps("firstName")}
          readOnly={props.readOnly}
        />

        <TextInput
          label="Segundo nombre"
          key={form.key("middleName")}
          {...form.getInputProps("middleName")}
          readOnly={props.readOnly}
        />

        <TextInput
          label="Apellidos"
          key={form.key("lastName")}
          {...form.getInputProps("lastName")}
          readOnly={props.readOnly}
        />

        <TextInput
          label="Email"
          key={form.key("email")}
          {...form.getInputProps("email")}
          readOnly={props.readOnly}
        />

        {departmentsQuery.isFetching ? (
          <Select label="Departamento" placeholder={"Cargando ..."} readOnly />
        ) : (
          <Select
            label="Departamento"
            placeholder={"Seleccione ..."}
            data={departmentsQuery.data}
            key={form.key("department")}
            {...form.getInputProps("department")}
            readOnly={props.readOnly}
            clearable
          />
        )}

        {provincesQuery.isFetching ? (
          <Select label="Provincia" placeholder={"Cargando ..."} readOnly />
        ) : (
          <Select
            label="Provincia"
            placeholder={
              !form.getValues().department
                ? "Seleccione departamento ..."
                : "Seleccione ..."
            }
            data={provincesQuery.data}
            key={form.key("province")}
            {...form.getInputProps("province")}
            readOnly={props.readOnly}
            disabled={!form.getValues().department}
            clearable
          />
        )}

        {districtsQuery.isFetching ? (
          <Select label="Distrito" placeholder={"Cargando ..."} readOnly />
        ) : (
          <Select
            label="Distrito"
            placeholder={
              !form.getValues().province
                ? "Seleccione provincia ..."
                : "Seleccione ..."
            }
            data={districtsQuery.data}
            key={form.key("district")}
            {...form.getInputProps("district")}
            readOnly={props.readOnly}
            disabled={!form.getValues().province}
            clearable
          />
        )}

        <Select
          label="Fuente del lead"
          placeholder="Seleccione ..."
          data={leadSourceValues}
          key={form.key("source")}
          {...form.getInputProps("source")}
          readOnly={props.readOnly}
        />

        <Textarea
          label="Notas"
          key={form.key("notes")}
          {...form.getInputProps("notes")}
          readOnly={props.readOnly}
        />

        <Space />

        <Switch
          label="El lead tiene lugar preferido"
          checked={showLocation}
          onChange={(event) => {
            if (event.currentTarget.checked) {
              form.setValues({
                location: props.data?.location ?? ({} as LocationType),
              });
            } else {
              form.setValues({
                location: null,
              });
            }
            setLocation(event.currentTarget.checked);
          }}
        />

        {showLocation && (
          <Select
            label="Lugar preferido"
            placeholder="Seleccione ..."
            data={locationTypeValues}
            key={form.key("location")}
            {...form.getInputProps("location")}
            readOnly={props.readOnly}
          />
        )}

        <Space />

        {/* If data is undefined (Create), state=new will be set as initial value from outside this component */}
        {props.data !== undefined && (
          <Select
            label="Estado del lead"
            withAsterisk
            placeholder="Seleccione ..."
            data={leadStateValues}
            key={form.key("state")}
            {...form.getInputProps("state")}
            readOnly={props.readOnly}
          />
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
                  <Table.Th>Modificador</Table.Th>
                  <Table.Th>Notas</Table.Th>
                  <Table.Th>Estado</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {props.data.history.map((leadHistory) => (
                  <Table.Tr key={leadHistory.id}>
                    <Table.Td>
                      {dayjs(leadHistory.dateOfCreation).format(
                        "DD/MM/YYYY hh:mm:ss a",
                      )}
                    </Table.Td>
                    <Table.Td>
                      {formatUserNames(
                        leadHistory.creatorFirstName,
                        leadHistory.creatorMiddleName,
                        leadHistory.creatorLastName,
                      )}
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

      <Space />
      <Space />
      <Space />
    </Stack>
  );
}
