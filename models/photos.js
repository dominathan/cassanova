'use strict';

function getPhotoInfo(photoObj,target) {
  return {
    photo_url: photoObj['url'],
    target_id: target.id,
    tinder_id: photoObj['id']
  };
};

module.exports = getPhotoInfo;
