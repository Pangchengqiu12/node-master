// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

const coordtransform = require('coordtransform');
// const wgs84ToGcj02 = require('./utils');
const fs = require('fs');
const Path = require('path');
const path = './langdao.geojson';
// use an async context to call onnxruntime functions.
async function main() {
  let geojson = JSON.parse(fs.readFileSync(path));
  const filename = Path.basename(path);
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
  let outName = filename.split('.');
  fs.writeFileSync(
    filename.replace(outName[1], `_out.${outName[1]}`),
    JSON.stringify(geojson)
  );
}

main();
