var shell = require('shelljs');
var fs = require('fs');
var chalk = require('chalk');
var emoji = require('node-emoji');
var path = require('path');

var enviroment = process.env.npm_package_config_enviroment;

var serverurl = 'http://' + process.env.npm_package_config_server + ":" + process.env.npm_package_config_port;

process.stdout.write(chalk.gray(emoji.emojify('[  ] Build Wordpress Enviroment (' + enviroment + ")")) + "\n");

shell.cd('server/');

fs.readFile('.env.dist', 'utf8', function (error,data) {

  if (error) {
    process.stderr.write(chalk.gray(error.message+"\n"));
    process.stderr.write(chalk.bgRed.white(emoji.emojify("[:heavy_multiplication_x: ] Errore in lettura .env.dist")) + "\n");
    process.exit(1);
  }

  var result = data.replace(/##SERVERURL##/g, serverurl);

  if ( enviroment === 'dev' ){
    result = result.replace(/##DBHOST##/g, '127.0.0.1');
    result = result.replace(/##DBNAME##/g, 'wordpress_dev');
    result = result.replace(/##PASSWORD##/g, 'wordpress_dev');
    result = result.replace(/##USERNAME##/g, 'wordpress_dev');
    result = result.replace(/##ENVIROMENT##/g, 'development');
  } else {
    // STAGING / PROD
    if (
      !process.env.npm_package_config_database_dbhost ||
      !process.env.npm_package_config_database_dbname ||
      !process.env.npm_package_config_database_password ||
      !process.env.npm_package_config_database_username
    ) {
      process.stderr.write(chalk.bgRed.white(emoji.emojify("[:heavy_multiplication_x: ] Errore manca la configurazione in .npmrc")) + "\n");
      process.exit(1);
    }

    result = result.replace(/##DBHOST##/g, process.env.npm_package_config_database_dbhost);
    result = result.replace(/##DBNAME##/g, process.env.npm_package_config_database_dbname);
    result = result.replace(/##PASSWORD##/g, process.env.npm_package_config_database_password);
    result = result.replace(/##USERNAME##/g, process.env.npm_package_config_database_username);
    result = result.replace(/##ENVIROMENT##/g, 'staging'); //production

  }


  fs.writeFile('.env', result, 'utf8', function (error) {
     if (error) {
       process.stderr.write(chalk.gray(error.message+"\n"));
       process.stderr.write(chalk.bgRed.white(emoji.emojify("[:heavy_multiplication_x: ] Errore in scrittura .env")) + "\n");
       process.exit(1);
     }
     process.stdout.write(chalk.bgGreen.black(emoji.emojify('[:heavy_check_mark: ] Wordpress ok!'))+ "\n");
  });
});
