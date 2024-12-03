const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Product = require('./models/Product'); // Certifique-se de que o modelo Product está correto

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json()); // Para poder receber JSON no corpo das requisições

// Variáveis de ambiente (Recomenda-se usar um arquivo .env)
const DB_URI = process.env.DB_URI || 'mongodb+srv://augustopietro482:88323571@cluster0.991nw.mongodb.net/ecommerce?retryWrites=true&w=majority'; // Defina a URL do MongoDB aqui

// Conectar ao MongoDB
mongoose.connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Conectado ao MongoDB!');
    // Iniciar o servidor depois de se conectar com sucesso
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Erro ao conectar ao MongoDB:', err);
    process.exit(1); // Finaliza o processo caso a conexão falhe
  });
 



  app.get('/', (req, res) => res.status(200).json({ message: 'API rodando com sucesso!' }));



  // Rota para listar todos os produtos
app.get('/api/products', async (req, res) => {
    try {
      const products = await Product.find(); // Busca todos os produtos
      res.status(200).json(products); // Retorna os produtos no formato JSON
    } catch (err) {
      console.error('Erro ao buscar produtos:', err); // Log para depuração
      res.status(500).json({ error: 'Erro ao buscar produtos' });
    }
  });
  
// Rota para listar todos os produtos
app.post('/api/products', async (req, res) => {
    const produtos = req.body; // Agora esperamos um array de produtos
  
    // Validar se o corpo da requisição contém um array de produtos
    if (!Array.isArray(produtos)) {
      return res.status(400).json({ error: 'O corpo da requisição deve ser um array de produtos.' });
    }
  
    // Validar se cada produto tem todos os campos obrigatórios
    for (let produto of produtos) {
      const { nome, descricao, preco, estoque, categoria } = produto;
  
      if (!nome || !descricao || !preco || !estoque || !categoria) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios para cada produto' });
      }
    }
  
    try {
      // Criar e salvar os produtos
      const newProducts = await Product.insertMany(produtos);
      res.status(201).json(newProducts); // Retorna os produtos criados
    } catch (err) {
      console.error('Erro ao salvar os produtos:', err); // Para depuração
      res.status(500).json({ error: 'Erro ao criar produtos' });
    }
  });
  
// Rota para atualizar um produto
app.put('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, descricao, preco, estoque, categoria } = req.body;

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { nome, descricao, preco, estoque, categoria },
      { new: true }
    );
    
    if (!updatedProduct) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }
    
    res.json(updatedProduct);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar produto' });
  }
});

// Rota para excluir um produto
app.delete('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const deletedProduct = await Product.findByIdAndDelete(id);
    
    if (!deletedProduct) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    res.json({ message: 'Produto excluído com sucesso' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao excluir produto' });
  }
});
