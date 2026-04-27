import crypto from "node:crypto";

import type { WatchlistItemRecord, WatchlistRepository } from "../../src/repositories/interfaces";

export class InMemoryWatchlistRepository implements WatchlistRepository {
  private readonly items = new Map<string, WatchlistItemRecord>();

  async list(): Promise<WatchlistItemRecord[]> {
    return [...this.items.values()].sort((a, b) => b.addedAt.getTime() - a.addedAt.getTime());
  }

  async findByProductId(externalProductId: number): Promise<WatchlistItemRecord | null> {
    return [...this.items.values()].find((item) => item.externalProductId === externalProductId) ?? null;
  }
  async create(input: {
    externalProductId: number;
    title: string;
    price: number;
    image: string;
    category: string;
  }): Promise<WatchlistItemRecord> {
    const now = new Date();
    const item: WatchlistItemRecord = {
      id: crypto.randomUUID(),
      externalProductId: input.externalProductId,
      title: input.title,
      price: input.price,
      image: input.image,
      category: input.category,
      addedAt: now
    };

    this.items.set(item.id, item);
    return item;
  }

  async deleteByProductId(externalProductId: number): Promise<boolean> {
    const match = [...this.items.values()].find((item) => item.externalProductId === externalProductId);

    if (!match) {
      return false;
    }

    this.items.delete(match.id);
    return true;
  }
}