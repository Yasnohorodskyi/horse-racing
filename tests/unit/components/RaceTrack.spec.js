import { mount } from '@vue/test-utils';
import RaceTrack from '@/components/RaceTrack.vue';

describe('RaceTrack', () => {
  it('renders 10 lanes when there are no participants', () => {
    const wrapper = mount(RaceTrack, {
      propsData: {
        participants: [],
        roundLabel: '',
        status: 'idle',
      },
    });

    expect(wrapper.findAll('.track__lane')).toHaveLength(10);
    expect(wrapper.find('.track__status').text()).toBe('Idle');
    wrapper.destroy();
  });

  it('renders participants and status', () => {
    const participants = [
      {
        lane: 1,
        horse: { id: 'horse-1', color: '#ff0000' },
        progress: 50,
      },
      {
        lane: 2,
        horse: { id: 'horse-2', color: '#00ff00' },
        progress: 10,
      },
    ];

    const wrapper = mount(RaceTrack, {
      propsData: {
        participants,
        roundLabel: '1st Lap - 1200m',
        status: 'paused',
      },
    });

    expect(wrapper.findAll('.track__lane')).toHaveLength(2);
    expect(wrapper.find('.track__status').text()).toBe('Paused');
    wrapper.destroy();
  });

  it('calculates horse offset from progress', () => {
    const wrapper = mount(RaceTrack, {
      propsData: {
        participants: [],
        roundLabel: '',
        status: 'idle',
      },
    });

    wrapper.vm.trackWidth = 500;
    const style = wrapper.vm.horseStyle({
      progress: 50,
      horse: { color: '#ff0000' },
    });

    expect(style['--offset']).toBe('195px');
    expect(style.color).toBe('#ff0000');
    wrapper.destroy();
  });
});
