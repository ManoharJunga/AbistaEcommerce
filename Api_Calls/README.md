# API Documentation

## **Addresses**
### **Endpoints:**
- **GET** `/api/addresses`
  - **Description:** Fetch all addresses.

- **POST** `/api/addresses`
  - **Description:** Creates a new address and stores it in the database.

- **PUT** `/api/addresses/:id`
  - **Description:** Updates an existing address based on its unique ID.

- **DELETE** `/api/addresses/:id`
  - **Description:** Deletes an address based on its unique ID.

---

## **Customers**
### **Endpoints:**
- **POST** `/api/customer`
  - **Description:** Create a new customer.

- **GET** `/api/customer/:id`
  - **Description:** Retrieve customer details by ID.

---

## **Orders**
### **Endpoints:**
- **POST** `/api/order`
  - **Description:** Create a new order.

- **GET** `/api/order`
  - **Description:** Fetch all orders.

- **PUT** `/api/order/:id`
  - **Description:** Update the status of an order by ID.

---

## **Wishlist**
### **Endpoints:**
- **POST** `/api/wishlist`
  - **Description:** Add an item to the wishlist.

- **GET** `/api/wishlist`
  - **Description:** Fetch wishlist items.

- **DELETE** `/api/wishlist/:id`
  - **Description:** Remove an item from the wishlist.

---

## **Payments**
### **Endpoints:**
- **POST** `/api/payment`
  - **Description:** Add a new payment method.

- **GET** `/api/payment`
  - **Description:** Fetch all payment methods.

- **DELETE** `/api/payment/:id`
  - **Description:** Delete a payment method by ID.

---

## **OTP**
### **Endpoints:**
- **POST** `/api/otp/send`
  - **Description:** Send OTP for verification.

- **POST** `/api/otp/verify`
  - **Description:** Verify OTP.

---

## **Categories**
### **Endpoints:**
- **POST** `/api/categories`
  - **Description:** Add a new category.

- **GET** `/api/categories`
  - **Description:** Fetch all categories.

- **GET** `/api/categories/:id`
  - **Description:** Fetch a category by ID.

- **DELETE** `/api/categories/:id`
  - **Description:** Delete a category by ID.

---

## **Subcategories**
### **Endpoints:**
- **POST** `/api/subcategories`
  - **Description:** Add a new subcategory with an image.

- **GET** `/api/subcategories`
  - **Description:** Fetch all subcategories.

- **GET** `/api/subcategories/:id`
  - **Description:** Fetch a subcategory by ID.

- **PUT** `/api/subcategories/:id`
  - **Description:** Update a subcategory.

- **DELETE** `/api/subcategories/:id`
  - **Description:** Delete a subcategory by ID.

---

## **Reports**
### **Endpoints:**
- **GET** `/api/reports/dashboard`
  - **Description:** Fetch dashboard report.

---

## **Slideshow**
### **Endpoints:**
- **POST** `/api/slideshow`
  - **Description:** Add a new slideshow with an image.

- **GET** `/api/slideshow`
  - **Description:** Fetch all slideshows.

- **GET** `/api/slideshow/:id`
  - **Description:** Fetch slideshow details by ID.

- **DELETE** `/api/slideshow/:id`
  - **Description:** Delete a slideshow by ID.

---

## **Products**
### **Endpoints:**
- **POST** `/api/products/upload`
  - **Description:** Upload product images and add a product.

- **GET** `/api/products/get`
  - **Description:** Fetch all products.

---

## **Projects**
### **Endpoints:**
- **POST** `/api/projects`
  - **Description:** Add a new project with an image.

- **GET** `/api/projects`
  - **Description:** Fetch all projects.

- **GET** `/api/projects/:id`
  - **Description:** Fetch project details by ID.

- **DELETE** `/api/projects/:id`
  - **Description:** Delete a project by ID.

---

## **Interactions**
### **Endpoints:**
- **POST** `/api/interactions/save`
  - **Description:** Save an interaction.

- **GET** `/api/interactions/customer/:userId`
  - **Description:** Fetch interactions for a customer.

- **GET** `/api/interactions/all`
  - **Description:** Fetch all interactions.

- **DELETE** `/api/interactions/:id`
  - **Description:** Delete an interaction.

