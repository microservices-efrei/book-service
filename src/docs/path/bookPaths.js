/**
 * @swagger
 * /books/{id}:
 *   get:
 *     summary: Get book by ID
 *     description: Retrieve book details by book ID.
 *     tags:
 *       - Books
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: The UUID of the book to retrieve
 *     responses:
 *       '200':
 *         description: Book details found successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       '404':
 *         description: Book not found
 *       '500':
 *         description: Internal server error
 */

/**
 * @swagger
 * /books:
 *   get:
 *     summary: Get all books
 *     description: Retrieve the list of all books in the system.
 *     tags:
 *       - Books
 *     responses:
 *       '200':
 *         description: A list of books
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 *       '500':
 *         description: Internal server error
 */

/**
 * @swagger
 * /books/{id}:
 *   delete:
 *     summary: Delete a book by ID
 *     description: Delete a book from the system by its unique ID.
 *     tags:
 *       - Books
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: The UUID of the book to delete
 *     responses:
 *       '200':
 *         description: Book deleted successfully
 *       '404':
 *         description: Book not found
 *       '500':
 *         description: Internal server error
 */

/**
 * @swagger
 * /book:
 *   post:
 *     summary: Create a book
 *     description: Create a book and insert into book_db.
 *     tags:
 *       - Books
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *
 *                 description: The title of the book
 *               autho:
 *                 type: string
 *                 description: The author of the book
 *
 *               description:
 *                 type: string
 *                 description: A brief description of the book
 *     responses:
 *       '200':
 *         description: Livre ajouté avec succès 
 *       '400':
 *         description: Invalid input data
 *       '404':
 *         description: Livre non créé
 *       '500':
 *         description: Internal server error
 */

/**
 * @swagger
 * /books/{id}:
 *   put:
 *     summary: Update book details
 *     description: Update the details of an existing book by its ID.
 *     tags:
 *       - Books
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: The UUID of the book to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The updated title of the book
 *               author:
 *                 type: string
 *                 description: The updated author of the book
 *               description:
 *                 type: string
 *                 description: The updated description of the book
 *               isAvailable:
 *                 type: boolean
 *                 description: The updated availability status of the book
 *               publishedYear:
 *                 type: integer
 *                 description: The updated published year of the book
 *               genre:
 *                 type: string
 *                 description: The updated genre of the book
 *     responses:
 *       '200':
 *         description: Book updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       '400':
 *         description: Invalid input data
 *       '404':
 *         description: Book not found
 *       '500':
 *         description: Internal server error
 */

/**
 * @swagger
 * /book/borrow/{id}:
 *   post:
 *     summary: Borrow a book
 *     description: Update the reservation status of a book and send a message to RabbitMQ.
 *     tags:
 *       - Books
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bookId:
 *                 type: string
 *                 format: uuid
 *                 description: The UUID of the book being borrowed
 *               userId:
 *                 type: string
 *                 format: uuid
 *                 description: The UUID of the user borrowing the book
 *               borrowDate:
 *                 type: string
 *                 format: date-time
 *                 description: The date when the book is borrowed
 *               returnDate:
 *                 type: string
 *                 format: date-time
 *                 description: The expected return date of the book
 *     responses:
 *       '200':
 *         description: Book borrow status updated and message sent to RabbitMQ
 *       '400':
 *         description: Invalid input data
 *       '404':
 *         description: Book or User not found
 *       '500':
 *         description: Internal server error
 */

/**
 * @swagger
 * /book/return/{id}:
 *   put:
 *     summary: Return a book
 *     description: Update the reservation status of a book and send a message to RabbitMQ.
 *     tags:
 *       - Books
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bookId:
 *                 type: string
 *                 format: uuid
 *                 description: The UUID of the book being borrowed
 *               userId:
 *                 type: string
 *                 format: uuid
 *                 description: The UUID of the user borrowing the book
 *               borrowDate:
 *                 type: string
 *                 format: date-time
 *                 description: The date when the book is borrowed
 *               returnDate:
 *                 type: string
 *                 format: date-time
 *                 description: The expected return date of the book
 *     responses:
 *       '200':
 *         description: Book borrow status updated and message sent to RabbitMQ
 *       '400':
 *         description: Invalid input data
 *       '404':
 *         description: Book or User not found
 *       '500':
 *         description: Internal server error
 */
