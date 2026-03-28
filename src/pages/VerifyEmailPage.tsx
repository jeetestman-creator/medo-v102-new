import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { supabase } from '@/db/supabase';
import { SEOHead } from '@/lib/seo';

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (token && email) {
      verifyToken();
    } else {
      setStatus('error');
      setMessage('Invalid verification link');
    }
  }, [token, email]);

  const verifyToken = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('activate-account', {
        body: { token, email }
      });

      if (error) {
        let errorMsg = error.message;
        try {
          if (error.context && typeof error.context.text === 'function') {
            errorMsg = await error.context.text();
          }
        } catch (e) {}
        throw new Error(errorMsg || 'Failed to verify email');
      }

      if (data?.success) {
        setStatus('success');
        setMessage(data.message || 'Your account has been successfully activated.');
        toast.success('Account activated! You can now login.');
        setTimeout(() => navigate('/login'), 3000);
      } else {
        throw new Error(data?.error || 'Verification failed');
      }
    } catch (error: any) {
      console.error('Verification error:', error);
      setStatus('error');
      setMessage(error.message || 'The verification link is invalid or has expired.');
    }
  };

  return (
    <>
      <SEOHead
        title="Email Verification"
        description="Verify your email address to activate your Gold X Usdt account."
        noindex={true}
      />
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <Card className="w-full max-w-md border-border text-center">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-4">
              <Logo size={64} className="" />
            </div>
            <CardTitle className="text-2xl">Account Activation</CardTitle>
            <CardDescription>
              {status === 'loading' && "Please wait while we verify your email..."}
              {status === 'success' && "Verification successful!"}
              {status === 'error' && "Verification failed"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {status === 'loading' && (
              <div className="flex justify-center py-8">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
              </div>
            )}

            {status === 'success' && (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <CheckCircle2 className="h-16 w-16 text-green-500" />
                </div>
                <p className="text-muted-foreground">{message}</p>
                <p className="text-xs text-muted-foreground pt-4">
                  Redirecting to login page in 3 seconds...
                </p>
              </div>
            )}

            {status === 'error' && (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <XCircle className="h-16 w-16 text-destructive" />
                </div>
                <p className="text-muted-foreground">{message}</p>
                <div className="pt-4">
                  <button 
                    onClick={() => navigate('/signup')}
                    className="text-primary hover:underline font-medium"
                  >
                    Back to Sign Up
                  </button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
