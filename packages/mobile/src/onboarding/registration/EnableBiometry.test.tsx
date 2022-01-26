import { NavigationContainer } from '@react-navigation/native'
import { fireEvent, render } from '@testing-library/react-native'
import * as React from 'react'
import { BIOMETRY_TYPE } from 'react-native-keychain'
import { Provider } from 'react-redux'
import { setPincodeSuccess } from 'src/account/actions'
import { PincodeType } from 'src/account/reducer'
import { navigate } from 'src/navigator/NavigationService'
import { Screens } from 'src/navigator/Screens'
import EnableBiometry from 'src/onboarding/registration/EnableBiometry'
import { setPincodeWithBiometry } from 'src/pincode/authentication'
import Logger from 'src/utils/Logger'
import { createMockStore, flushMicrotasksQueue, getMockStackScreenProps } from 'test/utils'
import { mocked } from 'ts-jest/utils'

const mockScreenProps = getMockStackScreenProps(Screens.EnableBiometry)
const mockedSetPincodeWithBiometry = mocked(setPincodeWithBiometry)
const loggerErrorSpy = jest.spyOn(Logger, 'error')

const store = createMockStore({
  app: {
    supportedBiometryType: BIOMETRY_TYPE.FACE_ID,
    biometryEnabled: true,
    activeScreen: Screens.EnableBiometry,
  },
  account: {
    choseToRestoreAccount: false,
  },
})

const renderComponent = () => {
  return render(
    <Provider store={store}>
      <NavigationContainer>
        <EnableBiometry {...mockScreenProps} />
      </NavigationContainer>
    </Provider>
  )
}

describe('EnableBiometry', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    store.clearActions()
  })

  it('should render the correct elements', () => {
    const { getByText, getByTestId } = renderComponent()

    expect(
      getByText('enableBiometry.description, {"biometryType":"biometryType.FaceID"}')
    ).toBeTruthy()
    expect(getByText('enableBiometry.cta, {"biometryType":"biometryType.FaceID"}')).toBeTruthy()
    expect(getByTestId('FaceIDBiometryIcon')).toBeTruthy()
  })

  it('should enable biometry', async () => {
    const { getByText } = renderComponent()

    fireEvent.press(getByText('enableBiometry.cta, {"biometryType":"biometryType.FaceID"}'))
    await flushMicrotasksQueue()

    expect(setPincodeWithBiometry).toHaveBeenCalled()
    expect(store.getActions()).toEqual([setPincodeSuccess(PincodeType.PhoneAuth)])
    expect(navigate).toHaveBeenCalledWith(Screens.VerificationEducationScreen)
  })

  it('should log error and not navigate if biometry enable fails', async () => {
    mockedSetPincodeWithBiometry.mockRejectedValue('some error')
    const { getByText } = renderComponent()

    fireEvent.press(getByText('enableBiometry.cta, {"biometryType":"biometryType.FaceID"}'))
    await flushMicrotasksQueue()

    expect(setPincodeWithBiometry).toHaveBeenCalled()
    expect(store.getActions()).toEqual([])
    expect(navigate).not.toHaveBeenCalled()
    expect(loggerErrorSpy).toHaveBeenCalled()
  })
})
