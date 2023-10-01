# CS Support
CS Support is a platform designed to support computer science students by providing access to resources, facilitating discussions, and fostering collaboration within the community.

<img style="border-radius: 50%;"  src="https://scontent.fcnx2-1.fna.fbcdn.net/v/t1.15752-9/385483987_1302502370638949_2916699704408873712_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=ae9488&_nc_ohc=Aa6C_azaRiwAX8h2yWz&_nc_ht=scontent.fcnx2-1.fna&oh=03_AdTplLZEWjFN_VsNatOjzgY36LCCWPhxtATBFw81QYPX6g&oe=6540A410" width="220" height="150" /><be>

<img style="border-radius: 50%;"  src="https://media.discordapp.net/attachments/1016724036274892822/1158004269480415262/379636246_978650119892322_5335105759179136356_n.jpg?ex=651aab04&is=65195984&hm=b92185045dbde68109ef2795829ffdbb052ab3ec5c23626f19945ba64278acea&=&width=318&height=676"  /><br>

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Report an issue:** Report the issue that has occured in your distinct environment in order to let the admin/manager acknowledged the problem.
- **Tracking:** Track the status of the issue/problem that has been reported to the bot.
- **Cost Evaluation:** Built in material cost evaluation that is used for fixing/maintenance the problem/issue.
- **Notifications:** Stay informed with updates on the reported issue.

## Getting Started

### Installation

1. Clone the repository:

   ```shell
   git clone https://github.com/Codezilla-CMU/CSSupport.git
Don't forget to **extract** the .zip file.

2. For the next step, you need to import the code to **Google App Script**, in order to deploy the code through the server for usage.
   

## Usage

- **Add CSSupport:** Add CSSupport bot through the provided QR Code below:
    [CSSupport QR Code](link_to_logo_image)
- **Rich Menu:** Browse the specific function in the rich menu.
- **Report:** Report the issue through the bot.

## Contributing

We welcome contributions from the community. If you'd like to contribute to this project, please follow these steps:

1. Fork the repository on GitHub.
2. Clone your forked repository to your local machine.
3. Create a new branch for your feature or bug fix.
4. Make your changes and commit them with descriptive messages.
5. Push your changes to your forked repository.
6. Submit a pull request to the main repository, explaining your changes and why they should be merged.

Please follow our [Contribution Guidelines](CONTRIBUTING.md) for more details.

## License

This project is licensed under the MIT License. See the [LICENSE.md](LICENSE.md) file for details.



   


## Deployment

To deploy this project

```bash
  RUN/DEPLOY through Google App Script
