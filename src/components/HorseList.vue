<template>
  <section class="panel">
    <div class="panel__header panel__header--yellow">Horse List (1 - 20)</div>
    <div class="panel__body">
      <table class="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Condition</th>
            <th>Color</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="horse in horses" :key="horse.id">
            <td>{{ horse.name }}</td>
            <td>{{ horse.condition }}</td>
            <td>
              <span class="color-dot" :style="{ backgroundColor: horse.color }"></span>
              {{ horse.colorName }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script>
export default {
  name: 'HorseList',
  props: {
    horses: {
      type: Array,
      required: true,
    },
  },
};
</script>

<style scoped lang="scss">
@use '../assets/styles/mixins' as *;
@use '../assets/styles/variables' as *;

.panel {
  @include panel-base;

  &__header {
    @include panel-header;
  }

  &__header--yellow {
    background: #f6e96b;
  }

  &__body {
    @include panel-body($panel-body-padding-compact);
  }
}

.table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;

  th,
  td {
    border: 1px solid #d1d1d1;
    padding: 6px 4px;
    text-align: left;
  }

  th {
    background: #f1f1f1;
    font-weight: 700;
  }
}

.color-dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 6px;
  border: 1px solid #222;
  vertical-align: middle;
}
</style>
