'use client'
import TransactionForm from '@/components/(dashboard)/Transaction/TransactionForm'
import TransactionList from '@/components/(dashboard)/Transaction/TransactionList'
import TransactionV2 from '@/components/(dashboard)/Transaction/TransactionV2';
import React, { useState } from 'react'

export default function page() {
    const [transactions, setTransactions] = useState([]);

    const addTransaction = (transaction) => {
      setTransactions([...transactions, transaction]);
    };
  
    return (
      <div className="min-h-screen container p-6">
        <div className="mx-auto">
          {/* <TransactionForm addTransaction={addTransaction} />
          <TransactionList transactions={transactions} /> */}
          <TransactionV2 />
        </div>
      </div>
    );
}
