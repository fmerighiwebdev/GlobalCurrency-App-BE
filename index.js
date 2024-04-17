import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

const BASE_URL_COINMARKET = "https://pro-api.coinmarketcap.com";
const BASE_URL_CURRENCYBEACON = "https://api.currencybeacon.com/v1";
const BASE_URL_SWAPZONE = "https://api.swapzone.io/v1/exchange";

app.use(cors());

app.get("/api/get-crypto-rates", async (req, res) => {
  try {
    const result = await axios.get(
      `${BASE_URL_COINMARKET}/v1/cryptocurrency/listings/latest`,
      {
        headers: {
          "X-CMC_PRO_API_KEY": process.env.COINMARKETCAP_API_KEY,
        },
        params: {
          limit: 10,
        },
      }
    );
    const cryptoRates = result.data;
    res.status(200).json(cryptoRates);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Errore nella richiesta endpoint API /get-crypto-rates",
    });
  }
});

app.get("/api/get-fiat-currencies", async (req, res) => {
  const { type } = req.query;

  try {
    const result = await axios.get(`${BASE_URL_CURRENCYBEACON}/currencies`, {
      params: {
        api_key: process.env.CURRENCYBEACON_API_KEY,
        type: type,
      },
    });
    const fiatCurrencies = result.data;
    res.status(200).json(fiatCurrencies);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Errore nella richiesta endpoint API /get-fiat-currencies",
    });
  }
});

app.get("/api/get-crypto-currencies", async (req, res) => {
  try {
    const result = await axios.get(`${BASE_URL_SWAPZONE}/currencies`, {
      headers: {
        "x-api-key": process.env.SWAPZONE_API_KEY,
      },
    });
    const cryptoCurrencies = result.data;
    res.status(200).json(cryptoCurrencies);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Errore nella richiesta endpoint API /get-crypto-currencies",
    });
  }
});

app.get("/api/validate-address", async (req, res) => {
  const { currency, address } = req.query;

  try {
    const result = await axios.get(`${BASE_URL_SWAPZONE}/validate/address`, {
      headers: {
        "x-api-key": process.env.SWAPZONE_API_KEY,
      },
      params: {
        currency: currency,
        address: address,
      },
    });
    const isValid = result.data;
    res.status(200).json(isValid);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Errore nella richiesta endpoint API /validate-address",
    });
  }
});

app.get("/api/convert-crypto", async (req, res) => {
  const { from, to, amount } = req.query;

  try {
    const result = await axios.get(`${BASE_URL_SWAPZONE}/get-rate`, {
      headers: {
        "x-api-key": process.env.SWAPZONE_API_KEY,
      },
      params: {
        from: from,
        to: to,
        amount: amount,
        rateType: "all"
      },
    });
    const conversion = result.data;
    res.status(200).json(conversion);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Errore nella richiesta endpoint API /convert-crypto",
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
