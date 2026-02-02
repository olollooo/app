import { ApiError } from "../api/apiClient";

export type ResolvedApiError = {
  message: string;
  action?: "redirectLogin";
};

export const resolveApiError = (e: unknown): ResolvedApiError => {
  if (!(e instanceof ApiError)) {
    console.error("Unknown error", e);
    return { message: "不明なエラーが発生しました" };
  }

  const { code, message } = e.body ?? {};

  switch (code) {
    case "RESOURCE_LIMIT_EXCEEDED":
      return { message: "チャット登録上限に達しています" };

    case "AI_QUOTA_EXCEEDED":
      return { message: "AI利用上限に達しています" };

    case "AUTH_REQUIRED":
      return { 
				message: "ログインしてください",
				action: "redirectLogin"
			}

    case "INVALID_SESSION":
      return {
        message: "セッションが切れました。再ログインしてください",
        action: "redirectLogin"
      };

    default:
      if (message && typeof message === "string") {
        return { message };
      }

      console.error("Unhandled ApiError", {
        status: e.status,
        url: e.url,
        body: e.body,
      });

      return { message: "操作に失敗しました" };
  }
};
