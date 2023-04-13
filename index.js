// Include packages needed for this application
const logo = require('asciiart-logo');
const config = require('./package.json');
const inquirer = require('inquirer');
const db = require('./lib/connection.js');
const ViewManager = require('./lib/viewManager');
const AddManager = require('./lib/addManager');
require('console.table');

const mainMenuObject = {
    type: 'list',
    name: 'choice',
    message: 'What would you like to do?',
    choices: ['View All Departments', 'View All Roles', 'View All Employees',
        'Add a Department', 'Add a Role', 'Add an Employee', 'Update an Employee Role']
};

function queryDB (answer) {
    let {choice} = answer;
    choice = choice.toLowerCase(); 
    let queryString = ""
    if (choice.includes("view")){
        const newViewQuery = new ViewManager(choice);
        queryString = newViewQuery.toQuery();
        // console.log(`queryString is ${queryString}`);
    } else if (choice.includes("add")) {
        // console.log("\nwe're going to Add with XX");
        const newAddQuery = new AddManager(choice);
        let addQuestions = newAddQuery.toPrompt()
        const addQuery = newAddQuery.toQuery();
        if(addQuery !== ""){
            let optionsArray = [];
            let addQueryList = {};
            db.query(addQuery, function (err, results) {
                if(err) throw err;

                //test logic for choice
                if (choice.includes("role")){
                    results.forEach(department => optionsArray.push(department.name));
                    // console.log(optionsArray);
                    addQueryList = {
                    type: 'list', 
                    name: 'department', 
                    message: 'Which department does the role belong to?', 
                    choices: optionsArray};
                    addQuestions.unshift(addQueryList);
                    // console.log(addQuestions);
                    promptUserAdd("role", addQuestions, optionsArray); 
                } else if (choice.includes("employee")){
                    results.forEach(role => optionsArray.push(role.title));
                    // add employee role list
                    addQueryList = {
                        type: 'list',
                        name: 'role',
                        message: 'What is the employee\'s role?',
                        choices: optionsArray};
                    addQuestions.push(addQueryList);

                    // add employee manager list
                    db.query('SELECT first_name, last_name FROM employee', function (err, managers) {
                        let managersArray = [];
                        if(err) throw err;
                        managers.forEach(manager => managersArray.push(`${manager.first_name} ${manager.last_name}`));
                        // console.log(managersArray);
                        let addQueryList2 = {
                            type: 'list',
                            name: 'manager',
                            message: 'Who is the employee\'s manager?',
                            choices: managersArray};
                            // console.log(addQueryList2);
                        addQuestions.push(addQueryList2);
                        // console.log(addQuestions);
                        promptUserAdd("employee", addQuestions, optionsArray, managersArray); 
                    });

                } else {
                    console.error("error");
                }
     
            });
        } else {
            promptUserAdd("department", addQuestions); 
        }
        

    } else if (choice.includes("update")) {
        console.log("\nwe're going to Update with XX");
           // select employee to update
        let updateQuestions = [];
        db.query('SELECT first_name, last_name FROM employee', function (err, employees) {
            let employeeArray = [];
            if(err) throw err;
            employees.forEach(employee => employeeArray.push(`${employee.first_name} ${employee.last_name}`));
            // console.log(employeeArray);
            let updateQueryList = {
                type: 'list',
                name: 'employee',
                message: 'Which employee\'s role do you want to update?',
                choices: employeeArray};
            updateQuestions.push(updateQueryList);
            console.log(updateQuestions);
            if (choice.includes("role")) {
                db.query('SELECT title FROM role', function (err, roles) {
                    let roleArray = [];
                    if(err) throw err;
                    roles.forEach(role => roleArray.push(role.title));
                    let updateQueryList2 = {
                        type: 'list',
                        name: 'role',
                        message: 'Which role do you want to assign the selected employee?',
                        choices: roleArray};
                    updateQuestions.push(updateQueryList2);
                    promptUserUpdate("role", updateQuestions, employeeArray, roleArray);
                });
            } else if (choice.includes("manager")) {
                let updateQueryList2 = {
                    type: 'list',
                    name: 'manager',
                    message: 'Which manager do you want to assign to the selected employee?',
                    choices: employeeArray};
                updateQuestions.push(updateQueryList2);
                promptUserUpdate("manager", updateQuestions, employeeArray, employeeArray);
            }
            else {
                console.error("Option Not Found");
            }
        });
    } else {
        console.log("\nerror");
        return;
    }
    // Query database
    // console.log(`\n${queryString}`); // check query string
    if(queryString !== ""){
        db.query(queryString, function (err, results) {
            if(err) throw err;
            // console.clear();
            console.log("\n");
            console.table(results);
            mainMenu();
        });
    }
    // mainMenu();
}

