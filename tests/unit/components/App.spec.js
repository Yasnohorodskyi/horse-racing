import { shallowMount } from '@vue/test-utils';
import App from '@/App.vue';
import GameHeader from '@/components/GameHeader.vue';
import store from '@/store';

describe('App', () => {
  beforeEach(() => {
    store.commit('RESET_ALL');
    store.dispatch('generateProgram');
  });

  it('passes state to header props', () => {
    const wrapper = shallowMount(App, {
      store,
      stubs: {
        RaceTrack: true,
        HorseList: true,
        ProgramPanel: true,
        ResultsPanel: true,
      },
    });

    const header = wrapper.findComponent(GameHeader);
    expect(header.exists()).toBe(true);
    expect(header.props('canStart')).toBe(true);
    expect(header.props('startLabel')).toBe('Start');
    wrapper.destroy();
  });
});
