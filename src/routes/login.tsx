import { createFileRoute, useNavigate } from "@tanstack/react-router";
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
import { isNotEmpty, useForm } from "@mantine/form";
import { AuthLoginRequest } from "../models/auth/auth-login-request";
import { useApiMutation } from "../hooks/api-mutation.hook";
import { API_ROUTES } from "../constants/api-routes";
import { AuthLoginResponse } from "../models/auth/auth-login-response";
import { useApiQuery } from "../hooks/api-query.hook";
import { AuthTenantsResponse } from "../models/auth/auth-tenants-response";
import { formatApiError } from "../utils/api-helpers";
import { useUserStore } from "../stores/user-store";

export const Route = createFileRoute("/login")({
  component: RouteComponent,
});

function RouteComponent() {
  const userStore = useUserStore();

  const authTenantsQuery = useApiQuery<AuthTenantsResponse>(
    API_ROUTES.AuthTenants,
    ["auth-tenants"],
  );
  const authLoginMutation = useApiMutation<AuthLoginResponse, AuthLoginRequest>(
    API_ROUTES.AuthLogin,
    "POST",
  );

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      tenantId: "",
      email: "",
      password: "",
    },
    validate: {
      tenantId: isNotEmpty("Debe seleccionar un consultorio"),
      email: isNotEmpty("Debe ingresar un usuario"),
      password: isNotEmpty("Debe ingresar una contraseña"),
    },
  });

  const navigate = useNavigate({ from: "/login" });

  const onSubmitForm = () => {
    const request: AuthLoginRequest = form.getValues();
    authLoginMutation.mutate(request, {
      onSuccess: (response) => {
        userStore.setCredentials({
          tenantId: response.tenantId,
          userId: response.userId,
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
        });

        void navigate({ to: "/dashboard" });
      },
    });
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
              data={authTenantsQuery.data?.tenants ?? []}
              withAsterisk
              key={form.key("tenantId")}
              {...form.getInputProps("tenantId")}
            />
            <TextInput
              label="Usuario"
              withAsterisk
              key={form.key("email")}
              {...form.getInputProps("email")}
            />
            <PasswordInput
              label="Contraseña"
              withAsterisk
              key={form.key("password")}
              {...form.getInputProps("password")}
            />
            {(authTenantsQuery.isError || authLoginMutation.isError) && (
              <Alert variant="light" color="red" title="Error">
                {authTenantsQuery.error &&
                  formatApiError(authTenantsQuery.error).map(
                    (message, index) => <Text key={index}>{message}</Text>,
                  )}
                {authLoginMutation.error &&
                  formatApiError(authLoginMutation.error).map(
                    (message, index) => <Text key={index}>{message}</Text>,
                  )}
              </Alert>
            )}
            <Center>
              <Button
                variant="filled"
                type="submit"
                disabled={
                  authTenantsQuery.isPending ||
                  authTenantsQuery.isError ||
                  authLoginMutation.isSuccess
                }
              >
                Ingresar
              </Button>
            </Center>
          </Stack>
        </Card>
      </form>
    </Container>
  );
}
