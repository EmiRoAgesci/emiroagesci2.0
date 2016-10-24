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

     process.stdout.write(chalk.gray(emoji.emojify('[  ] Composer update')) + "\n");

     setupComposer = shell.exec('composer update',{silent:true});

     if ( setupComposer.code !== 0 ){
       process.stderr.write(chalk.gray(setupComposer.stdout+"\n"));
       process.stderr.write(chalk.red(setupComposer.stderr+"\n"));
       process.stderr.write(chalk.bgRed.white(emoji.emojify("[:heavy_multiplication_x: ] Errore update composer")) + "\n");
       process.exit(1);
     }

     process.stdout.write(chalk.gray(emoji.emojify('[  ] Check wp install')) + "\n");

     check = shell.exec('./wp-content/vendor/wp-cli/wp-cli/bin/wp core is-installed');
     if ( check.code !== 0 ){
       process.stdout.write(chalk.yellow(emoji.emojify("[:raised_hand: ] wp non installed.")) + "\n");
       process.stdout.write(chalk.gray(emoji.emojify('[  ] wp install')) + "\n");

       installWp = shell.exec('./wp-content/vendor/wp-cli/wp-cli/bin/wp core install --url='+process.env.npm_package_config_server+' --title="Develop EmiroAgesci Theme" --admin_user=admin --admin_password=admin --admin_email=webmaster@emiro.agesci.it --skip-email',{silent:true});

       if ( installWp.code !== 0 ){
         process.stderr.write(chalk.gray(installWp.stdout+"\n"));
         process.stderr.write(chalk.red(installWp.stderr+"\n"));
         process.stderr.write(chalk.bgRed.white(emoji.emojify("[:heavy_multiplication_x: ] Errore install wp")) + "\n");
         process.exit(1);
       }
     }

     enablePlugin = shell.exec('./wp-content/vendor/wp-cli/wp-cli/bin/wp plugin activate --all',{silent:true});
     if ( enablePlugin.code !== 0 ){
       process.stderr.write(chalk.gray(enablePlugin.stdout+"\n"));
       process.stderr.write(chalk.red(enablePlugin.stderr+"\n"));
       process.stdout.write(chalk.yellow(emoji.emojify("[:raised_hand: ] wp cannot load plugin.")) + "\n");
     }

     process.stdout.write(chalk.bgGreen.black(emoji.emojify('[:heavy_check_mark: ] Wordpress ok!'))+ "\n");

  });

});
