'use client'
import LoanList from '@/components/(dashboard)/Prestamos/Listar';
import LoanPaymentForm from '@/components/(dashboard)/Prestamos/Pagos';
import LoanForm from '@/components/(dashboard)/Prestamos/Registrar';
import { useState } from 'react';


function App() {
  const [transactions, setTransactions] = useState([]);
  const [loans, setLoans] = useState([]);

  const addLoan = (loan) => {
    setLoans([...loans, loan]);
  };

  const addPayment = (loanIndex, paymentAmount) => {
    const updatedLoans = loans.map((loan, index) => {
      if (index === loanIndex) {
        loan.amount -= paymentAmount;
      }
      return loan;
    });
    setLoans(updatedLoans);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-xl mx-auto">
        <LoanForm addLoan={addLoan} />
        <LoanList loans={loans} />
        <LoanPaymentForm loans={loans} addPayment={addPayment} />
        {/* Aquí puedes añadir más funcionalidades como gráficos y exportación */}
      </div>
    </div>
  );
}

export default App;
