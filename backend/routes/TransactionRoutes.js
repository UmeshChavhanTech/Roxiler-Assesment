const express = require('express');
const Transaction = require('../model/Transaction');
const axios = require('axios');
const moment = require('moment'); // Import moment.js for date handling


const router = express.Router();

// Fetch and initialize data
router.get('/init', async (req, res) => {
    try {
        const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
        await Transaction.insertMany(response.data);
        res.json({ message: 'Database initialized' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get transactions with search and pagination

router.get('/transactions', async (req, res) => {
    const { page = 1, perPage = 10, search = '', month } = req.query;
    const regex = new RegExp(search, 'i'); // Regex for text search
    const query = {};

    try {
        // Convert the month name to a numeric format (e.g., March -> 03)
        if (month) {
            const monthNumber = moment().month(month).format('MM');
            const startDate = new Date(`2021-${monthNumber}-01T00:00:00.000Z`);
            const endDate = new Date(`2021-${monthNumber}-31T23:59:59.999Z`);

            query.dateOfSale = { $gte: startDate, $lt: endDate };
        }

        query.$or = [
            { title: regex },
            { description: regex }
        ];

        // If the search term is a valid number, also filter by price
        if (!isNaN(search) && search.trim() !== '') {
            query.$or.push({ price: parseFloat(search) });
        }
         
        // Get total count before pagination
        const total = await Transaction.countDocuments(query);

        const transactions = await Transaction.find(query)
            .skip((page - 1) * perPage)
            .limit(parseInt(perPage));

        res.json({transactions,total});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// API to get the statistics for a selected month


router.get('/statistics', async (req, res) => {
    const { page = 1, perPage = 10, search = '', month } = req.query;
    const regex = new RegExp(search, 'i');
    const query = {};

    try {
        // Apply month filter if provided
        if (month) {
            const monthNumber = moment().month(month).format('MM');
            const startDate = new Date(`2021-${monthNumber}-01T00:00:00.000Z`);
            const endDate = new Date(`2021-${monthNumber}-31T23:59:59.999Z`);

            query.dateOfSale = { $gte: startDate, $lt: endDate };
        }

        // Fetch statistics with pagination and month filtering
        const totalItems = await Transaction.countDocuments(query);
        const totalSales = await Transaction.aggregate([
            { $match: query },
            { $match: { sold: true } },
            { $group: { _id: null, totalAmount: { $sum: '$price' }, soldItems: { $sum: 1 } } }
        ]);

        const soldItems = totalSales[0]?.soldItems || 0;
        const notSoldItems = totalItems - soldItems;

        res.json({
            totalItems,
            soldItems,
            notSoldItems,
            totalSales: totalSales[0]?.totalAmount || 0
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// api for price ranged product

router.get('/bar-chart', async (req, res) => {
  const { month } = req.query;
  let matchCondition = {}; // Default: No filter (fetch all data)

  try {
      // If a month is specified, filter by month (ignoring year)
      if (month) {
          const monthNumber = moment().month(month).format('MM');
          const startDate = new Date(`2021-${monthNumber}-01T00:00:00.000Z`);
          const endDate = new Date(`2021-${monthNumber}-31T23:59:59.999Z`);
          matchCondition.dateOfSale = { $gte: startDate, $lt: endDate };
      }

      // Aggregate query to group by price range
      const priceRanges = [
          { range: "0 - 100", min: 0, max: 100 },
          { range: "101 - 200", min: 101, max: 200 },
          { range: "201 - 300", min: 201, max: 300 },
          { range: "301 - 400", min: 301, max: 400 },
          { range: "401 - 500", min: 401, max: 500 },
          { range: "501 - 600", min: 501, max: 600 },
          { range: "601 - 700", min: 601, max: 700 },
          { range: "701 - 800", min: 701, max: 800 },
          { range: "801 - 900", min: 801, max: 900 },
          { range: "901+", min: 901, max: Infinity }
      ];

      // Map price ranges to MongoDB queries
      const rangeQueries = await Promise.all(
          priceRanges.map(async ({ range, min, max }) => {
              const count = await Transaction.countDocuments({
                  ...matchCondition,
                  price: { $gte: min, $lt: max }
              });

              return { range, itemCount: count };
          })
      );

      res.json(rangeQueries);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});


// Api for category wise pie chart 

router.get('/pie-chart', async (req, res) => {
  const { month } = req.query;
  let matchCondition = {}; // Default: No filter (fetch all data)

  try {
      // If a month is specified, filter by month (ignoring year)
      if (month) {
          const monthNumber = moment().month(month).format('MM');
          const startDate = new Date(`2021-${monthNumber}-01T00:00:00.000Z`);
          const endDate = new Date(`2021-${monthNumber}-31T23:59:59.999Z`);
          matchCondition.dateOfSale = { $gte: startDate, $lt: endDate };
      }

      // Aggregate query to group by category and count items
      const categoryData = await Transaction.aggregate([
          { $match: matchCondition }, // Apply filter only if month is provided
          {
              $group: {
                  _id: "$category",
                  itemCount: { $sum: 1 }
              }
          },
          {
              $project: {
                  _id: 0,
                  category: "$_id",
                  itemCount: 1
              }
          }
      ]);

      res.json(categoryData);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

// Api for combined all response 
router.get('/combined-data', async (req, res) => {
  const { month } = req.query;
  
  try {
      // Define API endpoints
      const transactionsApi = `http://localhost:5000/api/transactions${month ? `?month=${month}` : ''}`;
      const pieChartApi = `http://localhost:5000/api/pie-chart${month ? `?month=${month}` : ''}`;
      const barChartApi = `http://localhost:5000/api/bar-chart${month ? `?month=${month}` : ''}`;

      // Fetch data from all APIs simultaneously
      const [transactions, pieChartData, barChartData] = await Promise.all([
          axios.get(transactionsApi),
          axios.get(pieChartApi),
          axios.get(barChartApi)
      ]);

      // Combine the data into one JSON response
      res.json({
          transactions: transactions.data,
          categoryWiseData: pieChartData.data,
          priceRangeData: barChartData.data
      });

  } catch (error) {
      res.status(500).json({ error: "Failed to fetch combined data", details: error.message });
  }
});




module.exports = router;
