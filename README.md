# 🛒 Modern Full-Stack E-Commerce Application

A fully functional, responsive E-commerce platform built with **Next.js 15 (App Router)**, **MongoDB**, and **Tailwind CSS**. This project features a complete shopping flow from product discovery to checkout, including user authentication, address management, and a customer review system.

![Project Preview](public/preview.png)
*(Note: Upload a screenshot of your homepage here and update the path)*

## 🚀 Tech Stack

* **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
* **Database:** [MongoDB](https://www.mongodb.com/) (via Mongoose)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)
* **Authentication:** [NextAuth.js](https://next-auth.js.org/)
* **State Management:** [Zustand](https://github.com/pmndrs/zustand) (Cart persistence)
* **Payment:** Stripe & Cash on Delivery (COD) support
* **Language:** TypeScript

---

## ✨ Key Features

### 🛍️ Shopping Experience
* **Product Gallery:** High-quality image gallery with main image preview and thumbnails.
* **Product Details:** Comprehensive product info including sizes, colors, and dynamic price updates.
* **Smart Cart:** * Add/Remove items.
    * Adjust quantities.
    * **Select/Deselect items** for checkout (Buy only what you want).
    * Real-time subtotal calculation.

### 👤 User Account & Checkout
* **Address Management:** * Save multiple shipping addresses permanently.
    * **CRUD Operations:** Add new, Edit existing, and Select active address.
    * Auto-selects the most recently used address.
* **Secure Checkout:** Integrated checkout flow with address selection and payment method choice (Card/COD).

### ⭐ Reviews & Ratings
* **5-Star Rating System:** Users can leave star ratings and written reviews.
* **Real-time Stats:** Automatically calculates average rating and total review count per product.
* **Interactive UI:** Dynamic star selection and review submission form.

---

## 🛠️ Installation & Setup

Follow these steps to run the project locally.

### 1. Clone the repository
```bash
git clone [https://github.com/maheladissanayaka/my-ecommerce-store.git](https://github.com/maheladissanayaka/my-ecommerce-store.git)
cd my-ecommerce-store

├── app/
│   ├── (shop)/           # Shop pages (Cart, Product Details)
│   ├── api/              # Backend API Routes
│   ├── checkout/         # Checkout specific components
│   └── page.tsx          # Homepage
├── components/           # Reusable UI components
├── lib/                  # DB connection & Auth config
├── models/               # Mongoose Schemas (User, Product, Order)
├── store/                # Zustand State (Cart)
└── public/               # Static assets