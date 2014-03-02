'use strict';
var q = require('q'),
    utils = require('gebo-utils');

module.exports = function(gebo) {

    /**
     * Search the dataset for the terms given
     *
     * @params Object
     * @params Object
     *
     * @return promise
     */
    var _search  = function(verified, message) {
        var deferred = q.defer();

        var data = {};

        // Is the sending agent a gebo administrator or someone
        // permitted to read the collection stored in the database?
        if (verified.admin || verified.read) {
          var drugDb = new gebo.schemata.noreactAgent(verified.dbName);
          drugDb.drugProductIngredientsModel.find({
                    drugname: new RegExp(message.content.terms, 'i')
            }, function(err, drugs) {
                if (err) {
                  deferred.reject(err);
                }
 
                data['active_ingredients'] = [];
                data['brand_names'] = [];
                var drugProductIds = [];
                drugs.forEach(function(drug) {
                    // active_ingredients
                    if (data.active_ingredients.indexOf(drug.active_ingredient_name) === -1) {
                      data.active_ingredients.push(drug.active_ingredient_name);
                    }
                    // brand_names
                    if (data.active_ingredients.indexOf(drug.drugname) === -1) {
                      data.brand_names.push(drug.drugname);
                    }

                    // drug_product_ids
                    if (drugProductIds.indexOf(drug.drug_product_id) === -1) {
                      drugProductIds.push(drug.drug_product_id);
                    }

                  });

                var reportIds = [];
                drugDb.reportDrugModel.find({ drug_product_id: { $in: drugProductIds }},
                                { report_id: 1, _id: 0 }, function(err, drugReports) {
                    if (err) {
                      deferred.reject(err);
                    }

                    for (var key in drugReports) {
                      if (reportIds.indexOf(drugReports[key].report_id) === -1) {
                        reportIds.push(drugReports[key].report_id);
                      }
                    }
                    //data.report_drug = reportIds;
                    //data.total_reports = reportIds.length;

                    drugDb.reportModel.find({ report_id: { $in: reportIds }},
                            { gender_fr: 1, gender_eng: 1 }, function(err, reports) {
                        if (err) {
                          deferred.reject(err);
                        }

                        data.men = 0;
                        data.women = 0;
                        data.gender_unknown = 0;
                        for (var key in reports) {
                          if (reports[key].gender_fr === 'Homme' || reports[key].gender_eng === 'Male') {
                            data.men++;
                          } 
                          else if (reports[key].gender_fr === 'Femme' || reports[key].gender_eng === 'Female') {
                            data.women++;
                          }
                          else {
                            data.gender_unknown++;
                          }
                        }

                        data.total_reports = reports.length;

                        drugDb.reactionModel.find({ report_id: { $in: reportIds }}, function(err, reactions) {
                            if (err) {
                              deferred.reject(err);
                            }

                            //data.reactions = {};
                            data.reactions = [];
                            for (var key in reactions) {
                              var i = utils.getIndexOfObject(data.reactions, 'reaction_name', reactions[key].pt_name_fr); 
                              if (i === -1) {
                                data.reactions.push({ reaction_name: reactions[key].pt_name_fr, num_occur: 1});
                              }
                              else {
                                data.reactions[i].num_occur++;
                              }
//                              if (data.reactions[reactions[key].pt_name_fr]) {
//                                data.reactions[reactions[key].pt_name_fr]++;
//                              }
//                              else {
//                                data.reactions[reactions[key].pt_name_fr] = 1;
//                              }
//                              { 'reaction_name': "headache", 'num_occur': 5} 
                            }

                            drugDb.connection.db.close();
                            deferred.resolve(data);
                         });
                      });

                  }); 
            });
        }
        else {
          deferred.reject('Hello, Stranger. Peace be with you');
        }

        return deferred.promise;
      };
    exports.search = _search;
    gebo.actions.add('search', _search);

    /**
     * Return the list of reported products
     *
     * @params Object
     * @params Object
     *
     * @return promise
     */
    var _inventory  = function(verified, message) {
        var deferred = q.defer();

        if (verified.admin || verified.read) {
          var db = new gebo.schemata.noreactAgent(verified.dbName);
          db.drugProductModel.find({}, { drugname: 1, _id: 0 }).lean().exec(function(err, drugs) {
                  db.connection.db.close();
                  if (err) {
                    deferred.reject(err);
                  }
                  else {
                    var drugArray = [];
                    Object.keys(drugs).forEach(function(index) {
                        drugArray.push(drugs[index].drugname);
                      });
                    deferred.resolve(drugArray);
                  }
            });
        }
        else {
          deferred.reject('Hello, Stranger. Peace be with you');
        }

        return deferred.promise;
      };
    exports.inventory = _inventory;
    gebo.actions.add('inventory', _inventory);


    return exports;
  };
