import Button, { BtnSizes, BtnTypes } from '@celo/react-components/components/Button'
import Switch from '@celo/react-components/components/Switch'
import colors from '@celo/react-components/styles/colors'
import fontStyles from '@celo/react-components/styles/fonts'
import { StackScreenProps } from '@react-navigation/stack'
import * as React from 'react'
import { useTranslation, WithTranslation } from 'react-i18next'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { connect } from 'react-redux'
import { hideAlert, showError } from 'src/alert/actions'
import { OnboardingEvents } from 'src/analytics/Events'
import ValoraAnalytics from 'src/analytics/ValoraAnalytics'
import BackupPhraseContainer, {
  BackupPhraseContainerMode,
  BackupPhraseType,
} from 'src/backup/BackupPhraseContainer'
import CancelConfirm from 'src/backup/CancelConfirm'
import { getStoredMnemonic, onGetMnemonicFail } from 'src/backup/utils'
import CancelButton from 'src/components/CancelButton'
import { withTranslation } from 'src/i18n'
import { navigate, pushToStack } from 'src/navigator/NavigationService'
import { Screens } from 'src/navigator/Screens'
import { TopBarTextButton } from 'src/navigator/TopBarButton'
import { StackParamList } from 'src/navigator/types'
import { RootState } from 'src/redux/reducers'
import { currentAccountSelector } from 'src/web3/selectors'

const TAG = 'backup/BackupPhrase'

interface State {
  mnemonic: string
  isConfirmChecked: boolean
}

interface StateProps {
  account: string | null
  backupCompleted: boolean
}

interface DispatchProps {
  showError: typeof showError
  hideAlert: typeof hideAlert
}

type Props = StateProps &
  DispatchProps &
  WithTranslation &
  StackScreenProps<StackParamList, Screens.BackupPhrase>

const mapStateToProps = (state: RootState): StateProps => {
  return {
    account: currentAccountSelector(state),
    backupCompleted: state.account.backupCompleted,
  }
}

export const navOptionsForBackupPhrase = ({
  route,
}: StackScreenProps<StackParamList, Screens.BackupPhrase>) => {
  const navigatedFromSettings = route.params?.navigatedFromSettings
  return {
    headerLeft: () => {
      return navigatedFromSettings ? (
        <CancelButton style={styles.cancelButton} />
      ) : (
        <CancelConfirm screen={TAG} />
      )
    },
    headerRight: () => <HeaderRight />,
  }
}

class BackupPhrase extends React.Component<Props, State> {
  state = {
    mnemonic: '',
    isConfirmChecked: false,
  }

  async componentDidMount() {
    await this.retrieveMnemonic()
  }

  componentWillUnmount() {
    this.props.hideAlert()
  }

  retrieveMnemonic = async () => {
    if (this.state.mnemonic) {
      return
    }
    const mnemonic = await getStoredMnemonic(this.props.account)

    if (mnemonic) {
      this.setState({ mnemonic })
    } else {
      onGetMnemonicFail(this.props.showError, 'BackupPhrase')
    }
  }

  onPressConfirmSwitch = (value: boolean) => {
    this.setState({
      isConfirmChecked: value,
    })
  }

  onPressConfirmArea = () => {
    this.onPressConfirmSwitch(!this.state.isConfirmChecked)
  }

  onPressContinue = () => {
    ValoraAnalytics.track(OnboardingEvents.backup_continue)
    navigate(Screens.BackupQuiz, { navigatedFromSettings: this.navigatedFromSettings() })
  }

  navigatedFromSettings = () => {
    return this.props.route.params?.navigatedFromSettings ?? false
  }

  render() {
    const { t, backupCompleted } = this.props
    const { mnemonic, isConfirmChecked } = this.state
    const navigatedFromSettings = this.navigatedFromSettings()
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <BackupPhraseContainer
            value={mnemonic}
            mode={BackupPhraseContainerMode.READONLY}
            type={BackupPhraseType.BACKUP_KEY}
          />
          <Text style={styles.body}>{t('backupKeySummary')}</Text>
        </ScrollView>
        {(!backupCompleted || navigatedFromSettings) && (
          <>
            <View style={styles.confirmationSwitchContainer}>
              <Switch
                value={isConfirmChecked}
                onValueChange={this.onPressConfirmSwitch}
                testID="backupKeySavedSwitch"
              />
              <Text onPress={this.onPressConfirmArea} style={styles.confirmationSwitchLabel}>
                {t('savedConfirmation')}
              </Text>
            </View>
            <Button
              disabled={!isConfirmChecked}
              onPress={this.onPressContinue}
              text={t('continue')}
              size={BtnSizes.FULL}
              type={BtnTypes.SECONDARY}
              testID="backupKeyContinue"
            />
          </>
        )}
      </SafeAreaView>
    )
  }
}

function HeaderRight() {
  const { t } = useTranslation()
  const onMoreInfoPressed = () => {
    ValoraAnalytics.track(OnboardingEvents.backup_more_info)
    pushToStack(Screens.AccountKeyEducation)
  }
  return <TopBarTextButton onPress={onMoreInfoPressed} title={t('moreInfo')} />
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 16,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 16,
  },
  body: {
    ...fontStyles.regular,
    marginTop: 16,
  },
  confirmationSwitchContainer: {
    marginVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  confirmationSwitchLabel: {
    flex: 1,
    ...fontStyles.regular,
    paddingLeft: 8,
  },
  cancelButton: {
    color: colors.gray4,
  },
})

export default connect<StateProps, DispatchProps, {}, RootState>(mapStateToProps, {
  showError,
  hideAlert,
})(withTranslation<Props>()(BackupPhrase))
