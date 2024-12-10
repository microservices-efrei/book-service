/**
 * @swagger
 * components:
 *   schemas:
 *     Book:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique identifier for the book (UUID)
 *         title:
 *           type: string
 *           description: The title of the book
 *         author:
 *           type: string
 *           description: The author of the book
 *         description:
 *           type: string
 *           description: A brief description of the book
 *         isAvailable:
 *           type: boolean
 *           description: Indicates whether the book is available for borrowing
 *         publishedYear:
 *           type: integer
 *           description: The year the book was published
 *           minimum: 1000
 *           maximum: 2024 # Assumed current year as the maximum
 *         genre:
 *           type: string
 *           description: The genre of the book (e.g., Fantasy, Science-fiction)
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date when the book was added to the system
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The last time the book details were updated
 *       required:
 *         - title
 *         - author
 *         - isAvailable
 *         - publishedYear
 */
