const MIN_NAME_LENGTH = 3
const MIN_DESCRIPTION_LENGTH = 5

exports.getValidationErrorsForProduct = function(name, description){
	
	const validationErrors = []
	
	if(name.length < MIN_NAME_LENGTH){
		validationErrors.push("The name needs to be at least "+MIN_NAME_LENGTH+" characters.")
	}
	
	if(description.length < MIN_DESCRIPTION_LENGTH){
		validationErrors.push("The description needs to be at least "+MIN_DESCRIPTION_LENGTH+" characters.")
	}
	
	return validationErrors
	
}