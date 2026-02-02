// Content Management System Types untuk SMI Website
// Support: Blogger API, JSON, Markdown

export const CONTENT_TARGET = {
  LANDING: 'landing',    // Tampil di landing page
  WEBSITE: 'website',    // Tampil di website utama
  BOTH: 'both'          // Tampil di keduanya
};

export const CONTENT_TYPE = {
  ARTIKEL: 'artikel',
  EBOOK: 'ebook',
  VIDEO: 'video'
};

export const CONTENT_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived'
};

export const PRODUCT_TYPE = {
  COMMUNITY: 'community',
  PRIVATE_MENTORING: 'private_mentoring',
  CORPORATE: 'corporate'
};

export const ORDER_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  DELIVERY_PENDING: 'delivery_pending',
  DELIVERY_PROCESS: 'delivery_process',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

/**
 * Base Content Structure
 * Digunakan untuk semua jenis konten (artikel, ebook, video)
 */
export const ContentSchema = {
  id: 'string',                    // Unique ID
  title: 'string',                 // Judul konten
  slug: 'string',                  // URL-friendly slug
  excerpt: 'string',               // Ringkasan/deskripsi singkat
  content: 'string',               // Full content (HTML/Markdown)
  author: 'string',                // Author name
  authorAvatar: 'string',          // Author avatar URL
  publishedAt: 'datetime',         // Publish date
  updatedAt: 'datetime',           // Last updated
  readTime: 'number',              // Estimasi waktu baca (menit)
  featuredImage: 'string',         // Featured image URL
  
  // Tags untuk filtering
  target: 'string',                 // CONTENT_TARGET
  type: 'string',                   // CONTENT_TYPE
  category: 'string',              // Kategori (opsional)
  tags: 'array',                   // Array of strings
  
  // Metadata
  status: 'string',                 // CONTENT_STATUS
  seoTitle: 'string',              // SEO Title
  seoDescription: 'string',        // SEO Description
  seoKeywords: 'array',            // SEO Keywords
  
  // Engagement
  views: 'number',                  // View count
  likes: 'number',                  // Like count
  bookmarks: 'number',              // Bookmark count
  
  // Media khusus untuk type tertentu
  // Untuk EBOOK
  downloadUrl: 'string',           // Download URL (optional)
  fileSize: 'string',              // File size (optional)
  pageCount: 'number',             // Page count (optional)
  
  // Untuk VIDEO
  videoUrl: 'string',               // Video URL (optional)
  videoDuration: 'string',         // Duration (optional)
  thumbnailUrl: 'string',          // Video thumbnail (optional)
};

/**
 * Product Structure untuk Payment
 */
export const ProductSchema = {
  id: 'string',
  name: 'string',
  type: 'string',                   // PRODUCT_TYPE
  price: 'number',                  // Harga dalam Rupiah
  description: 'string',
  features: 'array',                // Array of features
  isActive: 'boolean',
  createdAt: 'datetime',
  updatedAt: 'datetime'
};

/**
 * Order Structure
 */
export const OrderSchema = {
  id: 'string',
  orderId: 'string',                // Unique order ID (format: SMI-YYYYMMDD-XXXX)
  productId: 'string',
  productType: 'string',            // PRODUCT_TYPE
  productName: 'string',
  amount: 'number',                 // Total amount
  status: 'string',                 // ORDER_STATUS
  paymentStatus: 'string',          // Status dari Midtrans
  
  // User data (dinamis berdasarkan produk)
  userData: 'object',               // Form data dari user
  
  // Payment gateway data
  paymentMethod: 'string',          // Payment method
  paymentUrl: 'string',             // Payment URL dari Midtrans
  transactionId: 'string',          // Transaction ID dari Midtrans
  paymentDate: 'datetime',          // Tanggal pembayaran
  
  // Delivery tracking
  deliveryStatus: 'string',         // pending, on_process, completed
  deliveryNotes: 'string',          // Catatan admin
  deliveredAt: 'datetime',         // Tanggal delivery selesai
  
  createdAt: 'datetime',
  updatedAt: 'datetime'
};

/**
 * Dynamic Form Fields untuk setiap produk
 */
export const ProductFormFields = {
  [PRODUCT_TYPE.COMMUNITY]: [
    {
      name: 'name',
      label: 'Nama Lengkap',
      type: 'text',
      required: true,
      placeholder: 'Masukkan nama lengkap Anda'
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      required: true,
      placeholder: 'email@example.com'
    },
    {
      name: 'telegramUsername',
      label: 'Username Telegram',
      type: 'text',
      required: true,
      placeholder: '@username_tanpa_at'
    }
  ],
  
  [PRODUCT_TYPE.PRIVATE_MENTORING]: [
    {
      name: 'name',
      label: 'Nama Lengkap',
      type: 'text',
      required: true,
      placeholder: 'Masukkan nama lengkap Anda'
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      required: true,
      placeholder: 'email@example.com'
    },
    {
      name: 'whatsapp',
      label: 'Nomor WhatsApp',
      type: 'tel',
      required: true,
      placeholder: '0812-3456-7890'
    },
    {
      name: 'mentoringTopic',
      label: 'Topik Mentoring',
      type: 'textarea',
      required: true,
      placeholder: 'Jelaskan topik yang ingin Anda pelajari'
    },
    {
      name: 'schedulePreference',
      label: 'Preferensi Jadwal',
      type: 'select',
      required: true,
      options: [
        { value: 'weekday', label: 'Weekday (Senin-Jumat)' },
        { value: 'weekend', label: 'Weekend (Sabtu-Minggu)' },
        { value: 'flexible', label: 'Fleksibel' }
      ]
    }
  ],
  
  [PRODUCT_TYPE.CORPORATE]: [
    {
      name: 'companyName',
      label: 'Nama Perusahaan',
      type: 'text',
      required: true,
      placeholder: 'PT. Contoh Perusahaan'
    },
    {
      name: 'businessEmail',
      label: 'Email Bisnis',
      type: 'email',
      required: true,
      placeholder: 'business@company.com'
    },
    {
      name: 'mentoringNeeds',
      label: 'Kebutuhan Mentoring',
      type: 'textarea',
      required: true,
      placeholder: 'Jelaskan kebutuhan mentoring untuk perusahaan Anda'
    },
    {
      name: 'participantCount',
      label: 'Jumlah Peserta',
      type: 'number',
      required: true,
      placeholder: '10'
    }
  ]
};

/**
 * Filter Options untuk Frontend
 */
export const FilterOptions = {
  target: [
    { value: CONTENT_TARGET.LANDING, label: 'Landing Page' },
    { value: CONTENT_TARGET.WEBSITE, label: 'Website Utama' },
    { value: CONTENT_TARGET.BOTH, label: 'Keduanya' }
  ],
  
  type: [
    { value: CONTENT_TYPE.ARTIKEL, label: 'Artikel' },
    { value: CONTENT_TYPE.EBOOK, label: 'Ebook' },
    { value: CONTENT_TYPE.VIDEO, label: 'Video' }
  ],
  
  category: [
    'Content Creation',
    'Digital Marketing',
    'Personal Branding',
    'Monetization',
    'Social Media',
    'Video Production',
    'Business Strategy',
    'Technology'
  ]
};

/**
 * API Response Templates
 */
export const ApiResponse = {
  success: (data, message = 'Success') => ({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  }),
  
  error: (message, code = 500) => ({
    success: false,
    message,
    error: {
      code,
      timestamp: new Date().toISOString()
    }
  })
};
