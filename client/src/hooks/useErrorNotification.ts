import { useCallback } from "react";

export function useErrorNotification() {
  const notifyError = useCallback((message: string) => {
    alert(`오류가 발생했습니다: ${message}`);
  }, []);

  return { notifyError };
}
