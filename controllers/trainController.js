const prisma = require("../prisma/client");

exports.addTrain = async (req, res) => {
  const { name, source, destination, totalSeats } = req.body;
  const train = await prisma.train.create({
    data: {
      name,
      source,
      destination,
      totalSeats,
      availableSeats: totalSeats,
    },
  });
  res.status(201).send(train);
};

exports.getTrains = async (req, res) => {
  const { source, destination } = req.query;
  const trains = await prisma.train.findMany({
    where: { source, destination },
  });
  res.status(200).send(trains);
};
