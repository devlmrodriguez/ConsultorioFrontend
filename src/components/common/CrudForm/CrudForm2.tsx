import { Button, Group, Space, Stack } from "@mantine/core";
import { FormErrors, UseFormReturnType } from "@mantine/form";
import React from "react";

export interface CrudFormProps<TData extends Record<string, unknown>> {
  data?: TData;
  readOnly?: boolean;
  onCreateClick?: (data: TData) => void;
  onUpdateClick?: (data: TData) => void;
  onDeleteClick?: (data: TData) => void;
  initialValues?: Partial<TData>;
}

interface InternalCrudFormProps<TData extends Record<string, unknown>>
  extends CrudFormProps<TData> {
  form: UseFormReturnType<TData, (values: TData) => TData>;
  children: React.ReactNode;
}

export function CrudForm<TData extends Record<string, unknown>>(
  props: InternalCrudFormProps<TData>,
) {
  const onSubmitForm = (values: TData) => {
    if (props.data === undefined) {
      props.onCreateClick?.(values);
    } else {
      props.onUpdateClick?.(values);
    }
  };

  const onError = (errors: FormErrors) => {
    console.log(errors);
  };

  const onDeleteClick = () => {
    const values = props.form.getValues();
    props.onDeleteClick?.(values);
  };

  return (
    <form onSubmit={props.form.onSubmit(onSubmitForm, onError)}>
      <Stack>
        {props.children}

        {!props.readOnly && (
          <Group justify="end">
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

        <Space />
        <Space />
        <Space />
      </Stack>
    </form>
  );
}
