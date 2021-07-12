define({
  "api": [{
      "success": {
        "fields": {
          "Success 200": [{
              "group": "Success 200",
              "optional": false,
              "field": "varname1",
              "description": "<p>No type.</p>"
            },
            {
              "group": "Success 200",
              "type": "String",
              "optional": false,
              "field": "varname2",
              "description": "<p>With type.</p>"
            }
          ]
        }
      },
      "type": "",
      "url": "",
      "version": "0.0.0",
      "filename": "5.apidoc/apidoc/main.js",
      "group": "/home/andrea/Insync/vitaletti@diag.uniroma1.it/Google Drive/didattica/Reti di Calcolatori/2021/code/4.REST/5.apidoc/apidoc/main.js",
      "groupTitle": "/home/andrea/Insync/vitaletti@diag.uniroma1.it/Google Drive/didattica/Reti di Calcolatori/2021/code/4.REST/5.apidoc/apidoc/main.js",
      "name": ""
    },
    {
      "type": "get",
      "url": "/bike",
      "title": "Get User information",
      "name": "getBike",
      "group": "Bike",
      "parameter": {
        "fields": {
          "Parameter": [{
              "group": "Parameter",
              "type": "String",
              "optional": true,
              "field": "bike_id",
              "description": "<p>Bike unique ID.</p>"
            },
            {
              "group": "Parameter",
              "type": "String",
              "optional": true,
              "field": "user_id",
              "description": "<p>Bike owner unique ID.</p>"
            }
          ]
        }
      },
      "success": {
        "fields": {
          "Success": [{
              "group": "Success",
              "type": "Number",
              "optional": false,
              "field": "error_code",
              "description": "<p>0 if success.</p>"
            },
            {
              "group": "Success",
              "type": "String",
              "optional": false,
              "field": "error_desc",
              "description": "<p>'ok' if success.</p>"
            },
            {
              "group": "Success",
              "type": "Object",
              "optional": false,
              "field": "response",
              "description": "<p>Bike Object</p>"
            }
          ]
        },
        "examples": [{
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n {\n\"error_code\":0,\n\"error_desc\":\"ok\",\n\"result\":[\n{\"id\":\"bike_Wh704jkB1jR1FeT\",\n\"user_id\":\"user_3H98mwAdkH89Lno\",\n\"model\":{\"id\":\"model_jp1M0PB3odtnfCn\",\n\"name\":\"X7\",\n\"picture\":\"https://onsat.ongroup.cloud/client/www/src/imgs/x7.png\",\n\"battery_voltage\":48\n},\n\"name\":\"Luigi la Bici\",\n\"current_lat\":41.89063,\n\"current_lon\":12.40052,\n\"imei_tracker\":\"565656656565656\",\n\"battery_level\":44\n}]}",
          "type": "json"
        }]
      },
      "error": {
        "fields": {
          "Error 4xx": [{
            "group": "Error 4xx",
            "optional": false,
            "field": "UserNotFound",
            "description": "<p>The <code>id</code> of the User was not found.</p>"
          }]
        },
        "examples": [{
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found\n{\n  \"error\": \"UserNotFound\"\n}",
          "type": "json"
        }]
      },
      "version": "0.0.0",
      "filename": "5.apidoc/example.js",
      "groupTitle": "User",
      "sampleRequest": [{
        "url": "http://localhost:8080/user/:id"
      }]
    }
  ]
});