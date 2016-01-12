'use strict';

module.exports = function() {
  return {
    getPhotoInfo: function(photoObj,target) {
      return {
        photo_url: photoObj['url'],
        target_id: target.id,
        created_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
        updated_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
      };
    }
  }
};
