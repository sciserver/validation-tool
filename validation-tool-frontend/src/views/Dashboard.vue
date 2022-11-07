<template>
  <v-container id="dashboard-view" fluid>
    <div class="header">
      <h2>Dashboard</h2>
    </div>
    <div class="agency">
      <div class="run-metadata">
        <div class="metadata">
          <div class="run-metadata run-title">
            <h3 class="agency-name">USDA</h3>
            <v-chip class="chip" color="#E0FBFC" text-color="#3D5A80">20220507</v-chip>
          </div>
          <div class="run-metadata">
            <h6 class="label"> Run date: </h6>
            <p> 3/5/2022 12:00 AM </p>
          </div>
          <div class="run-metadata">
            <h6 class="label"> Last updated: </h6>
            <p> 7/8/2022 1:45 PM </p>
          </div>
        </div>
        <div class="progress-info">
          <h3>{{progressUsda}} % </h3>
          <v-progress-linear class="progress" color="error" v-model="progressUsda" :height="12"></v-progress-linear>
        </div>
      </div>
      <v-row>
        <v-col v-for="({ actionIcon, actionText, ...attrs }, i) in usdaStats" :key="i" cols="12" md="6" lg="3">
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
import MaterialStatCard from '../components/MaterialStatsCard.vue';

export default {
  name: 'Dashboard',
  components: {
    MaterialStatCard
  },
  data: () => ({
    progressNasa: 97.8,
    progressUsda: 76.9,
    nasaStats: [
      {
        actionIcon: 'mdi-alert',
        actionText: 'Some additional info',
        color: '#FD9A13',
        icon: 'mdi-database',
        title: 'Datasets',
        value: '12',
      },
      {
        actionIcon: 'mdi-tag',
        actionText: 'Some additional info',
        color: 'primary',
        icon: 'mdi-chart-bar',
        title: 'Dyads',
        value: '4925',
      },
      {
        actionIcon: 'mdi-calendar-range',
        actionText: 'Total snippets',
        color: 'success',
        icon: 'mdi-clipboard-text-multiple',
        title: 'Snippets',
        value: '2567',
      },
      {
        actionIcon: 'mdi-history',
        actionText: 'More info',
        color: 'info',
        icon: 'mdi-script-text',
        title: 'Publications',
        value: '927',
      },
    ],
    usdaStats: [
      {
        actionIcon: 'mdi-alert',
        actionText: 'Some additional info',
        color: '#FD9A13',
        icon: 'mdi-database',
        title: 'Datasets',
        value: '2',
      },
      {
        actionIcon: 'mdi-tag',
        actionText: 'Some additional info',
        color: 'primary',
        icon: 'mdi-chart-bar',
        title: 'Dyads',
        value: '10165',
      },
      {
        actionIcon: 'mdi-calendar-range',
        actionText: 'Total snippets',
        color: 'success',
        icon: 'mdi-clipboard-text-multiple',
        title: 'Snippets',
        value: '4417',
      },
      {
        actionIcon: 'mdi-history',
        actionText: 'More info',
        color: 'info',
        icon: 'mdi-script-text',
        title: 'Publications',
        value: '2074',
      },
    ],
  }),
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