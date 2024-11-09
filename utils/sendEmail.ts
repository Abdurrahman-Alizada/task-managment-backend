import { createTransport, Transporter, SendMailOptions } from 'nodemailer';

interface SendVerificationEmailParams {
  email: string;
  subject: string;
  text: string;
}

export async function sendVerificationEmail({ email, subject, text }: SendVerificationEmailParams): Promise<{ message: string }> {
  try {
    const transporter: Transporter = createTransport({
      host: process.env.HOST,
      service: process.env.SERVICE,
      port: Number(process.env.EMAIL_PORT),
      secure: process.env.SECURE === 'true', 
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS,
      },
    });

    const mailOptions: SendMailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: subject || 'Account verification - Lanza jobs',
      html: `
      <!DOCTYPE html>
      <html lang="en">
        <body>
          <div style="font-family:Helvetica,Arial,sans-serif;overflow:auto;line-height:2">
            <div style="margin:50px auto;width:70%;padding:20px 0">
              <div style="border-bottom:1px solid #eee">
                <tr width="100%">
                  <td align="left" bgcolor="#ffffff" style="padding:36px 24px 0;font-family:'Source Sans Pro',Helvetica,Arial,sans-serif;border-top:3px solid #d4dadf">
                    <h1 style="margin:0;font-size:32px;font-weight:700;letter-spacing:-1px;line-height:48px">Confirm Your Email Address</h1>
                  </td>
                </tr>
              </div>
              <tr>
                <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
                  <p style="margin: 0;">Tap the button below to confirm your email address. <br /> If you didn't create an account with <a href="#">Lanza jobs</a>, you can safely delete this email. </p>
                </td>
              </tr>
              <table border="0" style="margin-top:20px;margin-bottom:20px; " cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" bgcolor="#1a82e2" style="border-radius: 6px;">
                    <a href="${text}" target="_blank" style="display: block; padding: 16px 36px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; color: #ffffff; text-decoration: none; border-radius: 6px;">Verify</a>
                  </td>
                </tr>
              </table>
              <p style="font-size:.9em">Regards, <br>
              </p>
               <p>Lanza jobs team</p>
              <hr style="border:none;border-top:1px solid #eee">
            </div>
          </div>
        </body>
      </html>
     `,
    };

    // Return a Promise with async/await
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
    return { message: "Email sent successfully" };
  } catch (error) {
    console.error("Email not sent!");
    console.error(error);
    // Return a rejected Promise with the error message
    throw new Error('An error occurred while sending the email');
  }
}
