import { Button, Group, Stack } from "@mantine/core";
import { FormErrors, useForm, UseFormReturnType, zodResolver } from "@mantine/form";
import React from "react";
import { ZodSchema } from "zod";

export interface CrudFormProps<TData extends Record<string, unknown>> {
  data?: TData;
  readOnly?: boolean;
  onCreateClick?: (data: TData) => void;
  onUpdateClick?: (data: TData) => void;
  onDeleteClick?: (data: TData) => void;
}

// Internal props with schema and children
interface InternalCrudFormProps<
  TData extends Record<string, unknown>,
> extends CrudFormProps<TData> {
  schema: ZodSchema<TData>;

  // Render prop, pass form to inner children
  children: (
    form: UseFormReturnType<TData, (values: TData) => TData>,
  ) => React.ReactNode;
}

export function CrudForm<TData extends Record<string, unknown>>(
  props: InternalCrudFormProps<TData>,
) {
  const form = useForm<TData>({
    mode: "uncontrolled",
    initialValues: props.data,
    validate: zodResolver(props.schema),
  });

  const onSubmitForm = (values: TData) => {
    if (props.data === undefined) {
      props.onCreateClick?.(values);
    } else {
      props.onUpdateClick?.(values);
    }
  };

  const onError = (errors: FormErrors) => { console.log("error lmao", errors); };

  const onDeleteClick = () => {
    const values = form.getValues();
    props.onDeleteClick?.(values);
  };

  return (
    <form onSubmit={form.onSubmit(onSubmitForm, onError)}>
      <Stack>
        {props.children(form)}

        {!props.readOnly && (
          <Group>
            <Button type="submit">
              {props.data === undefined ? "Agregar" : "Actualizar"}
            </Button>
            {props.data !== undefined && (
              <Button type="button" onClick={onDeleteClick} color="red">
                Eliminar
              </Button>
            )}
          </Group>
        )}
      </Stack>
    </form>
  );
}
