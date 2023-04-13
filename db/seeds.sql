INSERT INTO department (name)
VALUES  ("Legal"),
        ("IT"),
        ("Media Relations"),
        ("C-Suite");

INSERT INTO role (title, salary, department_id)
VALUES  ("Staff Attorney", 100000, 1), 
        ("Lead Attorney", 150000, 1), 
        ("Developer", 80000, 2), 
        ("Senior Developer", 120000, 2),
        ("Writer", 50000, 3),
        ("Spokesperson", 150000, 3),
        ("Chief Financial Officer", 200000, 4),
        ("CEO", 450000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES  ("Bret", "Johnsen", 1, 3),
        ("Christopher", "Cardaci", 1, 3),
        ("Colin", "Teehan", 2, 16),
        ("Harry", "Hanley", 3, 7),
        ("Jashan", "Gill", 3, 7),

        ("Michael", "Sagan", 3, 7),
        ("Mike", "Cangi", 4, 16),
        ("Patrick", "Drew", 3, 12),
        ("Randy", "Rees", 3, 12),
        ("Ryan", "Rodriguez", 3, 12),

        ("Gwynne", "Shotwell", 7, 16),
        ("Umer", "Khan", 4, 16),
        ("Michael", "Nicolls", 3, 15),
        ("Jonathan", "Hawthorne", 3, 15),
        ("Tim", "Hughes", 4, 16),

        ("Elon", "Musk", 8, null),
        ("Stacy", "Curtin", 5, 20),
        ("Philippe", "de Fromont", 5, 20),
        ("Jessica", "Curtiss", 5, 20),
        ("Kendra", "Marsh", 6, 16);
       
