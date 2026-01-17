<template>
  <div class="app">
    <GameHeader
      :can-start="canStart"
      :start-label="startLabel"
      @generate="onGenerate"
      @toggle="onToggle"
    />
    <main class="app__content">
      <section class="app__column app__column--left">
        <HorseList :horses="horses" />
      </section>
      <section class="app__column app__column--center">
        <RaceTrack
          :participants="currentParticipants"
          :round-label="currentRoundLabel"
          :status="raceStatus"
        />
      </section>
      <section class="app__column app__column--right">
        <div class="app__side">
          <ProgramPanel :rounds="programRounds" />
          <ResultsPanel :rounds="resultsRounds" />
        </div>
      </section>
    </main>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';
import { formatRoundLabel } from './utils/format';
import GameHeader from './components/GameHeader.vue';
import HorseList from './components/HorseList.vue';
import RaceTrack from './components/RaceTrack.vue';
import ProgramPanel from './components/ProgramPanel.vue';
import ResultsPanel from './components/ResultsPanel.vue';

export default {
  name: 'App',
  components: {
    GameHeader,
    HorseList,
    RaceTrack,
    ProgramPanel,
    ResultsPanel,
  },
  computed: {
    ...mapState(['horses', 'raceStatus']),
    ...mapGetters([
      'programWithHorses',
      'resultsWithHorses',
      'currentParticipants',
      'currentRoundLabel',
      'isProgramReady',
    ]),
    startLabel() {
      return this.raceStatus === 'running' ? 'Pause' : 'Start';
    },
    canStart() {
      return this.isProgramReady && this.raceStatus !== 'finished';
    },
    programRounds() {
      return this.programWithHorses.map((round) => ({
        id: round.id,
        title: formatRoundLabel(round.index, round.distance),
        horses: round.horses,
      }));
    },
    resultsRounds() {
      const resultsByRound = this.resultsWithHorses.reduce((acc, result) => {
        acc[result.roundId] = result;
        return acc;
      }, {});

      return this.programWithHorses.map((round) => ({
        id: round.id,
        title: formatRoundLabel(round.index, round.distance),
        horses: resultsByRound[round.id] ? resultsByRound[round.id].placements : [],
      }));
    },
  },
  methods: {
    ...mapActions(['generateProgram', 'startOrPause']),
    onGenerate() {
      this.generateProgram();
    },
    onToggle() {
      this.startOrPause();
    },
  },
};
</script>

<style lang="scss">
.app {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, #f0ece2 0%, #cfd8dc 100%);
  color: #1f2a2e;
  overflow: hidden;

  &__content {
    flex: 1;
    display: grid;
    grid-template-columns: 260px minmax(460px, 1fr) minmax(320px, 1fr);
    gap: 16px;
    padding: 16px;
    align-items: stretch;
    min-height: 0;
    overflow: hidden;
  }

  &__column {
    min-height: 0;
  }

  &__side {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
    height: 100%;
    min-height: 0;
  }
}

@media (max-width: 1100px) {
  .app {
    &__content {
      grid-template-columns: 1fr;
    }

    &__side {
      grid-template-columns: 1fr;
    }
  }
}
</style>
