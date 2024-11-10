# Propably the most important part is here, how users works and whitelist

## For add someone to whitelist you need include the ip on whitelist.json

## For create an user you need to create it on users.json

## How any user is concepted?

- id: an number what make a difference betwen users
- accessToken an string of like 40+ random characters saved for any user to can acces it with full acces to account
- username is an important part of any user, it let you view an specificated user like on this example: http://localhost/profile/@(username)
- name is displayed name of the user
- hasPassword is a value what if is enabled u need string password of user to acces it
- password is Password of user
- role is a value with 1 and 0, if it is 1 user is not banned and if is 0 it is banned