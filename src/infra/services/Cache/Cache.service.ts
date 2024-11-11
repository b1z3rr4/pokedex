import { Injectable } from '@angular/core';
import { CacheState } from '../../utils/types';

@Injectable({
  providedIn: 'root',
})
export class CacheService {
  private cache: Map<string, CacheState<unknown>> = new Map();
  private cacheExpirationTime: number = 3600000;

  constructor() {}

  private isCacheExpired(timestamp: number): boolean {
    return Date.now() - timestamp > this.cacheExpirationTime;
  }

  public cacheData<T>(key: string, data: T): void {
    const cacheEntry: CacheState<T> = { data, timestamp: Date.now() };
    this.cache.set(key, cacheEntry);
  }

  public getCachedData<T>(key: string): T | null {
    const cachedData = this.cache.get(key);

    if (cachedData && !this.isCacheExpired(cachedData.timestamp)) {
      return cachedData.data as T;
    }

    this.cache.delete(key);
    return null;
  }

  public clearCache(): void {
    this.cache.clear();
  }
}
