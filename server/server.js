const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// In-memory "Database"


// // Mock Database
// let pets = [
//   { id: '1', name: 'Chim', type: 'Dog', breed: 'Golden Retriever', age: 3, medicalHistory: [] },
//   { id: '2', name: 'Lin', type: 'Cat', breed: 'Siamese', age: 5, medicalHistory: [] }
// ];
let pets = []

app.get('/pets', (req, res) => {
  const { owner } = req.query;

  if (owner) {
    // Filter the array to only return pets belonging to that owner
    const userPets = pets.filter(pet => pet.owner === owner);
    return res.json(userPets);
  }

  res.json(pets); // Fallback to all pets if no owner specified
});

// POST a new pet
app.post('/pets', (req, res) => {
  const newPet = req.body

  if (!newPet.id) {
    newPet.id = Date.now().toString();
  }

  pets.push(newPet);
  console.log('Added new pet:', newPet.name);
  res.status(201).json(newPet);
});

app.put('/pets/:id', (req, res) => {
  const { id } = req.params;
  const updatedInfo = req.body;

  // Find the index of the pet in your 'pets' array
  const index = pets.findIndex(p => p.id === id);

  if (index !== -1) {
    // Merge the old pet data with the new info
    pets[index] = { ...pets[index], ...updatedInfo };
    res.json(pets[index]);
  } else {
    res.status(404).json({ message: "Pet not found" });
  }
});

//delete a pet
app.delete('/pets/:id', (req, res) => {
  const { id } = req.params;
  const initialLength = pets.length;

  // Filter out the pet with the matching ID
  pets = pets.filter(p => p.id !== id);

  if (pets.length < initialLength) {
    console.log(`🗑️ Deleted pet with ID: ${id}`);
    res.status(200).json({ message: "Pet deleted successfully" });
  } else {
    res.status(404).json({ message: "Pet not found" });
  }
});

// Start server on 0.0.0.0 to allow network access
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
  console.log(`🚀 For Android Emulator, use http://10.0.2.2:${PORT}`);
});