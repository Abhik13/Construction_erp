CREATE TABLE Project (
    ProjectID INT PRIMARY KEY,
    Name VARCHAR(255),
    Location VARCHAR(255)
);

CREATE TABLE Supervisor (
    SupervisorID INT PRIMARY KEY,
    Name VARCHAR(255),
    Experience INT
);

CREATE TABLE Contractor (
    ContractorID INT PRIMARY KEY,
    Name VARCHAR(255),
    Specialization VARCHAR(255)
);

CREATE TABLE Task (
    TaskID INT PRIMARY KEY,
    TaskName VARCHAR(255)
);

CREATE TABLE Worklog (
    WorklogID INT PRIMARY KEY AUTO_INCREMENT,
    Date DATE,
    WorkforceAssigned INT
);

CREATE TABLE Users (
    UserID INT AUTO_INCREMENT PRIMARY KEY,
    Username VARCHAR(255) UNIQUE NOT NULL,
    PasswordHash VARCHAR(255) NOT NULL,
    Role ENUM('Admin', 'Supervisor', 'Contractor') NOT NULL
);


-- Relationships
CREATE TABLE Manages (
    ProjectID INT,
    SupervisorID INT,
    PRIMARY KEY (ProjectID, SupervisorID),
    FOREIGN KEY (ProjectID) REFERENCES Project(ProjectID),
    FOREIGN KEY (SupervisorID) REFERENCES Supervisor(SupervisorID)
);

CREATE TABLE RecordsWork (
    SupervisorID INT,
    WorklogID INT,
    PRIMARY KEY (SupervisorID, WorklogID),
    FOREIGN KEY (SupervisorID) REFERENCES Supervisor(SupervisorID),
    FOREIGN KEY (WorklogID) REFERENCES Worklog(WorklogID)
);

CREATE TABLE Hires (
    SupervisorID INT,
    ContractorID INT,
    PRIMARY KEY (SupervisorID, ContractorID),
    FOREIGN KEY (SupervisorID) REFERENCES Supervisor(SupervisorID),
    FOREIGN KEY (ContractorID) REFERENCES Contractor(ContractorID)
);

CREATE TABLE SpecializesIn (
    ContractorID INT,
    TaskID INT,
    PRIMARY KEY (ContractorID, TaskID),
    FOREIGN KEY (ContractorID) REFERENCES Contractor(ContractorID),
    FOREIGN KEY (TaskID) REFERENCES Task(TaskID)
);

CREATE TABLE PerformsWork (
    ContractorID INT,
    WorklogID INT,
    PRIMARY KEY (ContractorID, WorklogID),
    FOREIGN KEY (ContractorID) REFERENCES Contractor(ContractorID),
    FOREIGN KEY (WorklogID) REFERENCES Worklog(WorklogID)
);

CREATE TABLE LoggedAs (
    WorklogID INT,
    TaskID INT,
    PRIMARY KEY (WorklogID, TaskID),
    FOREIGN KEY (WorklogID) REFERENCES Worklog(WorklogID),
    FOREIGN KEY (TaskID) REFERENCES Task(TaskID)
);


CREATE USER 'dba_user'@'localhost' IDENTIFIED BY 'dba_password';
GRANT ALL PRIVILEGES ON yourdatabase.* TO 'dba_user'@'localhost' WITH GRANT OPTION;

CREATE USER 'view_user'@'localhost' IDENTIFIED BY 'view_password';
GRANT SELECT ON yourdatabase.* TO 'view_user'@'localhost';

CREATE USER 'supervisor'@'localhost' IDENTIFIED BY 'super';
GRANT SELECT, UPDATE , INSERT ON yourdatabase.* TO 'supervisor'@'localhost';


FLUSH PRIVILEGES;
