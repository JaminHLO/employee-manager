# Employee-Manager

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

## Description
    
This Project is an employee manager that organizes a company's departments, roles, employees and managers. It is built with javascript with a SQL backend. It uses the inquirer, asciiart-logo, dotenv, and mysql libraries and operates from the CLI. 
    
## Installation

Users will need to install the npm libraries as defined in the included package.json file. Also please create a .env file including entries for the employee_db database as well as your mysql username and password.
Set-Up CLI Commands from project root directory:
>npm i 
>cd db
>mysql -u root -p // when prompted enter your mysql password
>SOURCE schema.sql
>SOURCE seeds.sql
>cd ..
>node index.js

## Usage

A Demonstration Video showing the setup and functionality of the program is available here: <https://www.loom.com/share/ab1d6bda64bb4602aa76b2230924451d> 
Otherwise, the program is initialized from the CLI in the project root directory with:
>node index.js

## License

This Project is covered by the following license: GNU General Public License v3.0.

## Contributions

Instruction was provided by Instructor Saurav with assistance from TAs Andreas #1, Andreas #2, Constan, and Morgan. 

Leaned on previous assignments and online resources. A good online resource I used was: 
<https://www.w3schools.com/>

For a good resource for javascript debugging and error messages, check out: 
<https://stackoverflow.com/>

## Tests

The Project may tested running 'node index.js'and then using MySQL WOrkbench 6.0 CE to confirm the status of db. Please see the Demonstration Video above for a walkthrough.

## Questions

My GitHub username is JaminHLO and my repository is available here: <https://github.com/JaminHLO/>.
If you have any questions please contact me at <jamin.hogan@gmail.com>.
