import { render, waitFor } from '@testing-library/react-native'
import * as React from 'react'
import 'react-native'
import { Provider } from 'react-redux'
import SyncBankAccountScreen from 'src/account/SyncBankAccountScreen'
import { createMockStore, getMockStackScreenProps } from 'test/utils'
import { mockAccount, mockPrivateDEK } from 'test/values'
import { createFinclusiveBankAccount, exchangePlaidAccessToken } from 'src/in-house-liquidity'
import { Screens } from 'src/navigator/Screens'
import { navigate } from 'src/navigator/NavigationService'
import { Actions } from 'src/account/actions'

const mockPublicToken = 'foo'
const mockAccessToken = 'bar'
const mockError = new Error('some error')

const mockProps = getMockStackScreenProps(Screens.SyncBankAccountScreen, {
  publicToken: mockPublicToken,
})

jest.mock('src/in-house-liquidity', () => ({
  ...(jest.requireActual('src/in-house-liquidity') as any),
  createFinclusiveBankAccount: jest.fn(() => Promise.resolve()),
  exchangePlaidAccessToken: jest.fn(() => Promise.resolve(mockAccessToken)),
}))

jest.mock('src/navigator/NavigationService', () => ({
  __esModule: true,
  namedExport: jest.fn(),
  default: jest.fn(),
  navigate: jest.fn(),
}))

describe('SyncBankAccountScreen', () => {
  const store = createMockStore({
    web3: {
      mtwAddress: mockAccount,
      dataEncryptionKey: mockPrivateDEK,
    },
  })

  beforeEach(() => {
    store.dispatch = jest.fn()
    jest.useRealTimers()
    jest.clearAllMocks()
  })

  it('calls createFinclusiveBankAccount and exchangePlaidAccessToken', async () => {
    const { toJSON } = render(
      <Provider store={store}>
        <SyncBankAccountScreen {...mockProps} />
      </Provider>
    )
    expect(toJSON()).toMatchSnapshot()
    await waitFor(() => {
      expect(exchangePlaidAccessToken).toHaveBeenCalledWith({
        accountMTWAddress: mockAccount,
        publicToken: mockPublicToken,
        dekPrivate: mockPrivateDEK,
      })
      expect(createFinclusiveBankAccount).toHaveBeenCalledWith({
        accountMTWAddress: mockAccount,
        plaidAccessToken: mockAccessToken,
        dekPrivate: mockPrivateDEK,
      })
    })
    expect(store.dispatch).toHaveBeenCalledWith({ type: Actions.SET_HAS_LINKED_BANK_ACCOUNT })
  })

  it('directs to error page when token exchange fails', async () => {
    //@ts-ignore .
    exchangePlaidAccessToken.mockRejectedValue(mockError)

    render(
      <Provider store={store}>
        <SyncBankAccountScreen {...mockProps} />
      </Provider>
    )
    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith(Screens.LinkBankAccountErrorScreen, {
        error: mockError,
      })
    })
  })

  it('directs to error page when create finclusive bank account fails', async () => {
    //@ts-ignore .
    createFinclusiveBankAccount.mockRejectedValue(mockError)

    render(
      <Provider store={store}>
        <SyncBankAccountScreen {...mockProps} />
      </Provider>
    )
    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith(Screens.LinkBankAccountErrorScreen, {
        error: mockError,
      })
    })
  })
})
