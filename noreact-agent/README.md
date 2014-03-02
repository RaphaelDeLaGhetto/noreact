# noreact-agent

Easily search records of reactions to food and drugs

## Setup

### your database (MongoDB)

Install MongoDB on your system, if you haven't already:

* [http://docs.mongodb.org/manual/installation/](http://docs.mongodb.org/manual/installation/)

Start MongoDB by executing this at the command line:

```
$ sudo service mongodb start
```

### your server

First, install your npm modules:

```
$ sudo npm install
```

Then, install your UI dependencies:

```
$ bower install
```

# Seed the database
This inserts a couple of test users into your database to confirm that authentication is working.

```
$ grunt dbseed
```

When you want to start adding your own users, you can erase the existing database like this:

```
$ grunt dbdrop
```

# Run your server

```
$ node server.js
```

## License
Copyright (c) 2014 Daniel Bidulock, Yanfen Hao, Briana Thayne, Mike Roberts
