; (function (SVG, undefined) {

  'use strict';

  SVG.SpecularLightingEffect.prototype = new SVG.Parent();

  SVG.extend(SVG.Filter, {
    bevel: function () {
      var blur, spec, slice;

      blur = this.gaussianBlur(3).in(this.sourceAlpha);

      spec = new SVG.SpecularLightingEffect();
      spec.add(new SVG.PointLightEffect().attr({
        x: 0,
        y: 0,
        z: 10000
      }));

      this.put(spec).attr({
        in: blur,
        surfaceScale: 5,
        specularConstant: 0.5,
        specularExponent: 10,
        'lighting-color': 'grey'
      });

      slice = this.composite(spec, this.sourceAlpha, 'in');

      this.composite(this.source, slice, 'arithmetic').attr({
        k1: 0,
        k2: 1,
        k3: 1,
        k4: 0
      });
    }
  });

}(this.SVG));