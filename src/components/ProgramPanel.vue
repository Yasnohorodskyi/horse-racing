<template>
  <section class="panel">
    <div class="panel__header panel__header--blue">Program</div>
    <div class="panel__body">
      <RoundTable
        v-for="round in rounds"
        :key="round.id"
        :title="round.title"
        :rows="round.horses"
        accent="blue"
        empty-text="No horses yet"
      />
    </div>
  </section>
</template>

<script>
import RoundTable from './RoundTable.vue';

export default {
  name: 'ProgramPanel',
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

  &__header--blue {
    background: #5b8def;
    color: #ffffff;
  }

  &__body {
    @include panel-body;
  }
}
</style>
