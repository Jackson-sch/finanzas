import { useState } from 'react';

function LoanPaymentForm({ loans, addPayment }) {
  const [loanIndex, setLoanIndex] = useState(0);
  const [payment, setPayment] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    addPayment(loanIndex, parseFloat(payment));
    setPayment('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-bold mb-4">Make Payment</h2>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="loan">
          Select Loan
        </label>
        <select
          id="loan"
          value={loanIndex}
          onChange={(e) => setLoanIndex(e.target.value)}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
        >
          {loans.map((loan, index) => (
            <option key={index} value={index}>
              {loan.borrower} - ${loan.amount}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="payment">
          Payment Amount
        </label>
        <input
          type="number"
          id="payment"
          value={payment}
          onChange={(e) => setPayment(e.target.value)}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
          required
        />
      </div>
      <button
        type="submit"
        className="w-full bg-green-500 text-white font-bold py-2 px-4 rounded-md hover:bg-green-600"
      >
        Make Payment
      </button>
    </form>
  );
}

export default LoanPaymentForm;
