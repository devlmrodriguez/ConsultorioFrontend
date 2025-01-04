import { Button, Container, Stack } from "@mantine/core";
import { useForm, UseFormReturnType, zodResolver } from "@mantine/form";
import React from "react";
import { ZodSchema } from "zod";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface CrudFormProps<TData extends Record<string, any>> {
  data?: TData;
  readOnly?: boolean;
  onCreateClick?: (data: TData) => void;
  onUpdateClick?: (data: TData) => void;
  onDeleteClick?: (data: TData) => void;
}

// Internal props with schema and children
interface InternalCrudFormProps<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TData extends Record<string, any>,
> extends CrudFormProps<TData> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  schema: ZodSchema<Record<string, any>>;

  // Render prop, pass form to inner children
  children: (
    form: UseFormReturnType<TData, (values: TData) => TData>,
  ) => React.ReactNode;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function CrudForm<TData extends Record<string, any>>(
  props: InternalCrudFormProps<TData>,
) {
  const form = useForm<TData>({
    mode: "uncontrolled",
    initialValues: props.data,
    validate: zodResolver(props.schema),
  });

  const onSubmitForm = () => {
    const data = form.getValues();
    if (props.data === undefined) {
      props.onCreateClick?.(data);
    } else {
      props.onUpdateClick?.(data);
    }
  };

  const onDeleteClick = () => {
    const data = form.getValues();
    props.onDeleteClick?.(data);
  };

  return (
    <form onSubmit={form.onSubmit(onSubmitForm)}>
      <Stack>
        {props.children(form)}

        {!props.readOnly && (
          <Container>
            <Button type="submit">
              {props.data === undefined ? "Agregar" : "Actualizar"}
            </Button>
            {props.data !== undefined && (
              <Button type="button" onClick={onDeleteClick}>
                Eliminar
              </Button>
            )}
          </Container>
        )}
      </Stack>
    </form>
  );
}
