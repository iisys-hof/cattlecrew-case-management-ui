# Case Management UI

This is a fork of the [CattleCrew Case Management UI](https://github.com/opitzconsulting/cattlecrew-case-management-ui) with some changes and additional features for our research project [Social Collaboration Hub](https://www.sc-hub.de/).

## About

The CattleCrew Case Management UI provides an interface to interact with CMMN 1.1 models in the camunda BPM platform via REST. It is development with [AngularJS](https://angularjs.org/) and uses [Grunt](http://gruntjs.com/) as build tool.

Additional features in this fork:
* **Look and feel** like Camunda Cockpit v7.4
* Changed navigation
* **Tasklist** with all case tasks of a given user (usually the logged in user). Uses polling.
* **UserService** to enrich tasks and cases with fullnames and other (remote) user data.
** Connection to our [Apache Shindig](https://shindig.apache.org/) users + caching.
** Possibility to implement your own UserService connection.
* **Claim task** (and unclaim)
* **Assign task** (with autocompletion for users in remote directory)


## Install
* Download this git repository.
* You need npm. Get it here: https://nodejs.org/en/download/
* Install bower (globally)
```
npm install -g bower
```
* Install grunt and grunt-cli (globally)
```
npm install -g grunt grunt-cli
```
* Go to the root of the project and install the webapp
```
npm install
bower install
grunt
```

For further documentation see the original Cattlecrew Case Management UI [on Github](https://github.com/opitzconsulting/cattlecrew-case-management-ui).

## Run
```
grunt serve
```
The webapp is available at [http://localhost:9000](http://localhost:9000)

## Libraries

### Autocompletion

For autocompletion this [angucomplete-alt](https://github.com/ghiden/angucomplete-alt) is used.
* Where: `app/scripts/directives/angucomplete-alt.min.js`
* License: The MIT License

## License

Licensed under the [MIT license](./LICENSE).
