import express from 'express';
import CompetitionStage from '../models/competitionStage.js';

const router = express.Router();

// POST /api/competitionStages/add
router.post('/add', async (req, res) => {
  const { stageName, stageId, questions } = req.body;
  
  try {
    // Check if this stage already exists
    const existingStage = await CompetitionStage.findOne({ stageName, stageId });
    
    if (existingStage) {
      // Update existing stage with new questions
      existingStage.questions = questions;
      await existingStage.save();
      res.status(200).json({ 
        message: 'Competition stage updated successfully',
        stageId: existingStage.stageId
      });
    } else {
      // Create new stage
      const newStage = new CompetitionStage({ stageName, stageId, questions });
      await newStage.save();
      res.status(201).json({ 
        message: 'Competition stage and questions added successfully',
        stageId: newStage.stageId
      });
    }
  } catch (error) {
    console.error("Error adding/updating stage:", error);
    res.status(500).json({ error: 'Server error while adding stage' });
  }
});

// GET /api/competitionStages/:stageName/:groupNumber
router.get('/:stageName/:groupNumber', async (req, res) => {
  const { stageName, groupNumber } = req.params;
  
  try {
    // First try to find a stage with the exact groupNumber as stageId
    let stage = await CompetitionStage.findOne({ 
      stageName, 
      stageId: groupNumber 
    });
    
    // If not found, fallback to the default stage for this stageName
    if (!stage) {
      stage = await CompetitionStage.findOne({ 
        stageName, 
        stageId: '1' // Default stageId
      });
      
      if (!stage) {
        return res.status(404).json({ 
          message: `No questions found for ${stageName} (Group ${groupNumber})` 
        });
      }
    }
    
    // Return the questions for this stage
    res.json({ 
      stageName: stage.stageName,
      stageId: stage.stageId,
      groupNumber: parseInt(groupNumber), // Include the requested group number
      questions: stage.questions || []
    });
    
  } catch (error) {
    console.error("Error fetching stage:", error);
    res.status(500).json({ error: 'Server error while fetching stage' });
  }
});

// GET /api/competitionStages/list
router.get('/list', async (req, res) => {
  try {
    const stages = await CompetitionStage.find({}, { 
      stageName: 1, 
      stageId: 1, 
      _id: 1,
      questionCount: { $size: "$questions" } 
    });
    
    res.json(stages);
  } catch (error) {
    console.error("Error listing stages:", error);
    res.status(500).json({ error: 'Server error while listing stages' });
  }
});

// DELETE /api/competitionStages/:id
router.delete('/:id', async (req, res) => {
  try {
    const result = await CompetitionStage.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ message: 'Stage not found' });
    }
    res.json({ message: 'Stage deleted successfully' });
  } catch (error) {
    console.error("Error deleting stage:", error);
    res.status(500).json({ error: 'Server error while deleting stage' });
  }
});

export default router;