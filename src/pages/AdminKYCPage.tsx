import { CheckCircle, ExternalLink, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/db/supabase';
import type { Profile } from '@/types';

export default function AdminKYCPage() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .neq('kyc_status', 'not_submitted')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Failed to load KYC submissions:', error);
    }
  };

  const handleApprove = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        // @ts-ignore - Supabase type inference issue
        .update({ kyc_status: 'approved', kyc_rejection_reason: null })
        .eq('id', userId);

      if (error) throw error;
      toast.success('KYC approved successfully');
      loadUsers();
      setDialogOpen(false);
    } catch (error) {
      console.error('Failed to approve KYC:', error);
      toast.error('Failed to approve KYC');
    }
  };

  const handleReject = async (userId: string) => {
    if (!rejectionReason) {
      toast.error('Please provide a rejection reason');
      return;
    }

    try {
      const { error } = await supabase
        .from('profiles')
        // @ts-ignore - Supabase type inference issue
        .update({ kyc_status: 'rejected', kyc_rejection_reason: rejectionReason })
        .eq('id', userId);

      if (error) throw error;
      toast.success('KYC rejected');
      setRejectionReason('');
      loadUsers();
      setDialogOpen(false);
    } catch (error) {
      console.error('Failed to reject KYC:', error);
      toast.error('Failed to reject KYC');
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold v56-gradient-text">KYC Verification</h1>
        <p className="text-muted-foreground">Review and verify user documents</p>
      </div>

      <Card className="v56-glass premium-border">
        <CardHeader>
          <CardTitle>KYC Submissions</CardTitle>
          <CardDescription>Review user identity documents</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {users.map((user) => (
              <div
                key={user.id}
                className="p-4 border border-primary/10 rounded-lg bg-accent/30"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-semibold">{user.full_name || user.username || 'No name'}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Submitted: {new Date(user.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded ${
                    user.kyc_status === 'approved' ? 'bg-green-500/20 text-green-500' :
                    user.kyc_status === 'rejected' ? 'bg-destructive/20 text-destructive' :
                    'bg-yellow-500/20 text-yellow-500'
                  }`}>
                    {user.kyc_status.toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-3">
                  {(user as any).kyc_id_front && (
                    <a href={(user as any).kyc_id_front} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1">
                      <ExternalLink className="h-3 w-3" />
                      ID Front
                    </a>
                  )}
                  {(user as any).kyc_id_back && (
                    <a href={(user as any).kyc_id_back} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1">
                      <ExternalLink className="h-3 w-3" />
                      ID Back
                    </a>
                  )}
                  {(user as any).kyc_selfie && (
                    <a href={(user as any).kyc_selfie} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1">
                      <ExternalLink className="h-3 w-3" />
                      Selfie
                    </a>
                  )}
                </div>

                {user.kyc_status === 'pending' && (
                  <Dialog open={dialogOpen && selectedUser?.id === user.id} onOpenChange={(open) => {
                    setDialogOpen(open);
                    if (open) setSelectedUser(user);
                  }}>
                    <DialogTrigger asChild>
                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approve
                        </Button>
                        <Button size="sm" variant="destructive" className="flex-1">
                          <XCircle className="h-4 w-4 mr-2" />
                          Reject
                        </Button>
                      </div>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>KYC Verification</DialogTitle>
                        <DialogDescription>Approve or reject this KYC submission</DialogDescription>
                      </DialogHeader>
                      {selectedUser && (
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label>Rejection Reason (if rejecting)</Label>
                            <Textarea
                              value={rejectionReason}
                              onChange={(e) => setRejectionReason(e.target.value)}
                              placeholder="Enter reason for rejection..."
                              rows={3}
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button
                              className="flex-1"
                              onClick={() => handleApprove(selectedUser.id)}
                            >
                              Approve
                            </Button>
                            <Button
                              variant="destructive"
                              className="flex-1"
                              onClick={() => handleReject(selectedUser.id)}
                            >
                              Reject
                            </Button>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                )}

                {user.kyc_status === 'rejected' && user.kyc_rejection_reason && (
                  <div className="mt-2 p-2 bg-destructive/10 border border-destructive/20 rounded text-xs">
                    <strong>Rejection Reason:</strong> {user.kyc_rejection_reason}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
