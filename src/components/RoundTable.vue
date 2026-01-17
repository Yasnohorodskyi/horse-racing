<template>
  <div class="round">
    <div class="round__title" :class="accentClass">{{ title }}</div>
    <table class="round__table">
      <thead>
        <tr>
          <th>Position</th>
          <th>Name</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(horse, index) in rows" :key="horse.id">
          <td>{{ index + 1 }}</td>
          <td>{{ horse.name }}</td>
        </tr>
        <tr v-if="!rows.length">
          <td colspan="2" class="round__empty">{{ emptyText }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'RoundTable',
  props: {
    title: {
      type: String,
      required: true,
    },
    rows: {
      type: Array,
      required: true,
    },
    accent: {
      type: String,
      default: 'blue',
    },
    emptyText: {
      type: String,
      default: 'Waiting...',
    },
  },
  computed: {
    accentClass() {
      return `round__title--${this.accent}`;
    },
  },
};
</script>

<style scoped lang="scss">
.round {
  border: 1px solid #c7c7c7;
  margin-bottom: 10px;

  &__title {
    padding: 6px 8px;
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    border-bottom: 1px solid #c7c7c7;
  }

  &__title--blue {
    background: #5b8def;
    color: #fff;
  }

  &__title--green {
    background: #7cb342;
    color: #fff;
  }

  &__table {
    width: 100%;
    border-collapse: collapse;
    font-size: 11px;

    th,
    td {
      border: 1px solid #d7d7d7;
      padding: 4px 6px;
      text-align: left;
    }

    th {
      background: #f4f4f4;
    }
  }

  &__empty {
    text-align: center;
    color: #9a9a9a;
    padding: 10px 6px;
  }
}
</style>
