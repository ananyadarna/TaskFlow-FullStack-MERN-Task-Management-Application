const nodemailer = require('nodemailer');

// Configure Nodemailer SMTP transporter
const createTransporter = () => {
  if (process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT) || 587,
      secure: process.env.EMAIL_PORT === '465',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }
  return null;
};

// Send task creation email notification
const sendTaskCreationEmail = async (toEmail, task) => {
  try {
    const transporter = createTransporter();
    const mailOptions = {
      from: `"TaskFlow App" <${process.env.EMAIL_USER || 'noreply@taskflow.com'}>`,
      to: toEmail,
      subject: `New Task Created: ${task.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #4F46E5;">Task Successfully Created!</h2>
          <p>Hello,</p>
          <p>Your new task <strong>"${task.title}"</strong> has been created with status <strong>${task.status}</strong> and priority <strong>${task.priority}</strong>.</p>
          ${task.dueDate ? `<p><strong>Due Date:</strong> ${new Date(task.dueDate).toLocaleDateString()}</p>` : ''}
          ${task.location ? `<p><strong>Location:</strong> ${task.location}</p>` : ''}
          <hr style="border: 0; border-top: 1px solid #eee;" />
          <p style="font-size: 12px; color: #777;">TaskFlow Management Team</p>
        </div>
      `,
    };

    if (transporter) {
      await transporter.sendMail(mailOptions);
      console.log(`Creation email sent to ${toEmail}`);
    } else {
      console.log(`[Email Service Mock] Creation notification for task "${task.title}" to ${toEmail}`);
    }
  } catch (error) {
    console.error('Failed to send task creation email:', error.message);
  }
};

// Send task completion email notification
const sendTaskCompletionEmail = async (toEmail, task) => {
  try {
    const transporter = createTransporter();
    const mailOptions = {
      from: `"TaskFlow App" <${process.env.EMAIL_USER || 'noreply@taskflow.com'}>`,
      to: toEmail,
      subject: `Task Completed: ${task.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #10B981;">🎉 Task Completed!</h2>
          <p>Hello,</p>
          <p>Great job! Your task <strong>"${task.title}"</strong> has been marked as <strong>DONE</strong>.</p>
          <hr style="border: 0; border-top: 1px solid #eee;" />
          <p style="font-size: 12px; color: #777;">TaskFlow Management Team</p>
        </div>
      `,
    };

    if (transporter) {
      await transporter.sendMail(mailOptions);
      console.log(`Completion email sent to ${toEmail}`);
    } else {
      console.log(`[Email Service Mock] Completion notification for task "${task.title}" to ${toEmail}`);
    }
  } catch (error) {
    console.error('Failed to send task completion email:', error.message);
  }
};

module.exports = {
  sendTaskCreationEmail,
  sendTaskCompletionEmail,
};
