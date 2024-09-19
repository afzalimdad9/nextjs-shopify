import { FC, useEffect, useState } from 'react'
import cn from 'classnames'
import s from './UserNav.module.css'
import { FC } from 'react'
import { Heart, Bag } from '@components/icon'
import { Avatar } from '@components/core'
import { useUI } from '@components/ui/context'
import s from './UserNav.module.css'
import { useTheme } from 'next-themes'
import Link from 'next/link'
interface Props {
  className?: string
}

const countItem = (count: number, item: any) => count + item.quantity
const countItems = (count: number, items: any[]) =>
  items.reduce(countItem, count)

const UserNav: FC<Props> = ({ className, children, ...props }) => {
  const { data } = useCart()
  const { openSidebar, closeSidebar, displaySidebar } = useUI()

  const itemsCount = Object.values(data?.line_items ?? {}).reduce(countItems, 0)

  useEffect(() => {
    function handleClick(e: any) {
      const isInside = e?.target?.closest(`#user-dropdown`) !== null
      if (isInside) return
      setDisplayDropdown(false)
      document.removeEventListener('click', handleClick)
    }
    function handleKeyPress(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setDisplayDropdown(false)
        document.removeEventListener('keydown', handleKeyPress)
      }
    }

    if (displayDropdown) {
      document.addEventListener('click', handleClick)
      document.addEventListener('keydown', handleKeyPress)
      return () => {
        document.removeEventListener('click', handleClick)
        document.removeEventListener('keydown', handleKeyPress)
      }
    }
  }, [displayDropdown])

  return (
    <nav className={cn(s.root, className)}>
      <div className={s.mainContainer}>
        <ul className={s.list}>
          <li
            className={s.item}
            onClick={() => (displaySidebar ? closeSidebar() : openSidebar())}
          >
            <Bag />
            {itemsCount > 0 && (
              <span className="border border-accent-1 bg-secondary text-secondary h-4 w-4 absolute rounded-full right-3 top-3 flex items-center justify-center font-bold text-xs">
                {itemsCount}
              </span>
            )}
          </li>
          <Link href="/wishlist">
            <li className={s.item}>
              <Heart />
            </li>
          </Link>
          <li className={s.item}>
            <Menu>
              {({ open }) => {
                return (
                  <>
                    <Menu.Button className="inline-flex justify-center rounded-full">
                      <Avatar />
                    </Menu.Button>
                    <DropdownMenu open={open} />
                  </>
                )
              }}
            </Menu>
          </li>
        </ul>
      </div>
    </nav >
  )
}

export default UserNav
