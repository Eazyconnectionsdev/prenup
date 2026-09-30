/**
 * Duck-types an Axios-style error without importing axios's runtime code,
 * so this file has zero dependencies beyond the shape it checks for.
 */
interface AxiosErrorLike {
  isAxiosError: true;
  code?: string;
  response?: {
    status?: number;
    data?: {
      message?: string | string[];
    };
  };
}

function isAxiosErrorLike(error: unknown): error is AxiosErrorLike {
  return (
    typeof error === "object" &&
    error !== null &&
    (error as Record<string, unknown>).isAxiosError === true
  );
}

/**
 * Converts any thrown value into a short, displayable message.
 * Every API function below calls this inside its catch block, so
 * callers always get a clean string — never a raw error object.
 */
export function getErrorMessage(error: unknown, fallback: string): string {
  if (isAxiosErrorLike(error)) {
    const serverMessage = error.response?.data?.message;
    if (typeof serverMessage === "string" && serverMessage.trim()) {
      return serverMessage;
    }
    if (Array.isArray(serverMessage) && serverMessage.length > 0) {
      return String(serverMessage[0]);
    }

    switch (error.response?.status) {
      case 401:
        return "You're not signed in, or your session expired.";
      case 403:
        return "You don't have permission to do this.";
      case 404:
        return "That resource couldn't be found.";
      case 409:
        return "This conflicts with the current state — please refresh and try again.";
      case 413:
        return "The file is too large to upload.";
      case 422:
        return "Some of the submitted data was invalid.";
      case 500:
      case 502:
      case 503:
        return "The server ran into a problem. Please try again shortly.";
    }

    if (error.code === "ECONNABORTED") {
      return "The request timed out. Please try again.";
    }
    if (!error.response) {
      return "Network error — please check your connection.";
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}