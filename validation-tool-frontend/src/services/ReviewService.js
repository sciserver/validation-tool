import api from '@/api'
import authHeader from '@/helpers/auth-header'

class ReviewService {
  constructor() {
      // nothing to do
  }

  getPendingReviews() {
    let config = {
      params: { 'amount': 50 },
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

  sendDatasetAliasReview(mentionId, value) {
    let payload = {
      'dataset_mention_generic_metadata_id': mentionId, 
      'value': value
    }
    return api
      .post('/review/dataset_mention_alias', payload, { headers: authHeader() })
      .then(response => {
        return response.data
      })
      .catch(err => {
        throw err.response
      })
  }

  sendDatasetParentAliasReview(mentionId, value) {
    let payload = {
      'dataset_mention_generic_metadata_id': mentionId, 
      'value': value
    }
    return api
      .post('/review/dataset_mention_parent_alias', payload, { headers: authHeader() })
      .then(response => {
        return response.data
      })
      .catch(err => {
        throw err.response
      })
  }
}

export default ReviewService
