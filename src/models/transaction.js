const mongoose = require("mongoose");

const taskSchemaNew = mongoose.Schema(
  {
    balance: {
      type: Number,
      required: true
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Transaction"
    }
  },
  {
    timestamps: true
  }
);

// taskSchemaNew.pre("save", async function(next) {
//   next();
// });

const Transaction = mongoose.model("Transaction", taskSchemaNew);

module.exports = Transaction;
