import * as XLSX from 'xlsx';

interface ExportData {
  [key: string]: string | number | boolean | null;
}

export const exportToExcel = (data: ExportData[], filename: string) => {
  // Create a new workbook
  const wb = XLSX.utils.book_new();
  
  // Convert data to worksheet
  const ws = XLSX.utils.json_to_sheet(data);
  
  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(wb, ws, 'Data');
  
  // Generate Excel file and trigger download
  XLSX.writeFile(wb, `${filename}_${new Date().toISOString().split('T')[0]}.xlsx`);
};

export const exportUsersToExcel = (users: any[]) => {
  const exportData = users.map(user => {
    const createdAt = new Date(user.created_at);
    const month = createdAt.toLocaleString('default', { month: 'long', year: 'numeric' });
    
    return {
      'User ID': user.id,
      'Email': user.email,
      'Full Name': user.full_name || 'N/A',
      'Username': user.username || 'N/A',
      'Phone Number': user.phone || 'N/A',
      'Country': user.country || 'N/A',
      'State': user.state || 'N/A',
      'City': user.city || 'N/A',
      'Postal Code': user.postal_code || 'N/A',
      'Role': user.role,
      'KYC Status': user.kyc_status,
      'Referred By': user.referred_by || 'N/A',
      'Referral Code': user.referral_code || 'N/A',
      'Performance USDT': user.performance_usdt || 0,
      'Auto Withdrawal Enabled': user.auto_withdrawal_enabled ? 'Yes' : 'No',
      'Withdrawal Wallet Address': user.withdrawal_wallet_address || 'N/A',
      'Next Auto Withdrawal Date': user.next_auto_withdrawal_date ? new Date(user.next_auto_withdrawal_date).toLocaleDateString() : 'N/A',
      'Deposit Balance': user.deposit || 0,
      'ROI Balance': user.roi || 0,
      'Bonus Balance': user.bonus || 0,
      'Withdrawal Balance': user.withdrawal || 0,
      'Total Fees Paid': user.total_fees_paid || 0,
      'Monthly ROI %': user.monthly_roi_percentage || 10,
      'Month Joined': month,
      'Created At': createdAt.toLocaleString(),
      'Last Login': user.last_login_at ? new Date(user.last_login_at).toLocaleString() : 'Never',
      'Level 5-15 Status': [5,6,7,8,9,10,11,12,13,14,15].map(l => `L${l}:${user[`referral_level_${l}_enabled`] ? 'Yes' : 'No'}`).join(', '),
      ...([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15].reduce((acc, level) => {
        const stats = (user.referral_stats || []).find((s: any) => s.level === level);
        return {
          ...acc,
          [`Level ${level} Users`]: stats ? stats.user_count : 0,
          [`Level ${level} Total Deposit`]: stats ? stats.total_deposit_balance : 0
        };
      }, {}))
    };
  });
  
  exportToExcel(exportData, 'all_users');
};

export const exportTransactionsToExcel = (transactions: any[]) => {
  const exportData = transactions.map(tx => {
    const createdAt = new Date(tx.created_at);
    const month = createdAt.toLocaleString('default', { month: 'long', year: 'numeric' });

    return {
      'Date': createdAt.toLocaleString(),
      'Month': month,
      'User ID': tx.user_id,
      'Email': tx.profiles?.email || 'N/A',
      'Type': tx.transaction_type,
      'Amount': tx.amount,
      'Fee': tx.fee || 0,
      'Net Amount': tx.net_amount || 0,
      'Status': tx.status,
      'Network': tx.network || 'N/A',
      'Wallet Address': tx.wallet_address || 'N/A',
      'Transaction Hash': tx.transaction_hash || 'N/A',
      'Admin Notes': tx.admin_notes || 'N/A'
    };
  });

  exportToExcel(exportData, 'transactions');
};

export const exportUserDataToExcel = (userData: any) => {
  const sheets: { [key: string]: ExportData[] } = {};
  
  // Profile sheet
  sheets['Profile'] = [{
    'Email': userData.email,
    'Full Name': userData.full_name || 'N/A',
    'Username': userData.username || 'N/A',
    'Phone': userData.phone_number || 'N/A',
    'KYC Status': userData.kyc_status,
    'Referral Code': userData.referral_code || 'N/A',
    'Member Since': new Date(userData.created_at).toLocaleDateString()
  }];
  
  // Balances sheet
  sheets['Balances'] = [{
    'Deposit Balance': userData.deposit_balance || 0,
    'ROI Balance': userData.roi_balance || 0,
    'Bonus Balance': userData.bonus_balance || 0,
    'Withdrawal Balance': userData.withdrawal_balance || 0,
    'Total Deposits': userData.total_deposits || 0,
    'Total Withdrawals': userData.total_withdrawals || 0
  }];
  
  // Transactions sheet
  if (userData.transactions && userData.transactions.length > 0) {
    sheets['Transactions'] = userData.transactions.map((tx: any) => ({
      'Date': new Date(tx.created_at).toLocaleString(),
      'Type': tx.transaction_type,
      'Amount': tx.amount,
      'Status': tx.status,
      'Description': tx.description || 'N/A'
    }));
  }
  
  // Referrals sheet
  if (userData.referrals && userData.referrals.length > 0) {
    sheets['Referrals'] = userData.referrals.map((ref: any) => ({
      'Email': ref.email,
      'Username': ref.username || 'N/A',
      'Joined Date': new Date(ref.created_at).toLocaleDateString(),
      'Total Deposits': ref.total_deposits || 0
    }));
  }
  
  // Create workbook
  const wb = XLSX.utils.book_new();
  
  // Add all sheets
  Object.entries(sheets).forEach(([sheetName, sheetData]) => {
    const ws = XLSX.utils.json_to_sheet(sheetData);
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
  });
  
  // Download
  XLSX.writeFile(wb, `my_data_${new Date().toISOString().split('T')[0]}.xlsx`);
};
