


const paginate = async (model, page, limit, query = {}) => {
    const startIndex = (page - 1) * limit;
    const totalDocuments = await model.countDocuments(query);
    const results = await model.find(query).limit(limit).skip(startIndex).exec();
    return {
      results,
      totalPages: Math.ceil(totalDocuments / limit),
      currentPage: page
    };
  };
  
  module.exports = paginate;
  