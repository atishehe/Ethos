// routes/collegeRoutes.js
import express from 'express';
import CollegeStudents from '../models/CollegeStudents.js';

const router = express.Router();

// Add students under a specific college
router.post('/add', async (req, res) => {
  const { collegeName, students } = req.body;

  if (!collegeName || !Array.isArray(students)) {
    return res.status(400).json({ error: 'collegeName and students array required' });
  }

  try {
    // Find if a record exists for the given college name
    let record = await CollegeStudents.findOne({ collegeName });

    if (!record) {
      // Create a new record if the college doesn't exist
      record = new CollegeStudents({
        collegeName,
        students,
      });
    } else {
      // If the college already exists, add the new students to the list
      record.students.push(...students);
    }

    await record.save();
    res.status(200).json({ message: 'Students added successfully', data: record.students });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error adding students' });
  }
});

// Get students by college name
router.get('/:collegeName', async (req, res) => {
  const { collegeName } = req.params;

  try {
    const record = await CollegeStudents.findOne({ collegeName });
    if (!record) {
      return res.status(404).json({ message: 'College not found' });
    }

    res.status(200).json({
      [collegeName]: record.students, // Return the students array for the specified college
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching students' });
  }
});

export default router;
