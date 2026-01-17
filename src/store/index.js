import Vue from 'vue';
import Vuex from 'vuex';
import { HORSE_COLORS, HORSE_NAMES } from '../constants/horses';
import { ROUND_DISTANCES } from '../constants/race';
import { formatRoundLabel } from '../utils/format';
import { randomInt, sampleSize, shuffle } from '../utils/random';

Vue.use(Vuex);

const TICK_MS = 60;
const BETWEEN_ROUNDS_DELAY = 700;
const BASE_DISTANCE = 1200;

let raceTimer = null;
let nextRoundTimer = null;

const clearTimers = () => {
  if (raceTimer) {
    clearInterval(raceTimer);
    raceTimer = null;
  }
  if (nextRoundTimer) {
    clearTimeout(nextRoundTimer);
    nextRoundTimer = null;
  }
};

const createHorsePool = () => {
  const names = shuffle([...HORSE_NAMES]);
  const colors = shuffle([...HORSE_COLORS]);

  return names.slice(0, 20).map((name, index) => ({
    id: `horse-${index + 1}`,
    name,
    condition: randomInt(1, 100),
    color: colors[index].value,
    colorName: colors[index].name,
  }));
};

const createProgram = (horses) =>
  ROUND_DISTANCES.map((distance, index) => ({
    id: `round-${index + 1}`,
    index,
    distance,
    horses: sampleSize(horses, 10).map((horse) => horse.id),
  }));

const buildRoundState = (round, horses) => {
  if (!round) {
    return {
      progressMap: {},
      speedMap: {},
      finishTimes: {},
      finishOrder: [],
      roundElapsedMs: 0,
    };
  }

  const horseMap = horses.reduce((acc, horse) => {
    acc[horse.id] = horse;
    return acc;
  }, {});

  const distanceFactor = BASE_DISTANCE / round.distance;
  const progressMap = {};
  const speedMap = {};

  round.horses.forEach((horseId) => {
    const horse = horseMap[horseId];
    const conditionFactor = 0.6 + (horse.condition / 100) * 0.9;
    const baseSpeed = 0.7 + Math.random() * 0.5;

    progressMap[horseId] = 0;
    speedMap[horseId] = baseSpeed * conditionFactor * distanceFactor;
  });

  return {
    progressMap,
    speedMap,
    finishTimes: {},
    finishOrder: [],
    roundElapsedMs: 0,
  };
};

const state = {
  horses: [],
  program: [],
  results: [],
  currentRoundIndex: -1,
  pendingRoundIndex: null,
  raceStatus: 'idle',
  progressMap: {},
  speedMap: {},
  finishTimes: {},
  finishOrder: [],
  roundElapsedMs: 0,
};

const mutations = {
  RESET_ALL(state) {
    state.horses = [];
    state.program = [];
    state.results = [];
    state.currentRoundIndex = -1;
    state.pendingRoundIndex = null;
    state.raceStatus = 'idle';
    state.progressMap = {};
    state.speedMap = {};
    state.finishTimes = {};
    state.finishOrder = [];
    state.roundElapsedMs = 0;
  },
  SET_HORSES(state, horses) {
    state.horses = horses;
  },
  SET_PROGRAM(state, program) {
    state.program = program;
  },
  SET_CURRENT_ROUND(state, index) {
    state.currentRoundIndex = index;
  },
  SET_PENDING_ROUND(state, index) {
    state.pendingRoundIndex = index;
  },
  SET_STATUS(state, status) {
    state.raceStatus = status;
  },
  INIT_ROUND(state, roundState) {
    state.progressMap = roundState.progressMap;
    state.speedMap = roundState.speedMap;
    state.finishTimes = roundState.finishTimes;
    state.finishOrder = roundState.finishOrder;
    state.roundElapsedMs = roundState.roundElapsedMs;
  },
  UPDATE_ROUND(state, payload) {
    state.progressMap = payload.progressMap;
    state.finishTimes = payload.finishTimes;
    state.finishOrder = payload.finishOrder;
    state.roundElapsedMs = payload.roundElapsedMs;
  },
  ADD_RESULT(state, result) {
    state.results.push(result);
  },
};

