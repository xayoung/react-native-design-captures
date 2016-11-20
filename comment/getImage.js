'use strict';

module.exports = {
  shotImage(shot) {
    var uri = shot.images.normal ? shot.images.normal : shot.images.teaser;
    return {uri};
  },

  shotHidpiImage(shot) {
    var uri = shot.images.hidpi ? shot.images.hidpi : shot.images.normal;
    return {uri};
  },

  coversImage(project) {
    var uri = project.covers['404'] ? project.covers['404'] : project.covers['230'] ;

    return {uri};
  },
  coversOwnersImage(project) {
    var uri = project.owners[0].images['100'] ? project.owners[0].images['115'] : project.owners[0].images['138'] ;

    return {uri};
  },
  projectImage(modules) {
    var uri = modules.src;

    return {uri};
  },
}
