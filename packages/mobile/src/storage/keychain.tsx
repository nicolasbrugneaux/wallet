import * as Keychain from 'react-native-keychain'
import { ErrorMessages } from 'src/app/ErrorMessages'
import Logger from 'src/utils/Logger'

const TAG = 'storage/keychain'

interface SecureStorage {
  key: string
  value: string
  options?: Keychain.Options
}

export async function storeItem({ key, value, options = {} }: SecureStorage) {
  try {
    const result = await Keychain.setGenericPassword('CELO', value, {
      service: key,
      accessible: Keychain.ACCESSIBLE.ALWAYS_THIS_DEVICE_ONLY,
      rules: Keychain.SECURITY_RULES.NONE,
      ...options,
    })
    if (result === false) {
      throw new Error('Store result false')
    }
    return result
  } catch (error) {
    Logger.error(TAG, 'Error storing item', error, true, value)
    throw new Error(ErrorMessages.KEYCHAIN_STORAGE_ERROR)
  }
}

export async function retrieveStoredItem(key: string, options: Keychain.Options = {}) {
  try {
    const item = await Keychain.getGenericPassword({
      service: key,
      ...options,
    })
    if (!item) {
      return null
    }
    return item.password
  } catch (error) {
    Logger.error(TAG, 'Error retrieving stored item', error, true)
    throw new Error(ErrorMessages.KEYCHAIN_STORAGE_ERROR)
  }
}

export async function removeStoredItem(key: string) {
  try {
    return Keychain.resetGenericPassword({
      service: key,
    })
  } catch (error) {
    Logger.error(TAG, 'Error clearing item', error, true)
    throw new Error(ErrorMessages.KEYCHAIN_STORAGE_ERROR)
  }
}
