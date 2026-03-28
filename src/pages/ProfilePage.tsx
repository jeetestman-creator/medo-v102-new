import { CheckCircle, Clock, Shield, Upload, User, XCircle, Download, Power, MapPin, Phone, Mail, Fingerprint, FileText, Wallet } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { getProfile, updateProfile } from '@/db/api';
import { supabase } from '@/db/supabase';
import { exportUserDataToExcel } from '@/lib/excel-export';
import { countries } from '@/lib/countries';
import { getStatesForCountry } from '@/lib/states';
import type { Profile } from '@/types';
import { cn } from '@/lib/utils';

export default function ProfilePage() {
  const { user, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [autoWithdrawal, setAutoWithdrawal] = useState(false);
  const [availableStates, setAvailableStates] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    address: '',
    state: '',
    city: '',
    country: '',
    postal_code: '',
    withdrawal_wallet_address: ''
  });

  useEffect(() => {
    loadProfile();
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;
    const data = await getProfile(user.id);
    if (data) {
      setProfile(data);
      setAutoWithdrawal((data as any).auto_withdrawal_enabled || false);
      
      const country = (data as any).country || '';
      const state = (data as any).state || '';
      
      if (country) setAvailableStates(getStatesForCountry(country));
      if (country && state) // setAvailableCities(getCitiesForState(country, state));
      
      setFormData({
        full_name: data.full_name || '',
        phone: data.phone || '',
        address: data.address || '',
        state: state,
        city: (data as any).city || '',
        country: country,
        postal_code: (data as any).postal_code || '',
        withdrawal_wallet_address: (data as any).withdrawal_wallet_address || ''
      });
    }
  };

  const handleDownloadMyData = async () => {
    if (!user || !profile) return;
    try {
      const [transactions, referrals] = await Promise.all([
        supabase.from('transactions').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('profiles').select('email, username, created_at, total_deposits').eq('referred_by', profile.referral_code)
      ]);
      exportUserDataToExcel({ ...profile, transactions: transactions.data || [], referrals: referrals.data || [] });
      toast.success('Your data has been downloaded successfully');
    } catch (error) {
      toast.error('Failed to download your data');
    }
  };

  const handleAutoWithdrawalToggle = async (enabled: boolean) => {
    if (!user) return;
    try {
      const nextDate = enabled ? calculateNextWithdrawalDate() : null;
      const { error } = await (supabase.from('profiles') as any).update({
        auto_withdrawal_enabled: enabled,
        next_auto_withdrawal_date: nextDate
      }).eq('id', user.id);
      if (error) throw error;
      setAutoWithdrawal(enabled);
      toast.success(enabled ? 'Auto-withdrawal enabled' : 'Auto-withdrawal disabled');
      loadProfile();
    } catch (error) {
      toast.error('Failed to update settings');
    }
  };

  const calculateNextWithdrawalDate = () => {
    const now = new Date();
    const day = now.getDate();
    return new Date(now.getFullYear(), now.getMonth() + (day < 20 ? 0 : 1), 20).toISOString().split('T')[0];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      const { error } = await updateProfile(user.id, formData);
      if (error) throw error;
      toast.success('Profile updated successfully');
      await refreshProfile();
      loadProfile();
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, docType: 'id_front' | 'id_back' | 'selfie') => {
    if (!user || !e.target.files?.[0]) return;
    const file = e.target.files[0];
    if (file.size > 1024 * 1024) return toast.error('File size must be < 1MB');
    if (!file.type.startsWith('image/')) return toast.error('Images only');

    setUploading(true);
    try {
      const filePath = `kyc/${user.id}/${docType}_${Date.now()}.${file.name.split('.').pop()}`;
      const { error: uploadError } = await supabase.storage.from('kyc_documents').upload(filePath, file, { upsert: true });
      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from('kyc_documents').getPublicUrl(filePath);
      const updateData: any = {};
      if (docType === 'id_front') updateData.kyc_id_front = urlData.publicUrl;
      if (docType === 'id_back') updateData.kyc_id_back = urlData.publicUrl;
      if (docType === 'selfie') updateData.kyc_selfie = urlData.publicUrl;
      
      updateData.kyc_status = 'pending';
      const { error: updateError } = await updateProfile(user.id, updateData);
      if (updateError) throw updateError;
      toast.success('Document uploaded. Status set to pending.');
      loadProfile();
    } catch (error) {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-6 lg:p-10 space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black tracking-tight leading-tight">
            Account <span className="v56-gradient-text">Intelligence</span>
          </h1>
          <p className="text-muted-foreground flex items-center gap-2">
            <User className="h-4 w-4" />
            Manage your global identity and security settings
          </p>
        </div>
        <Button onClick={handleDownloadMyData} variant="outline" className="rounded-xl border-primary/20 hover:bg-primary/5">
          <Download className="mr-2 h-4 w-4 text-primary" />
          Export My Data
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* KYC Status Banner */}
          <div className={cn(
            "p-6 rounded-3xl border flex flex-col md:flex-row items-center gap-6 v56-glass",
            profile?.kyc_status === 'approved' ? "border-green-500/20 bg-green-500/5" : "border-primary/20 bg-primary/5"
          )}>
            <div className={cn(
              "w-16 h-16 rounded-2xl flex items-center justify-center border transition-all",
              profile?.kyc_status === 'approved' ? "bg-green-500/20 border-green-500/30 text-green-500 " : "bg-primary/10 border-primary/20 text-primary"
            )}>
               {profile?.kyc_status === 'approved' ? <Shield className="h-8 w-8" /> : <Fingerprint className="h-8 w-8" />}
            </div>
            <div className="flex-1 text-center md:text-left space-y-1">
              <h3 className="text-xl font-black uppercase tracking-tight">Identity Verification</h3>
              <p className={cn("font-bold text-sm", 
                profile?.kyc_status === 'approved' ? "text-green-500" : 
                profile?.kyc_status === 'pending' ? "text-yellow-500" : 
                "text-primary"
              )}>
                {profile?.kyc_status === 'approved' && "Elite Status Verified - All Features Unlocked"}
                {profile?.kyc_status === 'pending' && "Documents Under Review - Please wait 24-48h"}
                {profile?.kyc_status === 'rejected' && `Verification Rejected: ${profile.kyc_rejection_reason}`}
                {profile?.kyc_status === 'not_submitted' && "Verify your identity to enable full platform access"}
              </p>
            </div>
            {profile?.kyc_status === 'not_submitted' && (
              <Button className=" rounded-xl font-bold uppercase tracking-widest text-xs px-6 h-12" onClick={() => toast.info('KYC submission started')}>
                Start KYC
              </Button>
            )}
          </div>

          <Card className="v56-glass premium-border overflow-hidden rounded-3xl">
            <CardHeader className="p-8 border-b border-white/5 bg-white/5">
              <CardTitle className="text-xl font-black flex items-center gap-3">
                <FileText className="h-5 w-5 text-primary" />
                Personal Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">Full Identity Name</Label>
                    <div className="relative">
                      <User className="absolute left-4 top-3.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        value={formData.full_name}
                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                        className="h-12 pl-12 rounded-xl bg-accent/30 border-white/5 focus:border-primary/50"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">Secure Contact Phone</Label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-3.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="h-12 pl-12 rounded-xl bg-accent/30 border-white/5 focus:border-primary/50 font-mono"
                        placeholder="+1 234 567 890"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">Physical Location Address</Label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-4 h-4 w-4 text-muted-foreground" />
                    <Textarea
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="min-h-[100px] pl-12 pt-4 rounded-xl bg-accent/30 border-white/5 focus:border-primary/50"
                      placeholder="123 Elite Ave, Gold City"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   <div className="space-y-2">
                      <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Country</Label>
                      <Select value={formData.country} onValueChange={(v) => {
                        setFormData({ ...formData, country: v, state: '', city: '' });
                        setAvailableStates(getStatesForCountry(v));
                      }}>
                        <SelectTrigger className="h-12 rounded-xl bg-accent/30 border-white/5"><SelectValue /></SelectTrigger>
                        <SelectContent className="max-h-[300px]">
                          {countries.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                        </SelectContent>
                      </Select>
                   </div>
                   <div className="space-y-2">
                      <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">State/Province</Label>
                      <Select value={formData.state} onValueChange={(v) => {
                        setFormData({ ...formData, state: v, city: '' });
                        // setAvailableCities(getCitiesForState(formData.country, v));
                      }} disabled={!formData.country}>
                        <SelectTrigger className="h-12 rounded-xl bg-accent/30 border-white/5"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {availableStates.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                        </SelectContent>
                      </Select>
                   </div>
                   <div className="space-y-2">
                      <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Postal Code</Label>
                      <Input 
                        value={formData.postal_code}
                        onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                        className="h-12 rounded-xl bg-accent/30 border-white/5"
                        placeholder="12345"
                      />
                   </div>
                </div>

                <Button type="submit" className="w-full h-14 rounded-2xl  font-black text-lg uppercase tracking-widest" disabled={loading}>
                  {loading ? "SAVING..." : "UPDATE PROFILE IDENTITY"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          {/* Financial Intelligence Section */}
          <Card className="v56-glass premium-border group overflow-hidden rounded-3xl">
             <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity"><Wallet size={80} /></div>
             <CardHeader className="p-8 border-b border-white/5 bg-white/5">
               <CardTitle className="text-xl font-black uppercase tracking-tight text-primary">Financial Logic</CardTitle>
               <CardDescription>Systematic wealth distribution</CardDescription>
             </CardHeader>
             <CardContent className="p-8 space-y-8">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-accent/30 border border-white/5">
                   <div className="space-y-0.5">
                      <p className="font-bold uppercase tracking-widest text-[10px]">Auto-Withdrawal</p>
                      <p className="text-xs text-muted-foreground">Monthly on 20th</p>
                   </div>
                   <Switch checked={autoWithdrawal} onCheckedChange={handleAutoWithdrawalToggle} className="data-[state=checked]:bg-primary" />
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">Auto-Withdrawal Wallet Address</Label>
                    <div className="relative">
                      <Wallet className="absolute left-4 top-3.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        value={formData.withdrawal_wallet_address}
                        onChange={(e) => setFormData({ ...formData, withdrawal_wallet_address: e.target.value })}
                        className="h-12 pl-12 rounded-xl bg-accent/30 border-white/5 focus:border-primary/50 font-mono text-xs"
                        placeholder="Enter USDT BEP-20/TRC-20 address"
                      />
                    </div>
                  </div>
                  <Button 
                    onClick={handleSubmit} 
                    className="w-full rounded-xl font-black h-12 uppercase tracking-widest text-[10px] "
                    disabled={loading}
                  >
                    {loading ? 'Processing...' : 'Secure Financial Wallet'}
                  </Button>
                </div>

                {autoWithdrawal && (
                   <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 text-center space-y-1">
                      <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Next Cycle Payout</p>
                      <p className="text-lg font-black text-primary font-mono">{calculateNextWithdrawalDate()}</p>
                   </div>
                )}
             </CardContent>
          </Card>

          {/* KYC Documents Section */}
          <Card className="v56-glass premium-border rounded-3xl overflow-hidden">
             <CardHeader>
                <CardTitle className="text-lg font-black uppercase tracking-tight">KYC Vault</CardTitle>
                <CardDescription>Secure document submission</CardDescription>
             </CardHeader>
             <CardContent className="space-y-4">
                {[
                  { id: 'id_front', label: 'ID Front Page', icon: FileText },
                  { id: 'id_back', label: 'ID Back Page', icon: FileText },
                  { id: 'selfie', label: 'Identity Selfie', icon: User }
                ].map((doc) => (
                  <div key={doc.id} className="relative group">
                    <input
                      type="file"
                      id={doc.id}
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, doc.id as any)}
                      accept="image/*"
                      disabled={uploading || profile?.kyc_status === 'approved'}
                    />
                    <label
                      htmlFor={doc.id}
                      className={cn(
                        "flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer",
                        (profile as any)?.[`kyc_${doc.id}`] 
                          ? "bg-green-500/5 border-green-500/20" 
                          : "bg-accent/30 border-white/5 hover:border-primary/40"
                      )}
                    >
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform">
                            <doc.icon className="h-5 w-5 opacity-40" />
                         </div>
                         <div>
                            <p className="text-xs font-bold uppercase tracking-widest">{doc.label}</p>
                            <p className="text-[10px] text-muted-foreground">
                               {(profile as any)?.[`kyc_${doc.id}`] ? "Verified Document" : "Awaiting Upload"}
                            </p>
                         </div>
                      </div>
                      {(profile as any)?.[`kyc_${doc.id}`] ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <Upload className="h-5 w-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                      )}
                    </label>
                  </div>
                ))}
             </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
