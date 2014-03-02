'use strict';

var utils = require('gebo-server')(__dirname + '/..').utils;

module.exports = function (email) {

    // Turn the email into a mongo-friendly database name
    var dbName = utils.ensureDbName(email);

    var mongoose = require('mongoose');

    /**
     *  Database config
     */
    var uristring =
            process.env.MONGOLAB_URI ||
            process.env.MONGOHQ_URL ||
            'mongodb://localhost/' + dbName;

    var mongoOptions = { db: { safe: true } };

    /**
     * Connect to mongo
     */
    var connection = mongoose.createConnection(uristring, mongoOptions);

    connection.on('open', function() {
        console.log ('Successfully connected to: ' + uristring);
      });

    connection.on('error', function(err) {
        console.log ('ERROR connecting to: ' + uristring + '. ' + err);
      });

    exports.connection = connection;

    var Schema = mongoose.Schema,
        ObjectId = Schema.Types.ObjectId;

    /**
     * drugProductSchema 
     */
    var drugProductSchema = new Schema({
        drug_product_id: { type: Number, required: true, unique: true },
        drugname: { type: String, required: true },
      });

    // Export drugProduct model
    try {
        var drugProductModel = connection.model('drug_product', drugProductSchema);
        exports.drugProductModel = drugProductModel;
    }
    catch (error) {}

    /**
     * drugProductIngredientsSchema 
     */
    var drugProductIngredientsSchema = new Schema({
        drug_product_ingredient_id: { type: Number, required: true, unique: true },
        drug_product_id: { type: Number, required: true, unique: true },
        drugname: { type: String, required: true },
        active_ingredient_id: { type: Number, required: true, unique: true },
        active_ingredient_name: { type: String, required: true, unique: true },
      });

    // Export drugProductIngredientsModel
    try {
        var drugProductIngredientsModel = connection.model('drug_product_ingredients', drugProductIngredientsSchema);
        exports.drugProductIngredientsModel = drugProductIngredientsModel;
    }
    catch (error) {}

    /**
     * reportDrugSchema 
     */
    var reportDrugSchema = new Schema({
        report_drug_identifier: { type: Number, required: true, unique: true },
        report_id: { type: Number },
        drug_product_id: { type: Number },
        drugname: { type: String },
        druginvolv_eng: { type: String },
        druginvolv_fr: { type: String },
        routeadmin_eng: { type: String },
        routeadmin_fr: { type: String },
        unit_does_qty: { type: Number },
        dose_unit_eng: { type: String },
        dose_unit_fr: { type: String },
        frequency: { type: Number },
        freq_time: { type: Number },
        frequency_time_eng: { type: String },
        frequency_time_fr: { type: String },
        freq_time_unit_eng: { type: String },
        freq_time_unit_fr: { type: String },
        therapy_duration: { type: Number },
        therapy_duration_unit_eng: { type: String },
        therapy_duration_unit_fr: { type: String },
        dosageform_eng: { type: String },
        dosageform_fr: { type: String },
      });

    // Export reportDrugModel
    try {
        var reportDrugModel = connection.model('report_drug', reportDrugSchema);
        exports.reportDrugModel = reportDrugModel;
    }
    catch (error) {}

    /**
     * reportSchema 
     */
    var reportSchema = new Schema({
        report_id: { type: Number, required: true, unique: true },
        report_no: { type: String, required: true, unique: true },
        version_no: { type: Number, required: true, unique: true },
        datreceived: { type: String }, // Date
        datintreceived: { type: String }, // Date
        mah_no: { type: String },
        report_type_code: { type: String },
        report_type_eng: { type: String },
        report_type_fr: { type: String },
        gender_code: { type: String },
        gender_eng: { type: Number },
        gender_fr: { type: String },
        age: { type: Number },
        age_y: { type: Number },
        age_unit_eng: { type: String },
        age_unit_fr: { type: String },
        outcome_code: { type: String },
        outcome_eng: { type: String },
        outcome_fr: { type: String },
        weight: { type: Number },
        weight_unit_eng: { type: String },
        weight_unit_fr: { type: String },
        height: { type: Number },
        height_unit_eng: { type: String },
        height_unit_fr: { type: String },
        seriousness_code: { type: String },
        seriousness_eng: { type: String },
        seriousness_fr: { type: String },
        death: { type: String },
        disability: { type: String },
        congenital_anomaly: { type: String },
        life_threatening: { type: String },
        hosp_required: { type: String },
        other_medically_imp_cond: { type: String },
        reporter_type_eng: { type: String },
        reporter_type_fr: { type: String },
        source_code: { type: String },
        source_eng: { type: String },
        source_fr: { type: String },
      });

    // Export reportModel
    try {
        var reportModel = connection.model('report', reportSchema);
        exports.reportModel = reportModel;
    }
    catch (error) {}

    /**
     * reactionSchema 
     */
    var reactionSchema = new Schema({
        reaction_id: { type: Number, required: true, unique: true },
        report_id: { type: Number },
        duration: { type: Number },
        duration_unit_eng: { type: String },
        duration_unit_fr: { type: String },
        pt_name_eng: { type: String },
        pt_name_fr: { type: String },
        soc_name_eng: { type: String },
        soc_name_fr: { type: String },
        meddra_version: { type: String },
      });

    // Export reactionModel
    try {
        var reactionModel = connection.model('reactions', reactionSchema);
        exports.reactionModel = reactionModel;
    }
    catch (error) {}


    return exports;
  };

