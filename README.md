# Bayt Organic E-commerce

A Next.js e-commerce application for organic products with a MongoDB database and Azure Blob Storage for images.

## Features

- **Product Management**: Create, update, and delete products with images stored in Azure Blob Storage
- **Category and Collection Management**: Organize products into categories and collections
- **Shopping Cart**: Add products to cart, update quantities, and checkout
- **Order Management**: Process and track orders
- **User Authentication**: Sign up, sign in, and manage user profiles
- **Admin Dashboard**: Manage products, categories, collections, and orders

## Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS, Radix UI
- **Backend**: Next.js Server Actions, Prisma ORM
- **Database**: MongoDB
- **Storage**: Azure Blob Storage
- **Authentication**: Custom token-based authentication

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- MongoDB database
- Azure Storage account

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables in `.env`:
   ```
   DATABASE_URL="your-mongodb-connection-string"
   AZURE_STORAGE_CONNECTION_STRING="your-azure-storage-connection-string"
   ```
4. Generate Prisma client:
   ```bash
   npm run prisma:generate
   ```
5. Push the database schema:
   ```bash
   npm run prisma:push
   ```
6. Seed the database with initial data:
   ```bash
   npm run seed
   ```
7. Initialize Azure Blob Storage container:
   ```bash
   npm run init:azure
   ```
8. Start the development server:
   ```bash
   npm run dev
   ```

### Default Users

After seeding the database, you can log in with the following credentials:

- **Admin User**:
  - Email: admin@example.com
  - Password: admin123

- **Customer User**:
  - Email: customer@example.com
  - Password: customer123

## Project Structure

- `/app`: Next.js app router pages and layouts
- `/app/actions`: Server actions for CRUD operations
- `/app/api`: API routes for initialization and other server-side operations
- `/components`: Reusable UI components
- `/lib`: Utility functions and shared code
- `/prisma`: Prisma schema and database utilities
- `/scripts`: Utility scripts for initialization and setup

## Server Actions

The application uses Next.js Server Actions for all data operations:

- `auth.action.ts`: User authentication and profile management
- `products.action.ts`: Product CRUD operations
- `categories.action.ts`: Category CRUD operations
- `collections.action.ts`: Collection CRUD operations
- `cart.action.ts`: Shopping cart operations
- `orders.action.ts`: Order processing and management

## Azure Blob Storage

Images are stored in Azure Blob Storage. The `lib/azure-storage.ts` file provides utilities for:

- Uploading images
- Deleting images
- Getting image URLs

The application initializes the Azure Blob Storage container in two ways:
1. Using the `npm run init:azure` script
2. Automatically when the application starts, via the `/api/azure-init` API route

## Database Schema

The database schema is defined in `prisma/schema.prisma` and includes the following models:

- User
- Product
- Category
- Collection
- Cart
- CartItem
- Order
- OrderItem
- Address
- Review
- Discount

## Troubleshooting

If you encounter issues with Azure Blob Storage initialization, you can:

1. Check your Azure Storage connection string in the `.env` file
2. Run the initialization script manually: `npm run init:azure`
3. Check the browser console for any error messages

## License

This project is licensed under the MIT License. 