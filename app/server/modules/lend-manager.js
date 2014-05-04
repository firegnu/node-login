/**
 * Created by Administrator on 2014/5/4.
 */
var crypto 		= require('crypto');
var moment 		= require('moment');
var Schema = require('jugglingdb').Schema;
var schema = new Schema('mysql', {
    database: 'giswebcms',
    username: 'root',
    password: '000128'
});

var lend = schema.define('lend', {
    id: Number,
    username: String,
    lenddate: String,
    lendfile: String
});

exports.addNewLendRecord = function(newData, callback){
    lend.create(newData, callback);
};

exports.getAllRecords = function(username, callback) {
    lend.all({where:{username:username}} ,function(e, res) {
        if (e) callback(e)
        else callback(null, res)
    });
};