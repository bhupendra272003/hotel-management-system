const router = require("express").Router();
const Booking = require("../models/Booking");

router.post("/", async (req, res) => {
  const data = new Booking(req.body);
  await data.save();
  res.json(data);
});

router.get("/", async (req, res) => {
  res.json(await Booking.find());
});

router.put("/checkin/:id", async (req, res) => {
  await Booking.findByIdAndUpdate(req.params.id, { status: "CheckedIn" });
  res.send();
});

router.put("/checkout/:id", async (req, res) => {
  await Booking.findByIdAndUpdate(req.params.id, { status: "CheckedOut" });
  res.send();
});

module.exports = router;