import {
  Loader,
  NumberInput,
  Select,
  Space,
  Switch,
  Textarea,
  TextInput,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import {
  SaveClientData,
  saveClientDataSchema,
} from "../../models/client/client-data";
import { idDocumentTypeValues } from "../../models/common/id-document-type";
import { sexValues } from "../../models/common/sex";
import { useState } from "react";
import { SaveClientRepresentativeData } from "../../models/client/client-representative-data";
import { nestedPropertyOf } from "../../utils/nested-property-of";
import {
  WarningType,
  warningTypeValues,
} from "../../models/common/warning-type";
import {
  useDepartmentsQuery,
  useDistrictsQuery,
  useProvincesQuery,
} from "../../hooks/ubigeo-hooks";
import { useCheckLegacyCodeMutation } from "../../hooks/client-hooks";
import { CrudForm, CrudFormProps } from "../common/CrudForm/CrudForm2";
import { useForm, zodResolver } from "@mantine/form";
import { useDebouncedCallback } from "@mantine/hooks";
import {
  LocationType,
  locationTypeValues,
} from "../../models/common/location-type";

export function ClientForm(props: CrudFormProps<SaveClientData>) {
  const [showManualLegacyCode, setShowManualLegacyCode] = useState(false);
  const checkLegacyCodeMutation = useCheckLegacyCodeMutation();
  const checkLegacyCodeCallback = useDebouncedCallback(
    (legacyCode?: number | null) => {
      checkLegacyCodeMutation.mutate(legacyCode, {
        onSuccess: (data) => {
          if (data.exists) {
            form.setFieldError("legacyCode", "Este código ya existe");
          } else {
            form.clearFieldError("legacyCode");
          }
        },
      });
    },
    200,
  );

  const [department, setDepartment] = useState<string | null | undefined>(
    props.data?.department,
  );
  const [province, setProvince] = useState<string | null | undefined>(
    props.data?.province,
  );

  const [showLocation, setLocation] = useState(
    props.data !== undefined && props.data.location !== null,
  );

  const form = useForm<SaveClientData>({
    mode: "uncontrolled",
    initialValues: props.data ?? (props.initialValues as SaveClientData),
    validate: zodResolver(saveClientDataSchema),
    onValuesChange: (values, previous) => {
      if (values.legacyCode !== previous.legacyCode) {
        checkLegacyCodeCallback(values.legacyCode);
      }

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

  const [showRepresentative, setShowRepresentative] = useState(
    props.data !== undefined && props.data.representative !== null,
  );

  const [showWarning, setShowWarning] = useState(
    props.data !== undefined && props.data.warningType !== null,
  );

  return (
    <CrudForm form={form} {...props}>
      <>
        {props.data === undefined && (
          <>
            <Switch
              label="Especificar código de cliente"
              checked={showManualLegacyCode}
              onChange={(event) => {
                if (event.currentTarget.checked) {
                  form.setValues({
                    legacyCode:
                      props.data?.legacyCode ?? (null as unknown as number),
                  });
                } else {
                  form.setValues({
                    legacyCode: null,
                  });
                }
                setShowManualLegacyCode(event.currentTarget.checked);
              }}
            />

            {showManualLegacyCode && (
              <NumberInput
                label="Código de cliente"
                withAsterisk
                key={form.key("legacyCode")}
                {...form.getInputProps("legacyCode")}
                readOnly={props.readOnly}
              />
            )}

            <Space />
          </>
        )}

        {props.data !== undefined && (
          <NumberInput
            label="Código de cliente"
            withAsterisk
            key={form.key("legacyCode")}
            {...form.getInputProps("legacyCode")}
            readOnly={true}
            disabled={true}
            leftSection={
              checkLegacyCodeMutation.isPending ? (
                <Loader size={"xs"} />
              ) : undefined
            }
          />
        )}

        <TextInput
          label="Nombre"
          withAsterisk
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
          withAsterisk
          key={form.key("lastName")}
          {...form.getInputProps("lastName")}
          readOnly={props.readOnly}
        />

        <DateInput
          label="Fecha de nacimiento"
          withAsterisk
          valueFormat="DD/MM/YYYY"
          key={form.key("dateOfBirth")}
          {...form.getInputProps("dateOfBirth")}
          readOnly={props.readOnly}
        />

        <TextInput
          label="Teléfono"
          key={form.key("phoneNumber")}
          {...form.getInputProps("phoneNumber")}
          readOnly={props.readOnly}
        />

        <TextInput
          label="Email"
          key={form.key("email")}
          {...form.getInputProps("email")}
          readOnly={props.readOnly}
        />

        <Select
          label="Tipo de documento de identidad"
          placeholder="Seleccione ..."
          data={idDocumentTypeValues}
          key={form.key("idDocumentType")}
          {...form.getInputProps("idDocumentType")}
          readOnly={props.readOnly}
        />

        <TextInput
          label="Documento de identidad"
          key={form.key("idDocument")}
          {...form.getInputProps("idDocument")}
          readOnly={props.readOnly}
        />

        <Select
          label="Sexo"
          placeholder="Seleccione ..."
          withAsterisk
          data={sexValues}
          key={form.key("sex")}
          {...form.getInputProps("sex")}
          readOnly={props.readOnly}
        />

        <TextInput
          label="Ocupación"
          key={form.key("occupation")}
          {...form.getInputProps("occupation")}
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

        <TextInput
          label="Dirección"
          withAsterisk
          key={form.key("address")}
          {...form.getInputProps("address")}
          readOnly={props.readOnly}
        />

        <Space />

        <Switch
          label="El cliente tiene lugar preferido"
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

        <Textarea
          label="¿Cómo se enteró de nosotros?"
          key={form.key("howDidYouLearnAboutUs")}
          {...form.getInputProps("howDidYouLearnAboutUs")}
          readOnly={props.readOnly}
        />

        <Space />

        <Switch
          label="El cliente tiene advertencia"
          checked={showWarning}
          onChange={(event) => {
            if (event.currentTarget.checked) {
              form.setValues({
                warningType: props.data?.warningType ?? ({} as WarningType),
                warning: props.data?.warning ?? (null as unknown as string),
              });
            } else {
              form.setValues({
                warningType: null,
                warning: null,
              });
            }
            setShowWarning(event.currentTarget.checked);
          }}
        />

        {showWarning && (
          <>
            <Select
              label="Tipo de advertencia"
              placeholder="Seleccione ..."
              withAsterisk
              data={warningTypeValues}
              key={form.key("warningType")}
              {...form.getInputProps("warningType")}
              readOnly={props.readOnly}
            />

            <Textarea
              label="Advertencia"
              key={form.key("warning")}
              {...form.getInputProps("warning")}
              readOnly={props.readOnly}
            />
          </>
        )}

        <Space />

        <Switch
          label="El cliente tiene apoderado"
          checked={showRepresentative}
          onChange={(event) => {
            if (event.currentTarget.checked) {
              form.setValues({
                representative:
                  props.data?.representative ??
                  ({} as SaveClientRepresentativeData),
              });
            } else {
              form.setValues({
                representative: null,
              });
            }
            setShowRepresentative(event.currentTarget.checked);
          }}
        />

        {showRepresentative && (
          <>
            <TextInput
              label="Relación del apoderado con el cliente"
              withAsterisk
              key={form.key(
                nestedPropertyOf<SaveClientData, SaveClientRepresentativeData>(
                  "representative",
                  "relation",
                ),
              )}
              {...form.getInputProps(
                nestedPropertyOf<SaveClientData, SaveClientRepresentativeData>(
                  "representative",
                  "relation",
                ),
              )}
              readOnly={props.readOnly}
            />

            <TextInput
              label="Nombre completo del apoderado"
              withAsterisk
              key={form.key(
                nestedPropertyOf<SaveClientData, SaveClientRepresentativeData>(
                  "representative",
                  "fullName",
                ),
              )}
              {...form.getInputProps(
                nestedPropertyOf<SaveClientData, SaveClientRepresentativeData>(
                  "representative",
                  "fullName",
                ),
              )}
              readOnly={props.readOnly}
            />

            <TextInput
              label="Teléfono del apoderado"
              key={form.key(
                nestedPropertyOf<SaveClientData, SaveClientRepresentativeData>(
                  "representative",
                  "phoneNumber",
                ),
              )}
              {...form.getInputProps(
                nestedPropertyOf<SaveClientData, SaveClientRepresentativeData>(
                  "representative",
                  "phoneNumber",
                ),
              )}
              readOnly={props.readOnly}
            />

            <TextInput
              label="Email del apoderado"
              key={form.key(
                nestedPropertyOf<SaveClientData, SaveClientRepresentativeData>(
                  "representative",
                  "email",
                ),
              )}
              {...form.getInputProps(
                nestedPropertyOf<SaveClientData, SaveClientRepresentativeData>(
                  "representative",
                  "email",
                ),
              )}
              readOnly={props.readOnly}
            />

            <TextInput
              label="Dirección del apoderado"
              key={form.key(
                nestedPropertyOf<SaveClientData, SaveClientRepresentativeData>(
                  "representative",
                  "address",
                ),
              )}
              {...form.getInputProps(
                nestedPropertyOf<SaveClientData, SaveClientRepresentativeData>(
                  "representative",
                  "address",
                ),
              )}
              readOnly={props.readOnly}
            />
          </>
        )}
      </>
    </CrudForm>
  );
}
