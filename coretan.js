/*
npx sequelize-cli model:generate --name Account --attributes username:string,email:string,password:string,role:string

npx sequelize-cli model:generate --name User --attributes firstName:string,lastName:string,dateOfBirth:date,address:string,bio:text

npx sequelize-cli migration:generate --name add-AccountId-to-User-table

npx sequelize-cli model:generate --name User --attributes firstName:string,lastName:string,email:string

npx sequelize-cli model:generate --name Post --attributes title:string,content:text,imageUrl:string,createdAt:date,updatedAt:date,AccountId:integer
*/