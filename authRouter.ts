const Router = require('express');
const router = new Router();
const controller = require('./authController');
const authMiddleware = require('./middlewaree/authMiddleware');
const roleMiddleware = require('./middlewaree/roleMiddleware');

router.post('/registration', controller.registration);
router.post('/login', controller.login);
router.get('/books', controller.getBooks);
router.get('/books/:id', controller.getBookOne);
router.get('/users/me', authMiddleware, roleMiddleware, controller.getUsers );
router.post('/genres/add', authMiddleware, roleMiddleware, controller.addGenre );
router.post('/books/add', authMiddleware, roleMiddleware, controller.addBasket );
router.put('/books/edit/:id', authMiddleware, roleMiddleware, controller.updateBook );
router.put('/users/edit/:id', authMiddleware, roleMiddleware, controller.updateUsers );
router.delete('/books/:id', authMiddleware, roleMiddleware, controller.deleteBook );

module.exports = router;