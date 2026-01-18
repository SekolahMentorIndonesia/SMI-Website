const { Payment, Enrollment, User, MentorPackage, AdminLog } = require('../models');
const telegramService = require('../services/telegram.service');

// Handle Telegram webhook updates
const handleTelegramWebhook = async (req, res) => {
  try {
    console.log('🔍 [DEBUG] Webhook received:', JSON.stringify(req.body, null, 2));
    
    const { message } = req.body;
    
    // Validate message and message.text exists
    if (!message || !message.text || typeof message.text !== 'string') {
      console.log('No valid message text received:', JSON.stringify(req.body, null, 2));
      return res.status(200).send('OK');
    }

    // Validate chat exists
    if (!message.chat || !message.chat.id) {
      console.log('No chat ID found in message:', JSON.stringify(message, null, 2));
      return res.status(200).send('OK');
    }

    const chatId = message.chat.id;
    const text = message.text.trim();
    
    console.log('🔍 [DEBUG] Processing command:', text, 'from chat:', chatId);
    
    // If text is empty after trim, ignore the message
    if (!text) {
      console.log('Empty message text after trim');
      return res.status(200).send('OK');
    }
    
    // Parse commands
    if (text.startsWith('/status')) {
      await handleStatusCommand(text, chatId);
    } else if (text.startsWith('/update_status')) {
      await handleUpdateStatusCommand(text, chatId);
    } else if (text.startsWith('/terima')) {
      await handleAcceptCommand(text, chatId);
    } else if (text.startsWith('/tolak')) {
      await handleRejectCommand(text, chatId);
    } else if (text.startsWith('/verifikasi')) {
      await handleVerifyCommand(text, chatId);
    } else if (text.startsWith('/batal')) {
      await handleCancelCommand(text, chatId);
    } else if (text.startsWith('/help')) {
      await handleHelpCommand(chatId);
    }
    
    console.log('✅ [DEBUG] Webhook processed successfully');
    return res.status(200).send('OK');
  } catch (error) {
    console.error('❌ [DEBUG] Error handling Telegram webhook:', error);
    console.error('❌ [DEBUG] Error stack:', error.stack);
    return res.status(500).send('Internal Server Error');
  }
};

// Handle /status command
const handleStatusCommand = async (text, chatId) => {
  try {
    console.log('Received /status command:', text);
    
    // Extract payment ID from command - handle both formats: /status 4 and /status 4
    let paymentId;
    if (text.includes(' ')) {
      // Format: /status 4 [ID_PEMBAYARAN]
      const parts = text.split(' ');
      paymentId = parseInt(parts[1], 10);
    } else {
      // Format: /status4
      paymentId = parseInt(text.replace('/status', ''), 10);
    }
    
    if (isNaN(paymentId)) {
      await telegramService.sendMessage('Format salah. Gunakan: /status 4 [ID_PEMBAYARAN] atau /status4 [ID_PEMBAYARAN]');
      return;
    }
    
    // Find payment with full relations
    const payment = await Payment.findByPk(paymentId, {
      include: [{
        model: Enrollment,
        include: [{
          model: User,
          attributes: ['id', 'name', 'email', 'phone_number', 'telegram_user', 'status']
        }, {
          model: MentorPackage,
          attributes: ['id', 'name', 'product_type', 'price']
        }]
      }]
    });
    
    if (!payment) {
      await telegramService.sendMessage(`Pembayaran dengan ID ${paymentId} tidak ditemukan.`);
      return;
    }
    
    const enrollment = payment.Enrollment;
    const user = enrollment.User;
    const pkg = enrollment.MentorPackage;
    
    let statusText = '';
    switch (payment.status) {
      case 'WAITING_APPROVAL': statusText = '⏳ MENUNGGU VERIFIKASI'; break;
      case 'APPROVED': statusText = '✅ DISETUJUI'; break;
      case 'REJECTED': statusText = '❌ DITOLAK'; break;
      default: statusText = payment.status; break;
    }
    
    const message = `📋 STATUS PEMBAYARAN #${paymentId}\n\n` +
                    `👤 User: ${user.name} (${user.email})\n` +
                    `📦 Paket: ${pkg.name}\n` +
                    `💰 Jumlah: Rp${payment.amount}\n` +
                    `📊 Status: ${statusText}\n\n` +
                    `📅 Tanggal: ${new Date(payment.created_at).toLocaleDateString()}\n\n` +
                    `💬 Untuk update status, gunakan: /update_status [ID_PEMBAYARAN] [STATUS]`;
    
    await telegramService.sendMessage(message);
    console.log('Status sent for payment:', paymentId);
  } catch (error) {
    console.error('Error handling /status command:', error);
    await telegramService.sendMessage('Terjadi kesalahan saat memproses status.');
  }
};

