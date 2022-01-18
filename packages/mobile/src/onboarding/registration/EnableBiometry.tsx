import Button, { BtnSizes, BtnTypes } from '@celo/react-components/components/Button'
import colors from '@celo/react-components/styles/colors'
import fontStyles from '@celo/react-components/styles/fonts'
import { Spacing } from '@celo/react-components/styles/styles'
import { StackScreenProps } from '@react-navigation/stack'
import React, { useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import * as Keychain from 'react-native-keychain'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useDispatch } from 'react-redux'
import { setUseBiometry } from 'src/app/actions'
import { supportedBiometryTypeSelector } from 'src/app/selectors'
import { HeaderTitleWithSubtitle, nuxNavigationOptions } from 'src/navigator/Headers'
import { navigateHome } from 'src/navigator/NavigationService'
import { Screens } from 'src/navigator/Screens'
import { TopBarTextButton } from 'src/navigator/TopBarButton'
import { StackParamList } from 'src/navigator/types'
import useRegistrationStep from 'src/onboarding/registration/useRegistrationStep'
import { setPincodeWithBiometrics } from 'src/pincode/authentication'
import { default as useSelector } from 'src/redux/useSelector'
import Svg, { Path } from 'svgs'

type Props = StackScreenProps<StackParamList, Screens.EnableBiometry>

const biometryImageMap: { [key in Keychain.BIOMETRY_TYPE]: JSX.Element } = {
  [Keychain.BIOMETRY_TYPE.FACE_ID]: <FaceIDImage />,
  [Keychain.BIOMETRY_TYPE.TOUCH_ID]: <TouchIDImage />,
  [Keychain.BIOMETRY_TYPE.FINGERPRINT]: <FingerprintImage />,
  [Keychain.BIOMETRY_TYPE.FACE]: <FaceImage />,
  [Keychain.BIOMETRY_TYPE.IRIS]: <FaceImage />,
}

const biometryButtonLabelMap: { [key in Keychain.BIOMETRY_TYPE]: string } = {
  [Keychain.BIOMETRY_TYPE.FACE_ID]: 'enableBiometry.cta.useFaceId',
  [Keychain.BIOMETRY_TYPE.TOUCH_ID]: 'enableBiometry.cta.useTouchId',
  [Keychain.BIOMETRY_TYPE.FINGERPRINT]: 'enableBiometry.cta.useFingerprint',
  [Keychain.BIOMETRY_TYPE.FACE]: 'enableBiometry.cta.useFace',
  [Keychain.BIOMETRY_TYPE.IRIS]: 'enableBiometry.cta.useIris',
}

export default function EnableBiometry({ navigation, route }: Props) {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const choseToRestoreAccount = useSelector((state) => state.account.choseToRestoreAccount)
  // This screen would not be displayed if supportedBiometryType were null
  const supportedBiometryType = useSelector(supportedBiometryTypeSelector)
  const registrationStep = useRegistrationStep(choseToRestoreAccount ? 5 : 4)

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <HeaderTitleWithSubtitle title={t('enableBiometry.title')} subTitle={registrationStep} />
      ),
      headerRight: () => (
        <TopBarTextButton
          title={t('skip')}
          testID="EnableBiometrySkipHeader"
          onPress={navigateHome}
          titleStyle={{ color: colors.goldDark }}
        />
      ),
    })
  }, [navigation])

  const onPressUseBiometry = async () => {
    await setPincodeWithBiometrics()
    // TODO handle error
    dispatch(setUseBiometry(true))
    navigateHome()
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.imageContainer}>{biometryImageMap[supportedBiometryType!]}</View>
        <Text style={styles.description}>{t('enableBiometry.description')}</Text>
        <Button
          onPress={onPressUseBiometry}
          text={t(biometryButtonLabelMap[supportedBiometryType!])}
          size={BtnSizes.MEDIUM}
          type={BtnTypes.ONBOARDING}
          testID="EnableBiometryButton"
        />
      </ScrollView>
    </SafeAreaView>
  )
}

