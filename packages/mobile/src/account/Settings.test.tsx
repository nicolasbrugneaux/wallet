import { fireEvent, render } from '@testing-library/react-native'
import * as React from 'react'
import 'react-native'
import { BIOMETRY_TYPE } from 'react-native-keychain'
import { Provider } from 'react-redux'
import { setPincodeSuccess } from 'src/account/actions'
import { KycStatus, PincodeType } from 'src/account/reducer'
import Settings from 'src/account/Settings'
import { SettingsEvents } from 'src/analytics/Events'
import ValoraAnalytics from 'src/analytics/ValoraAnalytics'
import { ensurePincode, navigate } from 'src/navigator/NavigationService'
import { Screens } from 'src/navigator/Screens'
import { removeStoredPin, setPincodeWithBiometry } from 'src/pincode/authentication'
import { Currency } from 'src/utils/currencies'
import { KomenciAvailable } from 'src/verify/reducer'
import { createMockStore, flushMicrotasksQueue, getMockStackScreenProps } from 'test/utils'
import { mockAccount, mockE164Number, mockE164NumberPepper } from 'test/values'

const mockedEnsurePincode = ensurePincode as jest.Mock

jest.mock('src/analytics/ValoraAnalytics')

describe('Account', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  beforeAll(() => {
    jest.useFakeTimers()
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  it('renders correctly', () => {
    const tree = render(
      <Provider
        store={createMockStore({
          account: {
            e164PhoneNumber: mockE164Number,
          },
          identity: { e164NumberToSalt: { [mockE164Number]: mockE164NumberPepper } },
          stableToken: { balances: { [Currency.Dollar]: '0.00' } },
          goldToken: { balance: '0.00' },
          verify: {
            komenciAvailable: KomenciAvailable.Yes,
            komenci: { errorTimestamps: [] },
            status: {},
          },
        })}
      >
        <Settings {...getMockStackScreenProps(Screens.Settings)} />
      </Provider>
    )
    expect(tree).toMatchSnapshot()
  })

  it('renders correctly when dev mode active', () => {
    const tree = render(
      <Provider
        store={createMockStore({
          identity: { e164NumberToSalt: { [mockE164Number]: mockE164NumberPepper } },
          stableToken: { balances: { [Currency.Dollar]: '0.00' } },
          goldToken: { balance: '0.00' },
          account: {
            devModeActive: true,
            e164PhoneNumber: mockE164Number,
          },
          verify: {
            komenci: { errorTimestamps: [] },
            komenciAvailable: KomenciAvailable.Yes,
            status: {},
          },
        })}
      >
        <Settings {...getMockStackScreenProps(Screens.Settings)} />
      </Provider>
    )
    expect(tree).toMatchSnapshot()
  })
  it('renders correctly when verification is not possible', () => {
    const now = Date.now()
    let tree = render(
      <Provider
        store={createMockStore({
          verify: { komenci: { errorTimestamps: [] }, status: {} },
        })}
      >
        <Settings {...getMockStackScreenProps(Screens.Settings)} />
      </Provider>
    )
    expect(tree).toMatchSnapshot()
    tree = render(
      <Provider
        store={createMockStore({
          verify: {
            komenciAvailable: KomenciAvailable.Yes,
            komenci: { errorTimestamps: [now, now, now] },
            status: {},
          },
        })}
      >
        <Settings {...getMockStackScreenProps(Screens.Settings)} />
      </Provider>
    )
    expect(tree).toMatchSnapshot()
  })

  it('navigates to PincodeSet screen if entered PIN is correct', async () => {
    const tree = render(
      <Provider store={createMockStore({})}>
        <Settings {...getMockStackScreenProps(Screens.Settings)} />
      </Provider>
    )
    mockedEnsurePincode.mockImplementation(() => Promise.resolve(true))
    fireEvent.press(tree.getByTestId('ChangePIN'))
    await flushMicrotasksQueue()
    expect(navigate).toHaveBeenCalledWith(Screens.PincodeSet, {
      isVerifying: false,
      changePin: true,
    })
  })

  it('does not navigate to PincodeSet screen if entered PIN is incorrect', async () => {
    const tree = render(
      <Provider store={createMockStore({})}>
        <Settings {...getMockStackScreenProps(Screens.Settings)} />
      </Provider>
    )
    mockedEnsurePincode.mockImplementation(() => Promise.resolve(false))
    fireEvent.press(tree.getByTestId('ChangePIN'))
    await flushMicrotasksQueue()
    expect(navigate).not.toHaveBeenCalled()
  })

  it('navigate to connect phone number screen if mtwAddress is not present', async () => {
    const tree = render(
      <Provider
        store={createMockStore({
          app: {
            linkBankAccountEnabled: true,
          },
        })}
      >
        <Settings {...getMockStackScreenProps(Screens.Settings)} />
      </Provider>
    )

    fireEvent.press(tree.getByTestId('linkBankAccountSettings'))
    expect(navigate).toHaveBeenCalledWith(Screens.ConnectPhoneNumberScreen)
    expect(ValoraAnalytics.track).toHaveBeenCalledWith(SettingsEvents.settings_number_not_connected)
  })

  it('navigate to LinkBankAccount screen with kycStatus', async () => {
    const tree = render(
      <Provider
        store={createMockStore({
          account: {
            e164PhoneNumber: mockE164Number,
            kycStatus: KycStatus.Completed,
          },
          identity: { e164NumberToSalt: { [mockE164Number]: mockE164NumberPepper } },
          stableToken: { balances: { [Currency.Dollar]: '0.00' } },
          goldToken: { balance: '0.00' },
          verify: {
            komenciAvailable: KomenciAvailable.Yes,
            komenci: { errorTimestamps: [] },
            status: {},
          },
          app: {
            linkBankAccountEnabled: true,
          },
          web3: {
            mtwAddress: mockAccount,
          },
        })}
      >
        <Settings {...getMockStackScreenProps(Screens.Settings)} />
      </Provider>
    )

    fireEvent.press(tree.getByTestId('linkBankAccountSettings'))
    expect(navigate).toHaveBeenCalledWith(Screens.LinkBankAccountScreen, {
      kycStatus: KycStatus.Completed,
    })
    expect(ValoraAnalytics.track).toHaveBeenCalledWith(SettingsEvents.settings_link_bank_account)
  })

  it('toggle the biometry option correctly', async () => {
    const store = createMockStore({
      app: {
        supportedBiometryType: BIOMETRY_TYPE.FACE_ID,
        biometryEnabled: true,
      },
      account: {
        pincodeType: PincodeType.CustomPin,
      },
    })
    const { getByText, getByTestId } = render(
      <Provider store={store}>
        <Settings {...getMockStackScreenProps(Screens.Settings)} />
      </Provider>
    )

    fireEvent(getByTestId('useBiometryToggle'), 'valueChange', true)
    await flushMicrotasksQueue()

    expect(getByText('useBiometryType, {"biometryType":"biometryType.FaceID"}')).toBeTruthy()
    expect(setPincodeWithBiometry).toHaveBeenCalledTimes(1)
    expect(store.getActions()).toEqual(
      expect.arrayContaining([setPincodeSuccess(PincodeType.PhoneAuth)])
    )
    expect(ValoraAnalytics.track).toHaveBeenCalledWith(
      SettingsEvents.settings_biometric_verification_approve
    )
    expect(ValoraAnalytics.track).toHaveBeenCalledWith(
      SettingsEvents.settings_biometric_verification_complete
    )

    fireEvent(getByTestId('useBiometryToggle'), 'valueChange', false)
    await flushMicrotasksQueue()

    expect(removeStoredPin).toHaveBeenCalledTimes(1)
    expect(store.getActions()).toEqual(
      expect.arrayContaining([setPincodeSuccess(PincodeType.CustomPin)])
    )
    expect(ValoraAnalytics.track).toHaveBeenCalledWith(
      SettingsEvents.settings_biometric_verification_disable
    )
  })
})
