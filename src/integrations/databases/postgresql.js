const logger = require('../../../config/winston');
const pgp = require('pg-promise')();
const PQ = require('pg-promise').ParameterizedQuery;
let DB = null;

class Postgresql {

  constructor(options) {
    this.cs = options.cs;
    this.table = new pgp.helpers.TableName(options.table)
    DB = (null === DB) ? pgp(this.cs) : DB;
  }

  generateCreateQuery(model) {
    let names = Object.keys(model).map((k) => { return k }).join(',');
    let values = Object.keys(model).map((k) => { return "'" + model[k] + "'" }).join(',').toString();
    let query = 'INSERT INTO ' + this.table + '(' + names +  ') VALUES (' + values + ') RETURNING *';
    return query;
  }

  generateReadQuery(id) {
    const query = PQ('SELECT * FROM $1 WHERE id=$2', [this.table, id]);
    return query;
  }

  generateUpdateQuery(id, model) {
    let updates = Object.keys(model).map((k) => { return k + ' = ' + "'" + model[k] + "'" }).join(',');
    let query = 'UPDATE ' + this.table + ' SET ' + updates +  ' WHERE id = ' + id + ' RETURNING *';
    return query;
  }

  async create(model) {
    const query = this.generateCreateQuery(model);
    try {
      return await DB.one(query);
    } catch(err) {
      logger.debug(err.message);
      return null;
    }

  }

  async read(id) {
    try {
      return await DB.one('SELECT * FROM $1 WHERE id=$2', [this.table, id]);
    } catch (err) {
      logger.debug(err.message);
      return null;
    }
  }

  async update(id, model) {
    const query = this.generateUpdateQuery(id, model);
    try {
      return await DB.one(query);
    } catch (err) {
      logger.debug(err.message);
      return null;
    }
  }

  async delete(id) {
    try {
      return await DB.one("DELETE FROM $1 WHERE id = $2 RETURNING *", [this.table, id]);
    } catch(err) {
      logger.debug(err.message);
      return null;
    }
  }

  async clean() {
    try {
      return await DB.none("TRUNCATE $1 RESTART IDENTITY", [this.table]);
    } catch(err) {
      logger.debug(err.message);
      return null;
    }
  }

}

module.exports = Postgresql;
