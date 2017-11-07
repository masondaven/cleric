const Api = require('./api');

// integrations
const dbPostgresql = require('./integrations/databases/postgresql');

function RestRepository(options) {
  const model = (options.model) ? options.model : '';

  return function(target) {
    const api = new Api({
      port: 3000,
      model: model,
      db: new dbPostgresql({
        cs: 'postgresql://user:password@postgresql:5432/cleric',
        table: model
      })
    });

    target.prototype.start = () => {
      api.start();
    }

    target.prototype.stop = () => {
      api.stop();
    }

    return target;
  }
}

module.exports = RestRepository;
