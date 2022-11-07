<template>
  <v-container id="dashboard-view" fluid>
    <div class="header">
      <h2>Dashboard</h2>
    </div>
    <div v-for="a in Object.values(agencies)" :key="a.run_id" class="agency">
      <div class="run-metadata">
        <div class="metadata">
          <div class="run-metadata run-title">
            <h3 class="agency-name">{{ agencyRuns[a.run_id].agency }}</h3>
            <v-chip class="chip" color="#E0FBFC" text-color="#3D5A80">{{ agencyRuns[a.run_id].version }}</v-chip>
          </div>
          <div class="run-metadata">
            <h6 class="label"> Run date: </h6>
            <p> {{ agencyRuns[a.run_id].run_date }} </p>
          </div>
          <div class="run-metadata">
            <h6 class="label"> Last updated: </h6>
            <p> {{ agencyRuns[a.run_id].last_updated }} </p>
          </div>
        </div>
        <div class="progress-info">
          <h3>{{ a.pct_complete.toFixed(2) }} % </h3>
          <v-progress-linear class="progress" color="error" v-model="a.pct_complete" :height="12">
          </v-progress-linear>
          <p>(snippets reviewed)</p>
        </div>
      </div>
      <v-row>
        <v-col v-for="({ actionIcon, actionText, ...attrs }, i) in a.statistics" :key="i" cols="12" md="6" lg="3">
          <MaterialStatCard v-bind="attrs">
            <template #actions>
              <v-icon class="mr-2" small v-text="actionIcon" />
              <div class="text-truncate">
                {{ actionText }}
              </div>
            </template>
          </MaterialStatCard>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script>
import { reviewService } from '@/services';
import MaterialStatCard from '../components/MaterialStatsCard.vue';

export default {
  name: 'Dashboard',
  components: {
    MaterialStatCard
  },
  mounted() {
    this.fetchReviewStatistics();
  },
  data: () => ({
    agencies: [],
    agencyRuns: {
      "1": {
        "run_id": 1,
        "agency": "NASA",
        "version": "20220524",
        "run_date": "3/22/2022",
        "last_updated": "7/8/2022",
      },
      "2": {
        "run_id": 2,
        "agency": "USDA",
        "version": "20220507",
        "run_date": "3/5/2022",
        "last_updated": "7/8/2022",
      },
      "3": {
        "run_id": 3,
        "agency": "NSF",
        "version": "20220603",
        "run_date": "5/21/2022",
        "last_updated": "7/8/2022",
      },
      "4": {
        "run_id": 4,
        "agency": "NOAA",
        "version": "20220722_004",
        "last_updated": "9/21/2022",
      },
      "5": {
        "run_id": 5,
        "agency": "NCES",
        "version": "20220714_005",
        "last_updated": "9/21/2022",
      },
      "9": {
        "run_id": 9,
        "agency": "Deutsche Bundesbank",
        "version": "20220926_009",
        "last_updated": "10/10/2022",
      },
      "10": {
        "run_id": 10,
        "agency": "RUCC",
        "version": "20221014_009",
        "last_updated": "10/15/2022",
      },
    }
  }),
  methods: {
    fetchReviewStatistics() {
      const agenciesData = {};
      reviewService.getReviewProgress()
        .then((data) => {
          for (const a of data) {
            agenciesData[a.run_id] = a;
          }
        })
      reviewService.getReviewStatistics()
        .then((data) => {
          console.log(data);
          let stats = [];
          for (const key of Object.keys(agenciesData)) {
            stats = [
              {
                actionIcon: 'mdi-alert',
                actionText: 'Some additional info',
                color: '#FD9A13',
                icon: 'mdi-database',
                title: 'Datasets',
                value: data[key].n_datasets.toString(),
              },
              {
                actionIcon: 'mdi-tag',
                actionText: 'Some additional info',
                color: 'primary',
                icon: 'mdi-chart-bar',
                title: 'Dyads',
                value: data[key].n_dyads.toString(),
              },
              {
                actionIcon: 'mdi-calendar-range',
                actionText: 'Total snippets',
                color: 'success',
                icon: 'mdi-clipboard-text-multiple',
                title: 'Snippets',
                value: data[key].n_snippets_total.toString(),
              },
              {
                actionIcon: 'mdi-history',
                actionText: 'More info',
                color: 'info',
                icon: 'mdi-script-text',
                title: 'Publications',
                value: data[key].n_publications.toString(),
              },
            ];
            agenciesData[key].statistics = stats;
          }
          console.log(agenciesData);
          this.agencies = agenciesData;
        })
    },
  }
}
</script>

<style scoped>
.header {
  padding: 20px;
}

.agency {
  padding: 20px;
}

.metadata {
  margin-bottom: 40px;
}

h2,
h3,
h6 {
  font-family: "Roboto", sans-serif !important;
}

h6,
h2 {
  line-height: 1.5em;
}

h2 {
  font-size: 2.25rem !important;
  font-weight: 500;
  letter-spacing: -0.0083333333em !important;
}

h3 {
  font-size: 1.5625rem !important;
  font-weight: 400;
  line-height: 1.4em;
  letter-spacing: normal !important;
}

h6 {
  font-size: 0.75rem !important;
  font-weight: 600;
  letter-spacing: 0.0125em !important;
  text-transform: uppercase !important;
}

p {
  margin: 0;
}

.overline {}

.agency-name {
  color: #293241;
  margin-right: 20px;
}

.run-title {
  margin-bottom: 15px;
}

.run-metadata {
  padding-left: 20px;
  display: flex;
  align-items: center;
}

.chip {
  font-weight: 600 !important;
}

.progress-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 1000px;
}

.progress {
  margin-left: 50px;
  max-width: 1000px;

}

.label {
  margin-right: 5px;
}
</style>