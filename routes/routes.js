const helpers = require('../_helpers')

const express = require('express');
const router = express.Router();

const passport = require('../config/passport')

const restController = require('../controllers/restController.js')
const adminController = require('../controllers/adminController.js')
const userController = require('../controllers/userController.js')
const categoryController = require('../controllers/categoryController.js')
const commentController = require('../controllers/commentController.js')

const multer = require('multer')
const upload = multer({ dest: 'temp/' })

const authenticate = (req, res, next) => {
  // if (req.isAuthenticated()) {
  if (helpers.ensureAuthenticated(req)) {
    return next()
  }
  res.redirect('/signin')
}

const authenticatedAdmin = (req, res, next) => {
  // if (req.isAuthenticated()) {
  //   if (req.user.isAdmin) {
  if (helpers.ensureAuthenticated(req)) {
    if (helpers.getUser(req).isAdmin) {
      return next()
    }
    return res.redirect('/')
  }
  res.redirect('/signin')
}

//如果使用者訪問首頁，就導向 /restaurants 的頁面
router.get('/', authenticate, (req, res) => res.redirect('/restaurants'))
//在 /restaurants 底下則交給 restController.getRestaurants 來處理
router.get('/restaurants', authenticate, restController.getRestaurants)
router.get('/restaurants/feeds', authenticate, restController.getFeeds)
router.get('/restaurants/top', authenticate, restController.getTopRestaurant)
router.get('/restaurants/:id', authenticate, restController.getRestaurant)
router.get('/restaurants/:id/dashboard', authenticate, restController.getDashboard)

// 連到 / admin 頁面就轉到 / admin / restaurants
router.get('/admin', authenticatedAdmin, (req, res) => res.redirect('/admin/restaurants'))

// 在 /admin/restaurants 底下交給 adminController
router.get('/admin/restaurants', authenticatedAdmin, adminController.getRestaurants)
router.get('/admin/restaurants/create', authenticatedAdmin, adminController.createRestaurant)
router.post('/admin/restaurants', authenticatedAdmin, upload.single('image'), adminController.postRestaurant)
router.get('/admin/restaurants/:id', authenticatedAdmin, adminController.getRestaurant)
router.get('/admin/restaurants/:id/edit', authenticatedAdmin, adminController.editRestaurant)
router.put('/admin/restaurants/:id', authenticatedAdmin, upload.single('image'), adminController.putRestaurant)
router.delete('/admin/restaurants/:id', authenticatedAdmin, adminController.deleteRestaurant)

router.get('/admin/users', authenticatedAdmin, adminController.getUsers)
router.put('/admin/users/:id/toggleAdmin', authenticatedAdmin, adminController.toggleAdmin)

router.get('/admin/categories', authenticatedAdmin, categoryController.getCategories)
router.post('/admin/categories', authenticatedAdmin, categoryController.postCategory)
router.get('/admin/categories/:id', authenticatedAdmin, categoryController.getCategories)
router.put('/admin/categories/:id', authenticatedAdmin, categoryController.putCategory)
router.delete('/admin/categories/:id', authenticatedAdmin, categoryController.deleteCategory)


router.post('/comments', authenticate, commentController.postComment)
router.delete('/comments/:id', authenticate, commentController.deleteComment)

router.get('/users/top', authenticate, userController.getTopUser)
router.get('/users/:id', authenticate, userController.getUser)
router.get('/users/:id/edit', authenticate, userController.editUser)
router.put('/users/:id', authenticate, upload.single('image'), userController.putUser)

router.post('/favorite/:restaurantId', authenticate, userController.addFavorite)
router.delete('/favorite/:restaurantId', authenticate, userController.removeFavorite)

router.post('/like/:restaurantId', authenticate, userController.addLike)
router.delete('/like/:restaurantId', authenticate, userController.removeLike)

router.post('/following/:userId', authenticate, userController.addFollowing)
router.delete('/following/:userId', authenticate, userController.removeFollowing)


router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)

router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
router.get('/logout', userController.logout)

module.exports = router