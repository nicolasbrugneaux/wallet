import * as React from 'react'
import Svg, { Path } from 'react-native-svg'

export function Fingerprint() {
  return (
    <Svg width={64} height={64} fill="none">
      <Path
        d="M47.493 11.92c-.213 0-.426-.053-.613-.16C41.76 9.12 37.333 8 32.027 8c-5.28 0-10.294 1.253-14.854 3.76-.64.347-1.44.107-1.813-.533a1.35 1.35 0 0 1 .534-1.814c4.96-2.693 10.4-4.08 16.133-4.08 5.68 0 10.64 1.254 16.08 4.054.666.346.907 1.146.56 1.786-.24.48-.694.747-1.174.747Zm-38.16 14a1.33 1.33 0 0 1-1.093-2.107c2.64-3.733 6-6.666 10-8.72 8.373-4.32 19.094-4.346 27.494-.026 4 2.053 7.36 4.96 10 8.666.426.587.293 1.44-.32 1.867a1.33 1.33 0 0 1-1.867-.32c-2.4-3.36-5.44-6-9.04-7.84-7.654-3.92-17.44-3.92-25.067.027-3.627 1.866-6.667 4.533-9.067 7.893-.213.373-.613.56-1.04.56ZM26 58.107a1.25 1.25 0 0 1-.933-.4c-2.32-2.32-3.573-3.814-5.36-7.04-1.84-3.28-2.8-7.28-2.8-11.574 0-7.92 6.773-14.373 15.093-14.373s15.093 6.453 15.093 14.373a1.32 1.32 0 0 1-1.333 1.334 1.32 1.32 0 0 1-1.333-1.334c0-6.453-5.574-11.706-12.427-11.706S19.573 32.64 19.573 39.093c0 3.84.854 7.387 2.48 10.267 1.707 3.067 2.88 4.373 4.934 6.453a1.37 1.37 0 0 1 0 1.894c-.293.266-.64.4-.987.4Zm19.12-4.934c-3.173 0-5.973-.8-8.267-2.373-3.973-2.693-6.346-7.067-6.346-11.707a1.32 1.32 0 0 1 1.333-1.333 1.32 1.32 0 0 1 1.333 1.333c0 3.76 1.92 7.307 5.174 9.494 1.893 1.28 4.106 1.893 6.773 1.893.64 0 1.707-.08 2.774-.267a1.33 1.33 0 0 1 1.546 1.094 1.33 1.33 0 0 1-1.093 1.546c-1.52.294-2.854.32-3.227.32Zm-5.36 5.494c-.106 0-.24-.027-.346-.054-4.24-1.173-7.014-2.746-9.92-5.6-3.734-3.706-5.787-8.64-5.787-13.92 0-4.32 3.68-7.84 8.213-7.84 4.533 0 8.213 3.52 8.213 7.84 0 2.854 2.48 5.174 5.547 5.174 3.067 0 5.547-2.32 5.547-5.174 0-10.053-8.667-18.213-19.333-18.213-7.574 0-14.507 4.213-17.627 10.747-1.04 2.16-1.573 4.693-1.573 7.466 0 2.08.186 5.36 1.786 9.627a1.301 1.301 0 0 1-.773 1.707A1.323 1.323 0 0 1 12 49.653c-1.306-3.493-1.947-6.96-1.947-10.56 0-3.2.614-6.106 1.814-8.64 3.546-7.44 11.413-12.266 20.026-12.266 12.134 0 22 9.36 22 20.88 0 4.32-3.68 7.84-8.213 7.84-4.533 0-8.213-3.52-8.213-7.84 0-2.854-2.48-5.174-5.547-5.174-3.067 0-5.547 2.32-5.547 5.174 0 4.56 1.76 8.826 4.987 12.026 2.534 2.507 4.96 3.894 8.72 4.934.72.186 1.12.933.934 1.626a1.301 1.301 0 0 1-1.254 1.014Z"
        fill="#1A73E8"
      />
    </Svg>
  )
}

export default React.memo(Fingerprint)
