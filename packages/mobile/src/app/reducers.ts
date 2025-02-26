import { Platform } from 'react-native'
import { BIOMETRY_TYPE } from 'react-native-keychain'
import { Actions, ActionTypes, AppState } from 'src/app/actions'
import { Dapp, SuperchargeButtonType } from 'src/app/types'
import { SuperchargeTokenConfig } from 'src/consumerIncentives/types'
import { REMOTE_CONFIG_VALUES_DEFAULTS } from 'src/firebase/remoteConfigValuesDefaults'
import { Screens } from 'src/navigator/Screens'
import { getRehydratePayload, REHYDRATE, RehydrateAction } from 'src/redux/persist-helper'

export interface State {
  loggedIn: boolean
  numberVerified: boolean
  analyticsEnabled: boolean
  requirePinOnAppOpen: boolean
  appState: AppState
  locked: boolean
  lastTimeBackgrounded: number
  sessionId: string
  minVersion: string | null
  celoEducationUri: string | null
  celoEuroEnabled: boolean
  dappListApiUrl: string | null
  inviteModalVisible: boolean
  activeScreen: Screens
  hideVerification: boolean
  showRaiseDailyLimitTarget: string | undefined
  walletConnectV1Enabled: boolean
  walletConnectV2Enabled: boolean
  superchargeApy: number
  superchargeTokens: SuperchargeTokenConfig[]
  // In 1.13 we had a critical error which requires a migration to fix. See |verificationMigration.ts|
  // for the migration code. We can remove all the code associated with this after some time has passed.
  ranVerificationMigrationAt: number | null | undefined
  logPhoneNumberTypeEnabled: boolean
  googleMobileServicesAvailable: boolean | undefined
  huaweiMobileServicesAvailable: boolean | undefined
  pincodeUseExpandedBlocklist: boolean
  rewardPillText?: {
    [lang: string]: string
  }
  cashInButtonExpEnabled: boolean
  rampCashInButtonExpEnabled: boolean
  multiTokenShowHomeBalances: boolean
  multiTokenUseSendFlow: boolean
  multiTokenUseUpdatedFeed: boolean
  linkBankAccountEnabled: boolean
  linkBankAccountStepTwoEnabled: boolean
  sentryTracesSampleRate: number
  sentryNetworkErrors: string[]
  supportedBiometryType: BIOMETRY_TYPE | null
  biometryEnabled: boolean
  superchargeButtonType: SuperchargeButtonType
  maxNumRecentDapps: number
  recentDapps: Dapp[]
  showPriceChangeIndicatorInBalances: boolean
}

const initialState = {
  loading: false,
  loggedIn: false,
  numberVerified: false,
  analyticsEnabled: true,
  requirePinOnAppOpen: false,
  appState: AppState.Active,
  locked: false,
  lastTimeBackgrounded: 0,
  sessionId: '',
  minVersion: null,
  celoEducationUri: null,
  celoEuroEnabled: REMOTE_CONFIG_VALUES_DEFAULTS.celoEuroEnabled,
  dappListApiUrl: null,
  inviteModalVisible: false,
  activeScreen: Screens.Main,
  hideVerification: REMOTE_CONFIG_VALUES_DEFAULTS.hideVerification,
  showRaiseDailyLimitTarget: undefined,
  walletConnectV1Enabled: REMOTE_CONFIG_VALUES_DEFAULTS.walletConnectV1Enabled,
  walletConnectV2Enabled: REMOTE_CONFIG_VALUES_DEFAULTS.walletConnectV2Enabled,
  superchargeApy: REMOTE_CONFIG_VALUES_DEFAULTS.superchargeApy,
  superchargeTokens: [],
  ranVerificationMigrationAt: null,
  logPhoneNumberTypeEnabled: REMOTE_CONFIG_VALUES_DEFAULTS.logPhoneNumberTypeEnabled,
  googleMobileServicesAvailable: undefined,
  huaweiMobileServicesAvailable: undefined,
  pincodeUseExpandedBlocklist: REMOTE_CONFIG_VALUES_DEFAULTS.pincodeUseExpandedBlocklist,
  rewardPillText: JSON.parse(REMOTE_CONFIG_VALUES_DEFAULTS.rewardPillText),
  cashInButtonExpEnabled: REMOTE_CONFIG_VALUES_DEFAULTS.cashInButtonExpEnabled,
  rampCashInButtonExpEnabled: REMOTE_CONFIG_VALUES_DEFAULTS.rampCashInButtonExpEnabled,
  multiTokenShowHomeBalances: REMOTE_CONFIG_VALUES_DEFAULTS.multiTokenShowHomeBalances,
  multiTokenUseSendFlow: REMOTE_CONFIG_VALUES_DEFAULTS.multiTokenUseSendFlow,
  multiTokenUseUpdatedFeed: REMOTE_CONFIG_VALUES_DEFAULTS.multiTokenUseUpdatedFeed,
  linkBankAccountEnabled: REMOTE_CONFIG_VALUES_DEFAULTS.linkBankAccountEnabled,
  linkBankAccountStepTwoEnabled: REMOTE_CONFIG_VALUES_DEFAULTS.linkBankAccountStepTwoEnabled,
  sentryTracesSampleRate: REMOTE_CONFIG_VALUES_DEFAULTS.sentryTracesSampleRate,
  sentryNetworkErrors: REMOTE_CONFIG_VALUES_DEFAULTS.sentryNetworkErrors.split(','),
  supportedBiometryType: null,
  biometryEnabled: REMOTE_CONFIG_VALUES_DEFAULTS.biometryEnabled,
  superchargeButtonType: REMOTE_CONFIG_VALUES_DEFAULTS.superchargeButtonType,
  maxNumRecentDapps: REMOTE_CONFIG_VALUES_DEFAULTS.maxNumRecentDapps,
  recentDapps: [],
  showPriceChangeIndicatorInBalances:
    REMOTE_CONFIG_VALUES_DEFAULTS.showPriceChangeIndicatorInBalances,
}

