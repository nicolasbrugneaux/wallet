import { enterPinUi, waitForElementId, sleep } from '../utils/utils'
import { SAMPLE_BACKUP_KEY, EXAMPLE_NAME } from '../utils/consts'
import { dismissBanners } from '../utils/banners'
import { launchApp } from '../utils/retries'

export default RestoreAccountOnboarding = () => {
  beforeAll(async () => {
    await device.terminateApp()
    await sleep(5000)
    await launchApp({
      delete: true,
      permissions: { notifications: 'YES', contacts: 'YES' },
    })
    await sleep(5000)
    await dismissBanners()
  })
  // Language is auto selected if it matches one of the available locale
  // it('Language', async () => {
  //   await element(by.id('ChooseLanguage/en-US')).tap()
  // })

  it('Welcome', async () => {
    await element(by.id('RestoreAccountButton')).tap()
  })

  it('Terms', async () => {
    await element(by.id('scrollView')).scrollTo('bottom')
    await expect(element(by.id('AcceptTermsButton'))).toBeVisible()
    await element(by.id('AcceptTermsButton')).tap()
  })

  it('Name and Picture', async () => {
    await element(by.id('NameEntry')).replaceText(EXAMPLE_NAME)
    await element(by.id('NameAndPictureContinueButton')).tap()
  })

  it('Pin', async () => {
    // Set pin
    await enterPinUi()
    // Verify pin
    await enterPinUi()
  })

  // TODO(erdal) 2 new paths: using invite code, continue without
  // TODO(erdal) get rid of sleeps if possible to make the tests faster

  // Restore existing wallet
  it('Restore Wallet Backup', async () => {
    // wait for connecting banner to go away
    // TODO measure how long this take
    await waitFor(element(by.id('connectingToCelo')))
      .not.toBeVisible()
      .withTimeout(20000)

    await element(by.id('ImportWalletBackupKeyInputField')).tap()
    await element(by.id('ImportWalletBackupKeyInputField')).replaceText(`${SAMPLE_BACKUP_KEY}`)
    if (device.getPlatform() === 'ios') {
      // On iOS, type one more space to workaround onChangeText not being triggered with replaceText above
      // and leaving the restore button disabled
      await element(by.id('ImportWalletBackupKeyInputField')).typeText('\n')
    } else if (device.getPlatform() === 'android') {
      // Press back button to close the keyboard
      await device.pressBack()
    }

    await waitFor(element(by.id('ImportWalletButton')))
      .toBeVisible()
      .withTimeout(1000 * 5)
    await element(by.id('ImportWalletButton')).tap()

    // Wait a little more as import can take some time
    // and triggers the firebase error banner
    // otherwise next step will tap the banner instead of the button
    await dismissBanners()
  })

  it('Verify Education', async () => {
    await waitForElementId('VerificationEducationSkipHeader')

    // skip
    await element(by.id('VerificationEducationSkipHeader')).tap()
    // confirmation popup skip
    await element(by.id('VerificationSkipDialog/PrimaryAction')).tap()
  })

  it('Wallet Home', async () => {
    await expect(element(by.id('SendOrRequestBar'))).toBeVisible()
  })

  // TODO(erdal): generate a new invite
}
