savingsArray = [];
coupArray = [];
bestCouponFound = 0;
flagCoupon = [];
mytext="";
arrayMsg = [];
arrayBest = [];
couponAt = 1289;

function getXMLHTTPRequest() {

  req = new XMLHttpRequest();
  return req;

}

for(var i=0;i < 200; i++){
  flagCoupon[i] = 2;
}

function changeFlag(i, coupon){
  flagCoupon[i] = 1;
  setTimeout(function(){postProcessor(coupon, i);},1000);
}

function changeFlag2(i, coupon){
  flagCoupon[i] = 0;
}

function removeCompletely(){
}

function postProcessor(coupon, i){
  if($('.couponResult').text()!=""){
    var totLen = $('.fare_row').length;
    ind_req2 = -1;
    var msg = $('.couponResult').text();
    msg = msg.split("Rs.");
    if(msg.length>1){
      msg = msg[1];
      msg = msg.trim();
      msg = msg.split(" ");
      msg = msg[0];
      msg = msg.split(",");
      msg = msg[0]+msg[1];
      savings = parseFloat(msg);
    }
    else {
      savings = 0;
    }
    savings = parseFloat(savings);
    // console.log("savings :"+savings);
    cpn_msg = "";
    if($('#saveMsg').length > 0){
      cpn_msg = $('#saveMsg').text().trim();
    }
    // console.log("cpn_msg: "+cpn_msg);
    couponAt = 1289;
    arrayMsg.push([coupon, encodeURIComponent(cpn_msg), couponAt ]);
    if(savings > $('.hdc-sav-amt:eq(0)').text().trim()){
      var currentSavAmt = parseFloat($('.hdc-sav-amt:eq(0)').text().trim()),
      finalSavAmt = savings;
      $({c: currentSavAmt}).animate({c: finalSavAmt}, {
        step: function(now) {
          $('.hdc-sav-amt').text(Math.round(now))
        },
        duration: 1000,
        easing: "linear"
      });
    }
    savingsArray[i] = savings;

    setTimeout(function(){changeFlag2(i, coupon);},1000);
  }
  else {
    setTimeout(function(){postProcessor(coupon, i);},1000);
  }
}

function preProcessor(i, coupon){
  $('#coupon').val(coupon);
  document.getElementById('check_saving').click();
  // console.log($('.couponResult').text());
  // console.log("Coupon Code applied " + coupon);
  setTimeout(function(){changeFlag(i, coupon);},1000);
}

function temp(coupon, i, lenArray){
  if(lenArray==100){
    $('.hdc-loading').html('Automatically applying the best coupon now !');
    $('.hdc-lb-progress').text("100% Complete");
    $('.hdc-lb-fg').css("width", "100%");
    arrayBest.push([coupon, couponAt]);
    arrayBest = JSON.stringify(arrayBest);
    var jsonArr = [{'best_cpn': arrayBest}];
    jsonArr = JSON.stringify(jsonArr);
    sendMessage(1, jsonArr, 13, doNothing, []);
    preProcessor(i, coupon);
  }
  else if(i==0||flagCoupon[i-1]==0){
    $('.hdc-loading').html('Trying code <span class="hdc-load-curr hdc-bold">' + (i+1) + '</span> of <span class="hdc-load-tot hdc-bold">' + lenArray + '</span>');
    var perDone = i/lenArray;
    perDone = perDone*100;
    perDone = parseInt(perDone);
    $('.hdc-lb-progress').text(perDone + "% Complete");
    $('.hdc-lb-fg').css("width", perDone + "%");
    preProcessor(i, coupon);
  }
  else {
    setTimeout(function(){temp(coupon, i, lenArray);},1000);
  }
}

