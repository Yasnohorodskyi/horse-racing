<template>
  <header class="game-header">
    <div class="game-header__title">Horse Racing</div>
    <div class="game-header__actions">
      <button class="btn" type="button" @click="$emit('generate')">Generate Program</button>
      <button class="btn btn--primary" type="button" :disabled="!canStart" @click="$emit('toggle')">
        {{ startLabel }}
      </button>
    </div>
  </header>
</template>

<script>
export default {
  name: 'GameHeader',
  props: {
    canStart: {
      type: Boolean,
      required: true,
    },
    startLabel: {
      type: String,
      required: true,
    },
  },
};
</script>

<style scoped lang="scss">
.game-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 18px;
  background: linear-gradient(90deg, #e76f51 0%, #f4a261 100%);
  border: 2px solid #2d2d2d;
  box-shadow: inset 0 -2px 0 rgba(0, 0, 0, 0.2);

  &__title {
    font-size: 20px;
    font-weight: 700;
    color: #1e1e1e;
    letter-spacing: 0.4px;
  }

  &__actions {
    display: flex;
    gap: 12px;
  }
}

.btn {
  padding: 8px 14px;
  border: 2px solid #2d2d2d;
  background: #f1f1f1;
  font-weight: 700;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition:
    transform 0.12s ease,
    box-shadow 0.12s ease;
}

.btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 3px 0 #2d2d2d;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn--primary {
  background: #ffe8cc;
}
</style>
