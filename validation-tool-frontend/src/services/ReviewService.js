import api from '@/api'
import authHeader from '@/helpers/auth-header'

class ReviewService {
  constructor() {
    // nothing to do
  }

  getPendingReviews(pageSize, nextPage) {
    let config = {
      params: {
        'page_size': pageSize,
        'page_number': nextPage
      },
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

  sendDatasetParentAliasReview(mentionId, value) {
    let payload = {
      'dataset_mention_generic_metadata_id': mentionId,
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
