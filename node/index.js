// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

const proj4 = require("proj4");
const fs = require("fs");

// use an async context to call onnxruntime functions.
async function main() {
  // 定义WGS 84和GCJ02的投影坐标系定义
  proj4.defs("EPSG:4326", "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs");
  proj4.defs("EPSG:4490", "+proj=longlat +ellps=CGCS2000 +no_defs");
  let geojson = JSON.parse(fs.readFileSync("./city.json"));
  // 执行坐标系转换
  geojson.features.forEach((feature) => {
    feature.geometry.coordinates.forEach((coordinate) => {
      coordinate.forEach((coord) => {
        coord.forEach((c) => {
          const newCoords = proj4("EPSG:4326", "EPSG:4490", c);
          c[0] = newCoords[0];
          c[1] = newCoords[1];
        });
      });
    });
  });
  fs.writeFileSync("output_geojson_file_gcj02.json", JSON.stringify(geojson));
}

main();
