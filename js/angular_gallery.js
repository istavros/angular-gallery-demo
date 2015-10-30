angular.module('angular_gallery', ['wu.masonry'])
.controller('GalleryController', ['$scope', '$http', function($scope, $http) {
  var path = 'api/gallery',
    loadMoreTimer,
    page = -1,
    pages = 1,
    infiniteScrollDisabled = false;

  $scope.images = [];

  jQuery(function($){
    $(window).scroll(function() {
      if($(window).scrollTop() + $(window).height() >= $(document).height() - 300) {
        clearTimeout(loadMoreTimer);
        loadMoreTimer = setTimeout(function(){
          loadMore();
        },0);
      }
    });
    $('#isotopeContainer').on( 'layoutComplete', function( event, laidOutItems ) {
      $(window).trigger('resize');
    } )
  });

  function loadMore() {
    if (!infiniteScrollDisabled){
      if (page == pages - 1){
        infiniteScrollDisabled = true;
        return;
      }
      infiniteScrollDisabled = true;
      $http.get(path + '?page=' + (page + 1))
      .success(function(data){
        [].push.apply($scope.images, data.images);
        page = data.view.page;
        pages = data.view.pages;
        infiniteScrollDisabled = false;
        setTimeout(function(){
          jQuery("img.lazy").lazyload({
            threshold : 200,
            failure_limit : data.view.limit
          });
          jQuery('a.angular-gallery-image').colorbox({rel:'gal', maxHeight: '90%'});
        },0);
      });
    }
  };

  loadMore();
}]);
