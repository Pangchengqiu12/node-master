module.exports = {
  path: './regionJson.json',
  src_type: 'wgs84', //暂且不用
  request: {
    //线上接口转换暂且不用
    url: 'https://tool.lu/coordinate/ajax.html?mode=single',
    method: 'post',
    headers: {
      Referer: 'https://tool.lu/coordinate/index.html',
      origin: 'https://tool.lu',
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36',
      'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
      cookie: `SECKEY_ABVK=pEcezWQ7gAJQGik6ryBx5vjcFVF3riqJ//I9NMjvr8U%3D; BMAP_SECKEY=bXVWus9zRo2R8TJRNtuw--TdIR0tcceg0OjcbnI3I8-mijHeNyZgFzH7NAqGjsKUn9T1D_EYTlApzyxtYuWhhtoGdQ37jsKQxEoEJg0fnhruqdS8Qyf510SK2F4IWazNV1Szu4fyDvAXUuIVfyyzwHGRyBOX8E49p2LzvxcYp5OR3QluOpu3sLi6D4FA-1kyf7GmJ979A8R75HHQPq1BXw; uuid=d08a123c-7373-4d34-944f-db87e87b857a; _session=%7B%22slim.flash%22%3A%5B%5D%7D; Hm_lvt_0fba23df1ee7ec49af558fb29456f532=1722299285,1722995894; HMACCOUNT=2E1DEA11E1B8A6A4; _access=1c1491595a25c2d4f18210e73ea86361879c660ed53f870182371a67cbab4379; Hm_lpvt_0fba23df1ee7ec49af558fb29456f532=1722996228`, //用自己的
    }, //相关请求头
  },
};
