/* eslint-disable @typescript-eslint/ban-ts-ignore */
/* eslint-disable import/no-extraneous-dependencies */
import React from 'react'
import Octicon, { Octoface } from '@primer/octicons-react'
import { mount, shallow } from 'enzyme'
import renderer from 'react-test-renderer'

import Header, { StyledControllGroup, ControlBandGroup } from '../Header'

describe('<Header /> component', () => {
  // eslint-disable-next-line jest/expect-expect
  it('renders', () => {
    mount(<Header />)
  })

  it('has this set of styles', () => {
    const wrapper = renderer.create(<Header />).toJSON()

    expect(wrapper).toHaveStyleRule('position', 'fixed')
    expect(wrapper).toHaveStyleRule('display', 'flex')
  })

  describe('<StyledControlGroup>', () => {
    it('has this set of styles', () => {
      const wrapper = renderer.create(<StyledControllGroup />).toJSON()

      expect(wrapper).toHaveStyleRule('display', 'flex')
      expect(wrapper).toHaveStyleRule('list-style', 'none')
    })
    describe('id="brand"', () => {
      it('has this set of styles', () => {
        const wrapper = mount(<Header />)
        const component = wrapper.find('#brand')

        expect(component).toHaveStyleRule('flex', '1')
      })

      it('has only one child', () => {
        const wrapper = mount(<Header />)
        const component = wrapper.find('ul#brand')

        expect(component.props().children).toHaveLength(2)
      })

      it('has one Octoface icon', () => {
        const wrapper = mount(<Header />)
        const component = wrapper.find('#brand').first()

        expect(component.find(Octicon).props().icon).toEqual(Octoface)
      })

      it('has `Portfolios` as title name', () => {
        const wrapper = mount(<Header />)
        const component = wrapper.find('#brand').first()

        expect(component.find('p').text()).toEqual('PortfoliOS')
      })

      it('shows dropdown menu after clicking', () => {
        const wrapper = shallow(<ControlBandGroup id="brand" />)

        wrapper.simulate('click')
        expect(wrapper.find('#dropdown')).toHaveLength(1)
      })
    })
  })

  it('found <StyledClickableItem id="clock"/>', () => {
    const wrapper = mount(<Header />)

    expect(wrapper.find('#clock')).toHaveLength(3)
  })

  it('rendered <StyledClickableItem id="clock"/> correctly', () => {
    const wrapper = mount(<Header />)

    expect(
      wrapper
        .find('#clock')
        .children()
        .find('p')
        .map(el => el.text())
    ).toEqual([new Date().toLocaleTimeString()])
  })
})
