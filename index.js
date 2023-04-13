// Include packages needed for this application
const logo = require('asciiart-logo');
const config = require('./package.json');
const inquirer = require('inquirer');
const db = require('./lib/connection.js');
const ViewManager = require('./lib/viewManager');
const AddManager = require('./lib/addManager');
require('console.table');


function queryDB (answer) {
    const {choice} = answer;
    let queryString = ""
    if (choice.includes("View")){
        const newViewQuery = new ViewManager(choice);
        queryString = newViewQuery.toQuery();
        // console.log(`queryString is ${queryString}`);
    } else if (choice.includes("Add")) {
        // console.log("\nwe're going to Add with XX");
        const newAddQuery = new AddManager(choice);
        let addQuestions = newAddQuery.toPrompt()
        const addQuery = newAddQuery.toQuery();
        if(addQuery !== ""){
            let options = [];
            let addQueryList = {};
            db.query(addQuery, function (err, results) {
                if(err) throw err;

                //test logic for choice
                if (choice.includes("Role")){
                    results.forEach(department => options.push(department.name));
                    // console.log(options);
                    addQueryList = {
                    type: 'list', 
                    name: 'department', 
                    message: 'Which department does the role belong to?', 
                    choices: options};
                    addQuestions.unshift(addQueryList);
                    // console.log(addQuestions);
                    promptUserAdd(addQuestions);
                } else if (choice.includes("Employee")){
                    results.forEach(role => options.push(role.title));
                    // add employee role list
                    addQueryList = {
                        type: 'list',
                        name: 'role',
                        message: 'What is the employee\'s role?',
                        choices: options};
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
                        promptUserAdd(addQuestions);
                    });

                } else {
                    console.error("error");
                }
     
            });
        } else {
            promptUserAdd(addQuestions);
        }
        

    } else if (choice.includes("Update")) {
        console.log("\nwe're going to Update with XX");
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

function promptUserAdd (questions) {
    // start prompt of questions
    inquirer.prompt(questions).then(async (answers) => {
        // queryDB(answers);
        console.log(answers);
    })
    .catch((error) => {
        if (error.isTtyError) {
            console.log("\nYour console environment is not supported!");
        } else {
            console.log(error);
        }
    })
}

function mainMenu () {
    // start prompt of questions
    inquirer.prompt({
        type: 'list',
        name: 'choice',
        message: 'What would you like to do?',
        choices: ['View All Departments', 'View All Roles', 'View All Employees',
            'Add a Department', 'Add a Role', 'Add an Employee', 'Update an Employee Role']
    }).then(async (answers) => {
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