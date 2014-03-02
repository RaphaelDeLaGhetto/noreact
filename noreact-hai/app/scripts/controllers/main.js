'use strict';

angular.module('geboHai').
    controller('MainCtrl', function ($scope, Token, $location) {

        $scope.verified = false;
        $scope.admin = false;

        $scope.drugs = null;
        $scope.data = null;

        $scope.searchResults = {};
        $scope.searchFilter = {};

        /**
         * Configure OAuth2 for interaction with gebo-server
         */
        var baseUrl = window.location.origin;

        Token.setEndpoints({
            clientId: 'noreact-hai@noreact.ca',
            clientName: 'noreact-hai',
            //gebo: 'https://162.248.164.149:3443',
            gebo: 'http://162.248.164.149:3000',
            //gebo: 'https://localhost:3443',
            //gebo: 'http://localhost:3000',
            localStorageName: 'noreact-hai-token',
            redirect: baseUrl + '/components/gebo-client-token/dist/oauth2callback.html'
          });
        
        /**
         * Anonymous requests made here
         */
        Token.set('anonymous');

        /**
         * search
         *
         * @param string
         */
        $scope.search = function(terms) {
            /**
             * Hmmmm... necessary for anonymous requests.
             * There must be a better way...
             */
            var message = {
                sender: 'anonymous@noreact.ca', //Token.agent().email,
                receiver: 'noreact-agent@noreact.ca',
                performative: 'request',
                action: 'search',
                content: { resource: 'reactions', terms: terms },
                gebo: Token.getEndpoints().gebo,
            };

            Token.perform(message).
                then(function(data) {
                    $scope.searchResults = data;
                    $scope.dataReceived = true;
                  }).
                catch(function(err) {
                    $scope.searchResults = JSON.stringify(err, null, 4);
                  });
          };

        /**
         * See if this client already has a token 
         */
        $scope.accessToken = Token.get();
        
        if ($scope.accessToken) {
          Token.verify($scope.accessToken).
            then(function(data) {
                    $scope.agentName = data.name;
                    $scope.verified = true;
                    $scope.admin = data.admin;

                    // Get drug inventory
                    var message = {
                        sender: 'anonymous@noreact.ca', //Token.agent().email,
                        receiver: 'noreact-agent@noreact.ca',
                        performative: 'request',
                        action: 'inventory',
                        content: { resource: 'reactions' },
                        gebo: Token.getEndpoints().gebo,
                    };
       
                    Token.perform(message).
                        then(function(drugs) {
                            $scope.drugs = drugs;
                          }).
                        catch(function(err) {
                            $scope.data = JSON.stringify(err, null, 4);
                          });
                }, function() {
                    window.alert('You have an expired or invalid token.');
              });
        }
  });