EnableBiometry.navigationOptions = nuxNavigationOptions

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.onboardingBackground,
  },
  contentContainer: {
    paddingTop: 186,
    paddingHorizontal: 40,
    alignItems: 'center',
  },
  imageContainer: {
    marginBottom: Spacing.Thick24,
  },
  description: {
    ...fontStyles.regular,
    textAlign: 'center',
    marginBottom: Spacing.Thick24,
  },
})

function FaceIDImage() {
  return (
    <Svg width={64} height={64} fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.25 17.563v-7.188a7.133 7.133 0 0 1 7.125-7.125h7.188a1.625 1.625 0 0 0 0-3.25h-7.188C4.655 0 0 4.654 0 10.375v7.188a1.625 1.625 0 0 0 3.25 0ZM17.563 60.75a1.625 1.625 0 0 1 0 3.25h-7.188C4.655 64 0 59.346 0 53.625v-7.188a1.625 1.625 0 0 1 3.25 0v7.188a7.133 7.133 0 0 0 7.125 7.125h7.188ZM64 46.437v7.188C64 59.345 59.346 64 53.625 64h-7.188a1.625 1.625 0 0 1 0-3.25h7.188a7.133 7.133 0 0 0 7.125-7.125v-7.188a1.625 1.625 0 0 1 3.25 0Zm0-36.062v7.188a1.625 1.625 0 0 1-3.25 0v-7.188a7.133 7.133 0 0 0-7.125-7.125h-7.188a1.625 1.625 0 0 1 0-3.25h7.188C59.345 0 64 4.654 64 10.375ZM43.214 47.302a1.687 1.687 0 0 0-2.29-2.48A13.115 13.115 0 0 1 32 48.313c-3.319 0-6.488-1.239-8.924-3.49a1.688 1.688 0 0 0-2.29 2.48A16.481 16.481 0 0 0 32 51.687c4.17 0 8.153-1.557 11.214-4.385Zm-7.839-23.177v12a4.317 4.317 0 0 1-4.313 4.313h-1.375a1.687 1.687 0 1 1 0-3.376h1.375c.517 0 .938-.42.938-.937v-12a1.687 1.687 0 1 1 3.375 0ZM47 28.844V24.03a1.594 1.594 0 0 0-3.188 0v4.813a1.594 1.594 0 0 0 3.188 0Zm-29.625 0a1.594 1.594 0 0 0 3.188 0V24.03a1.594 1.594 0 0 0-3.188 0v4.813Z"
        fill="#000"
      />
    </Svg>
  )
}

