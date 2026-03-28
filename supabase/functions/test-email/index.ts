import { createClient } from 'jsr:@supabase/supabase-js@2';
import { sendEmail } from '../_shared/email.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RequestBody {
  email: string;
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

    // Verify admin role
    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: corsHeaders });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers: corsHeaders });
    }

    const { email }: RequestBody = await req.json();

    if (!email) {
      return new Response(
        JSON.stringify({ error: 'Email is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Sending test email to: ${email}`);

    const siteUrl = Deno.env.get('SITE_URL') || 'https://goldxusdt.com';

    await sendEmail({
      to: email,
      subject: 'Test Email - Gold X Usdt',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #FFD700; border-radius: 10px; background-color: #0A0A0A; color: #FFFFFF;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #FFD700; margin: 0;">Gold X Usdt</h1>
            <p style="color: #888; font-size: 14px;">Secure USDT Investment Platform</p>
          </div>
          <div style="background-color: #1A1A1A; padding: 30px; border-radius: 8px; text-align: center; border: 1px solid rgba(255, 215, 0, 0.1);">
            <h2 style="color: #FFFFFF; margin-top: 0; font-size: 24px;">SMTP Test Successful!</h2>
            <p style="color: #AAA; margin-bottom: 25px; font-size: 16px;">This is a test email sent from your Gold X Usdt application via Zoho Mail SMTP.</p>
            
            <div style="margin-bottom: 25px;">
              <div style="color: #000000; padding: 15px 30px; border-radius: 6px; background-color: #FFD700; display: inline-block; font-weight: bold; font-size: 18px; box-shadow: 0 4px 15px rgba(255, 215, 0, 0.3);">
                Configuration Verified ✅
              </div>
            </div>

            <div style="margin-top: 20px;">
              <a href="${siteUrl}" style="background-color: #FFD700; color: #000000; padding: 10px 25px; border-radius: 5px; text-decoration: none; font-weight: bold; font-size: 14px; display: inline-block;">
                Visit Website
              </a>
            </div>

            <p style="color: #888; margin-top: 25px; font-size: 12px;">Sent on: ${new Date().toLocaleString()}</p>
          </div>
          <div style="margin-top: 25px; text-align: center; font-size: 12px; color: #666;">
            <p>&copy; 2026 Gold X Usdt. All rights reserved.</p>
          </div>
        </div>
      `,
    });

    return new Response(
      JSON.stringify({ success: true, message: 'Test email sent successfully' }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in test-email function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
