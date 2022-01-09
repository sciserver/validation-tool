<template>
  <v-container fluid>
    <v-row no-gutters>
      <v-col cols="12">
        <v-layout justify-center>You have {{ totalReviewed }} of {{ totalPending }} publication-dataset dyads to review</v-layout>
      </v-col>
      <v-col cols="10" offset="1">
        <v-progress-linear 
          background-color="grey lighten-1"
          color="indigo accent-3"
          :value="reviewRatio" 
          height="20">
          <strong>{{ reviewRatio }}%</strong>
        </v-progress-linear>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <!-- start loop -->
        <div class="publication" v-for="review in pendingReviews" :key="review.id">
          <div class="publication-title">{{ review.publication_title }}</div>
          <div class="publication-doi">{{ review.publication_doi }}</div>
          <div class="mentions">
            <v-row no-gutters class="mention-header">
              <v-col cols="6">
                Dataset mention
              </v-col>
              <v-col cols="3">
                Is this a dataset in this context?
              </v-col>
              <v-col cols="3">
                Is this the same dataset?
              </v-col>
            </v-row>
            <v-row no-gutters class="mention">
              <v-col cols="6" class="mention-text">
                {{ review.text }}
              </v-col>
              <v-col cols="3">
                <div class="mention-dataset">{{ review.dataset_alias }}</div>
                <v-btn-toggle 
                  class="mention-actions"
                  dense 
                  v-model="review.dataset_alias_result"
                  v-show="!!review.dataset_alias"
                  @change="validateDatasetAlias(review)">
                  <v-btn color="blue-grey darken-2" dark value="1">Yes</v-btn>
                  <v-btn color="blue-grey darken-2" dark value="-1">No</v-btn>
                  <v-btn color="blue-grey darken-2" dark value="0">Unsure</v-btn>
                </v-btn-toggle>
              </v-col>
              <v-col cols="3">
                <div class="mention-dataset">{{ review.dataset_parent_alias }}</div>
                <v-btn-toggle 
                  class="mention-actions"
                  dense
                  v-model="review.dataset_parent_alias_result"
                  v-show="!!review.dataset_parent_alias"
                  @change="validateDatasetParentAlias(review)">
                  <v-btn color="blue-grey darken-2" dark value="1">Yes</v-btn>
                  <v-btn color="blue-grey darken-2" dark value="-1">No</v-btn>
                  <v-btn color="blue-grey darken-2" dark value="0">Unsure</v-btn>
                </v-btn-toggle>
              </v-col>
            </v-row>
          </div>
        </div>
        <!-- end loop -->
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
    this.fetchReviewsCount()
    this.fetchReviews()
    //setTimeout(() => { this.pendingReviews[0].dataset_alias = null }, 5000)
  },
  computed: {
    reviewRatio() {
      return this.totalPending ? Math.ceil(this.totalReviewed / this.totalPending * 100) : 100
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
    },
    validateDatasetAlias(review) {
      console.log(review)
      // block buttons before request
      let result = parseInt(review.dataset_alias_result)
      reviewService.sendDatasetAliasReview(review.id, result)
        .then(() => {
          review.dataset_alias = null // hide buttons
          this.checkPendingAnswer(review)
        })
    },
    validateDatasetParentAlias(review) {
      console.log(review)
      // block buttons before request
      let result = parseInt(review.dataset_parent_alias_result)
      reviewService.sendDatasetParentAliasReview(review.publication_dataset_alias_id, result)
        .then(() => {
          review.dataset_parent_alias = null // hide buttons
          this.checkPendingAnswer(review)
        })
    },
    checkPendingAnswer(review) {
      // if everything is answered, row must be hidden/removed
      if (!review.hasPendingAnswer()) {
        console.log(`Review ${review.id} is completed!`)
      }
    }
  },
}
</script>

<style scoped>
.publication {
  border: 1px solid black;
  margin-bottom: 10px;
  padding: 5px 10px;
}
.publication-title {
  font-weight: bold;
}
.publication-doi {
  font-size: 14px;
}
.mentions {
  margin-top: 3px;
}
.mention-header {
  border: 1px solid black;
  font-weight: bold;
  padding: 0 5px;
}
.mention {
  border: 1px solid black;
  border-top-width: 0;
  padding: 0 5px;
}
.mention-text {

}
.mention-dataset {

}
.mention-actions {

}
</style>