import firebase from '@react-native-firebase/app'
import { expectSaga } from 'redux-saga-test-plan'
import { throwError } from 'redux-saga-test-plan/providers'
import { call, select } from 'redux-saga/effects'
import { initializeCloudMessaging, setRegistrationProperties } from 'src/firebase/firebase'
import { currentLanguageSelector } from 'src/i18n/selectors'
import { mockAccount2 } from 'test/values'

const hasPermissionMock = jest.fn(() => null)
const requestPermissionMock = jest.fn(() => null)
const registerDeviceForRemoteMessagesMock = jest.fn(() => null)
const getTokenMock = jest.fn(() => null)
const onTokenRefreshMock = jest.fn(() => null)
const onMessageMock = jest.fn(() => null)
const onNotificationOpenedAppMock = jest.fn(() => null)
const getInitialNotificationMock = jest.fn(() => null)
const setBackgroundMessageHandler = jest.fn(() => null)

const address = mockAccount2
const mockFcmToken = 'token'

const app: any = {
  messaging: () => ({
    hasPermission: hasPermissionMock,
    requestPermission: requestPermissionMock,
    registerDeviceForRemoteMessages: registerDeviceForRemoteMessagesMock,
    getToken: getTokenMock,
    onTokenRefresh: onTokenRefreshMock,
    setBackgroundMessageHandler,
    onMessage: onMessageMock,
    onNotificationOpenedApp: onNotificationOpenedAppMock,
    getInitialNotification: getInitialNotificationMock,
  }),
}

describe(initializeCloudMessaging, () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it("Firebase doesn't have permission", async () => {
    const errorToRaise = new Error('No permission')
    let catchedError

    await expectSaga(initializeCloudMessaging, app, address)
      .provide([
        [
          call([app.messaging(), 'hasPermission']),
          firebase.messaging.AuthorizationStatus.NOT_DETERMINED,
        ],
        [call([app.messaging(), 'requestPermission']), throwError(errorToRaise)],
        {
          spawn(effect, next) {
            // mock all spawns
            return
          },
        },
      ])
      .run()
      .catch((error: Error) => {
        catchedError = error
      })

    expect(errorToRaise).toEqual(catchedError)
  })

  it('Firebase has permission', async () => {
    const mockLanguage = 'en_US'
    await expectSaga(initializeCloudMessaging, app, address)
      .provide([
        [call([app.messaging(), 'hasPermission']), true],
        [call([app.messaging(), 'getToken']), mockFcmToken],
        [
          call(setRegistrationProperties, address, {
            fcmToken: mockFcmToken,
            appVersion: '0.0.1',
            language: mockLanguage,
          }),
          null,
        ],
        [select(currentLanguageSelector), mockLanguage],
        {
          spawn(effect, next) {
            // mock all spawns
            return
          },
        },
      ])
      .call(setRegistrationProperties, address, {
        fcmToken: mockFcmToken,
        appVersion: '0.0.1',
        language: mockLanguage,
      })
      .run()
  })
})
