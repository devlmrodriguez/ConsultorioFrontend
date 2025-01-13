import { TextInput } from "@mantine/core";
import { CrudForm, CrudFormProps } from "../common/CrudForm/CrudForm";
import {
  SavePodiatryReasonData,
  savePodiatryReasonDataSchema,
} from "../../models/podiatry-reason/podiatry-reason-data";

export function PodiatryReasonForm(
  props: CrudFormProps<SavePodiatryReasonData>,
) {
  return (
    <CrudForm saveSchema={savePodiatryReasonDataSchema} {...props}>
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
