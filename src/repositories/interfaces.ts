export interface WatchlistItemRecord {
  id: string;
  externalProductId: number;
  title: string;
  price: number;
  image: string;
  category: string;
  addedAt: Date;
}

export interface WatchlistRepository {
  list(): Promise<WatchlistItemRecord[]>;
  findByProductId(externalProductId: number): Promise<WatchlistItemRecord | null>;
  create(input: {
    externalProductId: number;
    title: string;
    price: number;
    image: string;
    category: string;
  }): Promise<WatchlistItemRecord>;
  deleteByProductId(externalProductId: number): Promise<boolean>;
}