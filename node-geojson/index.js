// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
const axios = require('axios');
const config = require('./config');
const coordtransform = require('coordtransform');
const fs = require('fs');
const Path = require('path');
// use an async context to call onnxruntime functions.
async function main() {
  let geojson = JSON.parse(fs.readFileSync(config.path));
  const filename = Path.basename(config.path);
  // for (let i = 0; i < geojson.features.length; i++) {
  //   let feature = geojson.features[i];
  //   for (let j = 0; j < feature[i].geometry.coordinates.length; j++) {
  //     let coordinate = feature[i].geometry.coordinates[j];
  //     for (let k = 0; k < coordinate[j].length; k++) {
  //       let coord = coordinate[j][k];
  //       let { gcj02 } = await coordtransform_online(`${coord[0]},${coord[1]}`);
  //     }
  //   }
  // }
  // 执行坐标系转换
  geojson.features.forEach((feature) => {
    feature.geometry.coordinates.forEach((coordinate) => {
      coordinate.forEach((coord) => {
        coord.forEach(async (c) => {
          const newCoords = coordtransform.wgs84togcj02(c[0], c[1]);
          // let { gcj02 } = await coordtransform_online(`${c[0]},${c[1]}`);
          c[0] = newCoords.lng;
          c[1] = newCoords.lat;
        });
      });
    });
  });
  let outName = filename.split('.');
  fs.writeFileSync(outName[0] + `_out.${outName[1]}`, JSON.stringify(geojson));
}
/**
 * @description 坐标转换接口
 * @param {string} src_coordinate 坐标
 * @returns {Promise<object>} 转换后的坐标{
    wgs84: { lng: 116.46706996, lat: 39.99188446 },
    gcj02: { lat: 39.9932029943646, lng: 116.4732071375548 },
    bd09: { lat: 39.998940249035975, lng: 116.479818205106 },
    cgcs2000: { east: 454485.5456456185, north: 4428763.965422621, band: 39 }
  }
 */
function coordtransform_online(src_coordinate) {
  let randomTime = Math.floor(Math.random() * 400) + 100;
  return new Promise((resolve, reject) => {
    let params = {
      src_type: config.src_type,
      src_coordinate: src_coordinate,
    };
    const queryString = Object.keys(params)
      .map((key) => `${key}=${encodeURIComponent(params[key])}`)
      .join('&');
    setTimeout(async () => {
      const res = await axios.post(
        config.request.url,
        queryString + '&src_band=',
        {
          headers: config.request.headers,
        }
      );
      if (res.status) {
        resolve(res.data.result);
      } else {
        reject(res.data.message);
      }
    }, randomTime);
  });
}
/**
 * @description 坐标转换接口
 * @param {Array} src_coordinate 坐标
 * @returns {Promise<Array>}
 */
function coordtransform_local(src_coordinate) {
  return new Promise((resolve, reject) => {
    const newCoords = coordtransform.wgs84togcj02(
      src_coordinate[0],
      src_coordinate[1]
    );
    resolve(newCoords);
  });
}
// coordtransform_local([116.46706996, 39.99188446]).then((res) => {
//   console.log(res);
// });
main();
