// Importa o módulo 'express' para criação do servidor web.
const express = require('express');

// Importa o módulo 'axios' para fazer requisições HTTP.
const axios = require('axios');

// Importa o módulo 'path' para lidar com caminhos de arquivos.
const path = require('path');

// Importa o módulo 'cors' para lidar com a política de mesma origem (CORS).
const cors = require('cors');

// Importa o arquivo de configuração que contém a chave da API.
const config = require('./config.json');

// Obtém a chave da API do arquivo de configuração.
const apikey = config.apikey;

// Cria uma instância do servidor Express.
const app = express();

// Define que o servidor irá escutar na porta 3000.
app.listen(3000);

// Usa o middleware 'cors' para permitir solicitações de outros domínios.
app.use(cors());

// Usa o middleware 'express.json()' para analisar o corpo das solicitações como JSON.
app.use(express.json());

// Define a pasta 'public' como estática para servir arquivos estáticos.
app.use(express.static(path.join(__dirname, 'public')));

// Tradução dos tipos de clima.
const traducaoClima = {
    "few clouds": "Poucas Nuvens",
    "scattered clouds": "Nuvens Dispersas",
    "overcast clouds": "Nublado",
    "broken clouds": "Nuvens Dispersas",
    "shower clouds": "Nuvens Cheias",
    "clear sky": "Céu Limpo",
    "light rain": "Chuva Leve",
    "light intensity drizzle": "Chuvisco Intenso",
    "moderate rain": "Chuva Moderada",
    "shower rain": "Chuva Rápida",
    "mist": "Névoa",
    "thunderstorm": "Tempestade",
    "snow": "Neve",
    "light intensity shower rain": "Chuva Rápida de Intensidade Leve"
}

// Rota para obter dados meteorológicos de uma cidade.
app.get('/climatempo/:cidade', async (req, res) => {
    // Obtém o nome da cidade da URL.
    const city = req.params.cidade;

    try {
        // Faz uma requisição à API de previsão do tempo.
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}&units=metric`);
        
        // Se a resposta for bem-sucedida (código 200).
        if (response.status === 200) {
            // Traduz o tipo de clima para o idioma desejado, se estiver presente na lista de traduções.
            const clima = traducaoClima[response.data.weather[0].description] || response.data.weather[0].description;

            // Objeto com os dados meteorológicos.
            const weatherData = {
                Temperatura: response.data.main.temp,
                Umidade: response.data.main.humidity,
                VelocidadeDoVento: response.data.wind.speed,
                Clima: clima
            };

            // Envia os dados meteorológicos como resposta.
            res.send(weatherData);
        } else {
            // Se a resposta não for bem-sucedida, envia uma mensagem de erro com o código de status.
            res.status(response.status).send({ erro: 'Erro ao obter dados meteorológicos' });
        }
    } catch (error) {
        // Se ocorrer um erro durante a requisição, envia uma mensagem de erro com status 500.
        res.status(500).send({ erro: 'Erro ao obter dados meteorológicos', error });
    }
});
