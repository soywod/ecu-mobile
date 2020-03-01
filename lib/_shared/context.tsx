import {useEffect, useState} from "react"
import {Subject, BehaviorSubject} from "rxjs"

type UseSubjectCb<T> = (value: T) => void
type UseSubject<T> = [T | undefined, UseSubjectCb<T>]
export function useSubject<T>(subject: Subject<T>, callback?: UseSubjectCb<T>): UseSubject<T> {
  const [state, setState] = useState<T>()

  function next(val: T) {
    subject.next(val)
  }

  useEffect(() => {
    const subscription = subject.subscribe(val => {
      setState(val)

      if (callback) {
        callback(val)
      }
    })

    return () => subscription.unsubscribe()
  }, [callback, setState, state, subject])

  return [state, next]
}

type UseBehaviorSubject<T> = [T, UseSubjectCb<T>]
export function useBehaviorSubject<T>(
  subject: BehaviorSubject<T>,
  callback?: UseSubjectCb<T>,
): UseBehaviorSubject<T> {
  const [state, setState] = useState<T>(subject.value)

  function next(val: T) {
    subject.next(val)
  }

  useEffect(() => {
    const subscription = subject.subscribe(val => {
      setState(val)

      if (callback) {
        callback(val)
      }
    })
    return () => subscription.unsubscribe()
  }, [callback, setState, state, subject])

  return [state, next]
}

export default {useSubject, useBehaviorSubject}
