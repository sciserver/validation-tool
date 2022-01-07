import api from '@/api'
import authHeader from '@/helpers/auth-header'

class ReviewService {
  constructor() {
      // nothing to do
  }

  getPendingReviews() {
    let config = {
      params: { 'amount': 10 },
      headers: authHeader(),
    }
    return api
      .get('/review', config)
      .then(response => {
        return response.data
      })
      .catch(err => {
        throw err.response
      })
  }

  getPendingReviewsCount() {
    console.log(authHeader())
    return api
      .get('/review/count', { headers: authHeader() })
      .then(response => {
        return response.data
      })
      .catch(err => {
        throw err.response
      })
  }

  sendValidation(mentionId, value) {
    return api
      .post(`/review/${mentionId}`, { 'option': value }, { headers: authHeader() })
      .then(response => {
        return response.data
      })
      .catch(err => {
        throw err.response
      })
  }
}

export default ReviewService
