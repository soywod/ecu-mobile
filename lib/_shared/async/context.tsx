import {BehaviorSubject} from "rxjs"

import {useBehaviorSubject} from "../context"

export const isLoading$ = new BehaviorSubject(true)

export function useAsync(): [boolean, (override?: any) => void] {
  const [isLoading, setLoading] = useBehaviorSubject(isLoading$)

  function toggle(override?: any) {
    setLoading(typeof override === "boolean" ? Boolean(override) : !isLoading)
  }

  return [isLoading, toggle]
}

export default useAsync
