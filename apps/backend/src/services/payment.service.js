const db = require('../config/db');
const telegramService = require('./telegram.service');

class PaymentService {
    async createTransaction(userId, packageId) {
        const [result] = await db.query(
            'INSERT INTO transactions (user_id, package_id, status) VALUES (?, ?, ?)',
            [userId, packageId, 'pending']
        );
        return result.insertId;
    }

    async uploadProof(transactionId, imagePath) {
        await db.query(
            'INSERT INTO transaction_proofs (transaction_id, image_path) VALUES (?, ?)',
            [transactionId, imagePath]
        );

        // Fetch transaction and user details for notification
        const [rows] = await db.query(`
            SELECT t.id, u.name as user_name, u.email as user_email, p.name as package_name, p.price 
            FROM transactions t
            JOIN users u ON t.user_id = u.id
            JOIN packages p ON t.package_id = p.id
            WHERE t.id = ?
        `, [transactionId]);

        if (rows.length > 0) {
            const t = rows[0];
            const caption = `
<b>🔔 Bukti Pembayaran Baru!</b>
━━━━━━━━━━━━━━━━━━
<b>ID Transaksi:</b> #${t.id}
<b>User:</b> ${t.user_name} (${t.user_email})
<b>Paket:</b> ${t.package_name}
<b>Total:</b> Rp ${Number(t.price).toLocaleString('id-ID')}
━━━━━━━━━━━━━━━━━━
Gunakan command:
<code>/acc ${t.id}</code> - Terima
<code>/tolak ${t.id}</code> - Tolak
            `;
            
            const path = require('path');
            const fullPath = path.join(__dirname, '../../', imagePath);
            await telegramService.sendPhoto(fullPath, caption);
        }
    }

    async updateStatus(transactionId, status) {
        await db.query('UPDATE transactions SET status = ? WHERE id = ?', [status, transactionId]);
    }
}

module.exports = new PaymentService();
