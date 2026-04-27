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
  }
];

describe("products integration", () => {
  it("lists products and retrieves a single product", async () => {
    const { app } = createTestApp({ products });

    const listResponse = await apiRequest(app, {
      method: "GET",
      url: "/products"
    });
    expect(listResponse.status).toBe(200);
    expect(listResponse.body.data).toHaveLength(1);

    const detailResponse = await apiRequest(app, {
      method: "GET",
      url: "/products/1"
    });
    expect(detailResponse.status).toBe(200);
    expect(detailResponse.body.data.title).toBe("Classic Watch");
  });
  it("returns 404 for an unknown product", async () => {
    const { app } = createTestApp({ products });

    const response = await apiRequest(app, {
      method: "GET",
      url: "/products/999"
    });
    expect(response.status).toBe(404);
  });

  it("returns 502 when the upstream provider fails", async () => {
    const { app } = createTestApp({ products, productFailureMode: "list" });

    const response = await apiRequest(app, {
      method: "GET",
      url: "/products"
    });
    expect(response.status).toBe(502);
  });
});