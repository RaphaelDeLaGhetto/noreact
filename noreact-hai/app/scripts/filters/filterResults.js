angular.module('geboHai').filter('gender', function(){

    return function(items, search){

        var arrayToReturn = [];

        if('Both' != search.gender) {

            for (var i=0; i<items.length; i++){
                if (items[i].Gender == search.gender) {
                    arrayToReturn.push(items[i]);
                }
            }
        } else { return items;}

        return arrayToReturn;
    };
});