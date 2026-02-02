import * as bloggerService from './bloggerService';

// Content Management Service
// Delegating to bloggerService for API calls

class ApiResponse {
  static success(data, message = 'Success') {
    return {
      success: true,
      data,
      message
    };
  }

  static error(message, code = 500) {
    return {
      success: false,
      error: message,
      code
    };
  }
}

class ContentService {
  constructor() {
    // No config needed here, handled by bloggerService
  }

  /**
   * Helper: Generate Slug from Title
   */
  generateSlug(title) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }

  /**
   * Enrich Blogger Item with App-specific fields
   */
  enrichItem(item) {
    if (!item) return null;
    
    // Determine target from categories (labels)
    const target = item.categories.includes('landing') ? 'landing' : 
                   item.categories.includes('website') ? 'website' : 'website';
    
    // Type is already determined in bloggerService as contentType
    const type = item.contentType || 'artikel';

    // Generate stable slug
    const slug = this.generateSlug(item.title);

    return {
      ...item,
      // Overwrite or add fields expected by UI
      slug: slug,
      type: type,
      category: item.categories.filter(c => !['website', 'landing', 'artikel', 'video', 'ebook', 'tutorial'].includes(c))[0] || 'Content Creation',
      tags: item.categories,
      excerpt: item.description, // bloggerService description is already clean excerpt
      
      // SEO & Meta
      seoTitle: item.title,
      seoDescription: item.description,
      
      // Engagement (Mock for now, or real if available)
      views: Math.floor(Math.random() * 1000) + 100,
      
      // Additional
      target: target,
      author: 'Sekolah Mentor Indonesia',
      authorAvatar: '/logo.jpeg',
    };
  }

  /**
   * Get konten untuk landing page
   */
  async getLandingContent(limit = 6) {
    // 1. Try to fetch with 'landing' label first
    // let posts = await bloggerService.fetchFilteredContent('landing');
    
    // Fallback strategy was not enough, so we now fetch ALL content by default
    // to ensure posts appear even if the 'landing' label is missing or mistyped.
    let posts = await bloggerService.fetchFilteredContent('');
    
    // 2. Fallback: If no posts found, fetch all posts (no label filter)
    if (!posts || posts.length === 0) {
      posts = await bloggerService.fetchFilteredContent('');
    }

    const enriched = posts.map(p => this.enrichItem(p));
    return ApiResponse.success(enriched.slice(0, limit));
  }

  /**
   * Get konten untuk website utama
   */
  async getWebsiteContent(filters = {}) {
    // Fetch all posts to ensure content with 'landing' label or other labels also appear
    // This fixes the issue where users post with 'landing' label but expect it to show on the website
    let posts = await bloggerService.fetchFilteredContent('');

    if (!posts) posts = [];

    let enriched = posts.map(p => this.enrichItem(p));

    // Client-side filtering (since API only supports label filter)
    if (filters.type && filters.type !== 'all') {
      enriched = enriched.filter(item => item.type === filters.type);
    }
    if (filters.category && filters.category !== 'all') {
      enriched = enriched.filter(item => item.category === filters.category);
    }
    if (filters.search) {
      const term = filters.search.toLowerCase();
      enriched = enriched.filter(item => 
        item.title.toLowerCase().includes(term) || 
        item.excerpt.toLowerCase().includes(term)
      );
    }

    return ApiResponse.success(enriched);
  }

  /**
   * Get detail konten by slug
   * Note: Since we use generated slugs, we fetch all and find match.
   * If we used Blogger IDs or URLs as slugs, we could use search/byurl.
   */
  async getContentBySlug(slug) {
    // 1. Try to fetch from website content cache/list first
    const posts = await bloggerService.fetchFilteredContent('website');
    const enriched = posts.map(p => this.enrichItem(p));
    
    const content = enriched.find(item => item.slug === slug);
    
    if (content) {
      return ApiResponse.success(content);
    }

    // 2. If not found, maybe try search?
    // Reverse slug is hard, so we assume title matches slug somewhat
    const searchResults = await bloggerService.searchContent(slug.replace(/-/g, ' '));
    if (searchResults.length > 0) {
      // Find exact match if possible
      const exact = searchResults.find(p => this.generateSlug(p.title) === slug);
      if (exact) {
        return ApiResponse.success(this.enrichItem(exact));
      }
      // Or return first result
      return ApiResponse.success(this.enrichItem(searchResults[0]));
    }

    return ApiResponse.error('Content not found', 404);
  }

  /**
   * Get related content
   */
  async getRelatedContent(slug, limit = 3) {
    const contentResponse = await this.getContentBySlug(slug);
    if (!contentResponse.success) return contentResponse;

    const content = contentResponse.data;
    const allResponse = await this.getWebsiteContent(); // cached fetch ideally
    
    if (!allResponse.success) return ApiResponse.success([]);

    const related = allResponse.data
      .filter(item => 
        item.id !== content.id && 
        (item.type === content.type || item.category === content.category)
      )
      .slice(0, limit);

    return ApiResponse.success(related);
  }
}

export default new ContentService();
