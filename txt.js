//1A. Simple filtering:
        //  console.log(req.query);
        //  let queryObj = {...req.query};
         
        //  let removedEl = ['page', 'sort', 'limit', 'fields'];
        //  removedEl.forEach( el=> delete queryObj[el]);
        //  console.log(queryObj);

         //1B. Advance filtering:
        //   let queryString = JSON.stringify(queryObj);
        //   queryString = queryString.replace(/\b(gte|gt|lt|lte)\b/g, match => `$${match}`);
        //   console.log('queryString: ', JSON.parse(queryString));

        //  let query = Tour.find(JSON.parse(queryString));

         //2. Sorting:
         // query string for sorting is: 127.0.0.1:3000/api/v1/tours?sort=price,ratingsAverage.
        //  console.log(req.query.sort);
        //  if(req.query.sort){
        //      const sortBy = req.query.sort.split(',').join(' ');
        //      console.log(sortBy);
        //      query = query.sort(sortBy);
        //  }else{
        //      query = query.sort('-createdAt');
        //  }
         
         //3. limitig fields
         // query string: 127.0.0.1:3000//api/v1/tours?fields=name,duration,difficulty,price.

        //   console.log(req.query.fields);
        //   if(req.query.fields){
        //       const fieldName = req.query.fields.split(',').join(' ');
        //       query = query.select(fieldName); //This is also called projection
        //   }

          //4. Pagination
        //   console.log(req.query);
        //   const page = req.query.page*1 || 1;
        //   const limit = req.query.limit*1 || 100;
        //    const skip = (page-1)*limit;

          

        //  if(req.query.page){
        //      const numTours = await Tour.countDocuments();
        //      if(skip > numTours) throw new Error('This page does not erxist');
        //  }  

        //  query = query.skip(skip).limit(limit);
