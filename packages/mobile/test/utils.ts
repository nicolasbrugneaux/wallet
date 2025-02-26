/* Utilities to facilitate testing */
import { StackScreenProps } from '@react-navigation/stack'
import BigNumber from 'bignumber.js'
import { ReactTestInstance } from 'react-test-renderer'
import configureMockStore from 'redux-mock-store'
import { InitializationState } from 'src/geth/reducer'
import i18n from 'src/i18n'
import { StackParamList } from 'src/navigator/types'
import { RootState } from 'src/redux/reducers'
import { getLatestSchema } from 'test/schemas'
import {
  mockAddressToE164Number,
  mockContractAddress,
  mockE164NumberToAddress,
  mockNavigation,
  mockPhoneRecipientCache,
  mockValoraRecipientCache,
} from 'test/values'

beforeAll(() => {
  // @ts-ignore This avoids an error, see: https://github.com/software-mansion/react-native-reanimated/issues/1380
  global.__reanimatedWorkletInit = jest.fn()
})

// Sleep for a number of ms
export const sleep = (time: number) =>
  new Promise((resolve) => setTimeout(() => resolve(true), time))

// ContractKit test utils
export const mockContractKitBalance = jest.fn(() => new BigNumber(10))
export const mockContractKitContract = {
  balanceOf: mockContractKitBalance,
  decimals: jest.fn(async () => '10'),
  transferWithComment: jest.fn(async () => '10'),
}

interface MockContract {
  methods: {
    [methodName: string]: MockMethod
  }
  options: {
    address: string
  }
}

type MockMethod = (
  ...params: any
) => { call: () => any; estimateGas: () => number; send: SendMethod }
type SendMethod = (...params: any) => { on: (...params: any) => any }

/**
 * Create a mock contract
 * @param methods object
 */
export function createMockContract(methods: { [methodName: string]: any }) {
  const contract: MockContract = {
    methods: {},
    options: {
      address: mockContractAddress,
    },
  }
  for (const methodName of Object.keys(methods)) {
    const callResult = methods[methodName]
    contract.methods[methodName] = createMockMethod(callResult)
  }
  return contract
}

function createMockMethod(callResult: any): MockMethod {
  return jest.fn(() => ({
    call: jest.fn(() => (typeof callResult === 'function' ? callResult() : callResult)),
    estimateGas: jest.fn(() => 10000),
    send: createSendMethod(),
  }))
}

function createSendMethod(): SendMethod {
  return jest.fn(() => ({
    on: createSendMethod(),
  }))
}

const mockStore = configureMockStore<RootState>()

/* Create a mock store with some reasonable default values */
export type RecursivePartial<T> = { [P in keyof T]?: RecursivePartial<T[P]> }
export function createMockStore(overrides: RecursivePartial<RootState> = {}) {
  return mockStore(getMockStoreData(overrides))
}

export function getMockStoreData(overrides: RecursivePartial<RootState> = {}): RootState {
  const defaultSchema = getLatestSchema()
  const appConnectedData = {
    geth: { ...defaultSchema.geth, initialized: InitializationState.INITIALIZED, connected: true },
  }
  const contactMappingData = {
    identity: {
      ...defaultSchema.identity,
      addressToE164Number: mockAddressToE164Number,
      e164NumberToAddress: mockE164NumberToAddress,
    },
  }
  const recipientData = {
    recipients: {
      ...defaultSchema.recipients,
      phoneRecipientCache: mockPhoneRecipientCache,
      valoraRecipientCache: mockValoraRecipientCache,
    },
  }
  const mockStoreData: any = {
    ...defaultSchema,
    ...appConnectedData,
    ...contactMappingData,
    ...recipientData,
  }

  // Apply overrides. Note: only merges one level deep
  for (const key of Object.keys(overrides)) {
    // @ts-ignore
    mockStoreData[key] = { ...mockStoreData[key], ...overrides[key] }
  }

  return mockStoreData
}

export function createMockStoreAppDisconnected() {
  return createMockStore({
    geth: {
      initialized: InitializationState.INITIALIZED,
      connected: false,
    },
    networkInfo: { connected: false },
  })
}

export function getMockI18nProps() {
  return {
    i18n,
    t: i18n.t,
    tReady: true,
  }
}

export function getMockStackScreenProps<RouteName extends keyof StackParamList>(
  ...args: undefined extends StackParamList[RouteName]
    ? [RouteName] | [RouteName, StackParamList[RouteName]]
    : [RouteName, StackParamList[RouteName]]
): StackScreenProps<StackParamList, RouteName> {
  const [name, params] = args
  return {
    navigation: mockNavigation,
    // @ts-ignore
    route: {
      key: '1',
      name,
      params,
    },
  }
}

export function getElementText(instance: ReactTestInstance | string): string {
  if (typeof instance === 'string') {
    return instance
  }
  return instance.children
    .map((child) => {
      return getElementText(child)
    })
    .join('')
}

// Implementation of deprecated flushMicrotasksQueue function from @testing-library/react-native
// https://callstack.github.io/react-native-testing-library/docs/migration-v2/#deprecated-flushmicrotasksqueue
export function flushMicrotasksQueue() {
  return new Promise((resolve) => setImmediate(resolve))
}
