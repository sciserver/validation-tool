<template>
  <v-container fluid>
    <v-row no-gutters v-show="totalReviewsAlreadyRetrieved">
      <v-col cols="12">
        <v-layout justify-center>You've already reviewed {{ totalReviewed }} of {{ totalPending }} publication-dataset dyads</v-layout>
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
      <v-col cols="10" offset="1">
        <input type="checkbox" id="hide_reviewd_items_checkbox" @change='updatePageSize()' v-model="hideReviewedItems">
        Hide reviewed items
      </v-col>


      <v-col cols="10" offset="1" v-show="noPendingReviews">
        <v-alert class="all-reviewed" type="success">
          Thank you so very much for your valuable contribution!
        </v-alert>
      </v-col>
    </v-row>

    <v-row class="loader" v-show="loadingReviews">
      <v-col cols="6" offset="3">
        <div class="loader-text">Fetching reviews...</div>
        <v-progress-linear rounded indeterminate color="blue-grey darken-2" height="20"></v-progress-linear>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <!-- <transition-group name="list" tag="div"> -->
          <!-- start loop -->
          <div class="publication" v-for="review in pendingReviews" :key="review.id">
            <v-overlay absolute color="grey darken-0" :opacity="overlayOpacity" :value="review.overlay">
              <v-btn 
                color="blue accent-3 white--text"
                @click="resetReview(review)">
                Modify review
              </v-btn>
            </v-overlay>
            <div class="publication-title">
              <a v-show="!!review.publication_doi" :href="`https://doi.org/${review.publication_doi}`" target="_blank">{{ review.publication_title }}</a>
              <span v-show="!review.publication_doi">{{ review.publication_title }}</span>
            </div>
            <div class="mentions">
              <v-row no-gutters class="mention-header">
                <v-col cols="6">
                  
                </v-col>
                <v-col cols="3 pr-2">
                  Does the highlighted text in the snippet refer to a dataset?
                </v-col>
                <v-col cols="3">
                  Does the highlighted text in the snippet refer to the dataset below?
                </v-col>
              </v-row>
              <v-row no-gutters class="mention">
                <v-col cols="6" class="mention-text overflow-hidden pr-10">
                  <span class="overflow-hidden" style="display: inherit;" v-html="review.textAsHtml"></span>
                </v-col>
                <v-col cols="3">
                  <div class="mention-dataset">
                    <br>
                  </div>
                  <v-btn-toggle dense
                    class="mention-actions" 
                    v-show="true">
                    <v-btn :class="{'background-color':'grey', 'v-btn--active': selectButton(review, 'dataset', 1)}" @click="validateDatasetAlias(review, 1)" v-show="review.datasetAliasButtons()" value=1>Yes</v-btn>
                    <v-btn :class="{'background-color':'grey', 'v-btn--active': selectButton(review, 'dataset', -1)}" @click="validateDatasetAlias(review, -1)" v-show="review.datasetAliasButtons()" value=-1>No</v-btn>
                    <v-btn :class="{'background-color':'grey', 'v-btn--active': selectButton(review, 'dataset', 0)}" @click="validateDatasetAlias(review, 0)" v-show="review.datasetAliasButtons()" value=0>Unsure</v-btn>
                  </v-btn-toggle>
                  <br>
                  <span title="Nothing to review here" v-show="!review.dataset_alias">N/A</span>
                </v-col>
                <v-col cols="3">
                  <div class="mention-dataset">
                    <a v-show="!!review.dataset_parent_alias_url" :href="`${review.dataset_parent_alias_url}`" target="_blank">{{ review.dataset_parent_alias }}</a>
                    <span v-show="!review.dataset_parent_alias_url">{{ review.dataset_parent_alias }}</span>
                  </div>
                  <v-btn-toggle dense
                    class="mention-actions"
                    v-show="!!review.dataset_parent_alias"
                  >
                    <v-btn :class="{'background-color':'grey', 'v-btn--active': selectButton(review, 'alias', 1)}" @click="validateDatasetParentAlias(review, 1)" v-show="review.datasetParentAliasButtons()" value=1>Yes</v-btn>
                    <v-btn :class="{'background-color':'grey', 'v-btn--active': selectButton(review, 'alias', -1)}" @click="validateDatasetParentAlias(review, -1)" v-show="review.datasetParentAliasButtons()" value=-1>No</v-btn>
                    <v-btn :class="{'background-color':'grey', 'v-btn--active': selectButton(review, 'alias', 0)}" @click="validateDatasetParentAlias(review, 0)" v-show="review.datasetParentAliasButtons()" value=0>Unsure</v-btn>
                  </v-btn-toggle>
                  <br>
                  <span title="Nothing to review here" v-show="!review.dataset_parent_alias">N/A</span>
                </v-col>
              </v-row>
            </div>
          </div>
          <!-- end loop -->
        <!-- </transition-group> -->
      </v-col>  
    </v-row>

    <v-row class="pagination" v-show="totalReviewsAlreadyRetrieved && !loadingReviews">
      <v-col cols="12">
        <v-pagination circle
          v-model="currentPage"
          :length="totalPages"
          :total-visible="7"
          @input="loadPage"
          @next="loadPage"
          @previous="loadPage">
        </v-pagination>
      </v-col>
      <v-col cols="2" offset="5">
        <v-select outlined dense
          v-model="pageSize"
          :items="pageSizeOptions"
          @change="updatePageSize">
          <template v-slot:prepend>
            <div class="pagination-label">Items per page:</div>
          </template>
        </v-select>
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
    totalReviewsAlreadyRetrieved: false,
    totalPending: 0,     // how many reviews are pending
    totalReviewed: 0,    // how many reviews were completed
    pendingReviews: [],  // all reviews still pending
    overlayOpacity: 0.5,
    pageSizeOptions: [10, 15, 20, 50],
    pageSize: 10,
    currentPage: 1, // Vuetify component starts at 1, not 0
    loadingReviews: false,
    hideReviewedItems: false,
    numSnippets: 0,
  }),
  created() {
    // nothing
  },
  mounted() {
    this.fetchReviewsCount()
    this.fetchReviews(!this.hideReviewedItems)
  },
  computed: {
    reviewRatio() {
      return this.totalPending ? Math.ceil(this.totalReviewed / this.totalPending * 100) : 100
    },
    noPendingReviews() {
      return this.totalPending === this.totalReviewed
    },
    totalPages() {
      //return Math.ceil(this.totalPending / this.pageSize)
      if (this.hideReviewedItems) {
        return Math.ceil((this.numSnippets - this.totalReviewed)/ this.pageSize)
      }
      console.log(Math.ceil(this.numSnippets / this.pageSize))
      return Math.ceil(this.numSnippets / this.pageSize)
    }
  },
  methods: {
    fetchReviewsCount() {
      return reviewService.getPendingReviewsCount(true)
      //return reviewService.getPendingReviewsCount(true)
        .then((data) => {
          this.totalPending = data.total
          this.totalReviewed = data.answered
          this.totalReviewsAlreadyRetrieved = true
          this.numSnippets = data.total 
        })
    },
    fetchReviews() {
      //window.scroll({ top: 0, left: 0, behavior: 'smooth' })
      this.loadingReviews = true
      return reviewService.getPendingReviews(this.pageSize, this.currentPage-1, !this.hideReviewedItems)
      //return reviewService.getPendingReviews(this.pageSize, this.currentPage-1, true)
        .then((data) => {
          data = data.map(r => Review.fromData(r))
          if(this.hideReviewedItems){
            data = data.filter(r => r.isFullyReviewed == false)
          }
          this.pendingReviews = data
          this.loadingReviews = false
        })
    },
    selectButton(review, buttonType, buttonAnswer) {    
      //let ans = review.dataset_alias_loading
      if(!review.dataset_alias_loading){
        if(buttonAnswer == 1){
          if(buttonType == "dataset"){
            return review.dataset_correct == 1
          }else{
            return review.alias_correct == 1
          }
        }else if(buttonAnswer == 0){
          if(buttonType == "dataset"){
            return review.dataset_correct == 0
          }else{
            return review.alias_correct == 0
          }
        }else{
          if(buttonType == "dataset"){
            return review.dataset_correct == -1
          }else{
            return review.alias_correct == -1
          }
        }
      }else{
        return false
      }
    },
    async validateDatasetAlias(review, answer) {
      review.dataset_alias_loading = true
      let result = parseInt(answer)
      review.dataset_correct = result
      reviewService.sendDatasetAliasReview(review.id, result)
        .then(() => {
          review.dataset_alias_loading = false
          review.dataset_alias_check = true
          review.dataset_mention_answered = true
          review.dataset_alias_result = parseInt(review.dataset_correct)
          setTimeout(() => { this.checkAnswers(review) }, 500)
        })
        .catch((error) => {
          alert("Error: unable to save answer.")
          console.warn(error); // an error means it's already answered
          if (error?.status === 409) {
            review.dataset_alias_loading = false
            review.dataset_alias_check = true
            review.dataset_mention_answered = true
            setTimeout(() => { this.checkAnswers(review) }, 500)
          } else {
            review.dataset_alias_loading = false
            throw error
          }
        })

      //@click
      // TODO delete code below after tests
      //
      //await new Promise(r => setTimeout(r, 1000))
      //review.dataset_alias_loading = false
      //review.dataset_alias_check = true
      //await new Promise(r => setTimeout(r, 1000))
      //this.checkAnswers(review)
    },
    async validateDatasetParentAlias(review, answer) {
      review.dataset_parent_alias_loading = true
      let result = parseInt(answer)
      review.alias_correct = result
      reviewService.sendDatasetParentAliasReview(review.id, result)
        .then(() => {
          review.dataset_parent_alias_loading = false
          review.dataset_parent_alias_check = true
          review.dataset_mention_parent_answered = true
          review.dataset_parent_alias_result = parseInt(review.alias_correct)
          setTimeout(() => { this.checkAnswers(review) }, 500)
        })
        .catch((error) => {
          alert("Error: unable to save answer.")
          console.warn(error); // an error means it's already answered
          if (error?.status === 409) {
            review.dataset_parent_alias_loading = false
            review.dataset_parent_alias_check = true
            review.dataset_mention_parent_answered = true
            setTimeout(() => { this.checkAnswers(review) }, 500)
          } else {
            review.dataset_parent_alias_loading = false
            throw error
          } 
        })
      // TODO delete code below after tests
      //
      //await new Promise(r => setTimeout(r, 1000))
      //review.dataset_parent_alias_loading = false
      //review.dataset_parent_alias_check = true
      //await new Promise(r => setTimeout(r, 1000))
      //this.checkAnswers(review)
    },
    checkAnswers(review) {
      if (review.hasPendingAnswer()) {
        return
      }
      if (review.dataset_mention_answered 
        && review.dataset_mention_parent_answered
        && !(review.beingEdited)) {
        //this.totalReviewed++ // increment counter for completed reviews
        if (this.hideReviewedItems) {
          // this.pendingReviews = this.pendingReviews.filter(r => r.id != review.id)
          this.loadPage()
        } else {
          this.fetchReviewsCount()
        }
        
      }
      // review.answered = true
      review.overlay = true
      

      //setTimeout(() => { this.totalPending = this.totalReviewed }, 2000)
    },
    resetReview(review) {
      review.dataset_alias_result = undefined
      review.dataset_parent_alias_result = undefined
      review.dataset_alias_check = true
      review.dataset_parent_alias_check = true
      review.overlay = false
      review.beingEdited = true
    },
    loadPage() {
      this.pendingReviews = []
      this.fetchReviews()
      this.fetchReviewsCount()
    },
    updatePageSize() {
      this.currentPage = 1
      this.loadPage()
    },
  },
}
</script>

<style scoped>
.all-reviewed {
  font-weight: bold;
  margin-top: 20px;
}

.loader {
  padding-top: 80px;
}
.loader .loader-text {
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 10px;
}

.publication {
  border: 1px solid black;
  margin-bottom: 15px;
  padding: 5px 10px;
  box-shadow: 5px 5px 5px #aaa;
  position: relative;
}
.publication button {
  font-weight: bold;
  text-transform: none;
}
.publication .v-overlay button {
  font-size: 16px;
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

}
.mention i.empty-dataset {
  margin: 2px 0 0 -2px;
}

.pagination {

}
.pagination .pagination-label {
  white-space: nowrap;
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

.theme--light.v-btn.v-btn--has-bg {
    background-color: lightgrey;
}

</style>
