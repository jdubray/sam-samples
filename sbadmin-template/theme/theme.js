///////////////////////////////////////////////////////////////////////////////
// This code was created in part from the SB Admin Template
// which can be downloaded here: http://startbootstrap.com/template-overviews/sb-admin/
//
// SB Admin is a free to download Bootstrap admin template. 
// This template uses the defaul Bootstrap 3 styles along with a variety 
// of powerful jQuery plugins to create a pwerful framework for creating 
// admin panels, web apps, or back-end dashboards.
//



'use strict';

var util = require('./util'),
    labels = require('./labels').en ;

var cssPath = 'css/' ;
var jsPath = 'js/' ;

var adminConsole = {} ;
adminConsole.logo = 'http://gliiph.com/html/images/logo-2.png' ;

adminConsole.html = function ( children ) {
    return ('<html lang="en">'+children+'</html>') ;
} ;

adminConsole.body = function ( children ) {
    return ('<body>'+children+'</body>') ;
} ;

adminConsole.plugins = {
    bootstrap:    '<link href="'+cssPath+'bootstrap.min.css" rel="stylesheet">\n',

    metis:        '<link href="'+cssPath+'metisMenu.min.css" rel="stylesheet">\n',

    timeline:     '<link href="'+cssPath+'timeline.css" rel="stylesheet">\n',

    tables:       '<link href="'+cssPath+'dataTables.bootstrap.css" rel="stylesheet">\n',

    responsive:   '<link href="'+cssPath+'dataTables.responsive.css" rel="stylesheet">\n',

    sb:           '<link href="'+cssPath+'sb-admin-2.css" rel="stylesheet">\n',

    fa:           '<link href="'+cssPath+'font-awesome.min.css" rel="stylesheet" type="text/css">\n',

    morris:       '<link href="'+cssPath+'morris.css" rel="stylesheet">\n',

    jquery:       '<script src="'+jsPath+'jquery.min.js"></script>\n',

    bootstrapjs:  '<script src="'+jsPath+'bootstrap.min.js"></script>\n',

    metisjs:      '<script src="'+jsPath+'metisMenu.min.js"></script>\n',

    morrisjs:    '<script src="'+jsPath+'raphael-min.js"></script>\n\
                  <script src="'+jsPath+'morris.min.js"></script>\n',

    sbjs:        '<script src="'+jsPath+'sb-admin-2.js"></script>\n',

    tablesjs:    '<script src="'+jsPath+'jquery.dataTables.min.js"></script>\n\
                  <script src="'+jsPath+'dataTables.bootstrap.min.js"></script>\n',

    editablejs:  '<script src="'+jsPath+'mindmup-editabletable.js"></script>\n\
                  <script src="'+jsPath+'numeric-input-example.js"></script>\n',

    googlejsapi: '<script type="text/javascript" src="https://www.google.com/jsapi"></script>\n',

    uvcharts:    '<script type="text/javascript" src="http://cdnjs.cloudflare.com/ajax/libs/d3/3.2.2/d3.v3.min.js"></script>\n'
} ;

adminConsole.head = function(title, includes, addons ) {
    title = title || labels.title ;
    addons = addons || [] ;
    includes = includes || ['bootstrap', 'metis', 'timeline', 'tables', 'responsive', 'sb', 'fa', 'morris', 'jquery', 'editablejs'] ;
    var output = '<head>\n\
    \n\
    <meta charset="utf-8">\n\
    <meta http-equiv="X-UA-Compatible" content="IE=edge">\n\
    <meta name="viewport" content="width=device-width, initial-scale=1">\n\
    <meta name="description" content="">\n\
    <meta name="author" content="">\n\
    \n\
    <title>'+title+'</title>\n\
    \n' ;
    for (var k = 0 ; k < includes.length ; k++ ) {
        output += this.plugins[includes[k]] ;
    }

    for (var j = 0 ; j < addons.length ; j++ ) {
        output += this.addons[j] ;
    }

    output +='<!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->\n\
    <!-- WARNING: Respond.js doesn\'t work if you view the page via file: -->\n\
    <!--[if lt IE 9]>\n\
        <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>\n\
        <script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>\n\
    <![endif]-->\n\
    \n\
</head>\n' ;
    return output ;
} ;

adminConsole.navBarColor = 'default' ;

