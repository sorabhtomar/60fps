// Generated by CoffeeScript 1.9.1
(function() {
  var Canvas, Image, allTheThings, filenames, fs, j, len, mask, maskImg, n;

  Canvas = require('canvas');

  Image = Canvas.Image;

  fs = require('fs');

  mask = fs.readFileSync(__dirname + '/mask.png');

  maskImg = new Image;

  maskImg.src = mask;

  allTheThings = function(filename) {
    var brightness, c2, c2ctx, canvas, ctx, doIt, image, img, makePixelNightVision, out, stream;
    image = fs.readFileSync(__dirname + '/images/' + filename);
    img = new Image;
    img.src = image;
    canvas = new Canvas(1920, 1080);
    c2 = new Canvas(1920, 1080);
    ctx = canvas.getContext("2d");
    c2ctx = c2.getContext("2d");
    brightness = 0.2;
    makePixelNightVision = function(r, g, b, a) {
      g = b * 0.1 + (g * brightness + r * 0.2);
      r = 0;
      b = 0;
      return [r, g, b, a];
    };
    doIt = function() {
      var a, b, g, i, imageData, j, length, pixel, r, ref;
      imageData = ctx.getImageData(0, 0, 1920, 1080);
      length = imageData.data.length / 4;
      for (i = j = 0, ref = length; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
        r = imageData.data[i * 4 + 0];
        g = imageData.data[i * 4 + 1];
        b = imageData.data[i * 4 + 2];
        a = imageData.data[i * 4 + 3];
        pixel = makePixelNightVision(r, g, b, a);
        imageData.data[i * 4 + 0] = pixel[0];
        imageData.data[i * 4 + 1] = pixel[1];
        imageData.data[i * 4 + 2] = pixel[2];
        imageData.data[i * 4 + 3] = pixel[3];
      }
      ctx.putImageData(imageData, 0, 0);
      return c2ctx.drawImage(maskImg, 0, 0);
    };
    mask = function(mainCtx) {
      mainCtx.globalCompositeOperation = 'destination-out';
      return mainCtx.drawImage(maskImg, 0, 0);
    };
    ctx.drawImage(img, 0, 0);
    console.log("image load");
    doIt();
    mask(ctx);
    out = fs.createWriteStream(__dirname + '/out/' + filename);
    stream = canvas.createPNGStream();
    return stream.on('data', function(chunk) {
      return out.write(chunk);
    });
  };

  filenames = fs.readdirSync(__dirname + '/images');

  for (j = 0, len = filenames.length; j < len; j++) {
    n = filenames[j];
    allTheThings(n);
  }

}).call(this);
