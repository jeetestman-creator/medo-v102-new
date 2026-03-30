import { ArrowRight, Shield, TrendingUp, Users, Zap, Award, Globe, BarChart3, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SEOHead, organizationSchema, websiteSchema, financialServiceSchema } from '@/lib/seo';
import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import { getLandingPageSettings } from '@/db/api';

const iconMap: Record<string, any> = {
  "High Yield ROI": TrendingUp,
  "Bank-Grade Security": Shield,
  "Multi-Level Referral": Users,
  "Instant Processing": Zap,
  "Real-Time Analytics": BarChart3,
  "Global Access": Globe,
};

export default function LandingPage() {
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<any[]>([]);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const data = await getLandingPageSettings();
      setSettings(data);
    } catch (error) {
      console.error('Failed to fetch landing page settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSectionContent = (name: string, defaultValue: any) => {
    const section = settings.find(s => s.section_name === name);
    return section ? section.content : defaultValue;
  };

  const hero = getSectionContent('hero', {
    badge: "Live Platform Status: Active",
    title: "The Gold Standard of Digital Wealth",
    description: "Join the elite circle of investors earning consistent 10% monthly ROI. Secure, transparent, and built for your financial freedom.",
    primary_button: "Start Investing",
    secondary_button: "Member Login"
  });

  const stats = getSectionContent('stats', [
    { value: "10K+", label: "Active Investors" },
    { value: "$5M+", label: "Total Deposited" },
    { value: "100%", label: "Payout Record" },
    { value: "24/7", label: "Live Support" }
  ]);

  const features = getSectionContent('features', {
    title: "Why Choose Us",
    subtitle: "Built for Performance",
    description: "We combine traditional gold stability with modern blockchain efficiency to deliver unmatched returns and security for our investors.",
    items: [
      { title: "High Yield ROI", desc: "Earn a consistent 10% monthly return on your investment, paid out automatically to your wallet." },
      { title: "Bank-Grade Security", desc: "Your assets are protected by enterprise-level encryption and secure cold storage protocols." },
      { title: "Multi-Level Referral", desc: "Unlock 4 levels of commission earnings (8%, 4%, 2%, 1%) by building your own network." },
      { title: "Instant Processing", desc: "Deposits and withdrawals are processed with lightning speed through our automated system." },
      { title: "Real-Time Analytics", desc: "Track your earnings, team performance, and growth with our advanced dashboard." },
      { title: "Global Access", desc: "Invest from anywhere in the world using USDT. No borders, no limits, just pure growth." }
    ]
  });

  const seo = getSectionContent('seo', {
    title: "Gold X Usdt - Premium Crypto Investment Platform",
    description: "Experience the future of wealth generation with Gold X Usdt. 10% monthly ROI, secure blockchain infrastructure, and a powerful multi-level referral system.",
    keywords: ['gold usdt', 'crypto investment', 'passive income', 'high roi', 'secure wallet', 'usdt mining', 'wealth generation']
  });

  const cta = getSectionContent('cta', {
    title: "Ready to Transform Your Finances?",
    description: "Join thousands of satisfied investors who are already building their wealth with Gold X Usdt. Don't wait for opportunity—create it.",
    button_text: "Create Free Account"
  });

  const investment = getSectionContent('investment_plan', {
    title: "One Plan, Infinite Potential",
    description: "We believe in simplicity. One powerful plan designed to maximize your returns while minimizing risk. No hidden fees, no complex tiers.",
    features: [
      "Minimum Investment: 100 USDT",
      "Monthly ROI: 10% Guaranteed",
      "Principal Protection Included",
      "Instant Withdrawal Availability"
    ],
    plan_title: "Gold Plan",
    plan_subtitle: "The ultimate wealth builder",
    roi: "10%",
    min_deposit: "100 USDT",
    referral_bonus: "Up to 15%",
    duration: "Lifetime"
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <SEOHead
        title={seo.title}
        description={seo.description}
        keywords={seo.keywords}
        type="website"
      />
      <Helmet>
        <script type="application/ld+json">{organizationSchema}</script>
        <script type="application/ld+json">{websiteSchema}</script>
        <script type="application/ld+json">{financialServiceSchema}</script>
      </Helmet>

      <div className="min-h-screen overflow-x-hidden">
        {/* Abstract Background Elements */}
        <div className="fixed inset-0 pointer-events-none z-[-1]">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px] animate-pulse delay-1000" />
          <div className="absolute top-[40%] left-[50%] transform -translate-x-1/2 w-[60%] h-[60%] rounded-full bg-yellow-500/5 blur-[150px]" />
        </div>

        {/* Hero Section */}
        <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-32 px-4 overflow-hidden min-h-screen flex items-center">
          <div className="container mx-auto relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
              <div className="flex-1 text-center lg:text-left space-y-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full v56-glass mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span className="text-[10px] font-black tracking-[0.2em] uppercase text-primary/80">{hero.badge}</span>
                </div>
                
                <h1 className="text-6xl lg:text-8xl font-black mb-6 tracking-tighter leading-[0.9] animate-in fade-in slide-in-from-bottom-8 duration-1000">
                  {hero.title.includes('<br />') ? hero.title.split('<br />').map((text: string, i: number) => (
                    <span key={i} className={i === 1 ? "v56-gradient-text" : ""}>
                      {text} {i === 0 && <br />}
                    </span>
                  )) : (
                    <>
                      The Gold Standard <br />
                      <span className="v56-gradient-text italic">of Digital Wealth</span>
                    </>
                  )}
                </h1>
                
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0 leading-relaxed animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200 font-medium">
                  {hero.description}
                </p>

                <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-300 pt-4">
                  <Button size="lg" className="h-16 px-10 text-lg rounded-2xl" asChild>
                    <Link to="/signup">
                      {hero.primary_button} <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="h-16 px-10 text-lg rounded-2xl border-white/10" asChild>
                    <Link to="/login">{hero.secondary_button}</Link>
                  </Button>
                </div>

                <div className="mt-12 flex items-center justify-center lg:justify-start gap-8 text-sm text-muted-foreground animate-in fade-in duration-1000 delay-500">
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    <span>Audited Security</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-primary" />
                    <span>Instant Withdrawals</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-primary" />
                    <span>Global Access</span>
                  </div>
                </div>
              </div>

              <div className="flex-1 relative w-full max-w-lg lg:max-w-xl animate-in fade-in zoom-in duration-1000 delay-200">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-full blur-[80px]" />
                <div className="relative v56-glass p-2 rounded-3xl border border-primary/20 floating">
                  <div className="bg-background/80 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/5">
                    <div className="p-6 border-b border-white/5 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <Logo size={40} className="" />
                        <div>
                          <p className="font-bold text-lg">Gold X Portfolio</p>
                          <p className="text-xs text-green-500 flex items-center gap-1">
                            <TrendingUp className="h-3 w-3" /> +10.0% Monthly
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Current Balance</p>
                        <p className="text-xl font-bold font-mono">$12,450.00</p>
                      </div>
                    </div>
                    
                    <div className="p-6 space-y-6">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Monthly Growth</span>
                          <span className="text-primary font-bold">+ $1,245.00</span>
                        </div>
                        <div className="h-2 bg-secondary/20 rounded-full overflow-hidden">
                          <div className="h-full w-[75%] bg-gradient-to-r from-primary to-yellow-300 rounded-full animate-pulse" />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl bg-accent/30 border border-white/5">
                          <p className="text-xs text-muted-foreground mb-1">Active Deposit</p>
                          <p className="font-bold text-lg">$10,000</p>
                        </div>
                        <div className="p-4 rounded-xl bg-accent/30 border border-white/5">
                          <p className="text-xs text-muted-foreground mb-1">Total Earned</p>
                          <p className="font-bold text-lg text-primary">$2,450</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute -top-12 -right-12 v56-glass p-4 rounded-2xl animate-bounce delay-700 hidden md:block">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">ROI Paid</p>
                      <p className="font-bold text-green-500">Successfully</p>
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-8 -left-8 v56-glass p-4 rounded-2xl animate-bounce delay-1000 hidden md:block">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Community</p>
                      <p className="font-bold">Growing Fast</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 border-y border-white/5 bg-black/40 backdrop-blur-3xl">
          <div className="container mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
              {stats.map((stat: any, idx: number) => (
                <div key={idx} className="space-y-2 animate-in fade-in duration-700">
                  <p className="text-4xl md:text-6xl font-black v56-gradient-text tracking-tighter">{stat.value}</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-[0.3em] font-bold">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-24 px-4 relative">
          <div className="container mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <h2 className="text-sm font-bold text-primary uppercase tracking-widest mb-3">{features.title}</h2>
              <h3 className="text-3xl md:text-5xl font-bold mb-6">
                {features.subtitle.includes('Performance') ? (
                  <>Built for <span className="v56-gradient-text">Performance</span></>
                ) : features.subtitle}
              </h3>
              <p className="text-muted-foreground text-lg">
                {features.description}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.items.map((feature: any, idx: number) => {
                const Icon = iconMap[feature.title] || Shield;
                return (
                  <div key={idx} className="group relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative h-full v56-glass p-8 rounded-3xl border border-white/5 hover:border-primary/30 transition-all duration-300">
                      <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                        <Icon className="h-7 w-7 text-primary" />
                      </div>
                      <h4 className="text-xl font-bold mb-3">{feature.title}</h4>
                      <p className="text-muted-foreground leading-relaxed">
                        {feature.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Investment Plan */}
        <section className="py-24 px-4 bg-gradient-to-b from-transparent via-primary/5 to-transparent relative">
          <div className="container mx-auto">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              <div className="flex-1 space-y-8">
                <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                  {investment.title.includes('Infinite Potential') ? (
                    <>One Plan, <span className="v56-gradient-text">Infinite Potential</span></>
                  ) : investment.title}
                </h2>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  {investment.description}
                </p>
                
                <ul className="space-y-6">
                  {investment.features.map((item: string, idx: number) => (
                    <li key={idx} className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                        <Award className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-lg font-medium">{item}</span>
                    </li>
                  ))}
                </ul>

                <Button size="lg" className=" h-14 px-10 text-lg font-bold rounded-xl mt-4" asChild>
                  <Link to="/signup">Start Earning Today</Link>
                </Button>
              </div>

              <div className="flex-1 w-full max-w-md">
                <Card className="v56-glass premium-border relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <CardHeader className="text-center pb-8 border-b border-white/5 relative">
                    <div className="absolute top-0 right-0 p-4">
                      <div className="bg-primary text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                        Best Value
                      </div>
                    </div>
                    <CardTitle className="text-3xl font-bold v56-gradient-text mb-2">{investment.plan_title}</CardTitle>
                    <CardDescription className="text-lg">{investment.plan_subtitle}</CardDescription>
                  </CardHeader>
                  
                  <CardContent className="pt-8 space-y-6">
                    <div className="text-center mb-8">
                      <span className="text-6xl font-bold text-primary">{investment.roi}</span>
                      <span className="text-muted-foreground text-xl ml-2">/ Month</span>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-4 rounded-xl bg-accent/30 border border-white/5">
                        <span className="text-muted-foreground">Min Deposit</span>
                        <span className="font-bold text-lg">{investment.min_deposit}</span>
                      </div>
                      <div className="flex justify-between items-center p-4 rounded-xl bg-accent/30 border border-white/5">
                        <span className="text-muted-foreground">Referral Bonus</span>
                        <span className="font-bold text-lg text-primary">{investment.referral_bonus}</span>
                      </div>
                      <div className="flex justify-between items-center p-4 rounded-xl bg-accent/30 border border-white/5">
                        <span className="text-muted-foreground">Duration</span>
                        <span className="font-bold text-lg">{investment.duration}</span>
                      </div>
                    </div>

                    <Button className="w-full h-12 text-lg font-bold " asChild>
                      <Link to="/signup">Choose Plan</Link>
                    </Button>
                    
                    <p className="text-xs text-center text-muted-foreground mt-4">
                      *T&Cs apply. Past performance does not guarantee future results.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-4">
          <div className="container mx-auto">
            <div className="v56-glass rounded-3xl p-12 relative overflow-hidden text-center gold-shimmer">
              <div className="absolute inset-0 bg-primary/5" />
              <div className="relative z-10 max-w-3xl mx-auto space-y-8">
                <h2 className="text-4xl md:text-5xl font-bold mb-6">{cta.title}</h2>
                <p className="text-xl text-muted-foreground mb-8">
                  {cta.description}
                </p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <Button size="lg" className="h-16 px-12 text-xl font-bold rounded-xl " asChild>
                    <Link to="/signup">{cta.button_text}</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
