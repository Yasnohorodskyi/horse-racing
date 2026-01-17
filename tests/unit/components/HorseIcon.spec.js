import { mount } from '@vue/test-utils';
import HorseIcon from '@/components/HorseIcon.vue';

describe('HorseIcon', () => {
  it('renders svg icon', () => {
    const wrapper = mount(HorseIcon);
    const svg = wrapper.find('svg');

    expect(svg.exists()).toBe(true);
    expect(svg.attributes('viewBox')).toBe('0 0 300.143 240.397');
  });
});
