const mongoose = require('mongoose');
const { AppError, sendResponse } = require('../helpers/utils');
const Car = require('../models/Car');
const carController = {};

carController.createCar = async (req, res, next) => {
	const info = req.body;
	try{
		if (!info) throw new AppError(402, "Bad request", "Create Car Error");
		const created = await Car.create(info);
		sendResponse(res, 200, true, { cars: created }, null, "Created Car Succesfully!")
	} catch (error) {
		next(error)
	}
};

carController.getCars = async (req, res, next) => {
	let  { page } = req.query;
	page = parseInt(page) || 1;
	limit = 10;
	const filter = { "isDeleted" : false }
	try {
      const listOfCars = await Car.find(filter)
	  .skip(limit * (page - 1))
	  .limit(limit);
	  const count = await Car.count(filter)
	  const total = Math.ceil(count / limit);

	  if(!listOfCars) throw new AppError(400, "No car found");

	//   let offset = limit * (page - 1);
	//   const cars = listOfCars.slice(offset, offset + limit);
	  await sendResponse(res, 200, true, { cars: listOfCars, page: page, total: total}, null, "Get Cars Succesfully!")
	} catch (error) {
		next(error);
	}
};

carController.editCar = async (req, res, next) => {
   const {id} = req.params;
   const updatedInfo = req.body;
   const options = { new: true };
   try {
	if (!id) throw new AppError(401, "Bad request", "Update Car Error");

	 const updated = await Car.findByIdAndUpdate(id, updatedInfo, options);
	 sendResponse(res, 200, true, {cars: updated}, null, "Updated Car Succesfully!");
   } catch (error) {
	 next(error);
   }
};

carController.deleteCar = async (req, res, next ) => {
	const {id} = req.params;
	const options = { new: true};
	try {
		if(!id) throw new AppError(401, "Bad request", "Delete Car Error");

		const softDeleted =  await Car.findByIdAndUpdate(id, { isDeleted: true }, options);
		sendResponse(res, 200, true, {cars: softDeleted }, null, "Deleted Car Succesfully!");
	} catch (error) {
		next(error);
	}
}


module.exports = carController;



// db.cars.updateMany({}, {$rename: {"Make": "make", "Model": "model", "Year": "release_date"} })