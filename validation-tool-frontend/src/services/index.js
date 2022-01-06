import AuthService from './AuthService'
import ReviewService from './ReviewService'

const authService = new AuthService()
const reviewService = new ReviewService()

export {
  authService,
  reviewService
}