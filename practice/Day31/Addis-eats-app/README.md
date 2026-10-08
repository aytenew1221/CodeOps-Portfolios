# 🍽️ Addis Eats

A React-based Ethiopian food ordering application built as part of the IBT CodeOps learning project.

The project version focuses on **React Router**, multiple screens, URL-based filtering, persistent cart state, and protected checkout.

---

## 📌 Project Overview

**Addis Eats** is a simple Ethiopian food ordering application where users can:

- Browse Ethiopian dishes
- Search for dishes
- Filter dishes by category
- View individual dish details
- Add dishes to a shopping cart
- Navigate between different application screens
- Keep cart items while navigating
- Keep the cart after refreshing the browser
- Sign in before accessing checkout
- Return automatically to checkout after signing in
- Submit delivery information using TeleBirr phone validation

---

## ✨ Features

### 🏠 Landing Page

The home page introduces Addis Eats and provides a link to browse the menu.

Route:

```text
/
```

---

### 🍴 Menu

The menu loads dishes from `public/menu.json`.

Route:

```text
/menu
```

The menu supports:

- Search
- Category filtering
- Loading state
- Error state
- Individual dish links

---

### 🔎 Search

Users can search for dishes by name.

For example:

```text
Doro
```

will display:

```text
Doro Wat
```

---

### 🏷️ Category Filtering

The selected category is stored in the URL query string.

Example:

```text
/menu?category=Ethiopian
```

Other examples:

```text
/menu?category=Vegetarian
```

```text
/menu?category=Drinks
```

```text
/menu?category=Desserts
```

This functionality uses React Router's:

```jsx
useSearchParams();
```

---

### 🍲 Dish Details

Each dish has its own page.

Example:

```text
/menu/1
```

displays Doro Wat.

The application uses:

```jsx
useParams();
```

to read the dish ID from the URL.

Example:

```jsx
const { id } = useParams();
```

---

### 🛒 Shopping Cart

Users can add dishes to the cart.

The cart supports:

- Add item
- Increase quantity
- Decrease quantity
- Remove item
- Clear cart
- Calculate total price

The cart is stored in the main `App` component so it survives navigation between routes.

The cart is also saved in:

```text
localStorage
```

using:

```text
addis-eats-cart
```

Therefore, cart information can survive a browser refresh.

---

### 🔐 Authentication Guard

Checkout is protected.

When a user who is not signed in tries to visit:

```text
/checkout
```

they are redirected to:

```text
/signin
```

The application remembers the page they originally requested.

After signing in, the user is automatically returned to:

```text
/checkout
```

This functionality is implemented using:

- `RequireAuth`
- `Navigate`
- `useLocation`
- `useNavigate`

---

### 👤 Sign In

The sign-in page provides a simple demonstration authentication flow.

Route:

```text
/signin
```

For this learning project, any non-empty email and password are accepted.

Authentication state is stored in:

```text
localStorage
```

using:

```text
addis-eats-auth
```

> This is a demonstration authentication system and is not intended for production security.

---

### 💳 TeleBirr Delivery

The checkout page contains delivery information fields:

- Full Name
- TeleBirr Phone Number
- Delivery Area

The TeleBirr phone number is validated using:

```javascript
/^(?:\+251|0)9\d{8}$/;
```

---

### ❌ Not Found Page

Unknown URLs display a custom 404 page.

Example:

```text
/anything-that-does-not-exist
```

The application displays:

```text
404
Page Not Found
```

---

## 🧩 Main Components

### `Layout.jsx`

Provides the shared application structure.

It contains:

- Header
- Navigation
- Cart count
- Sign-in/sign-out navigation
- `Outlet`
- Footer
