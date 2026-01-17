<template>
  <section class="panel">
    <div class="panel__header panel__header--green">Results</div>
    <div class="panel__body">
      <RoundTable
        v-for="round in rounds"
        :key="round.id"
        :title="round.title"
        :rows="round.horses"
        accent="green"
        empty-text="Waiting for finish"
      />
    </div>
  </section>
</template>

<script>
import RoundTable from './RoundTable.vue';

export default {
  name: 'ResultsPanel',
  components: { RoundTable },
  props: {
    rounds: {
      type: Array,
      required: true,
    },
  },
};
</script>

<style scoped lang="scss">
@use '../assets/styles/mixins' as *;

.panel {
  @include panel-base;

  &__header {
    @include panel-header(true);
  }

  &__header--green {
    background: #7cb342;
    color: #ffffff;
  }

  &__body {
    @include panel-body;
  }
}
</style>
