import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowRight, Users, Star, Crown, Building, ShieldCheck, Zap, X, ArrowUp, Loader2, HeadphonesIcon, Target, TrendingUp } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { enrollmentService } from "../services/enrollmentService";
import axios from "axios";
import { getApiUrl, API_ENDPOINTS } from "../config";

export default function SMIHomePricing() {
  const { t } = useTranslation('home');
  const { user, isAuthenticated } = useAuthStore();
  
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [locationType, setLocationType] = useState('dalam_kota');
  const [proofImage, setProofImage] = useState(null);
  const [proofDescription, setProofDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState('pending');
  const [errors, setErrors] = useState({});
  const [userData, setUserData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    telegramUser: '',
    phoneNumber: user?.phone_number || '',
    motivation: ''
  });
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    telegramUser: false,
    phoneNumber: false,
    motivation: false
  });
  
  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (showCheckout) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [showCheckout]);

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(number);
  };

  const packages = [
    {
      id: 1,
      name: t('pricing.packages.silver.name'),
      price: 'GRATIS',
      rawPrice: 0,
      unit: '',
      tagline: t('pricing.packages.silver.tagline'),
      icon: <Users className="w-5 h-5" />,
      color: "from-gray-900 to-gray-800",
      textColor: "text-white",
      buttonColor: "bg-gray-700 hover:bg-gray-600 text-white",
      features: t('pricing.packages.silver.features', { returnObjects: true }).map((feature, index) => ({
        icon: index === 0 ? <Users className="w-4 h-4" /> : index === 1 ? <Zap className="w-4 h-4" /> : index === 2 ? <ShieldCheck className="w-4 h-4" /> : index === 3 ? <HeadphonesIcon className="w-4 h-4" /> : <Star className="w-4 h-4" />,
        text: feature,
        available: index < 3
      })),
      cta: t('pricing.packages.silver.cta'),
      whatsappMsg: t('pricing.packages.silver.whatsapp'),
      productType: 'komunitas',
      isExternal: true,
      externalLink: 'https://t.me/sekolahmentorindonesia'
    },
    {
      id: 2,
      name: t('pricing.packages.premium.name'),
      price: 'Rp 50.000',
      rawPrice: 50000,
      unit: '/bulan',
      tagline: t('pricing.packages.premium.tagline'),
      icon: <Star className="w-5 h-5" />,
      color: "from-blue-600 to-blue-500",
      textColor: "text-white",
      buttonColor: "bg-white hover:bg-gray-50 text-blue-600 border-2 border-blue-400",
      popular: true,
      features: t('pricing.packages.premium.features', { returnObjects: true }).map((feature, index) => ({
        icon: index === 0 ? <Check className="w-4 h-4" /> : index === 1 ? <Users className="w-4 h-4" /> : index === 2 ? <Zap className="w-4 h-4" /> : index === 3 ? <HeadphonesIcon className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />,
        text: feature,
        available: true
      })),
      cta: t('pricing.packages.premium.cta'),
      whatsappMsg: t('pricing.packages.premium.whatsapp'),
      productType: 'komunitas'
    },
    {
      id: 3,
      name: t('pricing.packages.premium.name'),
      price: 'Rp 100.000',
      rawPrice: 100000,
      unit: '/sesi',
      tagline: t('pricing.packages.premium.tagline'),
      icon: <Crown className="w-5 h-5" />,
      color: "from-purple-600 to-purple-500",
      textColor: "text-white",
      buttonColor: "bg-white hover:bg-gray-50 text-purple-600 border-2 border-purple-400",
      features: t('pricing.packages.premium.features', { returnObjects: true }).map((feature, index) => ({
        icon: index === 0 ? <Check className="w-4 h-4" /> : index === 1 ? <Users className="w-4 h-4" /> : index === 2 ? <Target className="w-4 h-4" /> : index === 3 ? <HeadphonesIcon className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />,
        text: feature,
        available: true
      })),
      cta: t('pricing.packages.premium.cta'),
      whatsappMsg: t('pricing.packages.premium.whatsapp'),
      productType: 'mentoring'
    },
    {
      id: 4,
      name: t('pricing.packages.coaching.name'),
      price: 'Rp 5-6jt',
      rawPrice: 5500000,
      unit: '/jam',
      tagline: t('pricing.packages.coaching.tagline'),
      icon: <Building className="w-5 h-5" />,
      color: "from-orange-600 to-red-600",
      textColor: "text-white",
      buttonColor: "bg-white hover:bg-gray-50 text-orange-600 border-2 border-orange-400",
      features: t('pricing.packages.coaching.features', { returnObjects: true }).map((feature, index) => ({
        icon: index === 0 ? <Check className="w-4 h-4" /> : index === 1 ? <Building className="w-4 h-4" /> : index === 2 ? <Target className="w-4 h-4" /> : index === 3 ? <Users className="w-4 h-4" /> : <HeadphonesIcon className="w-4 h-4" />,
        text: feature,
        available: true
      })),
      cta: t('pricing.packages.coaching.cta'),
      whatsappMsg: t('pricing.packages.coaching.whatsapp'),
      productType: 'mentoring'
    }
  ];

  const getFinalPrice = () => {
    if (!selectedPackage) return 0;
    if (selectedPackage.productType === 'komunitas') return selectedPackage.price;
    
    let price = selectedPackage.rawPrice;
    if (locationType === 'luar_kota') {
      price *= 2;
    }
    return formatRupiah(price);
  };

  const handleCheckout = (pkg) => {
    // Handle FREE tier with external link
    if (pkg.isExternal) {
      window.open(pkg.externalLink, '_blank');
      return;
    }

    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }
    setSelectedPackage(pkg);
    setCurrentStep(1);
    setPaymentMethod('rekening');
    setLocationType('dalam_kota');
    setProofImage(null);
    setProofDescription('');
    setErrors({});
    setTouched({
      name: false,
      email: false,
      telegramUser: false,
      phoneNumber: false,
      motivation: false
    });
    setSubmissionStatus('pending');
    setShowCheckout(true);
  };

  const validateForm = (step) => {
    const newErrors = {};
    const isMentoring = selectedPackage?.productType === 'mentoring';
    
    if (step === 1) {
      if (!userData.name.trim()) newErrors.name = 'Nama lengkap harus diisi';
      if (!userData.email.trim()) {
        newErrors.email = 'Email harus diisi';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
        newErrors.email = 'Format email tidak valid';
      }
      if (userData.telegramUser && !userData.telegramUser.trim()) {
        newErrors.telegramUser = 'User Telegram harus diisi';
      } else if (userData.telegramUser && !userData.telegramUser.startsWith('@')) {
        newErrors.telegramUser = 'User Telegram harus diawali dengan @';
      }
      if (!userData.phoneNumber.trim()) {
        newErrors.phoneNumber = 'Nomor telepon harus diisi';
      } else if (!/^[0-9]+$/.test(userData.phoneNumber) || userData.phoneNumber.length < 10) {
        newErrors.phoneNumber = 'Nomor telepon harus berupa angka dan minimal 10 digit';
      }
      if (isMentoring) {
        if (!userData.motivation.trim()) {
          newErrors.motivation = 'Ceritakan kebutuhan atau tujuan mentoring Anda';
        }
      }
    } 
    
    // Payment Method Step: Step 3 for Community, Step 4 for Mentoring
    if ((!isMentoring && step === 3) || (isMentoring && step === 4)) {
      if (!paymentMethod) newErrors.paymentMethod = 'Metode pembayaran wajib dipilih';
    }

    // Upload Proof Step: Step 4 for Community, Step 5 for Mentoring
    if ((!isMentoring && step === 4) || (isMentoring && step === 5)) {
      if (!proofImage) newErrors.proofImage = 'Bukti transfer wajib diunggah';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };
  
  const getFieldError = (field) => {
    return touched[field] && errors[field] ? errors[field] : '';
  };
  
  const isFieldInvalid = (field) => {
    return touched[field] && !!errors[field];
  };

  const handleNextStep = () => {
    if (validateForm(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProofImage(file);
    }
  };

  const handleImageDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setProofImage(file);
    }
  };
  
  const submitPayment = async () => {
    console.log('🔘 SUBMIT PAYMENT STARTED');
    console.log('📊 Current state:', {
      selectedPackage,
      currentStep,
      paymentMethod,
      proofImage,
      isSubmitting,
      submissionStatus
    });
    
    const isMentoring = selectedPackage?.productType === 'mentoring';
    const finalStep = isMentoring ? 5 : 4;
    
    console.log('🎯 Final step should be:', finalStep);
    
    // Get auth token
    const token = useAuthStore.getState().token;
    console.log('🔑 Token exists:', !!token);
    
    if (!token) {
      console.error('❌ No authentication token found');
      setErrors({ general: 'Anda harus login terlebih dahulu' });
      return;
    }

    console.log('✅ Validation result:', validateForm(finalStep));
    if (!validateForm(finalStep)) {
      console.log('❌ Form validation failed');
      return;
    }

    try {
      console.log('🚀 Starting submission...');
      setIsSubmitting(true);
      
      // Prepare user data with location info for mentoring
      const submissionData = { ...userData };
      if (isMentoring) {
        const locationStr = locationType === 'luar_kota' ? 'Luar Kota' : 'Dalam Kota';
        submissionData.motivation = `[Lokasi: ${locationStr}] ${userData.motivation}`;
      }

      console.log('Creating enrollment with data:', {
        packageId: selectedPackage.id,
        submissionData,
        paymentMethod,
        hasProofImage: !!proofImage,
        proofDescription,
        finalPrice: getFinalPrice()
      });

      console.log('📋 Form data preview:');
      console.log('Package ID:', selectedPackage.id);
      console.log('User Data:', submissionData);
      console.log('Payment Method:', paymentMethod);
      console.log('Proof Image:', proofImage ? proofImage.name : 'None');
      console.log('Final Price:', getFinalPrice());
      console.log('Token:', token ? `${token.substring(0, 20)}...` : 'None');

      // Create enrollment with user data and upload proof
      const data = await enrollmentService.createEnrollment(
        selectedPackage.id,
        submissionData,
        paymentMethod,
        proofImage,
        proofDescription,
        token,
        getFinalPrice()
      );
      
      console.log('Enrollment created successfully:', data);
      setSubmissionStatus('submitted');
      
      // Update local status and user data (only update enrollment-related fields)
      console.log('🔄 Updating user state...');
      const currentUser = useAuthStore.getState();
      console.log('Current user state before update:', currentUser);
      
      useAuthStore.getState().updateUser({ 
        status: 'pending',
        package: selectedPackage.name,
        enrollment_id: data.enrollment?.id || data.id
      });
      
      const updatedUser = useAuthStore.getState();
      console.log('User state after update:', updatedUser);
      console.log('Is still authenticated:', updatedUser.isAuthenticated);
      console.log('Token still exists:', !!updatedUser.token);
      
      // Redirect to profile after delay
      setTimeout(() => {
        setShowCheckout(false);
        window.location.href = '/profile';
      }, 2000);
      
    } catch (error) {
      console.error('❌ Payment submission error:', error);
      console.error('❌ Error message:', error.message);
      console.error('❌ Error response:', error.response?.data);
      console.error('❌ Error status:', error.response?.status);
      console.error('❌ Error code:', error.code);
      
      // Show specific error message
      let errorMessage = 'Gagal mengirim pembayaran. Silakan coba lagi.';
      
      if (error.code === 'ECONNREFUSED') {
        errorMessage = 'Tidak dapat terhubung ke server. Pastikan backend berjalan di localhost:5000';
      } else if (error.response?.status === 401) {
        errorMessage = 'Sesi login telah expired. Silakan login kembali.';
      } else if (error.response?.status === 400) {
        errorMessage = 'Data tidak lengkap atau tidak valid. Silakan periksa kembali.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      setErrors({ general: errorMessage });
      setSubmissionStatus('error');
      
    } finally {
      setIsSubmitting(false);
    }
  };

  const isCommunityFlow = selectedPackage?.productType === 'komunitas';
  const steps = isCommunityFlow ? [1, 2, 3, 4] : [1, 2, 3, 4, 5];

  return (
    <section id="paket" className="py-20 lg:py-24 px-4 sm:px-6 bg-gradient-to-br from-gray-50 via-white to-blue-50 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 lg:mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-900 mb-4 font-display"
          >
            {t('pricing.title')}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-sm sm:text-base text-neutral-500 max-w-2xl mx-auto"
          >
            {t('pricing.subtitle')}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {packages.map((pkg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`relative flex flex-col ${pkg.popular ? 'scale-105' : ''}`}
            >
              {/* Popular Badge */}
              {pkg.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-1 rounded-full text-xs font-bold shadow-lg">
                    {t('pricing.popular_badge')}
                  </span>
                </div>
              )}

              <div className={`flex flex-col h-full bg-gradient-to-br ${pkg.color} rounded-2xl shadow-xl border-2 border-white/20 hover:shadow-2xl transition-all duration-300 overflow-hidden`}>
                {/* Card Header */}
                <div className={`p-6 text-center ${pkg.textColor}`}>
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                      {pkg.icon}
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{pkg.name}</h3>
                  <div className="flex items-baseline justify-center">
                    <span className="text-3xl font-bold">{pkg.price}</span>
                    <span className="text-lg ml-1 opacity-80">{pkg.unit}</span>
                  </div>
                  <p className="text-sm mt-2 opacity-80">{pkg.tagline}</p>
                </div>

                {/* Features */}
                <div className={`flex-1 bg-white/10 backdrop-blur-sm p-6`}>
                  <ul className="space-y-3">
                    {pkg.features.map((feature, fIdx) => (
                      <li 
                        key={fIdx}
                        className={`flex items-center gap-3 ${feature.available ? pkg.textColor : 'text-white/60'}`}
                      >
                        <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                          feature.available ? 'bg-white/30' : 'bg-white/10'
                        }`}>
                          {feature.available ? (
                            <Check className="w-3 h-3 text-white" strokeWidth={3} />
                          ) : (
                            <span className="text-white/60 text-xs">×</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {feature.icon}
                          <span className="text-sm font-medium">{feature.text}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA Button - Always at bottom */}
                <div className="p-6 pt-0">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleCheckout(pkg)}
                    className={`w-full py-3 px-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${pkg.buttonColor}`}
                  >
                    {pkg.cta}
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust Indicators */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="flex flex-wrap justify-center gap-8 text-gray-600">
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-500" />
              <span>1.247+ Kreator Bergabung</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-500" />
              <span>98% Tingkat Kepuasan</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-500" />
              <span>50+ Mentor Profesional</span>
            </div>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {showCheckout && (
          <div key="checkout-modal" className="fixed inset-0 z-[100] flex items-center justify-center px-6 sm:px-8">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setShowCheckout(false)}
              className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-[700px] md:max-w-[800px] bg-white rounded-[1rem] shadow-2xl mx-auto my-4 max-h-[90vh] overflow-hidden"
            >
              {/* Payment Success Status Overlay */}
              {submissionStatus === 'submitted' && (
                <motion.div
                  key="submission-status"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 bg-white/95 backdrop-blur-sm z-20 flex flex-col items-center justify-center p-4"
                >
                  <div className="text-center max-w-md">
                    <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-6">
                      <Check className="w-10 h-10 text-green-500" />
                    </div>
                    <h3 className="text-xl font-bold text-neutral-900 mb-3">Payment sent.</h3>
                    <p className="text-sm text-neutral-600 mb-8">
                      Waiting for admin approval.
                    </p>
                    <div className="w-32 h-2 bg-neutral-200 rounded-full mx-auto">
                      <div className="h-full bg-brand-600 rounded-full w-0 animate-progress"></div>
                    </div>
                  </div>
                </motion.div>
              )}
              
              {/* Payment Error Status Overlay */}
              {submissionStatus === 'error' && (
                <motion.div
                  key="error-status"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 bg-white/95 backdrop-blur-sm z-20 flex flex-col items-center justify-center p-4"
                >
                  <div className="text-center max-w-md">
                    <div className="w-20 h-20 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-6">
                      <X className="w-10 h-10 text-red-500" />
                    </div>
                    <h3 className="text-xl font-bold text-neutral-900 mb-3">Pembayaran Gagal</h3>
                    <p className="text-sm text-red-600 mb-4">
                      {errors.general || 'Terjadi kesalahan saat mengirim pembayaran. Silakan coba lagi.'}
                    </p>
                    <p className="text-xs text-neutral-500 mb-8">
                      Pastikan semua data terisi dengan benar dan bukti transfer sudah diupload.
                    </p>
                    <button
                      onClick={() => {
                        setSubmissionStatus('pending');
                        setIsSubmitting(false);
                        setErrors({});
                      }}
                      className="bg-brand-600 text-white py-3 px-6 rounded-lg font-medium text-sm hover:bg-brand-700 transition-all"
                    >
                      Coba Lagi
                    </button>
                  </div>
                </motion.div>
              )}
              
              <div className="p-4 sm:p-6 border-b border-neutral-100">
                <div className="flex items-center justify-between">
                  <div className="flex-1 text-center">
                    <h3 className="text-lg sm:text-xl font-bold text-neutral-900">{t('pricing.checkout.title')}</h3>
                    <p className="text-xs text-neutral-500">{t('pricing.checkout.subtitle')}</p>
                  </div>
                  <button 
                    onClick={() => setShowCheckout(false)}
                    className="p-1.5 hover:bg-neutral-50 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4 text-neutral-400" />
                  </button>
                </div>
              </div>

              <div className="px-3 sm:px-4 pt-4 pb-2">
                <div className="flex items-center justify-between max-w-lg mx-auto">
                  {steps.map((step) => (
                    <div key={step} className="flex items-center flex-1">
                      <div className="flex flex-col items-center z-10 flex-1">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${currentStep >= step ? 'bg-brand-600 text-white' : 'bg-neutral-100 text-neutral-400'}`}>
                          {step}
                        </div>
                        <div className={`mt-0.5 text-[10px] font-medium transition-colors duration-300 ${currentStep === step ? 'text-brand-600 font-semibold' : 'text-neutral-400'}`}>
                          {step === 1 && 'Data'}
                          {step === 2 && (!isCommunityFlow ? 'Lokasi' : 'Info')}
                          {step === 3 && (!isCommunityFlow ? 'Info' : 'Bayar')}
                          {step === 4 && (!isCommunityFlow ? 'Bayar' : 'Upload')}
                          {step === 5 && 'Upload'}
                        </div>
                      </div>
                      {step < steps.length && (
                        <div className={`flex-1 h-0.5 mx-1 transition-all duration-300 ${currentStep > step ? 'bg-brand-600' : 'bg-neutral-200'}`} />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="px-3 sm:px-4 py-3 sm:py-4 space-y-6 max-h-[calc(90vh-180px)] overflow-y-auto">
                {currentStep === 1 && (
                  <div className="max-w-2xl mx-auto">
                    <h4 className="text-md font-bold text-neutral-900 mb-4 text-center">
                      {isCommunityFlow ? 'Data untuk Gabung Komunitas' : 'Data untuk Sesi Mentoring'}
                    </h4>
                    <div className="mb-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <p className="text-xs font-medium text-neutral-700 mb-1 flex items-center">
                            Nama Lengkap
                            <span className="text-red-500 ml-1">*</span>
                          </p>
                          <input 
                            type="text" 
                            placeholder="Masukkan nama lengkap Anda" 
                            className={`w-full p-2.5 rounded-md border focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all ${isFieldInvalid('name') ? 'border-red-500' : 'border-neutral-300'}`}
                            value={userData.name}
                            onChange={(e) => setUserData({...userData, name: e.target.value})}
                            onBlur={() => handleBlur('name')}
                          />
                          {getFieldError('name') && <p className="text-xs text-red-500 mt-1 ml-1">{getFieldError('name')}</p>}
                        </div>
                        <div>
                          <p className="text-xs font-medium text-neutral-700 mb-1 flex items-center">
                            Email
                            <span className="text-red-500 ml-1">*</span>
                          </p>
                          <input 
                            type="email" 
                            placeholder="Masukkan email Anda" 
                            className={`w-full p-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all ${isFieldInvalid('email') ? 'border-red-500' : 'border-neutral-300'}`}
                            value={userData.email}
                            onChange={(e) => setUserData({...userData, email: e.target.value})}
                            onBlur={() => handleBlur('email')}
                          />
                          {getFieldError('email') && <p className="text-xs text-red-500 mt-1 ml-1">{getFieldError('email')}</p>}
                        </div>

                        <div>
                          <p className="text-xs font-medium text-neutral-700 mb-1 flex items-center">
                            User Telegram
                            <span className="text-red-500 ml-1">*</span>
                          </p>
                          <input 
                            type="text" 
                            placeholder="Contoh: @username" 
                            className={`w-full p-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all ${isFieldInvalid('telegramUser') ? 'border-red-500' : 'border-neutral-300'}`}
                            value={userData.telegramUser}
                            onChange={(e) => setUserData({...userData, telegramUser: e.target.value})}
                            onBlur={() => handleBlur('telegramUser')}
                          />
                          {getFieldError('telegramUser') && <p className="text-xs text-red-500 mt-1 ml-1">{getFieldError('telegramUser')}</p>}
                        </div>
                        <div>
                          <p className="text-xs font-medium text-neutral-700 mb-1 flex items-center">
                            Nomor Telepon
                            <span className="text-red-500 ml-1">*</span>
                          </p>
                          <input 
                            type="tel" 
                            placeholder="Contoh: 081234567890" 
                            className={`w-full p-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all ${isFieldInvalid('phoneNumber') ? 'border-red-500' : 'border-neutral-300'}`}
                            value={userData.phoneNumber}
                            onChange={(e) => setUserData({...userData, phoneNumber: e.target.value})}
                            onBlur={() => handleBlur('phoneNumber')}
                          />
                          {getFieldError('phoneNumber') && <p className="text-xs text-red-500 mt-1 ml-1">{getFieldError('phoneNumber')}</p>}
                        </div>

                        <div className="md:col-span-2">
                          <p className="text-xs font-medium text-neutral-700 mb-1">
                            {isCommunityFlow ? '(Opsional) Motivasi' : 'Motivasi / Tujuan Mentoring'}
                            {!isCommunityFlow && <span className="text-red-500 ml-1">*</span>}
                          </p>
                          <textarea 
                            placeholder="Ceritakan mengapa Anda ingin bergabung dengan SMI..." 
                            rows={2}
                            className={`w-full p-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent overflow-hidden ${isFieldInvalid('motivation') ? 'border-red-500' : 'border-neutral-300'}`}
                            value={userData.motivation}
                            onChange={(e) => setUserData({...userData, motivation: e.target.value})}
                            onBlur={() => handleBlur('motivation')}
                          ></textarea>
                          {getFieldError('motivation') && <p className="text-xs text-red-500 mt-1 ml-1">{getFieldError('motivation')}</p>}
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between gap-3">
                      <button 
                        onClick={() => setShowCheckout(false)}
                        className="bg-white text-neutral-900 py-2.5 px-5 rounded-md font-medium text-sm border border-neutral-300 hover:bg-neutral-50 transition-all w-full sm:w-auto"
                      >
                        Batal
                      </button>
                      <button 
                        onClick={() => {
                          setTouched({ name: true, email: true, telegramUser: true, phoneNumber: true, motivation: true });
                          if (validateForm(1)) {
                            handleNextStep();
                          }
                        }}
                        className="bg-brand-600 text-white py-2.5 px-5 rounded-md font-medium text-sm hover:bg-brand-700 transition-all w-full sm:w-auto"
                      >
                        Lanjut
                      </button>
                    </div>
                  </div>
                )}

                {currentStep === 2 && !isCommunityFlow && (
                  <div className="max-w-2xl mx-auto">
                    <h4 className="text-lg font-bold text-neutral-900 mb-6 text-center">Lokasi Sesi Mentoring</h4>
                    <div className="bg-neutral-50 rounded-lg p-5 mb-8">
                      <p className="text-sm text-neutral-600 mb-4">
                        Pilih lokasi pelaksanaan sesi mentoring. Untuk lokasi luar kota, akan dikenakan biaya tambahan (2x lipat) untuk akomodasi.
                      </p>
                      <div className="space-y-3">
                        <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${locationType === 'dalam_kota' ? 'border-brand-600 bg-brand-50' : 'border-neutral-200 bg-white'}`}>
                          <input 
                            type="radio" 
                            name="locationType" 
                            value="dalam_kota" 
                            checked={locationType === 'dalam_kota'}
                            onChange={(e) => setLocationType(e.target.value)}
                            className="w-4 h-4 text-brand-600 focus:ring-brand-500"
                          />
                          <div className="ml-3">
                            <span className="block text-sm font-medium text-neutral-900">Dalam Kota</span>
                            <span className="block text-xs text-neutral-500">Harga normal sesuai paket</span>
                          </div>
                        </label>
                        <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${locationType === 'luar_kota' ? 'border-brand-600 bg-brand-50' : 'border-neutral-200 bg-white'}`}>
                          <input 
                            type="radio" 
                            name="locationType" 
                            value="luar_kota" 
                            checked={locationType === 'luar_kota'}
                            onChange={(e) => setLocationType(e.target.value)}
                            className="w-4 h-4 text-brand-600 focus:ring-brand-500"
                          />
                          <div className="ml-3">
                            <span className="block text-sm font-medium text-neutral-900">Luar Kota</span>
                            <span className="block text-xs text-neutral-500">Harga 2x lipat (termasuk akomodasi)</span>
                          </div>
                        </label>
                      </div>
                    </div>
                    <div className="flex justify-between gap-4">
                      <button 
                        onClick={handlePrevStep}
                        className="bg-white text-neutral-900 py-3 px-6 rounded-lg font-medium text-sm border border-neutral-300 hover:bg-neutral-50 transition-all w-full sm:w-auto"
                      >
                        Kembali
                      </button>
                      <button 
                        onClick={handleNextStep}
                        className="bg-brand-600 text-white py-3 px-6 rounded-lg font-medium text-sm hover:bg-brand-700 transition-all w-full sm:w-auto"
                      >
                        Lanjut
                      </button>
                    </div>
                  </div>
                )}

                {((isCommunityFlow && currentStep === 2) || (!isCommunityFlow && currentStep === 3)) && (
                  <div className="max-w-2xl mx-auto">
                    <h4 className="text-lg font-bold text-neutral-900 mb-6 text-center">
                      {isCommunityFlow ? 'Detail Paket Komunitas' : 'Detail Paket Mentoring'}
                    </h4>
                    <div className="bg-neutral-50 rounded-lg p-5 mb-8">
                      <div className="space-y-6">
                        <div>
                          <p className="text-sm font-medium text-neutral-500 mb-2">Paket yang Dipilih</p>
                          <p className="font-bold text-neutral-900">{selectedPackage.name}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-neutral-500 mb-2">Harga</p>
                          <p className="font-bold text-neutral-900">{getFinalPrice()}</p>
                        </div>
                        {!isCommunityFlow && (
                          <div>
                            <p className="text-sm font-medium text-neutral-500 mb-2">Jenis Layanan</p>
                            <p className="text-sm text-neutral-700">
                              Sesi mentoring 1-on-1 atau coaching sesuai paket yang dipilih.
                              {locationType === 'luar_kota' && ' (Lokasi Luar Kota)'}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-between gap-4">
                      <button 
                        onClick={handlePrevStep}
                        className="bg-white text-neutral-900 py-3 px-6 rounded-lg font-medium text-sm border border-neutral-300 hover:bg-neutral-50 transition-all w-full sm:w-auto"
                      >
                        Kembali
                      </button>
                      <button 
                        onClick={handleNextStep}
                        className="bg-brand-600 text-white py-3 px-6 rounded-lg font-medium text-sm hover:bg-brand-700 transition-all w-full sm:w-auto"
                      >
                        Lanjut
                      </button>
                    </div>
                  </div>
                )}

                {((isCommunityFlow && currentStep === 3) || (!isCommunityFlow && currentStep === 4)) && (
                  <div className="max-w-2xl mx-auto">
                    <h4 className="text-lg font-bold text-neutral-900 mb-6 text-center">Metode Pembayaran</h4>
                    <div className="bg-neutral-50 rounded-lg p-5 mb-8">
                      <div className="space-y-6">
                        <div>
                          <p className="text-sm font-medium text-neutral-500 mb-3">Pilih Metode Pembayaran</p>
                          <div className="grid grid-cols-2 gap-4">
                            <button 
                              onClick={() => setPaymentMethod('rekening')}
                              className={`p-4 rounded-lg border-2 transition-all ${paymentMethod === 'rekening' ? 'border-brand-600 bg-brand-50' : 'border-neutral-300 bg-white hover:bg-neutral-50'}`}
                            >
                              <div className="text-left">
                                <p className="font-medium text-neutral-900 text-sm">Transfer Bank</p>
                                <p className="text-xs text-neutral-500 mt-1">BCA, Mandiri, BRI</p>
                              </div>
                            </button>
                            <button 
                              onClick={() => setPaymentMethod('qris')}
                              className={`p-4 rounded-lg border-2 transition-all ${paymentMethod === 'qris' ? 'border-brand-600 bg-brand-50' : 'border-neutral-300 bg-white hover:bg-neutral-50'}`}
                            >
                              <div className="text-left">
                                <p className="font-medium text-neutral-900 text-sm">QRIS</p>
                                <p className="text-xs text-neutral-500 mt-1">Scan dan Bayar</p>
                              </div>
                            </button>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-neutral-500 mb-2.5">Detail Transfer</p>
                          {paymentMethod === 'rekening' && (
                            <div className="bg-white p-5 rounded-lg border border-neutral-300">
                              <div className="space-y-3">
                                <div>
                                  <p className="text-xs text-neutral-500">Nama Rekening</p>
                                  <p className="font-bold text-neutral-900">SEKOLAH MENTOR INDONESIA</p>
                                </div>
                                <div>
                                  <p className="text-xs text-neutral-500">Nomor Rekening</p>
                                  <p className="font-bold text-neutral-900">888000123456</p>
                                </div>
                                <div>
                                  <p className="text-xs text-neutral-500">Bank</p>
                                  <p className="font-bold text-neutral-900">BCA</p>
                                </div>
                              </div>
                            </div>
                          )}
                          {paymentMethod === 'qris' && (
                            <div className="bg-white p-5 rounded-lg border border-neutral-300 flex justify-center">
                              <img src="/qris.jpg" alt="QRIS Sekolah Mentor Indonesia" className="w-48 h-48 object-contain" />
                            </div>
                          )}
                          {!paymentMethod && errors.paymentMethod && (
                            <p className="text-xs text-red-500 mt-2 ml-1">{errors.paymentMethod}</p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between gap-4">
                      <button 
                        onClick={handlePrevStep}
                        className="bg-white text-neutral-900 py-3 px-6 rounded-lg font-medium text-sm border border-neutral-300 hover:bg-neutral-50 transition-all w-full sm:w-auto"
                      >
                        Kembali
                      </button>
                      <button 
                        onClick={handleNextStep}
                        className="bg-brand-600 text-white py-3 px-6 rounded-lg font-medium text-sm hover:bg-brand-700 transition-all w-full sm:w-auto"
                      >
                        Lanjut
                      </button>
                    </div>
                  </div>
                )}
                {((isCommunityFlow && currentStep === 4) || (!isCommunityFlow && currentStep === 5)) && (
                  <div className="max-w-2xl mx-auto">
                    <h4 className="text-lg font-bold text-neutral-900 mb-6 text-center">Upload Bukti Transfer</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      <div className="space-y-6">
                        <div className="bg-neutral-50 rounded-lg p-5">
                          <h5 className="text-sm font-semibold text-neutral-700 mb-4">Ringkasan Pesanan</h5>
                          <div className="space-y-4">
                            <div>
                              <p className="text-xs font-medium text-neutral-500 mb-1.5">Paket yang Dipilih</p>
                              <p className="font-bold text-neutral-900">{selectedPackage.name}</p>
                            </div>
                            <div>
                              <p className="text-xs font-medium text-neutral-500 mb-1.5">Harga</p>
                              <p className="font-bold text-neutral-900">{selectedPackage.price}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-neutral-500 mb-3">Metode Pembayaran</p>
                              <p className="text-sm font-medium text-neutral-900">
                                {paymentMethod === 'rekening' ? 'Transfer Bank' : 'QRIS'}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-neutral-500 mb-2.5">Detail Transfer</p>
                              {paymentMethod === 'rekening' && (
                                <div className="bg-white p-5 rounded-lg border border-neutral-300">
                                  <div className="space-y-3">
                                    <div>
                                      <p className="text-xs text-neutral-500">Nama Rekening</p>
                                      <p className="font-bold text-neutral-900">SEKOLAH MENTOR INDONESIA</p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-neutral-500">Nomor Rekening</p>
                                      <p className="font-bold text-neutral-900">888000123456</p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-neutral-500">Bank</p>
                                      <p className="font-bold text-neutral-900">BCA</p>
                                    </div>
                                  </div>
                                </div>
                              )}
                              {paymentMethod === 'qris' && (
                                <div className="bg-white p-5 rounded-lg border border-neutral-300 flex justify-center">
                                  <img src="/qris.jpg" alt="QRIS Sekolah Mentor Indonesia" className="w-48 h-48 object-contain" />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-6">
                        <div className="bg-neutral-50 rounded-lg p-5">
                          <h5 className="text-sm font-semibold text-neutral-700 mb-4">Upload Bukti Transfer</h5>
                          <div 
                            className={`border-2 border-dashed rounded-lg p-5 text-center hover:border-brand-300 transition-all cursor-pointer ${errors.proofImage ? 'border-red-500' : 'border-neutral-300'}`}
                            onClick={() => document.getElementById('proof-upload-community').click()}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={handleImageDrop}
                          >
                            <input 
                              type="file" 
                              id="proof-upload-community" 
                              accept="image/*" 
                              className="hidden"
                              onChange={handleImageUpload}
                            />
                            {proofImage ? (
                              <div className="mt-3">
                                <img 
                                  src={URL.createObjectURL(proofImage)} 
                                  alt="Logo Sekolah Mentor Indonesia - Bukti Transfer" 
                                  className="max-w-full h-40 object-contain mx-auto rounded-lg"
                                />
                                <p className="mt-2.5 text-sm text-neutral-600">{proofImage.name}</p>
                              </div>
                            ) : (
                              <div className="space-y-2.5">
                                <div className="w-14 h-14 mx-auto bg-brand-50 rounded-full flex items-center justify-center">
                                  <ArrowUp className="w-5 h-5 text-brand-500" />
                                </div>
                                <p className="text-sm font-medium text-neutral-900">Klik atau Drag File</p>
                                <p className="text-xs text-neutral-500">Format: JPG, PNG, GIF (Maks 5MB)</p>
                              </div>
                            )}
                          </div>
                          {errors.proofImage && <p className="text-xs text-red-500 mt-3 ml-1">{errors.proofImage}</p>}
                        </div>
                        <div className="bg-neutral-50 rounded-lg p-5">
                          <h5 className="text-sm font-semibold text-neutral-700 mb-4">Deskripsi Pembayaran (Opsional)</h5>
                          <textarea 
                            placeholder="Tambahkan catatan tentang pembayaran (contoh: Nama pengirim, tanggal transfer)" 
                            rows={4}
                            className="w-full p-3 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-transparent overflow-hidden"
                            value={proofDescription}
                            onChange={(e) => setProofDescription(e.target.value)}
                          ></textarea>
                          <p className="text-xs text-neutral-400 mt-2.5 ml-1">Opsional. Bisa diisi jika ingin menambahkan catatan.</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                      <button 
                        onClick={() => setCurrentStep(1)}
                        className="bg-white text-neutral-900 py-3 px-6 rounded-lg font-medium text-sm border border-neutral-300 hover:bg-neutral-50 transition-all w-full sm:w-auto"
                      >
                        Kembali
                      </button>
                      <button 
                        onClick={() => {
                          console.log('🔘 Submit button clicked');
                          console.log('📊 Current state:', {
                            selectedPackage,
                            currentStep,
                            paymentMethod,
                            proofImage,
                            isSubmitting,
                            submissionStatus
                          });
                          submitPayment();
                        }}
                        disabled={isSubmitting}
                        className="bg-brand-600 text-white py-3 px-6 rounded-lg font-medium text-sm hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 w-full sm:w-auto"
                      >
                        {isSubmitting ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          'Konfirmasi Pembayaran'
                        )}
                      </button>
                    </div>
                    <p className="text-xs sm:text-sm text-center text-neutral-400 px-4 mt-4">
                      {t('pricing.checkout.disclaimer')}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
