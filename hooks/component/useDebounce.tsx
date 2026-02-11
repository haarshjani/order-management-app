import { useEffect, useMemo, useState } from "react";
import _ from "lodash";

export function useDebounce<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  const debouncedUpdate = useMemo(
    () =>
      _.debounce((val: T) => {
        setDebouncedValue(val);
      }, delay),
    [delay]
  );

  useEffect(() => {
    debouncedUpdate(value);

    return () => {
      debouncedUpdate.cancel();
    };
  }, [value, debouncedUpdate]);

  return debouncedValue;
}
