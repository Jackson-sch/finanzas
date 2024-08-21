import {Schema, model, models} from 'mongoose';

const TransactionSchema = new Schema({
    type: {
      type: String,
      enum: ['income', 'expense'],
      required: true
    },
    description: {
      type: String,
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    date: {
      type: Date,
      required: true
    }
  });
  
  export default models?.Transaction || model('Transaction', TransactionSchema);