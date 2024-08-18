function LoanList({ loans }) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-bold mb-4">Loan History</h2>
        <ul>
          {loans.map((loan, index) => (
            <li key={index} className="mb-2 flex justify-between items-center">
              <span>{loan.borrower} - ${loan.amount}</span>
              <span className={loan.amount < 0 ? 'text-red-500' : 'text-green-500'}>
                {loan.interestRate}% over {loan.duration} months
              </span>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  
  export default LoanList;
  