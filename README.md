# transactions-assignment Flow

# Start node project 
  npm install && npm start

# To Test APIs, navigate to explorer
 http://localhost:3000/explorer/

# Available API Endpoints: 
1. POST /login/ 
Login with an Email returns an accountId

3. POST /transactions/
Create Transaction (credit or bebit with an amount for an account)

6. GET /transactions/
List All Transactions by account id

8. GET /accounts/{id}/balance
Get Current Account Balance  

10. GET /transactions/{uuid}
Get specific transaction by uuid

# Error Code:
1. 403 for Insufficient Balance 
2. 409 for transaction is in progress

[![LoopBack](https://github.com/strongloop/loopback-next/raw/master/docs/site/imgs/branding/Powered-by-LoopBack-Badge-(blue)-@2x.png)](http://loopback.io/)
