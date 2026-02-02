import { apiFetch } from "./apiClient";

export const swrFetcher = <T>(url: string) => apiFetch<T>(url);