

class QueryManager {
    // set out shapeColor in parent class Shapes
    constructor(queryType) {
      this.queryType = queryType;
    }
    
    // make sure render is not called through an instance of Shapes class
    toQuery() {
      throw new Error('Child class must implement a toQuery() method.');
    }

    queryDataManager (answer) {
      throw new Error('Child class must implement a queryDataManager() method.');
    }
    
    promptUserManager (question) {
      throw new Error('Child class must implement a queryUserManager() method.');
    }

  }
  
  module.exports = QueryManager;