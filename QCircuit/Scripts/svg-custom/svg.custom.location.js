; (function (SVG, undefined) {

  'use strict';

  SVG.extend(SVG.Element, {
    loc: function () {
      var element = this,
          bbox, rbox,
          x = 0,
          y = 0,
          width, height;

      while (!(element instanceof SVG.Doc)) {
        bbox = element.bbox();
        rbox = element.rbox();

        x += rbox.x - bbox.x;
        y += rbox.y - bbox.y;

        if (!width) {
          width = rbox.width;
        }

        if (!height) {
          height = rbox.height;
        }

        element = element.parent;
      }

      return {
        x: x,
        y: y,
        width: width,
        height: height
      };
    }
  });

}(this.SVG));