'use strict';

var CLIENT_ID = 'noreact-hai@noreact.ca',
    CLIENT_NAME = 'noreact-hai',
    GEBO = 'http://somegebo.com',
    LOCAL_STORAGE_NAME = 'noreact-hai-token',
    REDIRECT_URI = 'http://mygebo.com/callback.html',
    ACCESS_TOKEN = 'anonymous';

var VERIFICATION_DATA = {
        id: '1',
        name: 'anonymous',
        email: 'anonymous@email.com',
        admin: false,
    };



describe('Controller: MainCtrl', function () {

    // load the controller's module
    beforeEach(module('geboHai'));

    var MainCtrl,
        scope,
        token,
        $location,
        $httpBackend,
        $q;


    /**
     * Initialize the controller and a mock scope
     */
    beforeEach(function() {
        module('geboHai');
                                
        inject(function ($controller, $rootScope, $injector) {
            scope = $rootScope.$new();
            token = $injector.get('Token');
            $q = $injector.get('$q');
            $location = $injector.get('$location');

            MainCtrl = $controller('MainCtrl', {
                $scope: scope,
                Token: token
            });

            $httpBackend = $injector.get('$httpBackend');
            $httpBackend.when('GET', 'views/main.html').respond();
        });

        /**
         * Spies
         */
        var store = {};
        spyOn(token, 'get').andCallFake(function() {
            return store[LOCAL_STORAGE_NAME];
        });
                                                     
        spyOn(token, 'set').andCallFake(function(tokenString) {
            store[LOCAL_STORAGE_NAME] = tokenString;
        });

        spyOn(token, 'clear').andCallFake(function(tokenString) {
            delete store[LOCAL_STORAGE_NAME];
        });

        spyOn(token, 'verify').andCallFake(function(token) {
            var deferred = $q.defer();
            deferred.resolve(VERIFICATION_DATA);
            return deferred.promise;
        });

        /**
         * HTTP calls
         */
        $httpBackend.whenGET(token.getEndpointUri('verify') + '?access_token=' + ACCESS_TOKEN).
            respond(VERIFICATION_DATA);


    });


    it('should do something', function() {
        expect(!!MainCtrl).toBe(true);
        expect(!!token).toBe(true);
    });

    /**
     * Has this client already authenticated?
     */
    describe('onload', function() {
  
        var message;
        beforeEach(inject(function($controller) {
 //           var ctrl = $controller('MainCtrl', {
 //               $scope: scope,
 //               Token: token
 //           });

            message = {
                    sender: 'anonymous@noreact.ca', //Token.agent().email,
                    receiver: 'noreact-agent@noreact.ca',
                    performative: 'request',
                    action: 'inventory',
                    content: { resource: 'drug_products' },
                    gebo: token.getEndpoints().gebo,
                    access_token: 'anonymous',
                };

            $httpBackend.whenPOST(token.getEndpointUri('perform'), message).
                respond(['RITALIN']);
        }));
    
        it('should look for a locally stored token', inject(function($controller, $rootScope) {
            var ctrl = $controller('MainCtrl', {
                $scope: scope,
                Token: token
            });

            expect(token.get).toHaveBeenCalled();
            expect(scope.drugs).toBe(null);
            expect(scope.accessToken).toBe('anonymous');
        }));
    
        it('should verify a locally stored token', inject(function($controller, $rootScope) {
            $httpBackend.expectGET(token.getEndpointUri('verify') + '?access_token=' + ACCESS_TOKEN);
            $httpBackend.expectPOST(token.getEndpointUri('perform'), message);
            token.set(ACCESS_TOKEN);
            var ctrl = $controller('MainCtrl', {
                $scope: scope,
                Token: token
            });

            expect(token.get).toHaveBeenCalled();
            expect(scope.accessToken).toBe(ACCESS_TOKEN);
            expect(token.verify).toHaveBeenCalled();

            expect(scope.verified).toBe(false);
            expect(scope.agentName).toBe(undefined);
            $rootScope.$apply();
            //expect(scope.drugs.length).toBe(1);
            expect(scope.verified).toBe(true);
            expect(scope.agentName).toBe('anonymous');
        }));

        it('should load the list of reported drugs', inject(function($controller, $rootScope) {
            $httpBackend.expectGET(token.getEndpointUri('verify') + '?access_token1=' + ACCESS_TOKEN);
//            $httpBackend.expectPOST(token.getEndpointUri('perform'), message);
            token.set(ACCESS_TOKEN);
            var ctrl = $controller('MainCtrl', {
                $scope: scope,
                Token: token
            });

            console.log('HERE');

            expect(scope.drugs).toBe(null);
            $rootScope.$apply();
            expect(scope.drugs.length).toBe(1);

//            expect(token.get).toHaveBeenCalled();
//            expect(scope.accessToken).toBe(ACCESS_TOKEN);
//            expect(token.verify).toHaveBeenCalled();
//
//            expect(scope.verified).toBe(false);
//            expect(scope.agentName).toBe(undefined);
//            $rootScope.$apply();
//            expect(scope.verified).toBe(true);
//            expect(scope.agentName).toBe('anonymous');
        }));

    });
 

    /**
     * search
     */
    describe('search', function() {

        var message;

        beforeEach(function() {
//            message = {
//                sender: token.agent().email,
//                receiver: 'noreact-agent@noreact.ca',
//                performative: 'request',
//                action: 'search',
//                content: { resource: 'reactions', terms: 'this drug and that' },
//                gebo: token.getEndpoints().gebo,
//                access_token: token.get(),
//            };

            // I should be able to adopt the above declaration
            message = {
                sender: "anonymous@noreact.ca",
                receiver:"noreact-agent@noreact.ca",
                performative:"request",
                action:"hello",
                content:{"resource":"reactions","terms":"this drug and that"},
                gebo:"https://localhost:3443",
                access_token:"anonymous"
            };

            $httpBackend.whenPOST(token.getEndpointUri('perform'), message).
                respond({ some: 'data' });
        });

        it('should send a request to the noreact-agent', inject(function($rootScope) {
            $httpBackend.expectPOST(token.getEndpointUri('perform'), message);
            expect(scope.data).toEqual(null);
            scope.search('this drug and that');
//            $rootScope.$apply();
            expect(scope.data).toEqual({ some: 'data' });
        }));
    });
});
