import { createClient } from 'jsr:@supabase/supabase-js@2';
import { sendEmail } from '../_shared/email.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RequestBody {
  email: string;
  purpose: 'signup' | 'password_reset';
  userData?: {
    fullName: string;
    phone: string;
    country: string;
    password?: string;
    referralCode?: string;
  }
}

// Email template generator function
function generateEmailTemplate(
  purpose: 'signup' | 'password_reset',
  userName: string,
  actionUrl: string
): { subject: string; html: string } {
  const isSignup = purpose === 'signup';
  const year = new Date().getFullYear();
  
  const subject = isSignup 
    ? 'Verify Your Email - Gold X Usdt' 
    : 'Reset Your Password - Gold X Usdt';
  
  const title = isSignup 
    ? 'Verify Your Email Address' 
    : 'Reset Your Password';
  
  const description = isSignup
    ? 'Thank you for signing up with Gold X Usdt! To complete your registration and activate your account, please verify your email address by clicking the button below.'
    : 'We received a request to reset the password for your Gold X Usdt account. Click the button below to choose a new password and regain access to your account.';
  
  const buttonText = isSignup 
    ? 'Verify Email Address' 
    : 'Reset Password';
  
  const iconEmoji = isSignup ? '✓' : '🔑';
  const gradientColor = isSignup 
    ? '#4ade80 0%, #22c55e 100%' 
    : '#3b82f6 0%, #2563eb 100%';
  const shadowColor = isSignup 
    ? 'rgba(34, 197, 94, 0.3)' 
    : 'rgba(37, 99, 235, 0.3)';
  const borderColor = isSignup ? '#4ade80' : '#3b82f6';
  const linkColor = isSignup ? '#22c55e' : '#2563eb';
  
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; background-color: #f4f4f7; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;">
  
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f4f4f7; padding: 40px 0;">
    <tr>
      <td align="center">
        
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08); overflow: hidden;">
          
          <tr>
            <td style="background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); padding: 40px 30px; text-align: center; border-bottom: 3px solid #FFD700;">
              <h1 style="margin: 0; font-size: 28px; font-weight: 900; color: #FFD700; text-transform: uppercase; letter-spacing: 2px;">GOLD X USDT</h1>
              <p style="margin: 8px 0 0 0; font-size: 10px; color: #999999; letter-spacing: 4px; text-transform: uppercase;">Elite Investment Platform</p>
            </td>
          </tr>
          
          <tr>
            <td style="padding: 50px 40px;">
              
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td align="center" style="padding-bottom: 30px;">
                    <div style="width: 80px; height: 80px; background: linear-gradient(135deg, ${gradientColor}); border-radius: 50%; display: inline-flex; align-items: center; justify-content: center;">
                      <span style="font-size: 40px; color: #ffffff;">${iconEmoji}</span>
                    </div>
                  </td>
                </tr>
              </table>
              
              <h2 style="margin: 0 0 20px 0; font-size: 26px; font-weight: 700; color: #1a1a1a; text-align: center;">${title}</h2>
              
              <p style="margin: 0 0 20px 0; font-size: 16px; color: #333333; line-height: 1.6; text-align: center;">
                Hello <strong style="color: #FFD700;">${userName}</strong>,
              </p>
              
              <p style="margin: 0 0 30px 0; font-size: 15px; color: #555555; line-height: 1.7; text-align: center;">
                ${description}
              </p>
              
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td align="center" style="padding: 0 0 30px 0;">
                    <a href="${actionUrl}" style="display: inline-block; background: linear-gradient(135deg, ${gradientColor}); color: #ffffff; font-size: 16px; font-weight: 700; text-decoration: none; padding: 16px 50px; border-radius: 12px; box-shadow: 0 4px 15px ${shadowColor}; text-transform: uppercase; letter-spacing: 1px;">
                      ${buttonText}
                    </a>
                  </td>
                </tr>
              </table>
              
              <div style="background-color: #f9fafb; border-radius: 12px; padding: 20px; border-left: 4px solid ${borderColor}; margin-bottom: 30px;">
                <p style="margin: 0 0 10px 0; font-size: 13px; color: #666666;">If the button doesn't work, copy and paste this link into your browser:</p>
                <p style="margin: 0; font-size: 12px; color: ${linkColor}; word-break: break-all; line-height: 1.5;">
                  <a href="${actionUrl}" style="color: ${linkColor}; text-decoration: underline;">${actionUrl}</a>
                </p>
              </div>
              
              <div style="background-color: #fff7ed; border-radius: 12px; padding: 18px; border-left: 4px solid #f59e0b; margin-bottom: 30px;">
                <p style="margin: 0; font-size: 14px; color: #92400e; line-height: 1.6;">
                  <strong>⏱ Time-Sensitive:</strong> This link will expire in <strong>60 minutes</strong> for security reasons. Please complete the action as soon as possible.
                </p>
              </div>
              
              <div style="background-color: #fef2f2; border-radius: 12px; padding: 18px; border-left: 4px solid #ef4444;">
                <p style="margin: 0; font-size: 13px; color: #991b1b; line-height: 1.6;">
                  <strong>🔒 Security Notice:</strong> If you did not ${isSignup ? 'create an account' : 'request a password reset'} with Gold X Usdt, please ignore this email. Do not share this link with anyone.
                </p>
              </div>
              
            </td>
          </tr>
          
          <tr>
            <td style="background-color: #f9fafb; padding: 30px 40px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 10px 0; font-size: 14px; color: #6b7280; line-height: 1.6;">
                Need help? <a href="mailto:support@goldxusdt.com" style="color: #FFD700; text-decoration: none; font-weight: 600;">Contact Support</a>
              </p>
              <p style="margin: 0 0 15px 0; font-size: 12px; color: #9ca3af; line-height: 1.5;">
                This email was sent to you because you ${isSignup ? 'registered on our platform' : 'requested a password reset'}.
              </p>
              <p style="margin: 0; font-size: 11px; color: #9ca3af;">
                &copy; ${year} Gold X Usdt. All rights reserved.
              </p>
            </td>
          </tr>
          
        </table>
        
      </td>
    </tr>
  </table>
  
