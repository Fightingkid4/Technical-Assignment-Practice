import { createTestApp } from "./helpers/test-app";
import { apiRequest } from "./helpers/http";

const products = [
  {
    id: 1,
    title: "Classic Watch",
    price: 99.99,
    description: "A watch",
    category: "accessories",
    image: "https://example.com/watch.jpg"
  },
  {
    id: 2,
    title: "Running Shoes",
    price: 149.5,
    description: "Shoes",
    category: "fashion",
    image: "https://example.com/shoes.jpg"
  }
];

describe("watchlist integration", () => {
  it("adds, lists, and removes watchlist items", async () => {
    const { app } = createTestApp({ products });

    const addResponse = await apiRequest(app, {
      method: "POST",
      url: "/watchlist",
      body: { productId: 1 }
    });

    expect(addResponse.status).toBe(201);
    expect(addResponse.body.data.title).toBe("Classic Watch");
    const listResponse = await apiRequest(app, {
      method: "GET",
      url: "/watchlist"
    });

    expect(listResponse.status).toBe(200);
    expect(listResponse.body.data).toHaveLength(1);

    const deleteResponse = await apiRequest(app, {
      method: "DELETE",
      url: "/watchlist/1"
    });

    expect(deleteResponse.status).toBe(204);
  });

  it("rejects duplicate adds and missing products", async () => {
    const { app } = createTestApp({ products });

    await apiRequest(app, {
      method: "POST",
      url: "/watchlist",
      body: { productId: 1 }
    });

    const duplicateResponse = await apiRequest(app, {
      method: "POST",
      url: "/watchlist",
      body: { productId: 1 }
    });

    expect(duplicateResponse.status).toBe(409);

    const missingProductResponse = await apiRequest(app, {
      method: "POST",
      url: "/watchlist",
      body: { productId: 999 }
    });

    expect(missingProductResponse.status).toBe(404);
  });
  it("returns 404 when deleting a non-existent item", async () => {
    const { app } = createTestApp({ products });

    const missingDeleteResponse = await apiRequest(app, {
      method: "DELETE",
      url: "/watchlist/999"
    });

    expect(missingDeleteResponse.status).toBe(404);
  });

  it("returns 502 when product lookup fails upstream", async () => {
    const { app } = createTestApp({ products, productFailureMode: "item" });

    const response = await apiRequest(app, {
      method: "POST",
      url: "/watchlist",
      body: { productId: 1 }
    });

    expect(response.status).toBe(502);
  });
});