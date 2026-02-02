"use client";

import { superbaseBrowserClient } from "../superbase/client";
import type { ZodType } from "zod";

type ApiFetchOptions<T> = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  schema?: ZodType<T>;
};

export type ApiErrorBody = {
  code?: string;
  message?: string;
  error?: string;
  statusCode?: number;
  issues?: unknown;
};

export class ApiError extends Error {
  status: number;
  body: ApiErrorBody;
  url: string;

  constructor(status: number, body: ApiErrorBody, url: string) {
    super(`API Error ${status}`);
    this.status = status;
    this.body = body;
    this.url = url;

    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

export const apiFetch = async <T>(
  path: string,
  options: ApiFetchOptions<T> = {}
): Promise<T> => {
  const { method = "GET", body, schema } = options;

  const supabase = superbaseBrowserClient();
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;

  const base = process.env.NEXT_PUBLIC_API_URL;
  if (!base) throw new Error("NEXT_PUBLIC_API_URL is not defined");

  const url = new URL(path, base).toString();

  let res: Response;

  try {
    res = await fetch(url, {
      method,
      headers: {
        ...(body ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(
      0,
      { code: "NETWORK_ERROR", message: "Network error occurred" },
      url
    );
  }

  if (!res.ok) {
    const contentType = res.headers.get("content-type") || "";
    let raw: unknown;

    try {
      raw = contentType.includes("application/json")
        ? await res.json()
        : await res.text();
    } catch {
      raw = undefined;
    }

    const normalized: ApiErrorBody =
      typeof raw === "string"
        ? { message: raw }
        : typeof raw === "object" && raw !== null
          ? (raw as ApiErrorBody)
          : {};

    throw new ApiError(res.status, normalized, url);
  }

  if (res.status === 204) {
    if (schema) {
      throw new ApiError(
        500,
        { code: "INVALID_RESPONSE", message: "No content but schema provided" },
        url
      );
    }
    return undefined as T;
  }

  const contentType = res.headers.get("content-type") || "";

  if (!contentType.includes("application/json")) {
    const text = await res.text();
    if (schema) {
      throw new ApiError(
        500,
        { code: "INVALID_RESPONSE", message: text },
        url
      );
    }
    return text as T;
  }

  let json: unknown;

  try {
    json = await res.json();
  } catch {
    throw new ApiError(
      500,
      { code: "INVALID_RESPONSE", message: "Invalid JSON response" },
      url
    );
  }

  if (schema) {
    const parsed = schema.safeParse(json);
    if (!parsed.success) {
      throw new ApiError(
        500,
        {
          code: "INVALID_RESPONSE",
          message: "Response validation failed",
          issues: parsed.error.issues,
        },
        url
      );
    }
    return parsed.data;
  }

  return json as T;
};