adminConsole.navBar = function(dropDowns,sideBar) {
    dropDowns = dropDowns || [] ;
    var dd = '' ;
    for (var k = 0 ; k < dropDowns.length ; k++) {
        dd += dropDowns[k] ;
    }
    return  (
              '<nav class="navbar navbar-'+adminConsole.navBarColor+' navbar-static-top" role="navigation" style="margin-bottom: 0">\n\
                  <div class="navbar-header">\n\
                      <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">\n\
                          <span class="sr-only">Toggle navigation</span>\n\
                          <span class="icon-bar"></span>\n\
                          <span class="icon-bar"></span>\n\
                          <span class="icon-bar"></span>\n\
                      </button>\n\
                      <img src="'+adminConsole.logo+'"/>\
                  </div>\n\
                  <!-- /.navbar-header -->\n\
                   \n\
                  <ul class="nav navbar-top-links navbar-right">\n'
                  + dd
                  + util.endtag('ul')
                  + sideBar
                  + util.endtag('nav')) ; // end navBar
} ;

adminConsole.adminDropDown = function(ddurls) {
    ddurls = ddurls || [] ;
    return (
        '<li class="dropdown">\n\
            <a class="dropdown-toggle" data-toggle="dropdown" href="#">\n\
                <i class="fa fa-user fa-fw"></i>  <i class="fa fa-caret-down"></i>\n\
            </a>\n\
            <ul class="dropdown-menu dropdown-user">\n\
                '+ ddurls.forEach( function(item) {
                    return ('\n\
                        <li><a href="'+item.url+'"><i class="fa fa-user fa-fw"></i> '+item.label+'</a></li>\n') ;
                }) + '\n\
            </ul>\n\
        </li>') ;
}

adminConsole.search = function(search) {
    search = search || labels.search ;
    return (
        '<li class="sidebar-search">\n\
             <div class="input-group custom-search-form">\n\
                 <input type="text" class="form-control" placeholder="'+search+'">\n\
                 <span class="input-group-btn">\n\
                 <button class="btn btn-default" type="button">\n\
                     <i class="fa fa-search"></i>\n\
                 </button>\n\
             </span>\n\
             </div>\n\
         </li>\n') ;
} ;

adminConsole.levels = ['second','third','fourth'] ;

adminConsole.menuItem = function(label,symbol, url, submenu, level) {
    level = level || 1 ;
    symbol = '<i class="fa fa-'+symbol+' fa-fw"></i>' || '' ;

    var sub = '' ;
    if (submenu !== undefined) {
        level += 1 ;
        sub = '<ul class="nav nav-'+adminConsole.levels[level]+'-level">\n' ;
        for (var m = 0 ; m < submenu.length ; m ++) {
            var l = submenu[m].label ;
            var u = submenu[m].url ;
            var s = submenu[m].symbol ;
            var mm = submenu[m].menu ;
            sub += adminConsole.menuItem(l,s,u,mm,level) ;
        }
        sub += '</ul>\n'  ;
    }

    return (
        '<li>\n\
            <a href="'+url+'">'+symbol+' '+label+'</a>\n'
            + sub +
        '</li>'
        ) ;
} ;

adminConsole.sideBar =  function(menu,color) {
    color = color || adminConsole.navBarColor ;
    return (
'<div class="navbar-'+color+' sidebar" role="navigation">\n\
         <div class="sidebar-nav navbar-collapse">\n\
             <ul class="nav" id="side-menu">\n'
                 + menu +
                '</ul>\n\
         </div>\n\
     </div>\n') ;
} ;

adminConsole.footer = function(includes) {
     includes = includes || ['bootstrapjs', 'metisjs', 'sbjs'] ;
     var output = '' ;

     for (var k = 0 ; k < includes.length ; k++ ) {
         output += this.plugins[includes[k]] ;
     }

     return output ;
} ;

adminConsole.container = function( children ) {
    children = children || '' ;
    return ('<div id="wrapper">\n'+children+'</div>') ;
}

adminConsole.page = function( children ) {
    children = children || '' ;
    return ('<div id="page-wrapper">\n'+children+'</div>') ;
}

adminConsole.row = function( children ) {
    children = children || '' ;
    return ('<div class="row">\n'+children+'</div>') ;
} ;

adminConsole.fieldSet = function( children ) {
    children = children || '' ;
    return ('<fieldset>\n'+children+'</fieldset>') ;
} ;


