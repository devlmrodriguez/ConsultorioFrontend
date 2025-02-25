import { createFileRoute, Link } from "@tanstack/react-router";
import { LeadsTable } from "../../../../../components/lead/LeadsTable";
import {
  Box,
  Button,
  CloseButton,
  Collapse,
  Grid,
  Group,
  Loader,
  MultiSelect,
  Pagination,
  Select,
  Space,
  Stack,
  TextInput,
  Title,
} from "@mantine/core";
import {
  pagedListReadLeadSchema,
  readLeadDataSchema,
} from "../../../../../models/lead/lead-data";
import {
  useLeadDeleteMutation,
  useLeadsQuery,
} from "../../../../../hooks/lead-hooks";
import { useRef, useState } from "react";
import {
  IconArrowDown,
  IconArrowUp,
  IconFileTypeXls,
  IconPlus,
  IconSearch,
} from "@tabler/icons-react";
import { useDebouncedState, useDisclosure, useToggle } from "@mantine/hooks";
import { leadStateValues } from "../../../../../models/common/lead-state";
import { DatePickerInput } from "@mantine/dates";
import dayjs from "dayjs";
import { locationTypeValues } from "../../../../../models/common/location-type";
import { mkConfig, generateCsv, download } from "export-to-csv";
import { joinValuesOrPlaceholder } from "../../../../../utils/utils";
import {
  useDepartmentsLookup,
  useDepartmentsQuery,
  useDistrictsLookup,
  useDistrictsQuery,
  useProvincesLookup,
  useProvincesQuery,
} from "../../../../../hooks/ubigeo-hooks";
import { useForm } from "@mantine/form";

export const Route = createFileRoute(
  "/_authenticated/dashboard/_layout/leads/",
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

  const [ubigeoFiltersOpened, { toggle: toggleUbigeoFilters }] =
    useDisclosure(false);

  const [filters, setFilters] = useState<string | undefined>(undefined);
  const [department, setDepartment] = useState<string | null>(null);
  const [province, setProvince] = useState<string | null>(null);

  const filtersForm = useForm({
    mode: "uncontrolled",
    initialValues: {
      departmentFilter: null as string | null,
      provinceFilter: null as string | null,
      districtFilter: null as string | null,
      locationsFilter: undefined as string[] | undefined,
      statesFilter: undefined as string[] | undefined,
      datesFilter: [null, null] as [Date | null, Date | null],
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

      // Locations
      if (
        values.locationsFilter !== undefined &&
        values.locationsFilter.length > 0
      ) {
        updatedFilters.push("Location_" + values.locationsFilter.join("_"));
      }

      // States
      if (values.statesFilter !== undefined && values.statesFilter.length > 0) {
        updatedFilters.push("State_" + values.statesFilter.join("_"));
      }

      // Dates
      if (values.datesFilter[0] !== null) {
        let filter = "Dates_" + dayjs(values.datesFilter[0]).toISOString();
        if (values.datesFilter[1] !== null) {
          filter += "_" + dayjs(values.datesFilter[1]).toISOString();
        }
        updatedFilters.push(filter);
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

  const query = useLeadsQuery(
    search,
    filters,
    page,
    showAll ? 999999 : undefined,
  );
  const deleteMutation = useLeadDeleteMutation();

  const onDeleteLeadClick = (leadId: string) => {
    void deleteMutation.mutateAsync(leadId);
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

  const parsedData = pagedListReadLeadSchema.parse(query.data);

  const parsedDataItems = parsedData.items.map((readLeadData) =>
    readLeadDataSchema.parse(readLeadData),
  );

  const exportExcel = () => {
    const mappedData = parsedDataItems.map((item) => ({
      Teléfono: item.phoneNumber,
      Nombres: joinValuesOrPlaceholder([item.firstName, item.lastName]),
      Email: joinValuesOrPlaceholder([item.email]),
      Departamento: joinValuesOrPlaceholder([
        getDepartmentLabelById(item.department),
      ]),
      Provincia: joinValuesOrPlaceholder([getProvinceLabelById(item.province)]),
      Distrito: joinValuesOrPlaceholder([getDistrictLabelById(item.district)]),
      Lugar: joinValuesOrPlaceholder([item.location]),
      Estado: item.state,
      Fecha: dayjs(item.dateOfCreation).format("DD/MM/YYYY"),
    }));

    const csvConfig = mkConfig({
      useKeysAsHeaders: true,
      filename: "Leads " + dayjs().format("DD/MM/YYYY"),
      useBom: true,
    });
    const csv = generateCsv(csvConfig)(mappedData);
    download(csvConfig)(csv);
  };

  return (
    <Stack>
      <Space />

      <Group justify="space-between">
        <Title order={2}>Lista de leads</Title>

        <Link to="/dashboard/leads/nuevo">
          <Button rightSection={<IconPlus size={16} />} variant="default">
            Nuevo
          </Button>
        </Link>
      </Group>

      <Grid>
        <Grid.Col span={6}>
          <TextInput
            label="Buscar lead"
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

        <Grid.Col span={2}>
          <MultiSelect
            label="Filtrar por lugar"
            data={["Ninguno", ...locationTypeValues]}
            key={filtersForm.key("locationsFilter")}
            {...filtersForm.getInputProps("locationsFilter")}
            clearable
          />
        </Grid.Col>
        <Grid.Col span={2}>
          <MultiSelect
            label="Filtrar por estado"
            data={leadStateValues}
            key={filtersForm.key("statesFilter")}
            {...filtersForm.getInputProps("statesFilter")}
            clearable
          />
        </Grid.Col>
        <Grid.Col span={2}>
          <DatePickerInput
            type="range"
            label="Filtrar por fechas"
            key={filtersForm.key("datesFilter")}
            {...filtersForm.getInputProps("datesFilter")}
            allowSingleDateInRange
            clearable
          />
        </Grid.Col>
      </Grid>

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
                  provincesQuery.isFetching ? <Loader size={"xs"} /> : undefined
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
                  districtsQuery.isFetching ? <Loader size={"xs"} /> : undefined
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

      <LeadsTable
        data={parsedDataItems}
        onDeleteLeadClick={onDeleteLeadClick}
      />

      <Space />
    </Stack>
  );
}