// Handle /update_status command
const handleUpdateStatusCommand = async (text, chatId) => {
  try {
    console.log('Received /update_status command:', text);
    
    // Extract payment ID and new status - handle both formats
    let paymentId, newStatus;
    if (text.includes(' ')) {
      // Format: /update_status 4 [ID_PEMBAYARAN] [STATUS]
      const parts = text.split(' ');
      paymentId = parseInt(parts[1], 10);
      newStatus = parts[2];
    } else {
      // Format: /update_status4 [ID_PEMBAYARAN] [STATUS]
      const parts = text.split(' ');
      paymentId = parseInt(parts[1], 10);
      newStatus = parts[2];
    }
    
    if (isNaN(paymentId) || !newStatus) {
      await telegramService.sendMessage('Format salah. Gunakan: /update_status 4 [ID_PEMBAYARAN] [STATUS]');
      return;
    }
    
    const validStatuses = ['WAITING_APPROVAL', 'APPROVED', 'REJECTED'];
    if (!validStatuses.includes(newStatus.toUpperCase())) {
      await telegramService.sendMessage('Status tidak valid. Gunakan: WAITING_APPROVAL, APPROVED, atau REJECTED');
      return;
    }
    
    // Find payment and update status
    const payment = await Payment.findByPk(paymentId, {
      include: [{
        model: Enrollment,
        include: [{
          model: User,
          attributes: ['id', 'name', 'email', 'phone_number', 'telegram_user', 'status']
        }, {
          model: MentorPackage,
          attributes: ['id', 'name', 'product_type', 'price']
        }]
      }]
    });
    
    if (!payment) {
      await telegramService.sendMessage(`Pembayaran dengan ID ${paymentId} tidak ditemukan.`);
      return;
    }
    
    const oldStatus = payment.status;
    payment.status = newStatus.toUpperCase();
    await payment.save();
    
    // Update related enrollment if needed
    const enrollment = payment.Enrollment;
    if (oldStatus !== newStatus && enrollment) {
      if (newStatus === 'APPROVED') {
        enrollment.status = 'APPROVED';
        const user = enrollment.User;
        const pkg = enrollment.MentorPackage;
        
        // Update user status based on package type
        if (pkg.product_type === 'komunitas') {
          user.status = 'menunggu_masuk_komunitas';
        } else if (pkg.product_type === 'mentoring') {
          user.status = 'mentoring_approved';
        }
        
        await user.save();
      }
    }
    
    await telegramService.sendMessage(`✅ Status pembayaran #${paymentId} berhasil diupdate ke ${newStatus}`);
    console.log(`Updated payment ${paymentId} status to ${newStatus}`);
  } catch (error) {
    console.error('Error handling /update_status command:', error);
    await telegramService.sendMessage('Terjadi kesalahan saat mengupdate status.');
  }
};

// Handle /verifikasi command
const handleVerifyCommand = async (text, chatId) => {
  try {
    console.log('Received /verifikasi command:', text);
    
    // Extract payment ID - handle both formats: /verifikasi 4 and /verifikasi4
    let paymentId;
    if (text.includes(' ')) {
      // Format: /verifikasi 4 [ID_PEMBAYARAN]
      const parts = text.split(' ');
      paymentId = parseInt(parts[1], 10);
    } else {
      // Format: /verifikasi4
      paymentId = parseInt(text.replace('/verifikasi', ''), 10);
    }
    
    if (isNaN(paymentId)) {
      await telegramService.sendMessage('Format salah. Gunakan: /verifikasi 4 [ID_PEMBAYARAN] atau /verifikasi4 [ID_PEMBAYARAN]');
      return;
    }
    
    // Find payment and mark as verified
    const payment = await Payment.findByPk(paymentId, {
      include: [{
        model: Enrollment,
        include: [{
          model: User,
          attributes: ['id', 'name', 'email', 'phone_number', 'telegram_user', 'status']
        }, {
          model: MentorPackage,
          attributes: ['id', 'name', 'product_type', 'price']
        }]
      }]
    });
    
    if (!payment) {
      await telegramService.sendMessage(`Pembayaran dengan ID ${paymentId} tidak ditemukan.`);
      return;
    }
    
    // Add verification flag
    payment.verified = true;
    await payment.save();
    
    await telegramService.sendMessage(`✅ Pembayaran #${paymentId} telah diverifikasi dan siap diproses.`);
    console.log(`Payment ${paymentId} marked as verified`);
  } catch (error) {
    console.error('Error handling /verifikasi command:', error);
    await telegramService.sendMessage('Terjadi kesalahan saat verifikasi pembayaran.');
  }
};

