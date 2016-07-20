angular.module('MainService', []).factory('Main', ['$http', function($http) {
  var API_KEY = '4b92e586d087ef6e23dac3d59c456f4c8b471df4fd34d37f2b5c57bc072b6c75';
  
  return {
    
    getCollections: function() {
      return $http.get('/api/collections').then(function(plans) {
        return plans.data;
      });
    },

    getCardsInCollection: function(id) {
      return $http.get('/api/cards/collections/' + id).then(function(cards) {
        return cards.data;
      });
    },

    getDraftWraps: function() {
      return $http.get('/api/wraps/drafts/').then(function(wraps) {
        return wraps.data;
      });
    },

    createWrap: function(personalizationInfo) {
      var draftWrapId;
      var personalized_json = [];
      for (var key in personalizationInfo) {
        if (key === 'draftWrap') {
          draftWrapId = personalizationInfo[key].id;
        } else {
          var cardId = personalizationInfo[key].id;
          personalized_json.push({
            id: cardId,
            data: { d: 'd' }
          });
        }
      }

      return $http({
        method: 'POST',
        url: 'https://wrapi.qa.wrapdev.net/api/wraps/' + draftWrapId + '/personalize/v2',
        headers: {
          'Authorization': 'Bearer ' + API_KEY,
          'Content-Type': 'application/json'
        },
        data: {
          'personalized_json': personalized_json
        }
      }).then(function(wrap) {
        return wrap.data;
      });  
    },

    shareWrap: function(wrap, phoneNumber) {
      return $http({
        method: 'POST',
        url: 'https://wrapi.qa.wrapdev.net/api/wraps/' + wrap.id + '/share?type=sms&phone_number=' + phoneNumber,
        headers: {
          'Authorization': 'Bearer ' + API_KEY,
          'Content-Type': 'application/json'
        },
      }).then(function() {
        var numbers = phoneNumber.split('');
        var areaCode = numbers.slice(0,3).join('');
        var prefix = numbers.slice(3,6).join('');
        var lineNumber = numbers.slice(-4).join('');
        var formattedNumber = '(' + areaCode + ') ' + prefix + '-' + lineNumber;
        return 'Wrap sent to ' + formattedNumber + '. Check it out';
      });
    }

  }       

}]);