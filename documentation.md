# Auction  API

The following is the Auction API documentation. The primary purpose of this API is to enable users to include items in an auction and allow users to place bids on those items . the Apt have four schemas
- user: save the user's info (username,firstName , lastName,email , password ).
Before saving the password it is encrypted and hashed
- article : save the article's data (title, description,city,type,ownerId,ownerName,images)
- Bidding : save biddings's data (price,bidderId,bidderName,articleId)
 - webhook : (url,userId)




## POST :register
Register a new account

### Parameters
No parameters
### Request URL
https://cscloud6-82.lnu.se/auction/users/register
### Request body
 * application/json
  * Example Value
      - Schema
`
    {
  "username": "memo",
  "password": "memo123",
  "firstName": "memo",
  "lastName": "lio",
  "email": "memo@gmail.com"
   }
   `
### Responses
- Code :	201	
The request has been fulfilled, resulting in the creation of a new account.
 - links :
     - self: the current URL
     - login : URL to login 
     - articles : URL to get all articles 
     

### Errors
 - code :400	
The request cannot or will not be processed due to something that is perceived to be a client error (for example validation error).
- code : 409	
The username and/or email address is already registered.
- code :500	
An unexpected condition was encountered.


 ## POST/login
Logs in a registered user to get a new JWT generated.
### Request URL
https://cscloud6-82.lnu.se/auction/users/login
### Parameters
No parameters

### Request body

- application/json
- Example Value
 - Schema `
{
  "username": "en999zz",
  "password": "5up3rs3cr3tp@55w0rd"
} `

### Responses
- Code	200	:
 The request has been fulfilled, resulting in a generated JWT.
- links :
    - self : current item.
    - articles : URL to handel articles resource
    - webhook : URL to handel webhooks 
    -  bidding : URL to handel biddings 
### Media type

- application/json

- Example Value
 - Schema
{
  "access-token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI..."
}
### Errors
- 401	
Credentials invalid or not provided.

- 500	
An unexpected condition was encountered.

## Article
#### Request URL
https://cscloud6-82.lnu.se/auction/articles

 ### 1- GET/articles
 Gets a list of all articles 

#### Parameters
No parameters
#### query
- number of the page (number page = 1 default)
- query to filter the result according the attributes 
    - example :
https://cscloud6-82.lnu.se/auction/articles?type=artwork
#### Responses
- Code 200	
Successful operation.
- links
     - self : the current resources.
     - next : the next page (next 10 items)
     - pervious : pervious page (pervious 10 items)
     - create : url to add a new bidding.
#### Errors
500	:
An unexpected condition was encountered.

### 2- POST/articles

Creates a new article owned by the authenticated user.

#### Parameters
No parameters

#### Request body

application/json
- Example Value
     - Schema `
{
  {
    "description":   "very old but very unique",
    "title":"sofa",
    "city":"Karlstad",
    "type":"antique"  ,
    "images" : ["+vXH9K0drW7kzu7tbo67SLeO1EjIN3mkOzdyffP5f5zWm8heaJo1ACklu2QR/jg/hVC2miSARZ3vjJIqwlxGhfIUbTg89f8APH51....."] 
}
}
`
#### Responses
Code :201	
  The request has been fulfilled, resulting in the creation of a new article.
#### errors
- 400	: The request cannot or will not be processed due to something that is perceived to be a client error (for example, validation error).

- 401 :	 Access token invalid or not provided.

- 500	
An unexpected condition was encountered.

### 3- GET/articles/{id}
Get single article

#### Parameters
- id :
The ID of the article.

#### Responses
- Code	:200 
Returns an specific article.
- links :
    - self : current item.
    - delete : URL to delete the current item
    - update : url to modify totally the item  
    - modify :  URL to modify partially the item 
#### Errors

- 404	:
The requested article  was not found.

- 500	 :
An unexpected condition was encountered.

### 4-PUT/articles/{id}

Updates an existing article.

#### Parameters
- id :
The ID of the article.

#### Request body

- application/json
- Example Value
  - Schema
- Schema `
{
  {
    "description":   "car",
    "title":"car",
    "city":"Karlstad",
    "type":"vehicle"  ,
    "images" : ["+vXH9K0drW7kzu7tbo67SLeO1EjIN3mkOzdyffP5f5zWm8heaJo1ACklu2QR/jg/hVC2miSARZ3vjJIqwlxGhfIUbTg89f8APH51....."] 
}
}
`
#### Responses
- Code : 200	
The server successfully processed the request and is not returning any content.
- links :
    - self : current item.
    - delete : URL to delete the current item
    - modify : url to modify partially the item  
    - allArticles :  URL to all items 
#### errors 
- 400 :	
The request cannot or will not be processed due to something that is perceived to be a client error (for example, validation error).

