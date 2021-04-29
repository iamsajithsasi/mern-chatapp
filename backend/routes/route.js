const express = require("express");
const router = express.Router();

// const mongoose = require("mongoose");

const { userModel, chatModel } = require("../model/schema");

// fetch all the user
router.get("/user_list", (req, res) => {
  userModel
    .find()
    .then((result) => {
      res.json({ data: result, status: 1 });
    })
    .catch((err) => {
      res.status(400).send({ message: err, status: 0 });
    });
});

// get user by id
router.get("/user_by_id/:id", (req, res) => {
  userModel
    .findById(req.params.id)
    .then((result) => {
      res.json({ data: result, status: 1 });
    })
    .catch((err) => {
      res.status(400).send({ message: err, status: 0 });
    });
});

// create and update user
router.post("/user_create", (req, res) => {
  const data = new userModel({
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    phone: req.body.phone,
    email: req.body.email,
  });
  // console.log(data, req.body);
  data
    .save()
    .then((item) => res.json({ message: "Sucess", data: item, status: 1 }))
    .catch((err) => {
      if (err.code == 11000) {
        res.status(400).send({
          message: `Already Exists ${JSON.stringify(err.keyValue)}`,
          status: 0,
        });
      } else {
        res.status(400).send({ message: err, status: 0 });
      }
    });
});

router.post("/user_update/:id", (req, res) => {
  const query = { _id: req.params.id };
  const update = {
    ...req.body,
  };
  userModel.findOneAndUpdate(
    query,
    update,
    { upsert: false },
    function (error, doc) {
      if (error) {
        res.status(400).send({ message: err, status: 0 });
      } else {
        res.json({ message: "Success", data: doc, status: 1 });
      }
    }
  );
});

function deleteChat(query) {
  chatModel.findOneAndDelete(query, function (err) {
    if (err) {
      res.status(400).send({ message: err, status: 0 });
    } else {
      res.json({ message: "User and Chat Deleted Successfully", status: 1 });
    }
  });
}

// delete user and chat
router.delete("/user_delete/:id", (req, res) => {
  const query = { _id: req.params.id };
  userModel.findOneAndDelete(query, function (err) {
    if (err) {
      res.status(400).send({ message: err, status: 0 });
    } else {
      deleteChat(query);
    }
  });
});

// chat message create
router.post("/message_create/:user_id", (req, res) => {
  const query = { _id: req.params.user_id };
  const data = new chatModel({
    message: req.body.message,
    user: req.params.user_id,
  });

  userModel.findById(query).exec(function (err, doc) {
    if (!err) {
      data
        .save()
        .then((item) => res.json({ message: "Success", data: item, status: 1 }))
        .catch((err) => res.status(400).send({ message: err, status: 0 }));
    } else {
      res.status(400).json({ message: "User not found", status: 0 });
    }
  });
});

// chat message create and udpate
router.post("/message_create_or_update/:user_id", (req, res) => {
  const query = { user: req.params.user_id };
  const data = { message: req.body.message, user: req.params.user_id };

  chatModel.findOneAndUpdate(
    query,
    data,
    { upsert: true },
    function (error, result) {
      if (error) {
        res.status(400).send({ message: err, status: 0 });
      } else {
        res.json({ message: "Success", status: 1 });
      }
    }
  );
});

// chat message create and udpate
router.get("/message_list_by_user/:user_id", (req, res) => {
  const query = { user: req.params.user_id };
  chatModel
    .find(query)
    .then((doc) => {
      res.json({ message: "Sucess", data: doc, status: 1 });
    })
    .catch((err) => res.status(400).send({ message: err, status: 0 }));
});

module.exports = router;
