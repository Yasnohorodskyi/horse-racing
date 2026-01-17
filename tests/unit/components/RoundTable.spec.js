import { mount } from '@vue/test-utils';
import RoundTable from '@/components/RoundTable.vue';

describe('RoundTable', () => {
  it('renders title, rows, and accent', () => {
    const rows = [
      { id: 'horse-1', name: 'Max Verstappen' },
      { id: 'horse-2', name: 'Lewis Hamilton' },
    ];

    const wrapper = mount(RoundTable, {
      propsData: {
        title: '1st Lap - 1200m',
        rows,
        accent: 'blue',
      },
    });

    const title = wrapper.find('.round__title');
    expect(title.text()).toBe('1st Lap - 1200m');
    expect(title.classes()).toContain('round__title--blue');
    expect(wrapper.findAll('tbody tr')).toHaveLength(2);
  });

  it('shows empty text when there are no rows', () => {
    const wrapper = mount(RoundTable, {
      propsData: {
        title: '2nd Lap - 1400m',
        rows: [],
        accent: 'green',
        emptyText: 'Waiting for finish',
      },
    });

    expect(wrapper.find('.round__empty').text()).toBe('Waiting for finish');
  });
});
