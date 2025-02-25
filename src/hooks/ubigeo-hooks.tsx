import { useQuery } from "@tanstack/react-query";
import { axiosRequest } from "../utils/axios-helpers";
import { ErrorWithDetails } from "../models/api-error/error-with-details";
import { ValueLabel } from "../models/common/value-label";
import { useMemo } from "react";

interface DepartmentData {
  id: string;
  name: string;
}

interface ProvinceData {
  id: string;
  name: string;
  department_id: string;
}

interface DistrictData {
  id: string;
  name: string;
  province_id: string;
  department_id: string;
}

export const useDepartmentsQuery = () => {
  const queryFn = () =>
    axiosRequest<DepartmentData[]>({
      baseURL: "/",
      url: "/json/ubigeo_peru_2016_departamentos.json",
    }).then((departments) =>
      departments.map((department) => ({
        label: department.name,
        value: department.id,
      })),
    );

  const query = useQuery<ValueLabel[], ErrorWithDetails>({
    queryKey: ["departments", "list"],
    queryFn: queryFn,
    staleTime: Infinity,
  });

  return query;
};

export const useProvincesQuery = (department_id: string | null) => {
  const queryFn = () =>
    axiosRequest<ProvinceData[]>({
      baseURL: "/",
      url: "/json/ubigeo_peru_2016_provincias.json",
    });

  const query = useQuery<ProvinceData[], ErrorWithDetails>({
    queryKey: ["provinces", "list"],
    queryFn: queryFn,
    enabled: department_id !== null,
    staleTime: Infinity,
  });

  return {
    ...query,
    data: useMemo(
      () =>
        query.data
          ?.filter((province) => province.department_id === department_id)
          .map((province) => ({ label: province.name, value: province.id })),
      [query.data, department_id],
    ),
  };
};

export const useDistrictsQuery = (
  department_id: string | null,
  province_id: string | null,
) => {
  const queryFn = () =>
    axiosRequest<DistrictData[]>({
      baseURL: "/",
      url: "/json/ubigeo_peru_2016_distritos.json",
    });

  const query = useQuery<DistrictData[], ErrorWithDetails>({
    queryKey: ["districts", "list"],
    queryFn: queryFn,
    enabled: department_id !== null && province_id !== null,
    staleTime: Infinity,
  });

  return {
    ...query,
    data: useMemo(
      () =>
        query.data
          ?.filter(
            (district) =>
              district.department_id === department_id &&
              district.province_id === province_id,
          )
          .map((district) => ({ label: district.name, value: district.id })),
      [query.data, department_id, province_id],
    ),
  };
};

export const useDepartmentsLookup = () => {
  const queryFn = () =>
    axiosRequest<DepartmentData[]>({
      baseURL: "/",
      url: "/json/ubigeo_peru_2016_departamentos.json",
    }).then((departments) =>
      departments.map((department) => ({
        label: department.name,
        value: department.id,
      })),
    );

  const query = useQuery<ValueLabel[], ErrorWithDetails>({
    queryKey: ["departments", "lookup"],
    queryFn: queryFn,
    staleTime: Infinity,
  });

  return query.data;
};

export const useProvincesLookup = () => {
  const queryFn = () =>
    axiosRequest<ProvinceData[]>({
      baseURL: "/",
      url: "/json/ubigeo_peru_2016_provincias.json",
    }).then((provinces) =>
      provinces.map((province) => ({
        label: province.name,
        value: province.id,
      })),
    );

  const query = useQuery<ValueLabel[], ErrorWithDetails>({
    queryKey: ["provinces", "lookup"],
    queryFn: queryFn,
    staleTime: Infinity,
  });

  return query.data;
};

export const useDistrictsLookup = () => {
  const queryFn = () =>
    axiosRequest<DistrictData[]>({
      baseURL: "/",
      url: "/json/ubigeo_peru_2016_distritos.json",
    }).then((districts) =>
      districts.map((district) => ({
        label: district.name,
        value: district.id,
      })),
    );

  const query = useQuery<ValueLabel[], ErrorWithDetails>({
    queryKey: ["districts", "lookup"],
    queryFn: queryFn,
    staleTime: Infinity,
  });

  return query.data;
};
