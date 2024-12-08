const router = require('express').Router()
const userController = require('../../controllers/user.controller')

// CRUD user route
router.get('/', userController.getAllUsers)
router.get('/paginate', userController.getUsersWithPaginate)
router.get('/:userId', userController.getUserById)
router.put('/:userId', userController.updateUser)
router.patch('/:userId', userController.deleteUser)

// Auth user route
router.post('/register', userController.registerUser)
router.post('/login', userController.loginUser)

const userRouter = router
module.exports = userRouter