// Handle /batal command
const handleCancelCommand = async (text, chatId) => {
  try {
    console.log('Received /batal command:', text);
    
    // Extract payment ID
    let paymentId;
    if (text.includes(' ')) {
      // Format: /batal 4 [ID_PEMBAYARAN]
      const parts = text.split(' ');
      paymentId = parseInt(parts[1], 10);
    } else {
      // Format: /batal4
      paymentId = parseInt(text.replace('/batal', ''), 10);
    }
    
    if (isNaN(paymentId)) {
      await telegramService.sendMessage('Format salah. Gunakan: /batal 4 [ID_PEMBAYARAN] atau /batal4 [ID_PEMBAYARAN]');
      return;
    }
    
    // Find payment and cancel
    const payment = await Payment.findByPk(paymentId, {
      include: [{
        model: Enrollment,
        include: [{
          model: User,
          attributes: ['id', 'name', 'email', 'phone_number', 'telegram_user', 'status']
        }, {
          model: MentorPackage,
          attributes: ['id', 'name', 'product_type', 'price']
        }]
      }]
    });
    
    if (!payment) {
      await telegramService.sendMessage(`Pembayaran dengan ID ${paymentId} tidak ditemukan.`);
      return;
    }
    
    // Update payment status to CANCELLED
    payment.status = 'CANCELLED';
    await payment.save();
    
    // Update enrollment status to CANCELLED
    const enrollment = payment.Enrollment;
    if (enrollment) {
      enrollment.status = 'CANCELLED';
      await enrollment.save();
    }
    
    await telegramService.sendMessage(`❌ Pembayaran #${paymentId} telah dibatalkan.`);
    console.log(`Payment ${paymentId} cancelled`);
  } catch (error) {
    console.error('Error handling /batal command:', error);
    await telegramService.sendMessage('Terjadi kesalahan saat membatalkan pembayaran.');
  }
};

// Handle /help command
const handleHelpCommand = async (chatId) => {
  const helpMessage = `🤖 *MENU BANTUAN* 🤖\n\n` +
    `📋 *STATUS PEMBAYARAN* 📋\n` +
    `/status [ID] - Cek status pembayaran\n` +
    `/update_status [ID] [STATUS] - Update status pembayaran\n` +
    `/verifikasi [ID] - Verifikasi pembayaran\n` +
    `/batal [ID] - Batalkan pembayaran\n\n\n` +
    `📋 *FORMAT COMMAND* 📋\n` +
    `/status 4 [ID_PEMBAYARAN] atau /status4 [ID_PEMBAYARAN]\n` +
    `/update_status 4 [ID_PEMBAYARAN] [STATUS] atau /update_status4 [ID_PEMBAYARAN] [STATUS]\n` +
    `/verifikasi 4 [ID_PEMBAYARAN] atau /verifikasi4 [ID_PEMBAYARAN]\n` +
    `/batal 4 [ID_PEMBAYARAN] atau /batal4 [ID_PEMBAYARAN]\n\n` +
    `📋 *STATUS YANG TERSEDIA* 📋\n` +
    `WAITING_APPROVAL = Menunggu verifikasi\n` +
    `APPROVED = Disetujui\n` +
    `REJECTED = Ditolak\n` +
    `CANCELLED = Dibatalkan\n\n\n` +
    `📋 *CONTOH* 📋\n` +
    `Hubungi admin jika butuh bantuan.`;
    
  await telegramService.sendMessage(helpMessage);
};

