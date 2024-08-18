function TransactionList({ transactions }) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-bold mb-4">Transaction History</h2>
        <ul>
          {transactions.map((transaction, index) => (
            <li key={index} className="mb-2 flex justify-between items-center">
              <span>{transaction.description} - {transaction.category}</span>
              <span className={transaction.amount < 0 ? 'text-red-500' : 'text-green-500'}>
                ${transaction.amount}
              </span>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  
  export default TransactionList;
  