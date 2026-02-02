
// Blogger Service - Client Side Implementation
// Fetches directly from Google Blogger API v3 using public API Key

const API_KEY = import.meta.env.VITE_BLOGGER_API_KEY;
const BLOG_ID = import.meta.env.VITE_BLOGGER_BLOG_ID;
const BASE_URL = import.meta.env.VITE_BLOGGER_BASE_URL || 'https://www.googleapis.com/blogger/v3';

// Helper: Extract first image from HTML content
const extractFirstImage = (content) => {
  if (!content) return '';
  const imgMatch = content.match(/<img[^>]+src="([^">]+)"/);
  return imgMatch ? imgMatch[1] : '';
};

// Helper: Estimate reading time
const estimateReadingTime = (content) => {
  const text = (content || '').replace(/<[^>]*>/g, '');
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
};

// Helper: Transform Blogger API Item to App Content Format
const transformBloggerItem = (item) => {
  // Skip invalid items
  if (!item || !item.title) return null;

  const rawContent = item.content || ''; // V3 API uses 'content'
  const cleanDescription = (rawContent).replace(/<[^>]*>/g, '').substring(0, 200) + '...';
  
  // V3 labels are strings
  const categories = item.labels || [];
  
  // Determine content type
  const contentType = categories.includes('video') ? 'video' : 
                    categories.includes('ebook') ? 'ebook' : 
                    categories.includes('tutorial') ? 'tutorial' : 'artikel';

  return {
    id: item.id,
    title: item.title,
    link: item.url, // V3 API provides 'url'
    description: cleanDescription,
    content: rawContent,
    pubDate: item.published,
    categories: categories,
    contentType: contentType,
    image: extractFirstImage(rawContent),
    formattedDate: new Date(item.published).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    readingTime: estimateReadingTime(rawContent)
  };
};

// Core Fetch Function
const fetchFromBloggerAPI = async (endpoint, params = {}) => {
  try {
    const url = new URL(`${BASE_URL}/blogs/${BLOG_ID}/${endpoint}`);
    url.searchParams.append('key', API_KEY);
    
    Object.keys(params).forEach(key => {
        if (params[key]) url.searchParams.append(key, params[key]);
    });

    const response = await fetch(url.toString());
    
    if (!response.ok) {
      console.error(`API Error: ${response.status} ${response.statusText}`);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching from Blogger API:', error);
    return null;
  }
};

/**
 * Fetch content filtered by location (label) and optional type
 * @param {string} location - Label to filter by (e.g., 'website', 'landing')
 * @param {string} contentType - Optional content type filter
 */
export const fetchFilteredContent = async (location, contentType = null) => {
  try {
    const data = await fetchFromBloggerAPI('posts', {
      labels: location,
      maxResults: 50,
      status: 'live' // Only live posts
    });

    // Ensure we have an array
    const items = data && data.items ? data.items : [];

    const posts = items.map(transformBloggerItem).filter(post => post !== null);

    // Sort by date (newest first) is default in Blogger API, but good to ensure
    // const sortedPosts = posts.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

    if (contentType) {
      return posts.filter(post => post.contentType === contentType);
    }

    return posts;
  } catch (error) {
    console.error('Error in fetchFilteredContent:', error);
    return [];
  }
};

/**
 * Get Content by URL (using Blogger API byurl)
 */
export const getContentByUrl = async (postUrl) => {
  try {
    const data = await fetchFromBloggerAPI('posts/byurl', { url: postUrl });
    if (!data || data.error) return null;
    return transformBloggerItem(data);
  } catch (error) {
    console.error('Error in getContentByUrl:', error);
    return null;
  }
};

/**
 * Search Content (using Blogger API search)
 */
export const searchContent = async (query) => {
  try {
    const data = await fetchFromBloggerAPI('posts/search', { q: query });
    const items = data && data.items ? data.items : [];
    return items.map(transformBloggerItem).filter(post => post !== null);
  } catch (error) {
    console.error('Error in searchContent:', error);
    return [];
  }
};

/**
 * Get featured posts (latest from each category)
 * @param {string} location - Label to filter by
 */
export const getFeaturedPosts = async (location) => {
  try {
    // Fetch all posts for the location
    const posts = await fetchFilteredContent(location);
    
    const types = ['artikel', 'video', 'ebook', 'tutorial'];
    const featured = [];
    
    // Pick the latest post for each type
    types.forEach(type => {
      const post = posts.find(p => p.contentType === type);
      if (post) featured.push(post);
    });

    return featured;
  } catch (error) {
    console.error('Error in getFeaturedPosts:', error);
    return [];
  }
};

// Deprecated exports (kept to avoid breaking imports if any, but they are replaced)
// export const fetchBloggerJSON = ... 
// export const fetchRSSFeed = ...
