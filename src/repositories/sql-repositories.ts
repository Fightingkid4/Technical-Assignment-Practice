import type { Pool } from "pg";

import type { WatchlistItemRecord, WatchlistRepository } from "./interfaces";

interface WatchlistItemRow {
  id: string;
  external_product_id: number;
  title: string;
  price: string;
  image: string;
  category: string;
  added_at: Date;
}

const mapWatchlistItem = (row: WatchlistItemRow): WatchlistItemRecord => ({
  id: row.id,
  externalProductId: row.external_product_id,
  title: row.title,
  price: Number(row.price),
  image: row.image,
  category: row.category,
  addedAt: row.added_at
});

export class SqlWatchlistRepository implements WatchlistRepository {
  constructor(private readonly db: Pool) {}

  async list(): Promise<WatchlistItemRecord[]> {
    const result = await this.db.query<WatchlistItemRow>(
      `SELECT id, external_product_id, title, price, image, category, added_at
       FROM watchlist_items
       ORDER BY added_at DESC`
    );

    return result.rows.map(mapWatchlistItem);
  }

  async findByProductId(externalProductId: number): Promise<WatchlistItemRecord | null> {
    const result = await this.db.query<WatchlistItemRow>(
      `SELECT id, external_product_id, title, price, image, category, added_at
       FROM watchlist_items
       WHERE external_product_id = $1
       LIMIT 1`,
      [externalProductId]
    );

    return result.rows[0] ? mapWatchlistItem(result.rows[0]) : null;
  }

  async create(input: {
    externalProductId: number;
    title: string;
    price: number;
    image: string;
    category: string;
  }): Promise<WatchlistItemRecord> {
    const result = await this.db.query<WatchlistItemRow>(
      `INSERT INTO watchlist_items (external_product_id, title, price, image, category)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, external_product_id, title, price, image, category, added_at`,
      [input.externalProductId, input.title, input.price, input.image, input.category]
    );

    return mapWatchlistItem(result.rows[0]);
  }

  async deleteByProductId(externalProductId: number): Promise<boolean> {
    const result = await this.db.query(
      `DELETE FROM watchlist_items
       WHERE external_product_id = $1`,
      [externalProductId]
    );

    return (result.rowCount ?? 0) > 0;
  }
}