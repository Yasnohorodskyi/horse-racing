import { mount } from '@vue/test-utils';
import GameHeader from '@/components/GameHeader.vue';

describe('GameHeader', () => {
  it('renders title and buttons', () => {
    const wrapper = mount(GameHeader, {
      propsData: {
        canStart: true,
        startLabel: 'Start',
      },
    });

    const buttons = wrapper.findAll('button');
    expect(wrapper.find('.game-header__title').text()).toBe('Horse Racing');
    expect(buttons).toHaveLength(2);
    expect(buttons.at(0).text()).toBe('Generate Program');
    expect(buttons.at(1).text()).toBe('Start');
  });

  it('emits generate and toggle events', async () => {
    const wrapper = mount(GameHeader, {
      propsData: {
        canStart: true,
        startLabel: 'Start',
      },
    });

    const buttons = wrapper.findAll('button');
    await buttons.at(0).trigger('click');
    await buttons.at(1).trigger('click');

    expect(wrapper.emitted('generate')).toBeTruthy();
    expect(wrapper.emitted('toggle')).toBeTruthy();
  });

  it('disables start button when canStart is false', () => {
    const wrapper = mount(GameHeader, {
      propsData: {
        canStart: false,
        startLabel: 'Start',
      },
    });

    const buttons = wrapper.findAll('button');
    expect(buttons.at(1).attributes('disabled')).toBe('disabled');
  });
});
