import {Schema, model, models } from 'mongoose'

const PaymentSchema = new Schema({
    prestatario: {
      type: String,
      required: true
    },
    cantidadPago: {
      type: Number,
      required: true
    },
    fecha: {
      type: Date,
      required: true
    },
    saldoRestante: {
      type: Number,
      required: true
    },
    loan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Loan',
      required: true
    }
  });
  
  export default models?.Payment || model('Payment', PaymentSchema);
  
  