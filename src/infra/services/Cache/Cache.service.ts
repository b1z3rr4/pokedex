import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CacheService {
  private cache: Map<string, any> = new Map();
  private cacheExpirationTime: number = 3600000;

  constructor() {}

  private isCacheExpired(timestamp: number): boolean {
    return Date.now() - timestamp > this.cacheExpirationTime;
  }

  public cacheData(key: string, data: any): void {
    const cacheEntry = { data, timestamp: Date.now() };
    this.cache.set(key, cacheEntry);
  }

  public getCachedData<T>(key: string): T | null {
    const cachedData = this.cache.get(key);

    console.log({ key, cachedData})

    if (cachedData && !this.isCacheExpired(cachedData.timestamp)) {
      return cachedData.data;
    }

    this.cache.delete(key);
    return null;
  }

  public clearCache(): void {
    this.cache.clear();
  }
}
