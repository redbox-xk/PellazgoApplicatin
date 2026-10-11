# Pellazgo API handoff for Base44

## Current connection status

The Pellazgo API server is running in the Replit development workspace, but this
project does **not** have a published deployment yet. There is no stable public
API URL to give Base44 today. Do not use the workspace's `.replit.dev` address
as a production integration URL.

The OpenAPI 3.1 contract is maintained at `lib/api-spec/openapi.yaml`. Its API
path prefix is `/api`. After the API service is safely published, set
`PELLAZGO_API_BASE_URL` in Base44 to the published API origin plus `/api`, for
example `https://<published-api-host>/api`.

## Safe endpoints for initial catalog integration

Use these read-only endpoints to display Pellazgo's live catalog:

| Method | Path | Purpose |
|---|---|---|
| GET | `/healthz` | API health check |
| GET | `/categories` | Product categories |
| GET | `/products` | Product list; supports `search`, `category`, `businessId` |
| GET | `/products/featured` | Featured products |
| GET | `/products/{id}` | Product details |
| GET | `/offers` | Offers; supports `featured` |
| GET | `/offers/{id}` | Offer details |
| GET | `/reviews` | Reviews; supports `businessId`, `productId` |
| GET | `/blog` | Editorial posts |
| GET | `/blog/{id}` | Editorial post details |

Example:

```http
GET ${PELLAZGO_API_BASE_URL}/products?category=Çanta
Accept: application/json
```

Product and other object schemas are defined in the OpenAPI contract. Use those
schemas rather than assuming field names. Product prices are EUR amounts.

## Important: do not connect account or write flows yet

The API currently has no server-side user authentication or per-user isolation.
Some cart, order, profile, loyalty, favorites, gift-card, and AI-chat handlers
use a shared default user. Several write handlers can change shared database
state. Do not connect Base44's customer login, checkout, order history, AI chat,
or any write operation to this API until those routes are secured and tested.

Product catalog reads are the appropriate first integration. The API currently
does not provide product create/update/delete routes, so Base44 must not treat
it as a product-management write API.

## Live update behavior

Once published, Base44 can read the same Pellazgo database by requesting the
catalog endpoints. Changes made in Pellazgo will be visible on the next request
(subject to any cache configured in Base44). This API does not currently offer
webhooks or a live event stream, and it cannot report the progress of a separate
Base44 agent session back into this chat.

## Ready-to-paste Base44 agent instruction

> Integrate the Pellazgo catalog using the attached OpenAPI 3.1 file
> `lib/api-spec/openapi.yaml`. Read the API origin from the Base44 environment
> variable `PELLAZGO_API_BASE_URL`; append only the documented paths. For the
> first phase, use GET requests only for categories, products, featured
> products, offers, reviews, and blog content. Render product prices in EUR and
> preserve the API's product IDs when linking to product details. Do not connect
> customer authentication, cart mutations, checkout, orders, profile, loyalty,
> favorites, gift cards, or AI chat: those endpoints are not yet isolated by
> authenticated user. Do not invent product-management endpoints. If the API
> base URL is not configured, show a clear configuration error rather than
> silently switching to mock data.
