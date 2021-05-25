class ApiFeatures {

    constructor(query, queryStr){
        this.query = query;
        this.queryStr = queryStr;
    }

    filter(){
         //1A. Simple filtering:
        
         let queryObj = {...this.queryStr};
         
         let removedEl = ['page', 'sort', 'limit', 'fields'];
         removedEl.forEach( el=> delete queryObj[el]);
         

         let queryString = JSON.stringify(queryObj);
          queryString = queryString.replace(/\b(gte|gt|lt|lte)\b/g, match => `$${match}`);
          

         this.query = this.query.find(JSON.parse(queryString));
         return this;
    }

    sort(){

        if(this.queryStr.sort){
            const sortBy = this.queryStr.sort.split(',').join(' ');
            
            this.query = this.query.sort(sortBy);
        }else{
            this.query = this.query.sort('-createdAt');
        }
       return this;
    }

    limiting(){

        if(this.queryStr.fields){
            const fieldName = this.queryStr.fields.split(',').join(' ');
            this.query = this.query.select(fieldName); //This is also called projection
        }else{
            this.query = this.query.select('-__v');
        }
       return this
    }

    pagination(){
        
          const page = this.queryStr.page*1 || 1;
          const limit = this.queryStr.limit*1 || 100;
           const skip = (page-1)*limit;

          this.query = this.query.skip(skip).limit(limit);

          return this;

         }
}

module.exports = ApiFeatures;
