chrome.runtime.onMessage.addListener(function(msg, _, sendResponse) {
  //csv
  /*
  var lines = $(".tabla_datos")[0].querySelectorAll("tr");
  var file = "";
  for(var i in lines){
  	line = lines[i]
  	if(line.className === ""){
  		l = line.children[0].textContent.trim() + "|" + line.children[1].textContent.trim() + "|" + line.children[3].textContent.trim()
  		l.replace(/[\n\r]+|[\s]{2,}/g, ' ').trim()
  		//console.log(l)
  		file += l + "\n"
  	}
  }
  var blob = new Blob([file], {type: "text/plain;charset=utf-8"});
  saveAs(blob, "santander.csv");
  */
  
  //ofx
  
  var lines = $(".tabla_datos")[0].querySelectorAll("tr");
  var file = headerOFX();
  for(var i in lines){
  	line = lines[i];
  	if(line.className === ""){
  	    var date = line.children[0].textContent.replace(/[\n\r]+|[\s]{2,}/g, ' ').trim();
  	    
  	    if(!date.includes("/")){
  	        continue;
  	    } 
  	    
  	    var dateFormatted = yyyymmdd(dateFromString(date));
  	    var description = line.children[1].textContent.replace(/[\n\r]+|[\s]{2,}/g, ' ').trim();
  	    var amount = line.children[3].textContent.replace(/[\n\r]+|[\s]{2,}/g, ' ').replace(".","").trim();
  	    
  	    var type;
  	    if(amount.includes("-")) {
  	         type = "CREDIT";
  	         amount = amount.replace("-", "");
  		}else{
  		    type = "DEBIT"
  		    amount = "-" + amount
  		}
  		
  		file = file +"<STMTTRN>\n\
                <TRNTYPE>"+type+"\n\
                <DTPOSTED>"+dateFormatted+"000000[-3:GMT]\n\
                <TRNAMT>"+amount+"\n\
                <MEMO>"+description+"\n\
                </STMTTRN>\n\n";
  	}
  }
  
  file = file + footerOFX();
  
  var blob = new Blob([file], {type: "text/plain;charset=utf-8"});
  saveAs(blob, "santander.ofx");
  
  sendResponse("ok")
});

function dateFromString(str) {
  var strSplitted = str.split("/")
  return new Date(strSplitted[2],Number(strSplitted[1])-1,strSplitted[0],0,0,0,0)
}

function yyyymmdd(date) {
    function twoDigit(n) { return (n < 10 ? '0' : '') + n; }
    return '' + date.getFullYear() + twoDigit(date.getMonth() + 1) + twoDigit(date.getDate());
}


function headerOFX(){
  return "OFXHEADER:100\n\
DATA:OFXSGML\n\
VERSION:102\n\
SECURITY:NONE\n\
ENCODING:USASCII\n\
CHARSET:1252\n\
COMPRESSION:NONE\n\
OLDFILEUID:NONE\n\
NEWFILEUID:NONE\n\
<OFX>\n\
<SIGNONMSGSRSV1>\n\
<SONRS>\n\
<STATUS>\n\
<CODE>0\n\
<SEVERITY>INFO\n\
</STATUS>\n\n\
<DTSERVER>"+yyyymmdd(new Date())+"000000[-3:GMT]\n\
<LANGUAGE>POR\n\
</SONRS>\n\
</SIGNONMSGSRSV1>\n\n\
<CREDITCARDMSGSRSV1>\n\
<CCSTMTTRNRS>\n\
<TRNUID>1001\n\
<STATUS>\n\
<CODE>0\n\
<SEVERITY>INFO\n\
</STATUS>\n\n\
<CCSTMTRS>\n\
<CURDEF>BRL\n\n\
<BANKTRANLIST>\n"
}

function footerOFX() {
  return "</BANKTRANLIST>\n\n\
</CCSTMTRS>\n\
</CCSTMTTRNRS>\n\
</CREDITCARDMSGSRSV1>\n\
</OFX>"
}

