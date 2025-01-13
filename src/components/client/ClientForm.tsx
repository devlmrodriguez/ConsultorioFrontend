import { Select, Space, Switch, Textarea, TextInput } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import {
  SaveClientData,
  saveClientDataSchema,
} from "../../models/client/client-data";
import { idDocumentTypeValues } from "../../models/common/id-document-type";
import { sexValues } from "../../models/common/sex";
import { CrudForm, CrudFormProps } from "../common/CrudForm/CrudForm";
import { useState } from "react";
import { SaveClientRepresentativeData } from "../../models/client/client-representative-data";
import { nestedPropertyOf } from "../../utils/nested-property-of";

export function ClientForm(props: CrudFormProps<SaveClientData>) {
  const [showRepresentative, setShowRepresentative] = useState(
    props.data !== undefined && props.data.representative !== null,
  );

  return (
    <CrudForm saveSchema={saveClientDataSchema} {...props}>
      {(form) => (
        <>
          <TextInput
            label="Nombre"
            withAsterisk
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
            withAsterisk
            {...form.getInputProps("lastName")}
            readOnly={props.readOnly}
          />

          <DateInput
            label="Fecha de nacimiento"
            withAsterisk
            valueFormat="DD/MM/YYYY"
            {...form.getInputProps("dateOfBirth")}
            readOnly={props.readOnly}
          />

          <TextInput
            label="Teléfono"
            {...form.getInputProps("phoneNumber")}
            readOnly={props.readOnly}
          />

          <TextInput
            label="Email"
            {...form.getInputProps("email")}
            readOnly={props.readOnly}
          />

          <Select
            label="Tipo de documento de identidad"
            placeholder="Seleccione ..."
            data={idDocumentTypeValues}
            {...form.getInputProps("idDocumentType")}
            readOnly={props.readOnly}
          />

          <TextInput
            label="Documento de identidad"
            {...form.getInputProps("idDocument")}
            readOnly={props.readOnly}
          />

          <Select
            label="Sexo"
            placeholder="Seleccione ..."
            withAsterisk
            data={sexValues}
            {...form.getInputProps("sex")}
            readOnly={props.readOnly}
          />

          <TextInput
            label="Ocupación"
            {...form.getInputProps("occupation")}
            readOnly={props.readOnly}
          />

          <TextInput
            label="Dirección"
            withAsterisk
            {...form.getInputProps("address")}
            readOnly={props.readOnly}
          />

          <Textarea
            label="¿Cómo se enteró de nosotros?"
            {...form.getInputProps("howDidYouLearnAboutUs")}
            readOnly={props.readOnly}
          />

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
                {...form.getInputProps(
                  nestedPropertyOf<
                    SaveClientData,
                    SaveClientRepresentativeData
                  >("representative", "relation"),
                )}
                readOnly={props.readOnly}
              />

              <TextInput
                label="Nombre completo del apoderado"
                withAsterisk
                {...form.getInputProps(
                  nestedPropertyOf<
                    SaveClientData,
                    SaveClientRepresentativeData
                  >("representative", "fullName"),
                )}
                readOnly={props.readOnly}
              />

              <TextInput
                label="Teléfono del apoderado"
                {...form.getInputProps(
                  nestedPropertyOf<
                    SaveClientData,
                    SaveClientRepresentativeData
                  >("representative", "phoneNumber"),
                )}
                readOnly={props.readOnly}
              />

              <TextInput
                label="Email del apoderado"
                {...form.getInputProps(
                  nestedPropertyOf<
                    SaveClientData,
                    SaveClientRepresentativeData
                  >("representative", "email"),
                )}
                readOnly={props.readOnly}
              />

              <TextInput
                label="Dirección del apoderado"
                {...form.getInputProps(
                  nestedPropertyOf<
                    SaveClientData,
                    SaveClientRepresentativeData
                  >("representative", "address"),
                )}
                readOnly={props.readOnly}
              />
            </>
          )}
        </>
      )}
    </CrudForm>
  );
}
