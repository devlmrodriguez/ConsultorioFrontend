import { TextInput } from "@mantine/core";
import { CrudForm, CrudFormProps } from "../common/CrudForm/CrudForm";
import {
  SavePodiatryPreconditionData,
  savePodiatryPreconditionDataSchema,
} from "../../models/podiatry-precondition/podiatry-precondition-data";

export function PodiatryPreconditionForm(
  props: CrudFormProps<SavePodiatryPreconditionData>,
) {
  return (
    <CrudForm saveSchema={savePodiatryPreconditionDataSchema} {...props}>
      {(form) => (
        <>
          <TextInput
            label="Nombre"
            withAsterisk
            {...form.getInputProps("name")}
            readOnly={props.readOnly}
          />

          <TextInput
            label="Descripción"
            withAsterisk
            {...form.getInputProps("description")}
            readOnly={props.readOnly}
          />
        </>
      )}
    </CrudForm>
  );
}
