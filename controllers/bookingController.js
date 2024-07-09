const prisma = require("../prisma/client");

exports.bookSeat = async (req, res) => {
  const { trainId } = req.body;
  const train = await prisma.train.findUnique({ where: { id: trainId } });
  if (!train || train.availableSeats <= 0)
    return res.status(400).send("No available seats");

  const booking = await prisma.booking.create({
    data: {
      userId: req.user.id,
      trainId,
      seatNumber: train.totalSeats - train.availableSeats + 1,
    },
  });
  await prisma.train.update({
    where: { id: trainId },
    data: { availableSeats: train.availableSeats - 1 },
  });

  res.status(201).send(booking);
};

exports.getBookingDetails = async (req, res) => {
  const booking = await prisma.booking.findUnique({
    where: { id: parseInt(req.params.id) },
    include: { user: true, train: true },
  });
  if (!booking) return res.status(404).send("Booking not found");

  res.status(200).send(booking);
};
