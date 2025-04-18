import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    food: { type: Object, required: true },
    quantity: { type: Number, required: true }
  }],
  name: { type: String, required: true },
  address: { type: String, required: true },
  paymentId: String,
  statusHistory: [{
    status: { 
      type: String, 
      enum: ['NEW', 'PAYMENT_PENDING', 'PAID', 'PREPARING', 'READY', 'DELIVERED', 'CANCELLED'],
      default: 'NEW'
    },
    timestamp: { type: Date, default: Date.now }
  }],
  addressLatLng: {
    lat: Number,
    lng: Number
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: function(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

orderSchema.virtual('status').get(function() {
  return this.statusHistory.slice(-1)[0]?.status || 'NEW';
});

orderSchema.statics.findByUser = function(userId) {
  return this.find({ user: userId }).sort('-createdAt');
};

orderSchema.statics.updateStatus = async function(orderId, newStatus) {
  return this.findByIdAndUpdate(
    orderId,
    { $push: { statusHistory: { status: newStatus } } },
    { new: true }
  );
};

export default mongoose.model('Order', orderSchema);