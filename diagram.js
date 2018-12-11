(function init() {
  $(function () {
    var G = go.GraphObject.make;  // for conciseness in defining templates
    var diagram = G(go.Diagram, 'diagramSide', {allowDrop: true});  // must be true to accept drops from the Palette
    var $warehouseDraggableSide = $('#warehouseDraggableSide');
    var $areaDraggableSide = $('#areaDraggableSide');
    var $settingSide = $('#settingSide');
    var warehousePalettle = window.warehousePalette(G, diagram, [
      {key: 'w1', text: '仓库一'},
      {key: 'w2', text: '仓库二'},
      {key: 'w3', text: '仓库三'},
      {key: 'w4', text: '仓库四'}
    ]);
    var areaPalettle = window.areaPalette(G, diagram, [
      {key: 'a1', text: '区域一'},
      {key: 'a2', text: '区域二'},
      {key: 'a3', text: '区域三'},
      {key: 'a4', text: '区域四'}
    ]);

    // 主画布初始化
    window.initDiagram(G, diagram);

    // 切换仓库
    warehousePalettle.addDiagramListener('changedSelection', function (e) {
      var node = e.diagram.selection.first();

      if (node instanceof go.Node) {
        $areaDraggableSide.css({
          opacity: 1
        });
      } else {
        $areaDraggableSide.css({
          opacity: 0
        });
      }
    })

    // 仓库面板初始化
    $warehouseDraggableSide.draggable({handle: '#warehouseDraggableSideHandle'}).resizable({
      // After resizing, perform another layout to fit everything in the palette's viewport
      stop: function () {
        warehousePalettle.layoutDiagram(true);
      }
    });

    // 区域面板初始化
    $areaDraggableSide.draggable({handle: '#areaDraggableSideHandle'}).resizable({
      // After resizing, perform another layout to fit everything in the palette's viewport
      stop: function () {
        areaPalettle.layoutDiagram(true);
      }
    });

    // 配置面板初始化
    $settingSide.draggable({handle: '#settingSideHandle'});
  });
})()
