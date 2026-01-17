import store from '@/store';

describe('store', () => {
  beforeEach(() => {
    store.commit('RESET_ALL');
  });

  it('generates 20 horses and 6 rounds', () => {
    store.dispatch('generateProgram');

    expect(store.state.horses).toHaveLength(20);
    expect(store.state.program).toHaveLength(6);
    expect(store.state.currentRoundIndex).toBe(0);
    expect(store.state.raceStatus).toBe('ready');
  });

  it('creates rounds with 10 horses each', () => {
    store.dispatch('generateProgram');

    store.state.program.forEach((round) => {
      expect(round.horses).toHaveLength(10);
    });
  });
});

describe('store race flow', () => {
  let randomSpy;

  beforeEach(() => {
    jest.useFakeTimers();
    randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.99);
    store.commit('RESET_ALL');
    store.dispatch('generateProgram');
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
    if (randomSpy) {
      randomSpy.mockRestore();
    }
    store.commit('RESET_ALL');
  });

  it('toggles start and pause without advancing progress', () => {
    store.dispatch('startOrPause');
    expect(store.state.raceStatus).toBe('running');

    jest.advanceTimersByTime(240);
    const snapshot = { ...store.state.progressMap };

    store.dispatch('startOrPause');
    expect(store.state.raceStatus).toBe('paused');

    jest.advanceTimersByTime(1000);
    expect(store.state.progressMap).toEqual(snapshot);
  });

  it('resets positions each round and produces results for 6 rounds', () => {
    const advanceUntil = (predicate, maxSteps = 400, stepMs = 200) => {
      for (let step = 0; step < maxSteps; step += 1) {
        if (predicate()) {
          return true;
        }
        jest.advanceTimersByTime(stepMs);
      }
      return false;
    };

    store.dispatch('startOrPause');

    expect(advanceUntil(() => store.state.results.length === 1)).toBe(true);
    expect(Object.values(store.state.progressMap).every((value) => value === 100)).toBe(true);
    expect(store.state.pendingRoundIndex).toBe(1);

    jest.advanceTimersByTime(700);
    expect(store.state.currentRoundIndex).toBe(1);
    expect(Object.values(store.state.progressMap)).toHaveLength(10);
    expect(Object.values(store.state.progressMap).every((value) => value < 100)).toBe(true);

    expect(advanceUntil(() => store.state.raceStatus === 'finished', 600)).toBe(true);
    expect(store.state.results).toHaveLength(6);
    store.state.results.forEach((round) => {
      expect(round.placements).toHaveLength(10);
    });
  });
});
