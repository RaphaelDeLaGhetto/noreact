'use strict';

angular.module('geboHai')
    .controller('SearchCtrl', function ($scope, $http) {

        $scope.message = 'searching...';
        $scope.search = {};
        $scope.search.gender = "Both";

        $scope.filterResults = false; // view flag

        $scope.showFilters = function() {
            $scope.filterResults = true;
        }

        $scope.isFemale = function(gender) {
            if('Female' == gender) {
                return true;
            }

            return false;
        }

        $scope.isMale = function(gender) {
            if('Male' == gender) {
                return true;
            }

            return false;
        }


        $scope.searchResults = 
            [
                {
                "AER":"000086080",
                "InitialReceivedDate":"1993-08-30",
                "Age": "68 Years",
                "Gender":"Female",
                "SeriousReport": {
                    "Death":"",
                    "Hospitalization":"Yes",
                    "LifeThreatening":"",
                    "CongenitalAnomaly":"",
                    "Disability":""
                },
                "ProductInformation": 
                    [
                        {
                            "Product ":"AVENTYL",
                            "HealthProductRole":"Concomitant"
                        },
                        {
                            "Product ":"COGENTIN",
                            "HealthProductRole":"Concomitant"
                        },
                        {
                            "Product ":"LITHIUM",
                            "HealthProductRole":"Suspect"
                        },
                        {
                            "Product ":"SERAX",
                            "HealthProductRole":"Concomitant"
                        }
                    ],
                "AdverseReactionTerms":'Confusional state, Encephalopathy, Tremor'
                },

                {
                    "AER":"000061414",
                    "InitialReceivedDate":"1987-07-27",
                    "Age": "75 Years",
                    "Gender":"Female",
                    "SeriousReport": {
                        "Death":"",
                        "Hospitalization":"Yes",
                        "LifeThreatening":"",
                        "CongenitalAnomaly":"",
                        "Disability":""
                    },
                    "ProductInformation":
                        [
                            {
                                "Product ":"CAPOTEN",
                                "HealthProductRole":"Concomitant"
                            },
                            {
                                "Product ":"ELTROXIN",
                                "HealthProductRole":"Concomitant"
                            },
                            {
                                "Product ":"IMIPRAMINE HCL",
                                "HealthProductRole":"Concomitant"
                            },
                            {
                                "Product ":"LITHIUM",
                                "HealthProductRole":"Suspect"
                            },
                            {
                                "Product ":"METHYLDOPA",
                                "HealthProductRole":"Concomitant"
                            },
                            {
                                "Product ":"NOVO-FIBER TAB 469MG",
                                "HealthProductRole":"Concomitant"
                            },
                            {
                                "Product ":"PRO-BANTHINE",
                                "HealthProductRole":"Concomitant"
                            },
                            {
                                "Product ":"SELDANE",
                                "HealthProductRole":"Concomitant"
                            }
                        ],
                    "AdverseReactionTerms":'Dysphagia, Gait disturbance, Parkinsonism, Tremor'
                },
                {
                    "AER":"000063549",
                    "InitialReceivedDate":"1986-10-30",
                    "Age": "71 Years",
                    "Gender":"Male",
                    "SeriousReport": {
                        "Death":"",
                        "Hospitalization":"",
                        "LifeThreatening":"",
                        "CongenitalAnomaly":"",
                        "Disability":""
                    },
                    "ProductInformation":
                        [
                            {
                                "Product ":"BEMINAL",
                                "HealthProductRole":"Concomitant"
                            },
                            {
                                "Product ":"FIBYRAX - TABLET",
                                "HealthProductRole":"Concomitant"
                            },
                            {
                                "Product ":"HALOPERIDOL",
                                "HealthProductRole":"Concomitant"
                            },
                            {
                                "Product ":"LITHIUM",
                                "HealthProductRole":"Suspect"
                            },
                            {
                                "Product ":"LACTULOSE SYRUP",
                                "HealthProductRole":"Concomitant"
                            },
                            {
                                "Product ":"POTASSIUM CHLORIDE",
                                "HealthProductRole":"Concomitant"
                            }
                        ],
                    "AdverseReactionTerms":'Hypokalaemia'
                }
            ];
});