import { WatchlistService } from "../src/watchlist/watchlist.service";
import { InMemoryWatchlistRepository } from "./helpers/in-memory-repositories";
import { TestProductProvider } from "./helpers/test-product-provider";

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

describe("WatchlistService", () => {
  it("stores a product snapshot when adding an item", async () => {
    const service = new WatchlistService(
      new InMemoryWatchlistRepository(),
      new TestProductProvider(products)
    );

    const item = await service.add(1);

    expect(item.title).toBe("Classic Watch");
    expect(item.price).toBe(99.99);
  });

  it("rejects duplicate watchlist items", async () => {
    const repository = new InMemoryWatchlistRepository();
    const service = new WatchlistService(repository, new TestProductProvider(products));
    await service.add(1);

    await expect(service.add(1)).rejects.toMatchObject({
      statusCode: 409
    });
  });

  it("returns a 404-style error when the product does not exist", async () => {
    const service = new WatchlistService(
      new InMemoryWatchlistRepository(),
      new TestProductProvider(products)
    );

    await expect(service.add(999)).rejects.toMatchObject({
      statusCode: 404
    });
  });
});