const mongoose = require('mongoose');


const productSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true
  },
  descricao: {
    type: String,
    required: true
  },
  preco: {
    type: Number,
    required: true
  },
  estoque: {
    type: Number,
    required: true
  },
  categoria: {
    type: String,
    required: true
  },
  dataDeCriacao: {
    type: Date,
    default: Date.now
  }
});


const Product = mongoose.model('Product', productSchema);

module.exports = Product;
