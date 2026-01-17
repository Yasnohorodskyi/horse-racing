import { mount } from '@vue/test-utils';
import HorseList from '@/components/HorseList.vue';

describe('HorseList', () => {
  it('renders horses in the table', () => {
    const horses = [
      {
        id: 'horse-1',
        name: 'Max Verstappen',
        condition: 88,
        color: '#ff0000',
        colorName: 'Red',
      },
      {
        id: 'horse-2',
        name: 'Lewis Hamilton',
        condition: 75,
        color: '#00ff00',
        colorName: 'Green',
      },
    ];

    const wrapper = mount(HorseList, {
      propsData: { horses },
    });

    const rows = wrapper.findAll('tbody tr');
    expect(rows).toHaveLength(2);
    expect(wrapper.text()).toContain('Max Verstappen');
    expect(wrapper.text()).toContain('Lewis Hamilton');
    expect(wrapper.findAll('.color-dot')).toHaveLength(2);
  });
});
