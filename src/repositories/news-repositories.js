const CrudRepository = require('./crud-repository');
const { News } = require('../models');

class NewsRepository extends CrudRepository {
    constructor() {
        super(News);
    }
}

module.exports = NewsRepository;