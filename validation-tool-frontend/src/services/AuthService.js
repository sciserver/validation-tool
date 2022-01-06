import api from '@/api'

class AuthService {
  constructor() {
      // nothing to do
  }

  authenticate(username, password) {
    return api
      .post('/auth/login', { 'username': username, 'password': password })
      .then(response => {
        return response.data
      })
      .catch(err => {
        throw err.response
      })
  }
}

export default AuthService