- 401	:
Access token invalid or not provided.

- 403	:
The request contained valid data and was understood by the server, but the server is refusing action due to the authenticated user not having the necessary permissions for the article.

- 404  :	
The requested resource was not found.

- 500  :	
An unexpected condition was encountered.

### 5-PATCH/articles/{id}
Partially updates an existing article.

#### Parameters
id  :
The ID of the article.

#### Request body

- application/json
  - Example Value
     - Schema `
{
  "description": "very nice picture"
}`

#### Responses
- Code:	200	
The server successfully processed the request and is not returning any content.
- links :
    - self : current item.
    - delete : URL to delete the current item
    - update : url to modify totally the item  
    - allArticles :  URL to all items 

#### Errors
- 400	:
The request cannot or will not be processed due to something that is perceived to be a client error (for example, validation error).

- 401	:
Access token invalid or not provided.

- 403 :	
The request contained valid data and was understood by the server, but the server is refusing action due to the authenticated user not having the necessary permissions for the resource.

- 404	:
The requested resource was not found.

500	
An unexpected condition was encountered.
### 6-DELETE/articles/{id}

Delete an article.

#### Parameters
id :
The ID of the article.

#### Responses
- Code	:204	
   - The server successfully processed the request and is not returning any content.

#### Errors
- 401 :	
Access token invalid or not provided.
- 403	 :
The request contained valid data and was understood by the server, but the server is refusing action due to the authenticated user not having the necessary permissions for the resource.

- 404 :	
The requested resource was not found.
- 500	:
An unexpected condition was encountered.

## Bidding
#### Request URL
https://cscloud6-82.lnu.se/auction/biddings

 ### 1- GET/biddings
 Gets a list of all biddings 

#### Parameters
No parameters
#### query
- number of the page (number page = 1 default)
- query to filter the result according the attributes 
    - example :
https://cscloud6-82.lnu.se/auction/biddings?bidderName=manar
#### Responses
- Code 200	
Successful operation.
- links
     - self : the current resources.
     - next : the next page (next 10 items)
     - pervious : pervious page (pervious 10 items)
     - create : url to add a new bidding.
  
#### Errors
500	:
An unexpected condition was encountered.

### 2- POST/biddings

Creates a new bidding owned by the authenticated user.

#### Parameters
No parameters

#### Request body

application/json
- Example Value
     - Schema `
{
  {
    "price": 34  ,
    "articleId":"87656789jhg5678",
   
}
}
`
#### Responses
- Code :201	
  The request has been fulfilled, resulting in the creation of a new bidding.
  - links :
     - self  : URL to the new item.
#### errors
- 400	: The request cannot or will not be processed due to something that is perceived to be a client error (for example, validation error).

- 401 :	 Access token invalid or not provided.

- 500	
An unexpected condition was encountered.

###  3- GET/biddings/{id}
Get single bidding

#### Parameters
- id :
The ID of the bidding .

#### Responses
- Code	:200 
Returns an specific bidding.
- links :
    - self : current item.
    - delete : URL to delete the current item
    - update : url to modify totally the item  
    - modify :  URL to modify partially the item 
#### Errors
- 404	:
The requested bidding  was not found.

- 500	 :
An unexpected condition was encountered.


## webhook
#### Request URL
https://cscloud6-82.lnu.se/auction/webhooks

 ### 1- GET/webhooks
 Gets a list of all webhooks 

#### Parameters
No parameters

#### Responses
- Code 200	
Successful operation.
- links
     - self : the current resources.
     - create : url to add a new bidding.
#### Errors
500	:
An unexpected condition was encountered.

### 2- POST/webhooks

Creates a new webhook owned by the authenticated user.

#### Parameters
No parameters

#### Request body

application/json
- Example Value
     - Schema `
{
  {
    "url" :"https//:webhook.se"
}
}
`
#### Responses
- Code :201	
  The request has been fulfilled, resulting in the creation of a new webhook.
- links :
    - self : current item.
    - delete : URL to delete the current item
    - update : url to modify totally the item  
    - modify :  URL to modify partially the item 
#### errors
- 400	: The request cannot or will not be processed due to something that is perceived to be a client error (for example, validation error).

- 401 :	 Access token invalid or not provided.

- 500	
An unexpected condition was encountered.

### 3-DELETE/webhooks/{id}

Delete an webhook.

#### Parameters
id :
The ID of the webhooks.

#### Responses
- Code	:204	
   - The server successfully processed the request and is not returning any content.

#### Errors
- 401 :	
Access token invalid or not provided.
- 403	 :
The request contained valid data and was understood by the server, but the server is refusing action due to the authenticated user not having the necessary permissions for the resource.

- 404 :	
The requested resource was not found.
- 500	:
An unexpected condition was encountered.
