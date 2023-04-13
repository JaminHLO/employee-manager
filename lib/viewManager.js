const QueryManager = require('./queryManager.js');
// const db = require('./connection.js');
// const inquirer = require('inquirer');

class ViewManager extends QueryManager {
  constructor(queryType) {
    // pass queryType to parent class constructor
    super(queryType);
  }
  toQuery() {
    // define unique query characteristics
    let queryDB = "";
    const lowerCaseQuery = (this.queryType).toLowerCase();
    if(lowerCaseQuery.includes("department")){
      queryDB = `SELECT id, name FROM department
      ORDER BY name`;
      
    } else if (lowerCaseQuery.includes("role")) {
      queryDB = `SELECT role.id, title, department.name AS department, salary 
      FROM role, department 
      WHERE role.department_id = department.id;`;
    } else if (lowerCaseQuery.includes("employee")) {
      queryDB = `SELECT employee.id, employee.first_name, employee.last_name, 
      role.title, department.name AS department, role.salary, employee.manager_id
      FROM employee, role, department
      WHERE department.id = role.department_id AND role.id = employee.role_id`;
      
      // JOIN employee ON employee.manager_id = employee.id
    } else{
      console.log("error");
    }
    return (queryDB);
  }
}

module.exports = ViewManager;