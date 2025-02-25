import { Navigate, useNavigate } from "@tanstack/react-router";
import {
  Alert,
  Button,
  LoadingOverlay,
  Paper,
  PasswordInput,
  Select,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { AuthLoginRequest } from "../../../models/auth/auth-login-request";
import { useApiMutation } from "../../../hooks/api-mutation.hook";
import { API_ROUTES } from "../../../constants/api-routes";
import { AuthLoginResponse } from "../../../models/auth/auth-login-response";
import { useApiQuery } from "../../../hooks/api-query.hook";
import { AuthTenantsResponse } from "../../../models/auth/auth-tenants-response";
import { formatApiError } from "../../../utils/api-helpers";
import { useCredentialsStore } from "../../../stores/credentials-store";
import classes from "./Login.module.css";

export function Login() {
  const credentialsStore = useCredentialsStore();

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
        credentialsStore.setCredentials({
          tenantId: response.tenantId,
          userId: response.userId,
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
        });

        void navigate({ to: "/dashboard" });
      },
    });
  };

  if (credentialsStore.credentials !== null) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className={classes.wrapper}>
      <form onSubmit={form.onSubmit(onSubmitForm)}>
        <Paper className={classes.form} radius={0} p={30} pos="relative">
          <LoadingOverlay
            visible={authLoginMutation.isPending}
            zIndex={1000}
            overlayProps={{ radius: "sm", blur: 2 }}
          />

          <Title
            order={2}
            className={classes.title}
            ta="center"
            mt="md"
            mb={50}
          >
            Bienvenido de vuelta!
          </Title>

          <Select
            label="Consultorio"
            placeholder="Seleccione su consultorio"
            withAsterisk
            size="md"
            data={authTenantsQuery.data?.tenants ?? []}
            key={form.key("tenantId")}
            {...form.getInputProps("tenantId")}
          />

          <TextInput
            label="Usuario"
            withAsterisk
            mt="md"
            size="md"
            key={form.key("email")}
            {...form.getInputProps("email")}
          />

          <PasswordInput
            label="Contraseña"
            withAsterisk
            mt="md"
            size="md"
            key={form.key("password")}
            {...form.getInputProps("password")}
          />

          {(authTenantsQuery.isError || authLoginMutation.isError) && (
            <Alert variant="light" color="red" title="Error" mt="xl">
              {authTenantsQuery.error &&
                formatApiError(authTenantsQuery.error).map((message, index) => (
                  <Text key={message + index.toString()}>{message}</Text>
                ))}
              {authLoginMutation.error &&
                formatApiError(authLoginMutation.error).map(
                  (message, index) => (
                    <Text key={message + index.toString()}>{message}</Text>
                  ),
                )}
            </Alert>
          )}

          <Button
            fullWidth
            mt="xl"
            size="md"
            type="submit"
            disabled={
              authTenantsQuery.isPending ||
              authTenantsQuery.isError ||
              authLoginMutation.isSuccess
            }
          >
            Ingresar
          </Button>
        </Paper>
      </form>
    </div>
  );
}
