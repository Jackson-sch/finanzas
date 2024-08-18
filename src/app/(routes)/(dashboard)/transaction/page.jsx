'use client'
import TransactionForm from '@/components/(dashboard)/Transaction/TransactionForm'
import TransactionList from '@/components/(dashboard)/Transaction/TransactionList'
import React, { useState } from 'react'

export default function page() {
    const [transactions, setTransactions] = useState([]);

    const addTransaction = (transaction) => {
      setTransactions([...transactions, transaction]);
    };
  
    return (
      <div className="min-h-screen container p-6">
        <div className="mx-auto">
          <TransactionForm addTransaction={addTransaction} />
          <TransactionList transactions={transactions} />
        </div>
      </div>
    );
}
