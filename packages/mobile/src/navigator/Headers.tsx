import Times from '@celo/react-components/icons/Times'
import colors from '@celo/react-components/styles/colors'
import fontStyles from '@celo/react-components/styles/fonts'
import variables from '@celo/react-components/styles/variables'
import { StackNavigationOptions } from '@react-navigation/stack'
import * as React from 'react'
import { Trans } from 'react-i18next'
import { PixelRatio, Platform, StyleSheet, Text, View } from 'react-native'
import BackButton from 'src/components/BackButton'
import CancelButton from 'src/components/CancelButton'
import CurrencyDisplay from 'src/components/CurrencyDisplay'
import TokenDisplay from 'src/components/TokenDisplay'
import i18n from 'src/i18n'
import { navigateBack } from 'src/navigator/NavigationService'
import { TopBarIconButton } from 'src/navigator/TopBarButton'
import DisconnectBanner from 'src/shared/DisconnectBanner'
import { useBalance } from 'src/stableToken/hooks'
import { useTokenInfo } from 'src/tokens/hooks'
import { Currency } from 'src/utils/currencies'

export const noHeader: StackNavigationOptions = {
  headerShown: false,
}

export const noHeaderGestureDisabled: StackNavigationOptions = {
  headerShown: false,
  gestureEnabled: false,
}

export const styles = StyleSheet.create({
  headerTitle: {
    ...fontStyles.navigationHeader,
  },
  headerSubTitle: {
    color: colors.gray4,
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  screenHeader: {
    textAlign: 'center',
    fontWeight: undefined,
  },
})

export const nuxNavigationOptions: StackNavigationOptions = {
  headerShown: true,
  headerTransparent: true,
  headerLeft: ({ canGoBack }) => (canGoBack ? <BackButton /> : <View />),
  headerRight: () => <View />,
  headerTitle: () => <DisconnectBanner />,
  headerTitleContainerStyle: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  headerStyle: {
    backgroundColor: colors.light,
  },
}

export const nuxNavigationOptionsNoBackButton: StackNavigationOptions = {
  ...nuxNavigationOptions,
  headerLeft: () => <View />,
}

export const emptyHeader: StackNavigationOptions = {
  headerTitle: ' ',
  headerShown: true,
  headerTitleStyle: [styles.headerTitle, styles.screenHeader],
  headerTitleContainerStyle: {
    alignItems: 'center',
  },
  headerTitleAlign: 'center',
  cardStyle: { backgroundColor: colors.light },
  headerStyle: {
    backgroundColor: colors.light,
    shadowRadius: 0,
    shadowOffset: {
      height: 0,
      width: 0,
    },
    ...Platform.select({
      android: {
        elevation: 0,
        backgroundColor: 'transparent',
      },
      ios: {
        borderBottomWidth: 0,
        borderBottomColor: 'transparent',
      },
    }),
  },
}

export const drawerHeader: StackNavigationOptions = {
  ...emptyHeader,
}

export const headerWithBackButton: StackNavigationOptions = {
  ...emptyHeader,
  headerLeft: ({ canGoBack }) => (canGoBack ? <BackButton /> : null),
}

export const headerWithCancelButton: StackNavigationOptions = {
  ...emptyHeader,
  headerLeft: () => <CancelButton />,
}

export const headerWithBackEditButtons: StackNavigationOptions = {
  ...emptyHeader,
  headerLeft: () =>
    PixelRatio.getFontScale() > 1 ? (
      <CancelButton buttonType="icon" />
    ) : (
      <CancelButton buttonType="text" />
    ),
  headerRight: () => <BackButton />,
  headerRightContainerStyle: { paddingRight: variables.contentPadding + 6 },
}

export const headerWithCloseButton: StackNavigationOptions = {
  ...emptyHeader,
  headerLeft: () => <TopBarIconButton icon={<Times />} onPress={navigateBack} />,
  headerLeftContainerStyle: { paddingLeft: 20 },
}

interface Props {
  title: string | JSX.Element
  token: Currency
  switchTitleAndSubtitle?: boolean
}

export function HeaderTitleWithBalance({ title, token, switchTitleAndSubtitle = false }: Props) {
  const balance = useBalance(token)

  const subTitle =
    balance != null ? (
      <Trans i18nKey="balanceAvailable">
        <CurrencyDisplay
          style={switchTitleAndSubtitle ? styles.headerTitle : styles.headerSubTitle}
          amount={{
            value: balance,
            currencyCode: token,
          }}
        />
      </Trans>
    ) : (
      // TODO: a null balance doesn't necessarily mean it's loading
      i18n.t('loading')
    )

  return (
    <HeaderTitleWithSubtitle
      title={switchTitleAndSubtitle ? subTitle : title}
      subTitle={switchTitleAndSubtitle ? title : subTitle}
    />
  )
}

interface TokenBalanceProps {
  title: string | JSX.Element
  token: string
}

export function HeaderTitleWithTokenBalance({ title, token }: TokenBalanceProps) {
  const tokenInfo = useTokenInfo(token)

  const subTitle = tokenInfo ? (
    <Trans i18nKey="balanceAvailable">
      <TokenDisplay
        style={styles.headerSubTitle}
        tokenAddress={token}
        amount={tokenInfo.balance}
        showLocalAmount={!!tokenInfo?.usdPrice}
      />
    </Trans>
  ) : (
    '-'
  )

  return <HeaderTitleWithSubtitle title={title} subTitle={subTitle} />
}

export function HeaderTitleWithSubtitle({
  testID,
  title,
  subTitle,
}: {
  testID?: string
  title: string | JSX.Element
  subTitle?: string | JSX.Element
}) {
  return (
    <View style={styles.header}>
      {title && <Text style={styles.headerTitle}>{title}</Text>}
      {subTitle && <Text style={styles.headerSubTitle}>{subTitle}</Text>}
    </View>
  )
}

HeaderTitleWithBalance.defaultProps = {
  token: Currency.Dollar,
}