```
## Set-Up Apps Script

**Step 1:** Open the Apps Script in Google Workspace and add `Status`, `Repair`, and `Regfixer` to the Apps Script. These files establish connections between Line and MongoDB.

- `Status` is used to display the status of users and fixers.
- `Repair` is used for user repair requests.
- `Regfixer` is used for registering or adding repair technicians.

**Step 2:** Add Files - `status.html`, `regfixer.html`, `repair.html`

These files serve to retrieve user information from Line LIFE:

- `status.html` is used to link to the Status page on Line.
- `regfixer.html` is used to link to the Repair page on Line.
- `repair.html` is used to link to the Regfixer page on Line.

  <img style="border-radius: 50%;"  src="https://media.discordapp.net/attachments/1016724036274892822/1157977399351328828/image.png?ex=651a91fe&is=6519407e&hm=6de2a5b5a88fbfad64051c55b1134b33c28c63f25a4e81bcf0dfbbb7b2b5ea83&=&width=754&height=676" width="300" height="200" /><br>

**Step 3:** Use "drive-to-web" to create an HTML link and paste it into Line LIFE for accessing websites through Line.

drive-to-web Link: [https://api.drv.tw/~reidcout.004@gmail.com/gd/?a=admin#authed=1](https://api.drv.tw/~reidcout.004@gmail.com/gd/?a=admin#authed=1)

*To access the websites through Line, use the following links:<br>

<img style="border-radius: 50%;"  src="https://media.discordapp.net/attachments/1016724036274892822/1157971959561343026/image.png?ex=651a8ced&is=65193b6d&hm=a4e0291b0f92a3d47f1accd8313948bbe5a2f5bac553258b72fb8fa3f3bf111c&=&width=1440&height=632" width="300" height="200" /><br>

*paste it into Line LIFE for accessing websites through Line, at the endpoint<br>

<img style="border-radius: 50%;"  src="https://media.discordapp.net/attachments/1016724036274892822/1157978769471057950/image.png?ex=651a9344&is=651941c4&hm=f20d2749e89705917764f3f7b958e8ae84f64dc35b716dfe17a771a15e6b624b&=&width=1042&height=676" width="300" height="200" /><br>

## Set-Up MongoDB

## Getting Started with MongoDB HTTP Endpoint ##

## Prerequisites ##

Before you begin, make sure you have the following prerequisites in place:

1. **MongoDB Atlas Account**: Sign up for or log in to your MongoDB Atlas account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).

2. **MongoDB Cluster**: Create a MongoDB cluster in your Atlas account if you haven't already.

3. **Database & Collection**: Set up a database name and collection within your MongoDB cluster to store your data.

**Step 1:** Access the MongoDB Atlas Dashboard

1. Log in to your MongoDB Atlas account.

2. In the Atlas dashboard, select the project and cluster where you want to enable the HTTP endpoint.

**Step 2:** Enable the HTTP Endpoint 

1. In the cluster view, click on "Database Access" in the left sidebar.

2. Click the "Add New Database User" button to create a database user with the necessary permissions. Make sure to remember the username and password for this user.

3. Next, click on "Network Access" in the left sidebar and add your current IP address to the IP Whitelist. This allows your current IP to access the cluster.

4. Once the IP is added, go back to the cluster view and click on "Database Access" again. Edit the user you created earlier and assign the appropriate role, such as "Atlas Admin" or "Read and Write to Any Database."

**Step 3:** Configure the HTTP Endpoint 

1. In the cluster view, click on "Connect" at the top of the screen.

2. Click on the "Connect with MongoDB Compass" button.

3. Follow the instructions to download and install MongoDB Compass, if you haven't already.

4. Open MongoDB Compass and click on "Fill in connection fields individually."

5. Enter the following details:
   - **Hostname**: Found in the MongoDB Atlas cluster view.
   - **Port**: 27017
   - **Authentication**: Select "Username / Password" and enter the database user credentials you created in Step 2.

6. Click "Connect" to establish a connection to your MongoDB cluster.

**Step 4:** Access Data via HTTP 

1. Once you have connected to your MongoDB cluster using MongoDB Compass, you can access your data via the HTTP endpoint.
   
2. To use the code in our project you must to add 9 of method POST HTTP endpoint with following route.
   
3. In each route have to enabled on Respond With Result.
   
4. In each route have function to link in. It also have to include below code.
   
5. In each function setting have to set Authentication to System.

  - /sheet2mongo/insert
    
    ```bash
      exports = function(payload) {
      const mongodb = context.services.get('mongodb-atlas');
      const col = JSON.parse(payload.body.text()).header;
      const collection = mongodb.db("Your Database Name").collection(col);
      query = JSON.parse(payload.body.text()).query;
  
      return collection.insertOne(query);}
    ```
  - /sheet2mongo/insertDate

    ```bash
      exports = function(payload) {
      const mongodb = context.services.get('mongodb-atlas');
      const col = JSON.parse(payload.body.text()).header;
      const collection = mongodb.db("Your Database Name").collection(col);
      query = JSON.parse(payload.body.text()).query;
      query.receiveDate = new Date(query.receiveDate);
    
      return collection.insertOne(query);}
    ```
  - /sheet2mongo/find

    ```bash
      exports = function(payload) {
      const mongodb = context.services.get('mongodb-atlas');
      const col = JSON.parse(payload.body.text()).header;
      const collection = mongodb.db("Your Database Name").collection(col);
      query = JSON.parse(payload.body.text()).query;
    
      return collection.find(query).toArray();}
    ```
  - /sheet2mongo/findDate

    ```bash
      exports = function(payload) {
      const mongodb = context.services.get('mongodb-atlas');
      const col = JSON.parse(payload.body.text()).header;
      const collection = mongodb.db("Your Database Name").collection(col);
      query = JSON.parse(payload.body.text()).query;
    
      return collection.find({
      $and: [
        { receiveDate: { $gte: new Date(query.sDate) } },
        { receiveDate: { $lte: new Date(query.eDate) } }
        ]
      }).toArray();}
    ```
  - /sheet2mongo/updateSet

    ```bash
      exports = function(payload) {
      const mongodb = context.services.get('mongodb-atlas');
      const col = JSON.parse(payload.body.text()).header;
      const collection = mongodb.db("Your Database Name").collection(col);
      filter = JSON.parse(payload.body.text()).filter;
      query = JSON.parse(payload.body.text()).query;
      
      return collection.updateOne(filter,{$set:query}); }
    ```
  - /sheet2mongo/updatePush

    ```bash
      exports = function(payload) {
      const mongodb = context.services.get('mongodb-atlas');
      const col = JSON.parse(payload.body.text()).header;
      const collection = mongodb.db("Your Database Name").collection(col);
      filter = JSON.parse(payload.body.text()).filter;
      query = JSON.parse(payload.body.text()).query;
      
      return collection.updateOne(filter,{$push:query});}
    ```
  - /sheet2mongo/updatePull

    ```bash
      exports = function(payload) {
      const mongodb = context.services.get('mongodb-atlas');
      const col = JSON.parse(payload.body.text()).header;
      const collection = mongodb.db("Your Database Name").collection(col);
      filter = JSON.parse(payload.body.text()).filter;
      query = JSON.parse(payload.body.text()).query;
      
      return collection.updateOne(filter,{$pull:query});}
    ```
  - /sheet2mongo/updateDate

    ```bash
      exports = function(payload) {
      const mongodb = context.services.get('mongodb-atlas');
      const col = JSON.parse(payload.body.text()).header;
      const collection = mongodb.db("Your Database Name").collection(col);
      filter = JSON.parse(payload.body.text()).filter;
      query = JSON.parse(payload.body.text()).query;
      query.finishDate = new Date(query.finishDate);
      
      return collection.updateOne(filter,{$set:query});}
    ```
  - /sheet2mongo/remove

    ```bash
      exports = function(payload) {
      const mongodb = context.services.get('mongodb-atlas');
      const col = JSON.parse(payload.body.text()).header;
      const collection = mongodb.db("Your Database Name").collection(col);
      query = JSON.parse(payload.body.text()).query;
    
      return collection.deleteOne(query);}
    ```

## 🛠 Skills
- Programming Language: HTML, JavaScript, CSS
- Extensive skills/tools: Line OA,Line Developers,MongoDB, Google Sheets



## Authors

- [@nakarinnn](https://www.github.com/nakarinnn)
- [@neskinggoblin](https://www.github.com/neskinggoblin)
- [@flukexp](https://www.github.com/flukexp)
- [@Tomu1572](https://www.github.com/Tomu1572)
- [@nmolpoom10788](https://www.github.com/nmolpoom10788)
- [@Guit4r](https://www.github.com/Guit4r)
- [@nonnychan](https://www.github.com/nonnychan)




