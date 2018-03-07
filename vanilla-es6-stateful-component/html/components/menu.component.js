// 


var menu = {

    acceptors: [
        
        function(model,data) {
             // change menu item
            if (data.menuItem) {
            
                model.data.menuItem = data.menuItem ;
                model.data.header.menu.map((item) => item.active = (item.href === data.menuItem)) ;
                model.update.p = true ;
                model.update.h = true ;
                model.update.f = true ;
                
            }
        }

    ],

    actions: [
        
        { 
            name: "setMenuItem",
            implementation: function(data, present, model) {
                data = data || { menuItem : "home" } ;
                data.__action = 'setMenuItem' ;
                if (model) { 
                    model.present(data) ;
                } else {
                    present(data) ;
                }
                return false ;
            }
        }
    ],

    reactors: []

}

export { menu }