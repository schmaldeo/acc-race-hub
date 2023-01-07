# Deploying a free MongoDB Atlas cluster

## IMPORTANT: This is a free, shared cluster that might not have the best performance (it's good enough if there isn't a lot of users making queries at the same time), as well as **you can't make backups**, so it's better to [self-host MongoDB](https://www.mongodb.com/docs/manual/installation/#mongodb-community-edition-installation-tutorials) or get a paid cluster (in step 3 od this tutorial choose _Dedicated_ instead of _Shared_)

1. Create an account at <https://mongodb.com/>
1. After the signup, click on _[Build a Database](https://i.imgur.com/m2rUAJ6.png)_
1. Choose _Shared_
1. Choose any of the free options that suit you the most (you're fine with leaving them on default)
1. Follow the instructions in the _Security quickstart_

- Add the IP address which you will upload race results from, as well as server's IP address (if you're using Render, open your web servicein the dashboard, click on _Connect_ in top right corner, click on _Outbound_ and add all the IP addresses listed here)
- If you want to allow all the connections, add `0.0.0.0/0` (**NOT RECOMMENDED**)

1. Go to _Deployment_ > _Database_, click _Connect_ on your cluster, then _Connect your application_, select Node.js, copy the connection URI and set the `MONGO_URI` variable in the `.env` file in `server` directory to it (**Remember to set the username and password in the URI**)
