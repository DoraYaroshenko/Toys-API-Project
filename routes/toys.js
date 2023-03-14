const express = require("express");
const { ToyModel, validateJoi } = require("../models/toyModel");
const router = express.Router();
const { auth } = require("../middleware/auth");

router.get("/", async (req, res) => {
    try {
        let page = req.query.page - 1 || 0;
        let sort = req.query.sort || "_id";
        let reverse = req.query.reverse == "yes" ? -1 : 1;
        let perPage = 10;
        let data = await ToyModel.find({})
            .skip(page * perPage)
            .limit(perPage)
            .sort({ [sort]: reverse })
        return res.json(data);
    }
    catch (err) {
        console.log(err);
        return res.status(502).json({ err })
    }
})

router.get("/search", async (req, res) => {
    try {
        let search = req.query.s;
        let searchExp = new RegExp(search, "i");
        let page = req.query.page - 1;
        let perPage = 10;
        let sort = req.query.sort || "_id";
        let reverse = req.query.reverse == "yes" ? -1 : 1;
        let data = await ToyModel.find({ $or: [{ info: searchExp }, { name: searchExp }] })
            .skip(page * perPage)
            .limit(perPage)
            .sort({ [sort]: reverse })
        return res.json(data);
    }
    catch (err) {
        console.log(err);
        return res.status(502).json({ err })
    }
})

router.get("/category/:catname", async (req, res) => {
    try {
        let category = req.params.catname;
        let cat = new RegExp(category, "i");
        let page = req.query.page - 1;
        let perPage = 10;
        let sort = req.query.sort || "_id";
        let reverse = req.query.reverse == "yes" ? -1 : 1;
        let data = await ToyModel.find({ category: cat })
            .skip(page * perPage)
            .limit(perPage)
            .sort({ [sort]: reverse })
        return res.json(data);
    }
    catch (err) {
        console.log(err);
        return res.status(502).json({ err })
    }
})

router.get("/prices", async (req, res) => {
    try {
        let min = req.query.min;
        let max = req.query.max;
        let page = req.query.page - 1;
        let perPage = 10;
        let sort = req.query.sort || "_id";
        let reverse = req.query.reverse == "yes" ? -1 : 1;
        let data = await ToyModel.find({ $and: [{ price: { $gte: min } }, { price: { $lte: max } }] })
            .skip(page * perPage)
            .limit(perPage)
            .sort({ [sort]: reverse })
        return res.json(data);
    }
    catch (err) {
        console.log(err);
        return res.status(502).json({ err })
    }
})

router.get("/single/:id", async (req, res) => {
    try {
        let id = req.params.id;
        let data = await ToyModel.find({ _id: id })
        return res.json(data);
    }
    catch (err) {
        console.log(err);
        return res.status(502).json({ err })
    }
})

router.post("/", auth, async (req, res) => {
    let validBody = validateJoi(req.body);
    if (validBody.error) {
        return res.status(400).json(validBody.error.details);
    }
    try {
        let toy = new ToyModel(req.body);
        toy.user_id = req.tokenData._id;
        await toy.save();
        return res.status(201).json(toy);
    }
    catch (err) {
        console.log(err);
        return res.status(502).json({ err })
    }
})

router.put("/:editId", auth, async (req, res) => {
    let validBody = validateJoi(req.body);
    if (validBody.error) {
        return res.status(400).json(validBody.error.details);
    }
    try {
        let id = req.params.editId;
        let data = await ToyModel.updateOne({ _id: id, user_id: req.tokenData._id }, req.body);
        return res.json(data);
    }
    catch (err) {
        console.log(err);
        return res.status(502).json({ err })
    }
})

router.delete("/:delId", auth, async (req, res) => {
    try {
        let id = req.params.delId;
        let data = await ToyModel.deleteOne({ _id: id, user_id: req.tokenData._id });
        return res.json(data);
    }
    catch (err) {
        console.log(err);
        return res.status(502).json({ err })
    }
})

module.exports = router;