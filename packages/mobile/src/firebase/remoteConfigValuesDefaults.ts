import { RemoteConfigValues } from 'src/app/saga'
import { SuperchargeButtonType } from 'src/app/types'
import { DEFAULT_SENTRY_NETWORK_ERRORS, DEFAULT_SENTRY_TRACES_SAMPLE_RATE } from 'src/config'

export const REMOTE_CONFIG_VALUES_DEFAULTS: Omit<
  RemoteConfigValues,
  | 'showRaiseDailyLimitTarget'
  | 'celoEducationUri'
  | 'komenciAllowedDeployers'
  | 'dappListApiUrl'
  | 'sentryNetworkErrors'
  | 'superchargeTokens'
> & {
  komenciAllowedDeployers: string
  sentryNetworkErrors: string
  superchargecUSDMin: number
  superchargecUSDMax: number
  superchargecEURMin: number
  superchargecEURMax: number
  superchargecREALMin: number
  superchargecREALMax: number
} = {
  hideVerification: false,
  // cannot set defaults to undefined or null
  // TODO: maybe a better default is '0xf' ?
  // showRaiseDailyLimitTarget: undefined,
  // same here
  // celoEducationUri: null,
  // dappListApiUrl: null,
  celoEuroEnabled: true,
  inviteRewardsEnabled: false,
  inviteRewardCusd: 5,
  inviteRewardWeeklyLimit: 20,
  walletConnectV1Enabled: true,
  walletConnectV2Enabled: false,
  superchargeApy: 25,
  superchargecUSDMin: 10,
  superchargecUSDMax: 1000,
  superchargecEURMin: 10,
  superchargecEURMax: 1000,
  superchargecREALMin: 50,
  superchargecREALMax: 6000,
  komenciUseLightProxy: false,
  komenciAllowedDeployers: '',
  pincodeUseExpandedBlocklist: false,
  rewardPillText: JSON.stringify({
    en: 'Rewards',
    pt: 'Recompensas',
    es: 'Recompensas',
    de: 'Belohnungen',
  }),
  cashInButtonExpEnabled: false,
  rampCashInButtonExpEnabled: false,
  logPhoneNumberTypeEnabled: false,
  multiTokenShowHomeBalances: true,
  multiTokenUseSendFlow: false,
  multiTokenUseUpdatedFeed: false,
  allowOtaTranslations: false,
  linkBankAccountEnabled: false,
  linkBankAccountStepTwoEnabled: false,
  sentryTracesSampleRate: DEFAULT_SENTRY_TRACES_SAMPLE_RATE,
  sentryNetworkErrors: DEFAULT_SENTRY_NETWORK_ERRORS.join(','),
  biometryEnabled: false,
  superchargeButtonType: SuperchargeButtonType.PillRewards,
  maxNumRecentDapps: 0,
  showPriceChangeIndicatorInBalances: false,
}
