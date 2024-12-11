CREATE TABLE role_distribution (
    user_count INT NOT NULL,
    role_id INT NOT NULL,
    role_count INT NOT NULL,
    PRIMARY KEY (user_count, role_id),
    FOREIGN KEY (role_id) REFERENCES roles(id)
);
