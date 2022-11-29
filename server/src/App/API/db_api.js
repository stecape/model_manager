
module.exports = function (app, pool) {
  const pg = require ('pg')



  /*
  Get all records
  Type:   POST
  Route:  '/api/getAll'
  Body:   { 
            table: 'Var',
            fields: [ 'name', 'type', 'id' ]
          }
  Query:  SELECT "name","type","id" from "Var"
  Event:  -
  Res:    200,
          {
            value: [
              [ 'Temperature 1', 1, 131 ],
              [ 'Temperature 2', 1, 124 ],
              [ 'Temperature 3', 3, 125 ]
            ]
          }
  Err:    400
  */
  app.post('/api/getAll', (req, res) => {
    var queryString="SELECT \"" + req.body.fields.join('","') + "\" from \"" + req.body.table + "\"";
    pool.query({
      text: queryString,
      rowMode: 'array'
    })
    .then((data)=>{
      res.status(200).json({value: data.rows})
    })
    .catch((error) => {
      res.status(400).send(error)
    })
  });



  /*
  Add a record
  Type:   POST
  Route:  '/api/add'
  Body:   {
            table: 'Var',
            fields: [ 'name', 'type' ],
            values: [ 'Temperature 2', '1' ]
          }
  Query:  INSERT INTO "Var" ("id","name","type") VALUES (DEFAULT,'Temperature 2','1')
  Event:  {
            operation: 'INSERT',
            table: 'Var',
            data: { id: 133, type: 1, name: 'Temperature 2' }
          }
  Res:    200
  Err:    400
  */
  app.post('/api/add', (req, res) => {
    var queryString="INSERT INTO \"" + req.body.table + "\" (\"id\",\"" + req.body.fields.join('","') + "\") VALUES (DEFAULT,'" + req.body.values.join("','") + "')"
    pool.query({
      text: queryString,
      rowMode: 'array'
    })
    .then((result) => {
      res.status(200)
    })
    .catch((error) => {
      res.status(400).send(error)
    });
  });



  /*
  Delete all records
  Type:   POST
  Route:  '/api/removeAll'
  Body:   { table: 'Var'}
  Query:  TRUNCATE "Var" CASCADE
  Event:  { operation: 'TRUNCATE', table: 'Var' }
          { operation: 'TRUNCATE', table: 'Tag' }
  Res:    200
  Err:    400
  */
  app.post('/api/removeAll', (req, res) => {
    var queryString="TRUNCATE \"" + req.body.table + "\" CASCADE";
    pool.query({
      text: queryString
    })
    .then((data)=>{
      res.status(200)
    })
    .catch((error) => {
      res.status(400).send(error)
    });
  });



  /*
  Delete a record
  Type:   POST
  Route:  '/api/removeOne'
  Body:   { table: 'Var', id: 126 }
  Query:  DELETE FROM "Var" WHERE "id" = 126
  Event:  {
            operation: 'DELETE',
            table: 'Var',
            data: { id: 126, type: 1, name: 'Temperature 4' }
          }
  Res:    200
  Err:    400
  */
  app.post('/api/removeOne', (req, res) => {
    var queryString="DELETE FROM \"" + req.body.table + "\" WHERE \"id\" = " + req.body.id;
    pool.query({
      text: queryString,
      rowMode: 'array'
    })
    .then((data)=>{
      res.status(200)
    })
    .catch((error) => {
      res.status(400).send(error)
    });
  });


  
  /*
  Modify a record
  Type:   POST
  Route:  '/api/modify'
  Body:   {
            table: 'Var',
            id: 128,
            fields: [ 'name', 'type' ],
            values: [ 'Temperature 5', '4' ]
          }
  Query:  UPDATE "Var" SET "name" = 'Temperature 5',"type" = '4' WHERE id = 128
  Event:  {
            operation: 'UPDATE',
            table: 'Var',
            data: { id: 128, type: 4, name: 'Temperature 5' }
          }
  Res:    200
  Err:    400
  */
  app.post('/api/modify', (req, res) => {
    var sets = req.body.fields.map((i, index) => {
       return "\"" + i + "\" = '" + req.body.values[index] + "'"
    })
    console.log(req.body)
    var queryString="UPDATE \"" + req.body.table + "\" SET " + sets + " WHERE id = " + req.body.id
    console.log(queryString)
    pool.query({
      text: queryString,
      rowMode: 'array'
    })
    .then((result) => {
      res.status(200)
    })
    .catch((error) => {
      res.status(400).send(error)
    });
  });
}