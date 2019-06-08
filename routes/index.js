
module.exports = function (app, db) {
  var ObjectID = require('mongodb').ObjectID;

  /* GET SPA pure  html, our jQuery Mobile app */
  app.get('/', function (req, res) {
    res.sendFile('mySPA.html', { root: __dirname });
  });
  
  app.get('/notelist', async function (req, res) {
    try {
      var doc = await db.collection('UserCollectionNote').find().toArray();
      //Products.sort(compare);
      res.send(doc);
    }
    catch (err) {
      console.log('get all failed');
      console.error(err);
    }
  });

  // /* GET New Note page. */  Do not need to ask server for new form page, our SPA has it!
  // app.get('/newnote', function (req, res) {
  //   res.render('newnoteJade', { title: 'Add New Note' });
  // });

  app.post('/addNote', (req, res) => {
    const note = {
      Priority: req.body.Priority,
      Subject: req.body.Subject,
      Description: req.body.Description
    };
     
    db.collection('UserCollectionNote').insertOne(note, (err, result) => {
      if (err) {
        res.send({ 'error': 'An error has occurred' });
      } else {
        res.redirect("notelist");
      }
    });
  });

  app.get('/findnote/:id', (req, res) => {    // was app.post)
    var whichSubject = req.params.id;


    const details = { Subject: whichSubject };
    db.collection('UserCollectionNote').findOne(details, (err, item) =>
     {
      if (err) {
        res.send({ 'error': 'An error has occurred :(' });
      } else {
        if (item == null) {
          item = {
            Priority: '99',
            Subject: 'No such note',
            Description: 'No such note'
          }
        }
        res.send( item);
      }
    });
  });

  app.delete('/deleteNote/:id', (req, res) => {
    const id = req.params.id;
    
    const which = { 'Subject': id };  // delete by Subject
    db.collection('UserCollectionNote').deleteOne(which, (err, item) => {
      if (err) {
        res.send({ 'error': 'An error has occurred :(' });
      } else {
        res.send('Note ' + id + ' deleted!');
      }
    });
  });

  app.put('/updatenote/:id', (req, res) => {
    const subject = req.params.id;
    const note = req.body;
    const newDescription = note.Description
    const newSubject = note.Subject;  
  
    //const details = { '_id': new ObjectID(who_id) };  // not going to try and update by _id
    // wierd bson datatype add complications
    
    // if uddating more than one field: 
    //db.collection('UserCollection').updateOne({ username: who_id }, { $set: { "email": newEmail, "title": newTitle } }, (err, result) => {
    
    // updating priority and/or description, not subject
    db.collection('UserCollectionNote').updateOne({ Subject: subject }, { $set: { "Subject": newSubject, "Description": newDescription} }, (err, result) => {
      if (err) {
        res.send({ 'error': 'An error has occurred' });
      } else {
        res.send(note);
      }
    });
  });

  
};  // end of mod exports