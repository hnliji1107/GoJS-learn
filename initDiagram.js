window.initDiagram = function (G, diagram) {
  var $settingSide = $('#settingSide');

  var nodeTemplateMap = G(go.Node, 'Vertical',
    {locationSpot: go.Spot.Left},
    new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
    G(go.Picture,
      {
        width: 30,
        height: 30,
        portId: '',
        fromLinkable: true,
        toLinkable: true,
        fromLinkableSelfNode: true,
        toLinkableSelfNode: true,
        fromLinkableDuplicates: true,
        toLinkableDuplicates: true,
        cursor: 'pointer',
        fromSpot: go.Spot.NotBottomSide,
        toSpot: go.Spot.NotBottomSide
      },
      new go.Binding('source', 'key', function (key) {
        var source = ''

        switch (key[0]) {
          case 'w':
            source = './assets/images/warehouse.png'
            break;
          case 'a':
            source = './assets/images/area.png'
          default:
            break;
        }

        return source;
      })
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

  // 为每个节点声明模版
  diagram.nodeTemplateMap.add('', nodeTemplateMap);

  // 为每个链接声明模版
  diagram.linkTemplate = G(go.Link,
    {
      routing: go.Link.AvoidsNodes,
      curve: go.Link.JumpOver,
      relinkableFrom: true,
      relinkableTo: true,
      reshapable: true,
      resegmentable: true,
      corner: 5
    },
    G(go.Shape, new go.Binding('stroke', 'color').makeTwoWay()),
    G(go.Shape, { toArrow: 'standard' },
      new go.Binding('fill', 'color').makeTwoWay(),
      new go.Binding('stroke', 'color').makeTwoWay()
    ),
    G(go.TextBlock, { margin: 3, editable: true, segmentIndex: 2, segmentFraction: 0.5 },
      new go.Binding('text', 'text').makeTwoWay()
    )
  );

  // 在主区域内有选中节点时显示属性面板
  diagram.addDiagramListener('changedSelection', function (e) {
    var node = e.diagram.selection.first();

    if (node instanceof go.Node || node instanceof go.Link) {
      $settingSide.show();
    } else {
      $settingSide.hide();
    }
  })

  // 操作可回溯
  diagram.model.undoManager.isEnabled = true;

  // 初始化位置
  diagram.initialContentAlignment = go.Spot.Center;

  // 初始化关系
  diagram.model = new go.GraphLinksModel([
    { key: 'w1', text: '仓库一', loc: '9 -66' },
    { key: 'w2', text: '仓库二', loc: '9 -200' },
    { key: 'a1', text: '区域一', loc: '-250 100' },
    { key: 'a2', text: '区域二', loc: '250 100' }
  ], [
    { from: 'w1', to: 'a1', text: '', color: 'black' },
    { from: 'w1', to: 'a2', text: '', color: 'black' },
    { from: 'w2', to: 'a1', text: '第一条连接线', color: 'black' },
    { from: 'w2', to: 'a2', text: '', color: 'black' }
  ]);


  // 属性面板初始化
  new Inspector('settingSideContainer', diagram, {
    properties: {
      // key would be automatically added for nodes, but we want to declare it read-only also:
      'key': {readOnly: true, show: false},
      'from': { show: false },
      'to': { show: false },
      // fill and stroke would be automatically added for nodes, but we want to declare it a color also:
      'color': {show: Inspector.showIfPresent, type: 'color'}
    }
  });
}
