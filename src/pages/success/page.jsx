import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams, Link, useNavigate } from 'react-router';
import { 
  CheckCircle, 
  Copy, 
  ExternalLink, 
  MessageCircle,
  Calendar,
  Users,
  UserCheck,
  Building
} from 'lucide-react';
import { toast } from 'sonner';

export function meta() {
  return [
    { title: "Pembayaran Berhasil - Sekolah Mentor Indonesia" },
    { 
      name: "description", 
      content: "Pembayaran Anda berhasil! Dapatkan akses ke layanan premium Sekolah Mentor Indonesia." 
    },
    { property: "og:title", content: "Pembayaran Berhasil - Sekolah Mentor Indonesia" },
    { property: "og:description", content: "Pembayaran berhasil! Akses layanan premium sekarang" },
    { property: "og:type", content: "website" },
    { name: "robots", content: "noindex, nofollow" }
  ];
}

export default function SuccessPage() {
  const [searchParams] = useSearchParams();
  const [orderData, setOrderData] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Get order data from URL params or localStorage
    const orderId = searchParams.get('order');
    const productType = searchParams.get('product');
    const userName = searchParams.get('name') || 'User';

    if (orderId && productType) {
      setOrderData({
        orderId,
        productType,
        userName,
        // Generate access token/link based on product type
        accessToken: generateAccessToken(productType, orderId),
        accessLink: generateAccessLink(productType, orderId)
      });
    }
  }, [searchParams]);

  const generateAccessToken = (productType, orderId) => {
    // Generate token based on product type and order ID
    const tokens = {
      'community': `SMI-COMM-${orderId}-${Date.now().toString(36)}`,
      'private_mentoring': `SMI-PRIVATE-${orderId}-${Date.now().toString(36)}`,
      'corporate': `SMI-CORP-${orderId}-${Date.now().toString(36)}`
    };
    return tokens[productType] || `SMI-ACCESS-${orderId}`;
  };

  const generateAccessLink = (productType, orderId) => {
    const links = {
      'community': `https://t.me/+SMICommunityAccess?token=${orderId}`,
      'private_mentoring': `https://calendar.google.com/calendar/schedule?token=${orderId}`,
      'corporate': `https://meet.google.com/SMI-Corporate-${orderId}`
    };
    return links[productType] || '#';
  };

  const copyToClipboard = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      toast.success('Berhasil disalin!');
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      toast.error('Gagal menyalin');
    }
  };

  const getProductInfo = (productType) => {
    const products = {
      'community': {
        name: 'Komunitas Premium',
        icon: Users,
        color: 'blue',
        description: 'Akses penuh ke komunitas kreator SMI',
        nextSteps: [
          'Join grup Telegram dengan link di atas',
          'Perkenalkan diri di grup',
          'Ikuti event sharing mingguan',
          'Download konten eksklusif'
        ]
      },
      'private_mentoring': {
        name: 'Mentoring Private',
        icon: UserCheck,
        color: 'purple',
        description: 'Sesi mentoring 1-on-1 dengan expert',
        nextSteps: [
          'Tunggu konfirmasi jadwal dari mentor',
          'Siapkan materi yang ingin dibahas',
          'Join sesi mentoring sesuai jadwal',
          'Terapkan ilmu yang didapat'
        ]
      },
      'corporate': {
        name: 'Corporate Coaching',
        icon: Building,
        color: 'green',
        description: 'Coaching intensif untuk tim/perusahaan',
        nextSteps: [
          'Tim kami akan menghubungi Anda dalam 24 jam',
          'Diskusikan kebutuhan training tim Anda',
          'Jadwalkan sesi coaching',
          'Dapatkan materi custom sesuai kebutuhan'
        ]
      }
    };
    return products[productType] || products['community'];
  };

  if (!orderData) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600 mx-auto mb-4"></div>
          <p className="text-neutral-600">Memuat data pesanan...</p>
        </div>
      </div>
    );
  }

  const productInfo = getProductInfo(orderData.productType);
  const Icon = productInfo.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 to-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Success Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-neutral-900 mb-4">
            Pembayaran Berhasil!
          </h1>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
            Terima kasih {orderData.userName}! Pembayaran Anda telah berhasil. 
            Akses ke {productInfo.name} sudah tersedia.
          </p>
        </motion.div>

        {/* Access Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg p-8 mb-8"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className={`w-16 h-16 bg-${productInfo.color}-100 rounded-2xl flex items-center justify-center`}>
              <Icon className={`w-8 h-8 text-${productInfo.color}-600`} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-neutral-900">
                {productInfo.name}
              </h2>
              <p className="text-neutral-600">{productInfo.description}</p>
            </div>
          </div>

          {/* Order Details */}
          <div className="bg-neutral-50 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-neutral-500 mb-1">Order ID</p>
                <p className="font-mono font-semibold text-neutral-900">
                  {orderData.orderId}
                </p>
              </div>
              <div>
                <p className="text-sm text-neutral-500 mb-1">Access Token</p>
                <div className="flex items-center gap-2">
                  <p className="font-mono text-sm text-neutral-900 truncate">
                    {orderData.accessToken}
                  </p>
                  <button
                    onClick={() => copyToClipboard(orderData.accessToken, 'token')}
                    className="p-1 hover:bg-neutral-200 rounded transition-colors"
                  >
                    <Copy className="w-4 h-4 text-neutral-600" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Access Link */}
          {orderData.productType !== 'corporate' && (
            <div className="space-y-4">
              <h3 className="font-semibold text-neutral-900">Link Akses Cepat</h3>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <ExternalLink className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-blue-900">
                        {orderData.productType === 'community' 
                          ? 'Join Grup Telegram' 
                          : 'Schedule Mentoring Session'
                        }
                      </p>
                      <p className="text-sm text-blue-700 truncate max-w-md">
                        {orderData.accessLink}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => copyToClipboard(orderData.accessLink, 'link')}
                    className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                  >
                    <Copy className="w-4 h-4 text-blue-600" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Next Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-lg p-8 mb-8"
        >
          <h3 className="text-xl font-bold text-neutral-900 mb-6">Langkah Selanjutnya</h3>
          <div className="space-y-4">
            {productInfo.nextSteps.map((step, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-brand-600">{index + 1}</span>
                </div>
                <p className="text-neutral-700">{step}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Contact Support */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl shadow-lg p-8"
        >
          <div className="text-center">
            <h3 className="text-xl font-bold text-neutral-900 mb-4">Butuh Bantuan?</h3>
            <p className="text-neutral-600 mb-6">
              Tim support kami siap membantu Anda 24/7
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://wa.me/628123456789?text=Halo%20SMI,%20saya%20butuh%20bantuan"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                WhatsApp Support
              </a>
              <Link
                to="/sekolah-mentor-indonesia/blog"
                className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors"
              >
                <Calendar className="w-5 h-5" />
                Lihat Konten Gratis
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Copy Status Indicator */}
        {copied && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg"
          >
            {copied === 'token' ? 'Token berhasil disalin!' : 'Link berhasil disalin!'}
          </motion.div>
        )}
      </div>
    </div>
  );
}
