var alertPosition = 469;
function reportPurchase(){
  var curURL = window.location.href;
  if(curURL.split('cilory.com/quick-order').length>1){
    var jsonArr = [{'processDONE': "Cilory"}];
    jsonArr = JSON.stringify(jsonArr);
    sendMessage(0, jsonArr, 0, doNothing, []);
  }
}

reportPurchase();

function sendTrack(){
  var prod = getProd();
  var webID = getCurrentPosition(window.location.href);
  var url = window.location.href;
  url = encodeURIComponent(url);
  prod = encodeURIComponent(prod);
  if(prod!=""){
  var jsonArr = [{'prod': prod, 'url': url, 'webID': webID, 'isBook': 0 }];
  jsonArr = JSON.stringify(jsonArr);
  sendMessage(1, jsonArr, 11, doNothing, []);
  }
}

sendTrack();

pidFlipkart = getPID();
//console.log("getpid is "+pidFlipkart);
prod = getProd();
var selector = [];
selector.push({selector: '#more_info_block', attr: 'none', pos: 'before'});
selector = JSON.stringify(selector);
var passBack = [{selectors: selector}];
passBack = JSON.stringify(passBack);
addGraphBase(passBack);
var passBack1 = [{title: prod, siteName: 'Cilory', price: getPrice()}];
passBack1 = JSON.stringify(passBack1);
//console.log(passBack1);
prepareGraph(pidFlipkart, passBack1);

var imgLogo = returnResource("logo.png");
var selector2 = [];
selector2.push({selector: '#bhWidget', attr: 'none', pos: 'after'});
selector2.push({selector: '.product_attributes', attr: 'none', pos: 'before'});
selector2.push({selector: '.content_prices:eq(0)', attr: 'none', pos: 'after'});
selector2 = JSON.stringify(selector2);
setTimeout("checkAlertStatus(" + selector2 + ")", 4000);
var myPrice = getPrice();
var price = myPrice;
var imgURL3 = returnResource("watch-price1.png");

var name = getProd();
origProd = name;
name = name.split("(")[0];
  var nameS = name.split(" ");
  if(nameS.length<4){
    name = nameS.join("-");
  }
  else {
    name = nameS[0] + "-" + nameS[1] + "-" + nameS[2] + "-" + nameS[3];
  }
  var url = "http://compare.buyhatke.com/products/" + name;

  $('.product_title').after('<a style="padding: 1px 25px;background: rgb(247, 141, 29);border-radius: 2px;color: #fff;" title="Compare via Compare Hatke" target="_blank" href=' + url + '>Compare Prices</a>');

  // var button = document.getElementById("buyhatkeInput");
  // button.addEventListener("click", function() {
  //   window.location.href = $('#add_to_cart').find('a').attr("href");
  // }, false);

  var final2send = url.split("products/");
  var msgToSend = final2send[1] + "~*~*" + price;
  msgToSend = msgToSend + "&moreData=";
  sendSearchMessage(msgToSend);

  function filterResults(data){
    var results2 = JSON.parse(data);
    var message = results2;
    var results = message;
    results.sort(compare);
    var origPrice = getPrice();
    origProd = getProd();
    //console.log(origProd);
    var countArray = Array();
    for (var i = 0; i <= results.length - 1; i++) {
      var current = results[i].prod;
      countArray[i] = 0;
      currentArray = origProd.split(" ");
      var totalLen = currentArray.length;
      for(var k=0; k< currentArray.length; k++){
        if(current.toUpperCase().indexOf(currentArray[k].toUpperCase())!=-1){
          countArray[i] = countArray[i] + 1;
        }
      }
      results[i].score = countArray[i];
    ////console.log(results[i].prod + " " + results[i].price + " " + countArray[i]);
  }
  indexSelected = 0; notFound = 1;
  for(k=0; k< results.length; k++){
    if(results[k].score/totalLen > .5){
      indexSelected = k;
      notFound = 0;
      break;
    }
  }
  var posResults = [];
  posResults.push({selector: 'body', attr: 'none', pos: 'before'});
  posResults = JSON.stringify(posResults);
  var posSpecs = [];
  posSpecs.push({selector: 'body', attr: 'none', cssAttr: 'margin-top', preVal: '45px', postVal: '0px'});
  posSpecs = JSON.stringify(posSpecs);
  showResults(results, indexSelected, posSpecs, posResults);
}

