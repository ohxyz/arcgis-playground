require( [
    "esri/tasks/Locator",
    "esri/Map",
    "esri/views/SceneView",
    "esri/layers/TileLayer"

], function ( Locator, Map, SceneView, TileLayer ) {

    var transportationLayer = new TileLayer( {

        url: "https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer",
        id: "streets",
        opacity: 0.7
    } );

    var housingLayer = new TileLayer( {

        url: "https://tiles.arcgis.com/tiles/nGt4QxSblgDfeJn9/arcgis/rest/services/New_York_Housing_Density/MapServer",
        id: "ny-housing"
    } );

    var map = new Map( {

          basemap: "oceans",
          layers: [ housingLayer, transportationLayer ] 

    } );

    var view = new SceneView( {

        container: "map",
        map: map,
        zoom: 15,
        center: [ -74, 70 ]
    } );

    var streetsLayerToggle = document.getElementById( "streetsLayer" );

    streetsLayerToggle.addEventListener( "change" , function () {

        transportationLayer.visible = streetsLayerToggle.checked;
    } );

    view.on( "layerview-create", function( event ) {

        if ( event.layer.id === "ny-housing" ) {

            console.log("LayerView for New York housing density created!", event.layerView);
        }

        if ( event.layer.id === "streets" ) {

            console.log("LayerView for streets created!", event.layerView);
        }
    } );

    housingLayer.when( function() {
        
        view.goTo( housingLayer.fullExtent );
    } );


    view.popup.autoOpenEnabled = false;

    view.on( "click", function( event ) {

        var lat = Math.round( event.mapPoint.latitude * 1000 ) / 1000;
        var lon = Math.round( event.mapPoint.longitude * 1000 ) / 1000;

        view.popup.open( {

            title: "Reverse geocode: [" + lon + ", " + lat + "]",
            location: event.mapPoint // Set the location of the popup to the clicked location
        } );
    });

    locatorTask.locationToAddress( event.mapPoint ).then( function ( response ) {
    
        view.popup.content = response.address;

    } ).catch( function ( error ) {

        view.popup.content = "No address was found for this location";
    });

} );