function TouchIDImage() {
  return (
    <Svg width={64} height={64} fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M38.635.943c-4.483-1.118-9.2-1.278-13.79-.287a.657.657 0 0 0 .277 1.285c4.396-.95 8.924-.793 13.232.287 10.3 2.582 18.875 10.327 22.14 20.444 1.264 3.912 1.8 8.078 1.908 12.445a.657.657 0 0 0 1.313-.033c-.108-4.426-.651-8.7-1.945-12.74C58.378 11.75 49.417 3.632 38.635.943ZM21.51 2.932a.657.657 0 1 0-.35-1.267c-4.801 1.324-11.554 5.9-15.728 12.014a.754.754 0 0 0-.004.007C1.763 19.208-.534 26.148.108 32.883l.001.019c.154 1.23.412 2.457.67 3.686.544 2.588 1.09 5.183.665 7.818a.657.657 0 1 0 1.297.21c.445-2.755-.107-5.443-.66-8.13-.254-1.244-.51-2.487-.666-3.737-.604-6.364 1.57-13.002 5.105-18.333 4.015-5.879 10.516-10.25 14.99-11.484Z"
        fill="#000"
      />
      <Path
        d="M30.133 4.4c8.25-.504 16.499 2.863 22.039 9.314a.657.657 0 1 1-.997.856c-5.268-6.134-13.118-9.339-20.966-8.858H30.2c-9.925.48-19.22 7.214-22.638 16.648a.657.657 0 1 1-1.236-.447C9.928 11.973 19.688 4.907 30.133 4.4ZM54.174 16.585a.657.657 0 0 0-1.091.733c3.07 4.572 4.34 9.548 4.843 15.454a.657.657 0 0 0 1.31-.112c-.514-6.034-1.823-11.252-5.062-16.075ZM58.796 35.45a.657.657 0 0 1 .697.615c.247 3.963.25 8.446-.189 11.76a.657.657 0 1 1-1.303-.173c.423-3.193.425-7.582.18-11.505a.657.657 0 0 1 .615-.697ZM6.57 25.543a.657.657 0 1 0-1.278-.308 26.58 26.58 0 0 0-.743 6.104c-.01 2.117.385 4.184.78 6.25.323 1.692.646 3.384.747 5.104.134 2.26-.341 4.523-1.163 6.677a.657.657 0 1 0 1.228.469c.868-2.277 1.395-4.73 1.247-7.223-.1-1.709-.424-3.39-.747-5.072-.394-2.051-.788-4.102-.778-6.199.01-1.952.248-3.902.706-5.802Z"
        fill="#000"
      />
      <Path
        d="M23.813 10.94a.657.657 0 0 1-.365.855c-6.813 2.736-11.93 8.91-12.973 16.19-.436 3.042.035 6.055.506 9.067.265 1.696.53 3.392.634 5.093.223 3.688-.197 7.739-2.597 11.425a.657.657 0 0 1-1.101-.718c2.186-3.358 2.6-7.088 2.386-10.627-.105-1.726-.368-3.442-.632-5.156-.472-3.077-.944-6.15-.497-9.27 1.115-7.774 6.563-14.324 13.784-17.224a.657.657 0 0 1 .855.365ZM46.882 14.681c-5.374-5.034-13.164-6.79-20.244-5.238a.657.657 0 1 0 .282 1.284c6.704-1.47 14.039.207 19.064 4.914 4.235 3.967 6.695 9.739 7.339 16.037a.657.657 0 0 0 1.307-.134c-.668-6.54-3.232-12.633-7.748-16.863ZM54.493 34.674a.657.657 0 0 1 .72.586c.625 6.077.356 12.64-.587 18.99a.657.657 0 0 1-1.3-.193c.93-6.261 1.191-12.713.58-18.662a.657.657 0 0 1 .587-.721Z"
        fill="#000"
      />
      <Path
        d="M31.582 13.355c-10.07 0-18.252 8.034-18.252 17.967 0 1.06.094 2.1.274 3.111a.657.657 0 0 0 1.294-.23 16.469 16.469 0 0 1-.254-2.881c0-9.187 7.574-16.652 16.938-16.652 4.232 0 8.098 1.525 11.066 4.045a.657.657 0 0 0 .85-1.002 18.353 18.353 0 0 0-11.916-4.358ZM44.971 20.163a.657.657 0 0 1 .93.02c2.9 3.024 3.828 7.777 4.442 11.766.692 4.494.798 8.877.798 10.91a.657.657 0 0 1-1.315 0c0-2-.104-6.31-.782-10.71-.57-3.703-1.392-8.24-4.092-11.056a.657.657 0 0 1 .02-.93ZM50.974 46.622a.657.657 0 0 0-1.31-.105c-.323 4.048-.745 8.092-1.6 11.827a.657.657 0 1 0 1.28.293c.879-3.833 1.306-7.956 1.63-12.015ZM14.662 36.852a.657.657 0 0 1 .771.518c1.39 7.056.43 13.466-3.25 19.08a.657.657 0 0 1-1.099-.72c3.462-5.283 4.394-11.331 3.06-18.106a.657.657 0 0 1 .518-.772Z"
        fill="#000"
      />
      <Path
        d="M31.582 17.631c-6.537 0-12.95 5.06-13.604 11.42-.287 2.784.116 5.526.519 8.27.351 2.395.703 4.791.596 7.217-.244 5.552-1.873 10.135-4.672 13.91a.657.657 0 1 0 1.056.782c2.968-4.003 4.674-8.844 4.93-14.634.106-2.415-.247-4.804-.6-7.19-.403-2.73-.806-5.459-.521-8.221.574-5.587 6.325-10.24 12.296-10.24 2.785 0 9.991 1.508 12.283 8.976 1.437 4.679 1.828 11.012 1.48 17.164-.347 6.151-1.43 12.035-2.885 15.808a.657.657 0 0 0 1.227.473c1.522-3.947 2.619-9.98 2.97-16.207.353-6.226-.034-12.734-1.535-17.624-2.545-8.289-10.52-9.904-13.54-9.904Z"
        fill="#000"
      />
      <Path
        d="M21.47 56.451c.303.198.389.606.19.91-.407.624-.765 1.278-1.124 1.932-.359.654-.717 1.307-1.125 1.932a.657.657 0 1 1-1.1-.718c.407-.624.765-1.278 1.124-1.932.359-.654.717-1.308 1.125-1.932a.657.657 0 0 1 .91-.192ZM27.096 24.453a.657.657 0 1 0-.73-1.093c-2.603 1.74-4.2 4.134-4.2 7.64 0 2.088.37 3.795.75 5.545.567 2.62.953 5.233.883 7.923-.084 3.267-.723 6.252-1.952 9.096a.657.657 0 1 0 1.207.521c1.299-3.007 1.971-6.158 2.06-9.583.071-2.796-.325-5.513-.913-8.235-.38-1.758-.72-3.328-.72-5.267 0-3.004 1.321-5.013 3.615-6.547ZM29.66 22.144c2.728-.556 5.662.13 7.822 1.879 3.858 3.122 4.371 8.817 4.787 13.432l.021.235c.538 5.949-.077 11.726-1.316 17.529a.657.657 0 1 1-1.286-.275c1.22-5.715 1.815-11.355 1.293-17.136l-.052-.582v-.002c-.37-4.17-.832-9.394-4.274-12.18-1.846-1.494-4.379-2.092-6.732-1.613a.657.657 0 1 1-.262-1.287ZM40.045 58.489a.657.657 0 1 0-1.274-.325 15.88 15.88 0 0 1-1.785 4.266.657.657 0 1 0 1.127.675 17.188 17.188 0 0 0 1.932-4.616ZM36.831 48.952c.36.043.618.37.576.73-.62 5.245-2.022 9.922-4.27 13.98a.657.657 0 0 1-1.15-.638c2.152-3.882 3.51-8.39 4.115-13.496a.657.657 0 0 1 .73-.576Z"
        fill="#000"
      />
      <Path
        d="M36.696 30.656c-.456-2.435-2.545-4.297-5.081-4.297-3.435 0-5.845 3.462-4.996 6.683 1.437 5.686 1.673 11.166.7 16.444v.003c-.845 4.739-2.465 9.002-4.677 12.614a.657.657 0 0 0 1.121.686c2.302-3.76 3.978-8.178 4.85-13.067 1.01-5.482.759-11.154-.72-17.005l-.002-.007c-.637-2.41 1.138-5.037 3.724-5.037 1.865 0 3.44 1.373 3.788 3.22.957 5.548 1.455 10.693 1.1 15.123a.657.657 0 1 0 1.31.105c.368-4.592-.151-9.863-1.115-15.456l-.002-.01ZM29.654 59.117c.323.166.45.562.284.885l-1.741 3.389a.657.657 0 1 1-1.17-.601L28.77 59.4a.657.657 0 0 1 .885-.284Z"
        fill="#000"
      />
      <Path
        d="M32.103 31.29a.657.657 0 1 0-1.28.3c2.217 9.433 1.913 17.717-.787 24.773a.657.657 0 1 0 1.228.47c2.814-7.358 3.1-15.919.84-25.544Z"
        fill="#000"
      />
    </Svg>
  )
}

