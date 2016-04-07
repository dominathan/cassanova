'use strict';
module.exports = function () {
  return {
    getPhotoInfo: function(photoObj,target) {
      return {
        photo_url: photoObj['url'],
        target_id: target.id,
        tinder_id: photoObj['id']
      };
    }
  }
}
