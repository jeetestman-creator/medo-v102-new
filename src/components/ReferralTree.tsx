import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, TrendingDown } from 'lucide-react';
import { supabase } from '@/db/supabase';

interface ReferralNode {
  id: string;
  email: string;
  full_name: string;
  level: number;
  total_deposits: number;
  created_at: string;
  children: ReferralNode[];
}

interface ReferralTreeProps {
  userId: string;
  maxLevels?: number;
}

export function ReferralTree({ userId, maxLevels = 4 }: ReferralTreeProps) {
  const [tree, setTree] = useState<ReferralNode | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalReferrals: 0,
    level1: 0,
    level2: 0,
    level3: 0,
    level4: 0,
    level5: 0
  });

  useEffect(() => {
    loadReferralTree();
  }, [userId]);

  const loadReferralTree = async () => {
    setLoading(true);
    try {
      const rootNode = await buildTree(userId, 1);
      setTree(rootNode);
      calculateStats(rootNode);
    } catch (error) {
      console.error('Failed to load referral tree:', error);
    } finally {
      setLoading(false);
    }
  };

  const buildTree = async (id: string, level: number): Promise<ReferralNode | null> => {
    if (level > maxLevels) return null;

    // Get user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('id, email, full_name, referral_code, created_at')
      .eq('id', id)
      .maybeSingle();

    if (!profile) return null;

    // Get total deposits for this user
    const { data: deposits } = await supabase
      .from('deposits')
      .select('amount')
      .eq('user_id', id)
      .eq('status', 'approved');

    const totalDeposits = (deposits as any[])?.reduce((sum, d) => sum + (d.amount || 0), 0) || 0;

    // Get direct referrals
    const { data: referrals } = await supabase
      .from('profiles')
      .select('id')
      .eq('referrer_id', id);

    const children: ReferralNode[] = [];
    if (referrals && level < maxLevels) {
      for (const ref of referrals) {
        const child = await buildTree((ref as any).id, level + 1);
        if (child) children.push(child);
      }
    }

    return {
      id: (profile as any).id,
      email: (profile as any).email || '',
      full_name: (profile as any).full_name || 'Unknown',
      level,
      total_deposits: totalDeposits,
      created_at: (profile as any).created_at || '',
      children
    };
  };

  const calculateStats = (node: ReferralNode | null) => {
    if (!node) return;

    const counts = { totalReferrals: 0, level1: 0, level2: 0, level3: 0, level4: 0, level5: 0 };

    const traverse = (n: ReferralNode) => {
      if (n.level > 1) {
        counts.totalReferrals++;
        if (n.level === 2) counts.level1++;
        else if (n.level === 3) counts.level2++;
        else if (n.level === 4) counts.level3++;
        else if (n.level === 5) counts.level4++;
        else counts.level5++; // Combined 5-15 for the summary stats
      }
      n.children.forEach(traverse);
    };

    traverse(node);
    setStats(counts);
  };

  const renderNode = (node: ReferralNode) => {
    const levelColors = [
      'border-primary bg-primary/5',
      'border-blue-500 bg-blue-500/5',
      'border-green-500 bg-green-500/5',
      'border-yellow-500 bg-yellow-500/5',
      'border-purple-500 bg-purple-500/5'
    ];

    return (
      <div key={node.id} className="space-y-3">
        <Card className={`${levelColors[node.level - 1]} border-2`}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1 flex-1">
                <p className="font-semibold text-sm">{node.full_name}</p>
                <p className="text-xs text-muted-foreground">{node.email}</p>
                <p className="text-xs text-muted-foreground">
                  Joined: {new Date(node.created_at).toLocaleDateString()}
                </p>
                <p className="text-xs font-medium text-primary">
                  Total Deposits: ${node.total_deposits.toFixed(2)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs font-medium">Level {node.level - 1}</p>
                {node.children.length > 0 && (
                  <p className="text-xs text-muted-foreground">
                    {node.children.length} referral{node.children.length > 1 ? 's' : ''}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {node.children.length > 0 && (
          <div className="ml-6 pl-4 border-l-2 border-border space-y-3">
            {node.children.map(renderNode)}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <Card className="v56-glass">
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">Loading referral tree...</p>
        </CardContent>
      </Card>
    );
  }

  if (!tree) {
    return (
      <Card className="v56-glass">
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">No referral data found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="v56-glass">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Total</p>
                <p className="text-lg font-bold">{stats.totalReferrals}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="v56-glass">
          <CardContent className="p-4">
            <div>
              <p className="text-xs text-muted-foreground">Level 1</p>
              <p className="text-lg font-bold text-blue-500">{stats.level1}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="v56-glass">
          <CardContent className="p-4">
            <div>
              <p className="text-xs text-muted-foreground">Level 2</p>
              <p className="text-lg font-bold text-green-500">{stats.level2}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="v56-glass">
          <CardContent className="p-4">
            <div>
              <p className="text-xs text-muted-foreground">Level 3</p>
              <p className="text-lg font-bold text-yellow-500">{stats.level3}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="v56-glass">
          <CardContent className="p-4">
            <div>
              <p className="text-xs text-muted-foreground">Levels 5-15</p>
              <p className="text-lg font-bold text-purple-500">{(stats as any).level5 || 0}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tree Visualization */}
      <Card className="v56-glass premium-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingDown className="h-5 w-5 text-primary" />
            Referral Network
          </CardTitle>
        </CardHeader>
        <CardContent className="max-h-[600px] overflow-y-auto">
          {tree.children.length > 0 ? (
            <div className="space-y-3">
              {tree.children.map(renderNode)}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              No referrals yet
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
