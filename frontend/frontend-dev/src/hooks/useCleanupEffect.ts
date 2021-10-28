import { useEffect } from "react";

type IComponentState = {
  isMounted: boolean;
};

export function useCleanupEffect(
  action: (state: IComponentState) => (() => any) | void,
  dependencies: any[],
) {
  useEffect(() => {
    const state: IComponentState = { isMounted: true };
    const cleanupFunction = action(state); // by reference
    return () => {
      state.isMounted = false;
      if (typeof cleanupFunction === "function") {
        return cleanupFunction();
      }
    };
  }, dependencies);
}
