const express = require('express');
const router = express.Router();
const {
  getBooks,
  updateBook,
  borrowBook,
  getBook,
  createBook,
  deleteBook,
} = require('../controllers/bookControllers');
const { verifyToken } = require('../middleware/jwt');

router.get('/:id', verifyToken, getBook);
router.post('/', verifyToken, createBook);
router.put('/:id', verifyToken, updateBook);
router.delete('/:id', verifyToken, deleteBook);
router.get('/', getBooks);
router.post('/borrow/:bookId', verifyToken, borrowBook);

module.exports = router;
