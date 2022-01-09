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
      .post('/review/generic_metadata', payload, { headers: authHeader() })
      .then(response => {
        return response.data
      })
      .catch(err => {
        throw err.response
      })
  }

  sendDatasetParentAliasReview(publicationDatasetAliasId, value) {
    let payload = {
      'publication_dataset_alias_id': publicationDatasetAliasId, 
      'value': value
    }
    return api
      .post('/review/publication_dataset_alias', payload, { headers: authHeader() })
      .then(response => {
        return response.data
      })
      .catch(err => {
        throw err.response
      })
  }
}

export default ReviewService
