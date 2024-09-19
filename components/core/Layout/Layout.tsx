import { FC } from 'react'
import { Navbar, Featurebar, Footer } from '@components/core'
import { Container, Sidebar } from '@components/ui'
import { CartSidebarView } from '@components/cart'
import { UIProvider, useUI } from '@components/ui/context'
import s from './Layout.module.css'
import { ThemeProvider } from 'next-themes'
import { SSRProvider, OverlayProvider } from 'react-aria'

interface LayoutProps {
  pageProps: {
    pages?: Page[]
  }
}

const CoreLayout: FC<Props> = ({ className, children }) => {
  const rootClassName = cn(s.root, className)
  const { displaySidebar, closeSidebar } = useUI()

  return (
    <div className="h-full bg-primary">
      <Featurebar
        title="Free Standard Shipping on orders over $99.99"
        description="Due to COVID-19, some orders may experience processing and delivery delays."
      />
      <Container>
        <Navbar />
      </Container>
      <main className="fit">{children}</main>
      <Footer pages={pages} />
      <Sidebar show={displaySidebar} close={closeSidebar}>
        <CartSidebarView />
      </Sidebar>
    </div>
  )
}

const Layout: FC<Props> = (props) => (
  <UIProvider>
    <ThemeProvider>
      <SSRProvider>
        <OverlayProvider>
          <CoreLayout {...props} />
        </OverlayProvider>
      </SSRProvider>
    </ThemeProvider>
  </UIProvider>
)

export default Layout
