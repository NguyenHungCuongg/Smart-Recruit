import axios from "axios";

type ApiErrorBody = {
  error?: string;
  message?: string;
  details?: string[];
};

export const getApiErrorCode = (error: unknown): string | undefined => {
  if (!axios.isAxiosError(error)) {
    return undefined;
  }

  const data = error.response?.data as ApiErrorBody | undefined;
  return data?.error;
};

export const parseApiError = (error: unknown, fallbackMessage = "Something went wrong"): string => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as ApiErrorBody | undefined;

    // Ưu tiên lấy message từ mảng details nếu có, sau đó đến message chung, sau đó đến lỗi mạng, và cuối cùng là message gốc của error
    if (Array.isArray(data?.details) && data.details.length > 0) {
      return data.details[0] ?? fallbackMessage;
    }

    if (typeof data?.message === "string" && data.message.trim().length > 0) {
      return data.message;
    }

    if (error.code === "ERR_NETWORK") {
      return "Cannot connect to server. Please try again.";
    }

    if (typeof error.message === "string" && error.message.trim().length > 0) {
      return error.message;
    }
  }

  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message;
  }

  // Nếu không có thông tin lỗi nào phù hợp, trả về fallback message
  return fallbackMessage;
};
