const express = require('express')
const pool = require('../config/postgres-connection');
const router = express.Router()
router.post("/add", async (req, res) => {
  try {
    const { task, priority } = req.body;
    const result = await pool.query(
      "INSERT INTO tasks (task, priority) VALUES ($1, $2) RETURNING *",
      [task, priority]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi add task" });
  }
});
router.delete("/delete",async(req,res)=>{
  try {
    const { id, priority } = req.body;
    const result = await pool.query(
            'DELETE FROM tasks WHERE priority = $1 AND id = $2',
            [priority, id],
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "error in return data" });
  }  
})
router.get("/tasks", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM tasks ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "error in getting data " });
  }
});
module.exports=router
