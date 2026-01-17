<template>
  <section class="track">
    <div ref="trackField" class="track__field">
      <div v-for="lane in displayLanes" :key="lane.key" class="track__lane">
        <div class="track__lane-label">{{ lane.label }}</div>
        <div class="track__lane-line"></div>
        <div v-if="lane.horse" class="track__horse" :style="horseStyle(lane)">
          <HorseIcon class="track__horse-icon" />
        </div>
      </div>
      <div class="track__finish">
        <span>FINISH</span>
      </div>
    </div>
    <div class="track__meta">
      <span class="track__lap">{{ roundLabel }}</span>
      <span class="track__status">{{ statusLabel }}</span>
    </div>
  </section>
</template>

<script>
import HorseIcon from './HorseIcon.vue';

export default {
  name: 'RaceTrack',
  components: { HorseIcon },
  props: {
    participants: {
      type: Array,
      required: true,
    },
    roundLabel: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      default: 'idle',
    },
  },
  data() {
    return {
      trackWidth: 0,
      resizeObserver: null,
    };
  },
  computed: {
    displayLanes() {
      if (this.participants.length) {
        return this.participants.map((entry) => ({
          key: entry.horse.id,
          label: entry.lane,
          horse: entry.horse,
          progress: entry.progress,
        }));
      }

      return Array.from({ length: 10 }, (_, index) => ({
        key: `lane-${index + 1}`,
        label: index + 1,
        horse: null,
        progress: 0,
      }));
    },
    statusLabel() {
      if (this.status === 'running') return 'Racing';
      if (this.status === 'paused') return 'Paused';
      if (this.status === 'finished') return 'Finished';
      if (this.status === 'ready') return 'Ready';
      return 'Idle';
    },
  },
  mounted() {
    if (window.ResizeObserver) {
      this.resizeObserver = new ResizeObserver((entries) => {
        entries.forEach((entry) => {
          this.trackWidth = entry.contentRect.width;
        });
      });
      if (this.$refs.trackField) {
        this.resizeObserver.observe(this.$refs.trackField);
      }
    } else {
      this.updateTrackWidth();
      window.addEventListener('resize', this.updateTrackWidth);
    }
  },
  beforeDestroy() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
    window.removeEventListener('resize', this.updateTrackWidth);
  },
  methods: {
    updateTrackWidth() {
      this.trackWidth = this.$refs.trackField ? this.$refs.trackField.clientWidth : 0;
    },
    horseStyle(lane) {
      const startOffset = 42;
      const finishOffset = 20;
      const horseWidth = 48;
      const available = Math.max(this.trackWidth - startOffset - finishOffset - horseWidth, 0);
      const progress = Math.min(lane.progress, 100);
      const offset = (available * progress) / 100;

      return {
        '--offset': `${offset}px`,
        color: lane.horse.color,
      };
    },
  },
};
</script>

<style scoped lang="scss">
.track {
  display: flex;
  flex-direction: column;
  border: 2px solid #2d2d2d;
  background: #d9d9d9;
  height: 100%;

  &__field {
    position: relative;
    flex: 1;
    padding: 12px 32px 12px 0;
    display: flex;
    flex-direction: column;
  }

  &__lane {
    position: relative;
    display: flex;
    align-items: center;
    flex: 1;
    min-height: 36px;
  }

  &__lane-label {
    width: 32px;
    height: 100%;
    background: #5c7c3b;
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    border-right: 2px solid #2d2d2d;
  }

  &__lane-line {
    position: absolute;
    left: 32px;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    border-bottom: 2px dashed #444;
    opacity: 0.6;
  }

  &__horse {
    position: absolute;
    left: 42px;
    top: 50%;
    transform: translateY(-50%) translateX(var(--offset));
    transition: transform 0.06s linear;
    display: flex;
    align-items: center;
    will-change: transform;
  }

  &__horse-icon {
    filter: drop-shadow(0 3px 3px rgba(0, 0, 0, 0.25));
  }

  &__finish {
    position: absolute;
    top: 0;
    right: 12px;
    bottom: 0;
    width: 8px;
    background: #e63946;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    padding-bottom: 8px;
    font-size: 10px;
    font-weight: 700;
    color: #e63946;

    span {
      position: absolute;
      right: -12px;
      bottom: 38px;
      transform: rotate(-90deg);
      transform-origin: right bottom;
    }
  }

  &__meta {
    display: flex;
    justify-content: space-between;
    padding: 10px 14px;
    background: #d1d1d1;
    border-top: 2px solid #2d2d2d;
    font-weight: 700;
    font-size: 13px;
    color: #e76f51;
  }

  &__status {
    color: #1f1f1f;
    text-transform: uppercase;
    font-size: 11px;
  }
}
</style>
