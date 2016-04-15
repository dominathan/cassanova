'use strict';
module.exports = function () {
  return {
    getPhotoInfo: function(photoObj,fake_account_id) {
      return {
        photo_url: photoObj['url'],
        fake_account_id: fake_account_id,
        tinder_id: photoObj['id']
      };
    }
  }
}
