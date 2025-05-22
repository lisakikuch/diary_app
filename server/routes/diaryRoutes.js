const express = require('express');
const router = express.Router();

// Import the controller functions
const {
    getAllEntries,
    getEntryById,
    addEntry,
    updateEntry,
    deleteEntry
} = require('../controllers/diaryController')

router.get('/', getAllEntries);     // GET /entries
router.get('/:id', getEntryById);   // GET /entries/:id
router.post('/', addEntry);         // POST /entries
router.put('/:id', updateEntry);    // PUT /entries/:id
router.delete('/:id', deleteEntry); // DELETE /entries/:id

module.exports = router;