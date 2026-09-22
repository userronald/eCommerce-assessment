import { API_BASE_URL } from "../utils/config.js";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  const responseText = await response.text();
  let data = null;

  if (responseText) {
    try {
      data = JSON.parse(responseText);
    } catch {
      data = responseText;
    }
  }

  if (!response.ok) {
    const detail = typeof data === "string" ? data : data?.message;
    throw new Error(
      `API request failed: ${options.method ?? "GET"} ${path} (${response.status})${detail ? ` - ${detail}` : ""}`,
    );
  }

  return data;
}

async function getProducts() {
  return await getCollection("/products", "products");
}

async function getProductById(id) {
  return await requestObject(
    `/products/${encodeURIComponent(id)}`,
    {},
    "product",
  );
}

async function createProduct(product) {
  return await requestObject(
    "/products",
    {
      method: "POST",
      body: JSON.stringify(product),
    },
    "product",
  );
}

async function updateProduct(id, product) {
  return await requestObject(
    `/products/${encodeURIComponent(id)}`,
    {
      method: "PUT",
      body: JSON.stringify(product),
    },
    "product",
  );
}

async function deleteProduct(id) {
  return await request(`/products/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}

async function getCategories() {
  return await getCollection("/categories", "categories");
}

async function createCategory(category) {
  return await requestObject(
    "/categories",
    {
      method: "POST",
      body: JSON.stringify(category),
    },
    "category",
  );
}

async function updateCategory(id, category) {
  return await requestObject(
    `/categories/${encodeURIComponent(id)}`,
    {
      method: "PUT",
      body: JSON.stringify(category),
    },
    "category",
  );
}

async function deleteCategory(id) {
  return await request(`/categories/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}

async function getUsers() {
  return await getCollection("/users", "users");
}

async function createUser(user) {
  return await requestObject(
    "/users",
    {
      method: "POST",
      body: JSON.stringify(user),
    },
    "user",
  );
}

async function createOrder(order) {
  return await requestObject(
    "/orders",
    {
      method: "POST",
      body: JSON.stringify(order),
    },
    "order",
  );
}

async function getOrders() {
  return await getCollection("/orders", "orders");
}

async function getCollection(path, resourceName) {
  const response = await request(path);
  if (!Array.isArray(response)) {
    throw new Error(`API returned invalid ${resourceName} data.`);
  }
  return response.filter(
    (item) => item && typeof item === "object" && !Array.isArray(item),
  );
}

async function requestObject(path, options, resourceName) {
  const response = await request(path, options);
  if (!response || typeof response !== "object" || Array.isArray(response)) {
    throw new Error(`API returned invalid ${resourceName} data.`);
  }
  return response;
}

export {
  createCategory,
  createOrder,
  createProduct,
  createUser,
  deleteCategory,
  deleteProduct,
  getCategories,
  getOrders,
  getProductById,
  getProducts,
  getUsers,
  request,
  updateCategory,
  updateProduct,
};
