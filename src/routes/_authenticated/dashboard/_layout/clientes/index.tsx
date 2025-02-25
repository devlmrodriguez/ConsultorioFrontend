import { createFileRoute, Link } from "@tanstack/react-router";
import { ClientsTable } from "../../../../../components/client/ClientsTable";
import {
  Box,
  Button,
  CloseButton,
  Collapse,
  Grid,
  Group,
  Loader,
  MultiSelect,
  NumberInput,
  Pagination,
  Select,
  Space,
  Stack,
  TextInput,
  Title,
} from "@mantine/core";
import {
  pagedListReadClientSchema,
  readClientDataSchema,
} from "../../../../../models/client/client-data";
import {
  useClientDeleteMutation,
  useClientsQuery,
} from "../../../../../hooks/client-hooks";
import {
  IconArrowDown,
  IconArrowUp,
  IconFileTypeXls,
  IconPlus,
  IconSearch,
} from "@tabler/icons-react";
import { useDebouncedState, useDisclosure, useToggle } from "@mantine/hooks";
import { useRef, useState } from "react";
import { DatePickerInput } from "@mantine/dates";
import dayjs from "dayjs";
import { warningTypeValues } from "../../../../../models/common/warning-type";
import { idDocumentTypeValues } from "../../../../../models/common/id-document-type";
import { sexValues } from "../../../../../models/common/sex";
import { mkConfig, generateCsv, download } from "export-to-csv";
import {
  computeAge,
  joinValuesOrPlaceholder,
} from "../../../../../utils/utils";
import {
  useDepartmentsLookup,
  useDepartmentsQuery,
  useDistrictsLookup,
  useDistrictsQuery,
  useProvincesLookup,
  useProvincesQuery,
} from "../../../../../hooks/ubigeo-hooks";
import { useForm } from "@mantine/form";
import { locationTypeValues } from "../../../../../models/common/location-type";

export const Route = createFileRoute(
  "/_authenticated/dashboard/_layout/clientes/",
)({
  component: RouteComponent,
});

