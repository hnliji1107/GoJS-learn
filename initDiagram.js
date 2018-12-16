window.initDiagram = function (G, diagram) {
  var $settingSide = $('#settingSide');

  var initSettingPane = function() {
    // 属性面板初始化
    new Inspector('settingSideContainer', diagram, {
      properties: {
        'key': { show: false },
        'from': { show: false },
        'to': { show: false },
        'text': { show: Inspector.showIfNode, alias: '文案' },
        'location': { show: Inspector.showIfNode, alias: '位置' },
        'linkColor': { show: Inspector.showIfLink, type: 'color', alias: '线条颜色' },
        'linkShape': {
          show: Inspector.showIfLink,
          type: 'select',
          choices: ['无', 'Rectangle', 'Square', 'RoundedRectangle', 'Border', 'Circle', 'TriangleRight', 'TriangleDown', 'TenPointedStar'],
          alias: '标注形状',
          defaultValue: '无'
        },
        'linkLabel': { show: Inspector.showIfLink, alias: '标注内容' },
        'linkLabelBackground': { show: Inspector.showIfLink, type: 'color', alias: '标注背景色' },
        'linkLabelBorderColor': { show: Inspector.showIfLink, type: 'color', alias: '标注边框色' },
        'linkLabelColor': { show: Inspector.showIfLink, type: 'color', alias: '标注字体色' }
      }
    });
  }

  var defaultNodeTemplate = G(go.Node, 'Vertical', {
      locationSpot: go.Spot.Left
    },
    new go.Binding('location', 'location', go.Point.parse),
    G(go.Picture, {
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
            source = './assets/images/warehouse.png';
            break;
          case 'a':
            source = './assets/images/area.png';
          default:
            break;
        }

        return source;
      })
    ),
    G(go.TextBlock, {
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
  );

  var defaultLinkTemplate = G(go.Link, {
      routing: go.Link.AvoidsNodes,
      curve: go.Link.JumpOver,
      relinkableFrom: true,
      relinkableTo: true,
      reshapable: true,
      resegmentable: true,
      corner: 5
    },
    G(go.Shape, new go.Binding('stroke', 'linkColor')),
    G(go.Shape, { toArrow: 'standard' },
      new go.Binding('fill', 'linkColor'),
      new go.Binding('stroke', 'linkColor')
    ),
    G(go.Panel, 'Auto', // this whole Panel is a link label
      G(go.Shape, { visible: false },
        new go.Binding('visible', 'linkShape', function (val) { return val !== '无' }),
        new go.Binding('figure', 'linkShape'),
        new go.Binding('fill', 'linkLabelBackground'),
        new go.Binding('stroke', 'linkLabelBorderColor')
      ),
      G(go.TextBlock, { margin: 3, editable: true },
        new go.Binding('text', 'linkLabel'),
        new go.Binding('stroke', 'linkLabelColor')
      )
    )
  );

  // 为每个节点声明模版
  diagram.nodeTemplateMap.add('', defaultNodeTemplate);

  // 为每个链接声明模版
  diagram.linkTemplateMap.add('', defaultLinkTemplate);

  // 在主区域内有选中节点时显示属性面板
  diagram.addDiagramListener('changedSelection', function (e) {
    var node = e.diagram.selection.first();

    if (node instanceof go.Node || node instanceof go.Link) {
      $settingSide.show();
    } else {
      $settingSide.hide();
    }

    // 选中事件触发时，重新初始化配置面板
    initSettingPane();
  })

  // 操作可回溯
  diagram.model.undoManager.isEnabled = true;

  // 初始化位置
  diagram.initialContentAlignment = go.Spot.Center;

  // 初始化关系
  diagram.model = new go.GraphLinksModel([
    { key: 'w1', text: '仓库一', location: '9 -66' },
    { key: 'w2', text: '仓库二', location: '9 -200' },
    { key: 'a1', text: '区域一', location: '-250 100' },
    { key: 'a2', text: '区域二', location: '250 100' }
  ], [
    { from: 'w1', to: 'a1' },
    { from: 'w1', to: 'a2' },
    { from: 'w2', to: 'a1', linkLabel: '第一条连接线' },
    { from: 'w2', to: 'a2' }
  ]);

  // 初始化配置面板
  initSettingPane();
}
