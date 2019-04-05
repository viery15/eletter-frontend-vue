
import JwtDecode from 'jwt-decode'

export default class User {
  static from (token) {
  try {
    let obj = JwtDecode(token)
    return new User(obj)
  } catch (_) {
    return null
  }
  }

  constructor ({ nik, name, admin }) {
    this.nik = nik
    this.name = name
    this.admin = admin
  }

  get isAdmin () {
    return this.admin
  }
}