function RouteComponent() {
  const [search, setSearch] = useDebouncedState<string | undefined>(
    undefined,
    200,
  );

  const searchRef = useRef<HTMLInputElement>(null);

  const [page, setPage] = useState(1);
  const [showAll, toggleShowAll] = useToggle();

  const [generalFiltersOpened, { toggle: toggleGeneralFilters }] =
    useDisclosure(false);

  const [ubigeoFiltersOpened, { toggle: toggleUbigeoFilters }] =
    useDisclosure(false);

  const [filters, setFilters] = useState<string | undefined>(undefined);
  const [department, setDepartment] = useState<string | null>(null);
  const [province, setProvince] = useState<string | null>(null);

  const filtersForm = useForm({
    mode: "uncontrolled",
    initialValues: {
      warningsFilter: undefined as string[] | undefined,
      minAgeFilter: undefined as string | number | undefined,
      maxAgeFilter: undefined as string | number | undefined,
      idDocumentTypesFilter: undefined as string[] | undefined,
      sexsFilter: undefined as string[] | undefined,
      locationsFilter: undefined as string[] | undefined,
      representativeFilter: undefined as string[] | undefined,
      datesFilter: [null, null] as [Date | null, Date | null],
      departmentFilter: null as string | null,
      provinceFilter: null as string | null,
      districtFilter: null as string | null,
    },
    onValuesChange: (values, previous) => {
      // On filters change, reset pagination to 1
      setPage(1);

      const departmentFilterChanged =
        values.departmentFilter !== previous.departmentFilter;
      const provinceFilterChanged =
        values.provinceFilter !== previous.provinceFilter;

      if (values.departmentFilter !== previous.departmentFilter) {
        setDepartment(values.departmentFilter);
        setProvince(null);

        filtersForm.setFieldValue("provinceFilter", null);
        filtersForm.setFieldValue("districtFilter", null);
      }

      if (
        !departmentFilterChanged &&
        values.provinceFilter !== previous.provinceFilter
      ) {
        console.log("!departmentFilterChanged");
        setProvince(values.provinceFilter);
        filtersForm.setFieldValue("districtFilter", null);
      }

      const updatedFilters = [];

      // Warnings
      if (
        values.warningsFilter !== undefined &&
        values.warningsFilter.length > 0
      ) {
        updatedFilters.push("Warning_" + values.warningsFilter.join("_"));
      }

      // MinAge
      if (values.minAgeFilter !== undefined) {
        updatedFilters.push("MinAge_" + values.minAgeFilter.toString());
      }

      // MaxAge
      if (values.maxAgeFilter !== undefined) {
        updatedFilters.push("MaxAge_" + values.maxAgeFilter.toString());
      }

      // IdDocumentType
      if (
        values.idDocumentTypesFilter !== undefined &&
        values.idDocumentTypesFilter.length > 0
      ) {
        updatedFilters.push(
          "IdDocumentType_" + values.idDocumentTypesFilter.join("_"),
        );
      }

      // Sexs
      if (values.sexsFilter !== undefined && values.sexsFilter.length > 0) {
        updatedFilters.push("Sex_" + values.sexsFilter.join("_"));
      }

      // Locations
      if (
        values.locationsFilter !== undefined &&
        values.locationsFilter.length > 0
      ) {
        updatedFilters.push("Location_" + values.locationsFilter.join("_"));
      }

      // Representative
      if (
        values.representativeFilter !== undefined &&
        values.representativeFilter.length > 0
      ) {
        updatedFilters.push(
          "Representative_" + values.representativeFilter.join("_"),
        );
      }

      // Dates
      if (values.datesFilter[0] !== null) {
        let filter = "Dates_" + dayjs(values.datesFilter[0]).toISOString();
        if (values.datesFilter[1] !== null) {
          filter += "_" + dayjs(values.datesFilter[1]).toISOString();
        }
        updatedFilters.push(filter);
      }

      // Department
      if (values.departmentFilter !== null && values.departmentFilter !== "") {
        updatedFilters.push("Department_" + values.departmentFilter);
      }

      // Province
      if (
        !departmentFilterChanged &&
        values.provinceFilter !== null &&
        values.provinceFilter !== ""
      ) {
        updatedFilters.push("Province_" + values.provinceFilter);
      }

      // District
      if (
        !departmentFilterChanged &&
        !provinceFilterChanged &&
        values.districtFilter !== null &&
        values.districtFilter !== ""
      ) {
        updatedFilters.push("District_" + values.districtFilter);
      }

      if (updatedFilters.length === 0) {
        setFilters(undefined);
      } else {
        setFilters(updatedFilters.join(","));
      }
    },
  });

  const departmentsQuery = useDepartmentsQuery();
  const provincesQuery = useProvincesQuery(department);
  const districtsQuery = useDistrictsQuery(department, province);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue =
      event.currentTarget.value === "" ? undefined : event.currentTarget.value;

    setSearch(newValue);
    setPage(1);
  };

  const query = useClientsQuery(
    search,
    filters,
    page,
    showAll ? 999999 : undefined,
  );
  const deleteMutation = useClientDeleteMutation();

  const onDeleteClientClick = (clientId: string) => {
    void deleteMutation.mutateAsync(clientId);
  };

  const departments = useDepartmentsLookup();
  const getDepartmentLabelById = (id: string | null | undefined) => {
    if (id === null || id === undefined) {
      return "-";
    }
    const department = departments?.find((d) => d.value === id);
    return department?.label ?? "-";
  };

  const provinces = useProvincesLookup();
  const getProvinceLabelById = (id: string | null | undefined) => {
    if (id === null || id === undefined) {
      return "-";
    }
    const province = provinces?.find((p) => p.value === id);
    return province?.label ?? "-";
  };

  const districts = useDistrictsLookup();
  const getDistrictLabelById = (id: string | null | undefined) => {
    if (id === null || id === undefined) {
      return "-";
    }
    const district = districts?.find((d) => d.value === id);
    return district?.label ?? "-";
  };

  if (query.isPending) {
    return <Loader />;
  }

  if (query.error) {
    return <Group>{query.error.details.title}</Group>;
  }

  const parsedData = pagedListReadClientSchema.parse(query.data);

  const parsedDataItems = parsedData.items.map((readClientData) =>
    readClientDataSchema.parse(readClientData),
  );

  const exportExcel = () => {
    const mappedData = parsedDataItems.map((item) => ({
      Código: joinValuesOrPlaceholder([item.legacyCode?.toString()]),
      Cliente: item.firstName + " " + item.lastName,
      Edad: computeAge(item.dateOfBirth),
      Teléfono: joinValuesOrPlaceholder([item.phoneNumber]),
      Email: joinValuesOrPlaceholder([item.email]),
      TipoDocumento: joinValuesOrPlaceholder([item.idDocumentType]),
      Documento: joinValuesOrPlaceholder([item.idDocument]),
      Sexo: item.sex,
      Departamento: joinValuesOrPlaceholder([
        getDepartmentLabelById(item.department),
      ]),
      Provincia: joinValuesOrPlaceholder([getProvinceLabelById(item.province)]),
      Distrito: joinValuesOrPlaceholder([getDistrictLabelById(item.district)]),
      Lugar: joinValuesOrPlaceholder([item.location]),
      Apoderado: item.representative ? "Si" : "No",
      Paciente: item.isPatient ? "Si" : "No",
      Fecha: dayjs(item.dateOfCreation).format("DD/MM/YYYY"),
    }));

    const csvConfig = mkConfig({
      useKeysAsHeaders: true,
      filename: "Clientes " + dayjs().format("DD/MM/YYYY"),
      useBom: true,
    });
    const csv = generateCsv(csvConfig)(mappedData);
    download(csvConfig)(csv);
  };

  return (
    <Stack>
      <Space />

      <Group justify="space-between">
        <Title order={2}>Lista de clientes</Title>

        <Link to="/dashboard/clientes/nuevo">
          <Button rightSection={<IconPlus size={16} />} variant="default">
            Nuevo
          </Button>
        </Link>
      </Group>

      <Grid>
        <Grid.Col span={12}>
          <TextInput
            label="Buscar cliente"
            placeholder="Introduzca un término a buscar"
            leftSection={<IconSearch size={16} stroke={1.5} />}
            onChange={handleSearchChange}
            rightSection={
              <CloseButton
                onClick={() => {
                  setSearch(undefined);
                  if (searchRef.current !== null) {
                    searchRef.current.value = "";
                  }
                }}
                style={{ display: search ? undefined : "none" }}
              />
            }
            ref={searchRef}
          />
        </Grid.Col>
      </Grid>

      <Box>
        <Box>
          <Group mb={5}>
            <Button
              size="compact-sm"
              onClick={toggleGeneralFilters}
              rightSection={
                generalFiltersOpened ? (
                  <IconArrowUp size={14} />
                ) : (
                  <IconArrowDown size={14} />
                )
              }
            >
              Filtros generales
            </Button>
          </Group>
          <Collapse in={generalFiltersOpened} mb={"md"}>
            <Grid>
              <Grid.Col span={1.5}>
                <MultiSelect
                  label="Tipo advertencia"
                  data={["Ninguna", ...warningTypeValues]}
                  key={filtersForm.key("warningsFilter")}
                  {...filtersForm.getInputProps("warningsFilter")}
                  clearable
                />
              </Grid.Col>

              <Grid.Col span={1}>
                <NumberInput
                  label="Min. edad"
                  key={filtersForm.key("minAgeFilter")}
                  {...filtersForm.getInputProps("minAgeFilter")}
                  min={0}
                  max={199}
                />
              </Grid.Col>

              <Grid.Col span={1}>
                <NumberInput
                  label="Max. edad"
                  key={filtersForm.key("maxAgeFilter")}
                  {...filtersForm.getInputProps("maxAgeFilter")}
                  min={0}
                  max={199}
                />
              </Grid.Col>

              <Grid.Col span={1.5}>
                <MultiSelect
                  label="Tipo documento"
                  data={["Ninguno", ...idDocumentTypeValues]}
                  key={filtersForm.key("idDocumentTypesFilter")}
                  {...filtersForm.getInputProps("idDocumentTypesFilter")}
                  clearable
                />
              </Grid.Col>

              <Grid.Col span={1}>
                <MultiSelect
                  label="Sexo"
                  data={sexValues}
                  key={filtersForm.key("sexsFilter")}
                  {...filtersForm.getInputProps("sexsFilter")}
                  clearable
                />
              </Grid.Col>

              <Grid.Col span={1.5}>
                <MultiSelect
                  label="Filtrar por lugar"
                  data={["Ninguno", ...locationTypeValues]}
                  key={filtersForm.key("locationsFilter")}
                  {...filtersForm.getInputProps("locationsFilter")}
                  clearable
                />
              </Grid.Col>

              <Grid.Col span={1}>
                <MultiSelect
                  label="¿Apoderado?"
                  data={["Si", "No"]}
                  key={filtersForm.key("representativeFilter")}
                  {...filtersForm.getInputProps("representativeFilter")}
                  clearable
                />
              </Grid.Col>

              <Grid.Col span={3.5}>
                <DatePickerInput
                  type="range"
                  label="Rango de fechas de creación"
                  key={filtersForm.key("datesFilter")}
                  {...filtersForm.getInputProps("datesFilter")}
                  allowSingleDateInRange
                  clearable
                />
              </Grid.Col>
            </Grid>
          </Collapse>
        </Box>

        <Box>
          <Group mb={5}>
            <Button
              size="compact-sm"
              onClick={toggleUbigeoFilters}
              rightSection={
                ubigeoFiltersOpened ? (
                  <IconArrowUp size={14} />
                ) : (
                  <IconArrowDown size={14} />
                )
              }
            >
              Filtros de ubicación
            </Button>
          </Group>
          <Collapse in={ubigeoFiltersOpened} mb={"md"}>
            <Grid>
              <Grid.Col span={2}>
                <Select
                  label="Departamento"
                  placeholder={
                    departmentsQuery.isFetching
                      ? "Cargando ..."
                      : "Seleccione ..."
                  }
                  data={departmentsQuery.data ?? []}
                  rightSection={
                    departmentsQuery.isFetching ? (
                      <Loader size={"xs"} />
                    ) : undefined
                  }
                  key={filtersForm.key("departmentFilter")}
                  {...filtersForm.getInputProps("departmentFilter")}
                  clearable
                />
              </Grid.Col>
              <Grid.Col span={2}>
                <Select
                  label="Provincia"
                  placeholder={
                    !filtersForm.getValues().departmentFilter
                      ? "Seleccione departamento ..."
                      : provincesQuery.isFetching
                        ? "Cargando ..."
                        : "Seleccione ..."
                  }
                  data={provincesQuery.data ?? []}
                  rightSection={
                    provincesQuery.isFetching ? (
                      <Loader size={"xs"} />
                    ) : undefined
                  }
                  key={filtersForm.key("provinceFilter")}
                  {...filtersForm.getInputProps("provinceFilter")}
                  disabled={!filtersForm.getValues().departmentFilter}
                  clearable
                />
              </Grid.Col>
              <Grid.Col span={2}>
                <Select
                  label="Distrito"
                  placeholder={
                    !filtersForm.getValues().provinceFilter
                      ? "Seleccione provincia ..."
                      : districtsQuery.isFetching
                        ? "Cargando ..."
                        : "Seleccione ..."
                  }
                  data={districtsQuery.data ?? []}
                  rightSection={
                    districtsQuery.isFetching ? (
                      <Loader size={"xs"} />
                    ) : undefined
                  }
                  key={filtersForm.key("districtFilter")}
                  {...filtersForm.getInputProps("districtFilter")}
                  disabled={!filtersForm.getValues().provinceFilter}
                  clearable
                />
              </Grid.Col>
            </Grid>
          </Collapse>
        </Box>
      </Box>

      <Group justify="space-between">
        <Pagination
          total={parsedData.totalPages}
          value={page}
          onChange={setPage}
        />
        <Group ml="auto">
          <Button
            variant="outline"
            onClick={() => {
              exportExcel();
            }}
            rightSection={<IconFileTypeXls size={16} />}
            disabled={query.isPending}
          >
            Exportar
          </Button>
          <Button
            ml="auto"
            variant="outline"
            onClick={() => {
              setPage(1);
              toggleShowAll();
            }}
            rightSection={
              !showAll ? <IconArrowDown size={16} /> : <IconArrowUp size={16} />
            }
          >
            {!showAll ? "Mostrar todos" : "Mostrar pocos"}
          </Button>
        </Group>
      </Group>

      <ClientsTable
        data={parsedDataItems}
        onDeleteClientClick={onDeleteClientClick}
      />

      <Space />
    </Stack>
  );
}
