/*
 *  copyright(c) activecore,Inc. 2005-2013
 * 
 *  This software is licensed by activecore, Inc.
 *  You CAN NOT use this file except in compliance with the License.
 *
 *  Product  : ac propoza
 *  Version  : 5.0 
 *  Rev      : 1.0
 *  Last Update: 2013/08/28
 *
 *  Modification History
 *  ----------  -----------------------------------------------------
 *  V50-001     item_id.length 32 -> 64
 */
var _ac_clip_name = 'ac_clip';
var _max_ac_clip_items = 10;

/*
 *  get Cookie 
 */
function _acClipGetCookie(cn) {
   var get_data = document.cookie;
   var cv = new Array();
   var gd = get_data.split(";");
   for (var i = 0; i < gd.length; i++) { 
      var a = gd[i].split("=");
      a[0] = a[0].replace(" ","");
      cv[a[0]] = a[1];
   }
   if (cv[cn]) return cv[cn];
   else return "";
}

/*
 *  Set Cookie
 */
function _acClipSetCookie(cn, val) {
   document.cookie = cn + "=" + val + "; path=/; expires=Thu, 1-Jan-2030 00:00:00 GMT;";
}

/*
 *  Set item_id into Cookie
 */
function _ac_item_clip(item_id) {
    if (!item_id) {
        return;
    }
    var pos = -1;
    if ((pos = item_id.indexOf('ac_item_no=')) >= 0) {
        item_id = item_id.substring(pos + 'ac_item_no='.length);
        if (item_id == '') {
            return;
        }
    }
    //if (item_id.length > 32) { V50-001
    if (item_id.length > 64) {
        return;
    }
    _ac_clip(item_id, _ac_clip_name, 'i:');
}

/*
 *  Set contents_id into Cookie
 */
function _ac_contents_clip(contents_id) {
    if (!contents_id) {
        return;
    }
    var pos = -1;
    if ((pos = contents_id.indexOf('contents_id=')) >= 0) {
        contents_id = contents_id.substring(pos + 'contents_id='.length);
        if (contents_id == '') {
            return;
        }
    }
    if (contents_id.length > 64) {
        return;
    }
    _ac_clip(contents_id, _ac_clip_name, 'c:');
}

/*
 *  Set item_id into Cookie
 */
function _ac_clip(item_id, cookieName, prefix) {
    if (!item_id) {
        return;
    }
    var ckval = _acClipGetCookie(cookieName);
    var itemList = null;
    var otherList = '';
    // parse cookie value
    if (ckval != '') {
        var sp = ckval.split("*");
        if (sp.length > 0) {
            for (var i = 0; i < sp.length; i++) {
                if (sp[i].indexOf(prefix) == 0) {
                    var sz = sp[i].substring(prefix.length);
                    if (sz.length == 0) {
                        continue;
                    } 
                    var sy = sz.split(',');
                    if (sy.length > 0) {
                        itemList = sy;
                    }
                } else {
                    otherList += sp[i];
                }
            }
        }
    }   
    // set new cookie value
    var newCkVal = prefix + item_id;
    var newCount = 1;
    if (itemList != null) {
        for (var i = 0; i < itemList.length; i++) {
            if (itemList[i] == item_id) {
                continue;
            }
            if (++newCount > _max_ac_clip_items) {
                break;
            }
            newCkVal += ',' + itemList[i];
        }
    }
    if (otherList != '') {
        newCkVal += '*' + otherList;
    }
    _acClipSetCookie(cookieName, newCkVal);
}


