const db = require('../config/db');

// GET /entries
const getAllEntries = (req, res) => {
    const { tags } = req.query;

    // If tags are provided → filter by those tags
    if (tags) {
        const tagList = tags.split(','); // ['Work', 'Goals', ...]
        const placeholders = tagList.map(() => '?').join(','); // "?, ?, ?"

        const query = `
        SELECT e.*, GROUP_CONCAT(t.name) AS tags
        FROM entries e
        JOIN entry_tags et ON e.id = et.entry_id
        JOIN tags t ON et.tag_id = t.id
        WHERE t.name IN (${placeholders})
        GROUP BY e.id
        ORDER BY e.created_at DESC;
      `;

        db.query(query, tagList, (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(results);
        });

    } else {
        // No tag filter → show ALL entries (even those without tags)
        const query = `
        SELECT e.*, GROUP_CONCAT(t.name) AS tags
        FROM entries e
        LEFT JOIN entry_tags et ON e.id = et.entry_id
        LEFT JOIN tags t ON et.tag_id = t.id
        GROUP BY e.id
        ORDER BY e.created_at DESC;
      `;

        db.query(query, (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(results);
        });
    }
};

// GET /entries/:id
const getEntryById = (req, res) => {
    const { id } = req.params;

    const query = `
      SELECT e.*, GROUP_CONCAT(t.name) AS tags
      FROM entries e
      LEFT JOIN entry_tags et ON e.id = et.entry_id
      LEFT JOIN tags t ON et.tag_id = t.id
      WHERE e.id = ?
      GROUP BY e.id
    `;

    db.query(query, [id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ message: "Entry Not Found" });
        res.json(results[0]);
    });
};


// POST /entries
const addEntry = async (req, res) => {
    const { title, content, mood, tags } = req.body;

    if (!title || !content || !mood || !Array.isArray(tags)) {
        return res.status(400).json({ message: "Missing or invalid fields" });
    }

    try {
        // Step 1: Insert the new entry (create_at is automatically added by DB)
        const [entryResult] = await db.promise().query(
            "INSERT INTO entries (title, content, mood) VALUES (?, ?, ?)",
            [title, content, mood]
        );
        const entryId = entryResult.insertId;

        // Step 2: Get tag IDs
        const tagPlaceholders = tags.map(() => "?").join(",");
        const [tagRows] = await db.promise().query(
            `SELECT id FROM tags WHERE name IN (${tagPlaceholders})`,
            tags
        );
        const tagIds = tagRows.map((row) => row.id);

        // Step 3: Insert into entry_tags
        const entryTagValues = tagIds.map((tagId) => [entryId, tagId]);
        if (entryTagValues.length > 0) {
            await db.promise().query(
                "INSERT INTO entry_tags (entry_id, tag_id) VALUES ?",
                [entryTagValues]
            );
        }

        // ✅ Step 4: Fetch full inserted entry including create_at and tags
        const [rows] = await db.promise().query(
            `SELECT e.*, GROUP_CONCAT(t.name) AS tags
         FROM entries e
         LEFT JOIN entry_tags et ON e.id = et.entry_id
         LEFT JOIN tags t ON et.tag_id = t.id
         WHERE e.id = ?
         GROUP BY e.id`,
            [entryId]
        );

        res.status(201).json(rows[0]);
    } catch (err) {
        console.error("Add Entry Error:", err);
        res.status(500).json({ error: err.message });
    }
};

// PUT /entries/:id
// PUT /entries/:id
const updateEntry = async (req, res) => {
    const { id } = req.params;
    const { title, content, mood, tags } = req.body;
  
    // Validate inputs
    if (!title || !content || !mood || !Array.isArray(tags)) {
      return res.status(400).json({ message: "Missing or invalid fields" });
    }
  
    try {
      // Step 1: Update the main entry
      const [updateResult] = await db.promise().query(
        "UPDATE entries SET title = ?, content = ?, mood = ? WHERE id = ?",
        [title, content, mood, id]
      );
  
      if (updateResult.affectedRows === 0) {
        return res.status(404).json({ message: "Entry Not Found" });
      }
  
      // Step 2: Remove old tag mappings
      await db.promise().query("DELETE FROM entry_tags WHERE entry_id = ?", [id]);
  
      // Step 3: Map new tags
      const tagPlaceholders = tags.map(() => "?").join(",");
      const [tagRows] = await db.promise().query(
        `SELECT id FROM tags WHERE name IN (${tagPlaceholders})`,
        tags
      );
      const tagIds = tagRows.map(row => row.id);
      const entryTagValues = tagIds.map(tagId => [id, tagId]);
  
      if (entryTagValues.length > 0) {
        await db.promise().query(
          "INSERT INTO entry_tags (entry_id, tag_id) VALUES ?",
          [entryTagValues]
        );
      }
  
      // ✅ Step 4: Fetch and return the updated entry with tags as string
      const [rows] = await db.promise().query(
        `SELECT e.*, GROUP_CONCAT(t.name) AS tags
         FROM entries e
         LEFT JOIN entry_tags et ON e.id = et.entry_id
         LEFT JOIN tags t ON et.tag_id = t.id
         WHERE e.id = ?
         GROUP BY e.id`,
        [id]
      );
  
      res.json({
        message: "Entry Updated",
        entry: rows[0]
      });
  
    } catch (err) {
      console.error("Update Entry Error:", err);
      res.status(500).json({ error: err.message });
    }
  };  

// DELETE /entries/:id
const deleteEntry = async (req, res) => {
    const { id } = req.params;

    try {
        // Step 1: Delete from entry_tags
        await db.promise().query("DELETE FROM entry_tags WHERE entry_id = ?", [id]);

        // Step 2: Delete the entry itself
        const [result] = await db.promise().query(
            "DELETE FROM entries WHERE id = ?",
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Entry Not Found" });
        }

        res.json({ message: "Entry Deleted" });
    } catch (err) {
        console.error("Delete Entry Error:", err);
        res.status(500).json({ error: err.message });
    }
};


// Export the controller functions
module.exports = {
    getAllEntries,
    getEntryById,
    addEntry,
    updateEntry,
    deleteEntry
};
