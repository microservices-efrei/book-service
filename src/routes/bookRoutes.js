const express = require('express');
const router = express.Router();
const {
  getBooks,
  updateBook,
  borrowBook,
  getBook,
  createBook,
  deleteBook,
  returnBook,
} = require('../controllers/bookControllers');
const { verifyToken } = require('../middleware/jwt');

router.get('/:id', verifyToken, getBook);
router.post('/', verifyToken, createBook);
router.put('/:id', verifyToken, updateBook);
router.delete('/:id', verifyToken, deleteBook);
router.get('/', verifyToken, getBooks);
router.post('/borrow/:bookId', verifyToken, borrowBook);
router.put('/return/:bookId', verifyToken, returnBook);

module.exports = router;