const actions = {
  generateProgram({ commit }) {
    clearTimers();
    commit('RESET_ALL');

    const horses = createHorsePool();
    const program = createProgram(horses);

    commit('SET_HORSES', horses);
    commit('SET_PROGRAM', program);
    commit('SET_CURRENT_ROUND', 0);
    commit('SET_STATUS', 'ready');
    commit('INIT_ROUND', buildRoundState(program[0], horses));
  },
  startOrPause({ state, commit, dispatch }) {
    if (!state.program.length) {
      return;
    }

    if (state.raceStatus === 'running') {
      commit('SET_STATUS', 'paused');
      clearTimers();
      return;
    }

    if (state.raceStatus === 'finished') {
      return;
    }

    commit('SET_STATUS', 'running');
    dispatch('runRound');
  },
  runRound({ state, commit, dispatch }) {
    clearTimers();

    if (state.pendingRoundIndex !== null) {
      const nextRound = state.program[state.pendingRoundIndex];
      commit('SET_CURRENT_ROUND', state.pendingRoundIndex);
      commit('INIT_ROUND', buildRoundState(nextRound, state.horses));
      commit('SET_PENDING_ROUND', null);
    }

    const round = state.program[state.currentRoundIndex];
    if (!round) {
      return;
    }

    if (!Object.keys(state.progressMap).length) {
      commit('INIT_ROUND', buildRoundState(round, state.horses));
    }

    let elapsedMs = state.roundElapsedMs || 0;

    raceTimer = setInterval(() => {
      if (state.raceStatus !== 'running') {
        clearTimers();
        return;
      }

      elapsedMs += TICK_MS;
      const progressMap = { ...state.progressMap };
      const finishTimes = { ...state.finishTimes };
      const finishOrder = [...state.finishOrder];

      round.horses.forEach((horseId) => {
        if (finishTimes[horseId]) {
          return;
        }

        const speed = state.speedMap[horseId] || 0.5;
        const jitter = 0.8 + Math.random() * 0.4;
        const nextProgress = Math.min(100, progressMap[horseId] + speed * jitter);

        progressMap[horseId] = nextProgress;

        if (nextProgress >= 100) {
          finishTimes[horseId] = elapsedMs;
          finishOrder.push(horseId);
        }
      });

      commit('UPDATE_ROUND', {
        progressMap,
        finishTimes,
        finishOrder,
        roundElapsedMs: elapsedMs,
      });

      if (finishOrder.length === round.horses.length) {
        clearTimers();
        const finalProgressMap = { ...progressMap };
        round.horses.forEach((horseId) => {
          finalProgressMap[horseId] = 100;
        });
        commit('UPDATE_ROUND', {
          progressMap: finalProgressMap,
          finishTimes,
          finishOrder,
          roundElapsedMs: elapsedMs,
        });
        commit('ADD_RESULT', {
          roundId: round.id,
          distance: round.distance,
          placements: finishOrder,
        });

        if (state.currentRoundIndex >= state.program.length - 1) {
          commit('SET_PENDING_ROUND', null);
          commit('SET_STATUS', 'finished');
          return;
        }

        const nextRoundIndex = state.currentRoundIndex + 1;
        commit('SET_PENDING_ROUND', nextRoundIndex);

        nextRoundTimer = setTimeout(() => {
          if (state.raceStatus === 'running') {
            dispatch('runRound');
          }
        }, BETWEEN_ROUNDS_DELAY);
      }
    }, TICK_MS);
  },
};

const getters = {
  horseById: (state) => (id) => state.horses.find((horse) => horse.id === id),
  isProgramReady: (state) => state.program.length === ROUND_DISTANCES.length,
  currentRound: (state) => state.program[state.currentRoundIndex] || null,
  currentRoundLabel: (state) => {
    const round = state.program[state.currentRoundIndex];
    if (!round) {
      return '';
    }
    return formatRoundLabel(round.index, round.distance);
  },
  currentParticipants: (state, getters) => {
    const round = getters.currentRound;
    if (!round) {
      return [];
    }

    return round.horses.map((horseId, index) => ({
      lane: index + 1,
      horse: getters.horseById(horseId),
      progress: state.progressMap[horseId] || 0,
      finished: Boolean(state.finishTimes[horseId]),
    }));
  },
  programWithHorses: (state, getters) =>
    state.program.map((round) => ({
      ...round,
      horses: round.horses.map((horseId) => getters.horseById(horseId)),
    })),
  resultsWithHorses: (state, getters) =>
    state.results.map((round) => ({
      ...round,
      placements: round.placements.map((horseId) => getters.horseById(horseId)),
    })),
};

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters,
});
