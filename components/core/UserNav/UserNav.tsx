import { FC, useEffect, useState } from 'react'
import cn from 'classnames'
import s from './UserNav.module.css'
import { FC } from 'react'
import { Heart, Bag } from '@components/icons'
import { Avatar } from '@components/core'
import { useUI } from '@components/ui/context'
import DropdownMenu from './DropdownMenu'
import { Menu } from '@headlessui/react'
import useCart from '@lib/bigcommerce/cart/use-cart'
import useCustomer from '@lib/bigcommerce/use-customer'
interface Props {
  className?: string
}

const countItem = (count: number, item: any) => count + item.quantity
const countItems = (count: number, items: any[]) =>
  items.reduce(countItem, count)

const UserNav: FC<Props> = ({ className, children, ...props }) => {
  const { data } = useCart()
  const { data: customer } = useCustomer()

  const { openSidebar, closeSidebar, displaySidebar, openModal } = useUI()
  const itemsCount = Object.values(data?.line_items ?? {}).reduce(countItems, 0)
  return (
    <nav className={cn(s.root, className)}>
      <div className={s.mainContainer}>
        <ul className={s.list}>
          <li
            className={s.item}
            onClick={(e) => (displaySidebar ? closeSidebar() : openSidebar())}
          >
            <Bag />
            {itemsCount > 0 && <span className={s.bagCount}>{itemsCount}</span>}
          </li>
          <li className={s.item}>
            <Link href="/wishlist">
              <a>
                <Heart />
              </a>
            </Link>
          </li>
          <li className={s.item}>
            {customer ? (
              <Menu>
                {({ open }) => (
                  <>
                    <Menu.Button className={s.avatarButton} aria-label="Menu">
                      <Avatar />
                    </Menu.Button>
                    <DropdownMenu open={open} />
                  </>
                )}
              </Menu>
            ) : (
              <button
                className={s.avatarButton}
                aria-label="Menu"
                onClick={() => openModal()}
              >
                <Avatar />
              </button>
            )}
          </li>
        </ul>
      </div>
    </nav >
  )
}

export default UserNav
