# ACTIVITY DIAGRAM


```@startuml
start

repeat :Search for a book;
    :Call Google Books API;
    :Display Results;
backward :Show 'No results' message;
repeat while (Book found?) is (No)
-> Yes;

repeat :Select a book;
    :Click 'Add to Library';
backward :Redirect to Login;
repeat while (Logged in?) is (No)
-> Yes;

partition "Data Layer" {
    if (Book exists in DB?) then (Yes)
        :Upsert Book;
    else (No)
        :Add New Book;
    endif
    
    :Link to User Library;
}

:Success Notification;

stop
@enduml
```