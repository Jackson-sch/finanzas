import { Schema, model, models } from 'mongoose';

const LoanSchema = new Schema({
  borrower: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  interestRate: {
    type: Number,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    required: true
  }
});

export default models?.Loan || model('Loan', LoanSchema);


