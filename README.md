 #Auction API 
   ## Documentation
   [documentation file](documentation.md)
   ## Testing 

 [test folder](1-postman-collection/)

  - Within the "postman collection" folder, there is a Postman collection that includes a global variable. This variable allows the collection to be executed successfully.
- To add articles and webhooks, I utilized a token from an existing user. However, to add bids, I used a token from a new user who will be registered within the collection.
- The global variable "articleId" was employed for the (delete- put- patch) methods of the article. Similarly, the global variable "webhookId" was used for the (delete) method of the webhook.
- When the collection run more than once, the registration request will return an error (duplicate username and email)