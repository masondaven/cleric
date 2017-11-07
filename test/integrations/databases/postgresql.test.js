const expect = require('chai').expect;
const pgp = require('pg-promise');
const postgresql = require('../../../src/integrations/databases/postgresql');

describe('Integrations: Databases: Postgresql', () => {

  const model = {
    "name":"test"
  }

  let integration;
  before(() => {
    integration = new postgresql({
      "cs": "postgresql://user:password@postgresql:5432/cleric",
      "table": "cleric"
    });
  });

  beforeEach(() => {
    return integration.create(model);
  });

  afterEach(() => {
    return integration.clean();
  });

  it('Should read model', async () => {
    const model = await integration.read(1);
    expect(model).to.deep.equal({
      "id": 1,
      "name": "test"
    });
  });

  it('Should update model', async () => {
    const model = await integration.update(1, {
      "name":"test1"
    });
    expect(model).to.deep.equal({
      "id": 1,
      "name": "test1"
    });
  });

});
