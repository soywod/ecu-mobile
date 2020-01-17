import {DateTime} from "luxon"

export type AuthCredentials = {
  email: string
  password: string
}

type AuthenticatedUser = {
  id: string
  type: "authenticated"
  email: string
  createdAt: DateTime
}

type AnonymousUser = {
  id: string
  type: "anonymous"
}

export type User = AuthenticatedUser | AnonymousUser

export const emptyCredentials: AuthCredentials = {email: "", password: ""}
export const emptyUser: User = {id: "", type: "anonymous"}