</body>
</html>`;

  return { subject, html };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { email, purpose, userData }: RequestBody = await req.json();

    if (!email || !purpose) {
      return new Response(
        JSON.stringify({ error: 'Email and purpose are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const token = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour expiry
    const siteUrl = Deno.env.get('SITE_URL') || 'https://goldxusdt.com';
    const fromEmail = Deno.env.get('ZOHO_SMTP_USER') || 'info@goldxusdt.com';

    let actionUrl = '';
    const userName = userData?.fullName || email.split('@')[0];

    if (purpose === 'signup') {
      if (!userData) throw new Error('User data required for signup link');
      
      // Store pending signup
      await supabase.from('pending_signups').delete().eq('email', email);
      await supabase.from('pending_signups').insert({
        email,
        password: userData.password,
        full_name: userData.fullName,
        phone: userData.phone,
        country: userData.country,
        referral_code: userData.referralCode,
        token,
        expires_at: expiresAt
      });

      actionUrl = `${siteUrl}/verify-email?token=${token}&email=${encodeURIComponent(email)}`;
    } else {
      // Store auth link for password reset
      await supabase.from('auth_links').delete().eq('email', email).eq('purpose', 'password_reset');
      await supabase.from('auth_links').insert({
        email,
        token,
        purpose: 'password_reset',
        expires_at: expiresAt
      });

      actionUrl = `${siteUrl}/reset-password?token=${token}&email=${encodeURIComponent(email)}`;
    }

    // Generate email template
    const { subject: emailSubject, html } = generateEmailTemplate(purpose, userName, actionUrl);

    await sendEmail({
      to: email,
      subject: emailSubject,
      from: `Gold X Usdt <${fromEmail}>`,
      html: html,
    });

    return new Response(
      JSON.stringify({ success: true, message: 'Premium verification link sent successfully' }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in send-auth-link function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
