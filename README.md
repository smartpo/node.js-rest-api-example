### REST API example with Node.js, Express, Mongoose

#### Intstallation
1. install Node.js, MongoDB
2. npm install
3. npm run app

#### API
##### Create user
POST http://localhost:3010/user
```
{
  firstName: "Jone",
  lastName: "Doe",
  email: "mail@example.com",
  password: "123456"
}
```

##### Login
POST http://localhost:3010/user/login
```
{
  email: "mail@example.com",
  password: "123456"
}
```
Answer:
```
{
  status: true,
  token: TOKEN
}
```

##### View token owner user
GET http://localhost:3010/me

Header X-Access-Token: TOKEN

##### View users
GET http://localhost:3010/users

Header X-Access-Token: TOKEN

#### Tests
npm run test