const Artist = require('../models/artist');

/**
 * Searches through the Artist collection
 * @param {object} criteria An object with a name, age, and yearsActive
 * @param {string} sortProperty The property to sort the results by
 * @param {integer} offset How many records to skip in the result set
 * @param {integer} limit How many records to return in the result set
 * @return {promise} A promise that resolves with the artists, count, offset, and limit
 */
module.exports = (criteria, sortProperty, offset = 0, limit = 20) => {
  console.log(criteria);

  //ES5 style for creating sort object
  // const sortOrder = {};
  // sortOrder[sortProperty] = 1;
  // .sort(sortOrder)


  var query = Artist
    .find({})
    .sort({ [sortProperty]: 1 })
    .skip(offset)
    .limit(limit)

  if (criteria.name !== "") {
    query = query.where('name').equals(new RegExp(criteria.name, 'i'));
  };

  if (criteria.age !== undefined) {
    query = query.where('age')
                 .gt(criteria.age.min)
                 .lt(criteria.age.max)
  };

  if (criteria.yearsActive !== undefined) {
    query = query.where('yearsActive')
                 .gt(criteria.yearsActive.min)
                 .lt(criteria.yearsActive.max)
  };

  return Promise.all([query, Artist.count()])
    .then((results) => {
      return {
        all: results[0],
        count: results[1],
        offset: offset,
        limit: limit
      }
    });
};
