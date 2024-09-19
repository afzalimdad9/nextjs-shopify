import { FC } from 'react'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import cn from 'classnames'
import s from './DropdownMenu.module.css'
import { Moon, Sun } from '@components/icon'
import { Menu, Transition } from '@headlessui/react'
import useLogout from '@lib/bigcommerce/use-logout'
interface DropdownMenuProps {
  open: boolean
}

const LINKS = [
  {
    name: 'My Orders',
    href: '/orders',
  },
  {
    name: 'My Profile',
    href: '/profile',
  },
  {
    name: 'Cart',
    href: '/cart',
  },
]

const DropdownMenu: FC<DropdownMenuProps> = ({ open = false }) => {
  const { theme, setTheme } = useTheme()
  const logout = useLogout()
  return (
    <Transition
      show={open}
      enter="transition ease-out duration-150 z-20"
      enterFrom="transform opacity-0 scale-95"
      enterTo="transform opacity-100 scale-100"
      leave="transition ease-in duration-75"
      leaveFrom="transform opacity-100 scale-100"
      leaveTo="transform opacity-0 scale-95"
    >
      <Menu.Items className={s.dropdownMenu}>
        {LINKS.map(({ name, href }) => (
          <Link href={href} key={href}>
            <Menu.Item>
              {({ active }) => (
                <a className={cn(s.link, { [s.active]: active })}>{name}</a>
              </Link>
        )}
      </Menu.Item>
        ))}
      <Menu.Item>
        <a
          className={cn(s.link, 'justify-between')}
          onClick={() =>
            theme === 'dark' ? setTheme('light') : setTheme('dark')
          }
        >
          <div>
            Theme: <strong>{theme}</strong>{' '}
          </div>
          <div className="ml-3">
            {theme == 'dark' ? (
              <Moon width={20} height={20} />
            ) : (
              <Sun width="20" height={20} />
            )}
          </div>
        </a>
      </Menu.Item>
      <Menu.Item>
        <a
          className={cn(s.link, 'border-t border-accents-2 mt-4')}
          onClick={() => logout()}
        >
          Logout
        </a>
      </Menu.Item>
    </Menu.Items>
    </Transition >
  )
}

export default DropdownMenu
