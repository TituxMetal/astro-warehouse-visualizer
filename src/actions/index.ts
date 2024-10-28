import { auth } from './auth.actions'

export const server = {
  signup: auth.signup,
  login: auth.login,
  logout: auth.logout
}
