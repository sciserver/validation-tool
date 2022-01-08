<template>
  <v-container fluid>
    <v-row no-gutters>
      <v-col cols="12">
        <v-layout justify-center>You have {{ totalReviewed }} of {{ totalPending }} publication-dataset dyads to review</v-layout>
      </v-col>
      <v-col cols="12">
        <v-progress-linear v-model="reviewRatio" height="20">
          <strong>{{ reviewRatio }}%</strong>
        </v-progress-linear>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        {{ pendingReviews }}
      </v-col>  
    </v-row>
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
    totalReviewed: 4,
  }),
  created() {
    // nothing
  },
  mounted() {
    this.fetchReviewsCount();
    this.fetchReviews();
  },
  computed: {
    reviewRatio() {
      return this.totalPending ? Math.ceil(this.totalReviewed / this.totalPending * 100) : 100;
    }
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
