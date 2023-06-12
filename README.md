# nodejs-express-craw-f1

recomend using: Nodejs v14.21.3, TypeScript v5.0.4

# How to run server from local

1. Check node version(14.21.3) and TypeScript(https://www.npmjs.com/package/typescript/v/5.0.4)
2. install https://www.npmjs.com/package/sequelize-cli to migrate Database
3. install postgresql
4. Prepare .env file connect to database
5. run `npm install`
6. Run `npm run start:dev` or parallel (`npm run watch-ts` + `npm run watch`) ==> Run server local
7. Run `npm run db:migrate` ==> this command is migrate database(impotant) or you can import database from file `databaseCrawedDataF1.u`

# How to migrate database

1. Run `npm run db:migration nameOfFile.js` (please replace nametable and Update migrate file content)
2. Run `npm run db:migrate` this command is migrate database(impotant)
3. Run `npm run db:migrate:undo` undo latest migration file

### Folder Structure Conventions

    .
    ├── build                   # Compiled files (`npm run watch-ts` or npm run start:dev`) for local
    ├── dist                    # Compiled files (npm run build) for prod
    ├── src
        ├── index.ts            # app index
        ├── server.ts           # server: run multi core by cluster
        ├── common              # managerment and config sequelize ORM, Mirgation
        ├── config              # Define value for Development and Production
        ├── controllers         # management Logic code folder
        ├── interfaces          # management Interfaces for project
        ├── middlewares         # management Middlewares(query, auth,...)
        ├── model               # management : sequelize define Model and config database
        ├── router              # management : Define RestAPIs and custom APIs
        ├── services            # management Logic code folder
        ├── types               # management func validate,...
    ├── .env                    # enviroments file
    ├── .                       # config file
    ├── .                       # config file
    ├── tools                   # Tools and utilities
    ├── LICENSE
    └── README.md

### How To Use APIs

    refer to ERD image: erd-image-craw-f1.png
    example: Race restful api.
        Get list : http://localhost:4000/api/v1/races
        it has a total of 4 main query params including: fields, page, limit, where, order
            1. fields: it's an array, you can get the columns you need or all with ?fields=["$all"] and you can join table
                example 1: `http://localhost:4000/api/v1/races?fields=["grand_prix"]`
                    res is: ....
                            {
                                "id": "....",
                                "updatedAt": "....",
                                "grand_prix": "Spain"
                            }
                            ....
                example 2: `http://localhost:4000/api/v1/races?fields=["$all"]`
                    res is: ....
                            {
                                "id": "xx",
                                "grand_prix": "Spain",
                                "date": "2023-06-04T05:00:00.000Z",
                                "year": 2023,
                                "createdAt": "xx",
                                "updatedAt": "xx",
                                "deletedAt": null
                            }
                            ....
                example 2:join table `http://localhost:4000/api/v1/races?fields=["year",{"drivers_of_race":["$all",{"driver":["$all"]}]}]`
                    res is: ....
                            {
                                "id": "xx",
                                "grand_prix": "Spain",
                                "date": "2023-06-04T05:00:00.000Z",
                                ...
                                "drivers_of_race":[
                                    ...
                                    data of drivers_of_race
                                    ...,
                                    "driver":[
                                        ...
                                        data of driver
                                        ...
                                    ]
                                ]

                            }
                            ....
            2. page : you can specify the page in the api
            3. limit : you can specify the limit in the api
            4. where: you can join the table looking for everything with the condition
                example 1: query with conditon grand_prix:"Spain"
                    `http://localhost:4000/api/v1/races?fields=["$all"]&where={"grand_prix": "Spain"}`
                    res is: ...
                            {
                                    "count": 1,
                                    "rows": [
                                        {
                                            "id": "xx",
                                            "grand_prix": "Spain",
                                            "date": "xx",
                                            "year": 2023,
                                            "createdAt": "xx",
                                            "updatedAt": "xx",
                                            "deletedAt": null
                                        }
                                    ]
                            }

                            ...
                example 2: query join table
                    `http://localhost:4000/api/v1/drivers?fields=["$all",{"team":["$all"]}]&where={"$team.name$": "McLaren F1 Team"}`
                    or
                    `http://localhost:4000/api/v1/drivers?fields=["$all",{"team":["$all"]}]&where={"$team.name$": {"$eq":"McLaren F1 Team"}}`
                    detail: get all drivers in the team "McLaren F1 Team"
                *You can refer to more operations at:: https://sequelize.org/docs/v6/core-concepts/model-querying-basics*
            5. order: you can sort the position of the main table or the child table
                example 1: api get raking of a race
                    `http://localhost:4000/api/v1/drivers-of-race?fields=["$all",{"driver":["$all"]},{"race":["$all"]}]&where={"$race.grand_prix$":"Bahrain"}&order=[["pos","asc"]]`


            ***you can import JSON postman to see all the api I wrote available:
            crawf1.json
