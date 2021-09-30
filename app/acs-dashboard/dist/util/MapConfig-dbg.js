sap.ui.define([], 
    function() {
        'use strict';
        return Object.freeze ({            
            "MapProvider": [
                        {
                            "name": "HEREMAPS",
                            "tileX": "512",
                            "tileY": "512",
                            "minLOD": "1",
                            "maxLOD": "20",
                            "copyright": "",
                            "Source": [
                                {
                                    "id": "s1",
                                    "url": "https://2.base.maps.ls.hereapi.com/maptile/2.1/maptile/newest/normal.day/{LOD}/{X}/{Y}/256/png8?apiKey=21cjM2ujVKnyuiEXVoMEVoJ9bknopL0Kt0kTmSBjHhA&pview=IND"
                                }
                            ]
                        }
                    ],
                    "MapLayerStacks": [
                        {
                            "name": "Default",
                            "MapLayer": [
                                {
                                    "name": "Default",
                                    "refMapProvider": "HEREMAPS",
                                    "opacity": "1.0"
                                }
                            ],
                            "colBkgnd": "rgb(0,0,0)"
                        }
                    ]

        });   
});