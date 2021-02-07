CREATE TABLE goodgames_list (
    game_id INTEGER PRIMARY KEY,
    game_name TEXT not null, 
    image_id TEXT not null,
    playlist BOOLEAN,
    played BOOLEAN,
    favorite BOOLEAN,
    userid INTEGER REFERENCES goodgames_users(id)
);

