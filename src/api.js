const logger = require('../config/winston');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

class Api {

  constructor(options) {
    this.port = (options.port) ? options.port : 3000;
    this.model = (options.model) ? options.model : '';
    const modelUrl = '/' + this.model;
    this.db = options.db;

    const router = express.Router();
      router.post(modelUrl, this.create.bind(this));
      router.get(modelUrl + '/:id', this.read.bind(this));
      router.put(modelUrl + '/:id', this.update.bind(this));
      router.delete(modelUrl + '/:id', this.delete.bind(this));
    app.use('', router);
  }

  async create(req, res) {
    const model = await this.db.create(req.body);
    return res.status(201).json(model);
  }

  async read(req, res) {
    const id = req.params.id;
    const model = await this.db.read(id);
    return res.status(200).json(model);
  }

  async update(req, res) {
    const model = await this.db.update(req.params.id, req.body);
    return res.status(200).json(model);
  }

  async delete(req, res) {
    const model = await this.db.delete(req.params.id);
    return res.status(202).json(model);
  }

  start() {
    this.server = app.listen(this.port, () => logger.info('API listening on port ' + this.port));
  }

  stop() {
    this.server.close();
  }

}

module.exports = Api;
