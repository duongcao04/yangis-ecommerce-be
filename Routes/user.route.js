const router = require('express').Router()
const userController = require('../Controllers/user.controller')

router.get('/', userController.getAllUser)
router.put('/:id', userController.updateUser)
router.delete('/:id', userController.deleteUser)

router.post('/register', userController.registerUser)
router.post('/login', userController.loginUser)

module.exports = router
