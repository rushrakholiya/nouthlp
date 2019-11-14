/*var testNotifications = function () {

document.addEventListener("deviceready", function () {

  console.warn("testNotifications Started");

  // Checks for permission
   window.plugin.notification.local.hasPermission(function (granted) {

    console.warn("Testing permission");

    if( granted == false ) {

      console.warn("No permission");
      // If app doesnt have permission request it
       window.plugin.notification.local.registerPermission(function (granted) {

        console.warn("Ask for permission");
        if( granted == true ) {

          console.warn("Permission accepted");
          // If app is given permission try again
          testNotifications();

        } else {
          alert("We need permission to show you notifications");
        }

      });
    } else {

      var pathArray = window.location.pathname.split( "/www/" ),
          secondLevelLocation = window.location.protocol +"//"+ pathArray[0],
          now = new Date();


      console.warn("sending notification");

      var isAndroid = false;

      if ( device.platform === "Android" ) {
        isAndroid = true;
      }

       window.plugin.notification.local.schedule({
          id: 9,
          title: "Test notification 9",
          text: "This is a test notification",
          sound: isAndroid ? "file://sounds/notification.mp3" : "file://sounds/notification.caf",
          at: new Date( new Date().getTime() + 10 )
          // data: { secret:key }
      });

    }

  });

  }, false);

};*/
var id = 1, dialog;

callback = function () {
    cordova.plugins.notification.local.getIds(function (ids) {
        showToast('IDs: ' + ids.join(' ,'));
    });
};

showToast = function (text) {
    setTimeout(function () {
        if (device.platform != 'windows') {
            window.plugins.toast.showShortBottom(text);
        } else {
            showDialog(text);
        }
    }, 100);
};

showDialog = function (text) {
    if (dialog) {
        dialog.content = text;
        return;
    }

    dialog = new Windows.UI.Popups.MessageDialog(text);

    dialog.showAsync().done(function () {
        dialog = null;
    });
};

schedule = function (alertObject) {
    /*cordova.plugins.notification.local.schedule({
        id: 1,
        text: 'Test Message 1',
        icon: 'http://3.bp.blogspot.com/-Qdsy-GpempY/UU_BN9LTqSI/AAAAAAAAAMA/LkwLW2yNBJ4/s1600/supersu.png',
        smallIcon: 'res://cordova',
        sound: null,
        badge: 1,
        data: { test: id }
    });*/
    /*cordova.plugins.notification.local.schedule({
        id: 1,
        title: 'Remind',
        text: 'This is Description',
        every: "second",        
        trigger: { at: new Date(2018, 01, 28) },
        data: {count:1, totalCount:5 }
    });*/   

    var alertNotificationsObj = {};
    if(typeof alertObject !== "undefined" && alertObject != "" && alertObject != null)
    {   
        alertNotificationsObj['id'] = alertObject.id;
        alertNotificationsObj['title'] = alertObject.alert_name;
        alertNotificationsObj['text'] = alertObject.alert_description;
        alertNotificationsObj['every'] = parseInt(alertObject.alert_intervals);
        var dateSplittedValue = alertObject.date.split("-");
        var timeSplittedValue = alertObject.time.split(":");        
        var alertDataObj = {};        
        var triggerAtObj = {};
        triggerAtObj['at'] = new Date(dateSplittedValue[0], dateSplittedValue[1], dateSplittedValue[2], timeSplittedValue[0], timeSplittedValue[1]);
        alertNotificationsObj['trigger'] = triggerAtObj;
        alertDataObj['totalCount'] = alertObject.alert_count;
        alertNotificationsObj['data'] = alertDataObj;
        cordova.plugins.notification.local.schedule(alertNotificationsObj);        
    }    
};

alertCancel = function(alertid){    
    cordova.plugins.notification.local.cancel(alertid, callback);
};

document.addEventListener('deviceready', function () {

    cordova.plugins.notification.local.on('schedule', function (notification) {
        console.log('onschedule', arguments);
        // showToast('scheduled: ' + notification.id);
    });

    cordova.plugins.notification.local.on('update', function (notification) {
        console.log('onupdate', arguments);
        // showToast('updated: ' + notification.id);
    });

    cordova.plugins.notification.local.on('trigger', function (notification) {        
        //cordova.plugins.notification.local.cancel(notification.id, callback);
        console.log(notification.data);
        totalCount = JSON.parse(notification.data).totalCount;
        totalCount = parseInt(totalCount) + 1;

        if(typeof localStorage['alerts'] !== "undefined" && localStorage['alerts'] != "" && localStorage['alerts'] != null)
        {
            jsonAlertObject = JSON.parse(localStorage['alerts']);      
            $.each(jsonAlertObject, function(index, value){                
                if(( index + 1) == notification.id){
                    value.alerted_count = parseInt(value.alerted_count) + 1;
                    if(value.alerted_count == totalCount){                        
                        cordova.plugins.notification.local.cancel(notification.id, callback);
                    }
                }                
            });
            console.log("JSON ALERT OBJECT :" + JSON.stringify(jsonAlertObject));
            localStorage['alerts'] = JSON.stringify(jsonAlertObject);
        }

        console.log('ontrigger', notification);
        showToast('triggered: ' + notification.id);
    });

    cordova.plugins.notification.local.on('click', function (notification) {
        console.log('onclick', arguments);
        showToast('clicked: ' + notification.id);
    });

    cordova.plugins.notification.local.on('cancel', function (notification) {
        console.log('oncancel', arguments);
        // showToast('canceled: ' + notification.id);
    });

    cordova.plugins.notification.local.on('clear', function (notification) {
        console.log('onclear', arguments);
        showToast('cleared: ' + notification.id);
    });

    cordova.plugins.notification.local.on('cancelall', function () {
        console.log('oncancelall', arguments);
        // showToast('canceled all');
    });

    cordova.plugins.notification.local.on('clearall', function () {
        console.log('onclearall', arguments);
        // showToast('cleared all');
    });   
    
    var callbackIds = function (ids) {
        console.log(ids);
        showToast(ids.length === 0 ? '- none -' : ids.join(' ,'));
    };
}, false);

document.addEventListener("deviceready", function () {
  document.addEventListener("offline", onOffline, false);  
  document.addEventListener("online", onOnline, false);
});

function onOffline() {
  console.log("IN OFFLINE");
}

function onOnline() {
    console.log("IN ONLINE");
}