Base64 = {
  
 // private property
 _keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
 
 encodeBinaryArrayAsString : function(input){
  var ascArr;
  var output = "";
  var bytebuffer;
  var encodedCharIndexes = new Array(4);
   
  var inx = 0;
  ascArr = input.substring("BinaryArrayToAscCSV".length, input.length - 1).split(',');
  while(inx < ascArr.length){
   // Fill byte buffer array
   bytebuffer = new Array(3);
   for(jnx = 0; jnx < bytebuffer.length; jnx++)
    if(inx < ascArr.length)
     bytebuffer[jnx] = parseInt(ascArr[inx++]);
    else
     bytebuffer[jnx] = 0;
      
   // Get each encoded character, 6 bits at a time
   // index 1: first 6 bits
   encodedCharIndexes[0] = bytebuffer[0] >> 2; 
   // index 2: second 6 bits (2 least significant bits from input byte 1 + 4 most significant bits from byte 2)
   encodedCharIndexes[1] = ((bytebuffer[0] & 0x3) << 4) | (bytebuffer[1] >> 4); 
   // index 3: third 6 bits (4 least significant bits from input byte 2 + 2 most significant bits from byte 3)
   encodedCharIndexes[2] = ((bytebuffer[1] & 0x0f) << 2) | (bytebuffer[2] >> 6); 
   // index 3: forth 6 bits (6 least significant bits from input byte 3)
   encodedCharIndexes[3] = bytebuffer[2] & 0x3f; 
    
   // Determine whether padding happened, and adjust accordingly
   paddingBytes = inx - (ascArr.length - 1);
   switch(paddingBytes){
    case 2:
     // Set last 2 characters to padding char
     encodedCharIndexes[3] = 64;
     encodedCharIndexes[2] = 64;
     break;
    case 1:
     // Set last character to padding char
     encodedCharIndexes[3] = 64;
     break;
    default:
     break; // No padding - proceed
   }
   // Now we will grab each appropriate character out of our keystring
   // based on our index array and append it to the output string
   for(jnx = 0; jnx < encodedCharIndexes.length; jnx++)
    output += this._keyStr.charAt(encodedCharIndexes[jnx]);    
  }
  return output;
 }
};

LoadBinaryResource = function(url) {
	  var req = new XMLHttpRequest(); 
	  req.open('GET', url, false); 
	 
	  if (req.overrideMimeType)
	    req.overrideMimeType('text/plain; charset=x-user-defined'); 
	  req.send(null); 
	  if (req.status != 200) return ''; 
	  if (typeof(req.responseBody) !== 'undefined') return BinaryArrayToAscCSV(req.responseBody);
	  return req.responseText; 
	}
	 
	LoadBinaryResourceAsBase64 = function(url) {
	  var data = LoadBinaryResource(url);
	   
	  if (data.indexOf("BinaryArrayToAscCSV") !== -1)
	    return Base64.encodeBinaryArrayAsString(data);
	  else
	    return Base64.encodeBinary(data); 
	} 