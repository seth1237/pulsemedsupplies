# Pulsemed Admin System Setup

## Overview

The Pulsemed website now includes a complete admin system with:
- Product management system with JSON data storage
- Admin authentication and dashboard
- Product editing and image management
- Department-based product organization

## Product Data

All products are stored in `/public/products.json` with the following structure:

```json
{
  "products": [
    {
      "id": 1,
      "name": "Product Name",
      "department": "Department Name",
      "description": "Short description",
      "specs": "Detailed specifications",
      "image": "/products/image.png"
    }
  ]
}
```

### Current Departments

- Laboratory Set Up
- Triage & Emergency
- ICU Setup
- Radiology Department
- Dental Setup

**Total Products: 27**

## Admin Access

### Login Credentials

```
Username: admin
Password: pulsemed@2024
```

### Admin Routes

- **Login Page:** `/admin/login`
- **Dashboard:** `/admin/dashboard`
- **Admin Panel:** `/admin`

### Features

#### Dashboard

The admin dashboard provides:

1. **Statistics**
   - Total number of products
   - Number of departments
   - Count of products with images

2. **Department Filtering**
   - Filter products by department
   - View all products or single department
   - Quick statistics for each view

3. **Product Management**
   - View all products in a table format
   - Edit product details (name, description, specs)
   - Update product image paths
   - Track image status (Added / Missing)

4. **Edit Modal**
   - Inline editing of product information
   - Update specifications and descriptions
   - Change product image paths

## How to Use

### Accessing Admin Panel

1. Navigate to `http://localhost:3000/admin`
2. You'll be redirected to login if not authenticated
3. Enter credentials:
   - Username: `admin`
   - Password: `pulsemed@2024`
4. Access the dashboard with all product management tools

### Editing Products

1. On the dashboard, select the department filter if needed
2. Find the product you want to edit
3. Click the "Edit" button
4. Update any of the following:
   - Product Name
   - Description
   - Specifications
   - Image Path
5. Click "Save Changes" to apply updates

### Adding Product Images

1. Place image files in `/public/products/`
2. Edit the product in the dashboard
3. In the "Image Path" field, enter: `/products/image-name.png`
4. Save changes

## Frontend Integration

### Product Display

Products are loaded from `products.json` and displayed in:

1. **Home Page** - Shows first 6 products
2. **Product Detail Page** - Full product view with specifications
3. **Other Products Section** - 3 products on mobile, 6 on desktop

### Components

- **ProductList** (`/components/product-list.tsx`) - Loads and displays products from JSON
- **ProductCard** (`/components/product-card.tsx`) - Individual product card component
- **Product Detail Page** (`/app/products/[id]/page.tsx`) - Full product details

## Configuration

### Admin Credentials

Edit `/lib/admin-config.ts` to change admin credentials:

```typescript
export const ADMIN_CREDENTIALS = {
  username: "admin",
  password: "pulsemed@2024"
};
```

## Security Notes

⚠️ **Important:** The current authentication uses client-side token storage in `localStorage`. For production:

1. Move credentials to environment variables
2. Implement proper server-side authentication
3. Use JWT or session-based authentication
4. Add HTTPS enforcement
5. Implement role-based access control

## Departments Management

Departments are displayed in:

- Footer (left-right layout on desktop, 2-column on mobile)
- Admin dashboard
- Product filtering

Current departments:
1. Chief Executive Officer
2. Marketing Department
3. Finance Department
4. Human Resources
5. IT Department

## Contact Information

- **WhatsApp:** +254 716 193821
- **Phone:** +254 716 193986
- **Email:** arstenyxltd254@gmail.com
- **Facebook:** https://www.facebook.com/profile.php?id=61590708625873

## Troubleshooting

### Can't access admin dashboard

- Clear browser localStorage: `localStorage.removeItem('admin_token')`
- Try logging in again from `/admin/login`
- Check browser console for errors

### Products not loading

- Verify `/public/products.json` exists and is valid JSON
- Check network tab in developer tools
- Ensure file path is correct

### Images not showing

- Verify image files exist in `/public/products/`
- Check the image path in the product entry
- Ensure correct file extension (.png, .jpg, etc.)

## Development

### Running Locally

```bash
pnpm dev
```

Then visit:
- Homepage: http://localhost:3000
- Admin Login: http://localhost:3000/admin/login
- Admin Dashboard: http://localhost:3000/admin/dashboard

### Building for Production

```bash
pnpm build
pnpm start
```
