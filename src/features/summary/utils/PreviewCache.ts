interface CacheEntry<T> {
  timestamp: number;
  data: T;
  version: string;
}

export class PreviewCache {
  private static instance: PreviewCache;
  private cache: Map<string, CacheEntry<string>>;
  private maxCacheSize: number;
  private cacheTTL: number;

  private constructor() {
    this.cache = new Map();
    this.maxCacheSize = 10; 
    this.cacheTTL = 30 * 60 * 1000;
  }

  public static getInstance(): PreviewCache {
    if (!PreviewCache.instance) {
      PreviewCache.instance = new PreviewCache();
    }
    return PreviewCache.instance;
  }

  public get(key: string): string | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    // Check if the entry has expired
    if (Date.now() - entry.timestamp > this.cacheTTL) {
      console.log(`Cache entry for ${key} has expired`);
      this.cache.delete(key);
      return null;
    }
    
    // Update timestamp on access to implement LRU behavior
    entry.timestamp = Date.now();
    this.cache.set(key, entry);
    return entry.data;
  }

  public set(key: string, data: string, version: string): void {
    // Check if we need to evict entries due to cache size limit
    if (this.cache.size >= this.maxCacheSize) {
      this.evictOldestEntry();
    }
    
    // Store the data with a timestamp and version
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      version,
    });
  }

  private evictOldestEntry(): void {
    let oldestKey: string | null = null;
    let oldestTimestamp = Infinity;
    
    // Find the oldest entry
    for (const [key, entry] of this.cache.entries()) {
      if (entry.timestamp < oldestTimestamp) {
        oldestTimestamp = entry.timestamp;
        oldestKey = key;
      }
    }
    
    // Delete the oldest entry
    if (oldestKey) {
      console.log(`Evicting oldest cache entry: ${oldestKey}`);
      this.cache.delete(oldestKey);
    }
  }
  
  // Check if an entry exists without updating its timestamp
  public has(key: string): boolean {
    return this.cache.has(key);
  }
  
  // Clear all entries
  public clear(): void {
    this.cache.clear();
  }
  
  // Clear cache entries specific to a project
  public clearForProject(projectId: number): void {
    for (const key of this.cache.keys()) {
      if (key.includes(`template_${projectId}`)) {
        this.cache.delete(key);
      }
    }
  }
}
