import { useSettings } from '@/contexts/SettingsContext';

interface LogoProps {
  className?: string;
  size?: number;
  variant?: 'header' | 'footer';
}

export function Logo({ className = '', size = 40, variant = 'header' }: LogoProps) {
  const { settings: platformSettings } = useSettings();
  const logoUrl = variant === 'header' ? platformSettings?.logo_header_url : platformSettings?.logo_footer_url;

  if (logoUrl) {
    return (
      <img 
        src={logoUrl} 
        alt="Logo" 
        style={{ width: size, height: 'auto' }} 
        className={className}
      />
    );
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="gold-metallic" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#BF953F" />
          <stop offset="25%" stopColor="#FCF6BA" />
          <stop offset="50%" stopColor="#B38728" />
          <stop offset="75%" stopColor="#FBF5B7" />
          <stop offset="100%" stopColor="#AA771C" />
        </linearGradient>
        
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>

        <linearGradient id="bg-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1A1A1A" />
          <stop offset="100%" stopColor="#000000" />
        </linearGradient>
      </defs>

      {/* Main Circle Background */}
      <circle cx="50" cy="50" r="45" fill="url(#bg-grad)" stroke="url(#gold-metallic)" strokeWidth="1" />
      
      {/* Outer Decorative Ring */}
      <circle cx="50" cy="50" r="42" stroke="url(#gold-metallic)" strokeWidth="0.5" strokeDasharray="2 4" opacity="0.5" />

      {/* Golden Hexagon Container */}
      <path
        d="M50 20 L76 35 V65 L50 80 L24 65 V35 Z"
        fill="none"
        stroke="url(#gold-metallic)"
        strokeWidth="3"
        strokeLinejoin="round"
        filter="url(#glow)"
      />

      {/* Letter G (Modernized) */}
      <path
        d="M45 40 Q40 40 40 50 Q40 60 45 60 Q50 60 50 55 H45 V52 H55 V55 Q55 65 45 65 Q35 65 35 50 Q35 35 45 35 Q50 35 55 40 L52 43 Q49 40 45 40 Z"
        fill="url(#gold-metallic)"
      />

      {/* Letter X (Integrated) */}
      <path
        d="M60 45 L70 55 M70 45 L60 55"
        stroke="url(#gold-metallic)"
        strokeWidth="4"
        strokeLinecap="round"
      />

      {/* Shine Effect */}
      <path
        d="M30 30 L70 70"
        stroke="white"
        strokeWidth="0.5"
        strokeLinecap="round"
        opacity="0.2"
      />
    </svg>
  );
}

export function LogoWithText({ className = '', size = 40, variant = 'header' }: LogoProps) {
  const { settings: platformSettings } = useSettings();
  const siteTitle = platformSettings?.site_title || 'GOLD X USDT';
  const siteTagline = platformSettings?.site_tagline || 'Elite Platforms';

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <Logo size={size} className="" variant={variant} />
      <div className="flex flex-col">
        <span className="font-black text-2xl tracking-tighter leading-none v56-gradient-text uppercase">{siteTitle}</span>
        <span className="text-[10px] uppercase font-bold tracking-[0.4em] text-muted-foreground opacity-60">{siteTagline}</span>
      </div>
    </div>
  );
}
