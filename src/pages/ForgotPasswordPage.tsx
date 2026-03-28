import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/db/supabase';
import { OTPInput } from '@/components/ui/otp-input';
import { Loader2, Mail, Lock, Shield } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<'email' | 'otp' | 'reset'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Check if user exists in profiles first
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .maybeSingle();

      if (!profile) {
        toast.error('No account found with this email address');
        setLoading(false);
        return;
      }

      // Send reset link to email via edge function
      const { data, error } = await supabase.functions.invoke('send-auth-link', {
        body: { email, purpose: 'password_reset' }
      });

      if (error) throw error;

      toast.success(data?.message || 'Password reset link sent to your email. Please check your inbox.');
      setStep('otp');
    } catch (error: any) {
      toast.error(error.message || 'Failed to send reset link');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md border-border">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <Logo size={64} className="" />
          </div>
          <CardTitle className="text-2xl text-center">Reset Password</CardTitle>
          <CardDescription className="text-center">
            {step === 'email' ? "Enter your email to receive a password reset link" : "Check your email for the reset link"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 'email' ? (
            <form onSubmit={handleSendLink} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full " disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Send Reset Link'}
              </Button>
            </form>
          ) : (
            <div className="space-y-6 text-center">
              <div className="flex justify-center">
                <div className="p-3 rounded-full bg-primary/10 border border-primary/20 ">
                  <Mail className="h-10 w-10 text-primary" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Email Sent</h3>
                <p className="text-sm text-muted-foreground">
                  We've sent a password reset link to <span className="text-primary font-medium">{email}</span>. Please click the link to choose a new password.
                </p>
              </div>

              <div className="pt-4 space-y-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleSendLink}
                  disabled={loading}
                  className="w-full"
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Resend Link
                </Button>
                
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setStep('email')}
                  disabled={loading}
                  className="w-full text-sm"
                >
                  Back
                </Button>
              </div>
            </div>
          )}

          <div className="mt-4 text-center text-sm">
            <Link to="/login" className="text-primary hover:underline">
              Back to Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
