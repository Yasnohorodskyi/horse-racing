import { mount } from '@vue/test-utils';
import ProgramPanel from '@/components/ProgramPanel.vue';
import RoundTable from '@/components/RoundTable.vue';

describe('ProgramPanel', () => {
  it('renders a table for each round', () => {
    const rounds = [
      {
        id: 'round-1',
        title: '1st Lap - 1200m',
        horses: [{ id: 'horse-1', name: 'Max Verstappen' }],
      },
      {
        id: 'round-2',
        title: '2nd Lap - 1400m',
        horses: [],
      },
    ];

    const wrapper = mount(ProgramPanel, {
      propsData: { rounds },
    });

    const tables = wrapper.findAllComponents(RoundTable);
    expect(tables).toHaveLength(2);
    expect(tables.at(0).props('title')).toBe('1st Lap - 1200m');
    expect(tables.at(0).props('accent')).toBe('blue');
    wrapper.destroy();
  });
});
