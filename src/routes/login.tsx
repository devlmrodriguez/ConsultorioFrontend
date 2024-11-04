import { createFileRoute } from "@tanstack/react-router";
import {
  Alert,
  Button,
  Card,
  Center,
  Container,
  LoadingOverlay,
  PasswordInput,
  Select,
  Space,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useAuthTenantsQuery } from "../hooks/auth-tenants-query.hook";
import { useAuthLoginMutation } from "../hooks/auth-login-mutation.hook";
import { isNotEmpty, useForm } from "@mantine/form";
import { AuthLoginRequest } from "../models/auth-login-request";

export const Route = createFileRoute("/login")({
  component: RouteComponent,
});

function RouteComponent() {
  const authTenantsQuery = useAuthTenantsQuery();
  const authLoginMutation = useAuthLoginMutation();

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      tenantId: "",
      email: "",
      password: "",
    },
    validate: {
      tenantId: isNotEmpty("Debe seleccionar un consultorio"),
      email: isNotEmpty("Debe ingresar su usuario"),
      password: isNotEmpty("Debe ingresar su contraseña"),
    },
  });

  const onSubmitForm = () => {
    const request: AuthLoginRequest = form.getValues();
    authLoginMutation.mutate(request);
  };

  return (
    <Container size="xs">
      <Space h="xl" />
      <form onSubmit={form.onSubmit(onSubmitForm)}>
        <Card shadow="sm" padding="lg" radius="md" withBorder pos="relative">
          <LoadingOverlay
            visible={authLoginMutation.isPending}
            zIndex={1000}
            overlayProps={{ radius: "sm", blur: 2 }}
          />
          <Stack>
            <Title order={1} size="h4">
              Ingresar al sistema
            </Title>
            <Select
              label="Consultorio"
              placeholder="Seleccione su consultorio"
              data={authTenantsQuery.data?.content?.tenants ?? []}
              key={form.key("tenantId")}
              {...form.getInputProps("tenantId")}
            />
            <TextInput
              label="Usuario"
              key={form.key("email")}
              {...form.getInputProps("email")}
            />
            <PasswordInput
              label="Contraseña"
              key={form.key("password")}
              {...form.getInputProps("password")}
            />
            {(authLoginMutation.isError ||
              authLoginMutation.data?.success === false) && (
              <Alert variant="light" color="red" title="Error">
                {authLoginMutation.isError && (
                  <Text>Error inesperado en el servidor</Text>
                )}
                {authLoginMutation.data?.success === false && (
                  <Text>{authLoginMutation.data.message}</Text>
                )}
              </Alert>
            )}
            <Center>
              <Button variant="filled" type="submit">
                Ingresar
              </Button>
            </Center>
          </Stack>
        </Card>
      </form>
    </Container>
  );
}
