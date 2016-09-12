'use strict';

module.exports = {
  shotImage(shot) {
    var uri = shot.images.normal ? shot.images.normal : shot.images.teaser;
    return {uri};
  },
  authorAvatar(player){
    var uri;
    if (player) {
      uri = player.avatar_url;
      return {uri};
    } else {
      uri = require('../img/AuthorAvatar.png');
      return uri;
    }
  },
  shotHidpiImage(shot) {
    var uri = shot.images.hidpi ? shot.images.hidpi : shot.images.normal;
    return {uri};
  },
}
