import { Select, Textarea, TextInput } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { ClientData, clientDataSchema } from "../../models/client/client-data";
import { idDocumentTypeValues } from "../../models/common/id-document-type";
import { sexValues } from "../../models/common/sex";
import { CrudForm, CrudFormProps } from "../common/CrudForm/CrudForm";

export function ClientForm(props: CrudFormProps<ClientData>) {
  return (
    <CrudForm schema={clientDataSchema} {...props}>
      {(form) => (
        <>
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

          <TextInput
            label="Dirección"
            withAsterisk
            key={form.key("address")}
            {...form.getInputProps("address")}
            readOnly={props.readOnly}
          />

          <Textarea
            label="¿Cómo se enteró de nosotros?"
            key={form.key("howDidYouLearnAboutUs")}
            {...form.getInputProps("howDidYouLearnAboutUs")}
            readOnly={props.readOnly}
          />
        </>
      )}
    </CrudForm>
  );
}
