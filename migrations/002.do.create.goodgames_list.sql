CREATE TABLE goodgames_list (
   id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY, 
    game_id INTEGER,
    game_name TEXT not null, 
    playlist BOOLEAN not null,
    played BOOLEAN not null,
    favorite BOOLEAN not null,
    userid INTEGER REFERENCES goodgames_users(id)
)