function endProcess(i){
  // console.log("called with " + i);
  if(flagCoupon[i]==0){
    // console.log("Process terminated");
    max = -111111;
    ind_req = 1000;
    for(m=0;m<savingsArray.length;m++){
     if(max < savingsArray[m]){
      max = savingsArray[m];
      ind_req = m;
    }
  }
  if(max>0){
    bestCouponFound = 1;
    coup_req = coupArray[ind_req];
    flagCoupon[0] = 2;
    temp(coup_req, 0, 100);
    $('.hatke-discount-cover').css("display", "none");
    savings = $('.hdc-sav-amt:eq(0)').text();
    $('.hatke-discount-cover:eq(1)').css("display", "block");
    var currentSavAmt = 0,
    finalSavAmt = max;
    $({c: currentSavAmt}).animate({c: finalSavAmt}, {
      step: function(now) {
        $('.hdc-sav-amt').text(Math.round(now))
      },
      duration: 1000,
      easing: "linear"
    });
    var jsonArr = [{'savings': max}];
    jsonArr = JSON.stringify(jsonArr);
    sendMessage(0, jsonArr, 0, doNothing, []);
  } 
  else {
    $('.hatke-discount-cover').css("display", "none");
    $('.hatke-discount-cover:eq(2)').css("display", "block");
  } 
  arrayMsg = JSON.stringify(arrayMsg);
  var jsonArr = [{'cpn_msg': arrayMsg}];
  jsonArr = JSON.stringify(jsonArr);
  sendMessage(1, jsonArr, 12, doNothing, []);
  // console.log(savingsArray);
}
else {
  setTimeout(function(){endProcess(i);},1000);
}
}
function couponInitiate(mytext){
 mytext="HATKE20~"+mytext;     

 if($('.fancy').length>0){
  for(k=0;k<$('.fancy').length;k++){
    var msg = $('.fancy:eq(' + k + ')').text();
    msg = msg.split("coupon");
    if(msg.length>1){
      msg = msg[1];
      msg = msg.trim();
      msg = msg.split(" ");
      msg = msg[0];
      if(msg == msg.toUpperCase()){
        mytext = mytext + msg + "~";
      }
    }
  }
}
// console.log("mytext"+mytext);
couponsLength = mytext.split("~").length - 1;
$('.hdc-c-line:eq(0)').text("We are automatically trying " + couponsLength + " coupon codes for you !");
applyCoupons(mytext); 

}
function applyCoupons(coupons){
 couponsArray = coupons.split("~");
 var savings = [];
 for(var i=0;i<couponsArray.length;i++){
  if(couponsArray[i]!=""&&couponsArray[i]!=" "){

    var cur = couponsArray[i];
    coupArray[i] = cur;
    temp(cur, i, couponsArray.length-1);
  }
}
endProcess(couponsArray.length-2);
}

function getCoupons(){
  for(var i=0;i < 200; i++){
    flagCoupon[i] = 2;
  }
  bestCouponFound = 0;

  $('.hatke-discount-cover:eq(0)').css("display", "block");
  if($('#couponRemove').length>0){
    document.getElementById('couponRemove').click();
  }
  var jsonArr = [{'pos': 13}];
  jsonArr = JSON.stringify(jsonArr);
  sendMessage(1, jsonArr, 7, startCouponProcess, []);



}

function removeTheCover(){
  if($('.hatke-discount-cover').length>0){
    $('.hatke-discount-cover').css("display", "none"); 
  }
}

function couponCheck(){
  var curURL = window.location.href;
  // console.log("CP Check was called");
  if(curURL.split('cleartrip.com/flights/').length>1 || curURL.split('cleartrip.com/hotels/').length>1){
    var imgURL = returnResource("apply-coupon.png");
    // console.log("TEst passed");
    if($('.upSell').length>1){
      $('.upSell:eq(0)').after("<br><div style='clear:both'></div><a id='couponClick' href='javascript:void();'><img style='margin-top: -79px;margin-left: 595px;' src='" + imgURL + "'></a>");
      addToDOM();
      $('.hd-cover-close').click(function(){
window.location.reload();  
});
    $('.hdc-button:eq(2)').click(function(){
window.location.reload();  
});
      var button = document.getElementById("couponClick");
      button.addEventListener("click", function(){
        getCoupons();
      }, false);
    }
    else {
      setTimeout(function(){couponCheck();},1000);
    }
  }
  if(curURL.split('cleartrip.com/packages/').length>1){
    var imgURL = returnResource("apply-coupon.png");
    // console.log("TEst passed1");
    if($('#couponCodeBlock').length>0){
      $('#couponCodeBlock').after("<a id='couponClick' href='javascript:void();'><img style='margin-top:-96px;margin-left:550px;' src='" + imgURL + "'></a>");
      addToDOM();
      $('.hd-cover-close').click(function(){
window.location.reload();  
});
    $('.hdc-button:eq(2)').click(function(){
window.location.reload();  
});
      var button = document.getElementById("couponClick");
      button.addEventListener("click", function(){
        getCoupons();
      }, false);
    }
    else {
      setTimeout(function(){couponCheck();},1000);
    }
  }



}

couponCheck();

