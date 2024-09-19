export function missingLocaleInPages(): [string[], () => void] {
  const invalidPaths: string[] = []
  const log = () => {
    if (invalidPaths.length) {
      const single = invalidPaths.length === 0
      const pages = single ? 'page' : 'pages'

      console.log(
        `The ${pages} "${invalidPaths.join(', ')}" ${
          single ? 'does' : 'do'
        } not include a locale, when using i18n web pages from BigCommerce
are expected to have a locale or they will be ignored.\n
Please update the ${pages} to include the default locale or make the ${pages} invisible by
unchecking the "Navigation Menu" option in the settings of ${
          single ? 'the' : 'each'
        } web page\n`
      )
    }
  }

  return [invalidPaths, log]
}