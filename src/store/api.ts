import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  FleetPartner,
  KpiSnapshot,
  Station,
  StationSummary,
  SwapTransaction,
  WalletTransaction,
} from "@/types";

export const zenoApi = createApi({
  reducerPath: "zenoApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Stations", "Station", "Swaps", "Kpis", "Fleet", "Wallet"],
  endpoints: (builder) => ({
    getStations: builder.query<StationSummary[], void>({
      query: () => "/stations",
      transformResponse: (res: { stations: StationSummary[] }) => res.stations,
      providesTags: ["Stations"],
    }),
    getStation: builder.query<Station, string>({
      query: (id) => `/stations/${id}`,
      transformResponse: (res: { station: Station }) => res.station,
      providesTags: ["Station"],
    }),
    getKpis: builder.query<KpiSnapshot, void>({
      query: () => "/kpis",
      providesTags: ["Kpis"],
    }),
    getSwaps: builder.query<SwapTransaction[], number | void>({
      query: (limit) => `/swaps?limit=${limit ?? 25}`,
      transformResponse: (res: { swaps: SwapTransaction[] }) => res.swaps,
      providesTags: ["Swaps"],
    }),
    getFleet: builder.query<FleetPartner[], void>({
      query: () => "/fleet",
      transformResponse: (res: { fleet: FleetPartner[] }) => res.fleet,
      providesTags: ["Fleet"],
    }),
    getWallet: builder.query<WalletTransaction[], void>({
      query: () => "/wallet",
      transformResponse: (res: { transactions: WalletTransaction[] }) => res.transactions,
      providesTags: ["Wallet"],
    }),
    simulateSwap: builder.mutation<SwapTransaction, string | void>({
      query: (stationId) => ({
        url: "/swaps/simulate",
        method: "POST",
        body: { stationId },
      }),
      transformResponse: (res: { swap: SwapTransaction }) => res.swap,
      invalidatesTags: ["Swaps", "Kpis", "Stations", "Station"],
    }),
  }),
});

export const {
  useGetStationsQuery,
  useGetStationQuery,
  useGetKpisQuery,
  useGetSwapsQuery,
  useGetFleetQuery,
  useGetWalletQuery,
  useSimulateSwapMutation,
} = zenoApi;