export const appReducer = (
  state: State | undefined = initialState,
  action: ActionTypes | RehydrateAction
): State => {
  switch (action.type) {
    case REHYDRATE: {
      // Ignore some persisted properties
      const rehydratePayload = getRehydratePayload(action, 'app')
      return {
        ...state,
        ...rehydratePayload,
        appState: initialState.appState,
        locked: rehydratePayload.requirePinOnAppOpen ?? initialState.locked,
        sessionId: '',
      }
    }
    case Actions.SET_APP_STATE:
      let { appState, lastTimeBackgrounded } = state
      switch (action.state) {
        case 'background':
          if (Platform.OS === 'android') {
            lastTimeBackgrounded = Date.now()
          }
          appState = AppState.Background
          break
        case 'inactive': // occurs only on iOS
          lastTimeBackgrounded = Date.now()
          appState = AppState.Inactive
          break
        case 'active':
          appState = AppState.Active
          break
      }
      return {
        ...state,
        appState,
        lastTimeBackgrounded,
      }
    case Actions.SET_LOGGED_IN:
      return {
        ...state,
        loggedIn: action.loggedIn,
      }
    case Actions.SET_NUMBER_VERIFIED:
      return {
        ...state,
        numberVerified: action.numberVerified,
      }
    case Actions.RESET_APP_OPENED_STATE:
      return {
        ...state,
        loggedIn: false,
        numberVerified: false,
      }
    case Actions.SET_ANALYTICS_ENABLED:
      return {
        ...state,
        analyticsEnabled: action.enabled,
      }
    case Actions.SET_LOCK_WITH_PIN_ENABLED:
      return {
        ...state,
        requirePinOnAppOpen: action.enabled,
      }
    case Actions.LOCK:
      return {
        ...state,
        locked: true,
      }
    case Actions.UNLOCK:
      return {
        ...state,
        locked: false,
      }
    case Actions.SET_SESSION_ID:
      return {
        ...state,
        sessionId: action.sessionId,
      }
    case Actions.MIN_APP_VERSION_DETERMINED:
      return {
        ...state,
        minVersion: action.minVersion,
      }
    case Actions.UPDATE_REMOTE_CONFIG_VALUES:
      return {
        ...state,
        hideVerification: action.configValues.hideVerification,
        showRaiseDailyLimitTarget: action.configValues.showRaiseDailyLimitTarget,
        celoEducationUri: action.configValues.celoEducationUri,
        celoEuroEnabled: action.configValues.celoEuroEnabled,
        dappListApiUrl: action.configValues.dappListApiUrl,
        walletConnectV1Enabled: action.configValues.walletConnectV1Enabled,
        walletConnectV2Enabled: action.configValues.walletConnectV2Enabled,
        superchargeApy: action.configValues.superchargeApy,
        superchargeTokens: action.configValues.superchargeTokens,
        logPhoneNumberTypeEnabled: action.configValues.logPhoneNumberTypeEnabled,
        pincodeUseExpandedBlocklist: action.configValues.pincodeUseExpandedBlocklist,
        rewardPillText: JSON.parse(action.configValues.rewardPillText),
        cashInButtonExpEnabled: action.configValues.cashInButtonExpEnabled,
        rampCashInButtonExpEnabled: action.configValues.rampCashInButtonExpEnabled,
        multiTokenShowHomeBalances: action.configValues.multiTokenShowHomeBalances,
        multiTokenUseSendFlow: action.configValues.multiTokenUseSendFlow,
        multiTokenUseUpdatedFeed: action.configValues.multiTokenUseUpdatedFeed,
        linkBankAccountEnabled: action.configValues.linkBankAccountEnabled,
        linkBankAccountStepTwoEnabled: action.configValues.linkBankAccountStepTwoEnabled,
        sentryTracesSampleRate: action.configValues.sentryTracesSampleRate,
        sentryNetworkErrors: action.configValues.sentryNetworkErrors,
        biometryEnabled: action.configValues.biometryEnabled && Platform.OS === 'ios',
        superchargeButtonType: action.configValues.superchargeButtonType,
        maxNumRecentDapps: action.configValues.maxNumRecentDapps,
        showPriceChangeIndicatorInBalances: action.configValues.showPriceChangeIndicatorInBalances,
      }
    case Actions.TOGGLE_INVITE_MODAL:
      return {
        ...state,
        inviteModalVisible: action.inviteModalVisible,
      }
    case Actions.ACTIVE_SCREEN_CHANGED:
      return {
        ...state,
        activeScreen: action.activeScreen,
      }
    case Actions.VERIFICATION_MIGRATION_RAN:
      return {
        ...state,
        ranVerificationMigrationAt: action.now,
        numberVerified: action.isVerified,
      }
    case Actions.ANDROID_MOBILE_SERVICES_AVAILABILITY_CHECKED:
      return {
        ...state,
        googleMobileServicesAvailable: action.googleIsAvailable,
        huaweiMobileServicesAvailable: action.huaweiIsAvailable,
      }
    case Actions.SET_SUPPORTED_BIOMETRY_TYPE:
      return {
        ...state,
        supportedBiometryType: action.supportedBiometryType,
      }
    case Actions.DAPP_SELECTED:
      return {
        ...state,
        recentDapps: [
          action.dapp,
          ...state.recentDapps.filter((recentDapp) => recentDapp.id !== action.dapp.id),
        ].slice(0, state.maxNumRecentDapps),
      }
    default:
      return state
  }
}
