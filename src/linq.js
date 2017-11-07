(function(){
	function EnumerableArr(arr){
		var _arr = arr;
		var _currentIndex = 0;
		
		this.next = function(){
  			if(_currentIndex < _arr.length){
				this.current = _arr[_currentIndex++];
        			return true;
    			} else {
    				this.current = void(0);
        			_currentIndex = 0; //start all over again
        			return false;
    			}
  		};
	};

	function EnumerableWhere(en, fn){
		this.next = function(){
			while(en.next()) {
				if(fn(en.current)) {
					this.current = en.current;
					return true;
				}
			}
			this.current = void(0);
			return false;
  		};
	};
	
	function EnumerableSelect(en, fn){
		this.next = function(){
			while(en.next()){
				this.current = fn(en.current);
				return true;
			}
			this.current = void(0);
			return false;
  		};
  	};
	
	//API
	EnumerableArr.prototype.where = function(fn){
		if(typeof fn === 'function'){
			return new EnumerableWhere(this, fn);
		}
    		return this;
	};

	EnumerableArr.prototype.toArray = function(){
		var result = [];
		while(this.next()){
			result.push(this.current);
		}
		return result;
	};

	EnumerableArr.prototype.select = function(fn){
		if(typeof fn === 'function'){
			return new EnumerableSelect(this, fn);
		}
		return this;
	};

	EnumerableWhere.prototype = Object.create(EnumerableArr.prototype);
	EnumerableSelect.prototype = Object.create(EnumerableArr.prototype);
  
	//API entry point
	Array.prototype.linq = function(){
		return new EnumerableArr(this);
	}
})();
