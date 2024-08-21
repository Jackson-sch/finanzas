
  const loans = [
    {
      "borrower": "Juan Pérez",
      "amount": 5000.0,
      "interestRate": 5.5,
      "duration": 12,
      "date": "2024-01-15"
    },
    {
      "borrower": "María Gómez",
      "amount": 10000.0,
      "interestRate": 4.0,
      "duration": 24,
      "date": "2024-03-01"
    },
    {
      "borrower": "Carlos López",
      "amount": 7500.0,
      "interestRate": 6.0,
      "duration": 18,
      "date": "2024-05-20"
    },
    {
      "borrower": "Ana Martínez",
      "amount": 3000.0,
      "interestRate": 3.5,
      "duration": 6,
      "date": "2024-07-10"
    }
  ]
  const transactions = [
    {
      "type": "income",
      "description": "Salario",
      "amount": 1500.0,
      "date": "2024-08-01"
    },
    {
      "type": "income",
      "description": "Freelance",
      "amount": 800.0,
      "date": "2024-08-05"
    },
    {
      "type": "expense",
      "description": "Renta",
      "amount": 600.0,
      "date": "2024-08-02"
    },
    {
      "type": "expense",
      "description": "Supermercado",
      "amount": 200.0,
      "date": "2024-08-04"
    },
    {
      "type": "expense",
      "description": "Transporte",
      "amount": 50.0,
      "date": "2024-08-06"
    }
  ]
  const payments = [
    {
      "prestatario": "Juan Pérez",
      "montoInicial": 5000.00,
      "cantidadPago": 400.00,
      "fecha": "2024-02-15",
      "saldoRestante": 4600.00
    },
    {
      "prestatario": "María Gómez",
      "montoInicial": 10000.00,
      "cantidadPago": 450.00,
      "fecha": "2024-04-01",
      "saldoRestante": 9550.00
    },
    {
      "prestatario": "Carlos López",
      "montoInicial": 7500.00,
      "cantidadPago": 500.00,
      "fecha": "2024-06-20",
      "saldoRestante": 7000.00
    },
    {
      "prestatario": "Ana Martínez",
      "montoInicial": 3000.00,
      "cantidadPago": 300.00,
      "fecha": "2024-08-10",
      "saldoRestante": 2700.00
    }
  ]

  export {
    loans,
    transactions,
    payments
  }