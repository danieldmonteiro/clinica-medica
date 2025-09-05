import axios from 'axios';
import removeAccents from 'remove-accents';

export const obterPrevisaoClima = async (cep: string, data: Date): Promise<string> => {
  try {
    const apiKey = process.env.OPENWEATHER_KEY;
    if (!apiKey) throw new Error('Chave de API do clima não configurada');

    // Obter latitude e longitude pelo CEP usando ViaCEP
    const viaCepResponse = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
    const { localidade, uf } = viaCepResponse.data;

    if (!localidade) throw new Error('Cidade não encontrada para o CEP informado');

    // Remover acentos da cidade
    const city = removeAccents(localidade);

    // Construir localização no formato "Cidade,BR"
    const location = `${city},BR`;

    // Converter para string de localização (cidade, estado)
    // const location = `${localidade},${uf}`;

    // Obter previsão do clima da OpenWeatherMap (5 dias / 3h)
    
    const weatherResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}&units=metric&lang=pt`
    );

    // Filtrar a previsão para o dia da consulta
    const forecastList = weatherResponse.data.list;
    const forecastForDate = forecastList.find((f: any) => {
      const forecastDate = new Date(f.dt_txt);
      return forecastDate.toDateString() === data.toDateString();
    });

    if (!forecastForDate) return 'Previsão não disponível para o dia';

    const description = forecastForDate.weather[0].description;
    const temp = forecastForDate.main.temp;

    return `${description}, ${temp}°C`;

  } catch (err) {
    console.error('Erro ao buscar previsão do clima:', err);
    return 'Indisponível';
  }
};

// import axios from 'axios';

// export const obterPrevisaoClima = async (cidade: string, dataConsulta: Date) => {
//     const apiKey = process.env.OPENWEATHER_KEY;
//     const { data } = await axios.get(`https://api.openweathermap.org/data/2.5/
//   weather?q=${cidade}&appid=${apiKey}&lang=pt_br&units=metric`);
//     return data.weather[0].description;
// };