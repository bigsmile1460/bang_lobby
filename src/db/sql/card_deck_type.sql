USE game_db;
DROP TABLE IF EXISTS card_deck;
DROP TABLE IF EXISTS card_types;
CREATE TABLE card_types (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL
);
CREATE TABLE card_deck (
    id INT PRIMARY KEY AUTO_INCREMENT,
    card_type_id INT NOT NULL,
    count INT NOT NULL DEFAULT 0,
    FOREIGN KEY (card_type_id) REFERENCES card_types(id) ON DELETE CASCADE
);