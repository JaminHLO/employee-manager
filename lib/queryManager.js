
// parent class for ViewManager. Allows for expandability
class QueryManager {
    // set out shapeColor in parent class Shapes
    constructor(queryType) {
      this.queryType = queryType;
    }
    // make sure toQuery is not called through an instance of Shapes class
    toQuery() {
      throw new Error('Child class must implement a toQuery() method.');
    }

  }
  
  module.exports = QueryManager;