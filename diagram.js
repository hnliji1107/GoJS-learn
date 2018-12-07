(function init() {
  $(function () {
    // Note that we do not use $ here as an alias for go.GraphObject.make because we are using $ for jQuery
    var G = go.GraphObject.make;  // for conciseness in defining templates
    var diagram = G(go.Diagram, 'diagramSide', {allowDrop: true});  // must be true to accept drops from the Palette
    var $draggableSide = $('#draggableSide');
    var $settingSide = $('#settingSide');

    // define several shared Brushes
    var fill1 = 'rgb(105,210,231)'
    var brush1 = 'rgb(65,180,181)';

    var fill2 = 'rgb(167,219,216)'
    var brush2 = 'rgb(127,179,176)';

    var fill3 = 'rgb(224,228,204)'
    var brush3 = 'rgb(184,188,164)';

    var fill4 = 'rgb(243,134,48)'
    var brush4 = 'rgb(203,84,08)';

    var getTemplateMap = function(direction) {
      return G(go.Node, direction || 'Vertical',
        {locationSpot: go.Spot.Left},
        new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
        G(go.Picture, './assets/images/warehouse.png',
          {width: 30, height: 30},
          new go.Binding('figure', 'figure'),
          new go.Binding('fill', 'fill'),
          new go.Binding('stroke', 'stroke')
        ),
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
          new go.Binding('text', 'text').makeTwoWay()
        )
      )
    }

    // 为每个节点声明模版
    diagram.nodeTemplateMap.add('', getTemplateMap('Vertical'));

    // 在主区域内有选中节点时显示属性面板
    diagram.addDiagramListener('changedSelection', function (e) {
      var node = e.diagram.selection.first();

      if (node instanceof go.Node) {
        $settingSide.show();
      } else {
        $settingSide.hide();
      }
    })

    // 操作可回溯
    diagram.model.undoManager.isEnabled = true;

    // initialize the Palette that is in a floating, draggable HTML container
    var palette = G(go.Palette, 'paletteContainer');  // must name or refer to the DIV HTML element

    palette.nodeTemplateMap.add('', getTemplateMap('Horizontal'));
    palette.model = new go.GraphLinksModel([
      {text: 'Lake', fill: fill1, stroke: brush1, figure: 'Hexagon'},
      {text: 'Ocean', fill: fill2, stroke: brush2, figure: 'Rectangle'},
      {text: 'Sand', fill: fill3, stroke: brush3, figure: 'Diamond'},
      {text: 'Goldfish', fill: fill4, stroke: brush4, figure: 'Octagon'}
    ]);

    palette.addDiagramListener('InitialLayoutCompleted', function (diagramEvent) {
      var palette = diagramEvent.diagram;
      var paletteBounds = palette.documentBounds;

      $draggableSide.css({
        width: paletteBounds.width + 28 + 'px',
        height: paletteBounds.height + 38 + 'px'
      })
    });

    new Inspector('settingSideContainer', diagram, {
      properties: {
        // key would be automatically added for nodes, but we want to declare it read-only also:
        'key': {readOnly: true, show: Inspector.showIfPresent},
        // fill and stroke would be automatically added for nodes, but we want to declare it a color also:
        'fill': {show: Inspector.showIfPresent, type: 'color'},
        'stroke': {show: Inspector.showIfPresent, type: 'color'}
      }
    });

    // jQuery拖拽操作
    $draggableSide.draggable({handle: '#draggableSideHandle'}).resizable({
      // After resizing, perform another layout to fit everything in the palette's viewport
      stop: function () {
        palette.layoutDiagram(true);
      }
    });

    $settingSide.draggable({ handle: '#settingSideHandle' });
  });
})()
