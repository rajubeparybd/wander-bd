const express = require('express');
const router = express.Router();
const {
    createStory,
    getAllStories,
    getStoryById,
    updateStory,
    removeImage,
    deleteStory
} = require('../controllers/story.controller');

router.post('/', createStory);
router.get('/', getAllStories);
router.get('/:id', getStoryById);
router.put('/:id', updateStory);
router.put('/:id/remove-image', removeImage);
router.delete('/:id', deleteStory);

module.exports = router;
