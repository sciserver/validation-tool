<template>
  <v-container fluid>
    Total to be reviewed: {{ totalPending }}
    <br> 
    Total reviewed: {{ totalReviewed }}
    <br>
    <br>
    {{ pendingReviews }}
  </v-container>
</template>

<script>
import { reviewService } from '@/services'
import Review from '@/models/Review'

export default {
  name: 'Review',
  data: () => ({
    pendingReviews: [],
    reviewed: [],
    totalPending: 0,
    totalReviewed: 0,
  }),
  created() {
    // nothing
  },
  mounted() {
    this.fetchReviewsCount();
    this.fetchReviews();
  },
  methods: {
    fetchReviewsCount() {
      reviewService.getPendingReviewsCount()
        .then((data) => {
          this.totalPending = data.count
        })
    },
    fetchReviews() {
      reviewService.getPendingReviews()
        .then((data) => {
          this.pendingReviews = data.map(r => Review.fromData(r))
        })
    }
  },
}
</script>
