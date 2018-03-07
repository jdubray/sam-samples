


module.exports = function(google, model) {


     if (model.data.menuItem === 'contactus') {
                    
            var latlng = new google.maps.LatLng(model.data.contactus.lat, model.data.contactus.lng);
            var myOptions = {
                zoom: 10,
                center: latlng,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                scrollwheel: false
            };
            
            map = new google.maps.Map(document.getElementById("map-canvas"), myOptions);
            
            var marker = new google.maps.Marker({
                position: {lat:model.data.contactus.lat, lng:model.data.contactus.lng },
                map: map
            });
            marker.setMap(map);
            
            google.maps.event.trigger(map, 'resize');
            
        } else {
        
            let q = model.data.locations ;
            var locations = [
                [model.data.home.search.quoteTabs[0].fromCity, q.fromLocation.lat, q.fromLocation.lng, 4],
            ];


            var bounds = new google.maps.LatLngBounds();
            var infowindow = new google.maps.InfoWindow();

            var latlng = new google.maps.LatLng((q.fromLocation.lat+q.toLocation.lat)/2, (q.fromLocation.lng+q.toLocation.lng)/2);
            var myOptions = {
                zoom: 10,
                center: latlng,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                scrollwheel: false
            };

            
            map = new google.maps.Map(document.getElementById("map-canvas"), myOptions);


            var marker = new google.maps.Marker({
                position: q.fromLocation,
                map: map
            });
            
            marker.setMap(map);
            bounds.extend(marker.position);
            var tomarker = new google.maps.Marker({
                position: q.toLocation,
                map: map
            });
            tomarker.setMap(map);
            bounds.extend(tomarker.position);

            map.fitBounds(bounds);
            google.maps.event.trigger(map, 'resize');
        
        }

}