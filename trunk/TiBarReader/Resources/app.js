// TiBar Test App
Titanium.UI.setBackgroundColor('#fff');
var tabGroup = Titanium.UI.createTabGroup();
var win = Titanium.UI.createWindow({
    title:'TiBar Test',
    backgroundImage:'bg.png',
    tabBarHidden:true
});
var tab = Titanium.UI.createTab({
    title:'TiBar Test',
    window:win
});

// TiBar module
var TiBar = require('tibar');
Ti.API.info("module is => "+TiBar);

// Configuration
// VC - ZBarReaderViewController
// C - ZBarReaderController
//
//var config = {
//    classType: "ZBarReaderController", // ZBarReaderViewController, ZBarReaderController
//    sourceType: "Album", // Library(C), Camera(VC), Album(C)
//    cameraMode: "Default", // Default, Sampling, Sequence
//    config:{
//        "showsCameraControls":true, // (VC)
//        "showsZBarControls":true,
//        "tracksSymbols":true,
//        "enableCache":true,
//        "showsHelpOnFail":true,
//        "takesPicture":false
//    },
//    custom:{ // not implemented yet
//        "scanCrop":'',
//        "CFG_X_DENSITY":'',
//        "CFG_Y_DENSITY":'',
//        "continuous":''
//    },
//    symbol:{
//        "QR-Code":true,
//        "CODE-128":false,
//        "CODE-39":false,
//        "I25":false,
//        "DataBar":false,
//        "DataBar-Exp":false,
//        "EAN-13":false,
//        "EAN-8":false,
//        "UPC-A":false,
//        "UPC-E":false,
//        "ISBN-13":false,
//        "ISBN-10":false,
//        "PDF417":false
//    }
//};

var allConfigWithDefaults = {
    classType:[
        {"ZBarReaderViewController":false},
        {"ZBarReaderController":true}
    ],
    sourceType:[
        {"Library":false},
        {"Camera":false},
        {"Album":true}
    ],
    cameraMode:[
        {"Default":true},
        {"Sampling":false},
        {"Sequence":false}
    ],
    config:{
        "showsCameraControls":true,
        "showsZBarControls":true,
        "tracksSymbols":true,
        "enableCache":true,
        "showsHelpOnFail":true,
        "takesPicture":false
    },
    custom:{
        "scanCrop":'',
        "CFG_X_DENSITY":'',
        "CFG_Y_DENSITY":'',
        "continuous":''
    },
    symbol:{
        "QR-Code":true,
        "CODE-128":false,
        "CODE-39":false,
        "I25":false,
        "DataBar":false,
        "DataBar-Exp":false,
        "EAN-13":false,
        "EAN-8":false,
        "UPC-A":false,
        "UPC-E":false,
        "ISBN-13":false,
        "ISBN-10":false,
        "PDF417":false
    }
};

var topOffset = 5;
var data = [],c=0;
for(var section in allConfigWithDefaults){
    if (typeof allConfigWithDefaults[section] === 'object' && allConfigWithDefaults[section] instanceof Array){
        var label = Titanium.UI.createLabel({
            color:'#4d576d',
            text:section,
            font:{ fontFamily:'Helvetica', fontSize:17, fontWeight:'bold' },
            shadowColor:'#fafafa',
            shadowOffset:{ x:0, y:1 },
            left:18,
            width:'auto',
            height:20,
            top:topOffset
        });
        win.add(label);
        topOffset+=25;
        var arrSet = [];
        var selectedIx = 0,tmpix=0;
        for(var itemix in allConfigWithDefaults[section])
        {
            for(var labelname in allConfigWithDefaults[section][itemix]){
                arrSet.push(labelname);
                if(allConfigWithDefaults[section][itemix][labelname]){
                    selectedIx= tmpix;                    
                }
                tmpix++;
            }
        }
        var sectionTabbedBar = Titanium.UI.createTabbedBar({
            labels:arrSet,
            style:Titanium.UI.iPhone.SystemButtonStyle.BAR,
            top:topOffset,
            height:25,
            width:310,
            index:selectedIx,
            tibar:{
                section:section
            }
        });
        sectionTabbedBar.addEventListener('click', (function(s){
            return function(e){
                for(var i in s){
                    for(var i2 in s[i]){
                        s[i][i2]=false;
                        if(i==e.index){
                            s[i][i2]=true;
                        }
                    }
                }
            }
        })(allConfigWithDefaults[section])
            );
        topOffset+=30;
        win.add(sectionTabbedBar);
    }else{
        data[c] = Ti.UI.createTableViewSection({
            headerTitle:section
        });
           
        for (var groupItem in allConfigWithDefaults[section]){
            data[c].add(Ti.UI.createTableViewRow({
                title:groupItem,
                hasCheck:allConfigWithDefaults[section][groupItem],
                tibar:{
                    section:section,
                    item:groupItem
                }
            }));
        }
            
        c++;
    }
}

var tableView = Titanium.UI.createTableView({
    data:data,
    style: Titanium.UI.iPhone.TableViewStyle.GROUPED,
    top:topOffset
});

tableView.addEventListener('click', function(e)
{
    var rowdata = e.rowData;
    rowdata.hasCheck = !rowdata.hasCheck;
    allConfigWithDefaults[rowdata.tibar.section][rowdata.tibar.item]=rowdata.hasCheck;
});
win.add(tableView);

var but = Titanium.UI.createButton({
    title:'Scan',
    backgroundColor: 'blue'
});
but.addEventListener('click', function(){
    var config = {};
    for(var section in allConfigWithDefaults){
        if (typeof allConfigWithDefaults[section] === 'object' && allConfigWithDefaults[section] instanceof Array){
            for(var itemix in allConfigWithDefaults[section])
            {
                for(var labelname in allConfigWithDefaults[section][itemix]){

                    if(allConfigWithDefaults[section][itemix][labelname]){
                        config[section]=labelname;
                    }
                }
            }
        }else{
            config[section]=allConfigWithDefaults[section];
        }
    }
    
    Ti.API.debug(JSON.stringify(config));
    TiBar.scan({
        configure: config,
        success:function(data){
            Ti.API.info('TiBar success callback!');
            if(data && data.barcode){
                Ti.UI.createAlertDialog({
                    title: "Scan result",
                    message: "Barcode: " + data.barcode + " Symbology:"+data.symbology
                }).show();
            }
        },
        cancel:function(){
            Ti.API.info('TiBar cancel callback!');
        },
        error:function(){
            Ti.API.info('TiBar error callback!');
        }
    });

});
win.rightNavButton = but;

tabGroup.addTab(tab);
tabGroup.open();