/** @license SPA.js Validation Extension | (c) Kumararaja <sucom.kumar@gmail.com> | License (MIT) */
/*
* SPA.js Validation Extension
* version: 2.0.0
* Author: Kumar
* */

spa['_validateDefaults'] = {
    required    : 'Required'
  , digits      : 'Digits'
  , numbers     : 'Numbers'
  , integer     : 'Integer'
  , alphabet    : 'Alpha'
  , alphanumeric: 'AlphaNumeric'
  , pattern     : 'PatternMatch'
  , range       : 'ValueRange'
  , fixedlength : 'Lengths'
  , minlength   : 'LengthMin'
  , maxlength   : 'LengthMax'
  , email       : 'Email'
  , url         : 'Url'
  , date        : 'Date'
  , cardno      : 'CardNo'
  , ipv4        : 'IPv4'
  , ipv6        : 'IPv6'
  , ipaddress   : 'IP'
  , subnetmask  : 'Subnet'
  , phoneUS     : 'PhoneUS'
  , wordsize    : 'WordSize'
};

spa['_validate'] = {
  _isOnOfflineValidation : false,
  _validateAlertTemplate : '<div class="errortxt break-txt" data-i18n=""></div>',
  _offlineValidationRules : {},
  _fn : {
      Required    : function _fnRequired(obj, msg) {
                      var elValue = spa.getElValue(obj);
                      return spa['_validate']._showValidateMsg(obj, msg, !(spa.isBlank(elValue)));
                    }
    , Digits      : function _fnValidDigits(obj, msg) {
                      var elValue = $(obj).val();
                      var isValid = ( (elValue.length===0) || (/^\d+$/.test(elValue)) );
                      return spa['_validate']._showValidateMsg(obj, msg, isValid);
                    }
    , Numbers     : function _fnValidNumbers(obj, msg) {
                      var elValue = $(obj).val();
                      var isValid = ( (elValue.length===0) || (/^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(elValue)) );
                      return spa['_validate']._showValidateMsg(obj, msg, isValid);
                    }
    , Integer     : function _fnValidInteger(obj, msg) {
                      var elValue = $(obj).val();
                      var isValid = ( (elValue.length===0) || (/^-?\d+$/.test(elValue)) );
                      return spa['_validate']._showValidateMsg(obj, msg, isValid);
                    }
    , Alpha       : function _fnValidAlpha(obj, msg) {
                      var elValue = $(obj).val();
                      var isValid = ( (elValue.length===0) || !(/[^a-z]/gi.test(elValue)) );
                      return spa['_validate']._showValidateMsg(obj, msg, isValid);
                    }
    , AlphaNumeric: function _fnValidAlphaNumeric(obj, msg) {
                      var elValue = $(obj).val();
                      var isValid = ( (elValue.length===0) || !(/[^a-z0-9]/gi.test(elValue)) );
                      return spa['_validate']._showValidateMsg(obj, msg, isValid);
                    }
    , PatternMatch: function _fnValidPatternMatch(obj, msg) {
                      var elValue = $(obj).val();
                      var isValid = (elValue.length===0);
                      if (!isValid)
                      { var rx = new RegExp($(obj).data("validatePattern"), $(obj).data("validatePatternOptions").replace(/!/g,""));
                        isValid = rx.test(elValue);
                        if ($(obj).data("validatePatternOptions").indexOf("!")>=0) isValid = !isValid;
                      }
                      return spa['_validate']._showValidateMsg(obj, msg, isValid);
                    }
    , ValueRange  : function _fnValidValueRange(obj, msg) {
                      var elValue = $(obj).val();
                      var isValid = (elValue.length===0);
                      if (!isValid)
                      { isValid = false;
                        if (/^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(elValue)) {
                          var uValue  = spa.toFloat(elValue);
                          var rLimits = (" "+($(obj).data("validateRange") || "")+": ").split(":");
                          var checkMin = !spa.isBlank(rLimits[0]);
                          var checkMax = !spa.isBlank(rLimits[1]);
                          var rMin = spa.toFloat(rLimits[0]);
                          var rMax = spa.toFloat(rLimits[1]);
                          if (checkMin && checkMax)
                          { isValid = ((uValue >= rMin) && (uValue <= rMax));
                          }
                          else if (checkMin)
                          { isValid = (uValue >= rMin);
                          }
                          else if (checkMax)
                          { isValid = (uValue <= rMax);
                          }
                        }
                      }
                      return spa['_validate']._showValidateMsg(obj, msg, isValid);
                    }
    , LengthMin   : function _fnValidLengthMin(obj, msg) {
                      var elValue = $(obj).val();
                      var minLen  = spa.toInt($(obj).attr("minlength"));
                      var isValid = (elValue.length >= minLen);
                      return spa['_validate']._showValidateMsg(obj, msg, isValid);
                    }
    , LengthMax   : function _fnValidLengthMax(obj, msg) {
                      var elValue = $(obj).val();
                      var maxLen  = spa.toInt($(obj).attr("maxlength"));
                      var isValid = (elValue.length <= maxLen);
                      return spa['_validate']._showValidateMsg(obj, msg, isValid);
                    }
    , Lengths     : function _fnValidLengths(obj, msg){
                      var elValue = $(obj).val();
                      var eLength = elValue.length;
                      var minLen  = spa.toInt($(obj).attr("minlength"));
                      var maxLen  = spa.toInt($(obj).attr("maxlength"));
                      var isValid = ((eLength >= minLen) && (eLength <= maxLen));
                      return spa['_validate']._showValidateMsg(obj, msg, isValid);
                    }
    , WordSize    : function _fnValidWordSize(obj, msg) {
                      var elValue = $(obj).val();
                      var maxWordSize = _.max(_.map((''+elValue).replace(/[-\n]/g,' ').split(' '), function(w) { return w.length; }));
                      var validWordSize = spa.toInt($(obj).data("validWordSize")) || 20;
                      var isValid = (maxWordSize <= validWordSize);
                      return spa['_validate']._showValidateMsg(obj, msg, isValid);
                    }
    , Email       : function _fnValidEmail(obj, msg) {
                      var elValue = $(obj).val();
                      var isValid = (elValue.length===0);
                      if (!isValid) {
                        isValid = ( (/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i.test(elValue)
                                 || /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/i.test(elValue))
                                 && /[a-z0-9]/i.test((elValue[elValue.length-1]))
                                  );
                      }
                      return spa['_validate']._showValidateMsg(obj, msg, isValid);
                    }
    , Url         : function _fnValidUrl(obj, msg) {
                      var elValue = $(obj).val();
                      var isValid = (elValue.length===0);
                      if (!isValid) {
                        isValid = /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(elValue);
                      }
                      return spa['_validate']._showValidateMsg(obj, msg, isValid);
                    }
    , Date        : function _isValidDate(obj, msg) {
                      var elValue = $(obj).val();
                      var isValid = (elValue.length===0);
                      if (!isValid)
                      { isValid = false;
                        var monthsS = ["", "JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
                        var monthsL = ["", "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];
                        var _dateFormat = $(obj).data("validateFormat") || "YMD";
                        var dPattern = "^\\d{1,2}[\\/\\-\\.]\\d{1,2}[\\/\\-\\.]\\d{4}$";
                        var yyyy, mm, dd, mIndex;
                        var mName = elValue.replace(/[^a-z]/gi, "");
                        if (mName) {
                          mIndex = _.indexOf(monthsS, mName.toUpperCase());
                          if (mIndex<=0) mIndex = _.indexOf(monthsL, mName.toUpperCase());
                          if (mIndex>0) {
                            elValue = elValue.replace(new RegExp(mName,"gi"), mIndex);
                          }
                        }
                        elValue = elValue.replace(/[^0-9]/g," ").normalizeStr().replace(/ /g, "/");
                        var dArr = elValue.split('/');
                        switch(_dateFormat.toUpperCase()){
                          case "YMD":
                            dPattern = "^\\d{4}[\\/\\-\\.]\\d{1,2}[\\/\\-\\.]\\d{1,2}$";
                            yyyy = dArr[0];
                            mm   = dArr[1];
                            dd   = dArr[2];
                            break;
                          case "MDY":
                            mm   = dArr[0];
                            dd   = dArr[1];
                            yyyy = dArr[2];
                            break;
                          case "DMY":
                            dd   = dArr[0];
                            mm   = dArr[1];
                            yyyy = dArr[2];
                            break;
                        }
                        if ((new RegExp(dPattern,"")).test(elValue))
                        { dd   = parseInt(dd,10);
                          mm   = parseInt(mm,10);
                          yyyy = parseInt(yyyy,10);
                          var xDate = new Date(yyyy,mm-1,dd);
                          isValid = ( ( xDate.getFullYear() === yyyy ) && ( xDate.getMonth() === mm - 1 ) && ( xDate.getDate() === dd ) );
                        }
                      }
                      return spa['_validate']._showValidateMsg(obj, msg, isValid);
                    }
    , CardNo      : function _fnValidCardNo(obj, msg){
                      var elValue = $(obj).val();
                      var isValid = (elValue.length===0);
                      if (!isValid)
                      { // accept only spaces, digits and dashes
                        if ( /[^0-9 \-]+/.test(elValue) )
                        { isValid = false;
                        }
                        else
                        { var nCheck = 0, nDigit = 0, bEven = false;
                          var cValue = elValue.replace(/\D/g, "");
                          for (var n = cValue.length - 1; n >= 0; n--)
                          { var cDigit = cValue.charAt(n);
                            nDigit = parseInt(cDigit, 10);
                            if (bEven)
                            { if ((nDigit *= 2) > 9)
                              { nDigit -= 9;
                              }
                            }
                            nCheck += nDigit;
                            bEven = !bEven;
                          }
                          isValid = ((nCheck % 10) === 0);
                        }
                      }
                      return spa['_validate']._showValidateMsg(obj, msg, isValid);
                    }
    , IPv4        : function _fnValidIpv4(obj, msg){
                      var elValue = $(obj).val();
                      var isValid = (elValue.length===0);
                      if (!isValid){
                        isValid = ((/^(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)$/i.test(elValue))
                                    && ( _.every(elValue.split('.'), function(part){ return ((part.length>1)? (!part.beginsWithStr("0")) : true); }) ));
                      }
                      return spa['_validate']._showValidateMsg(obj, msg, isValid);
                    }
    , IPv6        : function _fnValidIpv6(obj, msg){
                      var elValue = $(obj).val();
                      var isValid = (elValue.length===0);
                      if (!isValid){
                        isValid = /^((([0-9A-Fa-f]{1,4}:){7}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){6}:[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){5}:([0-9A-Fa-f]{1,4}:)?[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){4}:([0-9A-Fa-f]{1,4}:){0,2}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){3}:([0-9A-Fa-f]{1,4}:){0,3}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){2}:([0-9A-Fa-f]{1,4}:){0,4}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){6}((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|(([0-9A-Fa-f]{1,4}:){0,5}:((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|(::([0-9A-Fa-f]{1,4}:){0,5}((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|([0-9A-Fa-f]{1,4}::([0-9A-Fa-f]{1,4}:){0,5}[0-9A-Fa-f]{1,4})|(::([0-9A-Fa-f]{1,4}:){0,6}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){1,7}:))$/i.test(elValue);
                      }
                      return spa['_validate']._showValidateMsg(obj, msg, isValid);
                    }
    , IP          : function _fnValidIpAddress(obj, msg) {
                      var elValue = $(obj).val();
                      var isValid = (elValue.length===0);
                      if (!isValid)
                      { var strIpAddr = elValue;
                        var noOfOctates = (spa.toInt($(obj).data("validateIpaddressOctates") || 4)) - 1;
                        var rxValidIp = new RegExp("^(([01]?[0-9]?[0-9]|2([0-4][0-9]|5[0-5]))\\.){"+noOfOctates+"}([01]?[0-9]?[0-9]|2([0-4][0-9]|5[0-5]))$", "g");
                        isValid = ((rxValidIp.test(strIpAddr)) && ( _.every(strIpAddr.split('.'), function(part){ return ((part.length>1)? (!part.beginsWithStr("0")) : true); }) ));
                        spa['_validate']._showValidateMsg(obj, msg, isValid);
                        var ipClass = $(obj).data("validateIpaddressClass");
                        if ((isValid) && (ipClass))
                        { var octates = strIpAddr.split('.');
                          var octRange = {
                            A:{ oct1:{B:0  , E:127}, oct2:{B:0, E:256}, oct3:{B:0, E:256}, oct4:{B:1, E:255} },
                            B:{ oct1:{B:127, E:192}, oct2:{B:1, E:256}, oct3:{B:0, E:256}, oct4:{B:0, E:255} },
                            C:{ oct1:{B:191, E:224}, oct2:{B:0, E:256}, oct3:{B:1, E:256}, oct4:{B:1, E:255} },
                            D:{ oct1:{B:223, E:240}, oct2:{B:0, E:256}, oct3:{B:0, E:256}, oct4:{B:0, E:256} },
                            E:{ oct1:{B:239, E:255}, oct2:{B:0, E:256}, oct3:{B:0, E:256}, oct4:{B:0, E:255} }
                          };
                          //                       1                                              2                                             3                                             4                                             5                                             6                                             7                                            8
                          isValid = ((octates[0]*1 > octRange[ipClass].oct1.B)   && (octates[0]*1 < octRange[ipClass].oct1.E))? (((octates[1]*1 >= octRange[ipClass].oct2.B) && (octates[1]*1 < octRange[ipClass].oct2.E))? (((octates[2]*1 >= octRange[ipClass].oct3.B) && (octates[2]*1 < octRange[ipClass].oct3.E))? (((octates[3]*1 > octRange[ipClass].oct4.B) && (octates[3]*1 < octRange[ipClass].oct4.E))? true : false) : false) : false) : false;
                          spa['_validate']._showValidateMsg(obj, msg, isValid);
                        }
                      }

                      return isValid;
                    }
    , Subnet      : function _fnValidSubnet(obj, msg) {
                      var elValue = $(obj).val();
                      var isValid = (elValue.length===0);
                      if (!isValid) {
                        var rxSubnet = new RegExp("^((128|192|224|240|248|252|254)\\.0\\.0\\.0)|(255\\.(((0|128|192|224|240|248|252|254)\\.0\\.0)|(255\\.(((0|128|192|224|240|248|252|254)\\.0)|255\\.(0|128|192|224|240|248|252|254)))))$");
                        isValid = ((rxSubnet.test(elValue)) && ( _.every(elValue.split('.'), function(part){ return ((part.length>1)? (!part.beginsWithStr("0")) : true); }) ));
                      }
                      return spa['_validate']._showValidateMsg(obj, msg, isValid);
                    }
    , PhoneUS     : function _fnValidPhoneUS(obj, msg) {
                      var elValue = $(obj).val();
                      var isValid = (elValue.length===0);
                      if (!isValid) {
                        isValid= (elValue.length > 9 && elValue.match(/^(\+?1-?)?(\([2-9]\d{2}\)|[2-9]\d{2})-?[2-9]\d{2}-?\d{4}$/));
                      }
                      return spa['_validate']._showValidateMsg(obj, msg, isValid);
                    }
  }
  , _showValidateMsg : function __showValidateMsg(forObj, msg, isValid, errMsgTemplate) {
                      msg = msg || "";
                      if ((arguments.length>2) && _.isString(isValid)) { errMsgTemplate = isValid; }
                      if ((arguments.length>2) && _.isBoolean(isValid) && (isValid)) { msg = ""; }
                      errMsgTemplate = errMsgTemplate || spa['_validate']._validateAlertTemplate;

                      var isCustomErrMsgElement = (!errMsgTemplate.beginsWithStrIgnoreCase('<'));

                      forObj = $($(forObj).data("validateMsgEl")||forObj).get(0);
                      var alertObj = (isCustomErrMsgElement)? $(errMsgTemplate) : $(forObj).next();
                      var i18nSpec = "";
                      if ((($(alertObj).attr("class")) === ($(errMsgTemplate).attr("class"))) || isCustomErrMsgElement)
                      { if (msg.beginsWithStrIgnoreCase("i18n:"))
                        { var i18nKey = msg.replace(/i18n:/gi,"");
                          i18nSpec = "{html:'"+i18nKey+"'}";
                          msg = $.i18n.prop(i18nKey);
                        }
                        if (!spa['_validate']._isOnOfflineValidation)
                        { $(alertObj).data("i18n",i18nSpec);
                          $(alertObj).html(msg);
                        }
                      }
                      else
                      { if (!spa.isBlank(msg))
                        { $(errMsgTemplate).insertAfter($(forObj));
                          spa['_validate']._showValidateMsg(forObj, msg, isValid, errMsgTemplate);
                        }
                      }
                      return isValid;
                    }
  , expose: function(exposeTo){
    exposeTo = exposeTo || {};
    Object.keys(spa['_validateDefaults']).forEach(function(key){
      exposeTo[key] = spa['_validate']['_fn'][spa['_validateDefaults'][key]];
    });
    return exposeTo;
  }
};

function _clearSpaValidateMsg(forObj){
  spa['_validate']._showValidateMsg(forObj);
  return true;
}

var _check = spa['_validate'].expose();

spa['initValidation'] = spa['initDataValidation'] = function(context){
  /* apply same rules if mult-events specified with underscore eg: onFocus_onBlur_onKeyup */
  spa.console.log('>>>>> initDataValidation request for context:'+context);

  var splitValidateEvents = function(eObj) {
    eObj = eObj || {};
    _.each(_.keys(eObj), function(eNames){
      if (eNames.indexOf("_")>0){
        _.each(eNames.split("_"), function(eName){
          if (eObj[eName])
          { if (_.isArray(eObj[eName]))
            { eObj[eName].push(eObj[eNames]);
            } else
            { eObj[eName] = [eObj[eName], eObj[eNames]];
            }
          }
          else
          { eObj[eName] = [eObj[eNames]];
          }
        });
        delete eObj[eNames];
      }
    });
    return eObj;
  };

  context = context || "body";
  var $context = $(context);
  var elSelector = $context.data("validateElFilter") || "";
  var commonValidateRules = splitValidateEvents(spa.toJSON($context.data("validateCommon")||"{}"));
  spa.console.log('keys Of commonValidateRules');
  spa.console.log(_.keys(commonValidateRules));

  var addRule2El, addRule2ElDir, overrideOfflineRule2El, elOfflineRule, commonRule2El;
  var offlineValidationKey = ($context.data("validateForm") || $context.data("validateScope")||"").replace(/[^a-zA-Z0-9]/g,'');
  if (spa.isBlank(offlineValidationKey)) {
    var contextName = context.replace(/[^a-zA-Z0-9]/g,'');
    if (!spa['_validate']._offlineValidationRules.hasOwnProperty(contextName)) {
      offlineValidationKey = contextName;
    }
  }
  spa.console.log('offlineValidationKey: '+offlineValidationKey);
  var prepareOfflineValidationRules = (!spa.isBlank(offlineValidationKey));
  if (prepareOfflineValidationRules)
  { spa['_validate']._offlineValidationRules[offlineValidationKey] = {rules:{}};
  }

  $context.find(elSelector+"[data-validate]").each(function(index, el){
    var elID = $(el).prop("id");
    var elValidateRules={};
    var elValidateRuleSpec = $(el).data("validate");
    if (elValidateRuleSpec && elValidateRuleSpec.indexOf("{")<0)
    { var elValidateEvents     = ($(el).data("validateEvents")||"onBlur").replace(/[^a-z]/gi," ").normalizeStr().replace(/ /g,"_");
      var elValidateOffline    = ",offline:"+($(el).data("validateOffline")||"false");
      var elValidateFunctions  = "{fn:"+(elValidateRuleSpec.replace(/[,;]/," ").normalizeStr().replace(/ /g, elValidateOffline+"},{fn:"))+elValidateOffline+"}";
      elValidateRuleSpec = "{"+elValidateEvents+":["+elValidateFunctions+"]}";
      //$(el).data("validate", elValidateRuleSpec);
    }
    elValidateRules = splitValidateEvents(spa.toJSON(elValidateRuleSpec));
    spa.console.log(elValidateRuleSpec);

    /* Apply common events' rule to each element */
    _.each( _.keys(commonValidateRules), function(commonValidateOnEvent){
      var oCommonValidateRules = commonValidateRules[commonValidateOnEvent];
      if (!_.isArray(oCommonValidateRules))
      { oCommonValidateRules = [oCommonValidateRules];
      }
      oCommonValidateRules.reverse();

      _.each(oCommonValidateRules, function(oCommonValidateRule){
        addRule2El=true; addRule2ElDir="<"; elOfflineRule=oCommonValidateRule["offline"]||false; overrideOfflineRule2El=false;
        if (oCommonValidateRule["el"]) {
          var elArrayWithDir    = oCommonValidateRule["el"].replace(/ /g, '').split(",");
          var elArrayWithOutDir = oCommonValidateRule["el"].replace(/[< >!]/g,"").split(",");
          var elIndexInList = _.indexOf(elArrayWithOutDir, elID);
          addRule2El = (elIndexInList>=0);
          if (addRule2El)
          { addRule2ElDir = (elArrayWithDir[elIndexInList].indexOf(">")>=0)? ">" : "<";
            overrideOfflineRule2El = (elArrayWithDir[elIndexInList].indexOf("!")>=0);
          }
        }
        else if (oCommonValidateRule["ex"]) {
          addRule2El = (_.indexOf(oCommonValidateRule["ex"].replace(/[< >!]/g, '').split(","), elID)<0);
        }

        if (addRule2El)
        { commonRule2El = _.omit(oCommonValidateRule, ["el","ex"]);
          if (overrideOfflineRule2El) commonRule2El =  _.extend(commonRule2El, {offline:(!elOfflineRule)});
          if (!elValidateRules[commonValidateOnEvent]) elValidateRules[commonValidateOnEvent] = [];
          elValidateRules[commonValidateOnEvent] = (addRule2ElDir==="<")? _.union([commonRule2El], elValidateRules[commonValidateOnEvent]) : _.union(elValidateRules[commonValidateOnEvent], [commonRule2El]);
        }
      });
    });

    _.each(_.keys(elValidateRules), function(validateOnEvent){
      var jqEventName = ((validateOnEvent.substring(2,3)).toLowerCase())+(validateOnEvent.substring(3));
      spa.console.log("settingup event on["+jqEventName+"]...");

      //Convert element rules to array
      if (!_.isArray(elValidateRules[validateOnEvent])){
        elValidateRules[validateOnEvent] = [elValidateRules[validateOnEvent]];
      }

      if (prepareOfflineValidationRules)
      { _.each(elValidateRules[validateOnEvent], function(elValidateRule4Event){
          if (elValidateRule4Event.offline) {
            var newRule = {fn:elValidateRule4Event.fn, msg:elValidateRule4Event.msg};
            if (!spa['_validate']._offlineValidationRules[offlineValidationKey].rules[elID]) spa['_validate']._offlineValidationRules[offlineValidationKey].rules[elID] = [];
            if (_.indexOf(spa['_validate']._offlineValidationRules[offlineValidationKey].rules[elID], newRule)<0) {
              spa['_validate']._offlineValidationRules[offlineValidationKey].rules[elID].push(newRule);
            }
          }
        });
      }

      spa.console.log('registering an event: '+validateOnEvent);
      if (validateOnEvent.beginsWithStrIgnoreCase('on')) {
        $(el).on(jqEventName, function(){
          var el = this;
          _.every(elValidateRules[validateOnEvent], function(validateRule){
            if (_.isArray(validateRule))
            { return _.every(validateRule, function(validateRuleInArray){
                return (validateRuleInArray.fn(el, (validateRuleInArray.msg || $(el).data("validateMsg") || "")));
              });
            }
            else
            { return (validateRule.fn(el, (validateRule.msg || $(el).data("validateMsg") || "")));
            }
          });
        });
      }

    });
  });
};

spa['validate'] = spa['doDataValidation'] = function(context, showMsg){
  var rulesScopeID     = (context.replace(/[^a-zA-Z0-9]/g,''))
    , validationScope  = "#"+(context.replace(/#/g, ""))
    , $validationScope = $(validationScope)
    , failedInfo={}, isAllOk;

  if (spa['_validate']._offlineValidationRules[rulesScopeID])
  { var vRules = spa['_validate']._offlineValidationRules[rulesScopeID].rules;

    var applyRules = function(elID){
      var $el = $validationScope.find("#"+elID);
      //var ignValidation = spa.toBoolean($el.data("ignoreValidationIfInvisible"));
      //var isVisible = $el.is(":visible");
      //if ($el.prop("type") && $el.prop("type").equalsIgnoreCase("hidden")) debugger;
      var retValue = (spa.toBoolean($el.data("ignoreValidationIfInvisible")) && !($el.is(":visible")));
      if (!retValue)
      { retValue = _.every(vRules[elID], function(vRule){
          var fnResponse = vRule.fn($el, vRule.msg);
          if (!fnResponse) { failedInfo = {errcode:2, el:$el, fn:vRule.fn, msg:vRule.msg}; }
          return fnResponse;
        });
      }
      return retValue;
    };

    if ($.isEmptyObject(vRules))
    { failedInfo = {errcode:1, errmsg:"Rules not found in scope ["+context+"]."};
    }
    else
    { spa['_validate']._isOnOfflineValidation = !showMsg;
      isAllOk = _.every(_.keys(vRules), function(elID){
        return (applyRules(elID));
      });
      spa['_validate']._isOnOfflineValidation = false;
    }
  }
  else
  { failedInfo = {errcode:1, errmsg:"Scope not found."};
  }

  return(failedInfo);
};