function FingerprintImage() {
  return (
    <Svg width={64} height={64} fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M47.493 11.92c-.213 0-.426-.053-.613-.16C41.76 9.12 37.333 8 32.027 8c-5.28 0-10.294 1.253-14.854 3.76-.64.347-1.44.107-1.813-.533a1.35 1.35 0 0 1 .534-1.814c4.96-2.693 10.4-4.08 16.133-4.08 5.68 0 10.64 1.254 16.08 4.054.666.346.907 1.146.56 1.786-.24.48-.694.747-1.174.747Zm-38.16 14a1.33 1.33 0 0 1-1.093-2.107c2.64-3.733 6-6.666 10-8.72 8.373-4.32 19.094-4.346 27.494-.026 4 2.053 7.36 4.96 10 8.666.426.587.293 1.44-.32 1.867a1.33 1.33 0 0 1-1.867-.32c-2.4-3.36-5.44-6-9.04-7.84-7.654-3.92-17.44-3.92-25.067.027-3.627 1.866-6.667 4.533-9.067 7.893-.213.373-.613.56-1.04.56ZM26 58.107a1.25 1.25 0 0 1-.933-.4c-2.32-2.32-3.573-3.814-5.36-7.04-1.84-3.28-2.8-7.28-2.8-11.574 0-7.92 6.773-14.373 15.093-14.373s15.093 6.453 15.093 14.373a1.32 1.32 0 0 1-1.333 1.334 1.32 1.32 0 0 1-1.333-1.334c0-6.453-5.574-11.706-12.427-11.706S19.573 32.64 19.573 39.093c0 3.84.854 7.387 2.48 10.267 1.707 3.067 2.88 4.373 4.934 6.453a1.37 1.37 0 0 1 0 1.894c-.293.266-.64.4-.987.4Zm19.12-4.934c-3.173 0-5.973-.8-8.267-2.373-3.973-2.693-6.346-7.067-6.346-11.707a1.32 1.32 0 0 1 1.333-1.333 1.32 1.32 0 0 1 1.333 1.333c0 3.76 1.92 7.307 5.174 9.494 1.893 1.28 4.106 1.893 6.773 1.893.64 0 1.707-.08 2.774-.267a1.33 1.33 0 0 1 1.546 1.094 1.33 1.33 0 0 1-1.093 1.546c-1.52.294-2.854.32-3.227.32Zm-5.36 5.494c-.106 0-.24-.027-.346-.054-4.24-1.173-7.014-2.746-9.92-5.6-3.734-3.706-5.787-8.64-5.787-13.92 0-4.32 3.68-7.84 8.213-7.84 4.533 0 8.213 3.52 8.213 7.84 0 2.854 2.48 5.174 5.547 5.174 3.067 0 5.547-2.32 5.547-5.174 0-10.053-8.667-18.213-19.333-18.213-7.574 0-14.507 4.213-17.627 10.747-1.04 2.16-1.573 4.693-1.573 7.466 0 2.08.186 5.36 1.786 9.627a1.301 1.301 0 0 1-.773 1.707A1.323 1.323 0 0 1 12 49.653c-1.306-3.493-1.947-6.96-1.947-10.56 0-3.2.614-6.106 1.814-8.64 3.546-7.44 11.413-12.266 20.026-12.266 12.134 0 22 9.36 22 20.88 0 4.32-3.68 7.84-8.213 7.84-4.533 0-8.213-3.52-8.213-7.84 0-2.854-2.48-5.174-5.547-5.174-3.067 0-5.547 2.32-5.547 5.174 0 4.56 1.76 8.826 4.987 12.026 2.534 2.507 4.96 3.894 8.72 4.934.72.186 1.12.933.934 1.626a1.301 1.301 0 0 1-1.254 1.014Z"
        fill="#1A73E8"
      />
    </Svg>
  )
}

function FaceImage() {
  return (
    <Svg width={64} height={64} fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M32 57.887c14.297 0 25.887-11.59 25.887-25.887S46.297 6.113 32 6.113 6.113 17.703 6.113 32 17.703 57.887 32 57.887ZM32 60c15.464 0 28-12.536 28-28S47.464 4 32 4 4 16.536 4 32s12.536 28 28 28Z"
        fill="#1A73E8"
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M36.752 46.831c.27.582.018 1.274-.565 1.544-2.69 1.25-5.356 1.479-7.54.476-2.215-1.017-3.66-3.173-4.134-6.099l2.295-.372c.383 2.364 1.466 3.742 2.809 4.359 1.374.63 3.299.592 5.591-.472a1.162 1.162 0 0 1 1.544.564ZM33.585 35.17v-4.755h2.113v6.868h-5.811V35.17h3.698Z"
        fill="#1A73E8"
      />
      <Path
        d="M46.792 25.132a2.113 2.113 0 1 1-4.226 0 2.113 2.113 0 0 1 4.226 0ZM21.434 25.132a2.113 2.113 0 1 1-4.226 0 2.113 2.113 0 0 1 4.226 0Z"
        fill="#1A73E8"
      />
    </Svg>
  )
}
