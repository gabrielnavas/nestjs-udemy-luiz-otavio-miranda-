import { Policy } from "src/auth/enums/route-policies.enum"

export type UserDto = {
  id: string
  email: string
  policies: Policy[]
}