function promptUserUpdate (queryType, questions, array1, array2) {
    // start prompt of update questions
    inquirer.prompt(questions).then(async (answers) => {
        // let successString = "";
        let queryString = `UPDATE employee `;
        // console.log(`We're going to ADD to ${queryType}`);
        console.log(answers);
        let employee_id = 1 + (array1.indexOf(answers.employee));
        switch(queryType){
            // case "department":
            //     queryString += `(name) 
            //     VALUES ("${answers.name}");`;
            //     successString = answers.name;
            //     break;
            case "role":
                let role_id = 1 + (array2.indexOf(answers.role));
                queryString += `SET role_id = ${role_id}
                WHERE id = ${employee_id};`;
                // successString = answers.title;
                break;
            case "manager":
                let manager_id = 1 + (array2.indexOf(answers.manager));
                queryString += `SET manager_id = ${manager_id}
                WHERE id = ${employee_id};`;
                // successString = `${answers.first_name} ${answers.last_name}`;
                break;
            default: 
                console.error("error in promptUserUpdate switch");
        }
        console.log(`sql query:\n${queryString}`);
        db.query(queryString, function (err, results) {
            if(err) throw err;
            console.log(results);
            console.log(`Updated employee's role.`);
            mainMenu();
        });

    })
    .catch((error) => {
        if (error.isTtyError) {
            console.log("\nYour console environment is not supported!");
        } else {
            console.log(error);
        }
    });
}

function promptUserAdd (queryType, questions, array1, array2) {
    // start prompt of add questions
    inquirer.prompt(questions).then(async (answers) => {
        let successString = "";
        let queryString = `INSERT INTO ${queryType} `;
        console.log(`We're going to ADD to ${queryType}`);
        console.log(answers);
        switch(queryType){
            case "department":
                queryString += `(name) 
                VALUES ("${answers.name}");`;
                successString = answers.name;
                break;
            case "role":
                let department_id = 1 + (array1.indexOf(answers.department));
                //department_id needs to be sent instead of department name
                queryString += `(title, salary, department_id) 
                VALUES ("${answers.title}", ${answers.salary}, ${department_id});`;
                successString = answers.title;
                break;
            case "employee":
                let role_id = 1 + (array1.indexOf(answers.role));
                let manager_id = 1 + (array2.indexOf(answers.manager));
                //role_id and manager_id need to be sent instead of string equivalents
                queryString += `(first_name, last_name, role_id, manager_id) 
                VALUES ("${answers.first_name}", "${answers.last_name}", ${role_id}, ${manager_id});`;
                successString = `${answers.first_name} ${answers.last_name}`;
                break;
            default: 
                console.error("error in promptUserAdd switch");
        }
        // console.log(`sql query:\n${queryString}`);
        db.query(queryString, function (err, results) {
            if(err) throw err;
            console.log(results);
            console.log(`Added ${successString} to the database.`);
            mainMenu();
        });

    })
    .catch((error) => {
        if (error.isTtyError) {
            console.log("\nYour console environment is not supported!");
        } else {
            console.log(error);
        }
    });
}

function mainMenu () {
    // start prompt of questions
    inquirer.prompt(mainMenuObject).then(async (answers) => {
        queryDB(answers);
    })
    .catch((error) => {
        if (error.isTtyError) {
            console.log("\nYour console environment is not supported!");
        } else {
            console.log(error);
        }
    })
}

function init() {
    // display ascii logo
    console.log(logo(config).render());

    // start prompt of questions
    mainMenu();

}

// Function call to initialize app
init();