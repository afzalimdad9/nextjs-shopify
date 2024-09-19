import { FC, useState } from 'react'
import cn from 'classnames'
import { ThemeProvider } from 'next-themes'
import { SSRProvider, OverlayProvider } from 'react-aria'
import type { Page } from '@lib/bigcommerce/api/operations/get-all-pages'
import { CommerceProvider } from '@lib/bigcommerce'
import { Navbar, Featurebar, Footer } from '@components/core'
import { Container, Sidebar } from '@components/ui'
import Button from '@components/ui/Button'
import { CartSidebarView } from '@components/cart'
import { useUI } from '@components/ui/context'

import { CommerceProvider } from '@lib/bigcommerce'
interface Props {
  className?: string
  children?: any
}

const Layout: FC<Props> = ({ className, children }) => {
  const rootClassName = cn(s.root, className)
  const { displaySidebar, closeSidebar } = useUI()
  const [acceptedCookies, setAcceptedCookies] = useState(false)

  return (
    <CommerceProvider locale="en-us">
      <div className={cn(s.root)}>
        <Container>
          <Navbar />
        </Container>
        <main className="fit">{children}</main>
        <Footer pages={pageProps.pages} />
        <Sidebar show={displaySidebar} close={closeSidebar}>
          <CartSidebarView />
        </Sidebar>
        <Featurebar
          title="This site uses cookies to improve your experience."
          description="By clicking, you agree to our Privacy Policy."
          hide={acceptedCookies}
          action={
            <Button className="mx-5" onClick={() => setAcceptedCookies(true)}>
              Accept cookies
            </Button>
          }
        />
      </div>
    </CommerceProvider>
  )
}

export default Layout
