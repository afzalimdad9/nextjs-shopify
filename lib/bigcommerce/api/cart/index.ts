import { serialize, CookieSerializeOptions } from 'cookie'
import isAllowedMethod from '../utils/is-allowed-method'
import createApiHandler, {
  BigcommerceApiHandler,
  BigcommerceHandler,
} from '../utils/create-api-handler'
import { BigcommerceApiError } from '../utils/errors'
import getCart from './handlers/get-cart'

type Body<T> = Partial<T> | undefined

export type ItemBody = {
  productId: number
  variantId: number
  quantity?: number
}

export type AddItemBody = { item: ItemBody }

export type UpdateItemBody = { itemId: string; item: ItemBody }

export type RemoveItemBody = { itemId: string }

// TODO: this type should match:
// https://developer.bigcommerce.com/api-reference/cart-checkout/server-server-cart-api/cart/getacart#responses
export type Cart = {
  id: string
  parent_id?: string
  customer_id: number
  email: string
  currency: { code: string }
  tax_included: boolean
  base_amount: number
  discount_amount: number
  cart_amount: number
  line_items: {
    custom_items: any[]
    digital_items: any[]
    gift_certificates: any[]
    physical_items: any[]
  }
  // TODO: add missing fields
}

export type CartHandlers = {
  getCart: BigcommerceHandler<Cart, { cartId?: string }>
}

const METHODS = ['GET', 'POST', 'PUT', 'DELETE']

// TODO: a complete implementation should have schema validation for `req.body`
const cartApi: BigcommerceApiHandler<Cart, CartHandlers> = async (
  req,
  res,
  config,
  handlers
) => {
  if (!isAllowedMethod(req, res, METHODS)) return

  const { cookies } = req
  const cartId = cookies[config.cartCookie]

  try {
    // Return current cart info
    if (req.method === 'GET') {
      return await handlers['getCart']({ req, res, config, body: { cartId } })
    }

    // Create or add an item to the cart
    if (req.method === 'POST') {
      const { item } = (req.body as Body<AddItemBody>) ?? {}

      if (!item) {
        return res.status(400).json({
          data: null,
          errors: [{ message: 'Missing item' }],
        })
      }
      if (!item.quantity) item.quantity = 1

      const options = {
        method: 'POST',
        body: JSON.stringify({
          line_items: [parseItem(item)],
        }),
      }
      const { data } = cartId
        ? await config.storeApiFetch(`/v3/carts/${cartId}/items`, options)
        : await config.storeApiFetch('/v3/carts', options)

      // Create or update the cart cookie
      res.setHeader(
        'Set-Cookie',
        getCartCookie(config.cartCookie, data.id, config.cartCookieMaxAge)
      )

      return res.status(200).json({ data })
    }

    // Update item in cart
    if (req.method === 'PUT') {
      const { itemId, item } = (req.body as Body<UpdateItemBody>) ?? {}

      if (!cartId || !itemId || !item) {
        return res.status(400).json({
          data: null,
          errors: [{ message: 'Invalid request' }],
        })
      }

      const { data } = await config.storeApiFetch(
        `/v3/carts/${cartId}/items/${itemId}`,
        {
          method: 'PUT',
          body: JSON.stringify({
            line_item: parseItem(item),
          }),
        }
      )

      // Update the cart cookie
      res.setHeader(
        'Set-Cookie',
        getCartCookie(config.cartCookie, cartId, config.cartCookieMaxAge)
      )

      return res.status(200).json({ data })
    }

    // Remove an item from the cart
    if (req.method === 'DELETE') {
      const { itemId } = (req.body as Body<RemoveItemBody>) ?? {}

      if (!cartId || !itemId) {
        return res.status(400).json({
          data: null,
          errors: [{ message: 'Invalid request' }],
        })
      }

      const result = await config.storeApiFetch<{ data: any } | null>(
        `/v3/carts/${cartId}/items/${itemId}`,
        { method: 'DELETE' }
      )
      const data = result?.data ?? null

      res.setHeader(
        'Set-Cookie',
        data
          ? // Update the cart cookie
            getCartCookie(config.cartCookie, cartId, config.cartCookieMaxAge)
          : // Remove the cart cookie if the cart was removed (empty items)
            getCartCookie(config.cartCookie)
      )

      return res.status(200).json({ data })
    }
  } catch (error) {
    console.error(error)

    const message =
      error instanceof BigcommerceApiError
        ? 'An unexpected error ocurred with the Bigcommerce API'
        : 'An unexpected error ocurred'

    res.status(500).json({ data: null, errors: [{ message }] })
  }
}

function getCartCookie(name: string, cartId?: string, maxAge?: number) {
  const options: CookieSerializeOptions =
    cartId && maxAge
      ? {
          maxAge,
          expires: new Date(Date.now() + maxAge * 1000),
          secure: process.env.NODE_ENV === 'production',
          path: '/',
          sameSite: 'lax',
        }
      : { maxAge: -1, path: '/' } // Removes the cookie

  return serialize(name, cartId || '', options)
}

const parseItem = (item: ItemBody) => ({
  quantity: item.quantity,
  product_id: item.productId,
  variant_id: item.variantId,
})

const handlers = {
  getCart,
}

const h = createApiHandler(cartApi, handlers)

export default h