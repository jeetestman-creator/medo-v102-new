import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutDashboard,
  Wallet,
  ArrowDownToLine,
  ArrowUpFromLine,
  Users,
  User,
  LifeBuoy,
  Settings,
  Shield,
  FileText,
  Calendar,
  Bell,
  Fingerprint,
  Ticket,
  Layout
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/Logo';

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const { profile } = useAuth();
  const location = useLocation();
  const isAdmin = profile?.role === 'admin';

  const userNavItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Wallet, label: 'Wallets', path: '/wallets' },
    { icon: ArrowDownToLine, label: 'Deposit', path: '/deposit' },
    { icon: ArrowUpFromLine, label: 'Withdrawal', path: '/withdrawal' },
    { icon: Users, label: 'Referrals', path: '/referrals' },
    { icon: User, label: 'Profile', path: '/profile' },
    { icon: FileText, label: 'Transactions', path: '/transactions' },
    { icon: LifeBuoy, label: 'Support', path: '/support' },
  ];

  const adminNavItems = [
    { icon: Shield, label: 'Admin Dashboard', path: '/admin' },
    { icon: Users, label: 'Users', path: '/admin/users' },
    { icon: ArrowDownToLine, label: 'Deposits', path: '/admin/deposits' },
    { icon: ArrowUpFromLine, label: 'Withdrawals', path: '/admin/withdrawals' },
    { icon: FileText, label: 'Transactions', path: '/admin/transactions' },
    { icon: Bell, label: 'Notifications', path: '/admin/notifications' },
    { icon: Fingerprint, label: 'KYC Verification', path: '/admin/kyc' },
    { icon: LifeBuoy, label: 'Support Tickets', path: '/admin/tickets' },
    { icon: Layout, label: 'Landing Page', path: '/admin/landing' },
    { icon: Ticket, label: 'Coupons', path: '/admin/coupons' },
    { icon: Calendar, label: 'Content Management', path: '/admin/content' },
    { icon: Settings, label: 'Platform Settings', path: '/admin/settings' },
  ];

  const navItems = isAdmin ? adminNavItems : userNavItems;

  return (
    <aside className={cn('w-72 bg-sidebar border-r border-sidebar-border relative overflow-hidden', className)}>
      {/* Background visual element */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-5 bg-[radial-gradient(circle_at_0%_0%,hsl(var(--primary))_0%,transparent_50%)]" />
      
      <div className="flex flex-col h-full relative z-10">
        <div className="p-8 border-b border-sidebar-border flex items-center justify-center">
          <Link to="/" className="flex flex-col items-center gap-3 group">
            <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20 group-hover:scale-110 transition-transform duration-500 ">
              <Logo size={44} />
            </div>
            <div className="text-center">
              <span className="font-black text-2xl tracking-tighter v56-gradient-text block">GOLD X USDT</span>
              <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-muted-foreground opacity-60">Elite Investing</span>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-6 space-y-2 overflow-y-auto scrollbar-hide">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 relative group',
                  isActive
                    ? 'bg-primary/10 text-primary border border-primary/20 '
                    : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
                )}
              >
                {isActive && (
                  <div className="absolute left-[-1.5rem] w-2 h-8 bg-primary rounded-r-full " />
                )}
                <Icon className={cn('w-5 h-5 transition-transform group-hover:scale-110', isActive && 'text-primary')} />
                <span className="text-sm font-bold uppercase tracking-widest">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-sidebar-border">
          <div className="v56-glass p-4 rounded-2xl border border-white/5 bg-white/5 text-center">
            <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground mb-1">Status</p>
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-bold">Secure Connection</span>
            </div>
          </div>
          <div className="mt-4 text-[10px] text-muted-foreground text-center font-bold tracking-widest opacity-50">
            © 2026 GOLD X USDT PLATFORM
          </div>
        </div>
      </div>
    </aside>
  );
}
