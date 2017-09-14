// 


let menu = {

    actions: [],

    acceptors: [
        
        { 
            name: "addItem",
            order: 0,
            update:function(model,data) {
             // change menu item
                if (data.menuItem) {
                
                    model.data.menuItem = data.menuItem ;
                    model.data.header.menu.map((item) => item.active = (item.href === data.menuItem)) ;
                    model.update.p = true ;
                    model.update.h = true ;
                    model.update.f = true ;
                    
                }
            }
        }

    ],

    reactors: []

}

export { menu }