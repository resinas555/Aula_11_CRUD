
// server.js - Coworking Space & Salas
require('dotenv').config();
const express = require('express');
const supabase = require('./config/supabaseClient');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// 1. GET Global: Listar todas as salas
app.get('/salas', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('salas_reuniao')
      .select('*')
      .order('capacidade', { ascending: false });

    if (error) {
      return res.status(500).json({
        erro: 'Erro no banco de dados',
        detalhe: error.message
      });
    }

    return res.status(200).json(data);
  } catch (err) {
  console.error('ERRO REAL:', err);

  return res.status(500).json({
    erro: 'Falha interna no servidor',
    detalhe: err.message
  });
}
});

// 2. GET por ID: Buscar uma sala específica
app.get('/salas/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('salas_reuniao')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return res.status(404).json({
        erro: 'Sala não foi encontrada'
      });
    }

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({
      erro: 'Falha na busca da sala'
    });
  }
});

// Inicialização do servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Endpoints disponíveis: http://localhost:${PORT}/salas`);
});
