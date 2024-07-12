// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

const coordtransform = require('coordtransform');
const fs = require('fs');

// use an async context to call onnxruntime functions.
async function main() {
  let geojson = JSON.parse(fs.readFileSync('./youxianqu.json'));
  // 执行坐标系转换
  geojson.features.forEach((feature) => {
    feature.geometry.coordinates.forEach((coordinate) => {
      coordinate.forEach((coord) => {
        coord.forEach((c) => {
          const newCoords = coordtransform.wgs84togcj02(c[0], c[1]);
          c[0] = newCoords[0];
          c[1] = newCoords[1];
        });
      });
    });
  });
  fs.writeFileSync('output_youxianqu.json', JSON.stringify(geojson));
}

main();
