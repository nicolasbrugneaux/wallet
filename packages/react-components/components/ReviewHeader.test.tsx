import ReviewHeader from '@celo/react-components/components/ReviewHeader'
import { render } from '@testing-library/react-native'
import * as React from 'react'

describe('ReviewHeader', () => {
  describe('when just title', () => {
    it('renders title', () => {
      const { getByText } = render(<ReviewHeader title="God is a Miner" />)
      expect(getByText('God is a Miner')).toBeTruthy()
    })
  })
  describe('subtitle is passed too', () => {
    it('renders subtitle', () => {
      const { getByText } = render(
        <ReviewHeader title="God is a Miner" subtitle={'Off the Chain'} />
      )
      expect(getByText('God is a Miner')).toBeTruthy()
      expect(getByText('Off the Chain')).toBeTruthy()
    })
  })
})
