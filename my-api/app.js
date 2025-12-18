const express = require('express');
const mongoose = require('mongoose');
const app = express();
app.use(express.json());
const PORT = 3000;

// connect to local MongoDB (make sure mongod is running)
mongoose.connect('mongodb://localhost:27017/mytest', { useNewUrlParser:true, useUnifiedTopology:true });

// simple Story model
const StorySchema = new mongoose.Schema({
  title: String,
  content: String
});
const Story = mongoose.model('Story', StorySchema);

// GET all
app.get('/api/stories', async (req, res) => {
  const stories = await Story.find();
  res.json(stories);
});

// GET one
app.get('/api/stories/:id', async (req, res) => {
  const s = await Story.findById(req.params.id);
  if (!s) return res.status(404).json({message:'Not found'});
  res.json(s);
});

// POST create
app.post('/api/stories', async (req, res) => {
  const story = new Story(req.body);
  await story.save();
  res.status(201).json(story);
});

// PUT update
app.put('/api/stories/:id', async (req, res) => {
  const s = await Story.findByIdAndUpdate(req.params.id, req.body, {new:true});
  if (!s) return res.status(404).json({message:'Not found'});
  res.json(s);
});

// DELETE
app.delete('/api/stories/:id', async (req, res) => {
  const s = await Story.findByIdAndDelete(req.params.id);
  if (!s) return res.status(404).json({message:'Not found'});
  res.status(204).end();
});

app.listen(PORT, ()=> console.log('Server running on http://localhost:3000'));