// Handle /terima command
const handleAcceptCommand = async (text, chatId) => {
  try {
    console.log('Received /terima command:', text);
    
    let requestId;
    let shortId;
    
    if (text.includes(' ')) {
      // Format: /terima INV-XXXX
      const parts = text.split(' ');
      requestId = parts[1];
    } else {
      // Format: /terimaXXXX (4 digit terakhir)
      shortId = text.replace('/terima', '');
      if (shortId.length === 4 && /^\d+$/.test(shortId)) {
        // Cari invoice dengan 4 digit terakhir
        const enrollment = await Enrollment.findOne({
          where: {
            request_id: {
              [require('sequelize').Op.like]: `%${shortId}`
            }
          },
          include: [{
            model: User,
            attributes: ['id', 'name', 'email', 'phone_number', 'telegram_user', 'status']
          }, {
            model: MentorPackage,
            attributes: ['id', 'name', 'product_type', 'price']
          }, {
            model: Payment
          }]
        });
        
        if (!enrollment) {
          await telegramService.sendMessage(`Invoice tidak ditemukan.`);
          return;
        }
        
        requestId = enrollment.request_id;
      } else {
        await telegramService.sendMessage('Format salah. Gunakan: /terimaXXXX (4 digit terakhir) atau /terima INV-XXXX');
        return;
      }
    }
    
    console.log('Extracted requestId:', requestId);
    
    if (!requestId || !requestId.startsWith('INV-')) {
      await telegramService.sendMessage('Format salah. Gunakan: /terimaXXXX (4 digit terakhir) atau /terima INV-XXXX');
      return;
    }

    // Find enrollment by request_id
    const enrollment = await Enrollment.findOne({
      where: { request_id: requestId },
      include: [{
        model: User,
        attributes: ['id', 'name', 'email', 'phone_number', 'telegram_user', 'status']
      }, {
        model: MentorPackage,
        attributes: ['id', 'name', 'product_type', 'price']
      }, {
        model: Payment
      }]
    });

    if (!enrollment) {
      console.log(`Enrollment not found: ${requestId}`);
      await telegramService.sendMessage(`Request ${requestId} tidak ditemukan.`);
      return;
    }

    // Check if already processed
    if (enrollment.status !== 'pending') {
      await telegramService.sendMessage(`Invoice ini sudah diproses sebelumnya.`);
      return;
    }

    const user = enrollment.User;
    const pkg = enrollment.MentorPackage;
    
    console.log(`Found enrollment: ${enrollment.id}, User: ${user.id} (${user.email}), Package: ${pkg.name} (${pkg.product_type})`);
    console.log('Current user status:', user.status);

    // Update enrollment status
    await enrollment.update({
      status: 'approved',
      approved_by: 'Telegram Admin',
      approved_at: new Date(),
      action_source: 'telegram'
    });

    // Update payment status if exists
    if (enrollment.Payment) {
      await enrollment.Payment.update({ status: 'VERIFIED' });
      console.log(`[DEBUG] Payment ${enrollment.Payment.id} status updated to VERIFIED`);
    }

    // Update user status based on product type
    if (pkg.product_type === 'komunitas') {
      await user.update({ status: 'menunggu_masuk_komunitas' });
    } else if (pkg.product_type === 'mentoring') {
      await user.update({ status: 'mentoring_approved' });
    }

    // Log admin action
    await AdminLog.create({
      admin_id: 1, // Telegram bot admin ID
      admin_email: 'telegram@smi.bot',
      action: 'approve',
      request_id: requestId,
      action_source: 'telegram'
    });

    // Send notification
    if (pkg.product_type === 'komunitas') {
      await telegramService.sendCommunityPaymentApproved(enrollment.Payment, user, pkg);
    } else if (pkg.product_type === 'mentoring') {
      await telegramService.sendMentoringPaymentApproved(enrollment.Payment, user, pkg);
    }

    // Send sync notification to dashboard
    const lastFourDigits = requestId.split('-').pop(); // Get 4 digit terakhir
    await telegramService.sendMessage(`✅ Invoice ${lastFourDigits} berhasil diterima`);

    console.log('Command /terima processed successfully');
  } catch (error) {
    console.error('Error handling /terima command:', error);
    console.error('Error stack:', error.stack);
    await telegramService.sendMessage('Terjadi kesalahan saat memproses permintaan.');
  }
};

