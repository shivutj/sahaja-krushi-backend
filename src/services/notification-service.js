require('dotenv').config();
const models = require('../models');
const { User, Query, Farmer } = models;

function safeRequire(moduleName) {
  try {
    // eslint-disable-next-line import/no-dynamic-require, global-require
    return require(moduleName);
  } catch (e) {
    return null;
  }
}

async function getAdminRecipients() {
  const admins = await User.findAll({
    where: { role: ['ADMIN', 'SUPER_ADMIN'], isActive: true },
    attributes: ['email', 'phone', 'username', 'role'],
    order: [['role', 'ASC'], ['username', 'ASC']],
  });
  return admins.map(a => ({ email: a.email, phone: a.phone, name: a.username, role: a.role }));
}

async function sendEmailToAll(subject, html) {
  const nodemailer = safeRequire('nodemailer');
  if (!nodemailer) {
    console.warn('[notify] nodemailer not installed. Skipping email notification');
    return { success: false, error: 'nodemailer not installed' };
  }
  
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM } = process.env;
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    console.warn('[notify] SMTP environment variables not configured. Required: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS');
    return { success: false, error: 'SMTP configuration missing' };
  }
  
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
    tls: {
      rejectUnauthorized: false // Allow self-signed certificates
    }
  });
  
  try {
    console.log('[notify] Verifying SMTP connection...');
    await transporter.verify();
    console.log('[notify] SMTP connection verified successfully');
  } catch (e) {
    console.error('[notify] SMTP verification failed:', e.message);
    return { success: false, error: `SMTP verification failed: ${e.message}` };
  }
  
  const recipients = await getAdminRecipients();
  if (recipients.length === 0) {
    console.warn('[notify] No admin recipients found');
    return { success: false, error: 'No admin recipients found' };
  }
  
  const emails = recipients.map(r => r.email).filter(Boolean);
  if (emails.length === 0) {
    console.warn('[notify] No valid admin email addresses found');
    return { success: false, error: 'No valid admin email addresses' };
  }
  
  const fromAddr = SMTP_FROM || SMTP_USER;
  console.log(`[notify] Sending email to ${emails.length} recipients: ${emails.join(', ')}`);
  
  const results = await Promise.allSettled(
    emails.map(to => transporter.sendMail({ 
      from: fromAddr, 
      to, 
      subject, 
      html,
      text: html.replace(/<[^>]*>/g, '') // Plain text version
    }))
  );
  
  let successCount = 0;
  let failureCount = 0;
  
  results.forEach((res, idx) => {
    const to = emails[idx];
    if (res.status === 'rejected') {
      console.error(`[notify] Email to ${to} failed:`, res.reason?.message || res.reason);
      failureCount++;
    } else {
      console.log(`[notify] Email sent successfully to ${to}`);
      successCount++;
    }
  });
  
  console.log(`[notify] Email notification summary: ${successCount} sent, ${failureCount} failed`);
  return { 
    success: successCount > 0, 
    sent: successCount, 
    failed: failureCount,
    total: emails.length
  };
}

// SMS notification functionality commented out as per requirements
// async function sendSmsToAll(body) {
//   const twilio = safeRequire('twilio');
//   const { TWILIO_SID, TWILIO_TOKEN, TWILIO_FROM } = process.env;
//   if (!twilio || !TWILIO_SID || !TWILIO_TOKEN || !TWILIO_FROM) {
//     console.warn('[notify] Twilio not configured. Skipping SMS notification');
//     return;
//   }
//   const client = twilio(TWILIO_SID, TWILIO_TOKEN);
//   const recipients = await getAdminRecipients();
//   const phones = recipients.map(r => r.phone).filter(Boolean);
//   await Promise.allSettled(
//     phones.map(p => client.messages.create({ to: p, from: TWILIO_FROM, body }))
//   );
// }

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

async function notifyAdminsNewQuery(queryId) {
  try {
    console.log(`[notify] Processing notification for query ID: ${queryId}`);
    
    const item = await Query.findByPk(queryId, {
      include: [{ model: Farmer, as: 'farmer' }],
    });
    if (!item) {
      console.warn(`[notify] Query with ID ${queryId} not found`);
      return;
    }
    
    const title = 'New Farmer Query Submitted';
    const html = `
      <div style="font-family:Arial,sans-serif;line-height:1.5;max-width:600px;margin:0 auto">
        <h2 style="color:#2c3e50;border-bottom:2px solid #3498db;padding-bottom:10px">New Farmer Query</h2>
        <div style="background:#f8f9fa;padding:20px;border-radius:5px;margin:20px 0">
          <p><strong>Farmer:</strong> ${escapeHtml(item.farmer?.fullName || 'Unknown')} (${escapeHtml(item.farmer?.farmerId || 'N/A')})</p>
          <p><strong>Contact:</strong> ${escapeHtml(item.farmer?.contactNumber || 'Not provided')}</p>
          <p><strong>Query ID:</strong> ${item.id}</p>
          <p><strong>Status:</strong> <span style="color:#e74c3c;font-weight:bold">${item.status}</span></p>
        </div>
        <div style="background:#fff;padding:20px;border:1px solid #ddd;border-radius:5px">
          <h3 style="color:#2c3e50;margin-top:0">Description:</h3>
          <p style="white-space:pre-wrap">${escapeHtml(item.description) || 'No description provided'}</p>
        </div>
        <div style="text-align:center;margin:30px 0">
          <a href="/admin/farmer-query/${item.id}" style="background:#3498db;color:white;padding:12px 24px;text-decoration:none;border-radius:5px;display:inline-block">Open in Admin Panel</a>
        </div>
        <hr style="border:none;border-top:1px solid #eee;margin:30px 0">
        <p style="color:#7f8c8d;font-size:12px;text-align:center">This is an automated notification from Sahaja Krushi System</p>
      </div>
    `;
    
    // SMS notification commented out as per requirements
    // const sms = `New farmer query: ${item.farmer?.fullName || '-'} (${item.farmer?.farmerId || '-'}) - id ${item.id}`;
    
    // Send email notification and log results
    const emailResult = await sendEmailToAll(title, html);
    if (emailResult.success) {
      console.log(`[notify] Email notification sent successfully: ${emailResult.sent}/${emailResult.total} emails delivered`);
    } else {
      console.error(`[notify] Email notification failed: ${emailResult.error}`);
    }
    
    // sendSmsToAll(sms); // Commented out
  } catch (err) {
    console.error('[notify] Failed to process notification:', err.message);
    console.error('[notify] Error details:', err);
  }
}

module.exports = {
  notifyAdminsNewQuery,
};