adminConsole.titleRow = function(title, bookmark) {
    title = title || '' ;
    bookmark = '<a href="#'+bookmark+'"></a>' || '' ;
    return ('<div class="row">\n\
                 <div class="col-lg-12">\n' + bookmark + '\
                     <h1 class="page-header">'+title+'</h1>\n\
                 </div>\n\
                 <!-- /.col-lg-12 -->\n\
             </div>\n') ;
} ;

adminConsole.anchor = function(anchor, html) {
    html = html || '' ;
    return '<div id="'+anchor+'">'+html+'</div>\n' ;
} ;

adminConsole.p = function(html) {
    html = html || '' ;
    return '<p>'+html+'</p>\n' ;
} ;

adminConsole.b = function(html) {
    html = html || '' ;
    return '<b>'+html+'</b>\n' ;
} ;

adminConsole.div = function(id, width, height, html) {
    html = html || '' ;
    width= width || '100%' ;
    height= height || '100%' ;
    return '<div id="'+id+'" style="width: '+width+'; height: '+height+';">'+html+'</div>\n' ;
} ;

adminConsole.well = function(size,h,title,body,br) {
    br = br || '' ;
    size = size || 12 ;
    h = h || 2 ;
    title = title || '' ;
    body = body || '' ;
    br = br || '' ;
    return ('<div class="col-lg-'+size+'">\n\
        <div class="well">\n\
            <h'+h+'>'+title+'</h'+h+'>\n\
            <p>'+body+'</p>' + br +
       '</div>\n\
    </div>') ;
} ;

adminConsole.fa = function(fa,size) {
    fa = fa || 'globe' ;
    size = size || '5' ;
    return ('<i class="fa fa-'+fa+' fa-'+size.toString()+'x"></i>') ;
} ;

adminConsole.panel = function(width,heading,children,color) {
    color = color || 'default' ;
    if (heading !== undefined) {
        heading = '<div class="panel-heading">\n\
                       '+heading+
                   '</div>\n'
    }
    return ('<div class="col-lg-'+width+'">\n\
             <div class="panel panel-'+color+'">\n'
                 + heading +
                 '<div class="panel-body">\n'
                 + children +
                 '</div>\n\
            </div>\n\
            </div>'
        ) ;
}

adminConsole.statSummary = function(fa,label,number,link,linkLabel,color) {
        return (
    '<div class="col-lg-3 col-md-6">\n\
        <div class="panel panel-'+color+'">\n\
            <div class="panel-heading">\n\
                <div class="row">\n\
                    <div class="col-xs-3">\n\
                        <i class="fa fa-'+fa+' fa-5x"></i>\n\
                    </div>\n\
                    <div class="col-xs-9 text-right">\n\
                        <div class="huge">'+number+'</div>\n\
                        <div>'+label+'</div>\n\
                    </div>\n\
                </div>\n\
            </div>\n\
            <a href="'+link+'">\n\
            <div class="panel-footer">\n\
                <span class="pull-left">'+linkLabel+'</span>\n\
                <span class="pull-right"><i class="fa fa-arrow-circle-right"></i></span>\n\
                <div class="clearfix"></div>\n\
            </div>\n\
            </a>\n\
        </div>\n\
    </div>') ;
} ;

adminConsole.labeledInput = function(name,label,type,placeHolder,value) {
    type = type || name ;
    var hasLabel = (label !== null) ;
    if (hasLabel) { label = '<label for="'+name+'">'+label+'</label>\n' ; }

    if (placeHolder) {
        placeHolder = ' placeHolder="'+placeHolder+'"' ;
    } else {
        placeHolder = '' ;
    }
    if (value) {
        value = ' value="'+value +'"';
    } else {
        value = '' ;
    }
    return ('<div class="form-group">\n' +
                label +
                '<input id="'+name+'" type="'+type+'" class="form-control" name="'+name+'" '+placeHolder+value+'>\n\
            </div>') ;
} ;

adminConsole.submitButton = function(name,color) {
    color = color || 'primary' ;
    return ('<button type="submit" class="btn btn-'+color+'">'+name+'</button>') ;
}

adminConsole.checkboxArrayInput = function(header,names, labels, values, stringValues ) {
    stringValues = stringValues || [] ;
    var checkboxes = '' ;
    if (names.length < 1) { return '' ; }
    for (var k = 0 ; k < names.length ; k++ ) {
        var checked = '' ;
        var value = '' ;
        if (values[k]) { checked = ' checked' ; }
        if (stringValues.length>0) {
            value = stringValues[k] ;
        }
        checkboxes += '<div class="checkbox">\n\
                <label>\n\
                    <input id="'+names[k]+'" type="checkbox" name="'+names[k]+'" value="'+value+'"' +checked+'>'+labels[k]+'\n\
                </label>\n\
            </div>' ;

    }
    return (
        '<div class="form-group">\n\
            <label>'+header+'</label>\n'
            + checkboxes +
        '</div>'
        ) ;
} ;

