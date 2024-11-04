import { auth } from './auth.actions'
import { cell } from './cell'

export const server = {
  signup: auth.signup,
  login: auth.login,
  logout: auth.logout,
  createCell: cell.create
}
