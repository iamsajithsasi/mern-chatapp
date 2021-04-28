const express = require("express");
const router = express.Router();

// const mongoose = require("mongoose");

const { userModel, chatModel } = require("../model/schema");

// fetch all the user
router.get("/user_list", (req, res) => {
  userModel.find().then((d) => {
    res.json(d);
  });
});

// get user by id
router.get("/user_by_id/:id", (req, res) => {
  userModel.findById(req.params.id).then((d) => {
    res.json(d);
  });
});

// create and update user
router.post("/user_create_or_update", (req, res) => {
  const query = { _id: req.body.id };
  const data = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    phone: req.body.phone,
    email: req.body.email,
  };

  userModel.findOneAndUpdate(
    query,
    data,
    { upsert: true },
    function (error, doc) {
      if (error) {
        res.statusCode(400).json({ message: error });
      } else {
        res.json({ message: "Success", data: doc });
      }
    }
  );
});

function deleteChat(query) {
  chatModel.findOneAndDelete(query, function (err) {
    if (err) {
      res.statusCode(400).json({ message: err });
    } else {
      res.json({ message: "User and Chat Deleted Successfully" });
    }
  });
}

// delete user and chat
router.delete("/user_delete/:id", (req, res) => {
  const query = { _id: req.params.id };
  userModel.findOneAndDelete(query, function (err) {
    if (err) {
      res.statusCode(400).json({ message: err });
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
        .then((item) => res.json({ message: "Success" }))
        .catch((err) => res.status(400).send(err));
    } else {
      res.status(400).json({ message: "User not found" });
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
        res.statusCode(400).json({ message: error });
      } else {
        res.json({ message: "Success" });
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
      res.json({ message: "Sucess", data: doc });
    })
    .catch((err) => res.status(400).send(err));
});

module.exports = router;