import api from '@/api'

class ReviewService {
  constructor() {
      // nothing to do
  }

  getMentions() {
    return api
      .get('/mentions/pending', { 'amount': 10 })
      .then(response => {
        return response.data;
      })
      .catch(err => {
        throw err.response;
      });
  }

  sendValidation(mentionId, value) {
    return api
      .post(`/mentions/${mentionId}`, { 'option': value })
      .then(response => {
        return response.data
      })
      .catch(err => {
        throw err.response
      })
  }
}

export default ReviewService
