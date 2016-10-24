var shell = require('shelljs');
var fs = require('fs');
var chalk = require('chalk');
var emoji = require('node-emoji');
var path = require('path');


if (fs.existsSync('./scripts/server.pid')) {

  var pid = fs.readFileSync('./scripts/server.pid', { encoding:'utf8' });

  var enviroment = process.env.npm_package_config_enviroment;
  var port = process.env.npm_package_config_port;
  var serverurl = 'http://' + process.env.npm_package_config_server + ":" + port;

  process.stdout.write(chalk.gray(emoji.emojify('[  ] Stop Wordpress Server (' + serverurl + ")")) + "\n");

  stopServer = shell.exec('kill '+pid,{silent:true});

  if ( stopServer.code !== 0 ){
    process.stderr.write(chalk.gray(stopServer.stdout+"\n"));
    process.stderr.write(chalk.red(stopServer.stderr+"\n"));
    process.stderr.write(chalk.bgRed.white(emoji.emojify("[:heavy_multiplication_x: ] Errore stopping server with pid "+pid)) + "\n");
    process.exit(1);
  }

  fs.unlinkSync('./scripts/server.pid');

  process.stdout.write(chalk.bgGreen.black(emoji.emojify('[:heavy_check_mark: ] Wordpress server STOP.!'))+ "\n");

} else {
  process.stdout.write(chalk.yellow(emoji.emojify("[:raised_hand: ] server already stopped.")) + "\n");
}
