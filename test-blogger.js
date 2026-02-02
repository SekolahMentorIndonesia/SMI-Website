// Test script to verify Blogger Blog ID and content
const BLOG_ID = '1722387930275850186';

// Test URLs
const API_KEY = 'AIzaSyDboVTZFdnrtBS-Mq7ebFRq2WgYtl-BlW4'; // Key from .env
const TEST_URLS = {
  blogInfo: `https://www.googleapis.com/blogger/v3/blogs/${BLOG_ID}?key=${API_KEY}`,
  posts: `https://www.googleapis.com/blogger/v3/blogs/${BLOG_ID}/posts?key=${API_KEY}&maxResults=10`,
  rss: `https://www.blogger.com/feeds/${BLOG_ID}/posts/default?alt=rss&max-results=10`,
  directBlog: `https://sekolahmentorindonesia.blogspot.com/`
};

async function testBloggerAPI() {
  console.log('=== Testing Blogger API ===');
  
  try {
    // Test 1: Blog Info
    console.log('Test 1: Blog Info');
    const blogResponse = await fetch(TEST_URLS.blogInfo);
    const blogData = await blogResponse.json();
    console.log('Blog Info:', blogData);
    
    // Test 2: Posts
    console.log('\nTest 2: Posts API');
    const postsResponse = await fetch(TEST_URLS.posts);
    const postsData = await postsResponse.json();
    console.log('Posts API Response:', postsData);
    console.log('Number of posts:', postsData.items?.length || 0);
    
    if (postsData.items && postsData.items.length > 0) {
      console.log('First post:', postsData.items[0]);
      console.log('First post title:', postsData.items[0].title);
      console.log('First post URL:', postsData.items[0].url);
      console.log('First post labels:', postsData.items[0].labels);
    }
    
  } catch (error) {
    console.error('Error testing Blogger API:', error);
  }
}

// Run test
testBloggerAPI();
