<template>
  <v-card v-bind="$attrs" v-on="$listeners">
    <slot></slot>
  </v-card>
</template>

<script>
export default { name: 'AppCard' }
</script>
