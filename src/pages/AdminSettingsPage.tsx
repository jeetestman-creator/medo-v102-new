import { Activity, Anchor, BarChart3, DollarSign, Globe, Image, Loader2, Mail, Palette, Save, Search, Terminal, Users, Wallet } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/db/supabase';
import { AssetUploader } from '@/components/admin/AssetUploader';

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(false);
  const [testingEmail, setTestingEmail] = useState(false);
  const [testRecipient, setTestRecipient] = useState('');
  const [settings, setSettings] = useState({
    // Platform Core
    platform_wallet_bep20: '',
    platform_wallet_trc20: '',
    min_deposit: '100',
    min_withdrawal: '50',
    deposit_fee: '5',
    withdrawal_fee: '5',
    monthly_roi: '10',
    daily_roi_percentage: '0.33',
    level1_commission: '8',
    level2_commission: '4',
    level3_commission: '2',
    level4_commission: '1',
    // ... Levels 5-15 (will map dynamically)
    global_auto_withdrawal_enabled: 'false',
    
    // External APIs
    bscscan_api_key: '',
    tronscan_api_key: '',
    
    // Branding & Assets
    site_title: 'Gold X Usdt',
    site_tagline: 'The Gold Standard of Digital Wealth',
    logo_header_url: '',
    logo_footer_url: '',
    favicon_url: '',
    primary_color: '#D4AF37',
    secondary_color: '#1A1A1A',
    accent_color: '#FFD700',
    font_family: 'Inter',
    
    // SEO & Meta
    seo_description: '',
    seo_keywords: '',
    og_title: '',
    og_description: '',
    og_image: '',
    twitter_card: 'summary_large_image',
    robots_txt: '',
    
    // Contact & Social
    contact_email: '',
    contact_phone: '',
    contact_address: '',
    social_facebook: '',
    social_twitter: '',
    social_instagram: '',
    social_telegram: '',
    
    // Analytics & Scripts
    analytics_code: '',
    header_scripts: '',
    footer_scripts: '',
    
    // Zoho SMTP
    zoho_smtp_user: '',
    zoho_smtp_pass: '',
    zoho_smtp_host: 'smtp.zoho.com',
    zoho_smtp_port: '465',
    
    // Help Links
    youtube_deposit_help: '',
    youtube_kyc_help: '',
    youtube_withdrawal_help: '',

    // Blockchain API auto-confirmation
    blockchain_api_trc20_key: '',
    blockchain_api_bep20_key: '',
    blockchain_trc20_wallet: '',
    blockchain_bep20_wallet: ''
  });

  // Initialize dynamic level commissions
  for (let i = 5; i <= 15; i++) {
    (settings as any)[`level${i}_commission`] = '';
  }

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('key, value');

      if (error) throw error;

      const settingsObj: any = { ...settings };
      (data || []).forEach((setting: any) => {
        // Only update if key exists in our initial state or is a dynamic level key
        if (setting.key in settingsObj || setting.key.startsWith('level')) {
          settingsObj[setting.key] = setting.value;
        }
      });
      setSettings(settingsObj);
    } catch (error) {
      console.error('Failed to load settings:', error);
      toast.error('Failed to load settings');
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const updates = Object.entries(settings).map(([key, value]) => ({
        key,
        value: value ? value.toString() : ''
      }));

      const { error } = await supabase
        .from('settings')
        .upsert(updates as any, { onConflict: 'key' });

      if (error) throw error;

      toast.success('Settings saved successfully');
      
      // Update CSS variables for live preview
      if (settings.primary_color) {
        document.documentElement.style.setProperty('--primary', settings.primary_color);
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const handleTestEmail = async () => {
    if (!testRecipient) {
      toast.error('Please enter a recipient email for testing');
      return;
    }

    setTestingEmail(true);
    try {
      const { error } = await supabase.functions.invoke('test-email', {
        body: { email: testRecipient }
      });

      if (error) {
        const errorMsg = await error?.context?.text();
        throw new Error(errorMsg || error.message);
      }

      toast.success('Test email sent successfully! Please check your inbox.');
    } catch (error: any) {
      console.error('Failed to send test email:', error);
      toast.error(`SMTP Test Failed: ${error.message}`);
    } finally {
      setTestingEmail(false);
    }
  };

  const updateSetting = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold v56-gradient-text">Platform Settings</h1>
          <p className="text-muted-foreground">Manage global configuration, branding, and SEO</p>
        </div>
        <Button onClick={handleSave} disabled={loading} size="lg">
          <Save className="h-4 w-4 mr-2" />
          {loading ? 'Saving...' : 'Save All Changes'}
        </Button>
      </div>
      <Tabs defaultValue="platform" className="w-full">
        <TabsList className="grid w-full grid-cols-5 lg:w-[1000px]">
          <TabsTrigger value="platform">Platform Core</TabsTrigger>
          <TabsTrigger value="blockchain">Blockchain API</TabsTrigger>
          <TabsTrigger value="branding">Branding & Assets</TabsTrigger>
          <TabsTrigger value="seo">SEO & Analytics</TabsTrigger>
          <TabsTrigger value="content">Content & Contact</TabsTrigger>
        </TabsList>

        {/* Platform Core Tab */}
        <TabsContent value="platform" className="space-y-6 mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Wallet Addresses */}
            <Card className="v56-glass premium-border">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Wallet className="h-5 w-5 text-primary" />
                  <CardTitle>Crypto Wallets</CardTitle>
                </div>
                <CardDescription>Deposit receiving addresses</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>BEP-20 Wallet Address</Label>
                  <Textarea
                    value={settings.platform_wallet_bep20}
                    onChange={(e) => updateSetting('platform_wallet_bep20', e.target.value)}
                    rows={2}
                    className="font-mono text-xs"
                  />
                </div>
                <div className="space-y-2">
                  <Label>TRC-20 Wallet Address</Label>
                  <Textarea
                    value={settings.platform_wallet_trc20}
                    onChange={(e) => updateSetting('platform_wallet_trc20', e.target.value)}
                    rows={2}
                    className="font-mono text-xs"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Transaction Limits */}
            <Card className="v56-glass premium-border">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-primary" />
                  <CardTitle>Financial Limits</CardTitle>
                </div>
                <CardDescription>Minimums and fees</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Min Deposit (USDT)</Label>
                    <Input
                      type="number"
                      value={settings.min_deposit}
                      onChange={(e) => updateSetting('min_deposit', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Min Withdrawal (USDT)</Label>
                    <Input
                      type="number"
                      value={settings.min_withdrawal}
                      onChange={(e) => updateSetting('min_withdrawal', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Deposit Fee (%)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={settings.deposit_fee}
                      onChange={(e) => updateSetting('deposit_fee', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Withdrawal Fee (%)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={settings.withdrawal_fee}
                      onChange={(e) => updateSetting('withdrawal_fee', e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* ROI Settings */}
            <Card className="v56-glass premium-border">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  <CardTitle>ROI Configuration</CardTitle>
                </div>
                <CardDescription>Investment returns settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Monthly ROI (%)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={settings.monthly_roi}
                      onChange={(e) => {
                        const monthly = e.target.value;
                        const daily = (parseFloat(monthly) / 30).toFixed(4);
                        updateSetting('monthly_roi', monthly);
                        updateSetting('daily_roi_percentage', daily);
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Daily ROI (%) [Auto]</Label>
                    <Input
                      type="number"
                      value={settings.daily_roi_percentage}
                      readOnly
                      className="bg-muted"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Email Server (Zoho SMTP) Configuration */}
            <Card className="v56-glass premium-border gold-border">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-primary" />
                  <CardTitle>Email Server (Zoho SMTP) Configuration</CardTitle>
                </div>
                <CardDescription>Securely configure your Zoho Mail SMTP authentication details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="zoho_smtp_user">SMTP Username</Label>
                    <Input
                      id="zoho_smtp_user"
                      placeholder="yourname@domain.com"
                      value={settings.zoho_smtp_user}
                      onChange={(e) => updateSetting('zoho_smtp_user', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zoho_smtp_pass">SMTP Password</Label>
                    <Input
                      id="zoho_smtp_pass"
                      type="password"
                      placeholder="••••••••"
                      value={settings.zoho_smtp_pass}
                      onChange={(e) => updateSetting('zoho_smtp_pass', e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="zoho_smtp_host">SMTP Host</Label>
                      <Input
                        id="zoho_smtp_host"
                        placeholder="smtp.zoho.com"
                        value={settings.zoho_smtp_host}
                        onChange={(e) => updateSetting('zoho_smtp_host', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zoho_smtp_port">SMTP Port</Label>
                      <Select
                        value={settings.zoho_smtp_port}
                        onValueChange={(val) => updateSetting('zoho_smtp_port', val)}
                      >
                        <SelectTrigger id="zoho_smtp_port">
                          <SelectValue placeholder="Port" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="465">465 (SSL)</SelectItem>
                          <SelectItem value="587">587 (TLS)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 space-y-4">
                  <Label className="text-xs font-semibold">Verify Connection</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Test recipient email"
                      value={testRecipient}
                      onChange={(e) => setTestRecipient(e.target.value)}
                      className="text-xs h-9"
                    />
                    <Button
                      onClick={handleTestEmail}
                      disabled={testingEmail}
                      variant="secondary"
                      size="sm"
                      className=" whitespace-nowrap"
                    >
                      {testingEmail ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <Mail className="h-4 w-4 mr-2" />
                      )}
                      Test
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Referral Commission */}
          <Card className="v56-glass premium-border">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <CardTitle>Referral Commission Structure</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {Array.from({ length: 15 }, (_, i) => i + 1).map((lvl) => (
                  <div key={lvl} className="space-y-1">
                    <Label className="text-xs">Level {lvl} (%)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={(settings as any)[`level${lvl}_commission`]}
                      onChange={(e) => updateSetting(`level${lvl}_commission`, e.target.value)}
                      className="h-8"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Blockchain API Tab */}
        <TabsContent value="blockchain" className="space-y-6 mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* TRC-20 (Tron) API */}
            <Card className="v56-glass premium-border">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Terminal className="h-5 w-5 text-primary" />
                  <CardTitle>TRC-20 API Configuration</CardTitle>
                </div>
                <CardDescription>TronScan or Tatum API for auto-confirmation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Tron API Key</Label>
                  <Input
                    type="password"
                    value={settings.blockchain_api_trc20_key}
                    onChange={(e) => updateSetting('blockchain_api_trc20_key', e.target.value)}
                    placeholder="Enter TronScan/Tatum API Key"
                  />
                </div>
                <div className="space-y-2">
                  <Label>System TRC-20 Wallet</Label>
                  <Input
                    value={settings.blockchain_trc20_wallet}
                    onChange={(e) => updateSetting('blockchain_trc20_wallet', e.target.value)}
                    placeholder="T..."
                  />
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Address to monitor for incoming TRC-20 transfers</p>
                </div>
              </CardContent>
            </Card>

            {/* BEP-20 (BSC) API */}
            <Card className="v56-glass premium-border">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Terminal className="h-5 w-5 text-primary" />
                  <CardTitle>BEP-20 API Configuration</CardTitle>
                </div>
                <CardDescription>BscScan or Moralis API for auto-confirmation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>BSC API Key</Label>
                  <Input
                    type="password"
                    value={settings.blockchain_api_bep20_key}
                    onChange={(e) => updateSetting('blockchain_api_bep20_key', e.target.value)}
                    placeholder="Enter BscScan/Moralis API Key"
                  />
                </div>
                <div className="space-y-2">
                  <Label>System BEP-20 Wallet</Label>
                  <Input
                    value={settings.blockchain_bep20_wallet}
                    onChange={(e) => updateSetting('blockchain_bep20_wallet', e.target.value)}
                    placeholder="0x..."
                  />
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Address to monitor for incoming BEP-20 transfers</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Branding & Assets Tab */}
        <TabsContent value="branding" className="space-y-6 mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="v56-glass premium-border">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Image className="h-5 w-5 text-primary" />
                  <CardTitle>Logos & Assets</CardTitle>
                </div>
                <CardDescription>Upload site branding assets</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <AssetUploader
                  label="Header Logo"
                  value={settings.logo_header_url}
                  onUpload={(url) => updateSetting('logo_header_url', url)}
                  onRemove={() => updateSetting('logo_header_url', '')}
                  bucket="public_assets"
                  description="Recommended: 200x50px PNG/SVG"
                />
                <AssetUploader
                  label="Footer Logo"
                  value={settings.logo_footer_url}
                  onUpload={(url) => updateSetting('logo_footer_url', url)}
                  onRemove={() => updateSetting('logo_footer_url', '')}
                  bucket="public_assets"
                  description="Recommended: White version, 200x50px"
                />
                <AssetUploader
                  label="Favicon"
                  value={settings.favicon_url}
                  onUpload={(url) => updateSetting('favicon_url', url)}
                  onRemove={() => updateSetting('favicon_url', '')}
                  bucket="public_assets"
                  description="Recommended: 32x32px ICO/PNG"
                />
              </CardContent>
            </Card>

            <Card className="v56-glass premium-border">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Palette className="h-5 w-5 text-primary" />
                  <CardTitle>Theme & Colors</CardTitle>
                </div>
                <CardDescription>Customize platform appearance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Primary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={settings.primary_color}
                      onChange={(e) => updateSetting('primary_color', e.target.value)}
                      className="w-12 p-1 h-9"
                    />
                    <Input
                      value={settings.primary_color}
                      onChange={(e) => updateSetting('primary_color', e.target.value)}
                      className="font-mono uppercase"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Secondary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={settings.secondary_color}
                      onChange={(e) => updateSetting('secondary_color', e.target.value)}
                      className="w-12 p-1 h-9"
                    />
                    <Input
                      value={settings.secondary_color}
                      onChange={(e) => updateSetting('secondary_color', e.target.value)}
                      className="font-mono uppercase"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Accent Color</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={settings.accent_color}
                      onChange={(e) => updateSetting('accent_color', e.target.value)}
                      className="w-12 p-1 h-9"
                    />
                    <Input
                      value={settings.accent_color}
                      onChange={(e) => updateSetting('accent_color', e.target.value)}
                      className="font-mono uppercase"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Font Family</Label>
                  <Select 
                    value={settings.font_family} 
                    onValueChange={(val) => updateSetting('font_family', val)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select font" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Inter">Inter (Default)</SelectItem>
                      <SelectItem value="Roboto">Roboto</SelectItem>
                      <SelectItem value="Open Sans">Open Sans</SelectItem>
                      <SelectItem value="Lato">Lato</SelectItem>
                      <SelectItem value="Montserrat">Montserrat</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* SEO & Analytics Tab */}
        <TabsContent value="seo" className="space-y-6 mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="v56-glass premium-border">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Search className="h-5 w-5 text-primary" />
                  <CardTitle>Global SEO Settings</CardTitle>
                </div>
                <CardDescription>Meta tags and search engine optimization</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Site Title</Label>
                  <Input
                    value={settings.site_title}
                    onChange={(e) => updateSetting('site_title', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Site Tagline</Label>
                  <Input
                    value={settings.site_tagline}
                    onChange={(e) => updateSetting('site_tagline', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Meta Description</Label>
                  <Textarea
                    value={settings.seo_description}
                    onChange={(e) => updateSetting('seo_description', e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Keywords (comma separated)</Label>
                  <Textarea
                    value={settings.seo_keywords}
                    onChange={(e) => updateSetting('seo_keywords', e.target.value)}
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Robots.txt Content</Label>
                  <Textarea
                    value={settings.robots_txt}
                    onChange={(e) => updateSetting('robots_txt', e.target.value)}
                    rows={4}
                    className="font-mono text-xs"
                  />
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card className="v56-glass premium-border">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-primary" />
                    <CardTitle>Open Graph & Social</CardTitle>
                  </div>
                  <CardDescription>Social media preview settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>OG Title</Label>
                    <Input
                      value={settings.og_title}
                      onChange={(e) => updateSetting('og_title', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>OG Description</Label>
                    <Textarea
                      value={settings.og_description}
                      onChange={(e) => updateSetting('og_description', e.target.value)}
                      rows={2}
                    />
                  </div>
                  <AssetUploader
                    label="OG Image (Social Share Image)"
                    value={settings.og_image}
                    onUpload={(url) => updateSetting('og_image', url)}
                    onRemove={() => updateSetting('og_image', '')}
                    bucket="public_assets"
                    description="Recommended: 1200x630px JPG"
                  />
                </CardContent>
              </Card>

              <Card className="v56-glass premium-border">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    <CardTitle>Analytics & Scripts</CardTitle>
                  </div>
                  <CardDescription>Inject custom code and tracking</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Analytics Code (GA4, etc.)</Label>
                    <Textarea
                      value={settings.analytics_code}
                      onChange={(e) => updateSetting('analytics_code', e.target.value)}
                      rows={3}
                      className="font-mono text-xs"
                      placeholder="<script>...</script>"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Header Scripts</Label>
                    <Textarea
                      value={settings.header_scripts}
                      onChange={(e) => updateSetting('header_scripts', e.target.value)}
                      rows={3}
                      className="font-mono text-xs"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Footer Scripts</Label>
                    <Textarea
                      value={settings.footer_scripts}
                      onChange={(e) => updateSetting('footer_scripts', e.target.value)}
                      rows={3}
                      className="font-mono text-xs"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Content & Contact Tab */}
        <TabsContent value="content" className="space-y-6 mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="v56-glass premium-border">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-primary" />
                  <CardTitle>Contact Information</CardTitle>
                </div>
                <CardDescription>Publicly displayed contact details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Contact Email</Label>
                  <Input
                    type="email"
                    value={settings.contact_email}
                    onChange={(e) => updateSetting('contact_email', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Contact Phone</Label>
                  <Input
                    value={settings.contact_phone}
                    onChange={(e) => updateSetting('contact_phone', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Address</Label>
                  <Textarea
                    value={settings.contact_address}
                    onChange={(e) => updateSetting('contact_address', e.target.value)}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="v56-glass premium-border">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-primary" />
                  <CardTitle>Social Media Links</CardTitle>
                </div>
                <CardDescription>Connect with your community</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Facebook URL</Label>
                  <Input
                    value={settings.social_facebook}
                    onChange={(e) => updateSetting('social_facebook', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Twitter/X URL</Label>
                  <Input
                    value={settings.social_twitter}
                    onChange={(e) => updateSetting('social_twitter', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Instagram URL</Label>
                  <Input
                    value={settings.social_instagram}
                    onChange={(e) => updateSetting('social_instagram', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Telegram Channel</Label>
                  <Input
                    value={settings.social_telegram}
                    onChange={(e) => updateSetting('social_telegram', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="v56-glass premium-border">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Anchor className="h-5 w-5 text-primary" />
                  <CardTitle>Help Resources</CardTitle>
                </div>
                <CardDescription>YouTube video links for tutorials</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Deposit Help Video URL</Label>
                  <Input
                    value={settings.youtube_deposit_help}
                    onChange={(e) => updateSetting('youtube_deposit_help', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>KYC Help Video URL</Label>
                  <Input
                    value={settings.youtube_kyc_help}
                    onChange={(e) => updateSetting('youtube_kyc_help', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Withdrawal Help Video URL</Label>
                  <Input
                    value={settings.youtube_withdrawal_help}
                    onChange={(e) => updateSetting('youtube_withdrawal_help', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
