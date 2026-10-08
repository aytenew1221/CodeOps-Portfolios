# Addis Eats Data Strategy — Day 41

## Overview

This project combines Next.js Server Components with two client-side data
strategies:

- **SWR** for search, pagination, polling and simple cache revalidation.
- **TanStack Query** for structured queries, mutations and invalidation.

The project does **not** use a client-side data library for every request.

## Home Page

Route:

`/`

Strategy:

Server Component.

Reason:

The initial featured menu does not require browser interaction.

Data source:

`lib/dishes.js`

## Menu Search

Route:

`/menu`

Key:

`/api/dishes?q={query}&category={category}&page={page}&limit=4`

Strategy:

SWR + 300ms debounce.

Reason:

The request depends on what the user types and the selected category.

Important option:

`keepPreviousData: true`

This keeps the previous result visible while the new query is loading.

## Menu Pagination

Route:

`/menu`

The page number is part of the SWR key:

`/api/dishes?...&page=1`

`/api/dishes?...&page=2`

`/api/dishes?...&page=3`

Reason:

Each page is a separate cache entry.

## Order Status

Route:

`/orders/1001`

Key:

`/api/orders/1001`

Strategy:

SWR + `fallbackData` + polling.

Refresh interval:

5 seconds.

Server:

`app/orders/[id]/page.js` obtains the initial order.

Client:

`OrderStatus.js` receives the initial order and uses it as `fallbackData`.

The page also has a development/demo button that advances the order status.
The next SWR poll then retrieves the changed status.

## Cart

Route:

`/cart`

Key:

`/api/cart`

Strategy:

SWR.

After a cart mutation:

`mutate()`

The cart is fetched again so the cached UI reflects the server response.

For this lesson the cart is an in-memory server store. Restarting the development
server resets it. A production application should use a database, session, or
another persistent store.

## TanStack Query Menu

Route:

`/tanstack`

The page also renders a TanStack Query cart summary using:

`queryKey: ["cart"]`

The Add to Cart mutation invalidates that key so the summary refetches.

Key:

`["dishes", "all"]`

Strategy:

TanStack Query.

Freshness:

`staleTime: 30 * 1000`

Cache retention:

`gcTime: 5 * 60 * 1000`

The page also demonstrates:

- `useQuery`
- `queryKey`
- `queryFn`
- `useMutation`
- `invalidateQueries`

## Add to Cart Mutation

Mutation:

`POST /api/cart`

Function:

`addToCart()`

After success:

`queryClient.invalidateQueries({ queryKey: ["cart"] })`

This demonstrates the general flow:

User action

↓

Mutation

↓

Server write

↓

Successful response

↓

Invalidate related cached data

↓

Related query can fetch fresh data

## Server vs Client Rule

Start with a Server Component.

Move data behavior to the client only when the browser genuinely needs:

- Search
- Polling
- Pagination
- Browser-controlled filtering
- Client-side caching
- Revalidation
- Mutation-driven updates

## Day 41 Decision Guide

### Does the data only need to appear on the initial page?

Use a Server Component.

### Does the user type to change the request?

Use a client query and debounce the input.

### Does the data need automatic refresh?

Use SWR `refreshInterval` or TanStack Query `refetchInterval`.

### Does a page number change the request?

Put the page number in the query key.

### Does a mutation change cached data?

Use SWR `mutate()` or TanStack Query `invalidateQueries()`.

### Is server data already available?

Pass it to the client as initial/fallback data, or use a full
prefetch/dehydration/hydration architecture for larger applications.
