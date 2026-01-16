const { Payment, Enrollment, User, MentorPackage } = require('../models');
const telegramService = require('../services/telegram.service');

// Handle Telegram webhook updates
const handleTelegramWebhook = async (req, res) => {
  try {
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
    
    res.status(200).send('OK');
  } catch (error) {
    console.error('Error handling Telegram webhook:', error);
    res.status(500).send('Internal Server Error');
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
        include: [MentorPackage, User]
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
        include: [MentorPackage, User]
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
        include: [MentorPackage, User]
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
        include: [MentorPackage, User]
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
    
    // Extract payment ID from command - handle both formats: /terima 4 and /terima4
    let paymentId;
    if (text.includes(' ')) {
      // Format: /terima 4
      const parts = text.split(' ');
      paymentId = parseInt(parts[1], 10);
    } else {
      // Format: /terima4
      paymentId = parseInt(text.replace('/terima', ''), 10);
    }
    
    console.log('Extracted paymentId:', paymentId);
    
    if (isNaN(paymentId)) {
      await telegramService.sendMessage('Format salah. Gunakan: /terima [ID_PEMBAYARAN] atau /terima[ID_PEMBAYARAN]');
      return;
    }

    // Find payment with full relations
    const payment = await Payment.findByPk(paymentId, {
      include: [{
        model: Enrollment,
        include: [MentorPackage, User]
      }]
    });

    if (!payment) {
      console.log(`Payment not found: ${paymentId}`);
      await telegramService.sendMessage(`Pembayaran dengan ID ${paymentId} tidak ditemukan.`);
      return;
    }

    const enrollment = payment.Enrollment;
    const user = enrollment.User;
    const pkg = enrollment.MentorPackage;
    
    console.log(`Found payment: ${payment.id}, User: ${user.id} (${user.email}), Package: ${pkg.name} (${pkg.product_type})`);
    console.log('Current user status:', user.status);

    // Update payment status to VERIFIED
    payment.status = 'VERIFIED';
    await payment.save();
    console.log('Updated payment status to VERIFIED');

    // Update enrollment status to APPROVED
    enrollment.status = 'APPROVED';
    await enrollment.save();
    console.log('Updated enrollment status to APPROVED');

    // Update user status based on product type
    if (pkg.product_type === 'komunitas') {
      user.status = 'menunggu_masuk_komunitas';
      await user.save();
      console.log('Updated user status to menunggu_masuk_komunitas');
      await telegramService.sendCommunityPaymentApproved(payment, user, pkg);
    } else if (pkg.product_type === 'mentoring') {
      user.status = 'mentoring_approved';
      await user.save();
      console.log('Updated user status to mentoring_approved');
      await telegramService.sendMentoringPaymentApproved(payment, user, pkg);
    }

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
    // Extract payment ID and reason from command - handle both formats: /tolak 4 [ALASAN] and /tolak4 [ALASAN]
    let paymentId;
    let reason = 'Tidak ada alasan yang diberikan';
    
    if (text.includes(' ')) {
      // Format: /tolak 4 [ALASAN]
      const parts = text.split(' ');
      paymentId = parseInt(parts[1], 10);
      reason = parts.slice(2).join(' ') || reason;
    } else {
      // Format: /tolak4
      paymentId = parseInt(text.replace('/tolak', ''), 10);
    }
    
    if (isNaN(paymentId)) {
      await telegramService.sendMessage('Format salah. Gunakan: /tolak [ID_PEMBAYARAN] [ALASAN] atau /tolak[ID_PEMBAYARAN] [ALASAN]');
      return;
    }

    // Find payment with full relations
    const payment = await Payment.findByPk(paymentId, {
      include: [{
        model: Enrollment,
        include: [MentorPackage, User]
      }]
    });

    if (!payment) {
      await telegramService.sendMessage(`Pembayaran dengan ID ${paymentId} tidak ditemukan.`);
      return;
    }

    const enrollment = payment.Enrollment;
    const user = enrollment.User;
    const pkg = enrollment.MentorPackage;

    // Update payment status to REJECTED
    payment.status = 'REJECTED';
    await payment.save();

    // Update enrollment status to REJECTED
    enrollment.status = 'REJECTED';
    await enrollment.save();

    // Update user status to rejected for both types
    user.status = 'rejected';
    await user.save();

    // Send different notifications based on product type
    if (pkg.product_type === 'komunitas') {
      await telegramService.sendCommunityPaymentRejected(payment, user, pkg, reason);
    } else {
      await telegramService.sendMentoringPaymentRejected(payment, user, pkg, reason);
    }
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
