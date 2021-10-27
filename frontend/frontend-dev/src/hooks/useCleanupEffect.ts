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
    if (cleanupFunction !== undefined && cleanupFunction !== null) {
      state.isMounted = false;
      return cleanupFunction();
    }
  }, dependencies);
}
