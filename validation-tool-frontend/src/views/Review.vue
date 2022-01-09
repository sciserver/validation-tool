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
        <transition-group name="list" tag="div">
          <!-- start loop -->
          <div class="publication" v-for="review in topReviews" :key="review.id">
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
                  <span v-html="review.textHtml"> </span>
                </v-col>
                <v-col cols="3">
                  <div class="mention-dataset">{{ review.dataset_alias }}</div>
                  <v-btn-toggle dense
                    class="mention-actions" 
                    v-model="review.dataset_alias_result"
                    v-show="!!review.dataset_alias"
                    @change="validateDatasetAlias(review)">
                    <v-btn color="blue-grey darken-2" dark v-show="review.datasetAliasButtons()" value="1">Yes</v-btn>
                    <v-btn color="blue-grey darken-2" dark v-show="review.datasetAliasButtons()" value="-1">No</v-btn>
                    <v-btn color="blue-grey darken-2" dark v-show="review.datasetAliasButtons()" value="0">Unsure</v-btn>
                  </v-btn-toggle>
                  <v-progress-circular indeterminate
                    v-show="review.dataset_alias_loading"
                    color="primary">
                  </v-progress-circular>
                  <v-icon large 
                    v-show="review.dataset_alias_check"
                    color="green darken-2">
                    mdi-check-bold
                  </v-icon>
                  <v-icon large 
                    class="empty-dataset"
                    title="Nothing to review here"
                    v-show="!review.dataset_alias"
                    color="grey lighten-1">
                    mdi-minus-box
                  </v-icon>
                </v-col>
                <v-col cols="3">
                  <div class="mention-dataset">{{ review.dataset_parent_alias }}</div>
                  <v-btn-toggle dense
                    class="mention-actions"
                    v-model="review.dataset_parent_alias_result"
                    v-show="!!review.dataset_parent_alias"
                    @change="validateDatasetParentAlias(review)">
                    <v-btn color="blue-grey darken-2" dark v-show="review.datasetParentAliasButtons()" value="1">Yes</v-btn>
                    <v-btn color="blue-grey darken-2" dark v-show="review.datasetParentAliasButtons()" value="-1">No</v-btn>
                    <v-btn color="blue-grey darken-2" dark v-show="review.datasetParentAliasButtons()" value="0">Unsure</v-btn>
                  </v-btn-toggle>
                  <v-progress-circular indeterminate
                    v-show="review.dataset_parent_alias_loading"
                    color="primary">
                  </v-progress-circular>
                  <v-icon large 
                    v-show="review.dataset_parent_alias_check"
                    color="green darken-2">
                    mdi-check-bold
                  </v-icon>
                  <v-icon large 
                    class="empty-dataset"
                    title="Nothing to review here"
                    v-show="!review.dataset_parent_alias"
                    color="grey lighten-1">
                    mdi-minus-box
                  </v-icon>
                </v-col>
              </v-row>
            </div>
          </div>
          <!-- end loop -->
        </transition-group>
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
    pendingReviews: [],  // all reviews still pending
    totalTopReviews: 3,  // how many reviews are shown to the user
    totalPending: 0,     // how many reviews are pending
    totalReviewed: 0,    // how many reviews were completed
  }),
  created() {
    // nothing
  },
  mounted() {
    this.fetchReviewsCount()
    this.fetchReviews()
  },
  computed: {
    reviewRatio() {
      return this.totalPending ? Math.ceil(this.totalReviewed / this.totalPending * 100) : 100
    },
    topReviews() {
      return this.pendingReviews.slice(0, this.totalTopReviews)
    },
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
          let newItens = data.map(r => Review.fromData(r))
          for (let element of newItens) {
            let found = this.pendingReviews.find(i => element.id == i.id)
            if (!found) {
              this.pendingReviews.push(element)
            }
          }
        })
    },
    validateDatasetAlias(review) {
      review.dataset_alias_loading = true
      this.moveReviewToBottom(review)
      let result = parseInt(review.dataset_alias_result)
      reviewService.sendDatasetAliasReview(review.id, result)
        .then(() => {
          review.dataset_alias_loading = false
          review.dataset_alias_check = true
          setTimeout(() => { this.removeCompletedReview(review) }, 2000)
        })
        .catch((error) => {
          console.warn(error); // an error means it's already answered
          review.dataset_alias_loading = false
          review.dataset_alias_check = true
          setTimeout(() => { this.removeCompletedReview(review) }, 2000)
        })
      // 
      // TODO delete code below after tests
      //
      //await new Promise(r => setTimeout(r, 2000))
      //review.dataset_alias_loading = false
      //review.dataset_alias_check = true
      //await new Promise(r => setTimeout(r, 2000))
      //this.moveReviewToBottom(review)
    },
    validateDatasetParentAlias(review) {
      review.dataset_parent_alias_loading = true
      this.moveReviewToBottom(review)
      let result = parseInt(review.dataset_parent_alias_result)
      reviewService.sendDatasetParentAliasReview(review.publication_dataset_alias_id, result)
        .then(() => {
          review.dataset_parent_alias_loading = false
          review.dataset_parent_alias_check = true
          setTimeout(() => { this.removeCompletedReview(review) }, 2000)
        })
        .catch((error) => {
          console.warn(error); // an error means it's already answered
          review.dataset_parent_alias_loading = false
          review.dataset_parent_alias_check = true
          setTimeout(() => { this.removeCompletedReview(review) }, 2000)
        })
    },
    moveReviewToBottom(review) {
      if (review.hasPendingAnswer()) {
        return
      }
      let index = this.pendingReviews.map(e => e.id).indexOf(review.id)
      if (index >= 0) {
        let removed = this.pendingReviews.splice(index, 1)
        this.pendingReviews.splice(this.totalTopReviews - 1, 1, removed[0])
      }
    },
    removeCompletedReview(review) {
      if (review.hasPendingAnswer()) {
        return
      }
      let index = this.pendingReviews.map(e => e.id).indexOf(review.id)
      if (index >= 0) {
        this.pendingReviews.splice(index, 1) // remove completed review 
      }
      if (this.pendingReviews.length <= 5) {
        setTimeout(() => { this.fetchReviews() }, 100)
      }
      this.totalReviewed++ // increment counter for completed reviews
    }
  },
}
</script>

<style scoped>
.publication {
  border: 1px solid black;
  margin-bottom: 15px;
  padding: 5px 10px;
  box-shadow: 5px 5px 5px #aaa;
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
  padding: 5px;
}
.mention-text {

}
.mention-dataset {

}
.mention-actions {
  margin: 5px 5px 10px 0;
}
.mention-actions button {
  text-transform: none;
}
.mention i.empty-dataset {
  margin: 2px 0 0 -2px;
}

.list-enter-active, .list-leave-active {
  transition: all 1s;
}
.list-enter {
  opacity: 0;
  transform: translateX(-50px);
}
.list-leave-to {
  opacity: 0;
  transform: translateX(50px);
}
</style>