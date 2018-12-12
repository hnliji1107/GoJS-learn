window.warehousePalette = function (G, diagram, nodeData) {
  // initialize the Palette that is in a floating, draggable HTML container
  var palette = G(go.Palette, 'warehousePaletteContainer');  // must name or refer to the DIV HTML element
  var $warehouseDraggableSide = $('#warehouseDraggableSide');

  var nodeTemplateMap = G(go.Node, 'Horizontal',
    {locationSpot: go.Spot.Left},
    new go.Binding('location', 'loc', go.Point.parse),
    G(go.Picture, './assets/images/warehouse.png', {width: 30, height: 30}),
    G(go.TextBlock,
      {
        margin: 5,
        maxSize: new go.Size(200, NaN),
        wrap: go.TextBlock.WrapFit,
        textAlign: 'center',
        editable: true,
        font: 'bold 9pt Helvetica, Arial, sans-serif',
        name: 'TEXT'
      },
      new go.Binding('text', 'text')
    )
  )

  palette.nodeTemplateMap.add('', nodeTemplateMap);
  palette.model = new go.GraphLinksModel(nodeData);

  palette.addDiagramListener('InitialLayoutCompleted', function (diagramEvent) {
    var paletteDigram = diagramEvent.diagram;
    var paletteDigramBounds = paletteDigram.documentBounds;

    $warehouseDraggableSide.css({
      width: paletteDigramBounds.width + 28 + 'px',
      height: paletteDigramBounds.height + 38 + 'px'
    })
  });

  return palette
}
