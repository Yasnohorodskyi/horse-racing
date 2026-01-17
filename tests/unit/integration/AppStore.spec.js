import { mount } from '@vue/test-utils';
import App from '@/App.vue';
import GameHeader from '@/components/GameHeader.vue';
import store from '@/store';

describe('App + store integration', () => {
  let randomSpy;

  beforeEach(() => {
    jest.useFakeTimers();
    randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.7);
    store.commit('RESET_ALL');
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
    if (randomSpy) {
      randomSpy.mockRestore();
    }
    store.commit('RESET_ALL');
  });

  it('generates program via header button', async () => {
    const wrapper = mount(App, {
      store,
      stubs: {
        RaceTrack: true,
        HorseList: true,
        ProgramPanel: true,
        ResultsPanel: true,
      },
    });

    const header = wrapper.findComponent(GameHeader);
    const buttons = header.findAll('button');
    await buttons.at(0).trigger('click');

    expect(store.state.program).toHaveLength(6);
    expect(store.state.horses).toHaveLength(20);
    expect(store.state.raceStatus).toBe('ready');
    wrapper.destroy();
  });

  it('starts and pauses race via header button', async () => {
    const wrapper = mount(App, {
      store,
      stubs: {
        RaceTrack: true,
        HorseList: true,
        ProgramPanel: true,
        ResultsPanel: true,
      },
    });

    const header = wrapper.findComponent(GameHeader);
    let buttons = header.findAll('button');
    await buttons.at(0).trigger('click');

    await buttons.at(1).trigger('click');
    await wrapper.vm.$nextTick();

    expect(store.state.raceStatus).toBe('running');
    buttons = header.findAll('button');
    expect(buttons.at(1).text()).toBe('Pause');

    jest.advanceTimersByTime(240);
    const progressSnapshot = { ...store.state.progressMap };

    await buttons.at(1).trigger('click');
    await wrapper.vm.$nextTick();

    expect(store.state.raceStatus).toBe('paused');
    buttons = header.findAll('button');
    expect(buttons.at(1).text()).toBe('Start');

    jest.advanceTimersByTime(600);
    expect(store.state.progressMap).toEqual(progressSnapshot);

    wrapper.destroy();
  });
});
