const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category

let categoryService = {
  getCategories: (req, res, callback) => {
    return Category.findAll({
      raw: true,
      nest: true
    }).then(categories => {
      if (req.params.id) {
        Category.findByPk(req.params.id)
          .then((category) => {
            callback({
              categories: categories,
              category: category
            })
          })
      } else {
        callback({
          categories: categories
        })
      }
    })
  }
}

module.exports = categoryService