adminConsole.simplePanel = function(children, head, color) {
    color = color || 'default' ;
    if (head !== undefined) {
        head = '<div class="panel-heading">'+head+'</div>' ;
    } else {
        head = '' ;
    }
    return ('<div class="panel panel-'+color+'">'+head+'<div class="panel-body">'+children+'</div></div>') ;
} ;

adminConsole.advancedTable = function(size,id,color,heading,headers,columns,data,href,domain) {
    href = href || false ;
    domain = domain || '/' ;
    var tableHeaders = '<tr>\n' ;
    for (var k = 0 ; k < headers.length ; k++) {
        tableHeaders += '<th>'+headers[k]+'</th>\n';
    }
    tableHeaders += '</tr>\n' ;
    var rows = '' ;

    for (var r = 0 ; r < data.length ; r++) {
        rows += '<tr>\n' ;
        for (k = 0 ; k < columns.length ; k++) {
            var l = data[r][columns[k]] ;
            if (href) {
                if (l.toString().indexOf('http')>-1) {
                    rows += '<td><a href="'+data[r][columns[k]]+'">'+data[r][columns[k]]+'</a></td>\n';
                } else {
                    rows += '<td><a href="'+domain+data[r][columns[k]]+'">'+data[r][columns[k]]+'</a></td>\n';
                }
            } else {
                rows += '<td>'+data[r][columns[k]]+'</td>\n';
            }
        }
        rows += '</tr>\n' ;
    }
    return (
    '<div class="col-lg-'+size+'">\n\
     <div class="panel panel-'+color+'">\n\
         <div class="panel-heading">'+heading+'</div>\n\
         <!-- /.panel-heading -->\n\
         <div class="panel-body">\n\
             <div class="dataTable_wrapper">\n\
                 <table class="table table-striped table-bordered table-hover"\n\
                     id="dataTables-'+id+'">\n\
                     <thead>\n'
                          + tableHeaders +
                         //'</tr>\n\
                     '</thead>\n\
                     <tbody>\n' +
                        rows +
                    '</tbody>\n\
                  </table>\n\
             </div>\n\
        </div>\n\
        </div>\n\
        </div>\n' ) ;
} ;

adminConsole.editTable = function(id,headers,data,editable, style, maxSize) {

    style = style || 'striped' ;
    maxSize = maxSize || 10 ;
    id = id || 'table-'+headers[0] ;

    var output = '\n\n<table id="'+id+'" class="table table-'+style+'">\n' ;
    headers = headers || [] ;
    data = data || [] ;
    if (headers.length>0) {
        output += "<tr>\n" ;
        for (var k = 0 ; k < headers.length ; k++) {
            output+= "<th>"+headers[k]+"</th>\n" ;
        }
        output += "</tr>\n" ;
    }
    if (data.length>0) {

        for (var r = 0 ; r < data.length ; r++) {
            var row = data[r] ;
            var rowKeys = Object.keys(row) ;
            output += "<tr>\n" ;
            if (rowKeys.length>0) {
                for( var c = 0 ; c < rowKeys.length; c++) {
                    output+= "<td>"+data[r][rowKeys[c]]+"</td>\n" ;
                }
            }
            output += "</tr>\n" ;
        }
        if (editable>0) {
            // add another to add data
            var rown = data[0] ;
            var rowKeysn = Object.keys(rown) ;
            for (var i = 0 ; i < (maxSize-data.length) ; i++)
            {
                output += "<tr>\n" ;
                if (rowKeysn.length>0) {
                    for( var lr = 0 ; lr< rowKeysn.length; lr++) {
                        output+= "<td>&nbsp;</td>\n" ;
                    }
                }
                output += '</tr>\n' ;
            }
        }

    }
    output += '</table>\n' ;
    output += '<script>\n\
                 $(\'#'+id+'\').editableTableWidget();\n' +
                 '$(\'#'+id+'\').editableTableWidget({editor: $(\'<textarea>\')});\n\
                 window.prettyPrint && prettyPrint();\n\
               </script>\n'
    return output ;
}



module.exports = adminConsole ;
