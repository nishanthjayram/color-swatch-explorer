/* Type guards for error handling */

export const isAbortError = (error: unknown): error is DOMException => {
  return error instanceof DOMException && error.name === "AbortError";
};

export const isFetchError = (error: unknown): error is Error => {
  return (
    error instanceof Error &&
    (error.message.includes("fetch") ||
      error.message.includes("Failed to fetch color"))
  );
};
