const express = require("express");
const router = express.Router();
const spf = require("stock-price-fetcher")

router.get("/api/stock", async (req, res) => {
    const ticker = req.query.ticker
    console.log(ticker)
    try {
        const data = await spf.data(ticker);
        res.json(data)
    } catch (e) {
        res.sendStatus(400)
    }
})

module.exports = router