// Handle /tolak command
const handleRejectCommand = async (text, chatId) => {
  try {
    // Extract request ID and reason from command - handle both formats: /tolak INV-XXXX [ALASAN] and /tolakXXXX [ALASAN]
    let requestId;
    let reason = 'Tidak ada alasan yang diberikan';
    
    if (text.includes(' ')) {
      // Format: /tolak INV-XXXX [ALASAN] atau /tolakXXXX [ALASAN]
      const parts = text.split(' ');
      const firstPart = parts[0];
      
      if (firstPart === '/tolak') {
        // Format: /tolak INV-XXXX [ALASAN]
        requestId = parts[1];
        reason = parts.slice(2).join(' ') || reason;
      } else if (firstPart.startsWith('/tolak') && firstPart.length > 6) {
        // Format: /tolakXXXX [ALASAN]
        const shortId = firstPart.replace('/tolak', '');
        if (shortId.length === 4 && /^\d+$/.test(shortId)) {
          // Cari invoice dengan 4 digit terakhir
          const enrollment = await Enrollment.findOne({
            where: {
              request_id: {
                [require('sequelize').Op.like]: `%${shortId}`
              }
            },
            include: [{
              model: User,
              attributes: ['id', 'name', 'email', 'phone_number', 'telegram_user', 'status']
            }, {
              model: MentorPackage,
              attributes: ['id', 'name', 'product_type', 'price']
            }, {
              model: Payment
            }]
          });
          
          if (!enrollment) {
            await telegramService.sendMessage(`Invoice tidak ditemukan.`);
            return;
          }
          
          requestId = enrollment.request_id;
          reason = parts.slice(1).join(' ') || reason;
        } else {
          await telegramService.sendMessage('Format salah. Gunakan: /tolakXXXX [alasan] (4 digit terakhir) atau /tolak INV-XXXX [alasan]');
          return;
        }
      }
    } else {
      // Format: /tolakXXXX tanpa alasan
      const shortId = text.replace('/tolak', '');
      if (shortId.length === 4 && /^\d+$/.test(shortId)) {
        await telegramService.sendMessage('Gunakan format: /tolakXXXX alasan');
        return;
      } else {
        await telegramService.sendMessage('Format salah. Gunakan: /tolakXXXX [alasan] (4 digit terakhir) atau /tolak INV-XXXX [alasan]');
        return;
      }
    }
    
    if (!requestId || !requestId.startsWith('INV-')) {
      await telegramService.sendMessage('Format salah. Gunakan: /tolakXXXX [alasan] (4 digit terakhir) atau /tolak INV-XXXX [alasan]');
      return;
    }

    // Find enrollment by request_id
    const enrollment = await Enrollment.findOne({
      where: { request_id: requestId },
      include: [{
        model: User,
        attributes: ['id', 'name', 'email', 'phone_number', 'telegram_user', 'status']
      }, {
        model: MentorPackage,
        attributes: ['id', 'name', 'product_type', 'price']
      }, {
        model: Payment
      }]
    });

    if (!enrollment) {
      await telegramService.sendMessage(`Invoice tidak ditemukan.`);
      return;
    }

    // Check if already processed
    if (enrollment.status !== 'pending') {
      await telegramService.sendMessage(`Invoice ini sudah diproses sebelumnya.`);
      return;
    }

    const user = enrollment.User;
    const pkg = enrollment.MentorPackage;

    // Update enrollment status
    await enrollment.update({
      status: 'rejected',
      approved_by: 'Telegram Admin',
      approved_at: new Date(),
      rejected_reason: reason,
      action_source: 'telegram'
    });

    // Update payment status if exists
    if (enrollment.Payment) {
      await enrollment.Payment.update({ status: 'REJECTED' });
      console.log(`[DEBUG] Payment ${enrollment.Payment.id} status updated to REJECTED`);
    }

    // Update user status to rejected for both types
    await user.update({ status: 'rejected' });

    // Log admin action
    await AdminLog.create({
      admin_id: 1, // Telegram bot admin ID
      admin_email: 'telegram@smi.bot',
      action: 'reject',
      request_id: requestId,
      action_source: 'telegram',
      rejected_reason: reason
    });

    // Send notification
    if (pkg.product_type === 'komunitas') {
      await telegramService.sendCommunityPaymentRejected(enrollment.Payment, user, pkg, reason);
    } else {
      await telegramService.sendMentoringPaymentRejected(enrollment.Payment, user, pkg, reason);
    }

    // Send sync notification to dashboard
    const lastFourDigits = requestId.split('-').pop(); // Get 4 digit terakhir
    await telegramService.sendMessage(`❌ Invoice ${lastFourDigits} ditolak`);
  } catch (error) {
    console.error('Error handling /tolak command:', error);
    await telegramService.sendMessage('Terjadi kesalahan saat memproses permintaan.');
  }
};

module.exports = { 
  handleTelegramWebhook, 
  handleStatusCommand,
  handleUpdateStatusCommand,
  handleVerifyCommand,
  handleCancelCommand,
  handleHelpCommand,
  handleAcceptCommand, 
  handleRejectCommand
};
